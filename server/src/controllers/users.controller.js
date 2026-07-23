import { query } from "../utils/db.js";
import xlsx from "xlsx";
import fs from "fs";

export const getEmployers = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT employer_name, city, COUNT(*)::int as placement_count
       FROM placements
       GROUP BY employer_name, city
       ORDER BY placement_count DESC, employer_name ASC`
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching employers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching employers list",
    });
  }
};

export const getPlacements = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT p.id, u.name as student_name, p.employer_name, p.city, p.discipline, p.compensation, p.semester, p.academic_year
       FROM placements p
       LEFT JOIN users u ON p.student_id = u.id
       ORDER BY p.placed_at DESC`
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching placements:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching placements list",
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT 
        u.id,
        u.name as student_name,
        u.email,
        u.major,
        u.created_at,
        p.id as placement_id,
        p.employer_name,
        p.city,
        p.province,
        p.discipline,
        p.compensation,
        p.semester,
        p.academic_year,
        p.placed_at,
        j.title as job_title
       FROM users u
       LEFT JOIN placements p ON p.student_id = u.id
       LEFT JOIN jobs j ON p.job_id = j.id
       WHERE u.role = 'student' AND p.id IS NOT NULL
       ORDER BY p.placed_at DESC, u.name ASC`
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching students list",
    });
  }
};

export const uploadPlacements = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Parse sheet to JSON array, starting from row 2 (index 1) skipping header
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    // Remove header row
    const rows = data.slice(1);
    
    let insertedCount = 0;
    let skippedCount = 0;

    for (const row of rows) {
      if (!row || row.length === 0) continue;
      
      const academic_year = row[0]?.toString().trim() || "";
      const semester = row[1]?.toString().trim() || "";
      const employer_name = row[2]?.toString().trim() || "";
      // supervisor is row[3], title is row[4]
      const major = row[5]?.toString().trim() || "Unspecified";
      const discipline = row[6]?.toString().trim() || "General Kinesiology";
      const city = row[7]?.toString().trim() || "";
      const province = row[8]?.toString().trim() || "";
      const compensation = row[9]?.toString().trim() || "Unpaid";

      // Only insert if essential data is present
      if (employer_name && academic_year && semester && city && province) {
        await query(
          `INSERT INTO placements (employer_name, discipline, city, province, compensation, major, semester, academic_year)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [employer_name, discipline, city, province, compensation, major, semester, academic_year]
        );
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    return res.json({
      success: true,
      message: "Placements imported successfully",
      insertedCount,
      skippedCount
    });
  } catch (error) {
    console.error("Error uploading placements:", error);
    // Attempt cleanup if error occurs
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error during placements upload",
    });
  }
};
