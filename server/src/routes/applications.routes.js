import express from "express";
import {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  downloadResume,
} from "../controllers/applications.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("student"), upload.single("resume"), applyJob);
router.get("/my", protect, authorize("student"), getMyApplications);
router.get("/job/:jobId", protect, authorize("employer", "admin"), getJobApplications);
router.patch("/:id/status", protect, authorize("employer", "admin"), updateApplicationStatus);
router.get("/:id/resume", protect, downloadResume);

export default router;
