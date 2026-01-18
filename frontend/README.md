# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Testing

This project uses [Vitest](https://vitest.dev/) for unit/integration tests and [Playwright](https://playwright.dev/) for end-to-end tests.

### Unit Tests (Vitest)

```bash
# Run tests in watch mode
bun test

# Run tests once
bun run test:run

# Run tests with UI
bun run test:ui

# Run tests with coverage
bun run test:coverage
```

Test files should be placed alongside the source files with the `.test.ts` or `.test.tsx` extension.

**Structure:**
```
src/
├── components/
│   └── ui/
│       ├── button.vitest.tsx
│       └── button.vitest.tsx    # Unit test
├── lib/
│   ├── utils.ts
│   └── utils.test.ts          # Unit test
└── test/
    └── setup.ts               # Test setup file
```

### E2E Tests (Playwright)

```bash
# Run e2e tests
bun run test:e2e

# Run e2e tests with UI
bun run test:e2e:ui

# Run e2e tests with visible browser
bun run test:e2e:headed

# Show test report
bun run test:e2e:report
```

E2E test files are located in the `e2e/` directory with the `.spec.ts` extension.

**Structure:**
```
e2e/
└── navigation.spec.ts         # E2E test
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
