import fs, { promises as fsp } from 'node:fs';
import path from 'node:path';

import type { Plugin, ResolvedConfig } from 'vite';

export async function writeFile(filePath: string, content: string): Promise<void> {
  const dir = path.dirname(filePath);

  await fsp.mkdir(dir, { recursive: true });
  await fsp.writeFile(filePath, content, 'utf-8');
}

export function removeFile(filePath: string) {
  fs.rmSync(filePath, { force: true });
}

export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue;
    }

    const filePath = path.resolve(dir, file);

    fs.rmSync(filePath, { recursive: true, force: true });
  }
}

export function serialize(data: unknown, pretty = false): string {
  return JSON.stringify(data, null, pretty ? 2 : 0);
}

export function canSkipReactRefresh(config: ResolvedConfig) {
  const skipFastRefresh =
    config.isProduction || config.command === 'build' || config.server.hmr === false;

  return skipFastRefresh || !hasPlugin(config.plugins, 'vite:react-refresh');
}

function hasPlugin(plugins: readonly Plugin<any>[], search: string) {
  return plugins.some((plugin) => {
    return plugin.name.startsWith(search);
  });
}
