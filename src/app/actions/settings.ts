"use server";

import { prisma } from "@/lib/prisma";
import { createErrorResponse, createSuccessResponse } from "@/types/response";
import { revalidatePath } from "next/cache";

export async function getDanhMucChucVu() {
  try {
    const data = await prisma.dANH_MUC_CHUC_VU.findMany({
      orderBy: { TEN_CV: 'asc' }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh mục chức vụ", error);
  }
}

export async function addDanhMucChucVu(tenCv: string) {
  try {
    const data = await prisma.dANH_MUC_CHUC_VU.create({
      data: { TEN_CV: tenCv.trim() }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm danh mục chức vụ (có thể đã tồn tại)", error);
  }
}

export async function toggleDanhMucChucVu(id: string, hieuLuc: boolean) {
  try {
    const data = await prisma.dANH_MUC_CHUC_VU.update({
      where: { ID_CV: id },
      data: { HIEU_LUC: hieuLuc }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi cập nhật trạng thái chức vụ", error);
  }
}

export async function deleteDanhMucChucVu(id: string) {
  try {
    await prisma.dANH_MUC_CHUC_VU.delete({
      where: { ID_CV: id }
    });
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi xoá danh mục chức vụ", error);
  }
}

// Phòng ban
export async function getDanhMucPhongBan() {
  try {
    const data = await prisma.dANH_MUC_PHONG_BAN.findMany({
      orderBy: { TEN_PB: 'asc' }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh mục phòng ban", error);
  }
}

export async function addDanhMucPhongBan(tenPb: string) {
  try {
    const data = await prisma.dANH_MUC_PHONG_BAN.create({
      data: { TEN_PB: tenPb.trim() }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm danh mục phòng ban (có thể đã tồn tại)", error);
  }
}

export async function toggleDanhMucPhongBan(id: string, hieuLuc: boolean) {
  try {
    const data = await prisma.dANH_MUC_PHONG_BAN.update({
      where: { ID_PB: id },
      data: { HIEU_LUC: hieuLuc }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi cập nhật trạng thái phòng ban", error);
  }
}

export async function deleteDanhMucPhongBan(id: string) {
  try {
    await prisma.dANH_MUC_PHONG_BAN.delete({
      where: { ID_PB: id }
    });
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi xoá danh mục phòng ban", error);
  }
}

// Nguồn khách hàng
export async function getNguonKhachHang() {
  try {
    const data = await prisma.nGUON_KH.findMany({
      orderBy: { NGUON: 'asc' }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh mục nguồn khách hàng", error);
  }
}

export async function addNguonKhachHang(nguon: string) {
  try {
    const count = await prisma.nGUON_KH.count();
    const newId = `NGUON_${count + 1}_${Date.now()}`;
    const data = await prisma.nGUON_KH.create({
      data: { ID_NGUON: newId, NGUON: nguon.trim() }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi thêm danh mục nguồn (có thể đã tồn tại)", error);
  }
}

export async function toggleNguonKhachHang(id: string, hieuLuc: boolean) {
  try {
    const data = await prisma.nGUON_KH.update({
      where: { ID_NGUON: id },
      data: { HIEU_LUC: hieuLuc }
    });
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Lỗi khi cập nhật trạng thái nguồn", error);
  }
}

export async function deleteNguonKhachHang(id: string) {
  try {
    await prisma.nGUON_KH.delete({
      where: { ID_NGUON: id }
    });
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi xoá danh mục nguồn", error);
  }
}
