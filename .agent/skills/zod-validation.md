# Skill: Zod 스키마 검증

## 프로필 입력 검증

```typescript
import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요").max(50),
  phone: z.string().min(1, "연락처를 입력해주세요"),
  email: z.string().email("올바른 이메일을 입력해주세요"),
  birthdate: z.string().optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
  photo: z.string().optional(), // Base64

  summary: z.string().max(500, "자기소개는 500자 이내").optional(),

  skills: z.array(z.object({
    name: z.string().min(1),
    proficiency: z.enum(["상", "중", "하"]).optional(),
    years: z.number().min(0).optional(),
  })),

  experiences: z.array(z.object({
    company: z.string().min(1, "회사명을 입력해주세요"),
    title: z.string().min(1, "직무를 입력해주세요"),
    startDate: z.string().min(1, "시작일을 입력해주세요"),
    endDate: z.string().nullable().optional(),
    bullets: z.array(z.string()),
  })),

  education: z.array(z.object({
    school: z.string().min(1),
    degree: z.string().optional(),
    field: z.string().optional(),
    year: z.string().optional(),
  })),

  projects: z.array(z.object({
    name: z.string().min(1),
    role: z.string().optional(),
    description: z.string().optional(),
    techStack: z.array(z.string()).optional(),
  })),

  certifications: z.array(z.string()).optional(),
});
```

## AI 응답 검증

```typescript
export const ResumeContentSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  summary: z.string(),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string().optional(),
    field: z.string().optional(),
    year: z.string().optional(),
  })),
  experiences: z.array(z.object({
    company: z.string(),
    title: z.string(),
    period: z.string(),
    bullets: z.array(z.string()),
  })),
  techStack: z.array(z.string()),
  projects: z.array(z.object({
    name: z.string(),
    role: z.string().optional(),
    period: z.string().optional(),
    description: z.string(),
    techStack: z.array(z.string()).optional(),
  })),
  certifications: z.array(z.string()).optional(),
});

export const MatchScoreSchema = z.object({
  score: z.number().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export const GenerateResponseSchema = z.object({
  analysis: z.object({
    requiredSkills: z.array(z.string()),
    preferredSkills: z.array(z.string()),
    keywords: z.array(z.string()),
    responsibilities: z.array(z.string()),
    qualifications: z.array(z.string()),
  }),
  resume: ResumeContentSchema,
  matchScore: MatchScoreSchema,
});
```

## 클라이언트 폼 에러 표시

```typescript
const result = ProfileSchema.safeParse(formData);

if (!result.success) {
  // result.error.issues 로 필드별 에러 접근
  // { path: ["name"], message: "이름을 입력해주세요" }
  const fieldErrors = result.error.issues.reduce((acc, issue) => {
    const field = issue.path.join(".");
    acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);
}
```

## API 에러 응답

```typescript
// Zod 검증 실패시
return NextResponse.json({
  success: false,
  error: { code: "INVALID_INPUT", message: "입력 형식이 올바르지 않습니다." },
}, { status: 400 });
```
