import prisma from "../utils/prisma.js";

export const getTestData = async (req, res) => {
  try {
    const { search, semester, payment, city, major, profession, year } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { employer: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { profession: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    if (semester) where.semester = { equals: semester, mode: "insensitive" };
    if (payment) where.payment = { equals: payment, mode: "insensitive" };
    if (city) where.city = { equals: city, mode: "insensitive" };
    if (major) where.major = { equals: major, mode: "insensitive" };
    if (profession) where.profession = { equals: profession, mode: "insensitive" };
    if (year) where.year = parseInt(year);

    const [data, count] = await Promise.all([
      prisma.testData.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.testData.count({ where }),
    ]);

    // Get unique values for filters
    const filterData = await prisma.testData.findMany({
      select: {
        semester: true,
        payment: true,
        city: true,
        major: true,
        profession: true,
        year: true,
      },
    });

    const filters = {
      semesters: [...new Set(filterData.map(d => d.semester).filter(Boolean))],
      payments: [...new Set(filterData.map(d => d.payment).filter(Boolean))],
      cities: [...new Set(filterData.map(d => d.city).filter(Boolean))],
      majors: [...new Set(filterData.map(d => d.major).filter(Boolean))],
      professions: [...new Set(filterData.map(d => d.profession).filter(Boolean))],
      years: [...new Set(filterData.map(d => d.year).filter(Boolean))],
    };

    res.json({
      success: true,
      data,
      count,
      filters,
    });
  } catch (error) {
    console.error("Error fetching test data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
