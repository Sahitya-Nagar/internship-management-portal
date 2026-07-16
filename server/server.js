import dotenv from "dotenv";
dotenv.config();

// Use dynamic imports so that dotenv.config() runs BEFORE
// db.js reads process.env.DATABASE_URL at module load time.
const { default: app } = await import("./src/app.js");
const { initDb } = await import("./src/utils/db.js");

const PORT = process.env.PORT || 5000;

// Initialize Database then start listening
initDb()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database on startup", err);
    process.exit(1);
  });