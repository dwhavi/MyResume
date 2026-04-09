'use client';

import { useState } from 'react';
import { Link, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const MAX_LENGTH = 10000;

interface JobInputProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function JobInput({ value, onChange, onNext }: JobInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  const handleScrape = async () => {
    if (!url.trim()) {
      setError('분석할 URL을 입력해주세요.');
      return;
    }

    if (!url.startsWith('http')) {
      setError('올바른 URL 형식이 아닙니다 (http/https 포함).');
      return;
    }

    setIsScraping(true);
    setError('');

    try {
      const res = await fetch('/api/resumes/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || '공고를 불러오는데 실패했습니다.');
      }

      if (data.content) {
        onChange(data.content);
        // 성공 시 URL 필드 초기화 (선택 사항)
        // setUrl('');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsScraping(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length > MAX_LENGTH) {
      setError(`채용공고는 ${MAX_LENGTH.toLocaleString()}자 이내로 입력해주세요.`);
      return;
    }
    setError('');
    onChange(text);
  };

  const handleNext = () => {
    if (value.trim().length < 10) {
      setError('채용공고를 입력하거나 URL로 불러와주세요.');
      return;
    }
    onNext();
  };

  const charCount = value.length;
  const isNearLimit = charCount > MAX_LENGTH * 0.9;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- URL 입력 섹션 --- */}
      <section className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <Link className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest">URL로 자동 입력</h3>
        </div>
        
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="채용공고 URL을 입력하세요 (예: 사람인, 원티드...)"
            className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            type="button"
            onClick={handleScrape}
            disabled={isScraping}
            className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-2xl text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isScraping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> 분석 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> 공고 분석
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] text-zinc-400">
          * 이미지로 된 공고도 AI가 분석하여 텍스트로 추출해 드립니다.
        </p>
      </section>

      {/* --- 구분선 --- */}
      <div className="relative flex items-center justify-center py-2">
        <div className="flex-1 border-t border-zinc-100 dark:border-zinc-800" />
        <span className="px-4 text-[10px] font-bold text-zinc-300 dark:text-zinc-700 uppercase tracking-widest">또는 직접 입력</span>
        <div className="flex-1 border-t border-zinc-100 dark:border-zinc-800" />
      </div>

      {/* --- 텍스트 입력 영역 --- */}
      <section className="space-y-4">
        <div className="relative group">
          <textarea
            id="job-description"
            value={value}
            onChange={handleChange}
            placeholder="[채용공고 예시]&#10;회사명: 주식회사 ○○○&#10;포지션: 프론트엔드 개발자&#10;&#10;[주요 업무]&#10;- React 기반 웹 서비스 개발&#10;..."
            className={[
              'w-full h-80 p-6 bg-white dark:bg-zinc-900 border rounded-3xl text-sm resize-none transition-all duration-300 shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
              error ? 'border-red-400 ring-red-400/10' : 'border-zinc-200 dark:border-zinc-800'
            ].join(' ')}
          />
          {/* 글자 수 카운터 */}
          <span
            className={[
              'absolute bottom-4 right-6 text-[10px] font-mono',
              isNearLimit ? 'text-red-500 font-bold' : 'text-zinc-400',
            ].join(' ')}
          >
            {charCount.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
          </span>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-xs flex items-start gap-2 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          id="job-input-next"
          onClick={handleNext}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-100 dark:shadow-none hover:-translate-y-1 active:scale-95 text-lg"
        >
          다음 단계로 진행하기
        </button>
      </section>
    </div>
  );
}
