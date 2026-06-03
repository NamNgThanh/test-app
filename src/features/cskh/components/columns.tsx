import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { KHTNPublic } from "../action";
import { NHOM_KH_LABELS } from "../constants";

export const cskhColumns: ColumnDef<KHTNPublic>[] = [
  {
    accessorKey: "MA_KH",
    header: "Mã KH",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="font-mono">
          {row.original.MA_KH}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "TEN_KH",
    header: "Tên khách hàng",
    cell: ({ row }) => <span className="font-medium text-slate-900">{row.original.TEN_KH}</span>,
  },
  {
    accessorKey: "NHOM",
    header: "Nhóm KH",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-700">
          {NHOM_KH_LABELS[row.original.NHOM_KH.NHOM]}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "DIEN_THOAI",
    header: "Điện thoại",
    cell: ({ row }) => <span>{row.original.DIEN_THOAI}</span>,
  },
  {
    accessorKey: "EMAIL",
    header: "Email",
    cell: ({ row }) => <span>{row.original.EMAIL || "—"}</span>,
  },
  {
    accessorKey: "NGUON_KH",
    header: "Nguồn",
    cell: ({ row }) => <span>{row.original.NGUON_KH.NGUON || "—"}</span>,
  },
  {
    accessorKey: "NGUOI_GIOI_THIEU",
    header: "Người giới thiệu",
    cell: ({ row }) => <span>{row.original.NGUOI_GIOI_THIEU?.TEN_NGT || "—"}</span>,
  },
  {
    accessorKey: "PHAN_LOAI",
    header: "Phân loại",
    cell: ({ row }) => {
      const labels: Record<string, string> = {
        CHUA_THAM_DINH: "Chưa thẩm định",
        KHACH_TIEM_NANG: "Khách tiềm năng",
        KHONG_PHU_HOP: "Không phù hợp",
      };
      return <span>{labels[row.original.PHAN_LOAI] || row.original.PHAN_LOAI}</span>;
    },
  },
  {
    accessorKey: "LY_DO_TU_CHOI",
    header: "Lý do từ chối",
    cell: ({ row }) => <span>{row.original.LY_DO_TU_CHOI?.LY_DO || "—"}</span>,
  },
  {
    accessorKey: "SALES_PT",
    header: "Sales PT",
    cell: ({ row }) => <span>{row.original.SALES_PT || "—"}</span>,
  },
  {
    accessorKey: "NV_CS",
    header: "NV CS",
    cell: ({ row }) => <span>{row.original.NV_CS || "—"}</span>,
  },
  {
    accessorKey: "NGAY_GHI_NHAN",
    header: "Ngày ghi nhận",
    cell: ({ row }) => <span>{formatDate(row.original.NGAY_GHI_NHAN)}</span>,
  },
];
