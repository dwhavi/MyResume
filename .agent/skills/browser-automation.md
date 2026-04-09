# Skill: browser-automation

> [!NOTE]
> Playwright를 활용하여 동적 웹 페이지(SPA)의 데이터를 수집하고, 이미지 분석을 위한 스크린샷을 생성하는 기술 가이드입니다.

## 핵심 로직

### 1. 브라우저 초기화
서버리스 환경이나 컨테이너 환경에서는 `chromium`을 `headless: true` 모드로 실행해야 합니다.

```typescript
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...'
});
const page = await context.newPage();
```

### 2. 페이지 대기 및 데이터 수집
채용 사이트는 데이터 로딩에 시간이 걸릴 수 있으므로 `networkidle`을 대기하거나 특정 셀렉터를 기다려야 합니다.

```typescript
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

// 텍스트 추출
const text = await page.innerText('body');

// 스크린샷 캡처 (AI Vision 분석용)
const screenshot = await page.screenshot({ fullPage: false, type: 'jpeg', quality: 80 });
const base64Image = screenshot.toString('base64');
```

## 주의 사항 (Pitfalls)
- **안티-봇(Anti-bot)**: `userAgent`를 설정하지 않으면 일부 사이트에서 차단될 수 있습니다.
- **리소스 최적화**: 분석이 끝나면 반드시 `await browser.close()`를 호출하여 메모리 누수를 방지해야 합니다.
- **다크 모드**: 캡처 시 브라우저 테마가 다크 모드일 경우 AI 인식률이 달라질 수 있으므로 라이트 모드를 권장합니다.

## 관련 프로젝트 파일
- `src/app/api/resumes/scrape/route.ts`
