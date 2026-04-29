import React from 'react';
import { AppStep } from '../types';
import { Loader2, BrainCircuit, Sparkles } from 'lucide-react';

interface LoadingViewProps {
  currentStep: AppStep;
}

const LoadingView: React.FC<LoadingViewProps> = ({ currentStep }) => {
  
  const getMessage = () => {
      switch(currentStep) {
          case AppStep.GENERATING_PART1: return "Đang phân tích đề tài...";
          case AppStep.GENERATING_PART2A: return "Đang xây dựng thực trạng...";
          case AppStep.GENERATING_PART2B: return "Đang đề xuất các giải pháp...";
          case AppStep.GENERATING_PART2C: return "Đang tổng hợp kết quả...";
          case AppStep.GENERATING_PART34: return "Đang hoàn thiện báo cáo...";
          default: return "Trợ lý đang xử lý...";
      }
  };

  const getSubtext = () => {
    switch(currentStep) {
        case AppStep.GENERATING_PART2B: return "Hệ thống đang tìm kiếm các biện pháp sư phạm sáng tạo nhất cho chuyên môn của bạn.";
        case AppStep.GENERATING_PART2C: return "Đang giả lập bảng số liệu đối chứng và phân tích hiệu quả thực tiễn.";
        default: return "Vui lòng đợi trong giây lát, trợ lý sáng kiến đang soạn thảo văn bản...";
    }
  }

  return (
    <div className="w-full max-w-lg animate-slide-up">
        <div className="dashboard-card p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Background Animation Decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary-100 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-100 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse-slow delay-700"></div>

            <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg">
                    <BrainCircuit className="w-8 h-8 text-primary-600 animate-pulse" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-primary-600 font-black uppercase text-[10px] tracking-[0.3em]">
                    <Sparkles size={14} />
                    Trợ lý sáng kiến đang xử lý...
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{getMessage()}</h3>
                <p className="text-slate-500 font-medium text-sm px-6">{getSubtext()}</p>
            </div>

            <div className="mt-10 w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary-600 h-full animate-[loading_2s_ease-in-out_infinite] w-1/3 rounded-full"></div>
            </div>
        </div>
        
        <style>{`
            @keyframes loading {
                0% { transform: translateX(-100%); width: 30%; }
                50% { width: 60%; }
                100% { transform: translateX(350%); width: 30%; }
            }
        `}</style>
    </div>
  );
};

export default LoadingView;