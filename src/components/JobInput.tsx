'use client';

// JobInput — 채용공고 텍스트 입력 (10,000자 제한)

import { useState } from 'react';

const MAX_LENGTH = 10000;

interface JobInputProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function JobInput({ value, onChange, onNext }: JobInputProps) {
  const [error, setError] = useState('');

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
      setError('채용공고를 입력해주세요.');
      return;
    }
    onNext();
  };

  const charCount = value.length;
  const isNearLimit = charCount > MAX_LENGTH * 0.9;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          채용공고 붙여넣기
        </label>
        <p className="text-xs text-gray-500 mb-3">
          채용 사이트에서 공고 텍스트를 복사해서 붙여넣으세요.
        </p>
        <div className="relative">
          <textarea
            id="job-description"
            value={value}
            onChange={handleChange}
            placeholder="[채용공고 예시]&#10;회사명: 주식회사 ○○○&#10;포지션: 프론트엔드 개발자&#10;&#10;[주요 업무]&#10;- React 기반 웹 서비스 개발&#10;- TypeScript를 활용한 코드 품질 개선&#10;&#10;[자격 요건]&#10;- React, TypeScript 3년 이상&#10;- REST API 연동 경험"
            className={[
              'w-full h-72 p-4 border rounded-xl text-sm resize-none transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent',
              error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300',
            ].join(' ')}
          />
          {/* 글자 수 카운터 */}
          <span
            className={[
              'absolute bottom-3 right-3 text-xs',
              isNearLimit ? 'text-red-500 font-semibold' : 'text-gray-400',
            ].join(' ')}
          >
            {charCount.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
          </span>
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>

      <button
        id="job-input-next"
        onClick={handleNext}
        className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
      >
        다음 단계 →
      </button>
    </div>
  );
}
