import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import logsRoutes from "./routes/logs.routes.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/admin", adminRoutes);
app.use("/logs", logsRoutes);

app.get("/", (req, res) => res.json({ message: "Auth RBAC API" }));

export default app;
