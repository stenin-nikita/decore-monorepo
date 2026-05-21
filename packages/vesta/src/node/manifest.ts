import { promises as fsp } from 'node:fs';

import type { ManifestChunk } from 'vite';

export type ManifestChunkId = string & {};

export type { ManifestChunk };

export interface Manifest<TMeta extends {} = {}> {
  buildId: string;
  builtAt: number;
  files: Record<ManifestChunkId, ManifestChunk | undefined>;
  devScripts?: string[];
  meta: TMeta;
}

export async function readManifest<TMeta extends {} = {}>(
  filePath: string,
): Promise<Manifest<TMeta>> {
  const content = await fsp.readFile(filePath, 'utf-8');

  return JSON.parse(content);
}
