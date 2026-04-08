# Decisions — MyResume

이 문서는 프로젝트의 주요 기술/설계 결정과 그 이유를 기록합니다.

## D1: Next.js App Router

**결정:** Next.js 14+ (App Router) 사용
**대안:** Vite + React, CRA
**이유:**
- 풀스택 단일 프로젝트 (API Routes로 서버사이드 로직 포함)
- Vercel 배포 원클릭
- App Router가 React Server Components 지원
- 파일 기반 라우팅으로 구조 직관적

## D2: gpt-4o-mini

**결정:** OpenAI gpt-4o-mini 사용
**대안:** gpt-4o, Claude, Gemini
**이유:**
- 비용 효율 (~$0.01/회)
- 한국어 처리 충분
- JSON 출력 안정적
- V2에서 Claude/Gemini 선택지 추가 고려

## D3: html2canvas + jspdf

**결정:** html2canvas + jspdf로 PDF 생성
**대안:** @react-pdf/renderer, react-to-print
**이유:**
- @react-pdf/renderer는 한글 폰트 처리가 끔찍함 (커스텀 폰트 로딩 불안정)
- html2canvas는 화면에 보이는 그대로 캡처 → 폰트 일관성 보장
- 단점: 래스터 기반이라 확대 시 깨짐 → 인쇄 품질(150dpi 이상) 기준으로 설정

## D4: useState + sessionStorage

**결정:** 상태 관리로 useState + sessionStorage 사용
**대안:** Zustand, Redux, Context API
**이유:**
- MVP에 DB 없음 → 전역 상태 최소화
- 폼 상태는 useState로 컴포넌트 로컬 관리 충분
- sessionStorage로 새로고침 유지
- localStorage로 프로필만 영구 저장
- Zustand는 과한 도입

## D5: API 엔드포인트 1개

**결정:** `/api/resumes/generate` 하나로 공고 분석 + 이력서 생성 통합
**대안:** `/api/jobs/analyze` + `/api/resumes/generate` 분리
**이유:**
- 프론트엔드 UX 단순화 (한 번의 호출)
- 서버 내부에서 2단계 체인으로 처리
- V2에서 부분 재생성 API 추가 시 분리 고려

## D6: 스트리밍 제외

**결정:** 스트리밍 응답 미사용
**대안:** Server-Sent Events, streaming API
**이유:**
- 구현 난이도 2배
- 로딩 UI + 단계별 메시지로 충분
- 생성 시간 15~30초 → 스트리밍의 이점이 크지 않음

## D7: URL 크롤링 제외

**결정:** 채용공고 URL 크롤링 미구현
**대안:** Puppeteer, Cheerio, 외부 API
**이유:**
- 사이트별 차단 많음 (잡코리아, 원티드 등)
- 유지보수 지옥
- 사용자가 텍스트 복사/붙여넣기하는 것이 가장 안정적

## D8: 1차 타겟 — 주니어~미드 IT 개발자

**결정:** 경력 1~7년 프론트엔드/백엔드/풀스택 개발자 타겟
**이유:**
- 채용공고마다 이력서 맞춤 수정이 가장 필요한 그룹
- IT 직무 이력서 형식이 가장 구조화되어 있어 AI 처리 용이
- 프롬프트 튜닝 방향 명확화

## D9: 정합성 점수를 핵심 차별화로

**결정:** GAP 분석(정합성 점수)을 MVP 핵심 기능으로 포함
**이유:**
- Resume.io, 취업비서 등 기존 서비스에 없는 기능
- "채용공고 하나 → 맞춤 이력서 하나"의 가치를 시각적으로 증명
- 선택이 아닌 필수 — 이것만 있어도 차원이 다름

## D10: 에러 시 그레이스풀 폴백

**결정:** AI 생성 실패 시 빈 화면 대신 기본 초안 템플릿 표시
**이유:**
- 빈 화면은 UX 재앙
- 사용자가 입력한 프로한를 기반으로 한 초안이라도 보여주면 이탈 방지
- 수동 편집 유도
