# Design System Spec (HK B2B SaaS, Carbon Comparison)

## 1) Brand Direction
- **Tone:** premium, architectural, enterprise, data-driven
- **Market Fit:** Hong Kong-native professional workflows (finance, construction, procurement)
- **Design Principle:** high information density + strong hierarchy + low visual noise

## 2) Color Tokens
Use neutral graphite as base, deep blue as trust accent, and emerald for sustainability signals.

### Core Brand
- `--color-brand-50: #F2F7FF`
- `--color-brand-100: #E3EEFF`
- `--color-brand-200: #BDD5FF`
- `--color-brand-300: #93BBFF`
- `--color-brand-400: #5F95F5`
- `--color-brand-500: #2F6FE6` (primary)
- `--color-brand-600: #2459BD`
- `--color-brand-700: #1C458F`
- `--color-brand-800: #163468`
- `--color-brand-900: #0F2342`

### Neutral / Surface
- `--color-neutral-0: #FFFFFF`
- `--color-neutral-25: #FCFDFE`
- `--color-neutral-50: #F8FAFC`
- `--color-neutral-100: #F1F5F9`
- `--color-neutral-200: #E2E8F0`
- `--color-neutral-300: #CBD5E1`
- `--color-neutral-400: #94A3B8`
- `--color-neutral-500: #64748B`
- `--color-neutral-600: #475569`
- `--color-neutral-700: #334155`
- `--color-neutral-800: #1E293B`
- `--color-neutral-900: #0F172A`

### Semantic
- `--color-success-500: #0E9F6E`
- `--color-success-100: #D9FBEA`
- `--color-warning-500: #D97706`
- `--color-warning-100: #FEF3C7`
- `--color-danger-500: #DC2626`
- `--color-danger-100: #FEE2E2`
- `--color-info-500: #0284C7`
- `--color-info-100: #E0F2FE`

### Carbon Comparison Specific
- `--color-carbon-low: #0E9F6E` (best performance)
- `--color-carbon-mid: #D97706` (watchlist)
- `--color-carbon-high: #DC2626` (high embodied carbon)
- `--color-carbon-baseline: #475569` (reference partition system)

## 3) Typography Scale
- **Font Family:** `"Inter", "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif`
- **Number/Data Font:** `"Inter", "Roboto Mono", monospace` (for dense metrics/tables)
- **Line-height policy:** tighter on headings, relaxed on body text

### Scale Tokens
- `--text-xs: 12px / 16px` (meta labels)
- `--text-sm: 14px / 20px` (body-secondary)
- `--text-base: 16px / 24px` (default body)
- `--text-lg: 18px / 28px` (large body)
- `--text-xl: 20px / 30px` (section lead)
- `--text-2xl: 24px / 32px` (page heading)
- `--text-3xl: 30px / 38px` (dashboard hero metric)

### Font Weights
- `--font-regular: 400`
- `--font-medium: 500`
- `--font-semibold: 600`
- `--font-bold: 700`

## 4) Spacing Scale (4pt grid)
- `--space-0: 0`
- `--space-1: 4px`
- `--space-2: 8px`
- `--space-3: 12px`
- `--space-4: 16px`
- `--space-5: 20px`
- `--space-6: 24px`
- `--space-8: 32px`
- `--space-10: 40px`
- `--space-12: 48px`
- `--space-16: 64px`

### Practical Usage
- Form/control gap: `space-3` or `space-4`
- Card padding: `space-5` desktop, `space-4` compact
- Section spacing: `space-8` to `space-12`

## 5) Radius Scale
- `--radius-none: 0`
- `--radius-sm: 6px`
- `--radius-md: 10px`
- `--radius-lg: 14px`
- `--radius-xl: 18px`
- `--radius-pill: 9999px`

Recommendation: enterprise tables/forms use `sm`/`md`; marketing-like highlight cards use `lg`.

## 6) Shadows
- `--shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.06)`
- `--shadow-sm: 0 2px 6px rgba(15, 23, 42, 0.08)`
- `--shadow-md: 0 8px 24px rgba(15, 23, 42, 0.12)`
- `--shadow-lg: 0 16px 40px rgba(15, 23, 42, 0.16)`
- `--shadow-focus: 0 0 0 3px rgba(47, 111, 230, 0.30)`

Use mostly `xs`/`sm`; reserve `md` for elevated panels, keep `lg` rare.

## 7) Button Variants
Base button: medium weight, compact height, strong focus ring, consistent disabled state.

- `btn-primary`
  - bg: `brand-500`, text: white
  - hover: `brand-600`, active: `brand-700`
  - use: primary actions (`Compare`, `Generate Report`)
- `btn-secondary`
  - bg: `neutral-100`, text: `neutral-800`, border: `neutral-300`
  - hover: `neutral-200`
  - use: secondary workflow actions
- `btn-ghost`
  - bg: transparent, text: `neutral-700`
  - hover: `neutral-100`
  - use: low-emphasis toolbar actions
- `btn-danger`
  - bg: `danger-500`, text: white
  - hover: `#B91C1C`
  - use: destructive actions
- `btn-success`
  - bg: `success-500`, text: white
  - hover: `#0B7A55`
  - use: confirm/approve

States:
- disabled: reduce contrast (`opacity: 0.5`) + no shadow
- focus-visible: `shadow-focus`

## 8) Card Variants
- `card-default`
  - bg: `neutral-0`, border: `neutral-200`, shadow: `shadow-xs`, radius: `radius-md`
  - use: general data modules
- `card-metric`
  - bg: `neutral-0`, border-left: `4px brand-500`, shadow: `shadow-sm`
  - use: KPI/stat snapshots
- `card-comparison`
  - bg gradient: `neutral-0` to `neutral-25`, border: `neutral-300`
  - use: side-by-side partition system comparisons
- `card-alert`
  - bg: `warning-100` or `danger-100`, border: matching `*-500` at 20% opacity
  - use: risk/exception messaging

## 9) Status Badge Styles
Small, compact, high-legibility badge system for dashboards and tables.

- `badge-success` (`Passed`, `Optimized`, `Low Carbon`)
  - bg: `success-100`, text: `success-500`
- `badge-warning` (`Review`, `Medium Carbon`)
  - bg: `warning-100`, text: `warning-500`
- `badge-danger` (`Exceeded`, `High Carbon`)
  - bg: `danger-100`, text: `danger-500`
- `badge-info` (`In Progress`)
  - bg: `info-100`, text: `info-500`
- `badge-neutral` (`Draft`, `Baseline`)
  - bg: `neutral-100`, text: `neutral-700`

Badge sizing:
- height `20-22px`, horizontal padding `8-10px`, text `12px/16px`, radius `pill`

## 10) Tailwind Implementation Notes (v4-ready)
Define tokens in `@theme` and map semantic utilities for fast UI composition.

Suggested naming:
- Colors: `bg-brand-500`, `text-neutral-700`, `border-neutral-200`
- Spacing: `p-4`, `gap-3`, `space-y-5`
- Radius: `rounded-md`, `rounded-lg`, `rounded-full`
- Shadows: `shadow-xs`, `shadow-sm`, `shadow-md`

Recommended component classes:
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`
- `.card`, `.card-metric`, `.card-comparison`, `.card-alert`
- `.badge`, `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`, `.badge-neutral`
