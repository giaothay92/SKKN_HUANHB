import React, { useState } from 'react';
import { Sparkles, FileText, Target, Users, MapPin, Calendar, ArrowRight } from 'lucide-react';

interface InputFormProps {
  onGenerate: (data: {
      topic: string;
      focus: string;
      target: string;
      region: string;
      year: string;
  }) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate }) => {
  const [topic, setTopic] = useState('');
  const [focus, setFocus] = useState('');
  const [target, setTarget] = useState('');
  const [region, setRegion] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({ topic, focus, target, region, year });
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-10 text-center">
        <div className="inline-flex p-3 bg-primary-100 rounded-2xl mb-4 text-primary-600 animate-bounce">
            <Sparkles size={24} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Thiết lập hồ sơ Sáng kiến</h2>
        <p className="text-slate-500 mt-2 font-medium">Hệ thống AI sẽ cá nhân hóa nội dung dựa trên dữ liệu đầu vào của thầy cô.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tên đề tài - Full Width */}
        <div className="md:col-span-2 group">
          <div className="dashboard-card p-6 border-l-4 border-l-primary-500 focus-within:ring-2 focus-within:ring-primary-200">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 group-focus-within:text-primary-600 transition-colors">
                <FileText size={18} />
                Tên đề tài hoặc Ý tưởng SKKN <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:bg-white focus:border-primary-400 focus:outline-none transition-all resize-none placeholder-slate-400 font-medium"
              placeholder="Ví dụ: Một số giải pháp nâng cao chất lượng dạy học môn Toán cho học sinh lớp 9..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
        </div>

        {/* Nội dung trọng tâm */}
        <div className="group">
          <div className="dashboard-card p-6 border-l-4 border-l-amber-500 h-full focus-within:ring-2 focus-within:ring-amber-100">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 group-focus-within:text-amber-600 transition-colors">
                <Target size={18} />
                Nội dung trọng tâm
            </label>
            <textarea
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:bg-white focus:border-amber-400 focus:outline-none transition-all resize-none placeholder-slate-400 font-medium"
              placeholder="Ứng dụng CNTT, Trò chơi, Sơ đồ tư duy..."
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            />
          </div>
        </div>

        {/* Đối tượng nghiên cứu */}
        <div className="group">
          <div className="dashboard-card p-6 border-l-4 border-l-indigo-500 h-full focus-within:ring-2 focus-within:ring-indigo-100">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 group-focus-within:text-indigo-600 transition-colors">
                <Users size={18} />
                Đối tượng nghiên cứu
            </label>
            <textarea
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:bg-white focus:border-indigo-400 focus:outline-none transition-all resize-none placeholder-slate-400 font-medium"
              placeholder="Học sinh lớp 9A1, trường THCS, số liệu..."
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>
        </div>

        {/* Đơn vị */}
        <div className="group">
          <div className="dashboard-card p-6 border-l-4 border-l-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 group-focus-within:text-emerald-600 transition-colors">
                <MapPin size={18} />
                Đơn vị / Vùng miền
            </label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:bg-white focus:border-emerald-400 focus:outline-none transition-all placeholder-slate-400 font-medium"
              placeholder="Địa chỉ đơn vị (Xã/Tỉnh) ..."
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>
        </div>

        {/* Năm học */}
        <div className="group">
          <div className="dashboard-card p-6 border-l-4 border-l-rose-500 focus-within:ring-2 focus-within:ring-rose-100">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 group-focus-within:text-rose-600 transition-colors">
                <Calendar size={18} />
                Năm học
            </label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:bg-white focus:border-rose-400 focus:outline-none transition-all placeholder-slate-400 font-medium"
              placeholder="2025 - 2026"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 pt-6">
           <button
             type="submit"
             disabled={!topic.trim()}
             className="w-full flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-bold py-5 rounded-2xl transition-all active:scale-[0.98] shadow-xl hover:shadow-primary-200 group overflow-hidden relative"
           >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              <span>BẮT ĐẦU XÂY DỰNG SÁNG KIẾN</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;