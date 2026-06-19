import app from "./src/app.js";
import { initDb } from "./src/utils/db.js";

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