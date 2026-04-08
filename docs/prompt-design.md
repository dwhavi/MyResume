# Prompt Design — MyResume

## 설계 원칙

1. **체인 분리:** 공고 분석과 이력서 생성을 내부적으로 2단계로 처리 (하나의 API 호출 안에서)
2. **temperature 0.3~0.5:** 창의성보다 일관성
3. **response_format: json_object:** 안정적인 JSON 출력
4. **few-shot 2~3개:** 한국어 IT 이력서 실제 좋은 예시
5. **부정적 지시사항:** hallucination 방지 강조
6. **별도 파일 관리:** `src/lib/prompts.ts`에 상수로 분리, 버전관리

## 시스템 프롬프트

```
당신은 10년 경력의 IT 채용 컨설턴트입니다.
삼성, 네이버, 카카오 등 국내 대기업과 유니콘 스타트업의
이력서를 500건 이상 검토한 전문가입니다.

[출력 규칙]
- 반드시 JSON 형식으로 출력하세요
- 한국어 이력서 표준 순서를 따르세요: 기본정보 → 자기소개 → 학력 → 경력 → 기술스택 → 프로젝트 → 자격증
- 총 A4 2장 이내로 작성하세요
- 자기소개는 500자 이내, 경력 기술은 각 항목 200자 이내로 작성하세요
- 경력은 최신순으로 정렬하세요

[절대 하지 말 것]
- 사용자가 제공하지 않은 정보를 절대 만들어내지 마세요
- 과도한 자기PR 문구를 사용하지 마세요
- 공고에 없는 기술을 이력서에 포함하지 마세요
- 사용자의 실제 경력을 과장하거나 왜곡하지 마세요

[정합성 분석]
- 채용공고에서 핵심 키워드와 요구사항을 추출하세요
- 사용자 프로필과 매칭하여 0~100점의 정합성 점수를 계산하세요
- 매칭된 키워드와 누락된 키워드를 명시하세요
- 구체적인 개선 제안을 작성하세요
```

## 출력 JSON 구조

프롬프트에 포함할 출력 스키마 안내:

```json
{
  "analysis": {
    "requiredSkills": ["string"],
    "preferredSkills": ["string"],
    "keywords": ["string"],
    "responsibilities": ["string"],
    "qualifications": ["string"]
  },
  "resume": {
    "name": "string",
    "phone": "string",
    "email": "string",
    "summary": "string",
    "education": [{ "school": "string", "degree": "string", "field": "string", "year": "string" }],
    "experiences": [{ "company": "string", "title": "string", "period": "string", "bullets": ["string"] }],
    "techStack": ["string"],
    "projects": [{ "name": "string", "role": "string", "period": "string", "description": "string", "techStack": ["string"] }],
    "certifications": ["string"]
  },
  "matchScore": {
    "score": 87,
    "matchedKeywords": ["TypeScript", "React", "CI/CD"],
    "missingKeywords": ["팀 리딩 경험"],
    "suggestions": ["'성능 최적화 경험'을 추가하면 매칭도 상승 예상입니다"]
  }
}
```

## Few-shot 예시 (필요시 추가)

실제 좋은 한국어 IT 이력서 예시를 2~3개 user/assistant 쌍으로 추가.
프롬프트 파일에 주석으로 관리.

## 프롬프트 주입 방어

1. **입력 sanitize:** 특수문자 필터링 (system/user 메시지 분리)
2. **길이 제한:** jobDescription 최대 10,000자
3. **역할 고정:** 시스템 프롬프트에서 "IT 채용 컨설턴트"로 역할 고정
4. **JSON 강제:** response_format: json_object로 자유 텍스트 출력 차단

## 프롬프트 버전관리

`src/lib/prompts.ts`:
```typescript
export const SYSTEM_PROMPT = `...` as const;
export const OUTPUT_SCHEMA = `...` as const;
export const FEW_SHOT_EXAMPLES = [ ... ] as const;
// 버전: v1.0 — MVP 초기 버전
```

프롬프트 수정 시 주석으로 버전 기록.
