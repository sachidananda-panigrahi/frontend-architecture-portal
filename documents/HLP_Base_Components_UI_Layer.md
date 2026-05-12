# High-Level Plan (HLP) — Base Components & `@highradius/ui`

**Document Type:** High-Level Plan (HLP)
**Owner:** Platform / UI Team
**Target Repository:** `ui-nexus` (monorepo)
**Target Package (internal):** `packages/base-components`
**Target Package (published):** `@highradius/ui`
**Timeline:** 8 Weeks — H2 2025
**Status:** Planning

---

## 1. Why This Plan Exists

HighRadius frontend runs on a strict four-repository dependency chain:

```
untitled-ui  →  ui-nexus (monorepo)  →  next-js-boilerplate  →  record-to-report
```

Inside `ui-nexus`, a package called `base-components` acts as the one and only bridge between the unmodified Untitled UI component library (`@highradius/untitledui`) and all HighRadius product teams.

**The problem today:**
Without a structured `base-components` package, each product team imports Untitled UI components directly, scatters HiRa brand color overrides across multiple files, and makes every Untitled UI upgrade painful and risky.

**What this plan delivers:**
A production-ready `base-components` package — wrapping every Untitled UI component with HiRa brand tokens — published automatically as `@highradius/ui` so all product teams consume a single, stable, versioned package.

---

## 2. Architectural Position

```
@highradius/untitledui       ← vendored, never modified directly
         ↓
packages/base-components     ← THIS PLAN (internal, private to ui-nexus)
         ↓
@highradius/ui               ← published public package, re-exports base-components
         ↓
@highradius/shell  ·  @highradius/data-table  ·  @highradius/forms   ← platform layer
         ↓
record-to-report  ·  future product apps                              ← consumers
```

### Hard Rules (Enforced by Turborepo + Knip + CI)

| Rule | Details |
|---|---|
| Only `base-components` imports `@highradius/untitledui` | No other package in ui-nexus or downstream may import it |
| Product teams import `@highradius/ui` only | Never `@highradius/untitledui` or `@highradius/base-components` directly |
| No business logic in the UI workspace | No Zustand, no API calls, no routing in base-components or @highradius/ui |
| HiRa token classes only | No hardcoded hex color values in any component file |

---

## 3. HiRa Design Token Reference

All components use Tailwind CSS classes that reference HiRa CSS custom properties from `@highradius/tailwind-config`:

| Token Class | Color Value | Primary Use |
|---|---|---|
| `bg-hira-600` / `bg-brand-600` | `#1a3fe9` | Primary button fill |
| `hover:bg-hira-700` | `#152fd6` | Primary button hover state |
| `bg-hira-50` | `#eef4ff` | Ghost/outline hover surface |
| `hira-500` | `#3262f4` | Focus rings, active borders |
| `hira-100` | `#d9e7ff` | Light accent backgrounds |
| `hira-900` | `#0a1628` | Dark heading text |
| `hira-950` | `#060d1a` | Darkest background (dark mode) |

Both `hira-*` and `brand-*` class names work — `hira-*` is an alias kept for backward compatibility.

---

## 4. Phase 1 — Package Foundation (Weeks 1–2)

### 4.1 Create the `base-components` Package

**Location:** `ui-nexus/packages/base-components/`

**Folder structure:**

```
packages/base-components/
├── src/
│   ├── lib/
│   │   └── cn.ts            ← shared tailwind-merge + clsx utility
│   ├── button/
│   │   ├── Button.tsx
│   │   └── index.ts
│   ├── input/
│   │   └── Input.tsx
│   ├── ... (one folder per component)
│   └── index.ts             ← barrel: re-exports every component
├── package.json             ← private: true (not published directly)
├── tsconfig.json            ← extends @highradius/tsconfig/library
└── vite.config.ts           ← vite library mode, entry = src/index.ts
```

**Key `package.json` settings:**

```json
{
  "name": "@highradius/base-components",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "dependencies": {
    "@highradius/untitledui": "workspace:*",
    "@highradius/tokens": "workspace:*",
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^3.5.0",
    "clsx": "^2.1.0"
  }
}
```

### 4.2 Create the `@highradius/ui` Public Re-Export Package

**Location:** `ui-nexus/packages/ui/core/`

This package contains no source components. It is a thin re-export barrel only:

