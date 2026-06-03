import fs from 'fs';
const file = "prisma/schema.prisma";
let content = fs.readFileSync(file, 'utf8');

const nguoiDaiDienModel = `
model NGUOI_DAI_DIEN {
  ID_DD          String    @id @default(auto()) @map("_id") @db.ObjectId
  ID_KH          String
  TEN_NGUOI_DD   String
  CHUC_VU        String?
  SDT            String
  EMAIL          String?
  NGAY_SINH      DateTime?
  HIEU_LUC       Boolean   @default(true)

  KHTN    KHTN      @relation(fields: [ID_KH], references: [MA_KH])
  KH_CSKH KH_CSKH[]
}
`;

content = content.replace('model NGUOI_LIEN_HE {', nguoiDaiDienModel + '\nmodel NGUOI_LIEN_HE {');

content = content.replace('NGUOI_LIEN_HE NGUOI_LIEN_HE[]', 'NGUOI_LIEN_HE NGUOI_LIEN_HE[]\n  NGUOI_DAI_DIEN NGUOI_DAI_DIEN[]');

content = content.replace('ID_LH          String?        @db.ObjectId', 'ID_LH          String?        @db.ObjectId\n  ID_DD          String?        @db.ObjectId');

content = content.replace('NGUOI_LIEN_HE NGUOI_LIEN_HE? @relation(fields: [ID_LH], references: [ID_LH])', 'NGUOI_LIEN_HE NGUOI_LIEN_HE? @relation(fields: [ID_LH], references: [ID_LH])\n  NGUOI_DAI_DIEN NGUOI_DAI_DIEN? @relation(fields: [ID_DD], references: [ID_DD])');

fs.writeFileSync(file, content);
console.log("Schema modified successfully");
