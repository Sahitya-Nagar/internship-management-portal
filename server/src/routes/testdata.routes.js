import express from "express";
import { getTestData } from "../controllers/testdata.controller.js";

const router = express.Router();

router.get("/", getTestData);

export default router;
