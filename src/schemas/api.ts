// Schemas Layer — API 요청/응답 검증
// GR-1: HTTP 경계 진입/진출 시 반드시 파싱

import { z } from 'zod';
import { ProfileSchema } from './profile';
import { JobAnalysisSchema, MatchScoreSchema, ResumeContentSchema } from './resume';

// POST /api/resumes/generate 요청 스키마
export const GenerateRequestSchema = z.object({
  jobDescription: z
    .string()
    .min(10, '채용공고를 입력해주세요')
    .max(10000, '채용공고는 10,000자 이내로 입력해주세요'),
  profile: ProfileSchema,
});

// POST /api/resumes/generate 응답 스키마 (성공)
export const GenerateResponseSchema = z.object({
  success: z.literal(true),
  analysis: JobAnalysisSchema,
  resume: z.object({ content: ResumeContentSchema }),
  matchScore: MatchScoreSchema,
});

// 에러 응답 스키마
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
export type GenerateResponse = z.infer<typeof GenerateResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
