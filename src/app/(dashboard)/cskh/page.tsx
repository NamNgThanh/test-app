import { Handshake, CalendarDays, Users } from "lucide-react";
import { PageSectionHeader } from "@/components/layouts/PageSectionHeader";
import { getAllKHTN, getAllKeHoachCSKH } from "@/features/cskh/action";
import { AddCskhButton } from "@/features/cskh/components/AddCskhButton";
import { AddKeHoachButton } from "@/features/cskh/components/AddKeHoachButton";
import { CskhBoard } from "@/features/cskh/components/CskhBoard";
import { KeHoachBoard } from "@/features/cskh/components/KeHoachBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function CskhPage() {
  const [khtnResult, kehoachResult] = await Promise.all([
    getAllKHTN(),
    getAllKeHoachCSKH(),
  ]);

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <PageSectionHeader
          icon={Handshake}
          title="Quản lý CSKH"
          description="Quản lý khách hàng tiềm năng và lên kế hoạch chăm sóc"
          iconClassName="w-10 h-10 text-cyan-700"
          titleGradientClassName="from-cyan-900 to-cyan-700"
        />
      </div>

      <Tabs defaultValue="khtn" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="khtn" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Khách Hàng Tiềm Năng
          </TabsTrigger>
          <TabsTrigger value="kehoach" className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Kế Hoạch CSKH
          </TabsTrigger>
        </TabsList>

        <TabsContent value="khtn" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <AddCskhButton />
          </div>
          {khtnResult.success ? (
            <CskhBoard data={khtnResult.data} />
          ) : (
            <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
              <h2 className="font-bold text-lg">Lỗi tải dữ liệu KHTN</h2>
              <p>{khtnResult.error}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="kehoach" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <AddKeHoachButton />
          </div>
          {kehoachResult.success ? (
            <KeHoachBoard data={kehoachResult.data} />
          ) : (
            <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
              <h2 className="font-bold text-lg">Lỗi tải dữ liệu Kế hoạch</h2>
              <p>{kehoachResult.error}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
