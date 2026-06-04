import z from "zod";

export const createKHTNSchema = z.object({
  MA_KH: z.string().min(1, "Mã khách hàng không được để trống"),
  NHOM: z.enum(["KHACH_LE", "DAI_LY"], { message: "Nhóm khách hàng không hợp lệ" }),
  ID_NGUON: z.string().min(1, "Vui lòng chọn nguồn"),
  ID_NGT: z.string().optional(),
  PHAN_LOAI: z.enum(["CHUA_THAM_DINH", "KHACH_TIEM_NANG", "KHONG_PHU_HOP"]),
  ID_LY_DO_TC: z.string().optional(),
  NGAY_GHI_NHAN: z.date({ message: "Vui lòng chọn ngày ghi nhận" }),
  TEN_KH: z.string().min(1, "Tên khách hàng không được để trống"),
  TEN_VT: z.string().optional(),
  HINH_ANH: z.string().optional(),
  DIEN_THOAI: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
    .min(1, "Số điện thoại không được để trống"),
  EMAIL: z.email("Email không hợp lệ").optional().or(z.literal("")),
  MST: z.string().optional(),
  NGAY_THANH_LAP: z.date().optional(),
  DIA_CHI: z.string().optional(),
  SALES_PT: z.string().optional(),
  NV_CS: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.ID_NGUON === "SDF19" && !data.ID_NGT) {
    ctx.addIssue({
      code: "custom",
      path: ["ID_NGT"],
      message: "Vui lòng chọn người giới thiệu khi nguồn là CTV/Referrals",
    });
  }
  if (data.PHAN_LOAI === "KHONG_PHU_HOP" && !data.ID_LY_DO_TC) {
    ctx.addIssue({
      code: "custom",
      path: ["ID_LY_DO_TC"],
      message: "Vui lòng chọn lý do từ chối khi phân loại không phù hợp",
    });
  }
});

export type KHTNFormData = z.infer<typeof createKHTNSchema>;

export const createKeHoachCSKHSchema = z.object({
  ID_KH: z.string().optional(),
  ID_LH: z.string().optional(),
  ID_DD: z.string().optional(),
  TG_TU: z.date({ message: "Vui lòng chọn thời gian bắt đầu" }),
  TG_DEN: z.date({ message: "Vui lòng chọn thời gian kết thúc" }),
  ID_LCS: z.string().min(1, "Vui lòng chọn loại chăm sóc"),
  HINH_THUC: z.enum(["ONLINE", "TRUC_TIEP"], { message: "Hình thức không hợp lệ" }),
  DIA_DIEM: z.string().optional(),
  NGUOI_CHAM_SOC: z.string().optional(),
  NOI_DUNG_TD: z.string().optional(),
  GHI_CHU_NHU_CAU: z.string().optional(),
  NGAY_CS_TT: z.date().optional(),
  ID_KQ: z.string().optional(),
  XEP_LOAI_CS: z.enum(["A", "D"]).optional(),
  ID_LY_DO_TC: z.string().optional(),
  TRANG_THAI: z.enum(["HOAN_THANH", "CHO_BAO_CAO", "HUY"]),
});

export type KeHoachCSKHFormData = z.infer<typeof createKeHoachCSKHSchema>;

export const updateKeHoachCSKHSchema = createKeHoachCSKHSchema.superRefine((data, ctx) => {
  if (data.TRANG_THAI === "HOAN_THANH" && !data.ID_KQ) {
    ctx.addIssue({
      code: "custom",
      path: ["ID_KQ"],
      message: "Vui lòng chọn kết quả CSKH khi hoàn thành",
    });
  }
});

export type UpdateKeHoachCSKHFormData = z.infer<typeof updateKeHoachCSKHSchema>;
