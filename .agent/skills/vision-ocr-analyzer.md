# Skill: vision-ocr-analyzer

> [!NOTE]
> Gemini 1.5 Flash의 멀티모달 기능을 사용하여 이미지 형태의 채용공고에서 텍스트를 추출하고 의미 있는 구조로 정제하는 기술 가이드입니다.

## 핵심 로직

### 1. Gemini Vision 요청 구성
이미지 데이터(Base64)와 정밀한 프롬프트를 함께 전달합니다.

```typescript
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `
당신은 채용공고 분석 전문가입니다. 
첨부된 이미지(또는 텍스트)에서 오직 '채용과 관련된 정보'만 발췌하여 한국어로 정리해주세요.
메뉴, 하단 광고, 회사 소개 등 부차적 정보는 제외하세요.

필수 포함 항목:
1. 주요 업무 (Responsibilities)
2. 자격 요건 (Qualifications)
3. 우대 사항 (Preferred)
4. 기술 스택 (Keywords)
`;

const result = await model.generateContent([
  prompt,
  {
    inlineData: {
      data: base64Image,
      mimeType: "image/jpeg",
    },
  },
]);
```

### 2. 정규화 및 정제
AI가 반환한 텍스트에서 마크다운 형식을 제거하거나 구조를 다듬어 프론트엔드 `textarea`에 최적화된 형태로 가공합니다.

## 성능 팁 (Best Practices)
- **High Resolution**: `html2canvas`나 `screenshot` 캡처 시 해상도가 높을수록 인식률이 올라갑니다.
- **Context Providing**: 이미지와 함께 스크래핑된 원본 텍스트(InnerText)를 함께 제공하면 AI가 더 정확하게 맥락을 파악합니다.
- **Strict Prompting**: "발췌" 보다는 "정리 및 요약"을 요청하여 불필요한 문구를 제거하도록 유도합니다.

## 관련 프로젝트 파일
- `src/app/api/resumes/scrape/route.ts`
- `src/components/JobInput.tsx`
