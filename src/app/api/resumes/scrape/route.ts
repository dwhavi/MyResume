import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SCRAPE_PROMPT } from '@/server/prompts';

// Gemini 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  let browser;
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: { message: 'URL이 필요합니다.' } }, { status: 400 });
    }

    // 1. Playwright 브라우저 실행
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 1600 },
    });
    const page = await context.newPage();

    // 2. 페이지 접속 및 대기 (네트워크가 멈출 때까지 기다리지 않고 DOM 로드 시 즉시 시작)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // 지연 로딩 이미지 및 동적 콘텐츠 렌더링을 위해 3초 대기
    await page.waitForTimeout(3000);

    // 3. 텍스트 및 스크린샷 추출
    const pageTitle = await page.title();
    const innerText = await page.innerText('body');
    const screenshot = await page.screenshot({ type: 'jpeg', quality: 80 });
    const base64Image = screenshot.toString('base64');

    await browser.close();
    browser = null;

    // 4. Gemini Vision AI에 분석 요청 (503 에러 대응을 위한 재시도 로직 포함)
    // 검증된 모델 식별자인 gemini-flash-latest 사용
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const finalPrompt = `
${SCRAPE_PROMPT}

[페이지 정보]
제목: ${pageTitle}
텍스트 데이터: ${innerText.substring(0, 3000)}... (일부)
`;

    let result;
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        result = await model.generateContent([
          finalPrompt,
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg',
            },
          },
        ]);
        break; // 성공 시 루프 탈출
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'status' in err && err.status === 503 && retryCount < maxRetries) {
          retryCount++;
          console.warn(`[Gemini Scrape 503] 과부하 발생, 재시도 중... (${retryCount}/${maxRetries})`);
          await sleep(2000); // 2초 대기
          continue;
        }
        throw err; // 그 외 에러나 재시도 횟수 초과 시 투척
      }
    }

    if (!result) throw new Error('AI 응답을 생성하지 못했습니다.');

    const responseText = result.response.text();

    return NextResponse.json({
      content: responseText,
      success: true
    });

  } catch (error: unknown) {
    console.error('[Scrape Error]:', error);
    
    if (browser) await browser.close();

    const isOverload = error && typeof error === 'object' && 'status' in error && error.status === 503;
    const errorMessage = isOverload 
      ? '서버 과부하로 나중에 다시 시도해 주세요.' 
      : (error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');

    return NextResponse.json({
      error: {
        message: isOverload ? errorMessage : '공고 분석 중 오류가 발생했습니다. URL을 확인하거나 직접 텍스트를 붙여넣어주세요.',
        details: errorMessage
      }
    }, { status: isOverload ? 503 : 500 });
  }
}
