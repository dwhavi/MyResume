'use client';

import React from 'react';
import { Tag, CheckCircle, HelpCircle, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import type { JobAnalysis } from '@/types';

interface JobAnalyzerProps {
  analysis: JobAnalysis;
  onNext: () => void;
  onBack: () => void;
}

function SectionTitle({ icon: Icon, title, count }: { icon: React.ElementType; title: string; count?: number }) {
  return (
    <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <Icon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{title}</h3>
      </div>
      {count !== undefined && (
        <span className="text-[10px] font-black bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}

export default function JobAnalyzer({ analysis, onNext, onBack }: JobAnalyzerProps) {
  const { requiredSkills, preferredSkills, responsibilities, qualifications } = analysis;

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* --- 핵심 스택 리스트 --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <SectionTitle icon={Tag} title="Required Skills" count={requiredSkills.length} />
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((s) => (
              <span key={s} className="px-3 py-1.5 bg-zinc-900 text-white text-[11px] font-bold rounded-md shadow-sm">
                {s}
              </span>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle icon={HelpCircle} title="Preferred Skills" count={preferredSkills.length} />
          <div className="flex flex-wrap gap-2">
            {preferredSkills.map((s) => (
              <span key={s} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-bold rounded-md border border-zinc-200 dark:border-zinc-700">
                {s}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* --- 주요 업무 및 자격 요건 --- */}
      <div className="space-y-8">
        <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800">
          <SectionTitle icon={Briefcase} title="Core Responsibilities" />
          <ul className="space-y-4">
            {responsibilities.map((r, i) => (
              <li key={i} className="flex gap-4 group">
                <span className="text-zinc-300 dark:text-zinc-700 font-black text-xl leading-none pt-0.5 italic">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">{r}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800">
          <SectionTitle icon={CheckCircle} title="Qualifications" />
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualifications.map((q, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{q}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* --- 하단 네비게이션 --- */}
       <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-t border-zinc-100 dark:border-zinc-800 flex justify-center gap-4 z-50">
        <div className="w-full max-w-4xl flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 max-w-[200px] py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> 프로필 수정
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
          >
            최적화된 이력서 생성하기 <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
