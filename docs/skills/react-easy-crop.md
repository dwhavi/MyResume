# Skill: react-easy-crop 사진 처리

## 설치

```bash
npm install react-easy-crop
```

## 기본 패턴: 업로드 + 크롭 + Base64 변환

```typescript
"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";

export function PhotoUpload() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedBase64, setCroppedBase64] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  // 1. 파일 선택
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5MB 제한
    if (file.size > 5 * 1024 * 1024) {
      alert("5MB 이하의 이미지를 업로드해주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  // 2. 크롭 영역 결정
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  // 3. 크롭 실행 → Base64
  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
    setCroppedBase64(cropped);
    setShowCropper(false);
  };

  return (
    <div>
      {!croppedBase64 ? (
        <>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={onFileChange}
            // 모바일 카메라 지원
            capture="environment"
          />
        </>
      ) : (
        <div>
          <img src={croppedBase64} alt="프로필 사진" />
          <button onClick={() => { setCroppedBase64(null); setImageSrc(null); }}>
            다시 선택
          </button>
        </div>
      )}

      {showCropper && (
        <div className="fixed inset-0 z-50 bg-black/70">
          <Cropper
            image={imageSrc!}
            crop={crop}
            zoom={zoom}
            aspect={3 / 4} // 3:4 세로 비율
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <div className="absolute bottom-4 flex gap-2">
            <button onClick={() => setShowCropper(false)}>취소</button>
            <button onClick={handleCropConfirm}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 크롭 유틸 함수

```typescript
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<string> {
  const image = new Image();
  image.src = imageSrc;
  await image.decode();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // 최대 500KB로 압축
  const maxSize = 500 * 1024;
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // 품질 조절하여 500KB 이하로 압축
  let quality = 0.92;
  let base64 = canvas.toDataURL("image/jpeg", quality);

  while (base64.length * 0.75 > maxSize && quality > 0.1) {
    quality -= 0.05;
    base64 = canvas.toDataURL("image/jpeg", quality);
  }

  return base64;
}
```

## 모바일 주의사항

- `capture="environment"` → 후면 카메라 (인물 사진용)
- `capture="user"` → 전면 카메라
- `accept="image/*"`만 하면 갤러리에서만 선택 가능
- iOS Safari에서는 캡처 속성이 동작 방식이 다름 → 둘 다 지원하는 UI 제공

## 사진 스펙

| 항목 | 값 |
|------|-----|
| 비율 | 3:4 (세로) |
| 권장 해상도 | 300×400px 이상 |
| 최대 업로드 | 5MB |
| 압축 후 | 최대 500KB |
| 형식 | JPEG |
| PDF 크기 | 3×4cm |
