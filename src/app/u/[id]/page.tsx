'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/auth-context';

interface Post {
  id: number;
  imageUrl: string;
  caption: string;
  authorId: number;
  authorName: string;
  authorAvatarUrl?: string | null;
  authorBio?: string | null;
  reactionCount: number;
  commentCount: number;
}

/**
 * 이웃 프로필 — 커뮤니티에서 작성자를 눌렀을 때 오는 화면.
 * 팔로우 자체보다 "이 사람이 뭘 만들어 먹는지 볼 수 있다"가 핵심 가치라
 * 게시물 그리드를 중심에 두고 팔로우는 그 위에 얹는다.
 */
export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const userId = Number(params.id);
  const router = useRouter();
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[] | null>(null);
  const [stats, setStats] = useState({ followers: 0, following: 0, isFollowing: false });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/community/posts?userId=${userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPosts(data?.posts ?? []))
      .catch(() => setPosts([]));
    fetch(`/api/follow?userId=${userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setStats(data))
      .catch(() => {});
  }, [userId]);

  const isMe = user?.id === userId;
  const displayName = posts?.[0]?.authorName ?? '이웃';
  const avatarUrl = posts?.[0]?.authorAvatarUrl ?? null;
  const bio = posts?.[0]?.authorBio ?? null;

  const toggleFollow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setBusy(true);
    try {
      const res = stats.isFollowing
        ? await fetch(`/api/follow?userId=${userId}`, { method: 'DELETE' })
        : await fetch('/api/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          });
      if (res.ok) {
        setStats((s) => ({
          ...s,
          isFollowing: !s.isFollowing,
          followers: s.followers + (s.isFollowing ? -1 : 1),
        }));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-5 pt-6 pb-24">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-5 text-[13px] text-ink-soft"
      >
        ← 뒤로
      </button>

      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cream-warm text-[22px] font-bold text-ink-soft">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="프로필 사진" fill sizes="64px" className="object-cover" />
          ) : (
            displayName.slice(0, 1)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-[20px] font-bold tracking-[-0.02em] text-ink">{displayName}</h1>
          {bio && <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{bio}</p>}
          <div className="mt-1 flex items-center gap-3 text-[13px] text-ink-soft">
            <span>
              게시물 <b className="text-ink font-semibold">{posts?.length ?? 0}</b>
            </span>
            <span>
              팔로워 <b className="text-ink font-semibold">{stats.followers}</b>
            </span>
            <span>
              팔로잉 <b className="text-ink font-semibold">{stats.following}</b>
            </span>
          </div>
        </div>
      </div>

      {!isMe && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={toggleFollow}
          disabled={busy}
          className={`mt-4 h-11 w-full rounded-2xl text-[14.5px] font-semibold transition-colors ${
            stats.isFollowing
              ? 'border border-border-soft bg-paper text-ink'
              : 'bg-ink text-cream'
          }`}
        >
          {stats.isFollowing ? '팔로잉' : '팔로우'}
        </motion.button>
      )}

      <h2 className="mt-8 mb-3 text-[16.5px] font-bold tracking-[-0.01em] text-ink">
        올린 요리
      </h2>
      {posts === null ? (
        <p className="text-[14px] text-ink-soft">불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p className="rounded-2xl border border-border-soft bg-paper px-5 py-10 text-center text-[14px] text-ink-soft">
          아직 올린 요리가 없어요.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              href="/community"
              className="relative block aspect-square overflow-hidden rounded-2xl bg-cream-warm"
            >
              <Image src={p.imageUrl} alt={p.caption || '요리 사진'} fill sizes="200px" className="object-cover" />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
