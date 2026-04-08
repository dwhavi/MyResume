'use client';

// JobAnalyzer — Step 3 공고 분석 결과 표시

import type { JobAnalysis } from '@/types';

interface JobAnalyzerProps {
  analysis: JobAnalysis;
  onNext: () => void;
  onBack: () => void;
}

function TagList({ items, color }: { items: string[]; color: string }) {
  if (!items.length) return <p className="text-sm text-gray-400">없음</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`px-2.5 py-1 text-xs font-medium rounded-full border ${color}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
      {children}
    </div>
  );
}

export default function JobAnalyzer({ analysis, onNext, onBack }: JobAnalyzerProps) {
  const { requiredSkills, preferredSkills, keywords, responsibilities, qualifications } = analysis;

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
        <p className="text-sm font-semibold text-indigo-700">📋 공고 분석이 완료되었습니다</p>
        <p className="text-xs text-indigo-500 mt-0.5">아래 결과를 확인하고 이력서 생성을 진행하세요.</p>
      </div>

      <div className="space-y-5">
        <Section title="🔴 필수 기술">
          <TagList
            items={requiredSkills}
            color="bg-red-50 text-red-700 border-red-200"
          />
        </Section>

        <Section title="🟡 우대 기술">
          <TagList
            items={preferredSkills}
            color="bg-yellow-50 text-yellow-700 border-yellow-200"
          />
        </Section>

        <Section title="🔵 핵심 키워드">
          <TagList
            items={keywords}
            color="bg-blue-50 text-blue-700 border-blue-200"
          />
        </Section>

        {responsibilities.length > 0 && (
          <Section title="📌 주요 업무">
            <ul className="space-y-1.5">
              {responsibilities.map((r, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-gray-300 flex-shrink-0 mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {qualifications.length > 0 && (
          <Section title="✅ 자격 요건">
            <ul className="space-y-1.5">
              {qualifications.map((q, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-gray-300 flex-shrink-0 mt-0.5">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          id="analyzer-back"
          onClick={onBack}
          className="flex-1 py-3 px-6 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
        >
          ← 이전
        </button>
        <button
          id="analyzer-next"
          onClick={onNext}
          className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
        >
          이력서 생성 →
        </button>
      </div>
    </div>
  );
}
