import { CHUC_VU, PHONGBAN } from "@prisma/client";

export const CHUC_VU_LABELS: Record<CHUC_VU, string> = {
  NHAN_VIEN_KINH_DOANH: "Nhân viên kinh doanh",
  TRUONG_PHONG_KINH_DOANH: "Trưởng phòng kinh doanh",
  PHO_CHU_TICH: "Phó chủ tịch",
  NHAN_VIEN: "Nhân viên",
};

export const PHONGBAN_LABELS: Record<PHONGBAN, string> = {
  BAN_GIAM_DOC: "Ban Giám đốc",
  PHONG_KINH_DOANH: "Phòng Kinh doanh",
};

export const CHUC_VU_OPTIONS = (Object.keys(CHUC_VU_LABELS) as CHUC_VU[]).map((value) => ({
  value,
  label: CHUC_VU_LABELS[value],
}));

export const PHONGBAN_OPTIONS = (Object.keys(PHONGBAN_LABELS) as PHONGBAN[]).map((value) => ({
  value,
  label: PHONGBAN_LABELS[value],
}));
