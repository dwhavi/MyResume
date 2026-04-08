# API Design — MyResume

## POST /api/resumes/generate

채용공고 분석 + 이력서 생성을 하나의 엔드포인트로 처리.

### Request

```typescript
{
  jobDescription: string;   // 채용공고 텍스트 (최대 10,000자)
  profile: {
    name: string;
    phone: string;
    email: string;
    birthdate?: string;      // YYYY-MM-DD
    address?: string;
    gender?: string;
    photo?: string;          // Base64 JPEG/PNG
    summary?: string;        // 자기소개
    skills: Array<{
      name: string;
      proficiency?: string;  // 상/중/하
      years?: number;
    }>;
    experiences: Array<{
      company: string;
      title: string;
      startDate: string;
      endDate?: string;      // 재직중이면 null
      bullets: string[];
    }>;
    education: Array<{
      school: string;
      degree?: string;
      field?: string;
      year?: string;
    }>;
    projects: Array<{
      name: string;
      role?: string;
      description?: string;
      techStack?: string[];
    }>;
    certifications?: string[];
  };
}
```

### Response (성공)

```typescript
{
  success: true;
  analysis: {
    requiredSkills: string[];
    preferredSkills: string[];
    keywords: string[];
    responsibilities: string[];
    qualifications: string[];
  };
  resume: {
    // 구조화된 이력서 JSON — data-model.md 참고
    content: ResumeContent;
  };
  matchScore: {
    score: number;             // 0~100
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
  };
}
```

### 에러 응답

```typescript
{
  success: false;
  error: {
    code: string;
    message: string;          // 사용자에게 표시할 메시지
  };
}
```

### 에러 코드

| 에러 코드 | HTTP | 사용자 메시지 | 원인 |
|----------|------|-------------|------|
| `INPUT_TOO_LONG` | 400 | 채용공고는 10,000자 이내로 입력해주세요. | jobDescription.length > 10000 |
| `INVALID_INPUT` | 400 | 입력 형식이 올바르지 않습니다. | Zod 검증 실패 |
| `RATE_LIMITED` | 429 | 요청이 너무 많습니다. 1분 뒤 다시 시도해주세요. | Rate limit 초과 |
| `AI_SERVICE_ERROR` | 500 | 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요. | API 키 오류 등 |
| `AI_PARSE_ERROR` | 502 | 이력서 생성에 실패했습니다. 다시 시도해주세요. | JSON 파싱 실패 (1회 재시도 후) |
| `TIMEOUT` | 504 | 생성 시간이 초과되었습니다. 공고를 짧게 줄이거나 다시 시도해주세요. | 60초 타임아웃 |

### Rate Limiting

- 분당 3회 (IP 기준)
- 구현: 메모리 기반 (Vercel Hobby Plan, 단일 인스턴스 가정)

### 내부 처리 흐름

```
1. Zod로 request body 검증
2. 입력 sanitize (프롬프트 주입 방지)
3. OpenAI API 호출
   - system prompt + few-shot + jobDescription + profile
   - response_format: { type: "json_object" }
   - temperature: 0.4
   - timeout: 60초
4. JSON 파싱 → Zod로 response 검증
5. 실패 시 1회 재시도
6. 정합성 점수 계산
7. 응답 반환
```

---

## GET /api/resumes/[id]/pdf (V2, MVP에서는 클라이언트에서 처리)

MVP에서는 PDF 변환을 클라이언트(html2canvas + jspdf)에서 처리.
V2에서 서버사이드 PDF 생성으로 이동 예정.