```typescript
// packages/ui/core/src/index.ts
export * from '@highradius/base-components';
```

Product teams pin to `@highradius/ui` semver. Internal restructuring of `base-components` never breaks their imports.

### 4.3 Shared Utility: `cn()`

```typescript
// packages/base-components/src/lib/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

All components use this to merge HiRa variant classes with any `className` prop passed by the consumer.

### 4.4 Turborepo Build Order

Update `turbo.json` to enforce this resolution sequence:

```
@highradius/tsconfig
  → @highradius/tailwind-config
    → @highradius/tokens
      → @highradius/untitledui
        → base-components
          → @highradius/ui
            → platform packages (@highradius/shell, @highradius/data-table, etc.)
```

---

## 5. Phase 2 — Component Build (Weeks 3–6)

### 5.1 The Wrapping Pattern

Every component follows this exact three-step pattern:

1. Import the Untitled UI base component and its prop types
2. Define HiRa-specific variants with CVA (Class Variance Authority)
3. Export a new component that extends the original props and merges HiRa classes

**Example — Button component:**

```typescript
// packages/base-components/src/button/Button.tsx
import { Button as UntitledButton } from '@highradius/untitledui';
import type { ButtonProps as UntitledButtonProps } from '@highradius/untitledui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const buttonVariants = cva('', {
  variants: {
    hiraVariant: {
      brand:        'bg-hira-600 hover:bg-hira-700 text-white border-transparent focus-visible:ring-hira-500',
      brandOutline: 'border border-hira-600 text-hira-600 hover:bg-hira-50 bg-transparent',
      brandGhost:   'text-hira-600 hover:bg-hira-50 border-transparent',
      destructive:  'bg-red-600 hover:bg-red-700 text-white border-transparent',
    },
    hiraSize: {
      xs: 'h-7 px-2.5 text-xs',
      sm: 'h-8 px-3   text-sm',
      md: 'h-9 px-4   text-sm',
      lg: 'h-10 px-5  text-base',
    },
  },
  defaultVariants: {
    hiraVariant: 'brand',
    hiraSize: 'md',
  },
});

export interface ButtonProps
  extends UntitledButtonProps,
    VariantProps<typeof buttonVariants> {}

export function Button({ hiraVariant, hiraSize, className, ...props }: ButtonProps) {
  return (
    <UntitledButton
      className={cn(buttonVariants({ hiraVariant, hiraSize }), className)}
      {...props}
    />
  );
}
```

**Coding rules for every component:**
- Props interface always extends the corresponding Untitled UI prop type — no duplicated prop definitions.
- `hiraVariant` and `hiraSize` are the only HiRa-specific additions to props.
- `className` is always accepted and merged via `cn()` so consumers can add one-off overrides.
- No `React.FC`. Named function exports only. No default exports.
- No hardcoded hex values anywhere.

### 5.2 Component Set — Delivery Groups

**Group A — Core Interactive (Weeks 3–4)**

| Component | Untitled UI Base | HiRa Variants Added |
|---|---|---|
| `Button` | `Button` | brand, brandOutline, brandGhost, destructive · xs/sm/md/lg sizes |
| `Input` | `Input` | default, error, success — hira focus ring and border states |
| `Select` | `Select` | single and multi-select, consistent height with Input |
| `Checkbox` | `Checkbox` | hira-600 checked fill, focus ring |
| `RadioGroup` | `RadioGroup` | hira-600 selected state |
| `Switch` | `Switch` | hira-600 on-state |
| `Badge` | `Badge` | brand, neutral, success, warning, error |
| `Chip` | Compose from Badge + icon | removable and non-removable variants |

**Group B — Overlay and Feedback (Week 4)**

| Component | Untitled UI Base | HiRa Variants Added |
|---|---|---|
| `Modal` | `Dialog` | sm, md, lg width; hira-tinted backdrop |
| `Toast` | `Toast` | info, success, warning, error |
| `Tooltip` | `Tooltip` | dark, light |
| `Spinner` | `Spinner` | hira-600 track; xs/sm/md/lg sizes |
| `Alert` | `Alert` | info, success, warning, error with hira palette |

**Group C — Navigation and Layout (Weeks 5–6)**

| Component | Untitled UI Base | HiRa Variants Added |
|---|---|---|
| `Tabs` | `Tabs` | underline, pill, enclosed |
| `Accordion` | `Accordion` | flush, bordered |
| `Avatar` | `Avatar` | xs/sm/md/lg; initials fallback in hira palette |
| `Card` | div wrapper | default, flat, elevated |
| `Breadcrumb` | `Breadcrumb` | slash separator, chevron separator |
| `Pagination` | `Pagination` | hira-600 active page highlight |

**Group D — Form Helpers (Week 6)**

| Component | Untitled UI Base | HiRa Variants Added |
|---|---|---|
| `FormField` | Wrapper | standard, compact layouts |
| `Label` | `Label` | required asterisk shown in hira-600 |
| `HelpText` | `p` | default, error, hint |
| `DatePicker` | `DatePicker` | hira focus ring, calendar header in hira-600 |
| `SearchInput` | `Input` + search icon | clearable, debounced emit |

### 5.3 Barrel Export

`src/index.ts` grows one line per component added:

```typescript
export { Button } from './button/Button';
export type { ButtonProps } from './button/Button';

