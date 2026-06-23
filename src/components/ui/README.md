# 시절소담 디자인 시스템

> 자연에서 영감을 받은 따뜻하고 차분한 프리미엄 라이프스타일 미학

## 🎨 디자인 원칙

1. **여백을 두려워하지 말 것** — 잡지처럼 호흡하는 레이아웃
2. **자연의 색** — 종이(cream), 잉크(ink), 세이지(sage), 테라코타(terracotta)
3. **한글 가독성 최우선** — keep-all 줄바꿈, 자간 -0.01em
4. **8pt 시스템** — 모든 여백은 8의 배수
5. **컴포넌트 재사용** — 새로 만들지 말고 기존 것 조합

---

## 📐 8pt 스페이싱 시스템

| 토큰 | 값 | 용도 |
|---|---|---|
| `space-1` | 4px | 미세 조정 (4pt만 예외 허용) |
| `space-2` | 8px | **베이스 단위** |
| `space-3` | 12px | 작은 갭 |
| `space-4` | 16px | 카드 패딩 |
| `space-5` | 20px | 섹션 작은 간격 |
| `space-6` | 24px | 큰 패딩 |
| `space-8` | 32px | 섹션 사이 |
| `space-12` | 48px | 큰 섹션 |
| `space-16` | 64px | hero 여백 |
| `space-20` | 80px | 잡지 호흡 |

Tailwind에서: `p-2`, `mb-8`, `gap-4` 등 — 모두 4px 단위로 매핑.

---

## 🎨 컬러 팔레트

### Neutrals (95% 사용)
- `cream` `#f8f6f2` — 메인 배경
- `cream-warm` `#f2eee5` — 보조 배경
- `paper` `#fffdf9` — 카드 배경
- `ink` `#2c2a26` — 주요 텍스트
- `ink-soft` `#5a5650` — 부 텍스트
- `border-soft` `#e3ddd0` — 보더

### Accents (절제하여 사용)
- `sage` `#5b6e54` — 메인 액센트 (자연, 식물)
- `terracotta` `#c45d3a` — CTA, 강조 (5%만)

---

## ✍️ 타이포그래피 위계

| 토큰 | 크기 | 용도 |
|---|---|---|
| `display-xl` | 38px | Hero 헤드라인 |
| `display-lg` | 28px | 섹션 1차 헤드라인 |
| `display-md` | 22px | 카드 큰 제목 |
| `display-sm` | 17px | 본문 내 강조 제목 |
| `body-lg` | 15px | 본문 큰 |
| `body-md` | 14px | **베이스 본문** |
| `body-sm` | 13px | 본문 작은 |
| `caption` | 12px | 캡션, 부가정보 |
| `overline` | 11px | 우버라인, 메타 라벨 |

- **Display 폰트**: Georgia + Noto Serif KR (잡지 표지 느낌)
- **Body 폰트**: Pretendard (한글 가독성 1위)

---

## 🧱 컴포넌트

### Button
```tsx
<Button variant="primary" size="md">확인</Button>
<Button variant="secondary" size="lg" fullWidth>저장하기</Button>
<Button variant="tertiary">취소</Button>
<Button variant="ghost" size="sm">더보기</Button>
```

- **variant**: `primary` (terracotta) | `secondary` (sage) | `tertiary` (paper+border) | `ghost`
- **size**: `sm` (32px) | `md` (40px) | `lg` (48px) — 모두 8의 배수

### Card
```tsx
<Card variant="paper" padding="md">콘텐츠</Card>
<Card variant="cream" padding="lg" interactive>호버 가능한 카드</Card>
<Card variant="ink" padding="lg">짙은 CTA 카드</Card>
```

- **variant**: `paper` | `cream` | `ink`
- **padding**: `none` | `sm` (12) | `md` (16) | `lg` (24)

### Badge
```tsx
<Badge variant="sage">제철</Badge>
<Badge variant="terracotta" size="sm">신상</Badge>
<Badge variant="ink" icon="🌿">채소</Badge>
```

- **variant**: `sage` | `terracotta` | `cream` | `ink` | `paper`
- **size**: `sm` | `md`

### SearchBar
```tsx
<SearchBar
  placeholder="오늘은 무엇이 궁금하신가요?"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```

- 기본적으로 검색 SVG 아이콘 내장
- **variant**: `default` (보더 박스) | `minimal` (하단 라인만)

### Overline
```tsx
<Overline color="sage" withDivider>
  In Season Today
</Overline>
```

잡지 스타일 영문 우버라인. 모든 섹션 헤더의 통일된 톤.

### SectionTitle
```tsx
<SectionTitle
  overline="In Season Today"
  title="오늘의 제철"
  subtitle="6월, 자연이 정성을 들인 식재료들"
  withDivider
  size="lg"
/>
```

`Overline` + 헤딩 + 부제목 + 우측 액션을 한 번에.

### BottomNavigation
```tsx
<BottomNavigation
  items={[
    { id: 'home', label: '홈', icon: '🏠' },
    { id: 'seasonal', label: '제철', icon: '🌿' },
  ]}
  activeId="home"
  onSelectItem={setActive}
/>
```

- iPhone safe-area 자동 대응
- 활성 항목은 `sage` 색
- `badge`로 알림 수 표시 가능

---

## 🔄 마이그레이션 가이드

기존 컴포넌트를 작성할 때는:

1. **하드코딩된 색상 ❌** — `bg-[#fffdf9]` 대신 `bg-paper`
2. **임의 패딩 ❌** — `px-[15px]` 대신 `px-4` (16px, 8의 배수)
3. **새 우버라인 ❌** — 직접 만들지 말고 `<Overline>` 사용
4. **새 섹션 헤더 ❌** — `<SectionTitle>` 사용

---

## 🎯 사용 예시 (홈페이지 섹션)

```tsx
import { SectionTitle, Badge, Card, Button } from '@/components/ui';

<section className="mb-20">
  <SectionTitle
    overline="In Season Today"
    title="오늘의 제철"
    subtitle="자연이 정성을 들인 식재료들"
    withDivider
    size="lg"
    action={<Button variant="ghost" size="sm">더보기 →</Button>}
  />
  <div className="space-y-7 mt-7">
    {ingredients.map((ing) => (
      <Card key={ing.name} padding="none" interactive>
        ...
        <Badge variant="paper">제철</Badge>
      </Card>
    ))}
  </div>
</section>
```
