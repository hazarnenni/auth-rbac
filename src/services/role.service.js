import prisma from "../database/prisma.js";

export const ensureRoleExists = async (name, description = null) => {
  let role = await prisma.role.findUnique({ where: { name } });
  if (!role) {
    role = await prisma.role.create({ data: { name, description } });
  }
  return role;
};

export const assignRole = async (userId, roleName) => {
  const role = await ensureRoleExists(roleName);
  const exists = await prisma.userRole.findUnique({ where: { userId_roleId: { userId, roleId: role.id } } }).catch(()=>null);
  if (exists) throw new Error("User already has role");
  return prisma.userRole.create({ data: { userId, roleId: role.id } });
};

export const revokeRole = async (userId, roleName) => {
  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) throw new Error("Role not found");
  return prisma.userRole.deleteMany({ where: { userId, roleId: role.id } });
};

export const getUserRoles = async (userId) => {
  return prisma.userRole.findMany({ where: { userId }, include: { role: true } });
};
