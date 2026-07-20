'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { listRecentPhotos, saveRecentPhoto } from '@/lib/recent-photos';

/**
 * 사진 고르기 — 인앱 카메라 + 소담 필터.
 *
 * 웹앱은 브라우저 보안상 갤러리 목록을 직접 읽을 수 없어(파일 선택창을 거쳐야 함),
 * "최근 사진 목록"을 그리는 대신 단계를 줄이는 쪽으로 풀었다:
 *  - 시트를 열면 인앱 카메라가 바로 켜지고, 찍기 전부터 필터가 실시간으로 보인다
 *    (OS 카메라 앱으로 나갔다 돌아오는 왕복이 없어 인스타그램보다 단계가 적다)
 *  - 앨범은 여러 장을 한 번에 고를 수 있고, 고른 사진들은 하단 스트립에서 바로 전환
 *  - 필터 칩은 실제 내 사진 썸네일로 보여줘 결과를 보고 고른다
 * 카메라 권한이 없거나 지원하지 않는 환경에서는 자동으로 파일 선택으로 넘어간다.
 */

export interface SodamFilter {
  id: string;
  label: string;
  hint: string;
  /** canvas ctx.filter / CSS filter 공용 문자열 */
  css: string;
  warmOverlay?: { color: string; alpha: number };
  vignette?: number;
}

/**
 * 음식 사진 기준으로 조정한 프리셋.
 * 채도를 과하게 올리면 음식이 인공적으로 보이므로, 대비·따뜻함·비네트로
 * "갓 만든 느낌"을 만드는 방향.
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

/** 사진 편집 상태 — 비율·확대·이동·회전 */
export interface EditState {
  /** 결과물 가로/세로 비 */
  aspect: number;
  /** 1 이상, 확대 배율 */
  zoom: number;
  /** 미리보기 컨테이너 기준 픽셀 이동량 */
  offsetX: number;
  offsetY: number;
  /** 0 / 90 / 180 / 270 */
  rotation: number;
}

export const ASPECT_OPTIONS: { id: string; label: string; value: number }[] = [
  { id: 'square', label: '1:1', value: 1 },
  { id: 'portrait', label: '4:5', value: 4 / 5 },
  { id: 'landscape', label: '3:2', value: 3 / 2 },
];

export const DEFAULT_EDIT: EditState = { aspect: 1, zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 };

/**
 * 회전을 감안해 컨테이너를 꽉 채우는 기본 배율.
 * 미리보기와 결과물이 같은 식을 쓰기 때문에 화면에서 본 그대로 저장된다.
 */
function coverScale(iw: number, ih: number, cw: number, ch: number, rotation: number): number {
  const swapped = rotation % 180 !== 0;
  const w = swapped ? ih : iw;
  const h = swapped ? iw : ih;
  return Math.max(cw / w, ch / h);
}

/** 촬영 가이드 — 필터로는 못 고치는, 찍는 순간에만 잡을 수 있는 것들 */
const SHOOTING_TIPS: { title: string; body: string }[] = [
  { title: '창가로, 조명은 끄고', body: '형광등 아래선 누렇게 나와요.' },
  { title: '빛은 옆이나 뒤에서', body: '정면광은 납작해져요. 옆·뒤에서 와야 입체감이 살아요.' },
  { title: '국물은 45도, 펼친 접시는 위에서', body: '요리 높이에 따라 각도를 바꿔요.' },
  { title: '한 걸음 더 가까이', body: '가장자리가 잘려도 괜찮아요. 질감이 보이게.' },
  { title: '주인공만 남기기', body: '리모컨·휴지는 프레임 밖으로.' },
  { title: '김이 오를 때 바로', body: '윤기와 김은 1~2분이면 사라져요.' },
];

