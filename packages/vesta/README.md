# @decore/vesta

![NPM Version](https://img.shields.io/npm/v/%40decore%2Fvesta)
![NPM Downloads](https://img.shields.io/npm/dm/%40decore%2Fvesta)
![NPM License](https://img.shields.io/npm/l/%40decore%2Fvesta)

Vite plugin for building server and SSR applications. Sets up separate client and server builds, a dev middleware, and a preview runner in one plugin call.

## Installation

```bash
npm install @decore/vesta
# or
pnpm add @decore/vesta
# or
yarn add @decore/vesta
```

Requires `vite ^8`.

## Usage

Add the plugin to your `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import vesta from '@decore/vesta/vite';

export default defineConfig({
  plugins: [vesta()],
});
```

Create a server entry at `src/server/main.ts`:

```ts
import { defineServer } from '@decore/vesta';

export default defineServer({
  async fetch(request) {
    return new Response('Hello from vesta');
  },
});

if (import.meta.hot) {
  import.meta.hot.accept();
}
```

Create a client entry at `src/client/main.tsx` (or override via `client.input`).

Then:

- `vite` — dev server with SSR middleware
- `vite build` — builds client into `build/client` and server into `build/server`
- `vite preview` — runs the built server

## Options

```ts
vesta({
  mode: 'client-server', // or 'server-only'
  build: {
    outDir: 'build',
    emptyOutDir: true,
    hashCharacters: 'hex',
  },
  client: { input: 'src/client/main.tsx' },
  server: { input: 'src/server/main.ts' },
});
```

## License

MIT
