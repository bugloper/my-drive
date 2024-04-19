const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetDb() {
  await prisma.user.deleteMany();
}

module.exports = resetDb;
