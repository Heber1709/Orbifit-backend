import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const res = await prisma.$queryRaw`SELECT NOW()`;
  console.log('Conexión exitosa:', res);
  await prisma.$disconnect();
}

main();
