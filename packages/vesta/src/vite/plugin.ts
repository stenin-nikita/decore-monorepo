import type { PluginOption } from 'vite';

import { manifestPlugin } from './plugins/manifest';
import { reactRefreshPlugin } from './plugins/react-refresh';
import { serverPlugin } from './plugins/server';
import type { VestaOptions } from './types';

export function vesta(options?: VestaOptions) {
  const plugins: PluginOption = [];

  if (options?.mode === 'client-server') {
    plugins.push(reactRefreshPlugin(), manifestPlugin(options?.client?.manifest));
  }

  plugins.push(serverPlugin(options));

  return plugins;
}
