import fs from 'fs';
const file = "src/features/cskh/components/AddKeHoachSheet.tsx";
let content = fs.readFileSync(file, 'utf8');

// 1. Add watch variables for ID_KQ
const watchVarStr = `  const selectedKh = form.watch("ID_KH");`;
const newWatchVarStr = `  const selectedKh = form.watch("ID_KH");
  const selectedKq = form.watch("ID_KQ");
  const isTuChoiSelected = options?.kqCsOptions.find((kq) => kq.ID_KQ === selectedKq)?.IS_TU_CHOI === true;`;
content = content.replace(watchVarStr, newWatchVarStr);

// 2. Add FormField for ID_KQ and ID_LY_DO_TC
const formContentStr = `            <FormField
              control={form.control}
              name="NOI_DUNG_TD"`;
              
const newFormContentStr = `            <FormField
              control={form.control}
              name="ID_KQ"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kết quả CSKH</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kết quả CSKH (Tuỳ chọn)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options?.kqCsOptions.map((item) => (
                        <SelectItem key={item.ID_KQ} value={item.ID_KQ}>
                          {item.KET_QUA}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isTuChoiSelected && (
              <FormField
                control={form.control}
                name="ID_LY_DO_TC"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300 bg-red-50 p-4 rounded-lg border border-red-100">
                    <FormLabel className="text-red-800">Lý do từ chối *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-red-200 focus:ring-red-400">
                          <SelectValue placeholder="Vui lòng chọn lý do từ chối" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {options?.lyDoTuChoiOptions.map((item) => (
                          <SelectItem key={item.ID_LY_DO} value={item.ID_LY_DO}>
                            {item.LY_DO}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="NOI_DUNG_TD"`;

content = content.replace(formContentStr, newFormContentStr);

fs.writeFileSync(file, content);
console.log("AddKeHoachSheet modified successfully");
