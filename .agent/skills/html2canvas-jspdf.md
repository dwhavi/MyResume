# Skill: html2canvas + jspdf PDF 생성

## 기본 패턴

```typescript
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generatePdf(element: HTMLElement, fileName = "resume.pdf") {
  // 1. 캡처 (2x 해상도)
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  // 2. 이미지 데이터 변환
  const imgData = canvas.toDataURL("image/jpeg", 0.95);

  // 3. PDF 생성
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * contentWidth) / canvas.width;

  // 4. 첫 페이지
  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "JPEG", margin, position, contentWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  // 5. 두 번째 페이지 (필요시)
  while (heightLeft > 0) {
    position = margin - (imgHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", margin, position, contentWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  // 6. 저장
  pdf.save(fileName);
}
```

## 새 탭에서 열기

```typescript
const blob = pdf.output("blob");
const url = URL.createObjectURL(blob);
window.open(url, "_blank");
// 메모리 해제: URL.revokeObjectURL(url)
```

## 한글 폰트 함정

html2canvas는 **화면에 렌더링된 그대로 캡처**함. 따라서:
- 브라우저에서 한글이 정상 보이면 PDF에서도 정상
- 시스템 한글 폰트 의존 → 별도 폰트 로딩 불필요
- **주의:** 캡처 시점에 폰트가 로딩 안 끝났으면 깨짐 → `document.fonts.ready` 대기

```typescript
await document.fonts.ready;
const canvas = await html2canvas(element, { ... });
```

## A4 분할 함정

- `addImage`는 캔버스 전체를 매 페이지에 그림 → `position` 오프셋으로 보이는 영역 제어
- `heightLeft` 계산이 핵심 → 오프셋 1px 오차로 줄 무늬/빈칸 발생 가능
- 2장 초과 시 사용자에게 경고 표시 필수

## 2장 초과 감지

```typescript
const a4HeightPx = (297 - 30) * (canvas.width / (210 - 30)); // margin 15mm 양쪽
const contentHeightPx = canvas.height;
const isOverTwoPages = contentHeightPx > a4HeightPx * 2;
```

## 성능 팁

- `scale: 2`가 최적 (3 이상은 파일 크기만 커지고 체감 품질 차이 없음)
- JPEG quality 0.95가 최적 (1.0은 용량만 큼)
- 대용량 DOM은 캡처 전에 `width` 고정 필요 (화면 밖 요소 제외)
