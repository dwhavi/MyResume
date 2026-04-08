'use client';

// MatchScore — 정합성 점수 시각화 (핵심 차별화 기능)

import type { MatchScore } from '@/types';

interface MatchScoreProps {
  matchScore: MatchScore;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score / 100);

  const color =
    score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';

  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-500">/ 100</span>
      </div>
    </div>
  );
}

export default function MatchScoreCard({ matchScore }: MatchScoreProps) {
  const { score, matchedKeywords, missingKeywords, suggestions } = matchScore;

  const label =
    score >= 80 ? '매우 적합 🎯' : score >= 60 ? '적합 👍' : '보완 필요 ⚠️';
  const labelColor =
    score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      {/* 헤더 */}
      <div className="flex items-center gap-5">
        <ScoreRing score={score} />
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">정합성 점수</p>
          <p className={`text-xl font-bold ${labelColor}`}>{label}</p>
          <p className="text-sm text-gray-500 mt-1">채용공고와의 매칭 분석 결과</p>
        </div>
      </div>

      {/* 매칭 키워드 */}
      {matchedKeywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">✅ 매칭된 키워드</p>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((kw) => (
              <span key={kw} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 누락 키워드 */}
      {missingKeywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">⚠️ 누락된 키워드</p>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw) => (
              <span key={kw} className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full border border-red-200">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 개선 제안 */}
      {suggestions.length > 0 && (
        <div className="bg-indigo-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-indigo-700 uppercase mb-2">💡 개선 제안</p>
          <ul className="space-y-1.5">
            {suggestions.map((s, i) => (
              <li key={i} className="text-sm text-indigo-800 flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
