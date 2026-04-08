// API Routes Layer — POST /api/resumes/generate
// 공고 분석 + 이력서 생성 통합 엔드포인트

import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequestSchema } from '@/schemas/api';
import { generateResumeWithGemini, checkRateLimit } from '@/server/gemini';
import { ZodError } from 'zod';

// 에러 응답 헬퍼
function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

export async function POST(req: NextRequest) {
  // ─── Rate Limiting ────────────────────────────────────────────────────────
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';

  if (!checkRateLimit(ip)) {
    return errorResponse(
      'RATE_LIMITED',
      '요청이 너무 많습니다. 1분 뒤 다시 시도해주세요.',
      429
    );
  }

  // ─── 요청 파싱 & 검증 (GR-1) ─────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse('INVALID_INPUT', '잘못된 요청 형식입니다.', 400);
  }

  // 입력 길이 선제 검사
  if (
    typeof body === 'object' &&
    body !== null &&
    'jobDescription' in body &&
    typeof (body as { jobDescription: unknown }).jobDescription === 'string' &&
    (body as { jobDescription: string }).jobDescription.length > 10000
  ) {
    return errorResponse(
      'INPUT_TOO_LONG',
      '채용공고는 10,000자 이내로 입력해주세요.',
      400
    );
  }

  let parsed;
  try {
    parsed = GenerateRequestSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return errorResponse(
        'INVALID_INPUT',
        '입력 형식이 올바르지 않습니다: ' + (err.issues?.[0]?.message ?? err.message),
        400
      );
    }
    return errorResponse('INVALID_INPUT', '입력 형식이 올바르지 않습니다.', 400);
  }

  // ─── Gemini API 호출 ──────────────────────────────────────────────────────
  try {
    const result = await generateResumeWithGemini(
      parsed.jobDescription,
      parsed.profile
    );

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      resume: { content: result.resume },
      matchScore: result.matchScore,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '';

    // JSON 파싱/스키마 실패
    if (message.includes('스키마') || message.includes('JSON')) {
      return errorResponse(
        'AI_PARSE_ERROR',
        '이력서 생성에 실패했습니다. 다시 시도해주세요.',
        502
      );
    }

    // 타임아웃
    if (message.toLowerCase().includes('timeout') || message.includes('초과')) {
      return errorResponse(
        'TIMEOUT',
        '생성 시간이 초과되었습니다. 공고를 짧게 줄이거나 다시 시도해주세요.',
        504
      );
    }

    // API 키 등 서버 오류
    console.error('[generate] AI 서비스 오류:', err);
    return errorResponse(
      'AI_SERVICE_ERROR',
      '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      500
    );
  }
}
