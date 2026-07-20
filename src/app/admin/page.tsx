'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeById } from '@/data/recipes';

interface Overview {
  stats: {
    users: number;
    posts: number;
    comments: number;
    reactions: number;
    favorites: number;
    cooked: number;
    newUsers7d: number;
    newPosts7d: number;
  };
  topRecipes: { recipeId: string; views: number }[];
  recentPosts: {
    id: number;
    image_url: string;
    caption: string | null;
    created_at: string;
    author_id: number;
    author_name: string | null;
    author_email: string;
  }[];
  recentUsers: { id: number; email: string; name: string | null; created_at: string }[];
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-paper px-4 py-3.5">
      <p className="text-[12px] text-ink-soft">{label}</p>
      <p className="mt-1 text-[22px] font-bold tabular-nums tracking-[-0.02em] text-ink">
        {value.toLocaleString()}
      </p>
      {sub && <p className="mt-0.5 text-[11.5px] text-sage">{sub}</p>}
    </div>
  );
}

/**
 * 운영 대시보드.
 *
 * 목적은 두 가지다: (1) 커뮤니티에 문제가 생겼을 때 즉시 지울 수 있을 것,
 * (2) 앱이 실제로 어떻게 쓰이는지 숫자로 볼 것.
 * 권한은 서버(ADMIN_EMAILS)에서 판단하며, 이 화면은 403이면 안내만 띄운다.
 */
export default function AdminPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [denied, setDenied] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = () => {
    fetch('/api/admin')
      .then(async (res) => {
        if (res.status === 403) {
          setDenied(true);
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((d) => d && setData(d))
      .catch(() => setDenied(true));
  };

  useEffect(load, []);

  const removePost = async (id: number) => {
    if (!window.confirm('이 게시물을 삭제할까요? 되돌릴 수 없어요.')) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin?postId=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setData((prev) =>
          prev ? { ...prev, recentPosts: prev.recentPosts.filter((p) => p.id !== id) } : prev
        );
      }
    } finally {
      setBusyId(null);
    }
  };

  if (denied) {
    return (
      <main className="max-w-md mx-auto px-5 pt-20 text-center">
        <p className="text-[15px] text-ink">관리자만 볼 수 있는 화면이에요.</p>
        <p className="mt-2 text-[13px] text-ink-soft leading-relaxed">
          접근하려면 환경변수 ADMIN_EMAILS에 계정 이메일을 등록해주세요.
        </p>
        <Link href="/" className="mt-6 inline-block text-[14px] text-sage font-medium">
          홈으로
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="max-w-md mx-auto px-5 pt-20 text-center">
        <p className="text-[14px] text-ink-soft">불러오는 중...</p>
      </main>
    );
  }

  const { stats } = data;

  return (
    <main className="max-w-md mx-auto px-5 pt-6 pb-24">
      <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-1.5">운영</p>
      <h1 className="text-[24px] font-bold tracking-[-0.02em] text-ink">대시보드</h1>

      {/* 지표 */}
      <section className="mt-6 grid grid-cols-2 gap-2.5">
        <StatCard label="가입자" value={stats.users} sub={`최근 7일 +${stats.newUsers7d}`} />
        <StatCard label="게시물" value={stats.posts} sub={`최근 7일 +${stats.newPosts7d}`} />
        <StatCard label="댓글" value={stats.comments} />
        <StatCard label="맛있어요" value={stats.reactions} />
        <StatCard label="즐겨찾기" value={stats.favorites} />
        <StatCard label="만들었어요" value={stats.cooked} />
      </section>

      {/* 많이 본 레시피 — 어떤 콘텐츠가 실제로 쓰이는지 */}
      {data.topRecipes.length > 0 && (
        <section className="mt-8">
          <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">많이 본 레시피</h2>
          <div className="rounded-2xl border border-border-soft bg-paper divide-y divide-border-soft/70">
            {data.topRecipes.map((r, i) => {
              const recipe = getRecipeById(r.recipeId);
              return (
                <div key={r.recipeId} className="flex items-center gap-3 px-4 py-3">
                  <span className="w-4 text-[13px] font-semibold text-ink-soft/60 tabular-nums">{i + 1}</span>
                  <Link href={`/recipe/${r.recipeId}`} className="min-w-0 flex-1 truncate text-[14px] text-ink">
                    {recipe?.title ?? r.recipeId}
                  </Link>
                  <span className="text-[13px] text-ink-soft tabular-nums">{r.views}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 최근 게시물 — 문제 콘텐츠 즉시 삭제 */}
      <section className="mt-8">
        <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">최근 게시물</h2>
        {data.recentPosts.length === 0 ? (
          <p className="rounded-2xl border border-border-soft bg-paper px-4 py-8 text-center text-[13.5px] text-ink-soft">
            아직 게시물이 없어요.
          </p>
        ) : (
          <div className="space-y-2">
            {data.recentPosts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-2xl border border-border-soft bg-paper p-2.5"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream-warm">
                  <Image src={p.image_url} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-ink truncate">
                    {p.author_name ?? p.author_email}
                  </p>
                  <p className="text-[12.5px] text-ink-soft truncate">{p.caption || '(내용 없음)'}</p>
                  <p className="text-[11px] text-ink-soft/60">
                    {new Date(p.created_at).toLocaleString('ko-KR')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removePost(p.id)}
                  disabled={busyId === p.id}
                  className="shrink-0 rounded-xl border border-border-soft px-3 py-2 text-[12.5px] font-medium text-terracotta disabled:opacity-50"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 최근 가입자 */}
      <section className="mt-8">
        <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">최근 가입자</h2>
        <div className="rounded-2xl border border-border-soft bg-paper divide-y divide-border-soft/70">
          {data.recentUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="text-[13.5px] text-ink truncate">{u.name ?? '(닉네임 없음)'}</p>
                <p className="text-[12px] text-ink-soft/70 truncate">{u.email}</p>
              </div>
              <span className="shrink-0 text-[11.5px] text-ink-soft/60">
                {new Date(u.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
