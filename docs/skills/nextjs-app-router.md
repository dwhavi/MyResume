# Skill: Next.js App Router

## 라우팅

- `src/app/` 기반 파일 시스템 라우팅
- `page.tsx` = 페이지 컴포넌트
- `layout.tsx` = 레이아웃 (공통 UI)
- `route.ts` = API 엔드포인트

## Server vs Client 컴포넌트

### Server Component (기본)
- 서버에서만 실행, JS 클라이언트 전송 안 됨
- DB/파일 접근, API 키 사용 가능
- `async` 함수 가능

### Client Component
- `"use client"` 지시어 필수
- useState, useEffect, 이벤트 핸들러, 브라우저 API 필요시
- **이 프로젝트에서 대부분의 UI 컴포넌트는 Client Component**

```tsx
"use client";
// 여기서 useState, onClick, html2canvas 등 사용
```

## API Routes

```typescript
// src/app/api/resumes/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  // ...
  return NextResponse.json({ ... });
}
```

## 주의사항

- `NEXT_PUBLIC_` 없는 환경변수는 서버에서만 접근 가능
- Client Component에서 서버 전용 기능 사용하면 빌드 에러
- 동적 임포트 필요시: `const Component = dynamic(() => import("./Component"))`
- Image 컴포넌트 사용시 `next.config.js`에 도메인 설정
