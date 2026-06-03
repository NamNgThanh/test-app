import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.nGUOI_DUNG.findFirst({
    where: { TAI_KHOAN: 'admin' }
  });
  
  if (!user) {
    console.log("User 'admin' does not exist in DB!");
  } else {
    console.log("Found user 'admin'");
    const isMatch = await bcrypt.compare('1', user.MAT_KHAU);
    console.log("Does password '1' match?", isMatch);
    console.log("Stored hash:", user.MAT_KHAU);
  }
  
  const allUsers = await prisma.nGUOI_DUNG.findMany({ select: { TAI_KHOAN: true } });
  console.log("All users:", allUsers);
}
checkUser().catch(console.error).finally(() => prisma.$disconnect());
