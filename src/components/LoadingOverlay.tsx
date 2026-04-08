'use client';

// LoadingOverlay — Skeleton UI + 단계별 생성 메시지 (GR-5: 빈 화면 금지)

import { useEffect, useState } from 'react';

const MESSAGES = [
  '채용공고를 분석하고 있습니다...',
  '핵심 키워드를 추출하고 있습니다...',
  '프로필과 공고를 매칭하고 있습니다...',
  '맞춤 이력서를 작성하고 있습니다...',
  '정합성 점수를 계산하고 있습니다...',
  '마지막 검토 중입니다...',
];

export default function LoadingOverlay() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 2800);

    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearInterval(msgTimer);
      clearInterval(dotTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
      {/* 스피너 */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">✨</span>
        </div>
      </div>

      {/* 진행 메시지 */}
      <p className="text-gray-700 font-semibold text-base mb-1">
        {MESSAGES[msgIdx]}{dots}
      </p>
      <p className="text-gray-400 text-sm">AI가 최적의 이력서를 생성 중입니다</p>

      {/* 스켈레톤 미리보기 */}
      <div className="mt-8 w-80 space-y-3 animate-pulse">
        <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto" />
        <div className="h-3 bg-gray-100 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-5/6" />
        <div className="h-3 bg-gray-100 rounded-full w-4/5" />
        <div className="mt-4 h-4 bg-gray-200 rounded-full w-1/2" />
        <div className="h-3 bg-gray-100 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-3/4" />
      </div>
    </div>
  );
}
