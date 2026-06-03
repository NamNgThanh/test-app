"use client"

import { EmployeePublic } from "../action";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { getColumns } from "./columns";
import { FilterOption, StatusFilterBar } from "@/components/ui/status-filter-bar";
import { UserRoundCheck, UserRoundX, Users } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

interface EmployeeBoardProps {
  initialData: EmployeePublic[];
  counts: Record<string, number>;
  currentStatus: string;
}

export const EmployeeBoard = ({ initialData, counts, currentStatus }: EmployeeBoardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [activeStatus, setActiveStatus] = useState(currentStatus);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeePublic | null>(null);

  useEffect(() => {
    setActiveStatus(currentStatus);
  }, [currentStatus]);

  const columns = useMemo(() => {
    return getColumns((employee) => {
      setSelectedEmployee(employee);
      setIsDetailOpen(true);
    });
  }, []);

  const filterOptions: FilterOption[] = useMemo(() => [
    { value: "TAT_CA", label: "Tất cả", count: counts.TAT_CA, icon: Users, color: "blue" },
    { value: "DANG_LAM_VIEC", label: "Đang làm việc", count: counts.DANG_LAM_VIEC, icon: UserRoundCheck, color: "green" },
    { value: "THU_VIEC", label: "Thử việc", count: counts.THU_VIEC, icon: UserRoundCheck, color: "orange" },
    { value: "NGHI_VIEC", label: "Đã nghỉ việc", count: counts.NGHI_VIEC, icon: UserRoundX, color: "red" },
  ], [counts]);

  const handleStatusChange = (value: string) => {
    setActiveStatus(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value === "TAT_CA") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <>
      {/* Modern Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {filterOptions.map((option) => {
          const isActive = option.value === activeStatus;
          const Icon = option.icon;
          
          return (
            <div
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`relative overflow-hidden cursor-pointer rounded-2xl border transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-br from-orange-500 to-amber-600 border-orange-500 shadow-lg shadow-orange-500/30 translate-y-[-4px]' 
                  : 'bg-white border-slate-200 hover:border-orange-200 hover:shadow-md hover:translate-y-[-2px]'
              }`}
            >
              <div className="p-5 flex flex-col justify-between h-full relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-2xl font-bold ${isActive ? 'text-white drop-shadow-sm' : 'text-slate-900'}`}>
                    {option.count}
                  </span>
                </div>
                <h3 className={`font-medium text-sm ${isActive ? 'text-orange-50 font-semibold' : 'text-slate-600'}`}>
                  {option.label}
                </h3>
              </div>
              
              {/* Decorative background element */}
              <div className={`absolute -right-8 -bottom-8 transition-transform duration-500 ${isActive ? 'opacity-20 text-white scale-110' : 'opacity-5 text-orange-500'}`}>
                <Icon className="w-32 h-32" />
              </div>
            </div>
          );
        })}
      </div>

      <DataTable 
        columns={columns}
        data={initialData}
        isLoading={isPending}
        onRowClick={(employee) => {
          setSelectedEmployee(employee);
          setIsDetailOpen(true);
        }}
      />
    </>
  )
}