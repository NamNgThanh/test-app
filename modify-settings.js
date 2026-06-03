import fs from 'fs';
const file = "src/components/layouts/SettingsSheet.tsx";
let content = fs.readFileSync(file, 'utf8');

// 1. Add imports
content = content.replace(
  'deleteNguonKhachHang,',
  `deleteNguonKhachHang,
  getKqCskh,
  addKqCskh,
  toggleKqCskh,
  deleteKqCskh,`
);

// 2. Add Tab Trigger
content = content.replace(
  '<TabsList className="grid w-full grid-cols-3 mb-6">',
  '<TabsList className="grid w-full grid-cols-4 mb-6">'
);
content = content.replace(
  '<TabsTrigger value="nguon-kh">Nguồn KH</TabsTrigger>',
  '<TabsTrigger value="nguon-kh">Nguồn KH</TabsTrigger>\n              <TabsTrigger value="kq-cskh">KQ CSKH</TabsTrigger>'
);

// 3. Add Tab Content
content = content.replace(
  '</TabsContent>\n          </Tabs>',
  `</TabsContent>
            <TabsContent value="kq-cskh" className="mt-0">
              <KqCskhManager />
            </TabsContent>
          </Tabs>`
);

// 4. Append KqCskhManager at the end of the file
const managerCode = `
function KqCskhManager() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<any[]>([]);
  const [newValue, setNewValue] = useState("");
  const [isTuChoi, setIsTuChoi] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const res = await getKqCskh();
    if (res.success && res.data) {
      setItems(res.data);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = () => {
    if (!newValue.trim()) return;
    startTransition(async () => {
      const res = await addKqCskh(newValue.trim(), isTuChoi);
      if (res.success) {
        toast.success("Thêm kết quả CSKH thành công");
        setNewValue("");
        setIsTuChoi(false);
        fetchItems();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const res = await toggleKqCskh(id, currentStatus);
      if (res.success) {
        fetchItems();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteKqCskh(id);
      if (res.success) {
        toast.success("Đã xoá kết quả CSKH");
        fetchItems();
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
        <h3 className="font-medium text-slate-800">Thêm Kết quả CSKH mới</h3>
        <div className="flex gap-2">
          <Input 
            placeholder="Nhập tên kết quả CSKH..." 
            value={newValue} 
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            disabled={isPending}
          />
          <Button onClick={handleAdd} disabled={isPending || !newValue.trim()} className="shrink-0 bg-blue-600 hover:bg-blue-700">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Thêm
          </Button>
        </div>
        <div className="flex items-center space-x-2 pt-2 border-t">
          <Switch id="isTuChoi" checked={isTuChoi} onCheckedChange={setIsTuChoi} disabled={isPending} />
          <label htmlFor="isTuChoi" className="text-sm font-medium text-slate-700 cursor-pointer">
            Là kết quả <span className="text-red-600 font-semibold">Từ chối</span> (Sẽ yêu cầu nhập Lý do từ chối)
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b flex justify-between items-center">
          <span className="font-medium text-slate-700 text-sm">Danh sách Kết quả CSKH</span>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
        </div>
        
        <div className="divide-y max-h-[50vh] overflow-y-auto">
          {items.length === 0 && !loading ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
              <Info className="w-8 h-8 mb-2 text-slate-300" />
              Chưa có dữ liệu. Hãy thêm mới!
            </div>
          ) : (
            items.map((item) => (
              <div key={item.ID_KQ} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                <div className="flex flex-col">
                  <span className={\`font-medium \${!item.HIEU_LUC ? 'text-slate-400 line-through' : 'text-slate-700'}\`}>
                    {item.KET_QUA}
                  </span>
                  {item.IS_TU_CHOI && (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md self-start mt-1 border border-red-100">
                      Loại: Từ chối
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={item.HIEU_LUC} 
                    onCheckedChange={() => handleToggle(item.ID_KQ, item.HIEU_LUC)}
                    disabled={isPending}
                    title={item.HIEU_LUC ? "Đang hiện" : "Đang ẩn"}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xoá Kết quả CSKH này?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Các kế hoạch đang sử dụng kết quả này có thể bị ảnh hưởng (mất tên kết quả).
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.ID_KQ)} className="bg-red-600 hover:bg-red-700">
                          Xoá
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
`;

content += managerCode;

fs.writeFileSync(file, content);
console.log("Settings modified successfully");
