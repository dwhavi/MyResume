// Lib Layer — API 호출 클라이언트 (프론트엔드 전용)
// GR-6: Components에서 API Route를 직접 호출하지 않고 이 모듈을 사용

import type { GenerateRequest, GenerateResponse } from '@/schemas/api';
import type { GenerateResult } from '@/types';

// 에러 타입
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// POST /api/resumes/generate
export async function generateResume(
  payload: GenerateRequest
): Promise<GenerateResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 65_000); // 65초 타임아웃

  try {
    const res = await fetch('/api/resumes/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new ApiError(
        data?.error?.code ?? 'UNKNOWN_ERROR',
        data?.error?.message ?? '알 수 없는 오류가 발생했습니다.',
        res.status
      );
    }

    const { analysis, resume, matchScore } = data as GenerateResponse;
    return { analysis, resume, matchScore };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if ((err as Error).name === 'AbortError') {
      throw new ApiError(
        'TIMEOUT',
        '생성 시간이 초과되었습니다. 공고를 짧게 줄이거나 다시 시도해주세요.',
        504
      );
    }
    throw new ApiError(
      'NETWORK_ERROR',
      '네트워크 오류가 발생했습니다. 연결을 확인해주세요.',
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
