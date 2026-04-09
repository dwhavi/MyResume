import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * HTML 요소를 고화질 PDF로 변환하여 저장합니다.
 * @param elementId 캡처할 DOM 요소의 ID
 * @param fileName 저장할 파일명 (확장자 제외)
 */
export async function exportToPDF(elementId: string, fileName: string = 'resume') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element with id "${elementId}" not found`);

  try {
    // 1. 폰트 로딩 대기 (글자 깨짐 방지)
    await document.fonts.ready;

    // 2. html2canvas로 캡처 (고화질을 위해 scale 2 적용)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      // [FIX v3] 투명화된 가시성 복구: lab, oklch를 무조건 투명하게 만들지 않고 가시 색상으로 폴백
      onclone: (clonedDoc) => {
        // [A] 스타일시트 소독: 텍스트 유실 방지를 위해 표준 검정색(#333)으로 치환
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach(tag => {
          if (tag.textContent) {
            tag.textContent = tag.textContent
              .replace(/lab\([^)]+\)/g, '#333333')
              .replace(/oklch\([^)]+\)/g, '#333333')
              .replace(/oklab\([^)]+\)/g, '#333333')
              .replace(/lch\([^)]+\)/g, '#333333');
          }
        });

        // [B] 루트/바디 변수 소독: 텍스트 유실 방지
        [clonedDoc.documentElement, clonedDoc.body].forEach(el => {
          const styleAttr = el.getAttribute('style');
          if (styleAttr && (styleAttr.includes('lab(') || styleAttr.includes('oklch('))) {
            const sanitized = styleAttr
              .replace(/lab\([^)]+\)/g, '#333333')
              .replace(/oklch\([^)]+\)/g, '#333333');
            el.setAttribute('style', sanitized);
          }
        });

        // [C] 요소별 정밀 소독: 속성 성격에 따른 지능적 폴백
        const allElements = clonedDoc.getElementsByTagName('*');
        const view = clonedDoc.defaultView || window;

        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i] as HTMLElement;
          if (!el.style) continue;

          const computed = view.getComputedStyle(el);
          
          // 텍스트/도형 관련 속성 (가시성 필수)
          const strokeProps = ['color', 'fill', 'stroke'] as const;
          strokeProps.forEach(prop => {
            const val = computed.getPropertyValue(prop);
            if (val && (val.includes('lab(') || val.includes('oklch('))) {
              el.style.setProperty(prop, 'rgb(31, 41, 55)', 'important'); // 짙은 회색
            }
          });

          // 배경 관련 속성
          const bgVal = computed.getPropertyValue('background-color');
          if (bgVal && (bgVal.includes('lab(') || bgVal.includes('oklch('))) {
            // 배경은 투명하게 두거나 흰색으로 처리하여 텍스트를 가리지 않게 함
            el.style.setProperty('background-color', 'rgba(0,0,0,0)', 'important');
          }

          // 테두리 관련 속성
          const borderVal = computed.getPropertyValue('border-color');
          if (borderVal && (borderVal.includes('lab(') || borderVal.includes('oklch('))) {
            el.style.setProperty('border-color', '#dddddd', 'important'); // 연한 회색 테두리
          }

          // 인라인 스타일 최종 정제
          const inline = el.getAttribute('style');
          if (inline && (inline.includes('lab(') || inline.includes('oklch('))) {
            el.setAttribute('style', inline
              .replace(/lab\([^)]+\)/g, '#333333')
              .replace(/oklch\([^)]+\)/g, '#333333')
            );
          }
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // 3. jsPDF 설정 (A4 규격)
    const imgWidth = 210; // mm
    const pageHeight = 297; // mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const doc = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // 4. 페이지 분할 로직
    // 첫 페이지 추가
    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 내용이 남았다면 다음 페이지들 추가
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 5. 다운로드
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error);
    throw error;
  }
}
