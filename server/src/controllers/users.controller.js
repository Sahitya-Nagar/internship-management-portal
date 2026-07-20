import { query } from "../utils/db.js";

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
