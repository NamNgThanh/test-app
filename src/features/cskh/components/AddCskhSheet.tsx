"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Key } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createKHTN,
  createNguoiGioiThieu,
  CskhReferrer,
  CskhRejectReason,
  CskhSource,
  getCSKHFormOptions,
  getNextCustomerCode,
} from "../action";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { NHOM_KH_OPTIONS } from "../constants";
import { createKHTNSchema, KHTNFormData } from "../schema";

interface AddCskhSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCskhSheet({ open, onOpenChange }: AddCskhSheetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAddingReferrer, startAddingReferrer] = useTransition();
  const [nguonOptions, setNguonOptions] = useState<CskhSource[]>([]);
  const [nguoiGioiThieuOptions, setNguoiGioiThieuOptions] = useState<CskhReferrer[]>([]);
  const [lyDoTuChoiOptions, setLyDoTuChoiOptions] = useState<CskhRejectReason[]>([]);
  const [isReferrerModalOpen, setIsReferrerModalOpen] = useState(false);
  const [newReferrerName, setNewReferrerName] = useState("");
  const [newReferrerPhone, setNewReferrerPhone] = useState("");

  const form = useForm<KHTNFormData>({
    resolver: zodResolver(createKHTNSchema),
    defaultValues: {
      NHOM: "KHACH_LE",
      ID_NGUON: "",
      ID_NGT: "",
      PHAN_LOAI: "CHUA_THAM_DINH",
      ID_LY_DO_TC: "",
      TEN_KH: "",
      TEN_VT: "",
      HINH_ANH: "",
      DIEN_THOAI: "",
      EMAIL: "",
      MST: "",
      DIA_CHI: "",
      SALES_PT: "",
      NV_CS: "",
    },
  });

  const selectedSourceId = form.watch("ID_NGUON");
  const selectedSource = useMemo(
    () => nguonOptions.find((item) => item.ID_NGUON === selectedSourceId),
    [nguonOptions, selectedSourceId]
  );
  const isReferralSource = selectedSource?.NGUON === "CTV/ Referrals";
  const classification = form.watch("PHAN_LOAI");
  const isKhongPhuHop = classification === "KHONG_PHU_HOP";

  useEffect(() => {
    if (!open) return;
    const loadCode = async () => {
      try {
        const [code, optionsResult] = await Promise.all([getNextCustomerCode(), getCSKHFormOptions()]);
        form.setValue("MA_KH", code, { shouldValidate: true });
        form.setValue("NGAY_GHI_NHAN", new Date(), { shouldValidate: true });
        if (!optionsResult.success) {
          toast.error(optionsResult.error);
          return;
        }
        setNguonOptions(optionsResult.data.nguonKhOptions);
        setNguoiGioiThieuOptions(optionsResult.data.nguoiGioiThieuOptions);
        setLyDoTuChoiOptions(optionsResult.data.lyDoTuChoiOptions);
      } catch {
        toast.error("Không thể sinh mã khách hàng");
      }
    };
    loadCode();
  }, [open, form]);

  useEffect(() => {
    if (!isReferralSource) {
      // Allow user to select a referrer even if not CTV, but don't force clear it.
    }
  }, [isReferralSource, form]);

  useEffect(() => {
    if (!isKhongPhuHop) {
      form.setValue("ID_LY_DO_TC", "", { shouldValidate: true });
    }
  }, [isKhongPhuHop, form]);

  const onSubmit = (data: KHTNFormData) => {
    startTransition(async () => {
      const submitData = { ...data };
      if (submitData.ID_NGT === "none") submitData.ID_NGT = "";

      const result = await createKHTN(submitData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Thêm dữ liệu CSKH thành công");
      onOpenChange(false);
      form.reset();
      router.refresh();
    });
  };

  const handleCreateReferrer = () => {
    startAddingReferrer(async () => {
      if (!newReferrerName.trim()) {
        toast.error("Vui lòng nhập người giới thiệu");
        return;
      }
      if (!/^[0-9]{10,11}$/.test(newReferrerPhone.trim())) {
        toast.error("Số điện thoại người giới thiệu không hợp lệ");
        return;
      }
      const result = await createNguoiGioiThieu({
        TEN_NGT: newReferrerName,
        SO_DT_NGT: newReferrerPhone,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setNguoiGioiThieuOptions((prev) => {
        const hasExisted = prev.some((item) => item.ID_NGT === result.data.ID_NGT);
        if (hasExisted) return prev;
        return [...prev, result.data].sort((a, b) => a.TEN_NGT.localeCompare(b.TEN_NGT));
      });
      form.setValue("ID_NGT", result.data.ID_NGT, { shouldValidate: true });
      setIsReferrerModalOpen(false);
      setNewReferrerName("");
      setNewReferrerPhone("");
      toast.success("Đã thêm người giới thiệu");
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
          <div className="flex-1 overflow-y-auto p-6">
            <DialogHeader className="mb-6">
              <DialogTitle>Thêm thống kê KHTN</DialogTitle>
              <DialogDescription>Nhập thông tin khách hàng cần theo dõi chăm sóc.</DialogDescription>
            </DialogHeader>


            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* --- SECTION 1: THÔNG TIN CHUNG --- */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
                    Thông tin chung
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="MA_KH"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mã KH *</FormLabel>
                          <FormControl>
                            <Input disabled readOnly className="bg-slate-100 font-semibold" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="NGAY_GHI_NHAN"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-2 mt-0">
                          <FormLabel>Ngày ghi nhận *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={
                                    "w-full pl-3 text-left font-normal " +
                                    (!field.value ? "text-muted-foreground" : "")
                                  }
                                >
                                  {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="NHOM"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nhóm KH *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn nhóm khách hàng" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {NHOM_KH_OPTIONS.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ID_NGUON"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nguồn</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn nguồn khách hàng" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {nguonOptions.map((item) => (
                                <SelectItem key={item.ID_NGUON} value={item.ID_NGUON}>
                                  {item.NGUON}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isReferralSource && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ID_NGT"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Người giới thiệu *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn người giới thiệu" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">Không chọn</SelectItem>
                                {nguoiGioiThieuOptions.map((item) => (
                                  <SelectItem key={item.ID_NGT} value={item.ID_NGT}>
                                    {item.TEN_NGT} - {item.SO_DT_NGT}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-dashed text-blue-600 hover:text-blue-700"
                          onClick={() => setIsReferrerModalOpen(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm NGT
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="bg-slate-100" />

                {/* --- SECTION 2: THÔNG TIN KHÁCH HÀNG --- */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
                    Khách hàng
                  </h3>

                  <FormField
                    control={form.control}
                    name="TEN_KH"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên KH *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên khách hàng" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="TEN_VT"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên viết tắt</FormLabel>
                          <FormControl>
                            <Input placeholder="VD: WOWS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="HINH_ANH"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hình ảnh (URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="MST"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mã số thuế</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập MST rồi Enter"
                              {...field}
                              onKeyDown={async (e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const mst = field.value?.trim();
                                  if (mst) {
                                    try {
                                      const response = await fetch(`https://api.vietqr.io/v2/business/${mst}`);
                                      const result = await response.json();
                                      if (result.code === "00" && result.data) {
                                        form.setValue("TEN_KH", result.data.name, { shouldValidate: true });
                                        if (result.data.address) {
                                          form.setValue("DIA_CHI", result.data.address, { shouldValidate: true });
                                        }
                                        toast.success("Tra cứu thành công");
                                      } else {
                                        toast.error("Không tìm thấy thông tin công ty");
                                      }
                                    } catch (error) {
                                      toast.error("Đã xảy ra lỗi khi tra cứu mã số thuế");
                                    }
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="NGAY_THANH_LAP"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-2 mt-0">
                          <FormLabel>Ngày thành lập</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={
                                    "w-full pl-3 text-left font-normal " +
                                    (!field.value ? "text-muted-foreground" : "")
                                  }
                                >
                                  {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                {/* --- SECTION 3: LIÊN HỆ --- */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">3</span>
                    Liên hệ
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="DIEN_THOAI"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Điện thoại *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập số điện thoại" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="EMAIL"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập email khách hàng" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="DIA_CHI"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Textarea rows={2} placeholder="Nhập địa chỉ đầy đủ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="bg-slate-100" />

                {/* --- SECTION 4: THẨM ĐỊNH --- */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">4</span>
                    Thẩm định & Phụ trách
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="SALES_PT"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sales phụ trách</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhân viên sales" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="PHAN_LOAI"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Đánh giá (Thẩm định)</FormLabel>
                          <div className="flex gap-2">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="flex-1 bg-slate-50">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CHUA_THAM_DINH">Chưa thẩm định</SelectItem>
                                <SelectItem value="KHACH_TIEM_NANG">Khách tiềm năng</SelectItem>
                                <SelectItem value="KHONG_PHU_HOP">Không phù hợp</SelectItem>
                              </SelectContent>
                            </Select>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button type="button" variant="outline" size="icon" className="shrink-0 bg-white hover:bg-slate-100 shadow-sm border-blue-200 text-blue-700">
                                  <Key className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[180px]">

                                <DropdownMenuItem className="text-green-600 font-medium" onClick={() => form.setValue("PHAN_LOAI", "KHACH_TIEM_NANG", { shouldValidate: true })}>
                                  Tiềm năng
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 font-medium" onClick={() => form.setValue("PHAN_LOAI", "KHONG_PHU_HOP", { shouldValidate: true })}>
                                  Chưa phù hợp
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isKhongPhuHop && (
                    <FormField
                      control={form.control}
                      name="ID_LY_DO_TC"
                      render={({ field }) => (
                        <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300 bg-red-50 p-4 rounded-lg border border-red-100 mt-2">
                          <FormLabel className="text-red-800">Vui lòng chọn Lý do từ chối *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-red-200 focus:ring-red-400 bg-white">
                                <SelectValue placeholder="Chọn lý do..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {lyDoTuChoiOptions.map((item) => (
                                <SelectItem key={item.ID_LY_DO} value={item.ID_LY_DO}>
                                  {item.LY_DO}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* NO STICKY FOOTER HERE ANYMORE */}
              </form>
            </Form>
          </div>
          {/* FIXED FOOTER */}
          <div className="border-t bg-white p-4 px-6 flex justify-end gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-b-lg">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Hủy
            </Button>
            <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isPending} className="bg-blue-600 hover:bg-blue-700 min-w-[120px] shadow-sm">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isPending ? "Đang lưu..." : "Lưu dữ liệu"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isReferrerModalOpen} onOpenChange={setIsReferrerModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm người giới thiệu</DialogTitle>
            <DialogDescription>Nhập thông tin để lưu vào danh mục người giới thiệu.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Người giới thiệu *</label>
              <Input
                value={newReferrerName}
                onChange={(e) => setNewReferrerName(e.target.value)}
                placeholder="Nhập tên người giới thiệu"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số ĐT *</label>
              <Input
                value={newReferrerPhone}
                onChange={(e) => setNewReferrerPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsReferrerModalOpen(false)}>
                Hủy
              </Button>
              <Button type="button" onClick={handleCreateReferrer} disabled={isAddingReferrer}>
                {isAddingReferrer && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAddingReferrer ? "Đang lưu..." : "Lưu người giới thiệu"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
