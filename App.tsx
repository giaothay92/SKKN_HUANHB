
import React, { useState } from 'react';
import * as geminiService from './services/geminiService';
import { ReportData, AppStep } from './types';
import InputForm from './components/InputForm';
import StepEditor from './components/StepEditor';
import ReportView from './components/ReportView';
import LoadingView from './components/LoadingView';
import { BookOpen, Sparkles, LayoutDashboard, CheckCircle2, ChevronRight, Menu, X, Phone, Facebook } from 'lucide-react';

const App: React.FC = () => {
  const [report, setReport] = useState<ReportData>({
    title: '',
    focus: '',
    target: '',
    region: '',
    year: '',
    part1_introduction: '',
    part2_theory_status: '',
    part2_solutions: '',
    part2_results: '',
    part3_conclusion: '',
    part4_references: ''
  });
  
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.INPUT);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleStart = async (data: { topic: string, focus: string, target: string, region: string, year: string }) => {
    const newReport = { ...report, ...data, title: data.topic };
    setReport(newReport);
    setCurrentStep(AppStep.GENERATING_PART1);
    try {
      const part1 = await geminiService.generatePart1(newReport);
      setReport(prev => ({ ...prev, part1_introduction: part1 }));
      setCurrentStep(AppStep.EDITING_PART1);
    } catch (err: any) { handleError(err); setCurrentStep(AppStep.INPUT); }
  };

  const handleConfirmPart1 = async (content: string) => {
    setReport(prev => ({ ...prev, part1_introduction: content }));
    setCurrentStep(AppStep.GENERATING_PART2A);
    try {
        const part2a = await geminiService.generatePart2A({ ...report, part1_introduction: content }, content);
        setReport(prev => ({ ...prev, part2_theory_status: part2a }));
        setCurrentStep(AppStep.EDITING_PART2A);
    } catch (err: any) { handleError(err); setCurrentStep(AppStep.EDITING_PART1); }
  };

  const handleConfirmPart2A = async (content: string) => {
    setReport(prev => ({ ...prev, part2_theory_status: content }));
    setCurrentStep(AppStep.GENERATING_PART2B);
    try {
        const part2b = await geminiService.generatePart2B({ ...report, part2_theory_status: content }, content);
        setReport(prev => ({ ...prev, part2_solutions: part2b }));
        setCurrentStep(AppStep.EDITING_PART2B);
    } catch (err: any) { handleError(err); setCurrentStep(AppStep.EDITING_PART2A); }
  };

  const handleConfirmPart2B = async (content: string) => {
    setReport(prev => ({ ...prev, part2_solutions: content }));
    setCurrentStep(AppStep.GENERATING_PART2C);
    try {
        const part2c = await geminiService.generatePart2C({ ...report, part2_solutions: content }, content);
        setReport(prev => ({ ...prev, part2_results: part2c }));
        setCurrentStep(AppStep.EDITING_PART2C);
    } catch (err: any) { handleError(err); setCurrentStep(AppStep.EDITING_PART2B); }
  };

  const handleConfirmPart2C = async (content: string) => {
    setReport(prev => ({ ...prev, part2_results: content }));
    setCurrentStep(AppStep.GENERATING_PART34);
    try {
        const part34 = await geminiService.generatePart34({ ...report, part2_results: content });
        const parts = part34.split('IV. TÀI LIỆU THAM KHẢO');
        setReport(prev => ({ ...prev, part3_conclusion: parts[0].trim(), part4_references: 'IV. TÀI LIỆU THAM KHẢO' + (parts[1] || '') }));
        setCurrentStep(AppStep.EDITING_PART34);
    } catch (err: any) { handleError(err); setCurrentStep(AppStep.EDITING_PART2C); }
  };

  const handleConfirmPart34 = (content: string) => {
    const parts = content.split('IV. TÀI LIỆU THAM KHẢO');
    setReport(prev => ({ 
        ...prev, 
        part3_conclusion: parts[0].trim(), 
        part4_references: parts[1] ? 'IV. TÀI LIỆU THAM KHẢO' + parts[1] : prev.part4_references 
    }));
    setCurrentStep(AppStep.FINISHED);
  };

  const handleError = (err: any) => {
    console.error(err);
    setError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
  };

  const steps = [
    { key: AppStep.EDITING_PART1, label: 'Phần Mở Đầu', hasData: !!report.part1_introduction },
    { key: AppStep.EDITING_PART2A, label: 'Thực Trạng', hasData: !!report.part2_theory_status },
    { key: AppStep.EDITING_PART2B, label: 'Giải Pháp', hasData: !!report.part2_solutions },
    { key: AppStep.EDITING_PART2C, label: 'Kết Quả', hasData: !!report.part2_results },
    { key: AppStep.EDITING_PART34, label: 'Kết Luận', hasData: !!report.part3_conclusion },
    { key: AppStep.FINISHED, label: 'Hoàn Tất', hasData: currentStep === AppStep.FINISHED }
  ];

  const getCurrentIdx = () => {
    if (currentStep === AppStep.INPUT) return -1;
    if (currentStep.includes('PART1')) return 0;
    if (currentStep.includes('PART2A')) return 1;
    if (currentStep.includes('PART2B')) return 2;
    if (currentStep.includes('PART2C')) return 3;
    if (currentStep.includes('PART34')) return 4;
    return 5;
  };

  return (
    <div className="min-h-screen flex bg-dashboard">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-primary-600 text-white rounded-full shadow-2xl lg:hidden active:scale-90 transition-transform"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 glass-effect border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        no-print
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                <LayoutDashboard className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight">Trợ lý Sáng Kiến</h1>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Phiên bản v4.0</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Tiến độ thực hiện</p>
            {steps.map((s, idx) => {
              const isActive = idx === getCurrentIdx();
              const isDone = s.hasData && !isActive;
              const isLocked = !s.hasData && !isActive && idx > getCurrentIdx();

              return (
                <button
                  key={s.key}
                  disabled={isLocked}
                  onClick={() => s.hasData && setCurrentStep(s.key)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                    ${isActive ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100' : 
                      isDone ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-300 cursor-not-allowed'}
                  `}
                >
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors
                    ${isActive ? 'bg-primary-600 border-primary-600 text-white' : 
                      isDone ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'border-slate-200'}
                  `}>
                    {isDone ? <CheckCircle2 size={14} /> : idx + 1}
                  </div>
                  <span className="text-sm font-semibold flex-1 text-left">{s.label}</span>
                  {isActive && <ChevronRight size={14} className="animate-pulse" />}
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Sparkles size={16} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Trợ lý Sáng kiến</p>
                    <p className="text-xs font-bold text-slate-700">ĐOÀN KIÊN TRUNG</p>
                </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500">
                <LayoutDashboard size={14} />
                <span>Bàn làm việc</span>
                <ChevronRight size={12} />
                <span className="text-slate-900">{currentStep === AppStep.INPUT ? 'Tạo mới' : 'Đang thực hiện'}</span>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase border border-amber-100">
                TRỢ LÝ ĐƯỢC PHÁT TRIỂN BỞI: THẦY ĐOÀN KIÊN TRUNG - ZALO: 0909629947 - <span className="text-rose-600 font-bold">ỦNG HỘ TÁC GIẢ: STK BIDV 8870889643</span>
             </div>
          </div>
        </header>

        {/* Workspace Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col">
           <div className="max-w-5xl mx-auto flex-1 w-full">
              {error && (
                <div className="mb-6 animate-slide-up bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-4 text-rose-800 shadow-sm">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-rose-600 shadow-sm">!</div>
                   <div className="flex-1">
                      <p className="font-bold text-sm">Lỗi xử lý</p>
                      <p className="text-xs opacity-80">{error}</p>
                   </div>
                   <button onClick={() => setError(null)} className="text-xs font-bold underline px-4">Đóng</button>
                </div>
              )}

              {currentStep === AppStep.INPUT && (
                <div className="animate-slide-up h-full flex items-center justify-center py-10">
                   <InputForm onGenerate={handleStart} />
                </div>
              )}

              {[AppStep.GENERATING_PART1, AppStep.GENERATING_PART2A, AppStep.GENERATING_PART2B, AppStep.GENERATING_PART2C, AppStep.GENERATING_PART34].includes(currentStep) && (
                <div className="h-full flex items-center justify-center">
                    <LoadingView currentStep={currentStep} />
                </div>
              )}

              {currentStep === AppStep.EDITING_PART1 && (
                <StepEditor 
                  title="Phần 1: Mở đầu"
                  initialContent={report.part1_introduction}
                  onContinue={handleConfirmPart1}
                  onRegenerate={() => handleStart({topic: report.title, focus: report.focus || '', target: report.target || '', region: report.region || '', year: report.year || ''})}
                />
              )}

              {currentStep === AppStep.EDITING_PART2A && (
                <StepEditor 
                  title="Phần 2: Lý luận & Thực trạng"
                  initialContent={report.part2_theory_status}
                  onContinue={handleConfirmPart2A}
                  previousContent={report.part1_introduction}
                />
              )}

              {currentStep === AppStep.EDITING_PART2B && (
                <StepEditor 
                  title="Phần 3: Các Giải pháp"
                  initialContent={report.part2_solutions}
                  onContinue={handleConfirmPart2B}
                  previousContent={report.part2_theory_status}
                />
              )}

              {currentStep === AppStep.EDITING_PART2C && (
                <StepEditor 
                  title="Phần 4: Kết quả khảo nghiệm"
                  initialContent={report.part2_results}
                  onContinue={handleConfirmPart2C}
                  previousContent={report.part2_solutions}
                />
              )}

              {currentStep === AppStep.EDITING_PART34 && (
                <StepEditor 
                  title="Phần 5: Kết luận & Kiến nghị"
                  initialContent={`${report.part3_conclusion}\n\n${report.part4_references}`}
                  onContinue={handleConfirmPart34}
                  previousContent={report.part2_results}
                />
              )}

              {currentStep === AppStep.FINISHED && (
                <ReportView report={report} />
              )}
           </div>

           {/* Footer thông tin tác giả */}
           <footer className="mt-12 py-8 border-t border-slate-200 no-print">
              <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
                 <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[11px] font-black tracking-[0.15em] uppercase text-slate-400">
                    <div className="flex items-center gap-2">
                       <span className="text-primary-600 bg-primary-50 px-2 py-1 rounded">ỨNG DỤNG ĐƯỢC PHÁT TRIỂN BỞI: THẦY ĐOÀN KIÊN TRUNG</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-slate-600 transition-colors">
                       <Phone size={14} className="text-slate-300" />
                       <span>ZALO: 0909629947</span>
                    </div>
                    <a 
                       href="https://www.facebook.com/kientrungkrn" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="flex items-center gap-2 hover:text-primary-600 transition-colors group"
                    >
                       <Facebook size={14} className="text-slate-300 group-hover:text-primary-500" />
                       <span>FACEBOOK CÁ NHÂN</span>
                    </a>
                 </div>
                 <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">© 2026 Educational AI Solutions - All Rights Reserved</p>
              </div>
           </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
