import pg from "pg";
import bcrypt from "bcrypt";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_oSflkItbG71Q@ep-autumn-cherry-aq81jo20-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

export const query = (text, params) => pool.query(text, params);

export const initDb = async () => {
  try {
    console.log("Checking and initializing database tables...");

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'employer', 'admin', 'supervisor')),
        organization VARCHAR(255),
        major VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create jobs table
    await query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        employer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        organization VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255) NOT NULL,
        contact_email VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        discipline VARCHAR(100) NOT NULL,
        city VARCHAR(255) NOT NULL,
        province VARCHAR(100) NOT NULL,
        compensation VARCHAR(50) NOT NULL CHECK (compensation IN ('Paid', 'Unpaid')),
        start_date DATE NOT NULL,
        majors_eligible VARCHAR(255),
        description TEXT NOT NULL,
        apply_method VARCHAR(50) NOT NULL CHECK (apply_method IN ('link', 'email')),
        apply_url VARCHAR(555),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'declined')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP
      );
    `);

    // Create applications table
    await query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        resume_path VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected')),
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create placements table
    await query(`
      CREATE TABLE IF NOT EXISTS placements (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
        employer_name VARCHAR(255) NOT NULL,
        discipline VARCHAR(100) NOT NULL,
        city VARCHAR(255) NOT NULL,
        province VARCHAR(100) NOT NULL,
        compensation VARCHAR(50) NOT NULL,
        major VARCHAR(255) NOT NULL,
        semester VARCHAR(50) NOT NULL,
        academic_year VARCHAR(50) NOT NULL,
        placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database tables verified/created.");

    // Seed default users if they don't exist
    const { rows: userCount } = await query("SELECT COUNT(*) FROM users");
    if (parseInt(userCount[0].count) === 0) {
      console.log("Seeding default users...");
      const hashedPassword = await bcrypt.hash("Password123", 10);

      // Seed Student
      await query(`
        INSERT INTO users (name, email, password, role, major)
        VALUES ('Sarah Student', 'student@uwindsor.ca', $1, 'student', 'Kinesiology - Movement Science')
      `, [hashedPassword]);

      // Seed Employer
      const { rows: employerRow } = await query(`
        INSERT INTO users (name, email, password, role, organization)
        VALUES ('Eric Employer', 'employer@uwindsor.ca', $1, 'employer', 'Windsor Physiotherapy Clinic')
        RETURNING id
      `, [hashedPassword]);

      const employerId = employerRow[0].id;

      // Seed Supervisor
      await query(`
        INSERT INTO users (name, email, password, role)
        VALUES ('Susan Supervisor', 'supervisor@uwindsor.ca', $1, 'supervisor')
      `, [hashedPassword]);

      // Seed Admin
      await query(`
        INSERT INTO users (name, email, password, role)
        VALUES ('Alex Admin', 'admin@uwindsor.ca', $1, 'admin')
      `, [hashedPassword]);

      console.log("Default users seeded successfully.");

      // Seed default jobs
      console.log("Seeding default jobs...");
      const job1 = await query(`
        INSERT INTO jobs (employer_id, organization, contact_name, contact_email, contact_phone, title, discipline, city, province, compensation, start_date, majors_eligible, description, apply_method, apply_url, status, published_at)
        VALUES ($1, 'Windsor Physiotherapy Clinic', 'Eric Employer', 'employer@uwindsor.ca', '519-555-0199', 'Clinical Kinesiology Intern', 'Physiotherapy', 'Windsor', 'Ontario', 'Paid', '2026-09-01', 'Kinesiology - Movement Science', 'Assist clinical physiotherapists with patient rehabilitation, exercise prescription, and functional movement assessments.', 'link', 'https://windsorphysio.example.com/apply', 'published', NOW())
        RETURNING id
      `, [employerId]);

      const job2 = await query(`
        INSERT INTO jobs (employer_id, organization, contact_name, contact_email, contact_phone, title, discipline, city, province, compensation, start_date, majors_eligible, description, apply_method, apply_url, status, published_at)
        VALUES ($1, 'Windsor Cardiac Rehabilitation', 'Eric Employer', 'employer@uwindsor.ca', '519-555-0199', 'Cardiac Rehab Assistant', 'General Kinesiology', 'Windsor', 'Ontario', 'Unpaid', '2026-09-01', 'Kinesiology - All Majors', 'Support cardiac rehabilitation classes, monitor blood pressure, and lead warm-up exercise sessions.', 'email', 'cardiacrehab@uwindsor.ca', 'published', NOW())
        RETURNING id
      `, [employerId]);

      // Seed a pending job for supervisor review
      await query(`
        INSERT INTO jobs (employer_id, organization, contact_name, contact_email, contact_phone, title, discipline, city, province, compensation, start_date, majors_eligible, description, apply_method, apply_url, status)
        VALUES ($1, 'Essex Chiropractic Care', 'Eric Employer', 'employer@uwindsor.ca', '519-555-0199', 'Chiropractic Assistant Intern', 'Chiropractic', 'Essex', 'Ontario', 'Paid', '2026-09-15', 'Kinesiology - Movement Science', 'Learn spinal alignment assessments and assist chiropractic doctors with patient care therapies.', 'link', 'https://essexchiro.example.com/apply', 'pending')
      `, [employerId]);

      console.log("Default jobs seeded successfully.");

      // Seed default placements for analytics
      console.log("Seeding default placements...");
      const placementsData = [
        { emp: 'Windsor Physiotherapy Clinic', disc: 'Physiotherapy', city: 'Windsor', prov: 'Ontario', comp: 'Paid', major: 'Kinesiology - Movement Science', sem: 'F-25', yr: '2025' },
        { emp: 'Windsor Physiotherapy Clinic', disc: 'Physiotherapy', city: 'Windsor', prov: 'Ontario', comp: 'Paid', major: 'Kinesiology - Movement Science', sem: 'W-26', yr: '2026' },
        { emp: 'Tecumseh Chiropractic', disc: 'Chiropractic', city: 'Tecumseh', prov: 'Ontario', comp: 'Unpaid', major: 'Kinesiology - Movement Science', sem: 'F-25', yr: '2025' },
        { emp: 'Windsor Public Schools', disc: 'Teaching', city: 'Windsor', prov: 'Ontario', comp: 'Unpaid', major: 'Kinesiology - Education', sem: 'W-26', yr: '2026' },
        { emp: 'Detroit Athletic Club', disc: 'Other', city: 'Detroit', prov: 'Ontario', comp: 'Paid', major: 'Kinesiology - Sport Management', sem: 'F-25', yr: '2025' },
        { emp: 'University of Windsor Athletics', disc: 'General Kinesiology', city: 'Windsor', prov: 'Ontario', comp: 'Unpaid', major: 'Kinesiology - All Majors', sem: 'F-25', yr: '2025' },
        { emp: 'St. Clair College Health', disc: 'General Kinesiology', city: 'Windsor', prov: 'Ontario', comp: 'Paid', major: 'Kinesiology - Movement Science', sem: 'W-26', yr: '2026' },
        { emp: 'London Health Sciences', disc: 'Physiotherapy', city: 'London', prov: 'Ontario', comp: 'Paid', major: 'Kinesiology - Movement Science', sem: 'F-25', yr: '2025' },
        { emp: 'Toronto Rehabilitation Inst.', disc: 'Physiotherapy', city: 'Toronto', prov: 'Ontario', comp: 'Paid', major: 'Kinesiology - Movement Science', sem: 'W-26', yr: '2026' },
        { emp: 'Calgary Sports Therapy', disc: 'Chiropractic', city: 'Calgary', prov: 'Alberta', comp: 'Paid', major: 'Kinesiology - Movement Science', sem: 'W-26', yr: '2026' },
        { emp: 'Vancouver Wellness', disc: 'Other', city: 'Vancouver', prov: 'British Columbia', comp: 'Paid', major: 'Kinesiology - Movement Science', sem: 'F-25', yr: '2025' }
      ];

      for (const p of placementsData) {
        await query(`
          INSERT INTO placements (employer_name, discipline, city, province, compensation, major, semester, academic_year)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [p.emp, p.disc, p.city, p.prov, p.comp, p.major, p.sem, p.yr]);
      }
      console.log("Default placements seeded successfully.");
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

export default pool;
