import express from "express";
import { getEmployers, getPlacements, getStudents } from "../controllers/users.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/employers", protect, authorize("admin", "supervisor"), getEmployers);
router.get("/placements", protect, authorize("admin", "supervisor"), getPlacements);
router.get("/students", protect, authorize("admin", "supervisor"), getStudents);

export default router;
