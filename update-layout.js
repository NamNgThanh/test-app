import fs from 'fs';
const file = "src/features/cskh/components/AddCskhSheet.tsx";
let content = fs.readFileSync(file, 'utf8');

// 1. Add Key icon
content = content.replace(
  'import { CalendarIcon, Loader2, Plus } from "lucide-react";',
  'import { CalendarIcon, Loader2, Plus, Key } from "lucide-react";'
);

// 2. Change the DialogContent class and restructure Form to handle flex
content = content.replace(
  '<DialogContent className="sm:max-w-220 max-h-[90vh] overflow-y-auto">',
  '<DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">'
);

content = content.replace(
  '<DialogHeader>',
  '<div className="flex-1 overflow-y-auto p-6"><DialogHeader className="mb-6">'
);

content = content.replace(
  '<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-20">',
  '<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">'
);

// We need to move the sticky footer out of the scrollable area and wrap it correctly
const oldFooter = `              {/* STICKY FOOTER */}
              <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 z-10 border-t bg-white p-4 px-6 flex justify-end gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 min-w-[120px] shadow-sm">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isPending ? "Đang lưu..." : "Lưu dữ liệu"}
                </Button>
              </div>
            </form>`;

const newFooter = `            </form>
          </div>
          {/* FIXED FOOTER */}
          <div className="border-t bg-white p-4 px-6 flex justify-end gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-b-lg">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Hủy
            </Button>
            <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isPending} className="bg-blue-600 hover:bg-blue-700 min-w-[120px] shadow-sm">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isPending ? "Đang lưu..." : "Lưu dữ liệu"}
            </Button>
          </div>`;

content = content.replace(oldFooter, newFooter);

// 3. Change "Đổi nhanh..." button to Key icon
const oldButton = `<Button type="button" variant="outline" className="shrink-0 bg-white hover:bg-slate-100 shadow-sm border-blue-200 text-blue-700">
                                Đổi nhanh...
                              </Button>`;
const newButton = `<Button type="button" variant="outline" size="icon" className="shrink-0 bg-white hover:bg-slate-100 shadow-sm border-blue-200 text-blue-700">
                                <Key className="h-4 w-4" />
                              </Button>`;
                              
content = content.replace(oldButton, newButton);

fs.writeFileSync(file, content);
console.log("Done");
