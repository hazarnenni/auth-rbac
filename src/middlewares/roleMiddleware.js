import prisma from "../database/prisma.js";

export const hasRole = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const userRoles = await prisma.userRole.findMany({
      where: { userId: req.user.id },
      include: { role: true }
    });
    const roles = userRoles.map(r => r.role.name);
    if (roles.some(r => allowedRoles.includes(r))) return next();
    return res.status(403).json({ message: "Forbidden" });
  };
};
