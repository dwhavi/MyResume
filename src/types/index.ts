// Types Layer — 순수 TypeScript 타입 (의존성 없음)
// GR-6: 최하위 레이어, 어떤 레이어도 import 가능

export interface Skill {
  name: string;
  proficiency?: '상' | '중' | '하';
  years?: number;
}

export interface Experience {
  company: string;
  title: string;
  startDate: string; // YYYY-MM
  endDate?: string | null; // null = 재직중
  bullets: string[]; // 각 200자 이내 권장
}

export interface Education {
  school: string;
  degree?: string; // 학사, 석사, 박사
  field?: string;  // 전공
  year?: string;   // 졸업년도
}

export interface Project {
  name: string;
  role?: string;
  description?: string;
  techStack?: string[];
}

export interface Profile {
  // 기본정보
  name: string;
  phone: string;
  email: string;
  birthdate?: string; // YYYY-MM-DD
  address?: string;
  gender?: string;    // 남/여

  // 사진 — Base64 JPEG/PNG, 압축 후 최대 500KB
  photo?: string;

  // 자기소개 — 500자 이내
  summary?: string;

  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  certifications?: string[];
}

export interface JobAnalysis {
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: string[];
  responsibilities: string[];
  qualifications: string[];
}

export interface ResumeExperience {
  company: string;
  title: string;
  period: string; // "2022.03 ~ 2024.08"
  bullets: string[];
}

export interface ResumeProject {
  name: string;
  role?: string;
  period?: string;
  description: string;
  techStack?: string[];
}

export interface ResumeEducation {
  school: string;
  degree?: string;
  field?: string;
  year?: string;
}

export interface ResumeContent {
  name: string;
  phone: string;
  email: string;
  summary: string;
  education: ResumeEducation[];
  experiences: ResumeExperience[];
  techStack: string[];
  projects: ResumeProject[];
  certifications?: string[];
}

export interface MatchScore {
  score: number;            // 0~100
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface GenerateResult {
  analysis: JobAnalysis;
  resume: { content: ResumeContent };
  matchScore: MatchScore;
}
