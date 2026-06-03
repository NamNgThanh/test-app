import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const hash = await bcrypt.hash('1', 10);
  const user = await prisma.nGUOI_DUNG.create({
    data: {
      TAI_KHOAN: 'admin',
      MAT_KHAU: hash,
      QUYEN: 'ADMIN'
    }
  });
  console.log("Created admin user successfully:", user.TAI_KHOAN);
}

createAdmin().catch(console.error).finally(() => prisma.$disconnect());
