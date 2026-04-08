# Architecture — MyResume

## 전체 구조

Next.js 14+ App Router 기반 풀스택 웹앱. 클라이언트 상태만으로 동작 (MVP는 DB 없음).

```
[사용자] → [Next.js App] → [OpenAI API]
                ↕
          [sessionStorage]
          [localStorage (프로필 영구)]
```

## 아키텍처 계층 (엄격한 단방향 의존성)

```
┌─────────────────────────────────────────────┐
│  Pages (app/)                               │  ← 최상위, UI 조합만
├─────────────────────────────────────────────┤
│  Components (components/)                    │  ← UI 컴포넌트, lib만 import
├─────────────────────────────────────────────┤
│  API Routes (app/api/)                      │  ← 서버 엔드포인트, server/만 import
├─────────────────────────────────────────────┤
│  Lib (lib/)                                  │  ← 클라이언트 유틸, schemas만 import
├─────────────────────────────────────────────┤
│  Server (server/)                            │  ← 서버 전용, schemas만 import
├─────────────────────────────────────────────┤
│  Schemas (schemas/)                          │  ← Zod 스키마, types만 import
├─────────────────────────────────────────────┤
│  Types (types/)                              │  ← 순수 TypeScript 타입, 의존 없음
└─────────────────────────────────────────────┘
```

### 의존성 규칙
- 의존성은 **아래로만** (Pages → Components → Lib/Server → Schemas → Types)
- Components에서 `server/` 직접 import **금지** (API를 통해서만)
- API Routes에서 Components import **금지**
- `lib/api-client.ts`가 Components와 API Routes 사이의 유일한 통로
- 순환 의존 **절대 금지** (tsc + ESLint import/no-cycle로 강제)

### 교차 관심사 (Cross-cutting Concerns)
- **인증:** MVP에서 없음 (V2에서 추가)
- **로깅:** 서버는 console, 클라이언트는 필요시 console.error만
- **에러 처리:** 각 계층에서 Zod/try-catch로 경계 검증 (GR-1)

## 라우팅

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 페이지 |
| `/resume` | 스텝퍼 (step 1~4를 URL searchParams로 관리) |

단일 페이지에 step 쿼리 파라미터로 구분:
- `/resume?step=1` — 채용공고 입력
- `/resume?step=2` — 프로필 입력
- `/resume?step=3` — 공고 분석 결과 확인
- `/resume?step=4` — 이력서 미리보기 + PDF 다운로드

## 컴포넌트 구조

```
<ResumePage>
  <Stepper step={currentStep} />
  {step === 1 && <JobInput />}
  {step === 2 && <ProfileForm />}
  {step === 3 && <JobAnalyzer analysis={...} />}
  {step === 4 && (
    <>
      <MatchScore score={...} />
      <ResumePreview resume={...} />
      <PdfDownloadButton />
    </>
  )}
</ResumePage>
```

## 데이터 흐름

```
① 채용공고 텍스트 입력
   → sessionStorage에 저장

② 프로필 입력 (구조화된 폼 + 사진 업로드)
   → sessionStorage에 저장 + localStorage에 영구 저장

③ POST /api/resumes/generate
   Request: { jobDescription, profile }
   
   서버 내부:
   → 1단계: 공고 분석 (키워드, 요구사항 추출)
   → 2단계: 정합성 점수 계산 (프로필 vs 공고 매칭)
   → 3단계: 이력서 JSON 생성
   → Zod 검증
   
   Response: { analysis, resume, matchScore }

④ 미리보기 + 수정 + PDF 다운로드
```

## 상태 관리

| 데이터 | 저장소 | 생명주기 |
|--------|--------|----------|
| 채용공고 텍스트 | sessionStorage | 탭 유지 중 |
| 프로필 (작성 중) | sessionStorage | 탭 유지 중 |
| 프로필 (완성) | localStorage | 영구 (재방문 시 자동 복원) |
| 공고 분석 결과 | sessionStorage | 탭 유지 중 |
| 생성된 이력서 | sessionStorage | 탭 유지 중 |
| 현재 스텝 | URL searchParams | 북마크 가능 |

## 환경변수

```env
OPENAI_API_KEY=sk-...        # 필수, 서버사이드만
NEXT_PUBLIC_APP_URL=...      # 선택, 배포 URL
```

**주의:** API 키는 절대 NEXT_PUBLIC_ 접두사를 사용하지 말 것 (GR-2).
