// Schemas Layer — Zod 스키마 (AI 응답 검증)
// GR-1: OpenAI/Gemini 응답이 경계를 넘을 때 반드시 파싱

import { z } from 'zod';

export const ResumeEducationSchema = z.object({
  school: z.string(),
  degree: z.string().optional(),
  field: z.string().optional(),
  year: z.string().optional(),
});

export const ResumeExperienceSchema = z.object({
  company: z.string(),
  title: z.string(),
  period: z.string(), // "2022.03 ~ 2024.08"
  bullets: z.array(z.string()),
});

export const ResumeProjectSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  period: z.string().optional(),
  description: z.string(),
  techStack: z.array(z.string()).optional(),
});

export const ResumeContentSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  summary: z.string(),
  education: z.array(ResumeEducationSchema),
  experiences: z.array(ResumeExperienceSchema),
  techStack: z.array(z.string()),
  projects: z.array(ResumeProjectSchema),
  certifications: z.array(z.string()).optional(),
});

export const JobAnalysisSchema = z.object({
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  keywords: z.array(z.string()),
  responsibilities: z.array(z.string()),
  qualifications: z.array(z.string()),
});

export const MatchScoreSchema = z.object({
  score: z.number().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  suggestions: z.array(z.string()),
});

// Gemini 응답 전체 구조 검증
export const GeminiResponseSchema = z.object({
  analysis: JobAnalysisSchema,
  resume: ResumeContentSchema,
  matchScore: MatchScoreSchema,
});

export type GeminiResponseOutput = z.infer<typeof GeminiResponseSchema>;
