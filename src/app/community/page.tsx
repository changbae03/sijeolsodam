'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '@/components/Logo';
import PhotoPicker from '@/components/PhotoPicker';
import { useAuth } from '@/lib/auth-context';

interface Post {
  id: number;
  imageUrl: string;
  /** 여러 장 게시물의 전체 미디어 (구버전 글은 imageUrl 한 장) */
  imageUrls?: string[];
  mediaType?: 'image' | 'video';
  caption: string | null;
  hashtags: string[];
  recipeId: string | null;
  userRecipeId: number | null;
  createdAt: string;
  authorId: number;
  authorName: string;
  authorAvatarUrl: string | null;
  reactionCount: number;
  commentCount: number;
  reacted: boolean;
}

interface UserRecipe {
  id: number;
  title: string;
  mainIngredient: string | null;
  description: string | null;
  ingredientsText: string;
  stepsText: string;
  imageUrl: string | null;
  createdAt: string;
  authorName: string;
}

interface Comment {
  id: number;
  body: string;
  createdAt: string;
  authorName: string;
}

/**
 * "35분 전"만 있으면 언제 만든 요리인지 감이 안 온다.
 * 상대 시간(최근일수록 유용)과 날짜(기록으로서 유용)를 함께 보여준다.
 */
function postTimeLabel(iso: string) {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  const dateLabel = d.toLocaleDateString('ko-KR', {
    year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let rel: string;
  if (min < 1) rel = '방금 전';
  else if (min < 60) rel = `${min}분 전`;
  else if (min < 60 * 24) rel = `${Math.floor(min / 60)}시간 전`;
  else if (min < 60 * 24 * 7) rel = `${Math.floor(min / 1440)}일 전`;
  else return dateLabel;

  return `${dateLabel} · ${rel}`;
}

function CommunityPageInner() {
  const { user } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<'feed' | 'mine'>('feed');
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [userRecipes, setUserRecipes] = useState<UserRecipe[] | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [commentsByPost, setCommentsByPost] = useState<Record<number, Comment[]>>({});
  const [commentDraft, setCommentDraft] = useState('');
  const [composer, setComposer] = useState<'post' | 'recipe' | null>(
    // 레시피 상세의 "만들었어요 -> 사진 올리기"로 들어온 경우 글쓰기를 바로 연다
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('compose') === 'post'
      ? 'post'
      : null
  );
  // 내 글 수정/삭제
  const [menuPostId, setMenuPostId] = useState<number | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editHashtags, setEditHashtags] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const startEdit = (post: Post) => {
    setEditingPostId(post.id);
    setEditCaption(post.caption ?? '');
    setEditHashtags((post.hashtags ?? []).join(' '));
    setMenuPostId(null);
  };

  const saveEdit = async (postId: number) => {
    setSavingEdit(true);
    try {
      const hashtags = editHashtags
        .split(/[\s,]+/)
        .map((h) => h.replace(/^#/, '').trim())
        .filter(Boolean);
      const res = await fetch(`/api/community/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: editCaption, hashtags }),
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          (prev ?? []).map((p) =>
            p.id === postId ? { ...p, caption: data.caption, hashtags: data.hashtags } : p
          )
        );
        setEditingPostId(null);
      }
    } finally {
      setSavingEdit(false);
    }
  };

  const deletePost = async (postId: number) => {
    if (!window.confirm('이 글을 삭제할까요? 되돌릴 수 없어요.')) return;
    setMenuPostId(null);
    const res = await fetch(`/api/community/posts/${postId}`, { method: 'DELETE' });
    if (res.ok) setPosts((prev) => (prev ?? []).filter((p) => p.id !== postId));
  };
  // 레시피 상세의 "만들었어요 -> 사진 올리기"에서 넘어온 경우 글쓰기를 바로 열고
  // 어떤 레시피에서 왔는지 게시글에 함께 저장한다.
  const searchParams = useSearchParams();
  const linkedRecipeId = searchParams.get('recipeId');
  const linkedRecipeTitle = searchParams.get('title');


  useEffect(() => {
    fetch('/api/community/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]));
    fetch('/api/community/recipes')
      .then((res) => res.json())
      .then((data) => setUserRecipes(data.recipes ?? []))
      .catch(() => setUserRecipes([]));
  }, []);

  function requireLogin() {
    router.push('/login');
  }

  async function toggleReaction(postId: number) {
    if (!user) return requireLogin();
    setPosts((prev) =>
      (prev ?? []).map((p) =>
        p.id === postId
          ? { ...p, reacted: !p.reacted, reactionCount: p.reactionCount + (p.reacted ? -1 : 1) }
          : p
      )
    );
    try {
      const res = await fetch(`/api/community/posts/${postId}/react`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) =>
          (prev ?? []).map((p) =>
            p.id === postId ? { ...p, reacted: data.reacted, reactionCount: data.reactionCount } : p
          )
        );
      }
    } catch {
      // 실패해도 조용히 낙관적 업데이트를 유지 (다음 새로고침에서 서버 값으로 맞춰짐)
    }
  }

  async function openComments(postId: number) {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);
    if (!commentsByPost[postId]) {
      const res = await fetch(`/api/community/posts/${postId}/comments`);
      const data = await res.json();
      setCommentsByPost((prev) => ({ ...prev, [postId]: data.comments ?? [] }));
    }
  }

  async function submitComment(postId: number) {
    if (!user) return requireLogin();
    const body = commentDraft.trim();
    if (!body) return;
    const res = await fetch(`/api/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) return;
    const newComment = await res.json();
    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] ?? []), { ...newComment, authorName: user.name || '나' }],
    }));
    setCommentDraft('');
    setPosts((prev) =>
      (prev ?? []).map((p) => (p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p))
    );
  }

  function openComposer(kind: 'post' | 'recipe') {
    if (!user) return requireLogin();
    setComposer(kind);
  }

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPosts = (posts ?? []).filter((post) => {
    if (!normalizedQuery) return true;
    const haystack = [post.authorName, post.caption ?? '', ...post.hashtags].join(' ').toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  const filteredUserRecipes = (userRecipes ?? []).filter((r) => {
    if (!normalizedQuery) return true;
    const haystack = [r.title, r.mainIngredient ?? '', r.description ?? '', r.authorName]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return (
    <div className="min-h-screen bg-cream pb-24">
      <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur-xl">
        <div className="max-w-md mx-auto px-5 pt-3 pb-3 flex items-center justify-between">
          <Logo size="sm" />
          <span className="text-[12px] tracking-[0.06em] text-ink-soft/70 font-medium">
            오늘의 요리 자랑
          </span>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5 pt-2">
        <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-1.5">
          함께 만드는 이야기
        </p>
        <h1 className="text-[26px] text-ink font-bold tracking-[-0.02em] leading-tight">소담</h1>
        <p className="text-[13.5px] text-ink-soft leading-relaxed mt-2 mb-4">
          오늘 만든 요리, 발견한 팁, 나만의 레시피를 편하게 나눠보세요.
        </p>

        {/* 글 종류(자랑/레시피)로 나누지 않는다 — 올리는 사람이 알아서 쓰면 되고,
            보는 사람에게 의미 있는 구분은 '남의 것 / 내 것'이다 */}
        <div className="flex gap-2 mb-5">
          <button
            type="button"
            onClick={() => setTab('feed')}
            className={`text-[14px] font-medium rounded-full px-4 py-2 transition-colors ${
              tab === 'feed' ? 'bg-ink text-cream' : 'bg-paper border border-border-soft text-ink-soft'
            }`}
          >
            모두의 소담
          </button>
          <button
            type="button"
            onClick={() => setTab('mine')}
            className={`text-[14px] font-medium rounded-full px-4 py-2 transition-colors ${
              tab === 'mine' ? 'bg-ink text-cream' : 'bg-paper border border-border-soft text-ink-soft'
            }`}
          >
            내 소담
          </button>
        </div>

        <div className="flex items-center gap-2 bg-paper border border-border-soft rounded-full h-11 px-4 mb-5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a857c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름, 재료, 해시태그로 검색"
            className="flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-soft/45"
          />
        </div>
      </div>

      {tab === 'feed' && (
        <div className="max-w-md mx-auto px-5 space-y-6">
          {posts === null && <p className="text-[14px] text-ink-soft text-center py-10">불러오는 중...</p>}
          {posts?.length === 0 && (
            <p className="text-[14px] text-ink-soft text-center py-10">
              아직 올라온 이야기가 없어요. 가장 먼저 요리를 자랑해보세요!
            </p>
          )}
          {posts && posts.length > 0 && filteredPosts.length === 0 && (
            <p className="text-[14px] text-ink-soft text-center py-10">
              &ldquo;{query}&rdquo;와 일치하는 이야기를 찾지 못했어요.
            </p>
          )}
          {filteredPosts.map((post) => {
            const liked = post.reacted;
            return (
              <article
                key={post.id}
                className="bg-paper border border-border-soft rounded-3xl overflow-hidden"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-3">
                  {/* 작성자 -> 프로필. 팔로우보다 '이 사람이 뭘 만드는지 본다'가 먼저다 */}
                  <Link
                    href={`/u/${post.authorId}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage/15 text-[15px] font-medium text-sage"
                  >
                    {post.authorName.slice(0, 1)}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/u/${post.authorId}`} className="text-[14.5px] font-medium text-ink truncate block">
                      {post.authorName}
                    </Link>
                    <p className="text-[12px] text-ink-soft/70">{postTimeLabel(post.createdAt)}</p>
                  </div>

                  {/* 내 글에만 수정·삭제 메뉴 */}
                  {user?.id === post.authorId && (
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setMenuPostId(menuPostId === post.id ? null : post.id)}
                        aria-label="게시물 메뉴"
                        className="px-2 py-1 text-ink-soft/60"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="1.6" />
                          <circle cx="12" cy="12" r="1.6" />
                          <circle cx="12" cy="19" r="1.6" />
                        </svg>
                      </button>
                      {menuPostId === post.id && (
                        <div className="absolute right-0 top-8 z-20 w-28 overflow-hidden rounded-xl border border-border-soft bg-paper shadow-lg">
                          <button
                            type="button"
                            onClick={() => startEdit(post)}
                            className="block w-full px-3.5 py-2.5 text-left text-[13.5px] text-ink"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePost(post.id)}
                            className="block w-full border-t border-border-soft px-3.5 py-2.5 text-left text-[13.5px] text-terracotta"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {post.mediaType === 'video' ? (
                  <video
                    src={post.imageUrl}
                    className="w-full aspect-square bg-ink object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  (() => {
                    const media = post.imageUrls?.length ? post.imageUrls : [post.imageUrl];
                    return (
                      <div className="relative">
                        {/* 여러 장이면 가로 스와이프 — 스크롤 스냅으로 네이티브 느낌 */}
                        <div className="flex w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide">
                          {media.map((url, i) => (
                            <div key={url} className="relative aspect-square w-full shrink-0 snap-center bg-cream-warm">
                              <Image
                                src={url}
                                alt={post.caption ?? `사진 ${i + 1}`}
                                fill
                                sizes="448px"
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        {media.length > 1 && (
                          <>
                            <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11.5px] font-medium text-white backdrop-blur-sm">
                              {media.length}장
                            </span>
                            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                              {media.map((u) => (
                                <span key={u} className="h-1.5 w-1.5 rounded-full bg-white/70" />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()
                )}

                <div className="px-4 pt-3 pb-4">
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      onClick={() => toggleReaction(post.id)}
                      className="flex items-center gap-1.5"
                      aria-label="맛있어요"
                    >
                      <span className={`text-[20px] transition-transform ${liked ? 'scale-110' : 'grayscale opacity-60'}`}>
                        😋
                      </span>
                      <span className={`text-[14px] ${liked ? 'text-terracotta font-medium' : 'text-ink-soft'}`}>
                        맛있어요{post.reactionCount > 0 ? ` ${post.reactionCount}` : ''}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openComments(post.id)}
                      className="flex items-center gap-1.5"
                      aria-label="댓글"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ink-soft">
                        <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
                      </svg>
                      {post.commentCount > 0 && (
                        <span className="text-[14px] text-ink-soft">{post.commentCount}</span>
                      )}
                    </button>
                  </div>

                  {post.caption && (
                    <p className="text-[14.5px] text-ink leading-relaxed mt-2.5">
                      <span className="font-medium">{post.authorName}</span>{' '}
                      <span className="text-ink-soft">{post.caption}</span>
                    </p>
                  )}

                  {editingPostId === post.id ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-border-soft bg-paper px-3 py-2 text-[14px] text-ink outline-none focus:border-sage"
                        placeholder="어떤 요리인지 적어주세요"
                      />
                      <input
                        value={editHashtags}
                        onChange={(e) => setEditHashtags(e.target.value)}
                        className="w-full rounded-xl border border-border-soft bg-paper px-3 py-2 text-[13.5px] text-ink outline-none focus:border-sage"
                        placeholder="해시태그 (띄어쓰기로 구분)"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveEdit(post.id)}
                          disabled={savingEdit}
                          className="rounded-xl bg-ink px-4 py-2 text-[13.5px] font-semibold text-cream disabled:opacity-60"
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPostId(null)}
                          className="rounded-xl border border-border-soft px-4 py-2 text-[13.5px] text-ink-soft"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    post.hashtags.length > 0 && (
                      <p className="text-[13.5px] text-sage mt-1.5">
                        {post.hashtags.map((tag) => `#${tag}`).join(' ')}
                      </p>
                    )
                  )}

                  {post.recipeId && (
                    <Link
                      href={`/recipe/${post.recipeId}`}
                      className="mt-3 flex items-center gap-2 rounded-xl border border-border-soft bg-cream-warm/50 px-3 py-2 hover:border-sage/40 transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ink-soft shrink-0">
                        <path d="M4 20V6a2 2 0 0 1 2-2h13v14H6a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h13" />
                      </svg>
                      <span className="text-[13.5px] text-ink font-medium truncate flex-1">
                        연결된 레시피 보기
                      </span>
                      <span className="text-ink-soft/40 text-[14px]">›</span>
                    </Link>
                  )}

                  <AnimatePresence>
                    {expandedPostId === post.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 border-t border-border-soft/70 pt-3 space-y-2.5">
                          {(commentsByPost[post.id] ?? []).map((c) => (
                            <p key={c.id} className="text-[13.5px] text-ink leading-relaxed">
                              <span className="font-medium">{c.authorName}</span>{' '}
                              <span className="text-ink-soft">{c.body}</span>
                            </p>
                          ))}
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              value={commentDraft}
                              onChange={(e) => setCommentDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.nativeEvent.isComposing) submitComment(post.id);
                              }}
                              placeholder="댓글을 남겨보세요"
                              className="flex-1 bg-cream-warm/50 rounded-full px-3.5 py-2 text-[13.5px] text-ink outline-none placeholder:text-ink-soft/45"
                            />
                            <button
                              type="button"
                              onClick={() => submitComment(post.id)}
                              className="text-[13.5px] text-terracotta font-medium shrink-0"
                            >
                              등록
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!expandedPostId && post.commentCount > 0 && (
                    <button
                      type="button"
                      onClick={() => openComments(post.id)}
                      className="text-[12.5px] text-ink-soft/60 mt-2.5"
                    >
                      댓글 {post.commentCount}개 모두 보기
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {tab === 'mine' && (
        <div className="max-w-md mx-auto px-5">
          {(() => {
            const mine = (posts ?? []).filter((p) => p.authorId === user?.id);
            if (!user) {
              return (
                <p className="rounded-2xl border border-border-soft bg-paper px-5 py-10 text-center text-[14px] text-ink-soft">
                  로그인하면 내가 올린 요리를 모아볼 수 있어요.
                </p>
              );
            }
            if (mine.length === 0) {
              return (
                <p className="rounded-2xl border border-border-soft bg-paper px-5 py-10 text-center text-[14px] text-ink-soft">
                  아직 올린 요리가 없어요.
                  <br />
                  오늘 만든 요리를 첫 번째로 올려보세요.
                </p>
              );
            }
            // 인스타 프로필처럼 사진만 3x3 격자로 — 내 기록은 훑어보는 용도라 사진이 주인공
            return (
              <div className="grid grid-cols-3 gap-1">
                {mine.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setTab('feed')}
                    className="relative aspect-square overflow-hidden bg-cream-warm"
                  >
                    <Image src={p.imageUrl} alt={p.caption ?? '내 요리'} fill sizes="150px" className="object-cover" />
                    {p.mediaType === 'video' ? (
                      <span className="absolute right-1.5 top-1.5 text-cream drop-shadow">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5 4l14 8-14 8Z" />
                        </svg>
                      </span>
                    ) : (p.imageUrls?.length ?? 0) > 1 ? (
                      <span className="absolute right-1.5 top-1.5 text-cream drop-shadow">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="8" y="3" width="13" height="13" rx="2" />
                          <path d="M4 8v11a2 2 0 0 0 2 2h11" />
                        </svg>
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      <button
        type="button"
        onClick={() => openComposer('post')}
        className="fixed bottom-24 right-5 z-30 w-14 h-14 rounded-full bg-ink flex items-center justify-center"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        aria-label="요리 올리기"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {composer === 'post' && (
        <PostComposer
          onClose={() => setComposer(null)}
          onCreated={(post) => setPosts((prev) => [post, ...(prev ?? [])])}
          linkedRecipeId={linkedRecipeId}
          linkedRecipeTitle={linkedRecipeTitle}
        />
      )}
      {composer === 'recipe' && (
        <RecipeComposer
          onClose={() => setComposer(null)}
          onCreated={(recipe) => setUserRecipes((prev) => [recipe, ...(prev ?? [])])}
        />
      )}
    </div>
  );
}

function ComposerShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink/30 z-40"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-cream rounded-t-3xl flex flex-col max-h-[88vh]"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border-soft shrink-0">
          <p className="font-display text-[17px] text-ink font-medium">{title}</p>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-full flex items-center justify-center text-ink-soft/60 hover:text-ink-soft transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </motion.div>
    </>
  );
}

function PostComposer({
  onClose,
  onCreated,
  linkedRecipeId,
  linkedRecipeTitle,
}: {
  onClose: () => void;
  onCreated: (post: Post) => void;
  /** 레시피 상세에서 넘어왔다면 그 레시피 ID (게시글에 함께 저장) */
  linkedRecipeId?: string | null;
  linkedRecipeTitle?: string | null;
}) {
  const { user } = useAuth();
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [hashtagsInput, setHashtagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 게시 직전에 업로드한다 — 필터를 바꿔가며 고르는 동안 서버에 여러 장이 쌓이지 않게 */
  async function uploadSelected(): Promise<string[] | null> {
    if (photoFiles.length === 0) return null;
    setUploading(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of photoFiles) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch('/api/community/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || '사진을 올리지 못했어요.');
          return null;
        }
        urls.push(data.url as string);
      }
      return urls;
    } catch {
      setError('사진을 올리지 못했어요. 잠시 후 다시 시도해주세요.');
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (photoFiles.length === 0) {
      setError('먼저 사진을 골라주세요.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const urls = await uploadSelected();
      if (!urls || urls.length === 0) return;
      const imageUrl = urls[0];
      const hashtags = hashtagsInput
        .split(/[\s,]+/)
        .map((t) => t.replace(/^#/, ''))
        .filter(Boolean);
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          imageUrls: urls,
          mediaType,
          caption,
          hashtags,
          recipeId: linkedRecipeId ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '게시물을 올리지 못했어요.');
        return;
      }
      onCreated({
        id: data.id,
        imageUrl,
        caption,
        hashtags,
        recipeId: linkedRecipeId ?? null,
        userRecipeId: null,
        createdAt: data.createdAt,
        authorId: user?.id ?? 0,
        authorName: user?.name || '나',
        authorAvatarUrl: null,
        reactionCount: 0,
        commentCount: 0,
        reacted: false,
      });
      onClose();
    } catch {
      setError('게시물을 올리지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ComposerShell title="오늘의 요리 자랑" onClose={onClose}>
      {linkedRecipeTitle && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-cream-warm/60 px-3.5 py-2.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ink-soft shrink-0">
            <path d="M4 20V6a2 2 0 0 1 2-2h13v14H6a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h13" />
          </svg>
          <span className="text-[13px] text-ink-soft truncate">
            <span className="font-semibold text-ink">{linkedRecipeTitle}</span> 만든 사진이에요
          </span>
        </div>
      )}
      <PhotoPicker
        onReady={(files, type) => {
          setPhotoFiles(files);
          setMediaType(type);
        }}
        disabled={submitting || uploading}
      />

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="오늘 만든 요리 이야기를 들려주세요"
        rows={3}
        className="w-full mt-4 bg-paper border border-border-soft rounded-xl px-3.5 py-3 text-[14.5px] text-ink outline-none placeholder:text-ink-soft/45 resize-none"
      />

      <input
        value={hashtagsInput}
        onChange={(e) => setHashtagsInput(e.target.value)}
        placeholder="해시태그 (예: 갑오징어 주말요리)"
        className="w-full mt-3 bg-paper border border-border-soft rounded-xl px-3.5 py-3 text-[14.5px] text-ink outline-none placeholder:text-ink-soft/45"
      />

      {error && <p className="text-[13.5px] text-terracotta mt-2">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || uploading || photoFiles.length === 0}
        className="w-full mt-4 rounded-xl bg-terracotta text-cream text-[15px] font-medium py-3 disabled:opacity-40"
      >
        {submitting ? '올리는 중...' : '자랑하기'}
      </button>
    </ComposerShell>
  );
}

function RecipeComposer({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (recipe: UserRecipe) => void;
}) {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [mainIngredient, setMainIngredient] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/community/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) setImageUrl(data.url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!title.trim() || !ingredientsText.trim() || !stepsText.trim()) {
      setError('레시피 이름, 재료, 만드는 순서는 꼭 채워주세요.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/community/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, mainIngredient, description, ingredientsText, stepsText, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '레시피를 올리지 못했어요.');
        return;
      }
      onCreated({
        id: data.id,
        title,
        mainIngredient: mainIngredient || null,
        description: description || null,
        ingredientsText,
        stepsText,
        imageUrl,
        createdAt: data.createdAt,
        authorName: user?.name || '나',
      });
      onClose();
    } catch {
      setError('레시피를 올리지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ComposerShell title="나만의 레시피 올리기" onClose={onClose}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="w-full aspect-[16/10] rounded-2xl border border-dashed border-border-soft bg-cream-warm/40 flex items-center justify-center overflow-hidden relative"
      >
        {imageUrl ? (
          <Image src={imageUrl} alt="업로드한 사진" fill sizes="448px" className="object-cover" />
        ) : (
          <span className="text-[14px] text-ink-soft">{uploading ? '사진 올리는 중...' : '완성 사진 올리기 (선택) 📷'}</span>
        )}
      </button>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="레시피 이름 (예: 우리집 고구마순 잡채)"
        className="w-full mt-4 bg-paper border border-border-soft rounded-xl px-3.5 py-3 text-[14.5px] text-ink outline-none placeholder:text-ink-soft/45"
      />
      <input
        value={mainIngredient}
        onChange={(e) => setMainIngredient(e.target.value)}
        placeholder="주재료 (예: 고구마순)"
        className="w-full mt-3 bg-paper border border-border-soft rounded-xl px-3.5 py-3 text-[14.5px] text-ink outline-none placeholder:text-ink-soft/45"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="한 줄 소개"
        rows={2}
        className="w-full mt-3 bg-paper border border-border-soft rounded-xl px-3.5 py-3 text-[14.5px] text-ink outline-none placeholder:text-ink-soft/45 resize-none"
      />
      <textarea
        value={ingredientsText}
        onChange={(e) => setIngredientsText(e.target.value)}
        placeholder={'재료를 한 줄에 하나씩 적어주세요\n예) 고구마순 300g\n돼지고기 200g'}
        rows={4}
        className="w-full mt-3 bg-paper border border-border-soft rounded-xl px-3.5 py-3 text-[14px] text-ink outline-none placeholder:text-ink-soft/45 resize-none"
      />
      <textarea
        value={stepsText}
        onChange={(e) => setStepsText(e.target.value)}
        placeholder={'만드는 순서를 한 줄에 하나씩 적어주세요\n예) 고구마순은 데쳐서 껍질을 벗긴다\n돼지고기와 함께 볶는다'}
        rows={5}
        className="w-full mt-3 bg-paper border border-border-soft rounded-xl px-3.5 py-3 text-[14px] text-ink outline-none placeholder:text-ink-soft/45 resize-none"
      />

      {error && <p className="text-[13.5px] text-terracotta mt-2">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full mt-4 rounded-xl bg-terracotta text-cream text-[15px] font-medium py-3 disabled:opacity-40"
      >
        {submitting ? '올리는 중...' : '레시피 올리기'}
      </button>
    </ComposerShell>
  );
}

export default function CommunityPage() {
  // useSearchParams는 Suspense 경계가 필요 (Next.js 정적 렌더 규칙)
  return (
    <Suspense fallback={null}>
      <CommunityPageInner />
    </Suspense>
  );
}
