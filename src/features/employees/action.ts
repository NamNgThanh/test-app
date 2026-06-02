"use server"

import { prisma } from "@/lib/prisma";
import { createErrorResponse, createSuccessResponse, ResultResponse } from "@/types/response";
import { NHAN_VIEN } from "@prisma/client";
import { EmployeeFormData } from "./schema";
import { revalidatePath } from "next/cache";

const EMPLOYEES_PATH = "/employees";

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function normalizeEmployeeData(employeeData: EmployeeFormData) {
  const { NGAY_NHAN_VIEC, ...data } = employeeData;

  return {
    ...data,
    NGAY_SINH: toDate(data.NGAY_SINH),
    NGAY_CAP_CCCD: toDate(data.NGAY_CAP_CCCD),
    NGAY_HET_HAN_CCCD: toDate(data.NGAY_HET_HAN_CCCD),
    NGAY_CHINH_THUC:
      employeeData.TRANG_THAI === "DANG_LAM_VIEC" ? toDate(NGAY_NHAN_VIEC) : null,
    NGAY_THU_VIEC:
      employeeData.TRANG_THAI === "THU_VIEC" ? toDate(NGAY_NHAN_VIEC) : null,
  };
}

export async function getNextEmployeeCode() {
  const count = await prisma.nHAN_VIEN.count();
  return `NV${String(count + 1).padStart(3, "0")}`;
}

export const getAllEmployees = async (): Promise<ResultResponse<NHAN_VIEN[]>> => {
  try {
    const employees = await prisma.nHAN_VIEN.findMany({
      orderBy: {
        MA_NV: "desc"
      }
    });

    return createSuccessResponse(employees);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy danh sách nhân viên", error);
  }
};

export const getEmployees = getAllEmployees;

export const getEmployeeById = async (id: string): Promise<ResultResponse<NHAN_VIEN>> => {
  try {
    const employee = await prisma.nHAN_VIEN.findUnique({
      where: {
        MA_NV: id
      }
    });

    if (!employee) {
      return createErrorResponse("Không tìm thấy nhân viên với ID này", null);
    }

    return createSuccessResponse(employee);
  } catch (error) {
    return createErrorResponse("Lỗi khi lấy thông tin nhân viên", error);
  }
};

export const createEmployee = async (employeeData: EmployeeFormData): Promise<ResultResponse<NHAN_VIEN>> => {
  try {
    const newEmployee = await prisma.nHAN_VIEN.create({
      data: normalizeEmployeeData(employeeData),
    });
    revalidatePath(EMPLOYEES_PATH);
    return createSuccessResponse(newEmployee);
  } catch (error) {
    console.error("createEmployee failed:", error);
    return createErrorResponse("Lỗi khi tạo nhân viên mới", error);
  }
};

export const deleteEmployee = async (id: string): Promise<ResultResponse<null>> => {
  try {
    await prisma.nHAN_VIEN.delete({
      where: {
        MA_NV: id
      }
    });
    revalidatePath(EMPLOYEES_PATH);
    return createSuccessResponse(null);
  } catch (error) {
    return createErrorResponse("Lỗi khi xóa nhân viên", error);
  }
};