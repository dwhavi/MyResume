# Skill: OpenAI JSON 출력 패턴

## 기본 설정

```typescript
import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  temperature: 0.4,
  response_format: { type: "json_object" },
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ],
  timeout: 60000, // 60초
});
```

## JSON 출력 강제

1. `response_format: { type: "json_object" }` — 모델 수준에서 JSON 강제
2. 시스템 프롬프트에 "반드시 JSON 형식으로 출력하세요" 명시
3. 출력 구조를 프롬프트에 명시

## 파싱 + 재시도 패턴

```typescript
async function callWithRetry(
  messages: Array<{ role: string; content: string }>,
  maxRetries = 1
) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("Empty response");

      const parsed = JSON.parse(content);
      // Zod 검증
      return GenerateResponseSchema.parse(parsed);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      // 1회 재시도
    }
  }
}
```

## 프롬프트 주입 방어

```typescript
function sanitizeInput(text: string): string {
  return text
    .replace(/<system>/gi, "")
    .replace(/<\/system>/gi, "")
    .replace(/<user>/gi, "")
    .replace(/<\/user>/gi, "")
    .replace(/<assistant>/gi, "")
    .replace(/<\/assistant>/gi, "")
    .slice(0, 10000); // 길이 제한
}
```

## 비용 참고 (gpt-4o-mini)

| 항목 | 토큰 | 비용 |
|------|------|------|
| System prompt + few-shot | ~2,000 | $0.0003 |
| 입력 (공고 + 프로필) | ~2,000 | $0.0003 |
| 출력 (이력서 JSON) | ~2,000 | $0.006 |
| **1회 합계** | ~6,000 | **~$0.007** |

## 에러 처리

| 에러 | 처리 |
|------|------|
| `openai.APIError` (401/500) | 서버 오류 메시지 반환 |
| `JSON.parse` 실패 | 1회 재시도 후 502 |
| Zod 검증 실패 | 1회 재시도 후 502 |
| 타임아웃 (60초) | AbortController + 504 |
