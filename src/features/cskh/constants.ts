import { LOAI_NHOM_KH } from "@prisma/client";

export const NHOM_KH_LABELS: Record<LOAI_NHOM_KH, string> = {
  KHACH_LE: "Khách lẻ",
  DAI_LY: "Đại lý",
};

export const NHOM_KH_OPTIONS = [
  { value: LOAI_NHOM_KH.KHACH_LE, label: NHOM_KH_LABELS.KHACH_LE },
  { value: LOAI_NHOM_KH.DAI_LY, label: NHOM_KH_LABELS.DAI_LY },
];
