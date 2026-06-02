import { Handshake } from "lucide-react";
import { PageSectionHeader } from "@/components/layouts/PageSectionHeader";
import { getAllCSKH } from "@/features/cskh/action";
import { AddCskhButton } from "@/features/cskh/components/AddCskhButton";
import { CskhBoard } from "@/features/cskh/components/CskhBoard";

export default async function CskhPage() {
  const result = await getAllCSKH();

  if (!result.success) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg m-4 border border-red-200">
        <h2 className="font-bold text-lg">Lỗi tải dữ liệu</h2>
        <p>{result.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <PageSectionHeader
          icon={Handshake}
          title="Thống kê CSKH"
          description="Theo dõi thông tin chăm sóc khách hàng"
          iconClassName="w-10 h-10 text-cyan-700"
          titleGradientClassName="from-cyan-900 to-cyan-700"
        />
        <AddCskhButton />
      </div>

      <CskhBoard data={result.data} />
    </div>
  );
}
