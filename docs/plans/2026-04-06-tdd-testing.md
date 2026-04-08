# TDD 실행 계획 — MyResume

## 상태
- **상태:** in-progress
- **생성일:** 2026-04-06

## 목표

TDD 방법론으로 MyResume 프로젝트의 단위 테스트를 작성한다.
레이어 하향식 (Schemas → Lib → Server → API Routes → Components)으로 진행.

## 커버리지 목표

| 메트릭 | 최소 |
|--------|------|
| Statements | 80% |
| Branches | 70% |
| Functions | 80% |
| Lines | 80% |

## 작업 항목

### Phase 1: 테스트 환경 세팅
- [ ] Vitest + @testing-library/react + jsdom 설치
- [ ] vitest.config.ts 설정 (경로 별칭, 커버리지 임계값)
- [ ] src/__tests__/setup.ts 생성
- [ ] 테스트 헬퍼 유틸 (createValidProfile, createValidJobDescription)
- [ ] package.json에 test 스크립트 추가

### Phase 2: Schemas 테스트
- [ ] ProfileSchema — 유효 입력, 이름 빈값, 이메일 형식, 500자 초과, endDate null
- [ ] ResumeContentSchema — 필수 필드 누락, 타입 불일치
- [ ] MatchScoreSchema — 점수 범위 (0~100), 빈 배열 허용
- [ ] GenerateResponseSchema — 전체 응답 구조 검증

### Phase 3: Lib 테스트
- [ ] pdf.ts — PDF 생성, 2페이지 분할, 폰트 대기
- [ ] storage.ts — sessionStorage 저장/조회/삭제, localStorage 영구 저장
- [ ] api-client.ts — API 호출 성공, 에러 응답, 타임아웃

### Phase 4: Server 테스트 (모킹)
- [ ] openai.ts — 유효 응답, API 에러 재시도(2회), JSON 파싱 실패, 입력 sanitize
- [ ] prompts.ts — 시스템 프롬프트 내용 검증, 길이 제한

### Phase 5: API Routes 테스트 (모킹)
- [ ] POST /api/resumes/generate — 200 성공, 400 입력 초과, 400 Zod 실패, 429 Rate limit, 500 AI 에러, 504 타임아웃

### Phase 6: Components 테스트
- [ ] MatchScore — 점수 표시, 매칭/누락 키워드, 제안 목록
- [ ] Stepper — 단계 표시, 활성/비활성 상태
- [ ] ProfileForm — 입력 렌더링, 유효성 에러 표시
- [ ] JobAnalyzer — 키워드 태그, 스킬 목록 표시

## 테스트 컨벤션

- 테스트 파일: 소스 파일 옆에 `.test.ts` / `.test.tsx` (colocated)
- describe: 도메인/함수명
- it: "행동 기반" 설명 ("유효한 입력이면 200을 반환한다")
- 모킹은 경계에서만 (OpenAI, html2canvas, jsPDF)
- 테스트 실패 시 실패 내역만 표시, 성공은 요약만

## 의사결정 로그

### 2026-04-06 — Vitest 선택
- 맥락: Next.js 테스트 프레임워크 선택
- 대안: Jest (Next.js 기본), Vitest
- 결과: Vitest 선택 — 빠른 실행 속도, ESM 네이티브, Vite 생태계 통합
