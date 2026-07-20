'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeById } from '@/data/recipes';

interface Inquiry {
  id: number;
  body: string;
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
  userId: number;
  userName: string | null;
  userEmail: string;
}

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
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [notices, setNotices] = useState<
    { id: number; title: string; body: string | null; createdAt: string }[]
  >([]);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [postingNotice, setPostingNotice] = useState(false);

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

  useEffect(() => {
    load();
    fetch('/api/announcements')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => d?.announcements && setNotices(d.announcements))
      .catch(() => {});
    fetch('/api/admin/inquiries')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => d && setInquiries(d.inquiries ?? []))
      .catch(() => setInquiries([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 최초 진입 시 1회
  }, []);

  const publishNotice = async () => {
    if (!noticeTitle.trim()) return;
    setPostingNotice(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: noticeTitle, body: noticeBody }),
      });
      if (res.ok) {
        const d = await res.json();
        setNotices((prev) => [d.announcement, ...prev]);
        setNoticeTitle('');
        setNoticeBody('');
      }
    } finally {
      setPostingNotice(false);
    }
  };

  const removeNotice = async (id: number) => {
    if (!window.confirm('이 공지를 내릴까요?')) return;
    const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
    if (res.ok) setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const sendReply = async (id: number) => {
    const reply = (replyDrafts[id] ?? '').trim();
    if (!reply) return;
    setReplyingId(id);
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reply }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          (prev ?? []).map((q) =>
            q.id === id ? { ...q, reply, repliedAt: new Date().toISOString() } : q
          )
        );
        setReplyDrafts((prev) => ({ ...prev, [id]: '' }));
      }
    } finally {
      setReplyingId(null);
    }
  };

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

      {/* 공지 — 모두의 소담 피드 맨 위에 노출된다 */}
      <section className="mt-8">
        <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">공지사항</h2>

        <div className="rounded-2xl border border-border-soft bg-paper p-3.5">
          <input
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
            maxLength={100}
            placeholder="공지 제목"
            className="w-full rounded-xl border border-border-soft bg-cream-warm/40 px-3 py-2.5 text-[14px] text-ink outline-none focus:border-sage"
          />
          <textarea
            value={noticeBody}
            onChange={(e) => setNoticeBody(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="내용 (선택)"
            className="mt-2 w-full resize-none rounded-xl border border-border-soft bg-cream-warm/40 px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-sage"
          />
          <button
            type="button"
            onClick={publishNotice}
            disabled={postingNotice || !noticeTitle.trim()}
            className="mt-2.5 w-full rounded-xl bg-ink py-2.5 text-[13.5px] font-semibold text-cream disabled:opacity-50"
          >
            {postingNotice ? '등록 중...' : '공지 올리기'}
          </button>
        </div>

        {notices.length > 0 && (
          <div className="mt-3 space-y-2">
            {notices.map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-2xl border border-border-soft bg-paper px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-ink">{n.title}</p>
                  {n.body && <p className="mt-0.5 text-[12.5px] text-ink-soft line-clamp-2">{n.body}</p>}
                  <p className="mt-1 text-[11px] text-ink-soft/60">
                    {new Date(n.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeNotice(n.id)}
                  className="shrink-0 rounded-xl border border-border-soft px-3 py-1.5 text-[12.5px] font-medium text-terracotta"
                >
                  내리기
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 문의 — 답변 대기가 먼저 오도록 서버에서 정렬 */}
      <section className="mt-8">
        <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">
          문의
          {inquiries && inquiries.some((q) => !q.reply) && (
            <span className="ml-2 rounded-full bg-terracotta px-2 py-0.5 text-[11.5px] font-semibold text-cream">
              대기 {inquiries.filter((q) => !q.reply).length}
            </span>
          )}
        </h2>
        {inquiries === null ? (
          <p className="text-[13.5px] text-ink-soft">불러오는 중...</p>
        ) : inquiries.length === 0 ? (
          <p className="rounded-2xl border border-border-soft bg-paper px-4 py-8 text-center text-[13.5px] text-ink-soft">
            아직 들어온 문의가 없어요.
          </p>
        ) : (
          <div className="space-y-2.5">
            {inquiries.map((q) => (
              <div key={q.id} className="rounded-2xl border border-border-soft bg-paper p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-ink truncate">
                    {q.userName ?? q.userEmail}
                  </p>
                  <span className="text-[11.5px] text-ink-soft/60">
                    {new Date(q.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink">{q.body}</p>

                {q.reply ? (
                  <div className="mt-3 rounded-xl bg-cream-warm/60 px-3.5 py-3">
                    <p className="text-[11.5px] font-semibold text-sage-dark">답변함</p>
                    <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-ink-soft">
                      {q.reply}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3">
                    <textarea
                      value={replyDrafts[q.id] ?? ''}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      rows={3}
                      placeholder="답변을 적어주세요"
                      className="w-full resize-none rounded-xl border border-border-soft bg-cream-warm/40 px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-sage"
                    />
                    <button
                      type="button"
                      onClick={() => sendReply(q.id)}
                      disabled={replyingId === q.id || !(replyDrafts[q.id] ?? '').trim()}
                      className="mt-2 rounded-xl bg-ink px-4 py-2 text-[13px] font-semibold text-cream disabled:opacity-50"
                    >
                      {replyingId === q.id ? '보내는 중...' : '답변 보내기'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

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
