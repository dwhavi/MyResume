# Linting & CI — MyResume

## ESLint 규칙

### 필수 플러그인
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ]
}
```

### 프로젝트 커스텀 규칙

| 규칙 | 설정 | 이유 |
|------|------|------|
| `no-explicit-any` | `error` | 경계 파싱 원칙(GR-1) 강제 |
| `@typescript-eslint/no-unused-vars` | `error` | 데드 코드 방지 |
| `no-console` | `error` (server), `warn` (client) | 서버 로깅은 구조화된 로거 사용 |
| `import/no-cycle` | `error` | 순환 의존 방지(GR-6) |
| `max-lines` | `{"max": 300, "skipBlankLines": true, "skipComments": true}` | 파일 크기 제한(GR-9) |

### 의존성 방향 강제 (tsc + 경로 별칭)

`tsconfig.json`에서 경로 별칭을 설정하여 계층별 접근을 제어:

```json
{
  "compilerOptions": {
    "paths": {
      "@/types/*": ["src/types/*"],
      "@/schemas/*": ["src/schemas/*"],
      "@/lib/*": ["src/lib/*"],
      "@/server/*": ["src/server/*"],
      "@/components/*": ["src/components/*"]
    },
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strict": true
  }
}
```

## 프리티어

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

## 빌드 체크

PR 전 반드시 통과해야 할 것:

```bash
# 1. 타입 체크
npx tsc --noEmit

# 2. 린트
npx next lint

# 3. 빌드
npx next build

# 4. (선택) 테스트
npx vitest run
```

## 커밋 훅 (husky + lint-staged)

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## Vercel 배포

- `vercel.json` 설정 없이 기본 Next.js 배포
- 환경변수: Vercel 대시보드에서 `OPENAI_API_KEY` 설정
- 빌드 시 `tsc --noEmit` + `next lint` 자동 실행

## 문서 정리 (Doc Gardening)

코드가 변경되면 관련 문서도 업데이트하세요:
- API 스펙 변경 → `docs/api-design.md` 업데이트
- 데이터 모델 변경 → `docs/data-model.md` + `docs/schemas/` 업데이트
- 새로운 의사결정 → `docs/decisions.md`에 추가
- 완료된 실행 계획 → `docs/plans/`에서 상태를 `done`으로 변경
