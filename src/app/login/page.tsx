import Link from "next/link";
import { CheckCircle2, Hexagon, Layers, Zap, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex animate-in fade-in duration-500 bg-slate-900 selection:bg-indigo-500/30">
      {/* Left Branding Section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-slate-950 items-center justify-center overflow-hidden">
        
        {/* Abstract Background Effects */}
        <div className="absolute inset-0">
          {/* Subtle Grid */}
          <div 
            className="absolute inset-0 opacity-[0.03]" 
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }} 
          />
          
          {/* Glowing Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-10000" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-10000 delay-5000" />
          <div className="absolute top-[40%] left-[30%] w-[20vw] h-[20vw] bg-blue-500/10 rounded-full blur-[80px] mix-blend-screen pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-2xl px-12 space-y-12 animate-in slide-in-from-left-12 duration-1000 flex flex-col">
          
          {/* Badge */}
          <div className="inline-flex items-center self-start rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-200 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 shadow-[0_0_8px_rgba(129,140,248,0.8)] animate-pulse"></span>
            Phiên bản Enterprise 2.0
          </div>

          {/* Typography */}
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Hệ thống Quản trị
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 drop-shadow-sm">
                Nhân Sự Thông Minh
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl font-light">
              Nền tảng số hóa toàn diện giúp doanh nghiệp tự động hóa quy trình, tối ưu hiệu suất và kiến tạo trải nghiệm nhân viên xuất sắc.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-2 gap-4 max-w-lg pt-4">
            <div className="flex items-center gap-3 text-slate-200 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-xl backdrop-blur-md border border-white/10 transition-all cursor-default group">
              <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
                <Layers className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="font-medium text-sm">Quản lý Hồ sơ</span>
            </div>
            
            <div className="flex items-center gap-3 text-slate-200 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-xl backdrop-blur-md border border-white/10 transition-all cursor-default group">
              <div className="p-2 bg-violet-500/20 rounded-lg group-hover:bg-violet-500/30 transition-colors">
                <Zap className="h-5 w-5 text-violet-400" />
              </div>
              <span className="font-medium text-sm">Chấm công Real-time</span>
            </div>

            <div className="flex items-center gap-3 text-slate-200 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-xl backdrop-blur-md border border-white/10 transition-all cursor-default group">
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <Hexagon className="h-5 w-5 text-blue-400" />
              </div>
              <span className="font-medium text-sm">Tính lương Tự động</span>
            </div>

            <div className="flex items-center gap-3 text-slate-200 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-xl backdrop-blur-md border border-white/10 transition-all cursor-default group">
              <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="font-medium text-sm">Tuyển dụng & Đào tạo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 sm:p-12 bg-white relative shadow-[-20px_0_40px_rgba(0,0,0,0.1)] z-20">
        
        {/* Mobile decorative elements */}
        <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 lg:hidden" />
        
        <div className="w-full max-w-sm space-y-10 animate-in slide-in-from-bottom-8 duration-700 delay-150">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center justify-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
                <span className="text-2xl font-black text-white tracking-tighter">W</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black tracking-tight text-3xl text-slate-900 leading-none">WOWS</span>
                <span className="font-bold tracking-widest text-sm text-indigo-600 leading-none mt-1">HR ADMIN</span>
              </div>
            </Link>
            
            <div className="space-y-2 text-center w-full">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Đăng nhập hệ thống
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Vui lòng nhập thông tin tài khoản của bạn
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white">
            <LoginForm />
          </div>

          {/* Footer */}
          <div className="text-center text-sm font-medium text-slate-400 pt-8">
            <p>&copy; {new Date().getFullYear()} WOWS Technology.</p>
          </div>
        </div>
      </div>
    </div>
  );
}