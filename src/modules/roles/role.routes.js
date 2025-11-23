import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware.js";
import { hasRole } from "../../middlewares/roleMiddleware.js";
import * as Controller from "./role.controller.js";

const router = Router();

// Only admin can manage roles
router.post("/assign", auth, hasRole("admin"), Controller.assignRole);
router.post("/revoke", auth, hasRole("admin"), Controller.revokeRole);
router.get("/:userId", auth, hasRole("admin"), Controller.listUserRoles);

export default router;
