"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddCskhSheet } from "./AddCskhSheet";

export function AddCskhButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="mr-2 h-4 w-4" />
        Thêm KHTN
      </Button>
      <AddCskhSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
