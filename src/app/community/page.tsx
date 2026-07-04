'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { searchRecipes } from '@/data/recipes';

interface SeedPost {
  id: string;
  authorName: string;
  authorEmoji: string;
  avatarBg: string;
  timeAgo: string;
  image: string;
  caption: string;
  hashtags: string[];
  dishKeyword: string;
  likes: number;
  comments: number;
  featured?: boolean;
}

const SEED_POSTS: SeedPost[] = [
  {
    id: 'p1',
    authorName: '봄날의부엌',
    authorEmoji: '🍅',
    avatarBg: 'bg-terracotta/15',
    timeAgo: '2시간 전',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    caption: '오늘 갑오징어 볼케이노 처음 도전! 국물이 자작해서 밥 비벼 먹기 딱이었어요 🔥',
    hashtags: ['갑오징어', '주말요리', '자취요리'],
    dishKeyword: '갑오징어 볼케이노',
    likes: 128,
    comments: 14,
    featured: true,
  },
  {
    id: 'p2',
    authorName: '제철러버',
    authorEmoji: '🌿',
    avatarBg: 'bg-sage/15',
    timeAgo: '5시간 전',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    caption: '동치미 국물로 막국수 말아 먹었는데 시원해서 눈이 번쩍 뜨였어요. 겨울에도 이거 진리네요.',
    hashtags: ['동치미', '겨울별미'],
    dishKeyword: '동치미 막국수',
    likes: 87,
    comments: 6,
  },
  {
    id: 'p3',
    authorName: '집밥일기',
    authorEmoji: '🍚',
    avatarBg: 'bg-terracotta/15',
    timeAgo: '어제',
    image: 'https://images.unsplash.com/photo-1604908554007-31ea36970bdb?auto=format&fit=crop&w=900&q=80',
    caption: '매생이굴국 끓였어요. 짧게 끓여야 한다는 팁 보고 30초만 끓였더니 향이 진짜 살아있네요!',
    hashtags: ['매생이', '보양식'],
    dishKeyword: '매생이 굴국',
    likes: 203,
    comments: 22,
  },
  {
    id: 'p4',
    authorName: '오늘뭐먹지',
    authorEmoji: '🥘',
    avatarBg: 'bg-sage/15',
    timeAgo: '2일 전',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=900&q=80',
    caption: '고구마순 잡채 처음 해봤는데 아삭한 식감이 신세계... 손질이 살짝 번거롭지만 그만한 가치가 있어요.',
    hashtags: ['고구마순', '잡채'],
    dishKeyword: '고구마순 잡채',
    likes: 64,
    comments: 5,
  },
  {
    id: 'p5',
    authorName: '주말셰프',
    authorEmoji: '🍷',
    avatarBg: 'bg-terracotta/15',
    timeAgo: '3일 전',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
    caption: '손님 초대한 날 관자 뵈르블랑 도전! 소스 분리 안 되게 조심조심 저었더니 성공했습니다 👏',
    hashtags: ['홈파티', '셰프컬렉션'],
    dishKeyword: '뵈르블랑',
    likes: 156,
    comments: 19,
  },
];

function timeToLabel(post: SeedPost) {
  return post.timeAgo;
}

export default function CommunityPage() {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  function toggleLike(id: string) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function showComingSoon() {
    setToast('요리 자랑 올리기 기능은 곧 열려요! 조금만 기다려주세요 🍳');
    setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur-xl">
        <div className="max-w-md mx-auto px-5 pt-3 pb-3 flex items-center justify-between">
          <Logo size="sm" />
          <span className="text-[11px] tracking-[0.14em] uppercase text-terracotta font-semibold">
            오늘의 요리 자랑
          </span>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5 pt-2">
        <div className="flex items-center gap-3 mb-1">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sage/15 to-terracotta/10 text-[18px] leading-none">
            📸
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[10.5px] tracking-[0.16em] uppercase text-terracotta font-semibold mb-0.5">
              함께 만드는 이야기
            </p>
            <h1 className="font-display text-[19px] tracking-tight text-ink font-semibold leading-tight">
              소담
            </h1>
          </div>
        </div>
        <p className="text-[12.5px] text-ink-soft leading-relaxed mt-2 mb-5">
          오늘 만든 요리, 발견한 팁, 제철 이야기를 편하게 나눠보세요.
        </p>
      </div>

      <div className="max-w-md mx-auto px-5 space-y-6">
        {SEED_POSTS.map((post) => {
          const matched = searchRecipes(post.dishKeyword)[0];
          const liked = likedIds.has(post.id);
          const likeCount = post.likes + (liked ? 1 : 0);

          return (
            <article
              key={post.id}
              className="bg-paper border border-border-soft rounded-3xl overflow-hidden"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[16px] ${post.avatarBg}`}
                >
                  {post.authorEmoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium text-ink truncate">{post.authorName}</p>
                  <p className="text-[11px] text-ink-soft/70">{timeToLabel(post)}</p>
                </div>
                {post.featured && (
                  <span className="text-[10.5px] bg-terracotta/10 text-terracotta font-medium rounded-full px-2 py-1 shrink-0">
                    이번 주 인기
                  </span>
                )}
              </div>

              <div className="relative w-full aspect-[4/3]">
                <Image src={post.image} alt={post.caption} fill sizes="448px" className="object-cover" />
              </div>

              <div className="px-4 pt-3 pb-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleLike(post.id)}
                    aria-label="좋아요"
                    className="flex items-center gap-1.5"
                  >
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill={liked ? '#c45d3a' : 'none'}
                      stroke={liked ? '#c45d3a' : '#4a4640'}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-colors"
                    >
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                    </svg>
                  </button>
                  <span className="flex items-center gap-1.5 text-ink-soft">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a4640" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 20l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </span>
                  <span className="ml-auto text-ink-soft/50">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                </div>

                <p className="text-[13px] text-ink font-medium mt-2.5">
                  좋아요 {likeCount.toLocaleString()}개
                </p>

                <p className="text-[13.5px] text-ink leading-relaxed mt-1.5">
                  <span className="font-medium">{post.authorName}</span>{' '}
                  <span className="text-ink-soft">{post.caption}</span>
                </p>

                <p className="text-[12.5px] text-sage mt-1.5">
                  {post.hashtags.map((tag) => `#${tag}`).join(' ')}
                </p>

                {matched && (
                  <Link
                    href={`/recipe/${matched.id}`}
                    className="mt-3 flex items-center gap-2 rounded-xl border border-border-soft bg-cream-warm/50 px-3 py-2 hover:border-sage/40 transition-colors"
                  >
                    <span className="text-[13px]">🍳</span>
                    <span className="text-[12.5px] text-ink font-medium truncate flex-1">
                      {matched.title} 레시피 보기
                    </span>
                    <span className="text-ink-soft/40 text-[13px]">›</span>
                  </Link>
                )}

                <p className="text-[11.5px] text-ink-soft/60 mt-2.5">댓글 {post.comments}개 모두 보기</p>
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={showComingSoon}
        className="fixed bottom-24 right-5 z-30 w-14 h-14 rounded-full bg-terracotta flex items-center justify-center"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        aria-label="나도 요리 자랑하기"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {toast && (
        <div className="fixed bottom-24 left-5 right-24 z-40">
          <div className="bg-ink text-cream text-[12.5px] rounded-2xl px-4 py-3 text-center leading-relaxed">
            {toast}
          </div>
        </div>
      )}

    </div>
  );
}
