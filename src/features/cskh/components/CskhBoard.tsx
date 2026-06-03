"use client";

import { DataTable } from "@/components/ui/data-table";
import { KHTNPublic } from "../action";
import { cskhColumns } from "./columns";

interface CskhBoardProps {
  data: KHTNPublic[];
}

export function CskhBoard({ data }: CskhBoardProps) {
  return <DataTable columns={cskhColumns} data={data} />;
}
