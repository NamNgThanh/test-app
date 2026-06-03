"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
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
        <DialogContent className="sm:max-w-220 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm thống kê CSKH</DialogTitle>
            <DialogDescription>Nhập thông tin khách hàng cần theo dõi chăm sóc.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="PHAN_LOAI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phân loại</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CHUA_THAM_DINH">Chưa thẩm định</SelectItem>
                          <SelectItem value="KHACH_TIEM_NANG">Khách tiềm năng</SelectItem>
                          <SelectItem value="KHONG_PHU_HOP">Không phù hợp</SelectItem>
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
                    className="w-full"
                    onClick={() => form.setValue("PHAN_LOAI", "KHACH_TIEM_NANG", { shouldValidate: true })}
                  >
                    Thẩm định
                  </Button>
                </div>
              </div>

              {isKhongPhuHop && (
                <FormField
                  control={form.control}
                  name="ID_LY_DO_TC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lý do từ chối *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn lý do từ chối" />
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="NGAY_GHI_NHAN"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày ghi nhận *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
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
                <FormField
                  control={form.control}
                  name="TEN_KH"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên KH *</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên khách hàng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        <Input placeholder="email@company.com" {...field} />
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
                      <FormLabel>MST</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mã số thuế"
                          {...field}
                          onBlur={async (e) => {
                            field.onBlur?.();
                            const taxCode = e.target.value?.trim();
                            if (taxCode) {
                              try {
                                const res = await fetch(`https://api.vietqr.io/v2/business/${taxCode}`);
                                if (res.ok) {
                                  const data = await res.json();
                                  if (data.code === "00" && data.data) {
                                    const business = data.data;
                                    if (business.name) form.setValue("TEN_KH", business.name, { shouldValidate: true });
                                    if (business.shortName) form.setValue("TEN_VT", business.shortName, { shouldValidate: true });
                                    if (business.address) form.setValue("DIA_CHI", business.address, { shouldValidate: true });
                                    toast.success("Đã lấy thông tin doanh nghiệp");
                                  } else {
                                    toast.error("Không tìm thấy thông tin doanh nghiệp");
                                  }
                                } else {
                                  toast.error("Lỗi khi kết nối đến hệ thống tra cứu");
                                }
                              } catch (error) {
                                toast.error("Đã xảy ra lỗi khi tra cứu mã số thuế");
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày thành lập</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
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

              <FormField
                control={form.control}
                name="DIA_CHI"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Textarea rows={2} placeholder="Nhập địa chỉ khách hàng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
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
                <div />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ID_NGT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Người giới thiệu {isReferralSource && "*"}</FormLabel>
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
                    className="w-full"
                    onClick={() => setIsReferrerModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm người giới thiệu
                  </Button>
                </div>
              </div>

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
                  name="NV_CS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhân viên CS</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhân viên chăm sóc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </form>
          </Form>
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
              <FormLabel>Người giới thiệu *</FormLabel>
              <Input
                value={newReferrerName}
                onChange={(e) => setNewReferrerName(e.target.value)}
                placeholder="Nhập tên người giới thiệu"
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Số ĐT *</FormLabel>
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
