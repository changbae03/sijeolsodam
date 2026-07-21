'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Logo from './Logo';
import { useAuth } from '@/lib/auth-context';

const PLACEHOLDER_NAME = '카카오 사용자';
const HIDDEN_PATHS = ['/login', '/signup'];

/**
 * 첫 로그인 1회 환영 온보딩.
 * 1단계: 시절소담 소개 + 인사 → 2단계: 프로필 사진·닉네임·한 줄 소개 설정.
 * 완료하거나 건너뛰면 onboarded_at이 찍혀 다시 뜨지 않는다.
 */
export default function WelcomeOnboarding() {
  const { user, loading, refresh } = useAuth();
  const pathname = usePathname();

  const [step, setStep] = useState<1 | 2>(1);
  const [nameDraft, setNameDraft] = useState('');
  const [bioDraft, setBioDraft] = useState('');
  const [nameError, setNameError] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const prefilledFor = useRef<number | null>(null);

  const shouldShow =
    !loading && !!user && !user.onboardedAt && !HIDDEN_PATHS.includes(pathname);

  // 모달이 처음 뜰 때 현재 값으로 초안을 채운다 (유저당 1회)
  useEffect(() => {
    if (!shouldShow || !user) return;
    if (prefilledFor.current === user.id) return;
    prefilledFor.current = user.id;
    setNameDraft(user.name && user.name !== PLACEHOLDER_NAME ? user.name : '');
    setBioDraft(user.bio ?? '');
    setStep(1);
    setNameError('');
  }, [shouldShow, user]);

  if (!shouldShow || !user) return null;

  const handleAvatar = async (file: File | undefined) => {
    if (!file) return;
    setUploadingAvatar(true);
    setNameError('');
    try {
      const form = new FormData();
      form.append('image', file);
      const up = await fetch('/api/community/upload', { method: 'POST', body: form });
      const upData = await up.json();
      if (!up.ok) {
        setNameError(upData.error ?? '사진을 올리지 못했어요.');
        return;
      }
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: upData.url }),
      });
      if (res.ok) await refresh();
    } catch {
      setNameError('사진을 올리지 못했어요.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  /** onboarded만 찍고 닫기 (건너뛰기) */
  const finishSkip = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarded: true }),
      });
      await refresh();
    } catch {
      // 실패해도 다음에 다시 안내되니 조용히 넘어감
    } finally {
      setSubmitting(false);
    }
  };

  /** 닉네임·소개 저장 + onboarded 찍고 닫기 */
  const finishSave = async () => {
    const trimmedName = nameDraft.trim();
    if (trimmedName && (trimmedName.length < 2 || trimmedName.length > 12)) {
      setNameError('닉네임은 2~12자로 지어주세요.');
      return;
    }

    setSubmitting(true);
    setNameError('');
    try {
      const body: Record<string, unknown> = { onboarded: true, bio: bioDraft };
      // 닉네임은 새로 입력했고 기존과 다를 때만 반영
      if (trimmedName && trimmedName !== user.name) body.name = trimmedName;

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // 닉네임 검증/중복 실패 시 onboarded도 안 찍히므로 고쳐서 다시 시도 가능
        setNameError(data.error ?? '저장하지 못했어요. 다시 시도해주세요.');
        return;
      }
      await refresh();
    } catch {
      setNameError('저장하지 못했어요. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-5 py-8">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-cream shadow-xl">
        <div className="max-h-[86vh] overflow-y-auto px-6 py-8 sm:px-8">
          {step === 1 ? (
            <div className="text-center">
              <div className="mb-5 flex justify-center">
                <Logo size="lg" />
              </div>
              <h2 className="mb-3 font-display text-[22px] font-semibold leading-snug text-ink">
                시절소담에 오신 걸
                <br />
                환영해요
              </h2>
              <p className="mx-auto mb-8 max-w-[19rem] text-[14px] leading-relaxed text-ink-soft">
                절기를 따라, 지금 가장 맛있는 제철 식재료로 집밥을 짓는 곳이에요. 고르는 법부터
                손질·보관, 어울리는 레시피까지 소담이가 곁에서 도와드려요. 마음에 든 요리는 저장하고,
                만든 요리는 이웃과 나눠보세요.
              </p>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full rounded-2xl bg-ink py-3.5 text-[15px] font-semibold text-cream transition-opacity hover:opacity-90"
              >
                시작하기
              </button>
              <button
                type="button"
                onClick={finishSkip}
                disabled={submitting}
                className="mt-3 text-[13px] text-ink-soft/60 transition-colors hover:text-ink-soft disabled:opacity-50"
              >
                건너뛰기
              </button>
            </div>
          ) : (
            <div>
              <h2 className="mb-1.5 text-center font-display text-[21px] font-semibold text-ink">
                프로필을 꾸며볼까요?
              </h2>
              <p className="mx-auto mb-6 max-w-[18rem] text-center text-[13.5px] leading-relaxed text-ink-soft">
                이웃에게 나를 소개해요. 나중에 마이페이지에서 언제든 바꿀 수 있어요.
              </p>

              {/* 프로필 사진 */}
              <div className="mb-6 flex flex-col items-center">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatar(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="relative block h-24 w-24 overflow-hidden rounded-full bg-cream-warm"
                  aria-label="프로필 사진 바꾸기"
                >
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt="프로필 사진"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[28px] font-bold text-ink-soft/50">
                      {(nameDraft || user.email).slice(0, 1)}
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-ink/60 py-1 text-[10px] font-medium text-cream">
                    {uploadingAvatar ? '올리는 중' : '바꾸기'}
                  </span>
                </button>
              </div>

              {/* 닉네임 */}
              <label className="mb-1.5 block text-[12.5px] font-medium text-ink-soft">닉네임</label>
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => {
                  setNameDraft(e.target.value);
                  if (nameError) setNameError('');
                }}
                maxLength={12}
                placeholder="2~12자로 지어주세요"
                className="w-full rounded-xl border border-border-soft bg-cream-warm/40 px-4 py-3 text-[14px] text-ink placeholder:text-ink-soft/50 focus:border-ink-soft/40 focus:outline-none"
              />

              {/* 한 줄 소개 */}
              <label className="mb-1.5 mt-4 block text-[12.5px] font-medium text-ink-soft">
                한 줄 소개
              </label>
              <input
                type="text"
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                maxLength={60}
                placeholder="어떤 요리를 좋아하는지 한 줄로"
                className="w-full rounded-xl border border-border-soft bg-cream-warm/40 px-4 py-3 text-[14px] text-ink placeholder:text-ink-soft/50 focus:border-ink-soft/40 focus:outline-none"
              />

              {nameError && <p className="mt-3 text-[13px] text-terracotta">{nameError}</p>}

              <button
                type="button"
                onClick={finishSave}
                disabled={submitting || uploadingAvatar}
                className="mt-6 w-full rounded-2xl bg-ink py-3.5 text-[15px] font-semibold text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? '저장 중...' : '저장하고 시작하기'}
              </button>
              <button
                type="button"
                onClick={finishSkip}
                disabled={submitting}
                className="mt-3 w-full text-center text-[13px] text-ink-soft/60 transition-colors hover:text-ink-soft disabled:opacity-50"
              >
                나중에 할게요
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
