import XLSX from "xlsx";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  const workbook = XLSX.readFile("../INTERNSHIP DATA for Programming-Students.xlsx");
  const sheet = workbook.Sheets["Student F-22"];
  const rows = XLSX.utils.sheet_to_json(sheet);

  console.log(`Found ${rows.length} rows`);

  for (const row of rows) {
    await prisma.testData.create({
      data: {
        year: Number(row.Year),
        semester: String(row.Semester || ""),
        employer: String(row.Employer || ""),
        title: String(row.Title || ""),
        major: String(row.Major || ""),
        profession: String(row.Profession || ""),
        city: String(row.City || ""),
        province: String(row.Province || ""),
        payment: String(row.Payment || ""),
      },
    });
  }

  console.log("Excel data imported successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });