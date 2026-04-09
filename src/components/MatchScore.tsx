'use client';

import React, { useEffect, useState } from 'react';
import { Target, AlertCircle, Lightbulb, CheckCircle2, Trophy } from 'lucide-react';
import type { MatchScore } from '@/types';

interface MatchScoreProps {
  matchScore: MatchScore;
}

export default function MatchScoreCard({ matchScore }: MatchScoreProps) {
  const { score, matchedKeywords, missingKeywords, suggestions } = matchScore;
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 500);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreInfo = (s: number) => {
    if (s >= 80) return { label: '매우 적합', color: 'text-emerald-500', bg: 'bg-emerald-500', icon: Trophy };
    if (s >= 60) return { label: '적합함', color: 'text-amber-500', bg: 'bg-amber-500', icon: CheckCircle2 };
    return { label: '보완 필요', color: 'text-rose-500', bg: 'bg-rose-500', icon: AlertCircle };
  };

  const info = getScoreInfo(score);
  const Icon = info.icon;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
      {/* --- 상단 점수 섹션 --- */}
      <div className="p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800/50">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* 배경 원 */}
            <circle cx="50" cy="50" r="42" fill="none" className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth="8" />
            {/* 진행 원 */}
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * animatedScore) / 100}
              className={`${info.color} transition-all duration-[1500ms] ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black ${info.color}`}>{animatedScore}</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Match Score</span>
          </div>
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${info.bg} text-white`}>
            <Icon className="w-3 h-3" /> {info.label}
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
            {score >= 80 ? '이 포지션의 주인공이 될 준비가 되었습니다!' : 
             score >= 60 ? '어느 정도 경쟁력이 있는 프로필입니다.' : 
             '공고에 맞춰 프로필을 조금 더 다듬어볼까요?'}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">AI가 분석한 채용공고와의 직무 적합성 결과입니다.</p>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-zinc-100 dark:border-zinc-800">
        {/* 매칭 키워드 */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 보유한 핵심 역량
          </h3>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((kw) => (
              <span key={kw} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold rounded-lg border border-emerald-100 dark:border-emerald-900/50 hover:scale-105 transition-transform">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* 누락 키워드 */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
            <AlertCircle className="w-4 h-4 text-rose-500" /> 보완하면 좋은 역량
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw) => (
              <span key={kw} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[11px] font-medium rounded-lg border border-rose-100 dark:border-rose-900/50 hover:scale-105 transition-transform">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* 개선 제안 */}
        <div className="md:col-span-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl p-6 border border-indigo-100/50 dark:border-indigo-900/30">
          <h3 className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-4 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" /> AI 개선 제안 (GAP 분석)
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {suggestions.map((s, i) => (
              <li key={i} className="text-sm text-zinc-700 dark:text-zinc-300 flex items-start gap-2 group">
                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* 데이터 유실 경고 (유저 질문 대응) */}
      <div className="px-8 py-4 bg-zinc-50 dark:bg-zinc-800/50 text-[10px] text-zinc-400 text-center">
        ⚠️ 본 분석 결과는 현재 탭의 메모리에만 저장됩니다. 탭을 닫거나 새로고침하면 사라질 수 있으니 이력서 생성을 마쳐주세요.
      </div>
    </div>
  );
}
