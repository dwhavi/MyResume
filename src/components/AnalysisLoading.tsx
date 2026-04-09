'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Search, Target, CheckCircle2 } from 'lucide-react';

const LOADING_STEPS = [
  { icon: Search, text: '채용공고 요구사항 분석 중...' },
  { icon: Cpu, text: '사용자 경력 데이터 매칭 중...' },
  { icon: Target, text: '직무 정합성 점수 계산 중...' },
  { icon: Sparkles, text: '가장 적합한 이력서 초안 생성 중...' },
];

export default function AnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto py-20 flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-1000">
      {/* --- 중앙 로딩 애니메이션 --- */}
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative w-32 h-32 bg-white dark:bg-zinc-900 rounded-full shadow-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin duration-[2000ms]" />
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-indigo-300 border-b-transparent border-l-transparent animate-spin-reverse duration-[3000ms]" />
          <Cpu className="w-12 h-12 text-indigo-600 animate-bounce" />
        </div>
        
        {/* 주변 부유 아이콘들 */}
        <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-yellow-400 animate-pulse delay-75" />
        <div className="absolute -bottom-2 -left-6 bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg animate-bounce duration-[4000ms]">
          <Target className="w-4 h-4 text-emerald-500" />
        </div>
      </div>

      {/* --- 진행 텍스트 --- */}
      <div className="text-center space-y-6 w-full">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">AI가 최적의 결과를 분석 중입니다</h3>
          <p className="text-zinc-500 dark:text-zinc-400">잠시만 기다려주세요. 약 10~20초 정도 소요될 수 있습니다.</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {LOADING_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;

            return (
              <div
                key={idx}
                className={[
                  'flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all duration-500 w-full max-w-sm',
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 shadow-sm scale-105' 
                    : 'bg-transparent border-transparent opacity-40'
                ].join(' ')}
              >
                <div className={[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  isActive ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                ].join(' ')}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={[
                  'text-sm font-medium',
                  isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'
                ].join(' ')}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- 하단 팁 --- */}
      <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 text-center max-w-md">
        💡 <b>Tip:</b> 채용공고의 핵심 키워드와 당신의 성과를 매칭하여 최적화된 이력서 초안을 자동으로 구성합니다.
      </div>
    </div>
  );
}
