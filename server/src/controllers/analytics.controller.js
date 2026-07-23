import { query } from "../utils/db.js";

export const getSummary = async (req, res) => {
  const { semester } = req.query;

  try {
    let placedSql = "SELECT COUNT(*)::int as count FROM placements";
    let placedParams = [];
    if (semester) {
      placedSql += " WHERE CONCAT(semester, ' ', academic_year) = $1";
      placedParams.push(semester);
    }
    const { rows: placedRes } = await query(placedSql, placedParams);
    const studentsPlaced = placedRes[0]?.count || 0;

    let empSql = "SELECT COUNT(DISTINCT employer_name)::int as count FROM placements";
    let empParams = [];
    if (semester) {
      empSql += " WHERE CONCAT(semester, ' ', academic_year) = $1";
      empParams.push(semester);
    }
    const { rows: empRes } = await query(empSql, empParams);
    const activeEmployers = empRes[0]?.count || 0;

    let paidSql = `
      SELECT 
        COUNT(*)::int as total,
        COUNT(CASE WHEN compensation ILIKE 'Paid' THEN 1 END)::int as paid
      FROM placements
    `;
    let paidParams = [];
    if (semester) {
      paidSql += " WHERE CONCAT(semester, ' ', academic_year) = $1";
      paidParams.push(semester);
    }
    const { rows: paidRes } = await query(paidSql, paidParams);
    const totalPlacements = paidRes[0]?.total || 0;
    const paidPlacements = paidRes[0]?.paid || 0;
    const paidPercentage = totalPlacements > 0
      ? Math.round((paidPlacements / totalPlacements) * 100)
      : 0;

    const { rows: allTimeRes } = await query("SELECT COUNT(*)::int as count FROM placements");
    const allTimeTotal = allTimeRes[0]?.count || 0;

    return res.json({
      success: true,
      data: {
        studentsPlaced,
        activeEmployers,
        paidPercentage,
        allTimeTotal,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching analytics summary",
    });
  }
};

export const getByDiscipline = async (req, res) => {
  const { semester } = req.query;

  try {
    let sql = "SELECT discipline, COUNT(*)::int as count FROM placements";
    const params = [];
    if (semester) {
      sql += " WHERE CONCAT(semester, ' ', academic_year) = $1";
      params.push(semester);
    }
    sql += " GROUP BY discipline ORDER BY count DESC";

    const { rows } = await query(sql, params);
    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching placements by discipline:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching placements by discipline",
    });
  }
};

export const getByCity = async (req, res) => {
  const { semester } = req.query;

  try {
    let sql = "SELECT city, COUNT(*)::int as count FROM placements";
    const params = [];
    if (semester) {
      sql += " WHERE CONCAT(semester, ' ', academic_year) = $1";
      params.push(semester);
    }
    sql += " GROUP BY city ORDER BY count DESC";

    const { rows } = await query(sql, params);
    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching placements by city:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching placements by city",
    });
  }
};

export const getPaidUnpaid = async (req, res) => {
  const { semester } = req.query;

  try {
    let sql = "SELECT compensation, COUNT(*)::int as count FROM placements";
    const params = [];
    if (semester) {
      sql += " WHERE CONCAT(semester, ' ', academic_year) = $1";
      params.push(semester);
    }
    sql += " GROUP BY compensation ORDER BY count DESC";

    const { rows } = await query(sql, params);

    const normalizedData = rows.map(r => ({
      name: r.compensation,
      value: r.count
    }));

    return res.json({
      success: true,
      data: normalizedData,
    });
  } catch (error) {
    console.error("Error fetching paid/unpaid placements:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching paid vs unpaid breakdown",
    });
  }
};

export const getTopEmployers = async (req, res) => {
  const { semester } = req.query;

  try {
    let sql = "SELECT employer_name, COUNT(*)::int as count FROM placements";
    const params = [];
    if (semester) {
      sql += " WHERE CONCAT(semester, ' ', academic_year) = $1";
      params.push(semester);
    }
    sql += " GROUP BY employer_name ORDER BY count DESC LIMIT 10";

    const { rows } = await query(sql, params);
    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching top employers placements:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching top employers stats",
    });
  }
};

export const getSemesters = async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT DISTINCT semester, academic_year, CONCAT(semester, ' ', academic_year) as semester_str 
      FROM placements 
      ORDER BY 
        academic_year DESC, 
        CASE semester 
          WHEN 'Fall' THEN 3 
          WHEN 'Summer' THEN 2 
          WHEN 'Winter' THEN 1 
          ELSE 0 
        END DESC
    `);
    const semestersList = rows.map(r => r.semester_str);
    return res.json({
      success: true,
      data: semestersList,
    });
  } catch (error) {
    console.error("Error fetching semesters:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching academic semesters list",
    });
  }
};
