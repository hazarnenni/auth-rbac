import app from "./app.js";
import env from "./config/env.js";
import prisma from "./database/prisma.js";

const port = env.port ?? 4000;

const start = async () => {
  try {
    await prisma.$connect();
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
