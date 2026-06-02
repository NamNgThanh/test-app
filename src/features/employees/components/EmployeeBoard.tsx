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
      <StatusFilterBar 
        options={filterOptions}
        currentValue={activeStatus}
        onSelect={handleStatusChange}
      />

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