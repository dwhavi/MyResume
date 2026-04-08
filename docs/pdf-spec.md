# PDF Specification — MyResume

## 렌더링 방식

**html2canvas + jspdf** (클라이언트 사이드)

선택 이유:
- React-PDF는 한글 폰트 처리가 불안정
- html2canvas는 화면에 보이는 그대로 캡처 → 폰트 일관성 보장
- jspdf와의 조합이 검증됨

## A4 명세

| 항목 | 스펙 |
|------|------|
| 용지 | A4 (210mm × 297mm) |
| 여백 | 상하좌우 15mm |
| 최대 페이지 | 2장 |
| 방향 | 세로 (portrait) |

## 한글 폰트

| 항목 | 스펙 |
|------|------|
| 서체 | 시스템 기본 (사용자 OS 한글 폰트) |
| 크기 | 본문 10~11pt, 제목 14~16pt |
| 라인높이 | 1.5~1.6 |
| 주의 | html2canvas는 화면 렌더링을 캡처하므로, 브라우저에 표시되는 폰트가 그대로 PDF에 반영됨 |

## 레이아웃

```
┌─────────────────────────────────┐
│  [사진]  이름                    │
│         연락처 | 이메일           │
├─────────────────────────────────┤
│  자기소개                        │
│  ...                            │
├─────────────────────────────────┤
│  학력                            │
│  ...                            │
├─────────────────────────────────┤
│  경력                            │
│  ...                            │
├─────────────────────────────────┤
│  기술 스택                       │
│  ...                            │
├─────────────────────────────────┤
│  프로젝트                        │
│  ...                            │
├─────────────────────────────────┤
│  자격증                          │
│  ...                            │
└─────────────────────────────────┘
```

### 사진 배치

| 항목 | 스펙 |
|------|------|
| 위치 | 기본정보 영역 우측 (또는 좌측) |
| 크기 | 3×4cm |
| 테두리 | 선택 (둥근 모서리 권장) |
| 여백 | 텍스트와 8px 간격 |

## 2장 초과 방지

미리보기 단계에서 A4 높이 초과 시 경고 표시:
```
⚠️ 이력서가 A4 2장을 초과합니다. 내용을 줄이거나 글꼴 크기를 조절해주세요.
```

구현 방법:
1. 미리보기 컨테이너를 A4 비율(210:297)로 고정
2. overflow 감지
3. 초과 시 경고 메시지 + 스크롤

## PDF 생성 코드 개요

```typescript
// src/lib/pdf.ts
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePdf(element: HTMLElement): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,                    // 고해상도
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * contentWidth) / canvas.width;

  // 1페이지
  pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, imgHeight);

  // 2페이지 필요시
  const remaining = imgHeight - (pageHeight - margin * 2);
  if (remaining > 0) {
    pdf.addPage();
    // 두 번째 페이지에 나머지 내용 배치
    pdf.addImage(imgData, 'JPEG', margin, margin - remaining, contentWidth, imgHeight);
  }

  pdf.save('resume.pdf');
}
```

## 새 탭에서 열기

PDF 다운로드 외에 새 탭에서 미리보기도 지원:
```typescript
const pdfBlob = pdf.output('blob');
const url = URL.createObjectURL(pdfBlob);
window.open(url, '_blank');
```
