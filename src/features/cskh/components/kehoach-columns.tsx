import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { KH_CSKHPublic } from "../action";

export const kehoachColumns: ColumnDef<KH_CSKHPublic>[] = [
  {
    accessorKey: "KHTN.TEN_KH",
    header: "Khách hàng",
    cell: ({ row }) => <span className="font-medium text-slate-900">{row.original.KHTN?.TEN_KH || "—"}</span>,
  },
  {
    accessorKey: "NGUOI_LIEN_HE.TENNGUOI_LIENHE",
    header: "Người LH",
    cell: ({ row }) => <span>{row.original.NGUOI_LIEN_HE?.TENNGUOI_LIENHE || "—"}</span>,
  },
  {
    accessorKey: "LOAI_CHAM_SOC",
    header: "Loại CS",
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-blue-50 text-blue-700">
        {row.original.LOAI_CHAM_SOC.LOAI_CS}
      </Badge>
    ),
  },
  {
    accessorKey: "HINH_THUC",
    header: "Hình thức",
    cell: ({ row }) => <span>{row.original.HINH_THUC === "ONLINE" ? "Online" : "Trực tiếp"}</span>,
  },
  {
    accessorKey: "TG_TU",
    header: "Từ",
    cell: ({ row }) => <span>{formatDate(row.original.TG_TU)}</span>,
  },
  {
    accessorKey: "TG_DEN",
    header: "Đến",
    cell: ({ row }) => <span>{formatDate(row.original.TG_DEN)}</span>,
  },
  {
    accessorKey: "TRANG_THAI",
    header: "Trạng thái",
    cell: ({ row }) => {
      const statusMap: Record<string, { label: string; className: string }> = {
        HOAN_THANH: { label: "Hoàn thành", className: "bg-green-100 text-green-800" },
        CHO_BAO_CAO: { label: "Chờ báo cáo", className: "bg-yellow-100 text-yellow-800" },
        HUY: { label: "Hủy", className: "bg-red-100 text-red-800" },
      };
      const status = statusMap[row.original.TRANG_THAI] || { label: row.original.TRANG_THAI, className: "bg-slate-100 text-slate-800" };
      return <Badge className={status.className} variant="secondary">{status.label}</Badge>;
    },
  },
  {
    accessorKey: "KQ_CS",
    header: "Kết quả",
    cell: ({ row }) => {
      if (!row.original.KQ_CS) return <span>—</span>;
      return (
        <Badge variant={row.original.KQ_CS.IS_TU_CHOI ? "destructive" : "default"}>
          {row.original.KQ_CS.KET_QUA}
        </Badge>
      );
    },
  },
  {
    accessorKey: "NGUOI_CHAM_SOC",
    header: "Người CS",
    cell: ({ row }) => <span>{row.original.NGUOI_CHAM_SOC || "—"}</span>,
  },
];
