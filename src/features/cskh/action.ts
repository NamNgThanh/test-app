"use server";

import { LOAI_NHOM_KH, PHAN_LOAI_CSKH, Prisma, TRANG_THAI_CSKH, LOAI_KET_QUA, PHAN_LOAI_CHAM_SOC } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createErrorResponse, createSuccessResponse, ResultResponse } from "@/types/response";
import { KHTNFormData, KeHoachCSKHFormData } from "./schema";

const CSKH_PATH = "/cskh";

export type KHTNPublic = Prisma.KHTNGetPayload<{
  include: { NHOM_KH: true; NGUON_KH: true; NGUOI_GIOI_THIEU: true; LY_DO_TU_CHOI: true };
}>;

export type KH_CSKHPublic = Prisma.KH_CSKHGetPayload<{
  include: { KHTN: true; NGUOI_LIEN_HE: true; LOAI_CHAM_SOC: true; KQ_CS: true; LY_DO_TU_CHOI: true };
}>;

export type CskhSource = { ID_NGUON: string; NGUON: string };
export type CskhReferrer = { ID_NGT: string; TEN_NGT: string; SO_DT_NGT: string };
export type CskhRejectReason = { ID_LY_DO: string; LY_DO: string };
export type LoaiChamSoc = { ID_LCS: string; LOAI_CS: string };

export type KeHoachFormOptions = {
  khachHangOptions: { MA_KH: string; TEN_KH: string }[];
  nguoiLienHeOptions: { ID_LH: string; TENNGUOI_LIENHE: string; ID_KH: string }[];
  loaiChamSocOptions: LoaiChamSoc[];
  lyDoTuChoiOptions: CskhRejectReason[];
  kqCsOptions: { ID_KQ: string; KET_QUA: string }[];
};

export type CskhFormOptions = {
  nguonKhOptions: CskhSource[];
  nguoiGioiThieuOptions: CskhReferrer[];
  lyDoTuChoiOptions: CskhRejectReason[];
};

const DEFAULT_NGUON_KH: CskhSource[] = [
  { ID_NGUON: "SDF12", NGUON: "Google Ads" },
  { ID_NGUON: "SDF13", NGUON: "Facebook" },
  { ID_NGUON: "SDF14", NGUON: "Zalo OA" },
  { ID_NGUON: "SDF15", NGUON: "Hotline" },
  { ID_NGUON: "SDF16", NGUON: "Sales tự tìm" },
  { ID_NGUON: "SDF17", NGUON: "BGĐ giao" },
  { ID_NGUON: "SDF18", NGUON: "Hội chợ/ Hội thảo" },
  { ID_NGUON: "SDF19", NGUON: "CTV/ Referrals" },
  { ID_NGUON: "SDF20", NGUON: "Hiệp hội" },
];

const DEFAULT_LY_DO_TU_CHOI: CskhRejectReason[] = [
  { ID_LY_DO: "LDTC01", LY_DO: "Giá cao" },
  { ID_LY_DO: "LDTC02", LY_DO: "Chỉ tham khảo giá" },
  { ID_LY_DO: "LDTC03", LY_DO: "Mặt bằng không phù hợp" },
  { ID_LY_DO: "LDTC04", LY_DO: "Đã có NCC khác" },
];

async function ensureDefaultCustomerGroups() {
  await Promise.all([
    prisma.nHOM_KH.upsert({
      where: { NHOM: LOAI_NHOM_KH.KHACH_LE },
      update: {},
      create: { NHOM: LOAI_NHOM_KH.KHACH_LE },
    }),
    prisma.nHOM_KH.upsert({
      where: { NHOM: LOAI_NHOM_KH.DAI_LY },
      update: {},
      create: { NHOM: LOAI_NHOM_KH.DAI_LY },
    }),
  ]);
}

async function ensureDefaultCustomerSources() {
  await Promise.all(
    DEFAULT_NGUON_KH.map((item) =>
      prisma.nGUON_KH.upsert({
        where: { ID_NGUON: item.ID_NGUON },
        update: { NGUON: item.NGUON },
        create: item,
      })
    )
  );
}

