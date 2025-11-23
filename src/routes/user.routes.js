import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware.js";
import { hasRole } from "../../middlewares/roleMiddleware.js";

const router = Router();

router.get("/me", auth, async (req, res) => {
  res.json({ message: "Authenticated", userId: req.user.id });
});

router.get("/admin/users", auth, hasRole("admin"), async (req, res) => {
  res.json({ message: "Only admin can see this" });
});

export default router;
