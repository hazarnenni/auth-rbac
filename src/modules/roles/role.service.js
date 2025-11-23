import prisma from "../../database/prisma.js";

export const assignRole = async (userId, roleName) => {
  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) throw new Error("Role not found");

  const exists = await prisma.userRole.findFirst({
    where: { userId, roleId: role.id },
  });

  if (exists) throw new Error("User already has this role");

  return prisma.userRole.create({
    data: { userId, roleId: role.id },
  });
};

export const revokeRole = async (userId, roleName) => {
  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) throw new Error("Role not found");

  return prisma.userRole.deleteMany({
    where: { userId, roleId: role.id },
  });
};

export const getUserRoles = async (userId) => {
  return prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
};
