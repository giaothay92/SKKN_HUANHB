import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ReportData } from '../types';
import { FileDown, Copy, Check, Sparkles, Facebook, Phone, AlertTriangle } from 'lucide-react';
import { exportToWord } from '../services/exportService';

interface ReportViewProps {
  report: ReportData;
}

const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    const fullText = `# ${report.title}\n\n${report.part1_introduction}\n\n${report.part2_theory_status}\n\n${report.part2_solutions}\n\n${report.part2_results}\n\n${report.part3_conclusion}\n\n${report.part4_references}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const MarkdownComponent = ({ content }: { content: string }) => (
    <div className="markdown-content">
      <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold uppercase mt-12 mb-6 text-slate-900 border-b-2 border-slate-100 pb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-8 mb-4 text-slate-800" {...props} />,
              p: ({node, ...props}) => <p className="mb-6 text-justify leading-relaxed text-slate-900" {...props} />,
              table: ({node, ...props}) => <div className="overflow-x-auto my-8 shadow-sm rounded-xl border border-slate-200 bg-white"><table className="min-w-full border-collapse" {...props} /></div>,
              th: ({node, ...props}) => <th className="border border-slate-300 px-6 py-4 bg-slate-50 font-bold text-center text-sm" {...props} />,
              td: ({node, ...props}) => <td className="border border-slate-300 px-6 py-4 text-justify text-sm" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-10 mb-6 space-y-3 text-justify" {...props} />,
          }}
      >
          {content}
      </ReactMarkdown>
    </div>
  );

  return (
    <div className="animate-slide-up pb-10">
      {/* Finish Banner & Disclaimer */}
      <div className="dashboard-card bg-white border-2 border-primary-100 p-8 mb-8 shadow-xl shadow-primary-50/50">
         <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-primary-600 rounded-lg text-white">
                      <Sparkles size={20} />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Hoàn thành Sáng kiến!</h3>
                </div>
                
                {/* Disclaimer Box */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-6">
                   <div className="flex items-start gap-3 text-amber-800">
                      <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                      <div className="text-xs font-medium leading-relaxed">
                         <p className="font-bold mb-1 uppercase">Lưu ý người dùng:</p>
                         <p>Đây là sáng kiến do AI tạo ra, giáo viên cần kiểm tra, xác thực trước khi đưa vào vận dụng thực tế. Chúng tôi hoàn toàn không chịu trách nhiệm nội dung này.</p>
                         <div className="mt-3 pt-3 border-t border-amber-200/50 flex flex-wrap gap-x-6 gap-y-2">
                            <span className="flex items-center gap-1.5 font-bold">
                               <Phone size={12} /> Zalo: 0909629947 (Thầy Đoàn Kiên Trung)
                            </span>
                            <a href="https://www.facebook.com/kientrungkrn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-bold text-blue-700 hover:underline">
                               <Facebook size={12} /> Facebook cá nhân
                            </a>
                         </div>
                      </div>
                   </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
                <button 
                   onClick={() => exportToWord(report)}
                   className="w-full px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-lg shadow-primary-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                   <FileDown size={20} />
                   TẢI FILE WORD (.DOCX)
                </button>
                <button 
                   onClick={handleCopy}
                   className="w-full px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                   {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                   {copied ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP NỘI DUNG'}
                </button>
            </div>
         </div>
      </div>

      {/* Document View Area - Centered and Scrollable Frame */}
      <div className="max-w-4xl mx-auto">
         <div className="bg-slate-200 p-1 rounded-t-2xl flex items-center gap-2 px-4 h-10 border border-slate-300">
            <div className="flex gap-1.5">
               <div className="w-3 h-3 rounded-full bg-rose-400"></div>
               <div className="w-3 h-3 rounded-full bg-amber-400"></div>
               <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-4">Bản xem trước nội dung sáng kiến</span>
         </div>
         
         {/* The Paper Frame - Scrollable */}
         <div className="bg-white shadow-2xl h-[75vh] overflow-y-auto skkn-font rounded-b-2xl border-x border-b border-slate-300 relative report-container custom-scrollbar">
            <div className="p-12 md:p-20">
               {/* Content directly starts here */}
               <div className="prose prose-slate max-w-none text-slate-900">
                  <div className="text-center mb-16">
                     <h1 className="text-3xl font-black uppercase leading-tight text-slate-900 mb-4">{report.title}</h1>
                     {report.focus && <p className="text-lg font-bold text-primary-600">Trọng tâm: {report.focus}</p>}
                  </div>

                  <MarkdownComponent content={report.part1_introduction} />
                  <MarkdownComponent content={report.part2_theory_status} />
                  <MarkdownComponent content={report.part2_solutions} />
                  <MarkdownComponent content={report.part2_results} />
                  <MarkdownComponent content={report.part3_conclusion} />
                  
                  <div className="mt-20 pt-10 border-t-2 border-slate-100 italic opacity-80">
                     <MarkdownComponent content={report.part4_references} />
                  </div>
               </div>
            </div>
         </div>
         
         <div className="mt-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Sử dụng thanh cuộn bên phải để xem toàn bộ nội dung
         </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ReportView;