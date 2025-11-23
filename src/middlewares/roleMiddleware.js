import prisma from "../database/prisma.js";

export const hasRole = (...allowedRoles) => {
  return async (req, res, next) => {
    const userRoles = await prisma.userRole.findMany({
      where: { userId: req.user.id },
      include: { role: true }
    });

    const roles = userRoles.map(r => r.role.name);

    const isAllowed = roles.some(role => allowedRoles.includes(role));

    if (!isAllowed) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
