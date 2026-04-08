'use client';

// PhotoCrop — react-easy-crop 기반 3:4 비율 사진 크롭 컴포넌트
// GR-10: 한글 폰트뿐만 아니라 이미지 처리 시에도 캔버스 유틸 활용

import React, { useState, useCallback } from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';

interface PhotoCropProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export default function PhotoCrop({ imageSrc, onCropComplete, onCancel }: PhotoCropProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => setCrop(crop);
  const onZoomChange = (zoom: number) => setZoom(zoom);

  const onCropCompleteInternal = useCallback((_unp: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // 한국 이력서 표준 사진 규격 (3:4) - 출력 퀄리티를 위해 2배수 잡음
      canvas.width = 300 * 2;
      canvas.height = 400 * 2;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Base64로 변환 (용량 최적화를 위해 jpeg 0.8 설정)
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      onCropComplete(base64Image);
    } catch (e) {
      console.error('이미지 크롭 실패:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col">
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={3 / 4}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
        />
      </div>
      
      <div className="bg-white p-6 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">확대/축소</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-gray-600 font-medium bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 text-white font-bold bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
