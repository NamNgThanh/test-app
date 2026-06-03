import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const DEFAULT_LOAI_CHAM_SOC = [
  "Tư vấn - khảo sát",
  "Làm rõ báo giá / Hợp đồng",
  "Triển khai - Theo dõi",
  "Xử lý công nợ",
  "Hậu mãi - Chăm sóc định kỳ",
];

async function run() {
  try {
    for (const loai of DEFAULT_LOAI_CHAM_SOC) {
      const exists = await prisma.lOAI_CHAM_SOC.findFirst({ where: { LOAI_CS: loai } });
      if (!exists) {
        await prisma.lOAI_CHAM_SOC.create({ data: { LOAI_CS: loai } });
      }
    }
    
    for (const kq of ["DAT", "TU_CHOI"]) {
      const exists = await prisma.kQ_CS.findFirst({ where: { KET_QUA: kq } });
      if (!exists) {
        await prisma.kQ_CS.create({ data: { KET_QUA: kq } });
      }
    }
    console.log("Success");
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
