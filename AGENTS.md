<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — MyResume: AI 이력서 맞춤 생성기

> 채용공고를 분석하고, 사용자 경력/스킬에 맞춰 AI가 맞춤 이력서를 생성하는 웹 앱

## 프로젝트 개요

IT/개발 직무 구직자(주니어~미드)가 채용공고를 붙여넣으면, AI가 키워드 분석 → 정합성 점수 도출 → 최적화된 이력서를 자동 생성하는 서비스.

**핵심 차별화:** 정합성 점수(GAP 분석) — 공고 vs 프로필 매칭을 시각화

## 기술 스택

- **Next.js 14+** (App Router) + TypeScript + Tailwind CSS
- **상태 관리:** useState + sessionStorage (MVP, DB 없음)
- **AI:** OpenAI API (gpt-4o-mini, temperature 0.3~0.5)
- **PDF:** html2canvas + jspdf
- **배포:** Vercel (Hobby Plan)
- **사진 크롭:** react-easy-crop
- **스키마 검증:** Zod

## 문서 참조 규칙 (에이전트 필독)

> ⚠️ **이 규칙은 모든 작업에서 반드시 준수해야 합니다.**

### ❌ 절대 읽지 말 것

| 파일 | 이유 |
|------|------|
| `MyResume.md` | 초기 기획서 (아카이브). 이미 `docs/`로 내용이 이관됨. 진실의 소스가 아님 |

### ✅ 참조 우선순위

1. **이 파일 (`AGENTS.md`)** — 항상 먼저 읽음 (목차 + 제약 규칙)
2. **`docs/golden-rules.md`** — 코드 생성 전 반드시 확인
3. **작업 관련 `docs/*.md`** — 해당 작업에 필요한 파일만 선택적으로 읽음

### 📖 선택적 읽기 원칙

- **전체를 미리 다 읽지 않는다.** 작업 중 필요가 생길 때만 해당 파일을 읽는다.
- 어떤 파일을 읽을지는 아래 지식 베이스 목차에서 용도를 보고 판단한다.
- 예시:
  - API Route 작성 중 → `docs/api-design.md` + `.agent/skills/openai-json-output.md`
  - PDF 생성 중 → `docs/pdf-spec.md` + `.agent/skills/html2canvas-jspdf.md`
  - 폼 컴포넌트 작성 중 → `docs/ui-ux.md` + `docs/data-model.md`
  - 테스트 작성 중 → `.agent/skills/tdd-testing.md`
  - 사진 업로드/크롭 중 → `.agent/skills/react-easy-crop.md`

---

## 지식 베이스 (시스템 오브 트루스)

이 파일은 **목차**입니다. 상세 내용은 각 문서를 참조하세요.

### 설계 & 아키텍처
| 파일 | 내용 |
|------|------|
| `docs/architecture.md` | 앱 아키텍처, 계층 구조, 라우팅, 데이터 흐름 |
| `docs/api-design.md` | API 엔드포인트, 요청/응답 스펙, 에러 코드 |
| `docs/data-model.md` | Profile, JobAnalysis, Resume 데이터 모델 + Zod 스키마 |
| `docs/prompt-design.md` | 프롬프트 설계, few-shot 예시, 체인 분리 전략 |
| `docs/pdf-spec.md` | PDF 렌더링 명세 (한글 폰트, A4, 사진 배치) |
| `docs/ui-ux.md` | 스텝퍼 구조, 폼 전략, 모바일 최적화, 에러 UX |

### 규칙 & 원칙
| 파일 | 내용 |
|------|------|
| `docs/decisions.md` | 의사결정 기록 (왜 이 선택을 했는지) |
| `docs/golden-rules.md` | **황금 원칙** — 에이전트가 반드시 지켜야 할 불변의 규칙 |
| `docs/linting-ci.md` | 린터 설정, CI 체크, 기계적 강제 규칙 |

### 품질 & 계획
| 파일 | 내용 |
|------|------|
| `docs/quality/grading.md` | 도메인별 품질 등급 및 갭 추적 |
| `docs/plans/` | 실행 계획 (진행 상황 + 의사결정 로그) |

### 스킬 (코드 패턴 참고)
| 파일 | 내용 |
|------|------|
| `.agent/skills/nextjs-app-router.md` | App Router, Server/Client 분리 |
| `.agent/skills/korean-resume-format.md` | 한국 이력서 항목순서, 작법, 톤 |
| `.agent/skills/html2canvas-jspdf.md` | PDF 생성 패턴 + 함정 |
| `.agent/skills/openai-json-output.md` | JSON 출력 + 재시도 + 주입 방어 |
| `.agent/skills/zod-validation.md` | Zod 스키마 검증 패턴 |
| `.agent/skills/react-easy-crop.md` | 사진 업로드+크롭+압축 |
| `.agent/skills/tdd-testing.md` | TDD 단위 테스트 (Vitest, 레이어별 패턴) |

## 아키텍처 계층 (엄격)

```
Types → Schemas → Lib (유틸) → API Routes → Components → Pages
```

- 의존성은 **반드시 아래로만** (위쪽 레이어는 아래쪽만 import)
- Components는 API Routes를 직접 호출하지 않고 `lib/api-client.ts` 통해 호출
- API Routes는 OpenAI 호출을 직접하지 않고 `lib/openai.ts` 통해 호출
- Types/Schemas는 어떤 레이어도 import 가능

## PR 워크플로

1. 작업 전 `docs/plans/`에 실행 계획 작성 (간단한 변경은 생략 가능)
2. 구현 완료 후 자가 검토
3. 빌드 + 린트 통과 확인
4. 커밋 메시지: `feat:` / `fix:` / `refactor:` / `docs:` 접두어
5. PR은 짧게 유지, 작은 단위로 자주 병합

## 파일 구조

```
src/
├── app/                          # Pages 레이어
│   ├── layout.tsx
│   ├── page.tsx                  # 랜딩
│   └── api/resumes/              # API Routes 레이어
│       └── generate/route.ts
├── components/                   # Components 레이어
│   ├── Stepper.tsx
│   ├── JobAnalyzer.tsx
│   ├── ProfileForm.tsx
│   ├── ResumePreview.tsx
│   ├── MatchScore.tsx
│   └── PhotoCrop.tsx
├── lib/                          # Lib 레이어 (유틸, 클라이언트)
│   ├── api-client.ts             # API 호출 래퍼
│   ├── pdf.ts                    # PDF 생성
│   └── storage.ts                # sessionStorage/localStorage 유틸
├── server/                       # 서버 전용 (API Routes만 접근)
│   ├── openai.ts                 # OpenAI 클라이언트
│   └── prompts.ts                # 프롬프트 상수
├── schemas/                      # Schemas 레이어 (Zod)
│   ├── profile.ts
│   ├── resume.ts
│   └── api.ts
└── types/                        # Types 레이어 (순수 타입)
    └── index.ts
```
