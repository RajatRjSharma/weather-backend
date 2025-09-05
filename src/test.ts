import { PrismaClient } from '@prisma/client';

async function test() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();
  console.log(users);
  await prisma.$disconnect();
}

test().catch(console.error);
