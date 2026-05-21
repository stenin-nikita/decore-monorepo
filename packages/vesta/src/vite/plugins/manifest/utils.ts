import crypto from 'node:crypto';
import path from 'node:path';

import type { ResolvedConfig, Rolldown, Manifest as ViteManifest } from 'vite';

import type { Manifest, ManifestChunk } from '../../../node/manifest';
import { ViteEnvironmentName } from '../../constants';
import { canSkipReactRefresh } from '../../utils';
import { DevScripts } from './constants';

export interface ManifestContext {
  config: ResolvedConfig;
  bundle?: Rolldown.OutputBundle;
  generateBuildId: () => string | null | Promise<string | null>;
  transform?: (manifest: Manifest, config: ResolvedConfig) => Manifest | Promise<Manifest>;
}

export async function generateManifest<TMeta extends {} = {}>(context: ManifestContext) {
  const { config, bundle, transform } = context;

  const buildId = config.isProduction ? await generateBuildId(context.generateBuildId) : 'dev';
  const builtAt = Date.now();
  const files = bundle ? resolveFilesFromBundle(config, bundle) : resolveFilesFromInput(config);

  const manifest: Manifest<TMeta> = {
    buildId,
    builtAt,
    files,
    meta: {} as TMeta,
  };

  if (!bundle) {
    manifest.devScripts = resolveDevScripts(config);
  }

  if (typeof transform === 'function') {
    return transform(manifest, config);
  }

  return manifest;
}

export function resolveManifestPath(config: ResolvedConfig, fileName: string) {
  const ssrEnvironment = config.environments[ViteEnvironmentName.SSR];

  return path.join(ssrEnvironment.build.outDir, fileName);
}

function resolveDevScripts(config: ResolvedConfig) {
  const scripts: string[] = [];

  if (!canSkipReactRefresh(config)) {
    scripts.push(DevScripts.REACT_REFRESH);
  }

  scripts.push(DevScripts.VITE_CLIENT);

  return scripts;
}

function toNamedInput(rootDir: string, input: Rolldown.InputOption = {}): Record<string, string> {
  const entries = typeof input === 'string' ? [input] : input;

  if (!Array.isArray(entries)) {
    return entries;
  }

  const result: Record<string, string> = {};

  for (const entry of entries) {
    const parsed = path.parse(entry);
    const filePath = path.resolve(rootDir, entry);

    result[parsed.name] = path.relative(rootDir, filePath);
  }

  return result;
}

function resolveFilesFromInput(config: ResolvedConfig) {
  const clientEnv = config.environments[ViteEnvironmentName.CLIENT];
  const entrypoints = toNamedInput(config.root, clientEnv.build.rolldownOptions.input);
  const files: Record<string, ManifestChunk> = {};

  for (const [name, entry] of Object.entries(entrypoints)) {
    files[entry] = {
      name,
      isEntry: true,
      file: entry,
      src: entry,
    };
  }

  return files;
}

function resolveFilesFromBundle(config: ResolvedConfig, bundle: Rolldown.OutputBundle) {
  const build = config.environments[ViteEnvironmentName.CLIENT].build;
  const outPath = build.manifest === true ? '.vite/manifest.json' : build.manifest;

  if (typeof outPath !== 'string') {
    throw new Error('Manifest path must be a string');
  }

  const asset = bundle[outPath];

  if (!asset || asset.type !== 'asset') {
    throw new Error('Manifest asset not found');
  }

  const viteManifest = JSON.parse(asset.source.toString()) as ViteManifest;

  return viteManifest;
}

async function generateBuildId(generate: () => string | null | Promise<string | null>) {
  const buildId = await generate();

  if (!buildId) {
    return crypto.randomBytes(6).toString('hex');
  }

  return buildId;
}
