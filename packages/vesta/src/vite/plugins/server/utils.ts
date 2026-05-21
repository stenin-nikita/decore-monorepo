import { promises as fsp } from 'node:fs';

import type { Manifest } from 'vite';

import type {
  BuildOptions,
  ClientOptions,
  ClientOutputOptions,
  ServerInputOptions,
  ServerOptions,
  ServerOutputOptions,
} from '../../types';

export async function readServerManifest(filePath: string) {
  try {
    const content = await fsp.readFile(filePath, 'utf8');
    const manifest = JSON.parse(content);

    return manifest as Manifest;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        `[vesta] Server manifest not found at "${filePath}". Run \`vite build\` first.`,
      );
    }

    throw err;
  }
}

export function normalizeBuildOptions(options: BuildOptions = {}) {
  const { outDir = 'build', emptyOutDir = true, hashCharacters = 'hex' } = options;

  return { outDir, emptyOutDir, hashCharacters } satisfies BuildOptions;
}

function normalizeServerInput(input: ServerInputOptions): Record<string, string> {
  if (typeof input === 'string') {
    return { main: input };
  }

  return input;
}

function resolveServerEntry(entry: string | undefined, input: Record<string, string>): string {
  const keys = Object.keys(input);

  if (keys.length === 0) {
    throw new Error('[vesta] `server.input` must define at least one entry.');
  }

  if (entry === undefined) {
    if (keys.length === 1) {
      return keys[0];
    }

    throw new Error(
      `[vesta] \`server.input\` has multiple keys (${keys.join(', ')}); set \`server.entry\` to specify which one to serve in dev and preview.`,
    );
  }

  if (!keys.includes(entry)) {
    throw new Error(
      `[vesta] \`server.entry\` "${entry}" not found in \`server.input\` keys: ${keys.join(', ')}.`,
    );
  }

  return entry;
}

function normalizeServerOutput(output: ServerOutputOptions = {}) {
  const {
    dir = 'server',
    entryFileNames = '[name].js',
    chunkFileNames = 'deps/chunk-[hash:20].js',
  } = output;

  return { dir, entryFileNames, chunkFileNames } satisfies ServerOutputOptions;
}

export function normalizeServerOptions(options: ServerOptions = {}) {
  const input = normalizeServerInput(options.input ?? 'src/server/main.ts');
  const entry = resolveServerEntry(options.entry, input);
  const output = normalizeServerOutput(options.output);

  return { entry, input, output } satisfies ServerOptions;
}

function normalizeClientOutput(output: ClientOutputOptions = {}) {
  const {
    dir = 'client',
    entryFileNames = 'static/[name].[hash:20].js',
    chunkFileNames = 'static/chunks/[name].[hash:20].js',
    assetFileNames = 'static/assets/[name].[hash:20].[ext]',
  } = output;

  return { dir, entryFileNames, chunkFileNames, assetFileNames } satisfies ClientOutputOptions;
}

export function normalizeClientOptions(options: ClientOptions = {}) {
  const { input = 'src/client/main.tsx' } = options;
  const output = normalizeClientOutput(options.output);

  return { input, output } satisfies ClientOptions;
}
