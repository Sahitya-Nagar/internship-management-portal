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
