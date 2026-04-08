# Data Model — MyResume

## Profile (사용자 입력)

```typescript
interface Profile {
  // 기본정보
  name: string;
  phone: string;
  email: string;
  birthdate?: string;       // YYYY-MM-DD
  address?: string;
  gender?: string;          // 남/여

  // 사진
  photo?: string;           // Base64 JPEG/PNG, 압축 후 최대 500KB

  // 자기소개
  summary?: string;         // 500자 이내

  // 기술 스택
  skills: Skill[];

  // 경력
  experiences: Experience[];

  // 학력
  education: Education[];

  // 프로젝트
  projects: Project[];

  // 자격증
  certifications?: string[];
}

interface Skill {
  name: string;             // "TypeScript", "React" 등
  proficiency?: string;     // "상" | "중" | "하"
  years?: number;
}

interface Experience {
  company: string;
  title: string;
  startDate: string;        // YYYY-MM
  endDate?: string | null;  // null = 재직중
  bullets: string[];        // 경력 기술 (각 200자 이내 권장)
}

interface Education {
  school: string;
  degree?: string;          // 학사, 석사, 박사
  field?: string;           // 전공
  year?: string;            // 졸업년도
}

interface Project {
  name: string;
  role?: string;
  description?: string;
  techStack?: string[];
}
```

## JobAnalysis (AI 공고 분석 결과)

```typescript
interface JobAnalysis {
  requiredSkills: string[];     // 필수 기술
  preferredSkills: string[];    // 우대 기술
  keywords: string[];           // 핵심 키워드
  responsibilities: string[];   // 주요 업무
  qualifications: string[];     // 자격 요건
}
```

## Resume (생성 결과)

```typescript
interface Resume {
  content: ResumeContent;
}

interface ResumeContent {
  // 기본정보
  name: string;
  phone: string;
  email: string;

  // 자기소개 (공고 맞춤, 500자 이내)
  summary: string;

  // 학력
  education: Array<{
    school: string;
    degree?: string;
    field?: string;
    year?: string;
  }>;

  // 경력 (최신순, 각 항목 200자 이내)
  experiences: Array<{
    company: string;
    title: string;
    period: string;        // "2022.03 ~ 2024.08"
    bullets: string[];
  }>;

  // 기술 스택
  techStack: string[];

  // 프로젝트
  projects: Array<{
    name: string;
    role?: string;
    period?: string;
    description: string;
    techStack?: string[];
  }>;

  // 자격증
  certifications?: string[];
}
```

## MatchScore (정합성 점수)

```typescript
interface MatchScore {
  score: number;                // 0~100
  matchedKeywords: string[];    // 매칭된 키워드
  missingKeywords: string[];    // 누락된 키워드
  suggestions: string[];        // 개선 제안
}
```

## Zod 스키마

`src/lib/schemas.ts`에 정의. AI 응답 검증에 사용.

```typescript
// 핵심 스키마 개요 (실제 구현 시 상세 정의)
ProfileSchema = z.object({ ... });       // 입력 검증
ResumeContentSchema = z.object({ ... }); // AI 응답 검증
GenerateResponseSchema = z.object({ ... }); // API 응답 전체 검증
```

## 사진 처리 스펙

| 항목 | 스펙 |
|------|------|
| 비율 | 3:4 (세로) |
| 권장 해상도 | 300×400px 이상 |
| 파일 형식 | JPG, PNG |
| 최대 업로드 용량 | 5MB |
| 압축 | Canvas API로 리사이즈 + 압축 (최대 500KB) |
| 크롭 | react-easy-crop, center-crop 기본 |
| PDF 배치 | 우상단 고정, 3×4cm 규격 |
