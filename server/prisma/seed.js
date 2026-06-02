import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import xlsx from "xlsx";
const { readFile, utils } = xlsx;
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Path to the Excel file (project root)
  const excelPath = path.resolve(
    __dirname,
    "../../INTERNSHIP DATA for Programming-Students.xlsx"
  );

  console.log(`📖 Reading Excel file: ${excelPath}`);

  // Read the Excel workbook
  const workbook = readFile(excelPath);
  const sheetName = workbook.SheetNames[0]; // "Student F-22"
  const sheet = workbook.Sheets[sheetName];

  console.log(`📋 Sheet: "${sheetName}"`);

  // Convert to JSON rows
  const rows = utils.sheet_to_json(sheet);

  // Filter out empty/incomplete rows (the blank separator row)
  const validRows = rows.filter(
    (row) => row.Year && row.Semester && row.Employer && row.Title
  );

  console.log(`📊 Found ${validRows.length} valid data rows`);

  // Clear existing data in test_data table
  await prisma.testData.deleteMany();
  console.log("🗑️  Cleared existing test_data records");

  // Map Excel rows to Prisma records
  const records = validRows.map((row) => ({
    year: typeof row.Year === "number" ? row.Year : parseInt(row.Year, 10),
    semester: String(row.Semester || ""),
    employer: String(row.Employer || ""),
    title: String(row.Title || ""),
    major: String(row.Major || ""),
    profession: String(row.Profession || ""),
    city: String(row.City || ""),
    province: String(row.Province || ""),
    payment: String(row.Payment || ""),
  }));

  // Bulk insert all records
  const result = await prisma.testData.createMany({
    data: records,
  });

  console.log(`✅ Successfully inserted ${result.count} rows into test_data`);

  // Print a few sample rows for verification
  const samples = await prisma.testData.findMany({ take: 5 });
  console.log("\n📌 Sample rows:");
  samples.forEach((row, i) => {
    console.log(
      `  ${i + 1}. [${row.year} ${row.semester}] ${row.employer} — ${row.title} (${row.profession}, ${row.payment})`
    );
  });

  // Print total count
  const totalCount = await prisma.testData.count();
  console.log(`\n📈 Total records in test_data: ${totalCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
