import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MD_PARSE_PROMPT } from '@/server/prompts';

// Gemini 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { markdown } = await req.json();

    if (!markdown) {
      return NextResponse.json({ error: { message: '가져올 내용이 없습니다.' } }, { status: 400 });
    }

    // 2. Gemini AI에 구조화된 데이터 복원 요청 (503 에러 대응을 위한 재시도 로직 포함)
    // 검사 필드: 모델명 gemini-flash-latest로 통일
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      generationConfig: { responseMimeType: 'application/json' }
    });
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const finalPrompt = `
${MD_PARSE_PROMPT}

[대상 Markdown]
${markdown}
`;

    let result;
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        result = await model.generateContent(finalPrompt);
        break;
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'status' in err && err.status === 503 && retryCount < maxRetries) {
          retryCount++;
          console.warn(`[Gemini Markdown 503] 과부하 발생, 재시도 중... (${retryCount}/${maxRetries})`);
          await sleep(2000);
          continue;
        }
        throw err;
      }
    }

    if (!result) throw new Error('AI 응답을 생성하지 못했습니다.');

    const responseText = result.response.text();
    const extractedData = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      data: extractedData
    });

  } catch (error: unknown) {
    console.error('[Parse Markdown Error]:', error);
    const isOverload = error && typeof error === 'object' && 'status' in error && error.status === 503;
    const errorMessage = isOverload 
      ? '서버 과부하로 나중에 다시 시도해 주세요.' 
      : (error instanceof Error ? error.message : 'Markdown 분석 중 오류가 발생했습니다.');

    return NextResponse.json({
      error: {
        message: errorMessage
      }
    }, { status: isOverload ? 503 : 500 });
  }
}
