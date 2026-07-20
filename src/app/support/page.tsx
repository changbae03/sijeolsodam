'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface Inquiry {
  id: number;
  body: string;
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
}

/**
 * 문의하기 — 앱 안에서 보내고 답변도 앱 안에서 받는다.
 * 메일함을 오가지 않아도 되고, 문의 내역이 계정에 남아 이어서 볼 수 있다.
 */
export default function SupportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Inquiry[] | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch('/api/inquiries')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setItems(d?.inquiries ?? []))
      .catch(() => setItems([]));
  }, [user]);

  const submit = async () => {
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: draft }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '문의를 보내지 못했어요.');
        return;
      }
      setItems((prev) => [data.inquiry, ...(prev ?? [])]);
      setDraft('');
    } catch {
      setError('문의를 보내지 못했어요.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return null;

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-5 pt-16 text-center">
        <p className="text-[15px] text-ink">로그인하면 문의를 남길 수 있어요.</p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-5 rounded-2xl bg-ink px-6 py-3 text-[14.5px] font-semibold text-cream"
        >
          로그인하기
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-5 pt-6 pb-24">
      <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-1.5">지원</p>
      <h1 className="text-[24px] font-bold tracking-[-0.02em] text-ink">문의하기</h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
        불편한 점이나 제안을 남겨주세요. 답변이 달리면 이 화면에서 바로 확인할 수 있어요.
      </p>

      <div className="mt-5 rounded-2xl border border-border-soft bg-paper p-3.5">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          maxLength={1000}
          placeholder="어떤 점이 불편하셨나요?"
          className="w-full resize-none rounded-xl border border-border-soft bg-cream-warm/40 px-3 py-2.5 text-[14px] text-ink outline-none focus:border-sage"
        />
        {error && <p className="mt-2 text-[12.5px] text-terracotta">{error}</p>}
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[11.5px] text-ink-soft/60">{draft.length}/1000</span>
          <button
            type="button"
            onClick={submit}
            disabled={sending || draft.trim().length < 5}
            className="rounded-xl bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-cream disabled:opacity-50"
          >
            {sending ? '보내는 중...' : '문의 보내기'}
          </button>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-[16.5px] font-bold tracking-[-0.01em] text-ink">문의 내역</h2>
      {items === null ? (
        <p className="text-[14px] text-ink-soft">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-border-soft bg-paper px-5 py-10 text-center text-[13.5px] text-ink-soft">
          아직 남긴 문의가 없어요.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((q) => (
            <div key={q.id} className="rounded-2xl border border-border-soft bg-paper p-4">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                    q.reply ? 'bg-sage/15 text-sage-dark' : 'bg-ink/[0.06] text-ink-soft'
                  }`}
                >
                  {q.reply ? '답변 완료' : '답변 대기'}
                </span>
                <span className="text-[11.5px] text-ink-soft/60">
                  {new Date(q.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <p className="mt-2.5 whitespace-pre-wrap text-[14px] leading-relaxed text-ink">{q.body}</p>

              {q.reply && (
                <div className="mt-3.5 rounded-xl bg-cream-warm/60 px-3.5 py-3">
                  <p className="text-[11.5px] font-semibold text-sage-dark">시절소담 답변</p>
                  <p className="mt-1.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink-soft">
                    {q.reply}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Link href="/my" className="mt-8 inline-block text-[14px] text-sage font-medium">
        ← 마이페이지로 돌아가기
      </Link>
    </main>
  );
}
