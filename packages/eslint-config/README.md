# @decore/eslint-config

![NPM Version](https://img.shields.io/npm/v/%40decore%2Feslint-config)
![NPM Downloads](https://img.shields.io/npm/dm/%40decore%2Feslint-config)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40decore%2Feslint-config)
![NPM License](https://img.shields.io/npm/l/%40decore%2Feslint-config)

ESLint configuration for typescript projects. Includes TypeScript, React, import rules, and Prettier integration.

## Installation

```bash
npm install --save-dev @decore/eslint-config eslint
# or
pnpm add --save-dev @decore/eslint-config eslint
# or
yarn add --dev @decore/eslint-config eslint
```

## Usage

Create an `eslint.config.js` (or `.ts`) file in your project root and export the desired configuration.

### Recommended configuration (TypeScript + Prettier)

The recommended config includes JavaScript/TypeScript rules, import sorting, and Prettier integration:

```js
// eslint.config.js
import { configs, defineConfig } from '@decore/eslint-config';

export default defineConfig(configs.recommended, {
  ignores: ['./dist'],
});
```

### React configuration

If your project uses React, import the `react` config:

```js
import { configs, defineConfig } from '@decore/eslint-config';

export default defineConfig(configs.recommended, configs.react, {
  ignores: ['./dist'],
});
```

## Development

### Building

```bash
pnpm build
```

### Linting and formatting

```bash
pnpm lint:code   # ESLint check
pnpm lint:fmt    # Prettier check
pnpm lint:ts     # TypeScript check
pnpm fmt         # Prettier formatting
```

## License

MIT
