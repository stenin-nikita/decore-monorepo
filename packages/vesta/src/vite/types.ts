import type { Rolldown } from 'vite';

import type { ManifestPluginOptions } from './plugins/manifest';

type OutputOptions = Pick<
  Rolldown.OutputOptions,
  'entryFileNames' | 'chunkFileNames' | 'assetFileNames'
>;

export type ClientInputOptions = Rolldown.InputOption;

export interface ClientOutputOptions extends OutputOptions {
  /**
   * @default 'client'
   */
  dir?: string;
}

export interface ClientOptions {
  input?: ClientInputOptions;
  output?: ClientOutputOptions;
  manifest?: ManifestPluginOptions;
}

export type ServerInputOptions = Exclude<ClientInputOptions, any[]>;

export interface ServerOutputOptions extends Pick<
  OutputOptions,
  'entryFileNames' | 'chunkFileNames'
> {
  /**
   * @default 'server'
   */
  dir?: string;
}

export interface ServerOptions {
  /**
   * Key from `input` to serve in dev and preview.
   *
   * - Required when `input` is an object with multiple keys.
   * - Auto-inferred when `input` is a string (becomes `'main'`) or an object with a single key.
   */
  entry?: string;
  /**
   * @default 'src/server/main.ts'
   */
  input?: ServerInputOptions;
  output?: ServerOutputOptions;
}

export type VestaMode = 'server-only' | 'client-server';

export interface BuildOptions {
  /**
   * Root output directory. Client and server outputs are placed in subpaths inside it.
   *
   * @default 'build'
   */
  outDir?: string;
  /**
   * Whether to empty `outDir` before each build.
   *
   * @default true
   */
  emptyOutDir?: boolean;
  /**
   * Character set used for content hashes in output filenames. Shared across client and server.
   *
   * @default 'hex'
   */
  hashCharacters?: Rolldown.OutputOptions['hashCharacters'];
}

export interface VestaOptions {
  mode?: VestaMode;
  build?: BuildOptions;
  client?: ClientOptions;
  server?: ServerOptions;
}
