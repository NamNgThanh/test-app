import fs from 'fs';
const file = "src/features/cskh/components/AddKeHoachSheet.tsx";
let content = fs.readFileSync(file, 'utf8');

// 1. Add imports
content = content.replace(
  'createKeHoachCSKHSchema, KeHoachCSKHFormData } from "../schema";',
  'createKeHoachCSKHSchema, KeHoachCSKHFormData } from "../schema";\nimport { createNguoiLienHe, createNguoiDaiDien } from "../action";\nimport { Plus } from "lucide-react";'
);

// 2. Add selectedDd and isDaiDienModalOpen states
content = content.replace(
  'const [options, setOptions] = useState<KeHoachFormOptions | null>(null);',
  `const [options, setOptions] = useState<KeHoachFormOptions | null>(null);
  const [isLienHeModalOpen, setIsLienHeModalOpen] = useState(false);
  const [isDaiDienModalOpen, setIsDaiDienModalOpen] = useState(false);
  
  const [newLienHe, setNewLienHe] = useState({ TENNGUOI_LIENHE: "", CHUC_VU: "", SDT: "", EMAIL: "", GHI_CHU: "" });
  const [newDaiDien, setNewDaiDien] = useState({ TEN_NGUOI_DD: "", CHUC_VU: "", SDT: "", EMAIL: "" });`
);

content = content.replace(
  'const filteredNguoiLienHe = options?.nguoiLienHeOptions.filter((lh) => !selectedKh || lh.ID_KH === selectedKh) || [];',
  `const filteredNguoiLienHe = options?.nguoiLienHeOptions.filter((lh) => !selectedKh || lh.ID_KH === selectedKh) || [];
  const filteredNguoiDaiDien = options?.nguoiDaiDienOptions.filter((dd) => !selectedKh || dd.ID_KH === selectedKh) || [];`
);

// 3. Add handle actions
const onSubmitReplace = `const onSubmit = (data: KeHoachCSKHFormData) => {`;
const newHandles = `
  const handleAddLienHe = () => {
    if (!selectedKh) return toast.error("Vui lòng chọn khách hàng trước");
    if (!newLienHe.TENNGUOI_LIENHE || !newLienHe.SDT) return toast.error("Vui lòng nhập Tên và SĐT");
    startTransition(async () => {
      const res = await createNguoiLienHe({ ID_KH: selectedKh, ...newLienHe });
      if (res.success) {
        toast.success("Thêm người liên hệ thành công");
        const newOptions = await getKeHoachFormOptions();
        if (newOptions.success) setOptions(newOptions.data);
        setIsLienHeModalOpen(false);
        form.setValue("ID_LH", res.data.ID_LH);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleAddDaiDien = () => {
    if (!selectedKh) return toast.error("Vui lòng chọn khách hàng trước");
    if (!newDaiDien.TEN_NGUOI_DD || !newDaiDien.SDT) return toast.error("Vui lòng nhập Tên và SĐT");
    startTransition(async () => {
      const res = await createNguoiDaiDien({ ID_KH: selectedKh, ...newDaiDien });
      if (res.success) {
        toast.success("Thêm người đại diện thành công");
        const newOptions = await getKeHoachFormOptions();
        if (newOptions.success) setOptions(newOptions.data);
        setIsDaiDienModalOpen(false);
        form.setValue("ID_DD", res.data.ID_DD);
      } else {
        toast.error(res.message);
      }
    });
  };

  const onSubmit = (data: KeHoachCSKHFormData) => {`;
content = content.replace(onSubmitReplace, newHandles);

// 4. Form values override
content = content.replace(
  'if (submitData.ID_LH === "none") submitData.ID_LH = "";',
  'if (submitData.ID_LH === "none") submitData.ID_LH = "";\n      if (submitData.ID_DD === "none") submitData.ID_DD = "";'
);

// 5. Replace grid layout for KH and LH
const oldGrid = `<div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ID_KH"`;

const newGrid = `<div className="space-y-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
                Khách hàng & Liên hệ
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ID_KH"`;
content = content.replace(oldGrid, newGrid);

