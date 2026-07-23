import express from "express";
import multer from "multer";
import { getEmployers, getPlacements, getStudents, uploadPlacements } from "../controllers/users.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get("/employers", protect, authorize("admin", "supervisor"), getEmployers);
router.get("/placements", protect, authorize("admin", "supervisor"), getPlacements);
router.post("/placements/upload", protect, authorize("admin"), upload.single("file"), uploadPlacements);
router.get("/students", protect, authorize("admin", "supervisor"), getStudents);

export default router;
