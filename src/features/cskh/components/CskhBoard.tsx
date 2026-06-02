"use client";

import { DataTable } from "@/components/ui/data-table";
import { CSKHPublic } from "../action";
import { cskhColumns } from "./columns";

interface CskhBoardProps {
  data: CSKHPublic[];
}

export function CskhBoard({ data }: CskhBoardProps) {
  return <DataTable columns={cskhColumns} data={data} />;
}