/** 필터 CSS + 오버레이를 하나의 미리보기 레이어로 (프리뷰/썸네일 공용) */
function FilterOverlays({ filter }: { filter: SodamFilter }) {
  return (
    <>
      {filter.warmOverlay && (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{ background: filter.warmOverlay.color, opacity: filter.warmOverlay.alpha }}
        />
      )}
      {filter.vignette ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${filter.vignette}) 100%)`,
          }}
        />
      ) : null}
    </>
  );
}

/** 원본 이미지 + 필터 -> 업로드용 WebP File (긴 변 1600px, q86) */
async function renderToFile(
  source: HTMLImageElement | HTMLCanvasElement,
  filter: SodamFilter,
  fileName: string,
  edit: EditState = DEFAULT_EDIT,
  /** 미리보기 컨테이너 폭(px) — 이동량을 결과물 좌표로 환산하는 기준 */
  previewWidth?: number
): Promise<File> {
  const iw = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  const ih = source instanceof HTMLImageElement ? source.naturalHeight : source.height;

  // 결과물 크기: 긴 변을 MAX_EDGE로 맞추되 선택한 비율을 따른다
  const outW = edit.aspect >= 1 ? MAX_EDGE : Math.round(MAX_EDGE * edit.aspect);
  const outH = edit.aspect >= 1 ? Math.round(MAX_EDGE / edit.aspect) : MAX_EDGE;

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, outW, outH);

  // 미리보기와 동일한 변환을 결과물 좌표계로 확대해 적용
  const ratio = previewWidth ? outW / previewWidth : 1;
  const scale = coverScale(iw, ih, outW, outH, edit.rotation) * edit.zoom;

  ctx.save();
  ctx.filter = filter.css === 'none' ? 'none' : filter.css;
  ctx.translate(outW / 2 + edit.offsetX * ratio, outH / 2 + edit.offsetY * ratio);
  ctx.rotate((edit.rotation * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.drawImage(source, -iw / 2, -ih / 2, iw, ih);
  ctx.restore();

  if (filter.warmOverlay) {
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = filter.warmOverlay.alpha;
    ctx.fillStyle = filter.warmOverlay.color;
    ctx.fillRect(0, 0, outW, outH);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  if (filter.vignette) {
    const g = ctx.createRadialGradient(
      outW / 2,
      outH / 2,
      Math.min(outW, outH) * 0.35,
      outW / 2,
      outH / 2,
      Math.max(outW, outH) * 0.75
    );
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${filter.vignette})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, outW, outH);
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.86));
  if (!blob) throw new Error('이미지 처리에 실패했어요.');
  return new File([blob], fileName.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
}

export default function PhotoPicker({
  onReady,
  disabled,
}: {
  /** 필터까지 적용된 최종 파일들 (동영상은 원본 그대로) */
  onReady: (files: File[], mediaType: 'image' | 'video') => void;
  disabled?: boolean;
}) {
  const albumRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // 고른 사진들(여러 장 선택 가능) — 하단 스트립에서 전환
  const [shots, setShots] = useState<{ url: string; name: string; file?: File; isVideo?: boolean }[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [filterId, setFilterId] = useState('sodam');
  const [processing, setProcessing] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [facing, setFacing] = useState<'environment' | 'user'>('environment');
  const [showTips, setShowTips] = useState(false);
  const [edit, setEdit] = useState<EditState>(DEFAULT_EDIT);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  // 미리보기 폭 — 변환식과 결과물 좌표 환산에 쓰인다 (렌더 중 ref를 읽지 않도록 상태로 보관)
  const [boxWidth, setBoxWidth] = useState(0);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setBoxWidth((prev) => (Math.abs(prev - w) > 0.5 ? w : prev));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // 이 앱에서 최근에 쓴 사진 (기기 안에만 저장 — 폰 앨범은 브라우저가 읽을 수 없다)
  const [recent, setRecent] = useState<{ url: string; name: string }[]>([]);

  const selected = SODAM_FILTERS.find((f) => f.id === filterId) ?? SODAM_FILTERS[0];
  const active = shots[activeIdx] ?? null;

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1920 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      setCameraError(false);
    } catch {
      // 권한 거부·미지원 — 앨범 선택으로 유도
      setCameraError(true);
      setCameraOn(false);
    }
  }, [facing]);

  // 시트를 열면 바로 카메라를 켠다 (사진을 이미 고른 뒤에는 켜지 않음).
  // startCamera 내부의 상태 변경은 비동기 완료 후 일어나므로 이펙트 동기 구간에서 setState 하지 않는다.
  useEffect(() => {
    let cancelled = false;
    if (shots.length === 0 && !cameraError) {
      void (async () => {
        if (!cancelled) await startCamera();
      })();
    }
    return () => {
      cancelled = true;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- facing 변경 시에만 재시작
  }, [facing]);

  useEffect(() => {
    let alive = true;
    void listRecentPhotos().then((items) => {
      if (!alive) return;
      setRecent(
        items.map((it) => ({ url: URL.createObjectURL(it.blob), name: `recent-${it.id}.webp` }))
      );
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    return () => shots.forEach((s) => URL.revokeObjectURL(s.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 언마운트 정리
  }, []);

  /** 현재 활성 사진 + 필터로 업로드 파일 만들기 */
  const emit = useCallback(
    async (list: { url: string; name: string; file?: File; isVideo?: boolean }[], id: string, editState: EditState = edit) => {
      if (list.length === 0) {
        onReady([], 'image');
        return;
      }
      // 동영상은 필터를 적용하지 않고 원본을 그대로 올린다 (프레임 단위 처리는 과함)
      if (list[0].isVideo) {
        onReady(list[0].file ? [list[0].file] : [], 'video');
        return;
      }
      const filter = SODAM_FILTERS.find((f) => f.id === id) ?? SODAM_FILTERS[0];
      setProcessing(true);
      try {
        const files: File[] = [];
        for (const [i, item] of list.entries()) {
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = reject;
            el.src = item.url;
          });
          if (i === activeIdx) imgRef.current = img;
          files.push(await renderToFile(img, filter, item.name, editState, boxWidth || undefined));
        }
        onReady(files, 'image');
      } catch {
        onReady([], 'image');
      } finally {
        setProcessing(false);
      }
    },
    [onReady, activeIdx, edit, boxWidth]
  );

  /** 인앱 카메라로 촬영 — 정사각으로 잘라 담는다 */
  const shoot = async () => {
    const video = videoRef.current;
    if (!video) return;
    const size = Math.min(video.videoWidth, video.videoHeight);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(
      video,
      (video.videoWidth - size) / 2,
      (video.videoHeight - size) / 2,
      size,
      size,
      0,
      0,
      size,
      size
    );
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.95));
    if (!blob) return;
    void saveRecentPhoto(blob);
    const url = URL.createObjectURL(blob);
    stopCamera();
    const next = [{ url, name: `shot-${Date.now()}.webp` }, ...shots];
    setShots(next);
    setActiveIdx(0);
    setEdit(DEFAULT_EDIT);
    void emit(next, filterId);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const picked = Array.from(files)
      .slice(0, 10)
      .map((f) => ({
        url: URL.createObjectURL(f),
        name: f.name || 'photo.jpg',
        file: f,
        isVideo: f.type.startsWith('video/'),
      }));
    stopCamera();
    // 사진만 최근 보관함에 남긴다 (동영상은 용량이 커서 제외)
    Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 10)
      .forEach((f) => void saveRecentPhoto(f));
    setShots(picked);
    setActiveIdx(0);
    setEdit(DEFAULT_EDIT);
    void emit(picked, filterId);
  };

  const reset = () => {
    shots.forEach((s) => URL.revokeObjectURL(s.url));
    setShots([]);
    onReady([], 'image');
    setCameraError(false);
    void startCamera();
  };

  const shareCurrent = async () => {
    if (!imgRef.current) return;
    setProcessing(true);
    try {
      const file = await renderToFile(imgRef.current, selected, active?.name ?? 'photo.webp', edit, boxWidth || undefined);
      const nav = navigator as Navigator & { canShare?: (d?: { files?: File[] }) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: '#시절소담' });
      } else {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // 취소 등 — 무시
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <input
        ref={albumRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* 촬영/미리보기 영역 — 어둡게 깔아 사진에 시선이 가게 */}
      <div
        ref={boxRef}
        className="relative w-full overflow-hidden rounded-[22px] bg-ink"
        style={{ aspectRatio: active && !active.isVideo ? String(edit.aspect) : '1' }}
      >
        {active ? (
          <>
            {active.isVideo ? (
              <video src={active.url} className="h-full w-full object-cover" controls playsInline />
            ) : (
              <>
                {/* 드래그로 위치를 옮긴다 — 미리보기와 결과물이 같은 변환식을 쓴다 */}
                <div
                  className="absolute inset-0 touch-none"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    dragRef.current = { x: e.clientX, y: e.clientY, ox: edit.offsetX, oy: edit.offsetY };
                  }}
                  onPointerMove={(e) => {
                    const d = dragRef.current;
                    if (!d) return;
                    setEdit((prev) => ({
                      ...prev,
                      offsetX: d.ox + (e.clientX - d.x),
                      offsetY: d.oy + (e.clientY - d.y),
                    }));
                  }}
                  onPointerUp={() => {
                    dragRef.current = null;
                    if (shots.length) void emit(shots, filterId);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- blob URL 미리보기 */}
                  <img
                    src={active.url}
                    alt="선택한 사진"
                    onLoad={(e) =>
                      setNatural({
                        w: e.currentTarget.naturalWidth,
                        h: e.currentTarget.naturalHeight,
                      })
                    }
                    draggable={false}
                    className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
                    style={{
                      width: natural.w || undefined,
                      height: natural.h || undefined,
                      filter: selected.css === 'none' ? undefined : selected.css,
                      transform: `translate(-50%, -50%) translate(${edit.offsetX}px, ${edit.offsetY}px) rotate(${edit.rotation}deg) scale(${
                        (boxWidth && natural.w
                          ? coverScale(
                              natural.w,
                              natural.h,
                              boxWidth,
                              boxWidth / edit.aspect,
                              edit.rotation
                            )
                          : 1) * edit.zoom
                      })`,
                    }}
                  />
                </div>
                <FilterOverlays filter={selected} />
              </>
            )}
            <button
              type="button"
              onClick={reset}
              className="absolute right-3 top-3 rounded-full bg-black/45 px-3 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-md"
            >
              다시 찍기
            </button>
          </>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full object-cover"
              style={{
                filter: selected.css === 'none' ? undefined : selected.css,
                transform: facing === 'user' ? 'scaleX(-1)' : undefined,
              }}
            />
            <FilterOverlays filter={selected} />

            {/* 3분할 구도 격자 */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/3 top-0 h-full w-px bg-white/25" />
              <div className="absolute left-2/3 top-0 h-full w-px bg-white/25" />
              <div className="absolute left-0 top-1/3 h-px w-full bg-white/25" />
              <div className="absolute left-0 top-2/3 h-px w-full bg-white/25" />
            </div>

            {!cameraOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
                <p className="text-[13.5px] text-white/80 leading-relaxed">
                  {cameraError
                    ? '카메라를 쓸 수 없어요.\n앨범에서 사진을 골라주세요.'
                    : '카메라를 준비하고 있어요...'}
                </p>
                {cameraError && (
                  <button
                    type="button"
                    onClick={() => albumRef.current?.click()}
                    className="rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-ink"
                  >
                    앨범 열기
                  </button>
                )}
              </div>
            )}

            {/* 하단 컨트롤: 앨범 · 셔터 · 전환 */}
            {cameraOn && (
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 pb-5">
                <button
                  type="button"
                  onClick={() => albumRef.current?.click()}
                  aria-label="앨범에서 고르기"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-md"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2.5" />
                    <path d="M3 15.5l4.5-4.5 4 4 3-3 6 6" />
                    <circle cx="8.5" cy="8.5" r="1.4" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={shoot}
                  disabled={disabled}
                  aria-label="사진 찍기"
                  className="flex h-[70px] w-[70px] items-center justify-center rounded-full border-[3px] border-white/90 active:scale-95 transition-transform"
                >
                  <span className="h-[56px] w-[56px] rounded-full bg-white" />
                </button>

                <button
                  type="button"
                  onClick={() => setFacing((f) => (f === 'environment' ? 'user' : 'environment'))}
                  aria-label="카메라 전환"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-md"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 14.5-7M21 12a9 9 0 0 1-14.5 7" />
                    <path d="M17 2v5h-5M7 22v-5h5" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 최근 사진 — 앨범을 열지 않고 바로 고르기 */}
      {shots.length === 0 && recent.length > 0 && (
        <div className="mt-2.5">
          <p className="mb-1.5 text-[11.5px] text-ink-soft/70">최근 사진</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {recent.map((r) => (
              <button
                key={r.url}
                type="button"
                onClick={() => {
                  stopCamera();
                  const picked = [{ url: r.url, name: r.name }];
                  setShots(picked);
                  setActiveIdx(0);
                  void emit(picked, filterId);
                }}
                className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-warm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- blob URL 썸네일 */}
                <img src={r.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 고른 사진 스트립 — 여러 장 골랐을 때 바로 전환 */}
      {shots.length > 1 && (
        <div className="mt-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
          {shots.map((s, i) => (
            <button
              key={s.url}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl transition-all ${
                i === activeIdx ? 'ring-2 ring-ink ring-offset-2 ring-offset-cream' : 'opacity-60'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- blob URL 썸네일 */}
              <img src={s.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* 편집 — 비율·확대·회전. 잘라낼 영역을 눈으로 보며 맞춘다 */}
      {active && !active.isVideo && (
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] font-semibold text-ink">사진 편집</p>
            <button
              type="button"
              onClick={() => {
                setEdit(DEFAULT_EDIT);
                if (shots.length) void emit(shots, filterId, DEFAULT_EDIT);
              }}
              className="text-[11.5px] text-ink-soft/70"
            >
              초기화
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            {ASPECT_OPTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  const next = { ...edit, aspect: a.value, offsetX: 0, offsetY: 0 };
                  setEdit(next);
                  if (shots.length) void emit(shots, filterId, next);
                }}
                className={`rounded-xl px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                  Math.abs(edit.aspect - a.value) < 0.01
                    ? 'bg-ink text-cream'
                    : 'border border-border-soft bg-paper text-ink-soft'
                }`}
              >
                {a.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                const next = { ...edit, rotation: (edit.rotation + 90) % 360, offsetX: 0, offsetY: 0 };
                setEdit(next);
                if (shots.length) void emit(shots, filterId, next);
              }}
              aria-label="90도 회전"
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-xl border border-border-soft bg-paper text-ink-soft"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 1 3 6.7" />
                <path d="M3 20v-5h5" />
              </svg>
            </button>
          </div>

          <div className="mt-2.5 flex items-center gap-3">
            <span className="text-[11.5px] text-ink-soft/70">확대</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={edit.zoom}
              onChange={(e) => setEdit((prev) => ({ ...prev, zoom: Number(e.target.value) }))}
              onPointerUp={() => shots.length && void emit(shots, filterId)}
              onTouchEnd={() => shots.length && void emit(shots, filterId)}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-border-soft accent-ink"
            />
            <span className="w-8 text-right text-[11.5px] tabular-nums text-ink-soft/70">
              {edit.zoom.toFixed(1)}x
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-ink-soft/55">사진을 끌어서 위치를 맞출 수 있어요</p>
        </div>
      )}

      {/* 필터 — 내 사진 썸네일로 결과를 보고 고른다 */}
      <div className="mt-3.5">
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-[12.5px] font-semibold text-ink">소담 필터</p>
          <p className="text-[11.5px] text-ink-soft/70">{processing ? '적용 중...' : selected.hint}</p>
        </div>
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
          {SODAM_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFilterId(f.id);
                if (shots.length) void emit(shots, f.id);
              }}
              className="shrink-0 text-center"
            >
              <span
                className={`relative block h-16 w-16 overflow-hidden rounded-2xl bg-cream-warm transition-all ${
                  f.id === filterId ? 'ring-2 ring-ink ring-offset-2 ring-offset-cream' : ''
                }`}
              >
                {active ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob URL 썸네일 */}
                    <img
                      src={active.url}
                      alt=""
                      className="h-full w-full object-cover"
                      style={{ filter: f.css === 'none' ? undefined : f.css }}
                    />
                    <FilterOverlays filter={f} />
                  </>
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[11px] text-ink-soft/50">
                    {f.label}
                  </span>
                )}
              </span>
              <span
                className={`mt-1.5 block text-[11.5px] ${
                  f.id === filterId ? 'font-semibold text-ink' : 'text-ink-soft'
                }`}
              >
                {f.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 보조 액션 */}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setShowTips((v) => !v)}
          className="flex-1 rounded-xl border border-border-soft bg-paper py-2.5 text-[12.5px] font-medium text-ink-soft"
        >
          맛있게 찍는 법 {showTips ? '접기' : '보기'}
        </button>
        {active && (
          <button
            type="button"
            onClick={shareCurrent}
            disabled={processing}
            className="flex-1 rounded-xl border border-border-soft bg-paper py-2.5 text-[12.5px] font-medium text-ink-soft"
          >
            저장·공유하기
          </button>
        )}
      </div>

      {showTips && (
        <ul className="mt-2.5 space-y-2 rounded-2xl border border-border-soft bg-paper px-4 py-3.5">
          {SHOOTING_TIPS.map((t) => (
            <li key={t.title} className="flex gap-2">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-sage" />
              <p className="text-[12.5px] leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">{t.title}</span> — {t.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
