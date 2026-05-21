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

export function getImportedChunks(
  manifest: Manifest,
  name: string,
  seen = new Set<string>(),
): ManifestChunk[] {
  function getChunks(chunk?: ManifestChunk): ManifestChunk[] {
    const chunks: ManifestChunk[] = [];

    if (!chunk) {
      return chunks;
    }

    for (const file of chunk.imports ?? []) {
      const importee = manifest.files[file];

      if (!importee || seen.has(file)) {
        continue;
      }

      seen.add(file);

      if (importee) {
        chunks.push(...getChunks(importee));
        chunks.push(importee);
      }
    }

    return chunks;
  }

  return getChunks(manifest.files[name]);
}

export async function readManifest<TMeta extends {} = {}>(
  filePath: string,
): Promise<Manifest<TMeta>> {
  const content = await fsp.readFile(filePath, 'utf-8');

  return JSON.parse(content);
}