export { Input } from './input/Input';
export type { InputProps } from './input/Input';

// ... repeated for all 25 components
```

---

## 6. Phase 3 — Quality Gates (Weeks 5–6, parallel with Groups C and D)

### 6.1 Vitest Unit Tests

Every component gets a `*.test.tsx` file in its own folder. Minimum coverage: **80% per component**.

```typescript
// src/button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders with brand variant by default', () => {
  render(<Button>Save</Button>);
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
});

test('applies brandOutline classes when hiraVariant="brandOutline"', () => {
  const { container } = render(<Button hiraVariant="brandOutline">Cancel</Button>);
  expect(container.firstChild).toHaveClass('border-hira-600');
});
```

Run command: `pnpm vitest --project base-components`

### 6.2 Visual Regression (Playwright)

Run against the Storybook dev server. Every component story has a screenshot baseline committed to the repository. CI fails the PR if a new rendering diff is detected — catches broken HiRa variants before they reach product apps.

```typescript
// apps/storybook/tests/button.spec.ts
test('Button — brand variant', async ({ page }) => {
  await page.goto('/iframe.html?id=button--brand');
  await expect(page).toHaveScreenshot('button-brand.png');
});

test('Button — brandOutline variant', async ({ page }) => {
  await page.goto('/iframe.html?id=button--brand-outline');
  await expect(page).toHaveScreenshot('button-brand-outline.png');
});
```

### 6.3 Bundle Size Gate

After every PR, CI checks gzip size of `dist/index.js`:

| Limit | Value | Action if exceeded |
|---|---|---|
| Per component (individual import) | < 3 KB gzip | CI blocks merge |
| Full barrel (all components) | < 100 KB gzip | CI blocks merge |

### 6.4 TypeScript Strict Mode Gate

```bash
pnpm tsc --noEmit --project packages/base-components/tsconfig.json
```

Zero type errors required to merge. No use of `any` in component files.

### 6.5 Accessibility Check

Each component story is checked with `@axe-core/playwright` to catch missing ARIA attributes and HiRa color-contrast violations before any publish.

---

## 7. Phase 4 — Storybook Documentation (Week 7)

Storybook lives at `apps/storybook/` inside `ui-nexus`. It imports from `@highradius/ui` (not from `base-components` directly) to validate the full consumer import path.

**Required stories per component:**

| Story | What it shows |
|---|---|
| One story per `hiraVariant` | Correct color and style for each brand variant |
| All sizes | xs, sm, md, lg in a single grid |
| Disabled state | How the component appears and behaves when disabled |
| Focus state | Keyboard-navigated focus ring in hira-500 |

**Example story file:**

```typescript
// apps/storybook/src/stories/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@highradius/ui';

