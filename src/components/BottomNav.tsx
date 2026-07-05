'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

const navItems = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/seasonal', label: '제철', icon: '🗓️' },
  { href: '/recipes', label: '레시피', icon: '🍳' },
  { href: '/community', label: '소담', icon: '📸' },
  { href: '/my', label: '마이', icon: '👤' },
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
                animate={{ scale: isActive ? 1.12 : 1, y: isActive ? -1 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="text-[20px]"
              >
                {item.icon}
              </motion.span>
              <span
                className={`text-[11.5px] ${
                  isActive ? 'text-sage font-medium' : 'text-ink-soft'
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
