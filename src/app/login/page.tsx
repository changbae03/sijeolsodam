'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/auth-context';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
        <h1 className="font-display text-[22px] text-ink mt-1">다시 만나서 반가워요</h1>
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
          className="w-full bg-sage text-cream rounded-xl py-3.5 text-[15px] font-medium mt-2 disabled:opacity-60"
        >
          {loading ? '로그인 중...' : '로그인'}
        </motion.button>
      </motion.form>

      <p className="text-center text-[14px] text-ink-soft mt-6">
        아직 계정이 없으신가요?{' '}
        <Link href="/signup" className="text-sage font-medium">
          회원가입
        </Link>
      </p>
    </main>
  );
}
