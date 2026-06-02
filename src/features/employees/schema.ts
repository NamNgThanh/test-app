import z from "zod";

export const createNhanVienSchema = z.object({
  MA_NV: z.string(),
  HO_VA_TEN: z
    .string({ message: "Họ và tên không hợp lệ" })
    .min(1, "Họ và tên không được để trống")
    .max(255, "Họ và tên không được vượt quá 255 ký tự")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Họ và tên chỉ được chứa chữ cái và khoảng trắng"),
  GIOI_TINH: z.enum(["NAM", "NU", "KHAC"], {message: "Giới tính không hợp lệ"}),
  NGAY_SINH: z.date({message: "Vui lòng nhập ngày sinh"}),
  SO_DIEN_THOAI: z
    .string({ message: "Số điện thoại không hợp lệ" })
    .regex(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số')
    .min(1, 'Vui lòng nhập số điện thoại'),
  EMAIL: z
    .email({message: "Email không hợp lệ"})
    .min(1, 'Vui lòng nhập email'),
  DIA_CHI_THUONG_TRU: z
    .string({ message: "Địa chỉ thường trú không hợp lệ" })
    .min(1, "Địa chỉ thường trú không được để trống")
    .max(255, "Địa chỉ thường trú không được vượt quá 255 ký tự"),
  DIA_CHI_HIEN_TAI: z
    .string({ message: "Địa chỉ hiện tại không hợp lệ" })
    .min(1, "Địa chỉ hiện tại không được để trống")
    .max(255, "Địa chỉ hiện tại không được vượt quá 255 ký tự"),
  SO_CCCD: z
    .string({ message: "Số CCCD không hợp lệ" })
    .regex(/^[0-9]{12}$/, 'Số CCCD phải có 12 chữ số')
    .min(1, 'Vui lòng nhập số CCCD'),
  NGAY_CAP_CCCD: z.date({message: "Vui lòng nhập ngày cấp CCCD"}),
  NOI_CAP_CCCD: z
    .string({ message: "Nơi cấp CCCD không hợp lệ" })
    .min(1, "Nơi cấp CCCD không được để trống")
    .max(255, "Nơi cấp CCCD không được vượt quá 255 ký tự"),
  NGAY_HET_HAN_CCCD: z.date({message: "Vui lòng nhập ngày hết hạn CCCD"}),
  NGAY_NHAN_VIEC: z.date({message: "Vui lòng nhập ngày nhận việc"}),
  TRANG_THAI: z.enum(["DANG_LAM_VIEC", "THU_VIEC", "NGHI_VIEC"], {message: "Trạng thái làm việc không hợp lệ"}),
  HINH_THUC: z.enum(["TOAN_THOI_GIAN", "BAN_THOI_GIAN", "THU_VIEC"], {message: "Loại nhân viên không hợp lệ"}),
  CHUC_VU: z.enum(
    ["NHAN_VIEN_KINH_DOANH", "TRUONG_PHONG_KINH_DOANH", "PHO_CHU_TICH", "NHAN_VIEN"],
    { message: "Chức vụ không hợp lệ" }
  ),
  PHONGBAN: z.enum(["BAN_GIAM_DOC", "PHONG_KINH_DOANH"], { message: "Phòng ban không hợp lệ" }),
})

export type EmployeeFormData = z.infer<typeof createNhanVienSchema>;