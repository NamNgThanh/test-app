"use server"

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createErrorResponse, createSuccessResponse, ResultResponse } from "@/types/response";
import { Prisma } from "@prisma/client";
import { EmployeeFormData } from "./schema";
import { revalidatePath } from "next/cache";

const EMPLOYEES_PATH = "/employees";

const employeePublicSelect = {
  PASSWORD: false,
} satisfies Prisma.NHAN_VIENOmit;

export type EmployeePublic = Prisma.NHAN_VIENGetPayload<{
  omit: typeof employeePublicSelect;
}>;

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

async function buildCreatePayload(employeeData: EmployeeFormData) {
  const { NGAY_NHAN_VIEC, PASSWORD, XAC_NHAN_MAT_KHAU, TAO_TAI_KHOAN, USER_NAME, ...data } =
    employeeData;

  const payload: Prisma.NHAN_VIENCreateInput = {
    ...data,
    NGAY_SINH: toDate(data.NGAY_SINH),
    NGAY_CAP_CCCD: toDate(data.NGAY_CAP_CCCD),
    NGAY_HET_HAN_CCCD: toDate(data.NGAY_HET_HAN_CCCD),
    NGAY_CHINH_THUC:
      employeeData.TRANG_THAI === "DANG_LAM_VIEC" ? toDate(NGAY_NHAN_VIEC) : null,
    NGAY_THU_VIEC: employeeData.TRANG_THAI === "THU_VIEC" ? toDate(NGAY_NHAN_VIEC) : null,
    USER_NAME: null,
    PASSWORD: null,
  };

  if (TAO_TAI_KHOAN && USER_NAME?.trim() && PASSWORD) {
    payload.USER_NAME = USER_NAME.trim().toLowerCase();
    payload.PASSWORD = await bcrypt.hash(PASSWORD, 10);
  }

  return payload;
}

export async function getNextEmployeeCode() {
  const count = await prisma.nHAN_VIEN.count();
  return `NV${String(count + 1).padStart(3, "0")}`;
}

export const getAllEmployees = async (): Promise<ResultResponse<EmployeePublic[]>> => {
  try {
    const employees = await prisma.nHAN_VIEN.findMany({
      orderBy: {
        MA_NV: "desc",
      },
      omit: employeePublicSelect,
    });

    return createSuccessResponse(employees);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh sách nhân viên", error);
  }
};

export const getEmployees = getAllEmployees;

export const getEmployeeById = async (id: string): Promise<ResultResponse<EmployeePublic>> => {
  try {
    const employee = await prisma.nHAN_VIEN.findUnique({
      where: {
        MA_NV: id,
      },
      omit: employeePublicSelect,
    });

    if (!employee) {
      return createErrorResponse("Không tìm thấy nhân viên với ID này", null);
    }

    return createSuccessResponse(employee);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy thông tin nhân viên", error);
  }
};

export const createEmployee = async (
  employeeData: EmployeeFormData
): Promise<ResultResponse<EmployeePublic>> => {
  try {
    const payload = await buildCreatePayload(employeeData);

    // Lưu danh mục mới nếu cần
    if (payload.CHUC_VU) {
      await prisma.dANH_MUC_CHUC_VU.upsert({
        where: { TEN_CV: payload.CHUC_VU },
        update: {},
        create: { TEN_CV: payload.CHUC_VU },
      });
    }

    if (payload.PHONGBAN) {
      await prisma.dANH_MUC_PHONG_BAN.upsert({
        where: { TEN_PB: payload.PHONGBAN },
        update: {},
        create: { TEN_PB: payload.PHONGBAN },
      });
    }

    const newEmployee = await prisma.nHAN_VIEN.create({
      data: payload,
      omit: employeePublicSelect,
    });
    revalidatePath(EMPLOYEES_PATH);
    return createSuccessResponse(newEmployee);
  } catch (error) {
    console.error("createEmployee failed:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return createErrorResponse("Tên đăng nhập đã được sử dụng. Vui lòng chọn tên khác.", error);
    }

    return createErrorResponse("Lỗi khi tạo nhân viên mới", error);
  }
};

export const deleteEmployee = async (id: string): Promise<ResultResponse<null>> => {
  try {
    await prisma.nHAN_VIEN.delete({
      where: {
        MA_NV: id,
      },
    });
    revalidatePath(EMPLOYEES_PATH);
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi xóa nhân viên", error);
  }
};

export const getEmployeeFormOptions = async () => {
  try {
    const [chucVuList, phongBanList] = await Promise.all([
      prisma.dANH_MUC_CHUC_VU.findMany({
        where: { HIEU_LUC: true },
        select: { ID_CV: true, TEN_CV: true },
        orderBy: { TEN_CV: 'asc' }
      }),
      prisma.dANH_MUC_PHONG_BAN.findMany({
        where: { HIEU_LUC: true },
        select: { ID_PB: true, TEN_PB: true },
        orderBy: { TEN_PB: 'asc' }
      })
    ]);

    return createSuccessResponse({
      chucVuOptions: chucVuList.map(item => ({ value: item.TEN_CV, label: item.TEN_CV })),
      phongBanOptions: phongBanList.map(item => ({ value: item.TEN_PB, label: item.TEN_PB }))
    });
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh mục form nhân viên", error);
  }
};
