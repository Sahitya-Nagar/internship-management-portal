import { query } from "../utils/db.js";

export const createJob = async (req, res) => {
  const {
    organization,
    contact_name,
    contact_email,
    contact_phone,
    title,
    discipline,
    city,
    province,
    compensation,
    start_date,
    majors_eligible,
    description,
    apply_method,
    apply_url,
  } = req.body;

  if (
    !contact_name ||
    !contact_email ||
    !contact_phone ||
    !title ||
    !discipline ||
    !city ||
    !province ||
    !compensation ||
    !start_date ||
    !description ||
    !apply_method
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required job fields",
    });
  }

  try {
    const employerId = req.user.id;
    // Default organization name to user's registered organization if not provided
    const finalOrganization = organization || req.user.organization || "Independent Employer";

    const { rows } = await query(
      `INSERT INTO jobs (
        employer_id, organization, contact_name, contact_email, contact_phone,
        title, discipline, city, province, compensation, start_date,
        majors_eligible, description, apply_method, apply_url, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'pending')
      RETURNING *`,
      [
        employerId,
        finalOrganization,
        contact_name,
        contact_email,
        contact_phone,
        title,
        discipline,
        city,
        province,
        compensation,
        start_date,
        majors_eligible,
        description,
        apply_method,
        apply_url,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Job listing submitted for review successfully",
      job: rows[0],
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating job listing",
    });
  }
};

export const getPublishedJobs = async (req, res) => {
  const { discipline, province, compensation, search } = req.query;

  try {
    let sql = "SELECT * FROM jobs WHERE status = 'published'";
    const params = [];
    let paramIndex = 1;

    if (discipline) {
      sql += ` AND discipline = $${paramIndex}`;
      params.push(discipline);
      paramIndex++;
    }

    if (province) {
      sql += ` AND province = $${paramIndex}`;
      params.push(province);
      paramIndex++;
    }

    if (compensation) {
      sql += ` AND compensation = $${paramIndex}`;
      params.push(compensation);
      paramIndex++;
    }

    if (search) {
      sql += ` AND (title ILIKE $${paramIndex} OR organization ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += " ORDER BY published_at DESC, created_at DESC";

    const { rows } = await query(sql, params);
    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching published jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching job board",
    });
  }
};

export const getPendingJobs = async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM jobs WHERE status = 'pending' ORDER BY created_at DESC"
    );
    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching pending jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching pending review jobs",
    });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { rows } = await query(
      `SELECT j.*, COUNT(a.id)::int as applicant_count
       FROM jobs j
       LEFT JOIN applications a ON j.id = a.job_id
       WHERE j.employer_id = $1
       GROUP BY j.id
       ORDER BY j.created_at DESC`,
      [employerId]
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching employer jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching your job listings",
    });
  }
};

export const publishJob = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await query(
      `UPDATE jobs
       SET status = 'published', published_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job listing not found",
      });
    }

    return res.json({
      success: true,
      message: "Job listing published successfully",
      job: rows[0],
    });
  } catch (error) {
    console.error("Error publishing job:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while publishing job listing",
    });
  }
};

export const declineJob = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await query(
      `UPDATE jobs
       SET status = 'declined'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job listing not found",
      });
    }

    return res.json({
      success: true,
      message: "Job listing declined",
      job: rows[0],
    });
  } catch (error) {
    console.error("Error declining job:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while declining job listing",
    });
  }
};
