'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';
import { getRecipesByIds } from '@/data/recipes';
import { findIngredientByName } from '@/data/months';
import RecipeCard from '@/components/RecipeCard';

interface ViewSummary {
  recipeIds: string[];
  totalViewed: number;
  topIngredients: string[];
}

export default function MyPage() {
  const { user, loading, logout, refresh } = useAuth();
  const { favoriteIds } = useFavorites();
  const [views, setViews] = useState<ViewSummary | null>(null);
  const [cookedIds, setCookedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [nameError, setNameError] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [follow, setFollow] = useState({ followers: 0, following: 0 });
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  /** 프로필 사진 업로드 후 프로필에 연결 */
  const handleAvatar = async (file: File | undefined) => {
    if (!file) return;
    setUploadingAvatar(true);
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

  const saveBio = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: bioDraft }),
      });
      if (res.ok) {
        await refresh();
        setEditingBio(false);
      }
    } catch {
      // 무시 — 다시 시도하면 됨
    }
  };

  useEffect(() => {
    if (!user) return;
    fetch('/api/cooked?mine=1')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => d?.recipeIds && setCookedIds(d.recipeIds))
      .catch(() => {});
    fetch(`/api/follow?userId=${user.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setFollow({ followers: data.followers, following: data.following }))
      .catch(() => {});
  }, [user]);

  const saveName = async () => {
    setSavingName(true);
    setNameError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameDraft }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNameError(data.error ?? '닉네임을 바꾸지 못했어요.');
        return;
      }
      await refresh();
      setEditingName(false);
    } catch {
      setNameError('닉네임을 바꾸지 못했어요.');
    } finally {
      setSavingName(false);
    }
  };

  const handleDeleteAccount = async () => {
    // 파괴적 동작이라 두 번 확인
    if (!window.confirm('정말 탈퇴하시겠어요?\n즐겨찾기, 조회 기록, 게시물이 모두 삭제됩니다.')) return;
    if (!window.confirm('삭제된 데이터는 되돌릴 수 없어요. 탈퇴를 진행할까요?')) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/account', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error ?? '탈퇴 처리 중 문제가 발생했어요.');
        setDeleting(false);
        return;
      }
      // 쿠키는 서버가 지웠고, 클라이언트 상태 정리 겸 홈으로
      await logout();
      window.location.href = '/';
    } catch {
      alert('탈퇴 처리 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.');
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch('/api/recipe-views')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.recipeIds) setViews(data);
      })
      .catch(() => {
        // 조회 요약은 부가 정보라 실패해도 페이지는 정상 동작
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <main className="max-w-md mx-auto px-5 pt-16 text-center">
        <p className="text-[14px] text-ink-soft">불러오는 중...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-6 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-[19px] font-bold tracking-[-0.01em] text-ink mb-2">
            로그인하고 즐겨찾기를 모아보세요
          </p>
          <p className="text-[14px] text-ink-soft mb-6">
            마음에 드는 레시피를 저장해두면 언제든 다시 찾아볼 수 있어요.
          </p>
          <motion.div whileTap={{ scale: 0.96 }} className="inline-block">
            <Link
              href="/login"
              className="inline-block bg-ink text-cream rounded-2xl px-8 py-3.5 text-[15px] font-semibold"
            >
              로그인하기
            </Link>
          </motion.div>
        </motion.div>
      </main>
    );
  }

  const favoriteRecipes = getRecipesByIds(Array.from(favoriteIds));
  const recentRecipes = views ? getRecipesByIds(views.recipeIds).slice(0, 10) : [];
  const cookedRecipes = getRecipesByIds(cookedIds);
  // 데이터에 실제 존재하는 재료만 칩으로 (조회 기록의 main_ingredient가 개편 전 이름일 수 있음)
  const topIngredients = (views?.topIngredients ?? []).filter((n) => findIngredientByName(n));

  return (
    <main className="max-w-md mx-auto px-5 pt-6 pb-12">
      {/* ============================================
          1. 헤더
         ============================================ */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-3">마이페이지</p>

        {/* 프로필 사진 */}
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
          className="relative mb-3 block h-20 w-20 overflow-hidden rounded-full bg-cream-warm"
          aria-label="프로필 사진 바꾸기"
        >
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt="프로필 사진" fill sizes="80px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[24px] font-bold text-ink-soft/60">
              {(user.name ?? user.email).slice(0, 1)}
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 bg-ink/60 py-1 text-[10px] font-medium text-cream">
            {uploadingAvatar ? '올리는 중' : '바꾸기'}
          </span>
        </button>
        {editingName ? (
          <div className="flex items-center gap-2">
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              maxLength={12}
              autoFocus
              className="min-w-0 flex-1 rounded-xl border border-border-soft bg-paper px-3 py-2 text-[16px] text-ink outline-none focus:border-sage"
              placeholder="2~12자"
            />
            <button
              type="button"
              onClick={saveName}
              disabled={savingName}
              className="rounded-xl bg-ink px-4 py-2 text-[13.5px] font-semibold text-cream disabled:opacity-60"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingName(false);
                setNameError('');
              }}
              className="text-[13.5px] text-ink-soft"
            >
              취소
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] text-ink font-bold tracking-[-0.02em] leading-tight">
              {user.name ? `${user.name}님` : user.email}
            </h1>
            <button
              type="button"
              onClick={() => {
                setNameDraft(user.name ?? '');
                setEditingName(true);
              }}
              aria-label="닉네임 수정"
              className="text-ink-soft/60"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </button>
          </div>
        )}
        {nameError && <p className="mt-1.5 text-[12.5px] text-terracotta">{nameError}</p>}
        <div className="mt-2 flex items-center gap-3 text-[13px] text-ink-soft">
          <span>
            팔로워 <b className="text-ink font-semibold">{follow.followers}</b>
          </span>
          <span>
            팔로잉 <b className="text-ink font-semibold">{follow.following}</b>
          </span>
        </div>

        {/* 한 줄 소개 */}
        {editingBio ? (
          <div className="mt-3 flex items-center gap-2">
            <input
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              maxLength={60}
              autoFocus
              placeholder="어떤 요리를 좋아하는지 한 줄로"
              className="min-w-0 flex-1 rounded-xl border border-border-soft bg-paper px-3 py-2 text-[14px] text-ink outline-none focus:border-sage"
            />
            <button
              type="button"
              onClick={saveBio}
              className="rounded-xl bg-ink px-4 py-2 text-[13.5px] font-semibold text-cream"
            >
              저장
            </button>
            <button type="button" onClick={() => setEditingBio(false)} className="text-[13.5px] text-ink-soft">
              취소
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setBioDraft(user.bio ?? '');
              setEditingBio(true);
            }}
            className="mt-2.5 block text-left text-[13.5px] leading-relaxed text-ink-soft"
          >
            {user.bio ? user.bio : <span className="text-ink-soft/50">한 줄 소개를 남겨보세요</span>}
          </button>
        )}
      </motion.header>

      {/* ============================================
          3. 자주 찾는 재료 — 조회 기록에서 추출한 취향 칩
         ============================================ */}
      {topIngredients.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">
            자주 찾는 재료
          </h2>
          <div className="flex flex-wrap gap-2">
            {topIngredients.map((name) => (
              <Link
                key={name}
                href={`/ingredient/${encodeURIComponent(name)}`}
                className="rounded-full border border-border-soft bg-paper px-3.5 py-1.5 text-[13px] font-medium text-ink"
              >
                {name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============================================
          3-2. 만들었어요 — 실제로 해먹은 기록
         ============================================ */}
      {cookedRecipes.length > 0 && (
        <section className="mb-8 -mx-5">
          <h2 className="px-5 text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">
            내가 만든 요리 · {cookedRecipes.length}
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 snap-x scroll-px-5">
            {cookedRecipes.map((recipe) => (
              <div key={recipe.id} className="w-[150px] flex-shrink-0 snap-start">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================
          4. 최근 본 레시피 — 가로 스크롤
         ============================================ */}
      {recentRecipes.length > 0 && (
        <section className="mb-8 -mx-5">
          <h2 className="px-5 text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">
            최근 본 레시피
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 snap-x scroll-px-5">
            {recentRecipes.map((recipe) => (
              <div key={recipe.id} className="w-[150px] flex-shrink-0 snap-start">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================
          5. 즐겨찾기한 레시피
         ============================================ */}
      <section className="mb-8">
        <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">
          즐겨찾기한 레시피 {favoriteRecipes.length > 0 && `· ${favoriteRecipes.length}`}
        </h2>
        {favoriteRecipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-paper rounded-2xl border border-border-soft px-5 py-10 text-center"
          >
            <p className="text-[14.5px] text-ink-soft">
              아직 즐겨찾기한 레시피가 없어요.
              <br />
              마음에 드는 레시피를 하트로 저장해보세요.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favoriteRecipes.map((recipe, idx) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================
          6. 지원
         ============================================ */}
      <section className="mb-8">
        <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">지원</h2>
        <div className="rounded-2xl bg-paper border border-border-soft divide-y divide-border-soft/70">
          <Link href="/support" className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[14px] text-ink">문의하기</span>
            <span className="text-ink-soft/40">›</span>
          </Link>
          <Link href="/terms" className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[14px] text-ink">이용약관</span>
            <span className="text-ink-soft/40">›</span>
          </Link>
          <Link href="/privacy" className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[14px] text-ink">개인정보처리방침</span>
            <span className="text-ink-soft/40">›</span>
          </Link>
        </div>
      </section>

      {/* ============================================
          7. 계정
         ============================================ */}
      <section>
        <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">계정</h2>
        <div className="rounded-2xl bg-paper border border-border-soft divide-y divide-border-soft/70">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[14px] text-ink-soft">이메일</span>
            <span className="text-[14px] text-ink font-medium">{user.email}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-between px-4 py-3.5"
          >
            <span className="text-[14px] text-ink-soft">로그아웃</span>
            <span className="text-ink-soft/40">›</span>
          </button>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="flex w-full items-center justify-between px-4 py-3.5 disabled:opacity-50"
          >
            <span className="text-[14px] text-terracotta">
              {deleting ? '탈퇴 처리 중...' : '회원 탈퇴'}
            </span>
            <span className="text-ink-soft/40">›</span>
          </button>
        </div>
        <p className="text-[12px] text-ink-soft/60 leading-relaxed mt-2.5 px-1">
          탈퇴하면 즐겨찾기, 조회 기록, 커뮤니티 게시물이 모두 삭제되며 되돌릴 수 없어요.
        </p>
      </section>
    </main>
  );
}
