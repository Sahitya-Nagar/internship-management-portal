import { query } from "../utils/db.js";

export const getSummary = async (req, res) => {
  const { semester } = req.query;

  try {
    // Students placed (rows in test_data)
    let placedSql = "SELECT COUNT(*)::int as count FROM test_data";
    let placedParams = [];
    if (semester) {
      placedSql += " WHERE semester = $1";
      placedParams.push(semester);
    }
    const { rows: placedRes } = await query(placedSql, placedParams);
    const studentsPlaced = placedRes[0]?.count || 0;

    // Unique employers
    let empSql = "SELECT COUNT(DISTINCT employer)::int as count FROM test_data";
    let empParams = [];
    if (semester) {
      empSql += " WHERE semester = $1";
      empParams.push(semester);
    }
    const { rows: empRes } = await query(empSql, empParams);
    const activeEmployers = empRes[0]?.count || 0;

    // Paid percentage (payment field: 'Paid' / 'Volunteer')
    let paidSql = `
      SELECT 
        COUNT(*)::int as total,
        COUNT(CASE WHEN payment ILIKE 'Paid' THEN 1 END)::int as paid
      FROM test_data
    `;
    let paidParams = [];
    if (semester) {
      paidSql += " WHERE semester = $1";
      paidParams.push(semester);
    }
    const { rows: paidRes } = await query(paidSql, paidParams);
    const totalPlacements = paidRes[0]?.total || 0;
    const paidPlacements = paidRes[0]?.paid || 0;
    const paidPercentage = totalPlacements > 0
      ? Math.round((paidPlacements / totalPlacements) * 100)
      : 0;

    // All-time total
    const { rows: allTimeRes } = await query("SELECT COUNT(*)::int as count FROM test_data");
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
    let sql = "SELECT profession as discipline, COUNT(*)::int as count FROM test_data";
    const params = [];
    if (semester) {
      sql += " WHERE semester = $1";
      params.push(semester);
    }
    sql += " GROUP BY profession ORDER BY count DESC";

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
    let sql = "SELECT city, COUNT(*)::int as count FROM test_data";
    const params = [];
    if (semester) {
      sql += " WHERE semester = $1";
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
    let sql = "SELECT payment as compensation, COUNT(*)::int as count FROM test_data";
    const params = [];
    if (semester) {
      sql += " WHERE semester = $1";
      params.push(semester);
    }
    sql += " GROUP BY payment ORDER BY count DESC";

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
    let sql = "SELECT employer as employer_name, COUNT(*)::int as count FROM test_data";
    const params = [];
    if (semester) {
      sql += " WHERE semester = $1";
      params.push(semester);
    }
    sql += " GROUP BY employer ORDER BY count DESC LIMIT 10";

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
    const { rows } = await query(
      "SELECT DISTINCT semester FROM test_data ORDER BY semester DESC"
    );
    const semestersList = rows.map(r => r.semester);
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
