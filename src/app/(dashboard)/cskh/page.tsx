import { Handshake, CalendarDays, Users, TrendingUp, Clock, CheckCircle2, Target } from "lucide-react";
import { PageSectionHeader } from "@/components/layouts/PageSectionHeader";
import { getAllKHTN, getAllKeHoachCSKH } from "@/features/cskh/action";
import { AddCskhButton } from "@/features/cskh/components/AddCskhButton";
import { AddKeHoachButton } from "@/features/cskh/components/AddKeHoachButton";
import { CskhBoard } from "@/features/cskh/components/CskhBoard";
import { KeHoachBoard } from "@/features/cskh/components/KeHoachBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CskhPage() {
  const [khtnResult, kehoachResult] = await Promise.all([
    getAllKHTN(),
    getAllKeHoachCSKH(),
  ]);

  const khtnList = khtnResult.success ? khtnResult.data : [];
  const kehoachList = kehoachResult.success ? kehoachResult.data : [];

  const totalKHTN = khtnList.length;
  const totalKeHoach = kehoachList.length;
  const completedKeHoach = kehoachList.filter((k) => k.TRANG_THAI === "HOAN_THANH").length;
  const pendingKeHoach = kehoachList.filter((k) => k.TRANG_THAI === "CHO_BAO_CAO").length;

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
        <PageSectionHeader
          icon={Handshake}
          title="Quản lý CSKH"
          description="Khám phá và quản lý toàn bộ dữ liệu khách hàng tiềm năng cùng các kế hoạch chăm sóc"
          iconClassName="w-12 h-12 text-blue-600 bg-blue-50 p-2 rounded-lg"
          titleGradientClassName="from-slate-900 to-slate-700 font-bold"
        />
        <div className="flex gap-2 items-center">
          <AddCskhButton />
          <AddKeHoachButton />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-all duration-200 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Tổng Khách hàng</CardTitle>
            <div className="p-2 bg-blue-50 rounded-full">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalKHTN}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> Tỉ lệ chuyển đổi tích cực
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-200 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Tổng Kế hoạch</CardTitle>
            <div className="p-2 bg-indigo-50 rounded-full">
              <Target className="w-4 h-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalKeHoach}</div>
            <p className="text-xs text-slate-500 mt-1">Chiến dịch CSKH đã lập</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-200 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Chờ Báo cáo</CardTitle>
            <div className="p-2 bg-amber-50 rounded-full">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{pendingKeHoach}</div>
            <p className="text-xs text-slate-500 mt-1">Cần cập nhật kết quả</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-200 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Hoàn thành</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{completedKeHoach}</div>
            <p className="text-xs text-slate-500 mt-1">Kế hoạch đã đóng</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="khtn" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 p-1 bg-slate-100/80 rounded-lg">
          <TabsTrigger value="khtn" className="flex items-center gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            <Users className="w-4 h-4" />
            Dữ liệu Khách Hàng
          </TabsTrigger>
          <TabsTrigger value="kehoach" className="flex items-center gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            <CalendarDays className="w-4 h-4" />
            Bảng Kế Hoạch
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <TabsContent value="khtn" className="m-0 focus-visible:outline-none">
            {khtnResult.success ? (
              <CskhBoard data={khtnResult.data} />
            ) : (
              <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-100 flex flex-col items-center">
                <div className="bg-red-100 p-3 rounded-full mb-3">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="font-bold text-lg">Lỗi tải dữ liệu KHTN</h2>
                <p className="text-sm mt-1">{khtnResult.error}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="kehoach" className="m-0 focus-visible:outline-none">
            {kehoachResult.success ? (
              <KeHoachBoard data={kehoachResult.data} />
            ) : (
              <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-100 flex flex-col items-center">
                <div className="bg-red-100 p-3 rounded-full mb-3">
                  <CalendarDays className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="font-bold text-lg">Lỗi tải dữ liệu Kế hoạch</h2>
                <p className="text-sm mt-1">{kehoachResult.error}</p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
