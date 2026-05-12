# Turborepo Monorepo Transition: Best Practices & Template

## 1. Foundation & Tooling

| Category         | Vite Implementation                                                                 | Recommended for Turborepo                |
|------------------|------------------------------------------------------------------------------------|------------------------------------------|
| Node.js/Yarn     | `engines` in `package.json` (`node: 20.x`), Yarn v1 (`packageManager: yarn@1.22.22`) | Use `.nvmrc`, Yarn v4, zero-install      |
| Vite Config      | `vite.config.js` (plugins: React, SWC, etc.), build/preview scripts                 | Move Vite config to each app/package     |
| Scripts          | `dev`, `build`, `lint`, `lint:fix`, `fm:check`, `fm:fix`, clean/restart scripts     | Map to Turborepo pipeline tasks          |

---

## 2. Configuration Patterns (for `g4-ui-config`)

| Category         | Vite Implementation                                                                 | Recommended for Turborepo                |
|------------------|------------------------------------------------------------------------------------|------------------------------------------|
| TypeScript       | Present in devDeps, but no `tsconfig.json` found                                    | Centralize strict `tsconfig.base.json`   |
| Linting/Formatting| ESLint (Airbnb, Prettier, React, Import, Perfectionist, Unused Imports), Prettier  | Move configs to `g4-ui-config` package   |
| Git Hooks        | No Husky/lint-staged found                                                          | Add Husky, lint-staged, commitlint       |
| Storybook        | Not present                                                                         | Add to each UI package                   |
| Theme System     | MUI theme in `/src/theme/` (palette, typography, provider)                          | Export theme from `g4-ui-config`         |

---

## 3. UI Component Design (for `g4-core-ui`)

| Category         | Vite Implementation                                                                 | Recommended for Turborepo                |
|------------------|------------------------------------------------------------------------------------|------------------------------------------|
| Component Arch.  | Atomic/category-based structure in `/src/components/`                               | Use atomic design in `g4-core-ui`        |
| Props Design     | Not explicit, but likely follows MUI/React patterns                                 | Standardize with `VariantProps`          |
| Styling          | Emotion/MUI, theme provider in `/src/theme/`                                       | Centralize theme, use CSS-in-JS          |
| AG Grid          | MUI Data Grid used, no AG Grid wrapper found                                        | Add AG Grid wrapper in `g4-core-ui`      |
| Documentation    | No Storybook found                                                                  | Add Storybook with CSF, controls         |

---

## 4. State & Rendering Patterns (for `g4-aps-ui`)

| Category         | Vite Implementation                                                                 | Recommended for Turborepo                |
|------------------|------------------------------------------------------------------------------------|------------------------------------------|
| State Mgmt       | Custom hooks, Context API in `/src/hooks/`                                         | Use Redux Toolkit + Context API          |
| Dynamic Rendering| No DSL/JSON-based rendering found                                                  | Add JSON schema, component mapper        |
| Renderers        | Not present                                                                         | Add display/edit renderer interfaces     |
| Validation       | Zod in deps, not integrated                                                        | Integrate Yup/Zod for validation         |
| Caching          | Not present                                                                         | Add context-based caching (TTL, keys)    |

---

## 5. Monorepo Transition Checklist

```
- [x] Turbo pipeline tasks (`turbo.json`):  
    - Map Vite scripts to `dev/build/test/lint`
    - Configure caching keys (e.g., `outputs: ["dist/**"]`)
- [x] Workspace isolation:  
    - Separate `g4-ui-config` dependencies (eslint, typescript as devDeps)
    - Internal package imports (`"@highradius/g4-core-ui": "workspace:*"`)
- [x] Shared resources:  
    - Reuse Vite plugins across apps/packages
    - Centralize TS path aliases in root `tsconfig.base.json`
- [x] AG Grid theming:  
    - Verify CSS variable overrides match HiRa theme
    - Isolate enterprise license loading
- [x] DSL enhancements:  
    - Add `sysName` to JSON schema for context caching
    - Standardize variant API (`variant: "tree" | "expandable"`)
```

---

## Gap Analysis

| Gap                                   | Vite Project Status         | Required for Monorepo         |
|----------------------------------------|-----------------------------|-------------------------------|
| Commitlint/Commitizen                  | Missing                     | Add in `g4-ui-config`         |
| Husky/lint-staged                      | Missing                     | Add in root or config package |
| AG Grid wrapper                        | Missing                     | Add in `g4-core-ui`           |
| Storybook                              | Missing                     | Add in all UI packages        |
| DSL/JSON-based rendering               | Missing                     | Add in `g4-aps-ui`            |
| Centralized TS config                  | Not found                   | Add `tsconfig.base.json`      |

---

## Configuration Snippets

**Optimized `vite.config.js` (for Turborepo)**
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

**Turbo Pipeline Example (`turbo.json`)**
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": []
    }
  }
}
```

**Dynamic Component Renderer (DSL)**
```js
// Example: JSON schema for DSL-driven UI
const schema = {
  componentType: 'TextField',
  props: { label: 'Name', variant: 'outlined' },
  children: []
};
// Component mapper
function renderComponent(schema) {
  switch (schema.componentType) {
    case 'TextField':
      return <TextField {...schema.props} />;
    // ...other cases
  }
}
```

---

## Best Practices Table

| Category   | Vite Implementation   | Recommended for Turborepo           |
|------------|----------------------|-------------------------------------|
| Theming    | CSS Variables, MUI   | MUI theme provider package          |
| State      | Context API, hooks   | Redux Toolkit + Context             |
| Linting    | ESLint, Prettier     | Centralized config package          |
| Testing    | Not present          | Jest/Vitest, Storybook, E2E         |
| Docs       | README only          | Storybook, TypeDoc, README          |

---

## Summary

Your Vite project demonstrates strong component modularity, theming, and code quality practices. For Turborepo, centralize configuration, add missing quality tools (commitlint, Husky, Storybook), and introduce advanced patterns (AG Grid wrapper, DSL rendering, Redux Toolkit). Use the provided checklist and snippets to guide your monorepo transition.