// 6. Replace LH dropdown with grid + add DD
const lhStr = `<FormField
                control={form.control}
                name="ID_LH"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người liên hệ</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn người liên hệ (Tuỳ chọn)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Không chọn</SelectItem>
                        {filteredNguoiLienHe.map((item) => (
                          <SelectItem key={item.ID_LH} value={item.ID_LH}>
                            {item.TENNGUOI_LIENHE}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>`;

const newLhStr = `<div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="ID_LH"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Người liên hệ</FormLabel>
                        <div className="flex gap-2">
                          <Select onValueChange={field.onChange} value={field.value} disabled={!selectedKh}>
                            <FormControl>
                              <SelectTrigger className="flex-1 bg-white">
                                <SelectValue placeholder="Chọn người liên hệ (Tuỳ chọn)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Không chọn</SelectItem>
                              {filteredNguoiLienHe.map((item) => (
                                <SelectItem key={item.ID_LH} value={item.ID_LH}>
                                  {item.TENNGUOI_LIENHE}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            className="shrink-0" 
                            disabled={!selectedKh}
                            onClick={() => setIsLienHeModalOpen(!isLienHeModalOpen)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isLienHeModalOpen && (
                    <div className="bg-slate-50 p-4 rounded-lg border space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="text-sm font-semibold text-slate-700">Thêm người liên hệ mới</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Tên người liên hệ *" value={newLienHe.TENNGUOI_LIENHE} onChange={e => setNewLienHe({...newLienHe, TENNGUOI_LIENHE: e.target.value})} />
                        <Input placeholder="Số điện thoại *" value={newLienHe.SDT} onChange={e => setNewLienHe({...newLienHe, SDT: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Chức vụ" value={newLienHe.CHUC_VU} onChange={e => setNewLienHe({...newLienHe, CHUC_VU: e.target.value})} />
                        <Input placeholder="Email" value={newLienHe.EMAIL} onChange={e => setNewLienHe({...newLienHe, EMAIL: e.target.value})} />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => setIsLienHeModalOpen(false)}>Hủy</Button>
                        <Button type="button" size="sm" disabled={isPending} onClick={handleAddLienHe}>
                          {isPending && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                          Lưu & Chọn
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="ID_DD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Người đại diện</FormLabel>
                        <div className="flex gap-2">
                          <Select onValueChange={field.onChange} value={field.value} disabled={!selectedKh}>
                            <FormControl>
                              <SelectTrigger className="flex-1 bg-white">
                                <SelectValue placeholder="Chọn người đại diện (Tuỳ chọn)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Không chọn</SelectItem>
                              {filteredNguoiDaiDien.map((item) => (
                                <SelectItem key={item.ID_DD} value={item.ID_DD}>
                                  {item.TEN_NGUOI_DD}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            className="shrink-0" 
                            disabled={!selectedKh}
                            onClick={() => setIsDaiDienModalOpen(!isDaiDienModalOpen)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isDaiDienModalOpen && (
                    <div className="bg-slate-50 p-4 rounded-lg border space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 col-span-2">
                      <p className="text-sm font-semibold text-slate-700">Thêm người đại diện mới</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Tên người đại diện *" value={newDaiDien.TEN_NGUOI_DD} onChange={e => setNewDaiDien({...newDaiDien, TEN_NGUOI_DD: e.target.value})} />
                        <Input placeholder="Số điện thoại *" value={newDaiDien.SDT} onChange={e => setNewDaiDien({...newDaiDien, SDT: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Chức vụ" value={newDaiDien.CHUC_VU} onChange={e => setNewDaiDien({...newDaiDien, CHUC_VU: e.target.value})} />
                        <Input placeholder="Email" value={newDaiDien.EMAIL} onChange={e => setNewDaiDien({...newDaiDien, EMAIL: e.target.value})} />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => setIsDaiDienModalOpen(false)}>Hủy</Button>
                        <Button type="button" size="sm" disabled={isPending} onClick={handleAddDaiDien}>
                          {isPending && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                          Lưu & Chọn
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-t pt-4">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
                Nội dung kế hoạch
              </h3>
`;

content = content.replace(lhStr, newLhStr);


fs.writeFileSync(file, content);
console.log("AddKeHoachSheet updated with new layouts");
