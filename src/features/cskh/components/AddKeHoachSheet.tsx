"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createKeHoachCSKH,
  KeHoachFormOptions,
  getKeHoachFormOptions,
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
import { createKeHoachCSKHSchema, KeHoachCSKHFormData } from "../schema";
import { createNguoiLienHe, createNguoiDaiDien } from "../action";
import { Plus } from "lucide-react";

interface AddKeHoachSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

export function AddKeHoachSheet({ open, onOpenChange, userId = "system" }: AddKeHoachSheetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [options, setOptions] = useState<KeHoachFormOptions | null>(null);
  const [isLienHeModalOpen, setIsLienHeModalOpen] = useState(false);
  const [isDaiDienModalOpen, setIsDaiDienModalOpen] = useState(false);
  
  const [newLienHe, setNewLienHe] = useState({ TENNGUOI_LIENHE: "", CHUC_VU: "", SDT: "", EMAIL: "", GHI_CHU: "" });
  const [newDaiDien, setNewDaiDien] = useState({ TEN_NGUOI_DD: "", CHUC_VU: "", SDT: "", EMAIL: "" });

  const form = useForm<KeHoachCSKHFormData>({
    resolver: zodResolver(createKeHoachCSKHSchema),
    defaultValues: {
      ID_KH: "",
      ID_LH: "",
      ID_LCS: "",
      HINH_THUC: "TRUC_TIEP",
      DIA_DIEM: "",
      NOI_DUNG_TD: "",
      GHI_CHU_NHU_CAU: "",
      TRANG_THAI: "CHO_BAO_CAO",
    },
  });

  useEffect(() => {
    if (!open) return;
    const loadOptions = async () => {
      const res = await getKeHoachFormOptions();
      if (res.success) {
        setOptions(res.data);
      } else {
        toast.error("Lỗi tải danh mục");
      }
    };
    loadOptions();
  }, [open]);

  const selectedKh = form.watch("ID_KH");
  const selectedKq = form.watch("ID_KQ");
  const isTuChoiSelected = options?.kqCsOptions.find((kq) => kq.ID_KQ === selectedKq)?.IS_TU_CHOI === true;
  const filteredNguoiLienHe = options?.nguoiLienHeOptions.filter((lh) => !selectedKh || lh.ID_KH === selectedKh) || [];
  const filteredNguoiDaiDien = options?.nguoiDaiDienOptions.filter((dd) => !selectedKh || dd.ID_KH === selectedKh) || [];

  
  const handleAddLienHe = () => {
    if (!selectedKh) return toast.error("Vui lòng chọn khách hàng trước");
    if (!newLienHe.TENNGUOI_LIENHE || !newLienHe.SDT) return toast.error("Vui lòng nhập Tên và SĐT");
    startTransition(async () => {
      const res = await createNguoiLienHe({ ID_KH: selectedKh, ...newLienHe });
      if (res.success) {
        toast.success("Thêm người liên hệ thành công");
        const newOptions = await getKeHoachFormOptions();
        if (newOptions.success) setOptions(newOptions.data);
        setIsLienHeModalOpen(false);
        form.setValue("ID_LH", res.data.ID_LH);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleAddDaiDien = () => {
    if (!selectedKh) return toast.error("Vui lòng chọn khách hàng trước");
    if (!newDaiDien.TEN_NGUOI_DD || !newDaiDien.SDT) return toast.error("Vui lòng nhập Tên và SĐT");
    startTransition(async () => {
      const res = await createNguoiDaiDien({ ID_KH: selectedKh, ...newDaiDien });
      if (res.success) {
        toast.success("Thêm người đại diện thành công");
        const newOptions = await getKeHoachFormOptions();
        if (newOptions.success) setOptions(newOptions.data);
        setIsDaiDienModalOpen(false);
        form.setValue("ID_DD", res.data.ID_DD);
      } else {
        toast.error(res.message);
      }
    });
  };

  const onSubmit = (data: KeHoachCSKHFormData) => {
    startTransition(async () => {
      const submitData = { ...data };
      if (submitData.ID_KH === "none") submitData.ID_KH = "";
      if (submitData.ID_LH === "none") submitData.ID_LH = "";
      if (submitData.ID_DD === "none") submitData.ID_DD = "";

      const result = await createKeHoachCSKH(submitData, userId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Đã lên kế hoạch thành công");
      onOpenChange(false);
      form.reset();
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-220 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lên Kế Hoạch Chăm Sóc</DialogTitle>
          <DialogDescription>Tạo kế hoạch chăm sóc khách hàng mới</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
                Khách hàng & Liên hệ
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ID_KH"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khách hàng tiềm năng</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khách hàng (Tuỳ chọn)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Không chọn</SelectItem>
                        {options?.khachHangOptions.map((item) => (
                          <SelectItem key={item.MA_KH} value={item.MA_KH}>
                            {item.TEN_KH}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="ID_LH"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Người liên hệ</FormLabel>
                        <div className="flex gap-2">
                          <Select onValueChange={field.onChange} value={field.value} disabled={!selectedKh}>
                            <FormControl>
                              <SelectTrigger className="flex-1 bg-white">
                                <SelectValue placeholder="Chọn người liên hệ (Tuỳ chọn)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Không chọn</SelectItem>
                              {filteredNguoiLienHe.map((item) => (
                                <SelectItem key={item.ID_LH} value={item.ID_LH}>
                                  {item.TENNGUOI_LIENHE}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            className="shrink-0" 
                            disabled={!selectedKh}
                            onClick={() => setIsLienHeModalOpen(!isLienHeModalOpen)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isLienHeModalOpen && (
                    <div className="bg-slate-50 p-4 rounded-lg border space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="text-sm font-semibold text-slate-700">Thêm người liên hệ mới</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Tên người liên hệ *" value={newLienHe.TENNGUOI_LIENHE} onChange={e => setNewLienHe({...newLienHe, TENNGUOI_LIENHE: e.target.value})} />
                        <Input placeholder="Số điện thoại *" value={newLienHe.SDT} onChange={e => setNewLienHe({...newLienHe, SDT: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Chức vụ" value={newLienHe.CHUC_VU} onChange={e => setNewLienHe({...newLienHe, CHUC_VU: e.target.value})} />
                        <Input placeholder="Email" value={newLienHe.EMAIL} onChange={e => setNewLienHe({...newLienHe, EMAIL: e.target.value})} />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => setIsLienHeModalOpen(false)}>Hủy</Button>
                        <Button type="button" size="sm" disabled={isPending} onClick={handleAddLienHe}>
                          {isPending && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                          Lưu & Chọn
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="ID_DD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Người đại diện</FormLabel>
                        <div className="flex gap-2">
                          <Select onValueChange={field.onChange} value={field.value} disabled={!selectedKh}>
                            <FormControl>
                              <SelectTrigger className="flex-1 bg-white">
                                <SelectValue placeholder="Chọn người đại diện (Tuỳ chọn)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Không chọn</SelectItem>
                              {filteredNguoiDaiDien.map((item) => (
                                <SelectItem key={item.ID_DD} value={item.ID_DD}>
                                  {item.TEN_NGUOI_DD}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            className="shrink-0" 
                            disabled={!selectedKh}
                            onClick={() => setIsDaiDienModalOpen(!isDaiDienModalOpen)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isDaiDienModalOpen && (
                    <div className="bg-slate-50 p-4 rounded-lg border space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 col-span-2">
                      <p className="text-sm font-semibold text-slate-700">Thêm người đại diện mới</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Tên người đại diện *" value={newDaiDien.TEN_NGUOI_DD} onChange={e => setNewDaiDien({...newDaiDien, TEN_NGUOI_DD: e.target.value})} />
                        <Input placeholder="Số điện thoại *" value={newDaiDien.SDT} onChange={e => setNewDaiDien({...newDaiDien, SDT: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Chức vụ" value={newDaiDien.CHUC_VU} onChange={e => setNewDaiDien({...newDaiDien, CHUC_VU: e.target.value})} />
                        <Input placeholder="Email" value={newDaiDien.EMAIL} onChange={e => setNewDaiDien({...newDaiDien, EMAIL: e.target.value})} />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => setIsDaiDienModalOpen(false)}>Hủy</Button>
                        <Button type="button" size="sm" disabled={isPending} onClick={handleAddDaiDien}>
                          {isPending && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                          Lưu & Chọn
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-t pt-4">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
                Nội dung kế hoạch
              </h3>


            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="TG_TU"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Thời gian từ *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="TG_DEN"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Thời gian đến *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
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
                name="ID_LCS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại CSKH *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại chăm sóc" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {options?.loaiChamSocOptions.map((item) => (
                          <SelectItem key={item.ID_LCS} value={item.ID_LCS}>
                            {item.LOAI_CS}
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
                name="HINH_THUC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình thức *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ONLINE">Online</SelectItem>
                        <SelectItem value="TRUC_TIEP">Trực tiếp</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="DIA_DIEM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa điểm</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa điểm chăm sóc (nếu có)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ID_KQ"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kết quả CSKH</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kết quả CSKH (Tuỳ chọn)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options?.kqCsOptions.map((item) => (
                        <SelectItem key={item.ID_KQ} value={item.ID_KQ}>
                          {item.KET_QUA}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isTuChoiSelected && (
              <FormField
                control={form.control}
                name="ID_LY_DO_TC"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300 bg-red-50 p-4 rounded-lg border border-red-100">
                    <FormLabel className="text-red-800">Lý do từ chối *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-red-200 focus:ring-red-400">
                          <SelectValue placeholder="Vui lòng chọn lý do từ chối" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {options?.lyDoTuChoiOptions.map((item) => (
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

            <FormField
              control={form.control}
              name="NOI_DUNG_TD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung trao đổi</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Ghi chú nội dung chăm sóc..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            </div> {/* Closing space-y-4 mb-6 */}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu Kế Hoạch
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
