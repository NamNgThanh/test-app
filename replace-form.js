import fs from 'fs';
const file = "src/features/cskh/components/AddCskhSheet.tsx";
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('Separator')) {
  content = content.replace(
    'import { Button } from "@/components/ui/button";',
    'import { Button } from "@/components/ui/button";\nimport { Separator } from "@/components/ui/separator";'
  );
}

const formStart = '<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">';
const formEnd = '</form>';

const startIndex = content.indexOf(formStart);
const endIndex = content.indexOf(formEnd, startIndex) + formEnd.length;

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find form");
  process.exit(1);
}

const newFormContent = `<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-20">
              {/* --- SECTION 1: THÔNG TIN CHUNG --- */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
                  Thông tin chung
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="MA_KH"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã KH *</FormLabel>
                        <FormControl>
                          <Input disabled readOnly className="bg-slate-100 font-semibold" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="NGAY_GHI_NHAN"
                    render={({ field }) => (
                      <FormItem className="flex flex-col pt-2 mt-0">
                        <FormLabel>Ngày ghi nhận *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={
                                  "w-full pl-3 text-left font-normal " +
                                  (!field.value ? "text-muted-foreground" : "")
                                }
                              >
                                {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="NHOM"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhóm KH *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhóm khách hàng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {NHOM_KH_OPTIONS.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ID_NGUON"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nguồn</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nguồn khách hàng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {nguonOptions.map((item) => (
                              <SelectItem key={item.ID_NGUON} value={item.ID_NGUON}>
                                {item.NGUON}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {isReferralSource && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ID_NGT"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Người giới thiệu *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn người giới thiệu" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Không chọn</SelectItem>
                              {nguoiGioiThieuOptions.map((item) => (
                                <SelectItem key={item.ID_NGT} value={item.ID_NGT}>
                                  {item.TEN_NGT} - {item.SO_DT_NGT}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed text-blue-600 hover:text-blue-700"
                        onClick={() => setIsReferrerModalOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm NGT
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="bg-slate-100" />

              {/* --- SECTION 2: THÔNG TIN KHÁCH HÀNG --- */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
                  Khách hàng
                </h3>
                
                <FormField
                  control={form.control}
                  name="TEN_KH"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên KH *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên khách hàng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="TEN_VT"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên viết tắt</FormLabel>
                        <FormControl>
                          <Input placeholder="VD: WOWS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="HINH_ANH"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hình ảnh (URL)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="MST"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã số thuế</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập MST rồi Enter"
                            {...field}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const mst = field.value?.trim();
                                if (mst) {
                                  try {
                                    const response = await fetch(\`https://api.vietqr.io/v2/business/\${mst}\`);
                                    const result = await response.json();
                                    if (result.code === "00" && result.data) {
                                      form.setValue("TEN_KH", result.data.name, { shouldValidate: true });
                                      if (result.data.address) {
                                        form.setValue("DIA_CHI", result.data.address, { shouldValidate: true });
                                      }
                                      toast.success("Tra cứu thành công");
                                    } else {
                                      toast.error("Không tìm thấy thông tin công ty");
                                    }
                                  } catch (error) {
                                    toast.error("Đã xảy ra lỗi khi tra cứu mã số thuế");
                                  }
                                }
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="NGAY_THANH_LAP"
                    render={({ field }) => (
                      <FormItem className="flex flex-col pt-2 mt-0">
                        <FormLabel>Ngày thành lập</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={
                                  "w-full pl-3 text-left font-normal " +
                                  (!field.value ? "text-muted-foreground" : "")
                                }
                              >
                                {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* --- SECTION 3: LIÊN HỆ --- */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">3</span>
                  Liên hệ
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="DIEN_THOAI"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Điện thoại *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập số điện thoại" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="EMAIL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập email khách hàng" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="DIA_CHI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Textarea rows={2} placeholder="Nhập địa chỉ đầy đủ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-slate-100" />

              {/* --- SECTION 4: THẨM ĐỊNH --- */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">4</span>
                  Thẩm định & Phụ trách
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="SALES_PT"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales phụ trách</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhân viên sales" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="PHAN_LOAI"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đánh giá (Thẩm định)</FormLabel>
                        <div className="flex gap-2">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="flex-1 bg-slate-50">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CHUA_THAM_DINH">Chưa thẩm định</SelectItem>
                              <SelectItem value="KHACH_TIEM_NANG">Khách tiềm năng</SelectItem>
                              <SelectItem value="KHONG_PHU_HOP">Không phù hợp</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button type="button" variant="outline" className="shrink-0 bg-white hover:bg-slate-100 shadow-sm border-blue-200 text-blue-700">
                                Đổi nhanh...
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                              <DropdownMenuItem onClick={() => form.setValue("PHAN_LOAI", "CHUA_THAM_DINH", { shouldValidate: true })}>
                                Đặt lại: Chưa thẩm định
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-green-600 font-medium" onClick={() => form.setValue("PHAN_LOAI", "KHACH_TIEM_NANG", { shouldValidate: true })}>
                                Tiềm năng
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 font-medium" onClick={() => form.setValue("PHAN_LOAI", "KHONG_PHU_HOP", { shouldValidate: true })}>
                                Chưa phù hợp
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {isKhongPhuHop && (
                  <FormField
                    control={form.control}
                    name="ID_LY_DO_TC"
                    render={({ field }) => (
                      <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300 bg-red-50 p-4 rounded-lg border border-red-100 mt-2">
                        <FormLabel className="text-red-800">Vui lòng chọn Lý do từ chối *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-red-200 focus:ring-red-400 bg-white">
                              <SelectValue placeholder="Chọn lý do..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {lyDoTuChoiOptions.map((item) => (
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
              </div>

              {/* STICKY FOOTER */}
              <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4 px-6 flex justify-end gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-b-lg">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 min-w-[120px] shadow-sm">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isPending ? "Đang lưu..." : "Lưu dữ liệu"}
                </Button>
              </div>
            </form>`;

content = content.slice(0, startIndex) + newFormContent + content.slice(endIndex);

fs.writeFileSync(file, content);
console.log("Done");
