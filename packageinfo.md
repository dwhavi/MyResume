---
summary: "채용공고를 분석하고 AI가 맞춤 이력서를 생성하는 웹 앱"
icon: "📄"
tags: ["ai", "resume", "job", "recruiting"]
---

# 사용 기술

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API (gpt-4o-mini)
- html2canvas + jspdf (PDF 생성)
- react-easy-crop (사진 크롭)
- Zod (스키마 검증)
- sessionStorage (상태 관리)

# 프로젝트 구조

```
src/
  app/                          # Pages 레이어
    layout.tsx
    page.tsx                    # 랜딩
    api/resumes/generate/route.ts  # API Routes
  components/                   # Components 레이어
    Stepper.tsx
    JobAnalyzer.tsx
    ProfileForm.tsx
    ResumePreview.tsx
    MatchScore.tsx
    PhotoCrop.tsx
  lib/                          # Lib 레이어 (유틸, 클라이언트)
    api-client.ts               # API 호출 래퍼
    pdf.ts                      # PDF 생성
    storage.ts                  # sessionStorage/localStorage 유틸
  server/                       # 서버 전용 (API Routes만 접근)
    openai.ts                   # OpenAI 클라이언트
    prompts.ts                  # 프롬프트 상수
  schemas/                      # Schemas 레이어 (Zod)
    profile.ts
    resume.ts
    api.ts
  types/                        # Types 레이어 (순수 타입)
    index.ts
```

# 기능

## 채용공고 분석
- 텍스트 붙여넣기로 채용공고 입력
- AI가 키워드 자동 분석
- 정합성 점수 도출 (공고 vs 프로필 매칭 시각화)

## 이력서 생성
- 사용자 경력/스킬 입력
- 최적화된 이력서 자동 생성
- 한글 이력서 포맷 준수

## PDF 내보내기
- A4 크기 PDF 생성
- 한글 폰트 지원
- 사진 배치 및 레이아웃 최적화

## 사진 업로드
- 사진 업로드
- 자동 크롭
- 압축

## UI/UX
- 스텝퍼 구조
- 모바일 최적화
- 에러 UX

# 문서 참조

| 문서 | 설명 |
|------|------|
| AGENTS.md | 에이전트 규칙, 지식 베이스 목차 |
| architecture.md | 앱 아키텍처, 계층 구조, 데이터 흐름 |
| api-design.md | API 엔드포인트, 요청/응답 스펙 |
| data-model.md | Profile, JobAnalysis, Resume 데이터 모델 |
| prompt-design.md | 프롬프트 설계, few-shot 예시 |
| pdf-spec.md | PDF 렌더링 명세 |
| ui-ux.md | 스텝퍼 구조, 폼 전략 |
