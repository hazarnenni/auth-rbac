import prisma from "../database/prisma.js";

export const listUsers = async (req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, isEmailVerified: true, createdAt: true } });
  res.json(users);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  delete data.password;
  const user = await prisma.user.update({ where: { id }, data });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });
  res.json({ message: "Deleted" });
};
