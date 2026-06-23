/**
 * 시절소담 디자인 시스템
 *
 * 모든 UI 컴포넌트는 8pt 스페이싱 시스템과 일관된 타이포그래피 위계를 따릅니다.
 * 자세한 사용법은 README.md 참고.
 */

// ============================================
// DESIGN TOKENS
// ============================================
export { colors, spacing, radius, typography, shadow, motion, breakpoints } from './tokens';

// ============================================
// FORM CONTROLS
// ============================================
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { SearchBar } from './SearchBar';
export type { SearchBarProps } from './SearchBar';

// ============================================
// CONTAINERS
// ============================================
export { Card } from './Card';
export type { CardProps } from './Card';

export { Divider } from './Divider';
export type { DividerProps } from './Divider';

// ============================================
// TYPOGRAPHY & LABELS
// ============================================
export { Text } from './Text';
export type { TextProps } from './Text';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Overline } from './Overline';
export type { OverlineProps } from './Overline';

export { SectionTitle } from './SectionTitle';
export type { SectionTitleProps } from './SectionTitle';

// ============================================
// NAVIGATION
// ============================================
export { BottomNavigation } from './BottomNavigation';
export type { BottomNavigationProps, BottomNavItem } from './BottomNavigation';
