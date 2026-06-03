import fs from 'fs';
const file = "src/features/cskh/action.ts";
let content = fs.readFileSync(file, 'utf8');

// Update KeHoachFormOptions
const typeFind = 'nguoiLienHeOptions: { ID_LH: string; TENNGUOI_LIENHE: string; ID_KH: string }[];';
const typeReplace = 'nguoiLienHeOptions: { ID_LH: string; TENNGUOI_LIENHE: string; ID_KH: string }[];\n  nguoiDaiDienOptions: { ID_DD: string; TEN_NGUOI_DD: string; ID_KH: string }[];';
content = content.replace(typeFind, typeReplace);

// Update getKeHoachFormOptions
const fetchFind = 'const [khachHangOptions, nguoiLienHeOptions, loaiChamSocOptions, lyDoTuChoiOptions, kqCsOptions] = await Promise.all([';
const fetchReplace = 'const [khachHangOptions, nguoiLienHeOptions, nguoiDaiDienOptions, loaiChamSocOptions, lyDoTuChoiOptions, kqCsOptions] = await Promise.all([';
content = content.replace(fetchFind, fetchReplace);

const queryFind = 'prisma.nGUOI_LIEN_HE.findMany({ select: { ID_LH: true, TENNGUOI_LIENHE: true, ID_KH: true } }),';
const queryReplace = 'prisma.nGUOI_LIEN_HE.findMany({ select: { ID_LH: true, TENNGUOI_LIENHE: true, ID_KH: true } }),\n      prisma.nGUOI_DAI_DIEN.findMany({ select: { ID_DD: true, TEN_NGUOI_DD: true, ID_KH: true } }),';
content = content.replace(queryFind, queryReplace);

const returnFind = 'nguoiLienHeOptions,';
const returnReplace = 'nguoiLienHeOptions,\n      nguoiDaiDienOptions,';
content = content.replace(returnFind, returnReplace);

// Add create actions
const createActions = `
export async function createNguoiLienHe(data: { ID_KH: string; TENNGUOI_LIENHE: string; CHUC_VU?: string; SDT: string; EMAIL?: string; GHI_CHU?: string }) {
  try {
    const res = await prisma.nGUOI_LIEN_HE.create({ data: { ...data, HIEU_LUC: true } });
    return createSuccessResponse(res);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm người liên hệ", error);
  }
}

export async function createNguoiDaiDien(data: { ID_KH: string; TEN_NGUOI_DD: string; CHUC_VU?: string; SDT: string; EMAIL?: string; NGAY_SINH?: Date }) {
  try {
    const res = await prisma.nGUOI_DAI_DIEN.create({ data: { ...data, HIEU_LUC: true } });
    return createSuccessResponse(res);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm người đại diện", error);
  }
}
`;

content = content + '\n' + createActions;
fs.writeFileSync(file, content);
console.log("action.ts modified successfully");
