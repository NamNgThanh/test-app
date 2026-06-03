import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$runCommandRaw({
    update: "KQ_CS",
    updates: [
      {
        q: { HIEU_LUC: { $exists: false } },
        u: { $set: { HIEU_LUC: true, IS_TU_CHOI: false } },
        multi: true
      }
    ]
  });
  
  // For TU_CHOI, set IS_TU_CHOI to true
  await prisma.$runCommandRaw({
    update: "KQ_CS",
    updates: [
      {
        q: { KET_QUA: "TU_CHOI" },
        u: { $set: { IS_TU_CHOI: true } },
        multi: true
      }
    ]
  });

  console.log("KQ_CS migration done");
}

main().catch(console.error).finally(() => prisma.$disconnect());
