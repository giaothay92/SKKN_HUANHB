import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { FileDown, ArrowRight, RotateCcw, ChevronDown, ChevronUp, Eye, Edit3, Layout } from 'lucide-react';
import { exportSingleStep } from '../services/exportService';

interface StepEditorProps {
  title: string;
  initialContent: string;
  onContinue: (finalContent: string) => void;
  onRegenerate?: () => void;
  isGenerating?: boolean;
  previousContent?: string;
}

const StepEditor: React.FC<StepEditorProps> = ({ 
  title, 
  initialContent, 
  onContinue, 
  onRegenerate,
  isGenerating = false,
  previousContent
}) => {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('preview');
  const [showPrevious, setShowPrevious] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  return (
    <div className="dashboard-card overflow-hidden flex flex-col h-[calc(100vh-14rem)] bg-white animate-slide-up">
      {/* Workspace Header */}
      <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between glass-effect shrink-0">
         <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
            <p className="text-xs text-slate-500 font-medium">Bạn có thể chỉnh sửa trực tiếp nội dung AI gợi ý bên dưới.</p>
         </div>
         
         <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
                onClick={() => setActiveTab('write')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'write' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <Edit3 size={14} />
                SOẠN THẢO
            </button>
            <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'preview' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <Layout size={14} />
                XEM TRƯỚC
            </button>
         </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
         {/* Left Panel: History Reference (Hidden on Mobile) */}
         {previousContent && (
             <div className="hidden md:block w-72 bg-slate-50/50 border-r border-slate-100 overflow-y-auto p-6">
                <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                    <Eye size={14} />
                    Tham chiếu trước
                </div>
                <div className="prose prose-sm prose-slate skkn-font opacity-60 hover:opacity-100 transition-opacity">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {previousContent}
                    </ReactMarkdown>
                </div>
             </div>
         )}

         {/* Main Content Area */}
         <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {activeTab === 'write' ? (
                <textarea
                    className="flex-1 p-8 md:p-12 w-full focus:outline-none bg-white text-slate-800 font-serif text-lg leading-relaxed placeholder-slate-300 border-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết nội dung của bạn ở đây..."
                    autoFocus
                />
            ) : (
                <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
                    <div className="max-w-3xl mx-auto skkn-font text-slate-900 pb-20">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm, remarkMath]} 
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold uppercase mt-8 mb-4 border-b-2 border-slate-100 pb-2 text-slate-900" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold uppercase mt-7 mb-4 text-slate-800" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-6 mb-3 text-slate-800" {...props} />,
                                p: ({node, ...props}) => <p className="mb-5 text-justify leading-relaxed" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-10 mb-5 space-y-2" {...props} />,
                                table: ({node, ...props}) => <div className="my-6 overflow-x-auto shadow-sm rounded-xl border border-slate-200"><table className="min-w-full border-collapse" {...props} /></div>,
                                th: ({node, ...props}) => <th className="bg-slate-50 border-b border-slate-200 p-4 text-center font-bold text-sm" {...props} />,
                                td: ({node, ...props}) => <td className="border-b border-slate-100 p-4 text-justify text-sm" {...props} />,
                            }}
                        >
                            {content || "_Đang chờ nội dung..._"}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
         </div>
      </div>

      {/* Action Footer */}
      <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
         <div className="flex items-center gap-2">
            <button
                onClick={() => exportSingleStep(title, content)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-200 hover:shadow-sm transition-all text-xs font-bold active:scale-95"
            >
                <FileDown size={14} />
                XUẤT BẢN NHÁP
            </button>
            {onRegenerate && (
                <button
                    onClick={onRegenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 hover:shadow-sm transition-all text-xs font-bold active:scale-95 disabled:opacity-50"
                >
                    <RotateCcw size={14} className={isGenerating ? 'animate-spin' : ''} />
                    VIẾT LẠI MỤC NÀY
                </button>
            )}
         </div>

         <button
            onClick={() => onContinue(content)}
            disabled={!content.trim() || isGenerating}
            className="flex items-center gap-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-primary-200 transition-all active:scale-[0.97] font-black tracking-tight"
         >
            {isGenerating ? 'AI ĐANG XỬ LÝ...' : 'HOÀN THÀNH & TIẾP TỤC'}
            {!isGenerating && <ArrowRight size={18} />}
         </button>
      </div>
    </div>
  );
};

export default StepEditor;