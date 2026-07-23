import { query } from "../utils/db.js";

export const applyJob = async (req, res) => {
  const { job_id } = req.body;
  
  if (!job_id) {
    return res.status(400).json({
      success: false,
      message: "Job ID is required to apply",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload your resume (PDF, DOC, or DOCX)",
    });
  }

  try {
    const studentId = req.user.id;
    // Store only the filename, not the full path
    const resumePath = req.file.filename;

    // Check if the student has already applied to this job
    const { rows: existingApps } = await query(
      "SELECT id FROM applications WHERE job_id = $1 AND student_id = $2",
      [job_id, studentId]
    );

    if (existingApps.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job listing",
      });
    }

    const { rows } = await query(
      `INSERT INTO applications (job_id, student_id, resume_path, status)
       VALUES ($1, $2, $3, 'submitted')
       RETURNING *`,
      [job_id, studentId, resumePath]
    );

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: rows[0],
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during application submission",
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { rows } = await query(
      `SELECT a.*, j.title, j.organization, j.city, j.province, j.discipline, j.compensation, j.apply_method
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.student_id = $1
       ORDER BY a.applied_at DESC`,
      [studentId]
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching student applications:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching applications",
    });
  }
};

export const getJobApplications = async (req, res) => {
  const { jobId } = req.params;

  try {
    // Verify employer owns the job (unless it's an admin)
    if (req.user.role !== "admin") {
      const { rows: jobOwner } = await query(
        "SELECT employer_id FROM jobs WHERE id = $1",
        [jobId]
      );

      if (jobOwner.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Job listing not found",
        });
      }

      if (jobOwner[0].employer_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view applications for this listing",
        });
      }
    }

    const { rows } = await query(
      `SELECT a.*, u.name as student_name, u.email as student_email, u.major as student_major
       FROM applications a
       JOIN users u ON a.student_id = u.id
       WHERE a.job_id = $1
       ORDER BY a.applied_at DESC`,
      [jobId]
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching job applicants",
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required",
    });
  }

  const validStatuses = ["submitted", "under_review", "accepted", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid application status",
    });
  }

  try {
    // Get application and job details first
    const { rows: appDetails } = await query(
      `SELECT a.*, j.employer_id, j.organization, j.discipline, j.city, j.province, j.compensation, u.major
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON a.student_id = u.id
       WHERE a.id = $1`,
      [id]
    );

    if (appDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const application = appDetails[0];

    // Verify authorized user (employer or admin)
    if (req.user.role !== "admin" && req.user.role !== "supervisor" && application.employer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this application status",
      });
    }

    // Update status
    const { rows: updatedApp } = await query(
      `UPDATE applications
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    // If accepted, create placement record
    if (status === "accepted") {
      const { rows: existingPlacements } = await query(
        "SELECT id FROM placements WHERE student_id = $1 AND job_id = $2",
        [application.student_id, application.job_id]
      );

      if (existingPlacements.length === 0) {
        // Calculate semester based on current month
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = date.getMonth(); // 0-indexed: 5 is June
        let semester = "F-" + year.slice(-2); // Fall default
        if (month >= 0 && month <= 4) semester = "W-" + year.slice(-2); // Winter Jan-May
        else if (month >= 5 && month <= 7) semester = "S-" + year.slice(-2); // Summer Jun-Aug

        await query(
          `INSERT INTO placements (
            student_id, job_id, employer_name, discipline, city, province,
            compensation, major, semester, academic_year
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            application.student_id,
            application.job_id,
            application.organization,
            application.discipline,
            application.city,
            application.province,
            application.compensation,
            application.major || "Kinesiology - General",
            semester,
            year,
          ]
        );
      }
    }

    return res.json({
      success: true,
      message: `Application status updated to ${status} successfully`,
      application: updatedApp[0],
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating application status",
    });
  }
};

export const downloadResume = async (req, res) => {
  const { id } = req.params; // application ID

  try {
    // Get application details
    const { rows: applications } = await query(
      `SELECT a.*, j.employer_id
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = $1`,
      [id]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const application = applications[0];

    // Authorization: only employer who owns the job, student who applied, or admin can download
    const isEmployer = req.user.role === "employer" && application.employer_id === req.user.id;
    const isStudent = req.user.role === "student" && application.student_id === req.user.id;
    const isAdmin = req.user.role === "admin" || req.user.role === "supervisor";

    if (!isEmployer && !isStudent && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to download this resume",
      });
    }

    // Send file
    const path = await import('path');
    const filePath = path.resolve('uploads', application.resume_path);
    
    return res.download(filePath, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        return res.status(404).json({
          success: false,
          message: "Resume file not found",
        });
      }
    });
  } catch (error) {
    console.error("Error downloading resume:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while downloading resume",
    });
  }
};
