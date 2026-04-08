// Server Layer — Gemini API 클라이언트 (서버 전용, GR-2 준수)
// Components나 lib/에서 직접 import 금지

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiResponseSchema } from '@/schemas/resume';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts';
import type { Profile } from '@/types';
import type { GeminiResponseOutput } from '@/schemas/resume';

// ─── Rate Limiting (메모리 기반, IP당 분당 3회) ──────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 3) return false;

  entry.count += 1;
  return true;
}

// ─── Gemini 클라이언트 초기화 ─────────────────────────────────────────────────

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
  return new GoogleGenerativeAI(apiKey);
}

// ─── 이력서 생성 (1회 재시도 포함) ──────────────────────────────────────────

export async function generateResumeWithGemini(
  jobDescription: string,
  profile: Profile
): Promise<GeminiResponseOutput> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json',
    },
    systemInstruction: SYSTEM_PROMPT,
  });

  const profileJson = JSON.stringify(profile, null, 2);
  const userPrompt = buildUserPrompt(jobDescription, profileJson);

  // 1회 재시도 로직
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await model.generateContent(userPrompt);
      const text = result.response.text();

      // Zod 검증 (GR-1)
      const parsed = GeminiResponseSchema.safeParse(JSON.parse(text));
      if (!parsed.success) {
        if (attempt === 2) throw new Error('AI 응답 스키마 검증 실패');
        continue; // 재시도
      }

      return parsed.data;
    } catch (err) {
      if (attempt === 2) throw err;
      // 1차 실패 → 재시도
    }
  }

  throw new Error('이력서 생성에 실패했습니다');
}