async function ensureDefaultRejectReasons() {
  await Promise.all(
    DEFAULT_LY_DO_TU_CHOI.map((item) =>
      prisma.lY_DO_TU_CHOI.upsert({
        where: { ID_LY_DO: item.ID_LY_DO },
        update: { LY_DO: item.LY_DO },
        create: item,
      })
    )
  );
}

const DEFAULT_LOAI_CHAM_SOC = [
  PHAN_LOAI_CHAM_SOC.TU_VAN_KHAO_SAT,
  PHAN_LOAI_CHAM_SOC.LAM_RO_BAO_GIA_HOP_DONG,
  PHAN_LOAI_CHAM_SOC.TRIEN_KHAI_THEO_DOI,
  PHAN_LOAI_CHAM_SOC.XU_LY_CONG_NO,
  PHAN_LOAI_CHAM_SOC.HAU_MAI_CHAM_SOC_DINH_KY,
];

async function ensureDefaultLoaiChamSoc() {
  await Promise.all(
    DEFAULT_LOAI_CHAM_SOC.map(async (loai) => {
      const exists = await prisma.lOAI_CHAM_SOC.findFirst({ where: { LOAI_CS: loai } });
      if (!exists) {
        await prisma.lOAI_CHAM_SOC.create({ data: { LOAI_CS: loai } });
      }
    })
  );
}

