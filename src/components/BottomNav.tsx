'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

/** 라인 아이콘 — 이모지 대신 스트로크 SVG로 통일해 톤을 정돈 */
function NavIcon({ name, strokeWidth = 1.7 }: { name: string; strokeWidth?: number }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
      );
    case 'seasonal':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case 'recipes':
      return (
        <svg {...common}>
          <path d="M4 20V6a2 2 0 0 1 2-2h13v14H6a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h13" />
        </svg>
      );
    case 'community':
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
        </svg>
      );
    case 'my':
      return (
        <svg {...common}>
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

const navItems = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/seasonal', label: '제철', icon: 'seasonal' },
  { href: '/recipes', label: '레시피', icon: 'recipes' },
  { href: '/community', label: '소담', icon: 'community' },
  { href: '/my', label: '마이', icon: 'my' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-xl border-t border-border-soft">
      <div className="max-w-md mx-auto flex items-stretch h-16">
        {navItems.map((item) => {
          // '/recipe/[id]'(상세) 페이지에서는 '레시피' 탭이 활성화되도록 startsWith 사용
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(`${item.href}/`) ||
                (item.href === '/recipes' && pathname.startsWith('/recipe/'));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1"
            >
              <motion.span
                animate={{ scale: isActive ? 1.08 : 1, y: isActive ? -1 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className={isActive ? 'text-sage-dark' : 'text-ink-soft/70'}
              >
                <NavIcon name={item.icon} strokeWidth={isActive ? 2.2 : 1.7} />
              </motion.span>
              <span
                className={`text-[10.5px] ${
                  isActive ? 'text-sage-dark font-semibold' : 'text-ink-soft'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* iPhone safe-area */}
      <div className="h-[env(safe-area-inset-bottom)] min-h-1" />
    </nav>
  );
}
