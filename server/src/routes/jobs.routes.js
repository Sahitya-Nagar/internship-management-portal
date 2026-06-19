import express from "express";
import {
  createJob,
  getPublishedJobs,
  getPendingJobs,
  getMyJobs,
  publishJob,
  declineJob,
} from "../controllers/jobs.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// Public / Published jobs (still protected by basic auth if requested, but prompt says "GET /api/jobs/published — all published jobs with optional filters", let's make it standard protect just in case, or leave public. Let's make it standard protect for all users as it says "auth check / JWT: Store token in localStorage. Send as Authorization: Bearer token header on all protected requests")
// Actually, let's keep it protected by JWT auth so that only registered students/employers/admins can search positions. It's clean and matches the setup.
router.get("/published", protect, getPublishedJobs);

// Employer specific routes
router.post("/", protect, authorize("employer"), createJob);
router.get("/my", protect, authorize("employer"), getMyJobs);

// Supervisor / Admin routes
router.get("/pending", protect, authorize("supervisor", "admin"), getPendingJobs);
router.patch("/:id/publish", protect, authorize("supervisor", "admin"), publishJob);
router.patch("/:id/decline", protect, authorize("supervisor", "admin"), declineJob);

export default router;
