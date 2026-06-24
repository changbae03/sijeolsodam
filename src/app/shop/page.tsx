import Link from 'next/link';
import Logo from '@/components/Logo';

export default function ShopPage() {
  return (
    <main className="max-w-md mx-auto px-5 pt-6 min-h-[70vh] flex flex-col">
      <header className="mb-6">
        <Logo size="md" />
        <h1 className="font-display text-[24px] text-ink mt-1.5 font-semibold tracking-tight">
          장보기
        </h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <span className="text-[40px] mb-4">🛒</span>
        <h2 className="font-display text-[18px] text-ink font-medium mb-2">
          장보기 기능을 준비하고 있어요
        </h2>
        <p className="text-[13px] text-ink-soft leading-relaxed">
          제철 식재료를 바로 장바구니에 담아
          <br />
          주문까지 이어지는 기능을 곧 만나보실 수 있어요.
        </p>
        <Link
          href="/seasonal"
          className="mt-6 text-[13px] text-terracotta font-medium"
        >
          그 동안 제철 달력 둘러보기 →
        </Link>
      </div>
    </main>
  );
}
