'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/auth-context';
import Logo from '@/components/Logo';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 카카오 콜백에서 ?error= 로 돌아온 경우 그대로 보여줌
  const [error, setError] = useState(searchParams.get('error') ?? '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || '로그인에 실패했어요.');
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center mb-10"
      >
        <Logo size="sm" />
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-ink mt-5">다시 만나서 반가워요</h1>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        onSubmit={handleSubmit}
        className="space-y-3.5"
      >
        <motion.input
          whileFocus={{ scale: 1.01, borderColor: '#5B6E54' }}
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-paper border border-border-soft rounded-xl px-4 py-3.5 text-[15px] outline-none"
        />
        <motion.input
          whileFocus={{ scale: 1.01, borderColor: '#5B6E54' }}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-paper border border-border-soft rounded-xl px-4 py-3.5 text-[15px] outline-none"
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[14px] text-terracotta"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-cream rounded-2xl py-3.5 text-[15px] font-semibold mt-2 disabled:opacity-60"
        >
          {loading ? '로그인 중...' : '로그인'}
        </motion.button>
      </motion.form>

      {/* 소셜 로그인 */}
      <div className="flex items-center gap-3 my-6">
        <span className="h-px flex-1 bg-border-soft" />
        <span className="text-[12px] text-ink-soft/60">또는</span>
        <span className="h-px flex-1 bg-border-soft" />
      </div>
      <motion.a
        whileTap={{ scale: 0.97 }}
        href="/api/auth/kakao"
        className="flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[#FEE500] text-[15px] font-semibold text-[#191600]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3C6.48 3 2 6.54 2 10.9c0 2.8 1.86 5.26 4.66 6.66-.2.76-.75 2.78-.86 3.21-.13.53.2.52.41.38.17-.11 2.68-1.82 3.77-2.56.65.1 1.33.15 2.02.15 5.52 0 10-3.54 10-7.84S17.52 3 12 3Z" />
        </svg>
        카카오로 시작하기
      </motion.a>

      <p className="text-center text-[14px] text-ink-soft mt-6">
        아직 계정이 없으신가요?{' '}
        <Link href="/signup" className="text-sage font-medium">
          회원가입
        </Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  // useSearchParams는 Suspense 경계가 필요 (Next.js 정적 렌더 규칙)
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
