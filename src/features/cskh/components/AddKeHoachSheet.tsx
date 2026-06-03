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

interface AddKeHoachSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

export function AddKeHoachSheet({ open, onOpenChange, userId = "system" }: AddKeHoachSheetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [options, setOptions] = useState<KeHoachFormOptions | null>(null);

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
  const filteredNguoiLienHe = options?.nguoiLienHeOptions.filter((lh) => !selectedKh || lh.ID_KH === selectedKh) || [];

  const onSubmit = (data: KeHoachCSKHFormData) => {
    startTransition(async () => {
      const submitData = { ...data };
      if (submitData.ID_KH === "none") submitData.ID_KH = "";
      if (submitData.ID_LH === "none") submitData.ID_LH = "";

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

              <FormField
                control={form.control}
                name="ID_LH"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người liên hệ</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
