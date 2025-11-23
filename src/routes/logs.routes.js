import { Router } from "express";
import { getLogs } from "../controllers/logs.controller.js";
import { auth } from "../middlewares/authMiddleware.js";
import { hasRole } from "../middlewares/roleMiddleware.js";

const router = Router();
router.get("/", auth, hasRole("admin"), getLogs);
export default router;
