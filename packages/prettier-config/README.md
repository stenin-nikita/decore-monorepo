# @decore/prettier-config

A comprehensive Prettier configuration package for modern TypeScript and React projects with intelligent import sorting and consistent code formatting.

## Installation

```bash
npm install --save-dev @decore/prettier-config prettier
# or
pnpm add --save-dev @decore/prettier-config prettier
# or
yarn add --dev @decore/prettier-config prettier
```

## Usage

### Basic Usage

Add to your `prettier.config.js`:

```javascript
import { configs, defineConfig } from '@decore/prettier-config';

export default defineConfig(configs.recommended);
```

Or in `package.json`:

```json
{
  "prettier": "@decore/prettier-config"
}
```

### Available Configurations

The package exports the following configurations:

- `configs.recommended` - The default recommended configuration
- `ImportModuleType` - Constants for import order groups:
  - `BUILTIN` - Node.js built-in modules
  - `THIRD_PARTY` - Third-party packages
  - `RELATIVE` - Relative imports
  - `IMAGE` - Image file imports
  - `STYLE` - Style file imports

## Configuration Details

### Default Settings

- **Print Width**: 100 characters
- **Tab Width**: 2 spaces
- **Semicolons**: true
- **Single Quotes**: true
- **Trailing Commas**: "all"
- **Arrow Parens**: "always"
- **End of Line**: "lf"

### Import Order

The default import order organizes imports into these groups:

1. Built-in Node.js modules
2. React and React DOM
3. Third-party packages
4. Scoped packages (`@scope/package`)
5. Aliases (`@/path`)
6. Relative imports
7. Image imports
8. Style imports

## Examples

### Basic Configuration File

```javascript
// prettier.config.js
import config from '@decore/prettier-config';

export default config;
```

### Custom Import Order

```javascript
// prettier.config.js
import { configs, defineConfig ImportModuleType } from '@decore/prettier-config';

export default defineConfig({
  ...configs.recommended,
  importOrder: [
    ImportModuleType.BUILTIN,
    '',
    '^react$',
    ImportModuleType.THIRD_PARTY,
    '^@my-org/',
    '',
    '^@/',
    '',
    ImportModuleType.RELATIVE,
  ],
});
```

## Development

### Building

```bash
pnpm run build
```

## License

MIT
