import { Router } from "express";
import * as RoleController from "../controllers/role.controller.js";
import { auth } from "../middlewares/authMiddleware.js";
import { hasRole } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/assign", auth, hasRole("admin"), RoleController.assign);
router.post("/revoke", auth, hasRole("admin"), RoleController.revoke);
router.get("/:userId", auth, hasRole("admin"), RoleController.listUserRoles);

export default router;
