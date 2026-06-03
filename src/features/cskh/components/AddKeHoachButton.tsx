"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddKeHoachSheet } from "./AddKeHoachSheet";

export function AddKeHoachButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
        <Plus className="mr-2 h-4 w-4" />
        Lên kế hoạch
      </Button>
      <AddKeHoachSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
