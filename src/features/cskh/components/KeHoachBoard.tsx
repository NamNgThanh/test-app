"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { KH_CSKHPublic } from "../action";
import { kehoachColumns } from "./kehoach-columns";
import { ReportKeHoachSheet } from "./ReportKeHoachSheet";

interface KeHoachBoardProps {
  data: KH_CSKHPublic[];
}

export function KeHoachBoard({ data }: KeHoachBoardProps) {
  const [selectedPlan, setSelectedPlan] = useState<KH_CSKHPublic | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleRowClick = (row: KH_CSKHPublic) => {
    setSelectedPlan(row);
    setIsEditOpen(true);
  };

  return (
    <>
      <DataTable 
        columns={kehoachColumns} 
        data={data} 
        onRowClick={handleRowClick} 
        isRowClickable={(row) => row.TRANG_THAI === 'CHO_BAO_CAO'}
      />
      <ReportKeHoachSheet 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        plan={selectedPlan} 
      />
    </>
  );
}