const meta: Meta<typeof Button> = {
  title: 'Base / Button',
  component: Button,
  argTypes: {
    hiraVariant: { control: 'select', options: ['brand', 'brandOutline', 'brandGhost', 'destructive'] },
    hiraSize:    { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
};
export default meta;

export const Brand: StoryObj<typeof Button>        = { args: { hiraVariant: 'brand',        children: 'Save changes' } };
export const BrandOutline: StoryObj<typeof Button> = { args: { hiraVariant: 'brandOutline', children: 'Cancel' } };
export const BrandGhost: StoryObj<typeof Button>   = { args: { hiraVariant: 'brandGhost',   children: 'Discard' } };
export const Destructive: StoryObj<typeof Button>  = { args: { hiraVariant: 'destructive',  children: 'Delete record' } };
```

---

## 8. Phase 5 — Publishing Pipeline (Weeks 7–8)

### 8.1 Semantic Release Configuration

Placed in `packages/ui/core/.releaserc.json`:

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github"
  ]
}
```

**Automatic version bumps:**

| Commit prefix | Version bump | Example |
|---|---|---|
| `fix:` | Patch — 1.0.0 → 1.0.1 | Fix Button focus ring gap |
| `feat:` | Minor — 1.0.0 → 1.1.0 | Add Chip component |
| `feat!:` or `BREAKING CHANGE:` | Major — 1.0.0 → 2.0.0 | Remove hiraVariant "brand2" |

### 8.2 What Gets Published vs. What Stays Internal

| Package | Published? | Why |
|---|---|---|
| `@highradius/base-components` | No (`private: true`) | Internal implementation detail of ui-nexus |
| `@highradius/ui` | Yes — private registry | Stable public API for all product teams |
| `@highradius/tokens` | Yes — private registry | CSS variables consumed by product apps |
| `@highradius/icons` | Yes — private registry | Tree-shakeable icon set |

### 8.3 Dependabot Automation

`record-to-report` and all future product apps configure Dependabot to watch `@highradius/ui`. When a new version is published, Dependabot automatically opens an update PR. CodeRabbit reviews the diff. If Vitest and Playwright tests pass, the PR is eligible for auto-merge.

---

## 9. Complete File Structure

```
ui-nexus/
├── packages/
│   │
│   ├── config/
│   │   ├── tsconfig/                → @highradius/tsconfig
│   │   ├── tailwind-config/         → @highradius/tailwind-config  (HiRa tokens)
│   │   ├── oxlint-config/           → @highradius/oxlint-config
│   │   ├── commitlint-config/       → @highradius/commitlint-config
│   │   └── lefthook-config/         → @highradius/lefthook-config
│   │
│   ├── base-components/             ← BUILT IN THIS PLAN (private, internal)
│   │   ├── src/
│   │   │   ├── lib/cn.ts
│   │   │   ├── button/Button.tsx + Button.test.tsx
│   │   │   ├── input/Input.tsx + Input.test.tsx
│   │   │   ├── select/Select.tsx + Select.test.tsx
│   │   │   ├── checkbox/Checkbox.tsx
│   │   │   ├── radio/RadioGroup.tsx
│   │   │   ├── switch/Switch.tsx
│   │   │   ├── badge/Badge.tsx
│   │   │   ├── chip/Chip.tsx
│   │   │   ├── modal/Modal.tsx
│   │   │   ├── toast/Toast.tsx
│   │   │   ├── tooltip/Tooltip.tsx
│   │   │   ├── spinner/Spinner.tsx
│   │   │   ├── alert/Alert.tsx
│   │   │   ├── tabs/Tabs.tsx
│   │   │   ├── accordion/Accordion.tsx
│   │   │   ├── avatar/Avatar.tsx
│   │   │   ├── card/Card.tsx
│   │   │   ├── breadcrumb/Breadcrumb.tsx
│   │   │   ├── pagination/Pagination.tsx
│   │   │   ├── form-field/FormField.tsx
│   │   │   ├── label/Label.tsx
│   │   │   ├── help-text/HelpText.tsx
│   │   │   ├── date-picker/DatePicker.tsx
│   │   │   ├── search-input/SearchInput.tsx
│   │   │   └── index.ts             ← barrel export
│   │   ├── package.json             ← private: true
│   │   └── tsconfig.json
│   │
│   ├── ui/
│   │   ├── core/                    → @highradius/ui (PUBLISHED — re-exports base-components)
│   │   ├── icons/                   → @highradius/icons
│   │   └── tokens/                  → @highradius/tokens
│   │
│   └── platform/
│       ├── shell/                   → @highradius/shell
│       ├── data-table/              → @highradius/data-table
│       ├── forms/                   → @highradius/forms
│       ├── state/                   → @highradius/state
│       └── api-client/              → @highradius/api-client
│
├── apps/
│   └── storybook/                   ← Internal docs — not published
│       └── src/stories/
│           ├── Button.stories.tsx
│           ├── Input.stories.tsx
│           └── ... (one file per component)
│
├── turbo.json
└── pnpm-workspace.yaml
```

---

## 10. Critical Files to Create or Modify

| File | Action | Purpose |
|---|---|---|
| `packages/base-components/package.json` | Create | Package identity, private flag, peer deps, exports map |
| `packages/base-components/src/lib/cn.ts` | Create | Shared merge utility used by all components |
| `packages/base-components/src/index.ts` | Create | Barrel — grows one export line per component |
| `packages/base-components/src/button/Button.tsx` | Create | First component, establishes the wrapping pattern |
| `packages/base-components/src/*/*.test.tsx` | Create | Unit tests for each component (25 total) |
| `packages/ui/core/src/index.ts` | Create/Update | Public re-export of base-components |
| `packages/ui/core/package.json` | Create/Update | Published as @highradius/ui with exports map |
| `turbo.json` | Update | Add base-components to pipeline with correct dependsOn |
| `apps/storybook/src/stories/*.stories.tsx` | Create | One story file per component (25 total) |
| `apps/storybook/tests/*.spec.ts` | Create | Visual regression test per component |
| `.github/workflows/release.yml` | Update | Wire Semantic Release for @highradius/ui |

---

## 11. Verification Checklist

**After Phase 1 (Foundation):**
- [ ] `pnpm turbo build --filter=@highradius/base-components` produces `dist/index.js` with zero errors
- [ ] `pnpm turbo build --filter=@highradius/ui` re-exports cleanly
- [ ] Importing `@highradius/untitledui` anywhere outside `base-components/src/` triggers a Turborepo boundary error

**After Phase 2 (Component Build):**
- [ ] Import `Button` from `@highradius/ui` in a test Next.js page — hira-600 background renders correctly
- [ ] All 25 components render in the Storybook dev server with correct HiRa colours

**After Phase 3 (Quality Gates):**
- [ ] `pnpm vitest run` — all tests green, coverage ≥ 80% for every component
- [ ] `pnpm playwright test` — all visual regression screenshots match baseline
- [ ] `pnpm tsc --noEmit` — zero TypeScript errors
- [ ] Bundle size report — `dist/index.js` gzip ≤ 100 KB total

**After Phase 4 (Storybook):**
- [ ] All variant stories render correctly in both light mode and dark mode
- [ ] `@axe-core` report shows zero accessibility violations

**After Phase 5 (Publishing):**
- [ ] Merge a `feat: add Chip component` commit to `main`
- [ ] Semantic Release bumps `@highradius/ui` to the correct new minor version
- [ ] Dependabot opens an update PR in `record-to-report` within 10 minutes of the publish

---

## 12. Delivery Timeline

| Week | Deliverable |
|---|---|
| Week 1 | Package scaffold, `cn` utility, Turborepo pipeline wiring, token integration verified |
| Week 2 | Group A — Button, Input, Select, Checkbox, RadioGroup, Switch, Badge, Chip |
| Week 3 | Group B — Modal, Toast, Tooltip, Spinner, Alert |
| Week 4 | Group C — Tabs, Accordion, Avatar, Card, Breadcrumb, Pagination |
| Week 5 | Group D — FormField, Label, HelpText, DatePicker, SearchInput |
| Week 6 | Vitest unit tests for all groups, visual regression baselines, bundle size gate active |
| Week 7 | Storybook stories for all 25 components, accessibility audit complete |
| Week 8 | Semantic Release pipeline live, Dependabot wired, record-to-report smoke test passed |

---

## 13. Success Criteria

| Criterion | Target |
|---|---|
| Component coverage | 25 components wrapped with HiRa variants |
| Import boundary | Zero direct `@highradius/untitledui` imports outside `base-components/src/` |
| Public API | `@highradius/ui` is the only import path used by platform packages and product apps |
| Unit test coverage | ≥ 80% per component |
| Visual regression | All stories pass in light mode and dark mode |
| Bundle size | ≤ 100 KB gzip for the full barrel |
| Type safety | TypeScript strict mode — zero errors |
| Release automation | Semantic Release publishes on every merge to `main` |
| Consumer automation | Dependabot update PR in `record-to-report` within 10 minutes of publish |
