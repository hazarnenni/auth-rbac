import { Router } from "express";
import * as AdminCtrl from "../controllers/adminUser.controller.js";
import { auth } from "../middlewares/authMiddleware.js";
import { hasRole } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/users", auth, hasRole("admin"), AdminCtrl.listUsers);
router.patch("/users/:id", auth, hasRole("admin"), AdminCtrl.updateUser);
router.delete("/users/:id", auth, hasRole("admin"), AdminCtrl.deleteUser);

export default router;
