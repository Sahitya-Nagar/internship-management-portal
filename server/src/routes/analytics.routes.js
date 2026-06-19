import express from "express";
import {
  getSummary,
  getByDiscipline,
  getByProvince,
  getPaidUnpaid,
  getTopEmployers,
  getSemesters,
} from "../controllers/analytics.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// Restrict analytics access to supervisor and admin roles
router.get("/summary", protect, authorize("supervisor", "admin"), getSummary);
router.get("/by-discipline", protect, authorize("supervisor", "admin"), getByDiscipline);
router.get("/by-province", protect, authorize("supervisor", "admin"), getByProvince);
router.get("/paid-unpaid", protect, authorize("supervisor", "admin"), getPaidUnpaid);
router.get("/top-employers", protect, authorize("supervisor", "admin"), getTopEmployers);
router.get("/semesters", protect, authorize("supervisor", "admin"), getSemesters);

export default router;