async function ensureDefaultKetQuaCs() {
  await Promise.all(
    [LOAI_KET_QUA.DAT, LOAI_KET_QUA.TU_CHOI].map(async (kq) => {
      const exists = await prisma.kQ_CS.findFirst({ where: { KET_QUA: kq } });
      if (!exists) {
        await prisma.kQ_CS.create({ data: { KET_QUA: kq } });
      }
    })
  );
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

export async function getNextCustomerCode() {
  const count = await prisma.kHTN.count();
  return `KH${String(count + 1).padStart(4, "0")}`;
}

export const getAllKHTN = async (): Promise<ResultResponse<KHTNPublic[]>> => {
  try {
    await Promise.all([
      ensureDefaultCustomerGroups(),
      ensureDefaultCustomerSources(),
      ensureDefaultRejectReasons(),
    ]);
    const customers = await prisma.kHTN.findMany({
      include: { NHOM_KH: true, NGUON_KH: true, NGUOI_GIOI_THIEU: true, LY_DO_TU_CHOI: true },
      orderBy: { NGAY_GHI_NHAN: "desc" },
    });
    return createSuccessResponse(customers);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh sách KHTN", error);
  }
};

export const getCSKHFormOptions = async (): Promise<ResultResponse<CskhFormOptions>> => {
  try {
    await Promise.all([ensureDefaultCustomerSources(), ensureDefaultRejectReasons()]);
    const [nguonKhOptions, nguoiGioiThieuOptions, lyDoTuChoiOptions] = await Promise.all([
      prisma.nGUON_KH.findMany({
        select: { ID_NGUON: true, NGUON: true },
        orderBy: { ID_NGUON: "asc" },
      }),
      prisma.nGUOI_GIOI_THIEU.findMany({
        select: { ID_NGT: true, TEN_NGT: true, SO_DT_NGT: true },
        orderBy: { TEN_NGT: "asc" },
      }),
      prisma.lY_DO_TU_CHOI.findMany({
        select: { ID_LY_DO: true, LY_DO: true },
        orderBy: { ID_LY_DO: "asc" },
      }),
    ]);

    return createSuccessResponse({ nguonKhOptions, nguoiGioiThieuOptions, lyDoTuChoiOptions });
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh mục", error);
  }
};

export const createNguoiGioiThieu = async (
  input: Pick<CskhReferrer, "TEN_NGT" | "SO_DT_NGT">
): Promise<ResultResponse<CskhReferrer>> => {
  try {
    const existed = await prisma.nGUOI_GIOI_THIEU.findFirst({
      where: {
        TEN_NGT: input.TEN_NGT.trim(),
        SO_DT_NGT: input.SO_DT_NGT.trim(),
      },
      select: { ID_NGT: true, TEN_NGT: true, SO_DT_NGT: true },
    });
    if (existed) return createSuccessResponse(existed);

    const count = await prisma.nGUOI_GIOI_THIEU.count();
    const id = `NGT${String(count + 1).padStart(3, "0")}`;
    const created = await prisma.nGUOI_GIOI_THIEU.create({
      data: {
        ID_NGT: id,
        TEN_NGT: input.TEN_NGT.trim(),
        SO_DT_NGT: input.SO_DT_NGT.trim(),
      },
      select: { ID_NGT: true, TEN_NGT: true, SO_DT_NGT: true },
    });
    revalidatePath(CSKH_PATH);
    return createSuccessResponse(created);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm người giới thiệu", error);
  }
};

export const createKHTN = async (payload: KHTNFormData): Promise<ResultResponse<KHTNPublic>> => {
  try {
    await Promise.all([
      ensureDefaultCustomerGroups(),
      ensureDefaultCustomerSources(),
      ensureDefaultRejectReasons(),
    ]);
    const [group, source, rejectReason] = await Promise.all([
      prisma.nHOM_KH.findUnique({ where: { NHOM: payload.NHOM } }),
      prisma.nGUON_KH.findUnique({ where: { ID_NGUON: payload.ID_NGUON } }),
      payload.ID_LY_DO_TC
        ? prisma.lY_DO_TU_CHOI.findUnique({ where: { ID_LY_DO: payload.ID_LY_DO_TC } })
        : Promise.resolve(null),
    ]);

    if (!group) {
      return createErrorResponse("Không tìm thấy nhóm khách hàng", null);
    }
    if (!source) {
      return createErrorResponse("Không tìm thấy nguồn khách hàng", null);
    }
    if (source.NGUON === "CTV/ Referrals" && !payload.ID_NGT) {
      return createErrorResponse("Nguồn CTV/Referrals bắt buộc chọn người giới thiệu", null);
    }
    if (payload.PHAN_LOAI === PHAN_LOAI_CSKH.KHONG_PHU_HOP && !payload.ID_LY_DO_TC) {
      return createErrorResponse("Phân loại Không phù hợp bắt buộc chọn lý do từ chối", null);
    }
    if (payload.ID_LY_DO_TC && !rejectReason) {
      return createErrorResponse("Lý do từ chối không tồn tại", null);
    }

    const newCustomer = await prisma.kHTN.create({
      data: {
        MA_KH: payload.MA_KH,
        ID_NHOM: group.ID_NHOM,
        ID_NGUON: payload.ID_NGUON,
        ID_NGT: payload.ID_NGT || null,
        NGAY_GHI_NHAN: toDate(payload.NGAY_GHI_NHAN),
        TEN_KH: payload.TEN_KH,
        TEN_VT: payload.TEN_VT || null,
        HINH_ANH: payload.HINH_ANH || null,
        DIEN_THOAI: payload.DIEN_THOAI,
        EMAIL: payload.EMAIL || null,
        MST: payload.MST || null,
        NGAY_THANH_LAP: payload.NGAY_THANH_LAP ? toDate(payload.NGAY_THANH_LAP) : null,
        DIA_CHI: payload.DIA_CHI || null,
        SALES_PT: payload.SALES_PT || null,
        PHAN_LOAI: payload.PHAN_LOAI ?? PHAN_LOAI_CSKH.CHUA_THAM_DINH,
        ID_LY_DO_TC: payload.ID_LY_DO_TC || null,
        NV_CS: payload.NV_CS || null,
      },
      include: { NHOM_KH: true, NGUON_KH: true, NGUOI_GIOI_THIEU: true, LY_DO_TU_CHOI: true },
    });

    revalidatePath(CSKH_PATH);
    return createSuccessResponse(newCustomer);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return createErrorResponse("Mã khách hàng đã tồn tại", error);
    }
    return createErrorResponse("Lỗi khi tạo dữ liệu KHTN", error);
  }
};

export const thamDinhKhachHang = async (id: string): Promise<ResultResponse<null>> => {
  try {
    await prisma.kHTN.update({
      where: { ID_KHTN: id },
      data: { PHAN_LOAI: PHAN_LOAI_CSKH.KHACH_TIEM_NANG, ID_LY_DO_TC: null },
    });
    revalidatePath(CSKH_PATH);
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi thẩm định khách hàng", error);
  }
};

export const getAllKeHoachCSKH = async (): Promise<ResultResponse<KH_CSKHPublic[]>> => {
  try {
    const plans = await prisma.kH_CSKH.findMany({
      include: { KHTN: true, NGUOI_LIEN_HE: true, LOAI_CHAM_SOC: true, KQ_CS: true, LY_DO_TU_CHOI: true },
      orderBy: { TG_TU: "desc" },
    });
    return createSuccessResponse(plans);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh sách Kế Hoạch CSKH", error);
  }
};

