"use server";

import { LOAI_NHOM_KH, PHAN_LOAI_CSKH, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createErrorResponse, createSuccessResponse, ResultResponse } from "@/types/response";
import { CSKHFormData } from "./schema";

const CSKH_PATH = "/cskh";

export type CSKHPublic = Prisma.CSKHGetPayload<{
  include: { NHOM_KH: true; NGUON_KH: true; NGUOI_GIOI_THIEU: true; LY_DO_TU_CHOI: true };
}>;

export type CskhSource = { ID_NGUON: string; NGUON: string };
export type CskhReferrer = { ID_NGT: string; TEN_NGT: string; SO_DT_NGT: string };
export type CskhRejectReason = { ID_LY_DO: string; LY_DO: string };
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

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

export async function getNextCustomerCode() {
  const count = await prisma.cSKH.count();
  return `KH${String(count + 1).padStart(4, "0")}`;
}

export const getAllCSKH = async (): Promise<ResultResponse<CSKHPublic[]>> => {
  try {
    await Promise.all([
      ensureDefaultCustomerGroups(),
      ensureDefaultCustomerSources(),
      ensureDefaultRejectReasons(),
    ]);
    const customers = await prisma.cSKH.findMany({
      include: { NHOM_KH: true, NGUON_KH: true, NGUOI_GIOI_THIEU: true, LY_DO_TU_CHOI: true },
      orderBy: { NGAY_GHI_NHAN: "desc" },
    });
    return createSuccessResponse(customers);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh sách CSKH", error);
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
    return createErrorResponse("Lỗi khi lấy danh mục CSKH", error);
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

export const createCSKH = async (payload: CSKHFormData): Promise<ResultResponse<CSKHPublic>> => {
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

    const newCustomer = await prisma.cSKH.create({
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
    return createErrorResponse("Lỗi khi tạo dữ liệu CSKH", error);
  }
};

export const thamDinhKhachHang = async (id: string): Promise<ResultResponse<null>> => {
  try {
    await prisma.cSKH.update({
      where: { ID_CSKH: id },
      data: { PHAN_LOAI: PHAN_LOAI_CSKH.KHACH_TIEM_NANG, ID_LY_DO_TC: null },
    });
    revalidatePath(CSKH_PATH);
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi thẩm định khách hàng", error);
  }
};
