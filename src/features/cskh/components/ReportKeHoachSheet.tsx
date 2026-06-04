"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  reportKeHoachCSKH,
  KeHoachFormOptions,
  getKeHoachFormOptions,
  KH_CSKHPublic,
} from "../action";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { reportKeHoachCSKHSchema, ReportKeHoachCSKHFormData } from "../schema";

interface ReportKeHoachSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  plan: KH_CSKHPublic | null;
}

export function ReportKeHoachSheet({ open, onOpenChange, userId = "system", plan }: ReportKeHoachSheetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [options, setOptions] = useState<KeHoachFormOptions | null>(null);

  const form = useForm<ReportKeHoachCSKHFormData>({
    resolver: zodResolver(reportKeHoachCSKHSchema),
    defaultValues: {
      NOI_DUNG_TD: "",
      ID_KQ: "",
      ID_LY_DO_TC: "",
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

  useEffect(() => {
    if (open && plan) {
      form.reset({
        NOI_DUNG_TD: plan.NOI_DUNG_TD || "",
        ID_KQ: plan.ID_KQ || "",
        ID_LY_DO_TC: plan.ID_LY_DO_TC || "",
      });
    } else if (!open) {
      form.reset();
    }
  }, [open, plan, form]);

  const selectedKq = form.watch("ID_KQ");
  const isTuChoiSelected = options?.kqCsOptions.find((kq) => kq.ID_KQ === selectedKq)?.IS_TU_CHOI === true;

  const onSubmit = (data: ReportKeHoachCSKHFormData) => {
    if (!plan) return;
    startTransition(async () => {
      const result = await reportKeHoachCSKH(plan.ID_CSKH, data, userId);
      if (!result.success) {
        toast.error(typeof result.error === 'string' ? result.error : "Lỗi báo cáo");
        return;
      }
      toast.success("Đã báo cáo kế hoạch thành công");
      onOpenChange(false);
      form.reset();
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Báo Cáo Kết Quả CSKH</DialogTitle>
          <DialogDescription>Ghi nhận kết quả của kế hoạch chăm sóc</DialogDescription>
        </DialogHeader>

        {plan && (
          <div className="bg-slate-50 border rounded-md p-4 text-sm mb-4 space-y-2">
            <div>
              <span className="font-medium text-slate-500">Khách hàng: </span>
              <span className="text-slate-800 font-semibold">{plan.KHTN?.TEN_KH || "Không có"}</span>
            </div>
            <div>
              <span className="font-medium text-slate-500">Thời gian: </span>
              <span className="text-slate-800 font-medium">
                {format(new Date(plan.TG_TU), "dd/MM/yyyy")} - {format(new Date(plan.TG_DEN), "dd/MM/yyyy")}
              </span>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ID_KQ"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kết quả CSKH *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kết quả CSKH" />
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
                  <FormLabel>Nội dung chăm sóc / Trao đổi</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Ghi chú chi tiết kết quả buổi CSKH..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Báo cáo hoàn thành
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
