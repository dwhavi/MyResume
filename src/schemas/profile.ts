// Schemas Layer — Zod 스키마 (Profile 입력 검증)
// GR-1: 경계에서 파싱, 내부에서 타입 보장

import { z } from 'zod';

export const SkillSchema = z.object({
  name: z.string().min(1, '기술명을 입력하세요'),
  proficiency: z.enum(['상', '중', '하']).optional(),
  years: z.number().min(0).max(50).optional(),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1, '회사명을 입력하세요'),
  title: z.string().min(1, '직책을 입력하세요'),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, 'YYYY-MM 형식으로 입력하세요'),
  endDate: z.string().regex(/^\d{4}-\d{2}$/).nullable().optional(),
  bullets: z.array(z.string().max(200, '각 항목은 200자 이내로 작성하세요')),
});

export const EducationSchema = z.object({
  school: z.string().min(1, '학교명을 입력하세요'),
  degree: z.string().optional(),
  field: z.string().optional(),
  year: z.string().optional(),
});

export const ProjectSchema = z.object({
  name: z.string().min(1, '프로젝트명을 입력하세요'),
  role: z.string().optional(),
  description: z.string().optional(),
  techStack: z.array(z.string()).optional(),
});

export const ProfileSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  phone: z.string().min(1, '연락처를 입력하세요'),
  email: z.string().email('올바른 이메일 형식으로 입력하세요'),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
  photo: z.string().optional(), // Base64
  summary: z.string().max(500, '자기소개는 500자 이내로 작성하세요').optional(),
  skills: z.array(SkillSchema),
  experiences: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  projects: z.array(ProjectSchema),
  certifications: z.array(z.string()).optional(),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;
