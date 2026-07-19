'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 사진 선택 + 소담 필터.
 *
 * 인스타그램처럼 "찍고 바로 올리는" 흐름을 목표로 한다:
 *  - 카메라 바로 열기(capture) / 앨범에서 고르기를 나란히 제공
 *  - 고르면 즉시 미리보기와 필터가 뜨고, 확정하면 캔버스에서 한 번에 처리
 *
 * 필터는 모두 클라이언트 캔버스에서 처리해 서버 비용이 없고,
 * 처리하면서 긴 변 1600px + WebP로 압축해 업로드도 빨라진다(원본 4MB -> 300KB 수준).
 */

export interface SodamFilter {
  id: string;
  label: string;
  hint: string;
  /** canvas ctx.filter 문자열 */
  css: string;
  /** 따뜻한 색 오버레이 (없으면 생략) */
  warmOverlay?: { color: string; alpha: number };
  /** 가장자리 어둡게 (비네트) 강도 0~1 */
  vignette?: number;
}

/**
 * 음식 사진에 실제로 효과가 있는 조정만 담았다.
 * 핵심은 채도를 과하게 올리지 않고(음식이 인공적으로 보임)
 * 대비와 따뜻함으로 "갓 만든 느낌"을 살리는 것.
 */
export const SODAM_FILTERS: SodamFilter[] = [
  { id: 'original', label: '원본', hint: '보정 없이', css: 'none' },
  {
    id: 'sodam',
    label: '소담',
    hint: '기본 보정',
    css: 'contrast(1.08) saturate(1.12) brightness(1.03)',
    warmOverlay: { color: '#FFB65C', alpha: 0.06 },
    vignette: 0.18,
  },
  {
    id: 'warm',
    label: '따뜻하게',
    hint: '집밥·국물 요리',
    css: 'contrast(1.06) saturate(1.08) brightness(1.05)',
    warmOverlay: { color: '#FF9E3D', alpha: 0.12 },
    vignette: 0.22,
  },
  {
    id: 'fresh',
    label: '싱그럽게',
    hint: '샐러드·제철 채소',
    css: 'contrast(1.05) saturate(1.18) brightness(1.06)',
    warmOverlay: { color: '#BFE08A', alpha: 0.05 },
    vignette: 0.1,
  },
  {
    id: 'crisp',
    label: '선명하게',
    hint: '구이·튀김의 질감',
    css: 'contrast(1.18) saturate(1.05) brightness(1.01)',
    vignette: 0.24,
  },
  {
    id: 'film',
    label: '필름',
    hint: '차분한 잡지 톤',
    css: 'contrast(1.04) saturate(0.9) brightness(1.04) sepia(0.12)',
    warmOverlay: { color: '#E8C39E', alpha: 0.1 },
    vignette: 0.26,
  },
];

const MAX_EDGE = 1600;

/** 원본 파일 + 필터 -> 업로드용 WebP File */
async function renderToFile(
  image: HTMLImageElement,
  filter: SodamFilter,
  fileName: string
): Promise<File> {
  const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
  const w = Math.round(image.naturalWidth * scale);
  const h = Math.round(image.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.filter = filter.css === 'none' ? 'none' : filter.css;
  ctx.drawImage(image, 0, 0, w, h);
  ctx.filter = 'none';

  if (filter.warmOverlay) {
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = filter.warmOverlay.alpha;
    ctx.fillStyle = filter.warmOverlay.color;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  if (filter.vignette) {
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${filter.vignette})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', 0.86)
  );
  if (!blob) throw new Error('이미지 처리에 실패했어요.');
  return new File([blob], fileName.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
}

export default function PhotoPicker({
  onReady,
  disabled,
}: {
  /** 필터까지 적용된 최종 파일 */
  onReady: (file: File | null) => void;
  disabled?: boolean;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const albumRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('photo.jpg');
  const [filterId, setFilterId] = useState('sodam'); // 기본값을 보정으로 — 대부분 원본보다 낫다
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSelect = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFileName(file.name || 'photo.jpg');
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      void applyFilter(filterId, img);
    };
    img.src = url;
  };

  const applyFilter = async (id: string, image?: HTMLImageElement) => {
    const target = image ?? imgRef.current;
    if (!target) return;
    const filter = SODAM_FILTERS.find((f) => f.id === id) ?? SODAM_FILTERS[0];
    setProcessing(true);
    try {
      const file = await renderToFile(target, filter, fileName);
      onReady(file);
    } catch {
      onReady(null);
    } finally {
      setProcessing(false);
    }
  };

  const selected = SODAM_FILTERS.find((f) => f.id === filterId) ?? SODAM_FILTERS[0];

  return (
    <div>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleSelect(e.target.files?.[0])}
      />
      <input
        ref={albumRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleSelect(e.target.files?.[0])}
      />

      {!previewUrl ? (
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            disabled={disabled}
            className="flex h-[104px] flex-col items-center justify-center gap-2 rounded-2xl bg-ink text-cream"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.9l1.2-2h6.8l1.2 2h1.9A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5Z" />
              <circle cx="12" cy="13" r="3.6" />
            </svg>
            <span className="text-[14px] font-semibold">사진 찍기</span>
          </button>
          <button
            type="button"
            onClick={() => albumRef.current?.click()}
            disabled={disabled}
            className="flex h-[104px] flex-col items-center justify-center gap-2 rounded-2xl border border-border-soft bg-paper text-ink"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2.5" />
              <path d="M3 15.5l4.5-4.5 4 4 3-3 6 6" />
              <circle cx="8.5" cy="8.5" r="1.4" />
            </svg>
            <span className="text-[14px] font-semibold">앨범에서 고르기</span>
          </button>
        </div>
      ) : (
        <div>
          <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-cream-warm">
            {/* 미리보기는 CSS 필터로 즉시 반영하고, 업로드용 파일은 캔버스로 따로 만든다 */}
            {/* eslint-disable-next-line @next/next/no-img-element -- blob URL 미리보기 */}
            <img
              src={previewUrl}
              alt="선택한 사진 미리보기"
              className="h-full w-full object-cover"
              style={{ filter: selected.css === 'none' ? undefined : selected.css }}
            />
            {selected.warmOverlay && (
              <div
                className="pointer-events-none absolute inset-0 mix-blend-overlay"
                style={{ background: selected.warmOverlay.color, opacity: selected.warmOverlay.alpha }}
              />
            )}
            {selected.vignette ? (
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${selected.vignette}) 100%)`,
                }}
              />
            ) : null}
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                imgRef.current = null;
                onReady(null);
              }}
              className="absolute right-2.5 top-2.5 rounded-full bg-ink/70 px-3 py-1.5 text-[12.5px] font-medium text-cream backdrop-blur-sm"
            >
              다시 고르기
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[12.5px] font-semibold text-ink">소담 필터</p>
              <p className="text-[11.5px] text-ink-soft/70">
                {processing ? '적용 중...' : selected.hint}
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {SODAM_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setFilterId(f.id);
                    void applyFilter(f.id);
                  }}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
                    f.id === filterId
                      ? 'bg-ink text-cream'
                      : 'border border-border-soft bg-paper text-ink-soft'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
