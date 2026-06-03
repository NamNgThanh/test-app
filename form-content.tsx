
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-220 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm thống kê KHTN</DialogTitle>
            <DialogDescription>Nhập thông tin khách hàng cần theo dõi chăm sóc.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="PHAN_LOAI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phân loại</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CHUA_THAM_DINH">Chưa thẩm định</SelectItem>
                          <SelectItem value="KHACH_TIEM_NANG">Khách tiềm năng</SelectItem>
                          <SelectItem value="KHONG_PHU_HOP">Không phù hợp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="outline" className="w-full">
                        Thẩm định
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuItem onClick={() => form.setValue("PHAN_LOAI", "KHACH_TIEM_NANG", { shouldValidate: true })}>
                        Tiềm năng
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => form.setValue("PHAN_LOAI", "KHONG_PHU_HOP", { shouldValidate: true })}>
                        Chưa phù hợp
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {isKhongPhuHop && (
                <FormField
                  control={form.control}
                  name="ID_LY_DO_TC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lý do từ chối *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn lý do từ chối" />
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="NGAY_GHI_NHAN"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày ghi nhận *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
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
                <FormField
                  control={form.control}
                  name="TEN_KH"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên KH *</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên khách hàng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        <Input placeholder="email@company.com" {...field} />
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
                      <FormLabel>MST</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mã số thuế"
                          {...field}
                          onBlur={async (e) => {
                            field.onBlur?.();
                            const taxCode = e.target.value?.trim();
                            if (taxCode) {
                              try {
                                const res = await fetch(`https://api.vietqr.io/v2/business/${taxCode}`);
                                if (res.ok) {
                                  const data = await res.json();
                                  if (data.code === "00" && data.data) {
                                    const business = data.data;
                                    if (business.name) form.setValue("TEN_KH", business.name, { shouldValidate: true });
                                    if (business.shortName) form.setValue("TEN_VT", business.shortName, { shouldValidate: true });
                                    if (business.address) form.setValue("DIA_CHI", business.address, { shouldValidate: true });
                                    toast.success("Đã lấy thông tin doanh nghiệp");
                                  } else {
                                    toast.error("Không tìm thấy thông tin doanh nghiệp");
                                  }
                                } else {
                                  toast.error("Lỗi khi kết nối đến hệ thống tra cứu");
                                }
                              } catch (error) {
                                toast.error("Đã xảy ra lỗi khi tra cứu mã số thuế");
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày thành lập</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
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

              <FormField
                control={form.control}
                name="DIA_CHI"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Textarea rows={2} placeholder="Nhập địa chỉ khách hàng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
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
                <div />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ID_NGT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Người giới thiệu {isReferralSource && "*"}</FormLabel>
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
                    className="w-full"
                    onClick={() => setIsReferrerModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm người giới thiệu
                  </Button>
                </div>
              </div>

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

              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isReferrerModalOpen} onOpenChange={setIsReferrerModalOpen}>
