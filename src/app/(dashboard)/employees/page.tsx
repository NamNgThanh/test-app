import { Users } from "lucide-react";
import { PageSectionHeader } from "@/components/layouts/PageSectionHeader";
import { TRANG_THAI_LAM_VIEC } from "@prisma/client";
import { EmployeePublic, getAllEmployees } from "@/features/employees/action";
import { EmployeeBoard } from "@/features/employees/components/EmployeeBoard";
import { AddEmployeeButton } from "@/features/employees/components/AddEmployeeButton";

interface EmployeesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
  const resolvedParams = await searchParams;

  const currentStatus = (resolvedParams.status as TRANG_THAI_LAM_VIEC | "TAT_CA") || "TAT_CA";
  const currentSearch = (typeof resolvedParams.search === 'string' ? resolvedParams.search.toLowerCase() : "");
  const startDateStr = resolvedParams.startDate as string | undefined;
  const endDateStr = resolvedParams.endDate as string | undefined;
  // Parse as local Vietnam time (GMT+7) instead of UTC to avoid off-by-1 day bugs
  const startDate = startDateStr ? new Date(`${startDateStr}T00:00:00+07:00`) : null;
  const endDate = endDateStr ? new Date(`${endDateStr}T23:59:59+07:00`) : null;
  const result = await getAllEmployees();

  if (!result.success) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg m-4 border border-red-200">
        <h2 className="font-bold text-lg">Lỗi tải dữ liệu</h2>
        <p>{result.error}</p>
      </div>
    )
  }

  const allEmployees = result.data || [];

  const dateFilteredEmployees = allEmployees.filter((e: EmployeePublic) => {
    if (!startDate && !endDate) return true;
    
    const empDateStr = e.NGAY_CHINH_THUC || e.NGAY_THU_VIEC;
    if (!empDateStr) return false;
    
    const empDate = new Date(empDateStr);
    
    if (startDate && empDate < startDate) return false;
    
    if (endDate && empDate > endDate) return false;
    
    return true;
  });

  const counts = {
    TAT_CA: dateFilteredEmployees.length,
    DANG_LAM_VIEC: dateFilteredEmployees.filter((e: EmployeePublic) => e.TRANG_THAI === "DANG_LAM_VIEC").length,
    THU_VIEC: dateFilteredEmployees.filter((e: EmployeePublic) => e.TRANG_THAI === "THU_VIEC").length,
    NGHI_VIEC: dateFilteredEmployees.filter((e: EmployeePublic) => e.TRANG_THAI === "NGHI_VIEC").length,
  };

  const filteredEmployees = dateFilteredEmployees.filter((e: EmployeePublic) => {
    const matchesStatus = currentStatus === "TAT_CA" || e.TRANG_THAI === currentStatus;

    const matchesSearch =
      e.HO_VA_TEN.toLowerCase().includes(currentSearch) ||
      e.EMAIL.toLowerCase().includes(currentSearch) ||
      e.MA_NV.toLowerCase().includes(currentSearch) ||
      (e.USER_NAME?.toLowerCase().includes(currentSearch) ?? false);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-3 p-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <PageSectionHeader
          icon={Users}
          title="Danh sách nhân viên"
          description="Quản lý thông tin nhân viên trong hệ thống"
          iconClassName="w-10 h-10 text-yellow-700"
          titleGradientClassName="from-yellow-900 to-yellow-700"
        />
        <AddEmployeeButton />
      </div>

      <EmployeeBoard 
        initialData={filteredEmployees} 
        counts={counts} 
        currentStatus={currentStatus} 
      />
    </div>
  );
}