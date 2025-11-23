import prisma from "../database/prisma.js";

export const getLogs = async (req, res) => {
  const { userId, action, page = 1, perPage = 50 } = req.query;
  const where = {};
  if (userId) where.userId = userId;
  if (action) where.action = action;

  const logs = await prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * perPage,
    take: parseInt(perPage, 10)
  });
  res.json(logs);
};
