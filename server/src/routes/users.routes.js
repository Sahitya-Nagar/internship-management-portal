import express from "express";
import { getEmployers, getPlacements } from "../controllers/users.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/employers", protect, authorize("admin", "supervisor"), getEmployers);
router.get("/placements", protect, authorize("admin", "supervisor"), getPlacements);

export default router;
