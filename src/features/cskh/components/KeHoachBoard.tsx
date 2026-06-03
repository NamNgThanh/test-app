"use client";

import { DataTable } from "@/components/ui/data-table";
import { KH_CSKHPublic } from "../action";
import { kehoachColumns } from "./kehoach-columns";

interface KeHoachBoardProps {
  data: KH_CSKHPublic[];
}

export function KeHoachBoard({ data }: KeHoachBoardProps) {
  return <DataTable columns={kehoachColumns} data={data} />;
}
