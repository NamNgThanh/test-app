import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$runCommandRaw({
    update: "NGUON_KH",
    updates: [
      {
        q: { HIEU_LUC: { $exists: false } },
        u: { $set: { HIEU_LUC: true } },
        multi: true
      }
    ]
  });
  console.log("Update done");
}

main().catch(console.error).finally(() => prisma.$disconnect());