const LOAI_CS_LABELS: Record<string, string> = {
  [PHAN_LOAI_CHAM_SOC.TU_VAN_KHAO_SAT]: "Tư vấn - khảo sát",
  [PHAN_LOAI_CHAM_SOC.LAM_RO_BAO_GIA_HOP_DONG]: "Làm rõ báo giá / Hợp đồng",
  [PHAN_LOAI_CHAM_SOC.TRIEN_KHAI_THEO_DOI]: "Triển khai - Theo dõi",
  [PHAN_LOAI_CHAM_SOC.XU_LY_CONG_NO]: "Xử lý công nợ",
  [PHAN_LOAI_CHAM_SOC.HAU_MAI_CHAM_SOC_DINH_KY]: "Hậu mãi - Chăm sóc định kỳ",
};

export const getKeHoachFormOptions = async (): Promise<ResultResponse<KeHoachFormOptions>> => {
  try {
    await Promise.all([ensureDefaultLoaiChamSoc(), ensureDefaultKetQuaCs(), ensureDefaultRejectReasons()]);
    const [khachHangOptions, nguoiLienHeOptions, loaiChamSocOptions, lyDoTuChoiOptions, kqCsOptions] = await Promise.all([
      prisma.kHTN.findMany({ select: { MA_KH: true, TEN_KH: true } }),
      prisma.nGUOI_LIEN_HE.findMany({ select: { ID_LH: true, TENNGUOI_LIENHE: true, ID_KH: true } }),
      prisma.lOAI_CHAM_SOC.findMany({ select: { ID_LCS: true, LOAI_CS: true } }),
      prisma.lY_DO_TU_CHOI.findMany({ select: { ID_LY_DO: true, LY_DO: true } }),
      prisma.kQ_CS.findMany({ select: { ID_KQ: true, KET_QUA: true } }),
    ]);
    return createSuccessResponse({
      khachHangOptions,
      nguoiLienHeOptions,
      loaiChamSocOptions: loaiChamSocOptions.map((l) => ({ ID_LCS: l.ID_LCS, LOAI_CS: LOAI_CS_LABELS[l.LOAI_CS] || l.LOAI_CS })),
      lyDoTuChoiOptions,
      kqCsOptions,
    });
  } catch (error) {
    console.error("Lỗi khi tải danh mục Kế Hoạch:", error);
    return createErrorResponse("Lỗi khi tải danh mục Kế Hoạch", error);
  }
};

export const createKeHoachCSKH = async (payload: KeHoachCSKHFormData, userId: string): Promise<ResultResponse<KH_CSKHPublic>> => {
  try {
    const newPlan = await prisma.kH_CSKH.create({
      data: {
        ID_KH: payload.ID_KH || null,
        ID_LH: payload.ID_LH || null,
        TG_TU: payload.TG_TU,
        TG_DEN: payload.TG_DEN,
        ID_LCS: payload.ID_LCS,
        HINH_THUC: payload.HINH_THUC,
        DIA_DIEM: payload.DIA_DIEM || null,
        NGUOI_CHAM_SOC: payload.NGUOI_CHAM_SOC || userId, // Auto set user if empty
        NOI_DUNG_TD: payload.NOI_DUNG_TD || null,
        GHI_CHU_NHU_CAU: payload.GHI_CHU_NHU_CAU || null,
        TRANG_THAI: payload.TRANG_THAI || "CHO_BAO_CAO",
        NGAY_CS_TT: payload.NGAY_CS_TT || null,
        ID_KQ: payload.ID_KQ || null,
        XEP_LOAI_CS: payload.XEP_LOAI_CS || null,
        ID_LY_DO_TC: payload.ID_LY_DO_TC || null,
      },
      include: { KHTN: true, NGUOI_LIEN_HE: true, LOAI_CHAM_SOC: true, KQ_CS: true, LY_DO_TU_CHOI: true },
    });
    revalidatePath(CSKH_PATH);
    return createSuccessResponse(newPlan);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm kế hoạch CSKH", error);
  }
};
