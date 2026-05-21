import { perEnvironmentPlugin } from 'vite';
import { exactRegex } from '@rolldown/pluginutils';

import { canSkipReactRefresh } from '../../utils';

const REACT_REFRESH_ID = '/@vesta/react-refresh';
const REACT_REFRESH_VIRTUAL_ID = `\0${REACT_REFRESH_ID}`;
const REACT_REFRESH_INSTALL_FRAGMENT = `import RefreshRuntime from '__BASE__@react-refresh';
if (!window.__vite_plugin_react_preamble_installed__) {
  RefreshRuntime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type) => type;
  window.__vite_plugin_react_preamble_installed__ = true;
} else {
  console.error('@vesta/react-refresh already installed.');
}`;

export function reactRefreshPlugin() {
  return perEnvironmentPlugin('vesta:react-refresh:env', (environment) => {
    const config = environment.getTopLevelConfig();

    if (environment.config.consumer !== 'client' || canSkipReactRefresh(config)) {
      return false;
    }

    return {
      name: 'vesta:react-refresh',
      apply: 'serve',
      enforce: 'pre',
      resolveId: {
        filter: { id: exactRegex(REACT_REFRESH_ID) },
        handler(id) {
          if (id === REACT_REFRESH_ID) {
            return REACT_REFRESH_VIRTUAL_ID;
          }
        },
      },
      load: {
        filter: { id: exactRegex(REACT_REFRESH_VIRTUAL_ID) },
        handler(id) {
          if (id === REACT_REFRESH_VIRTUAL_ID) {
            return REACT_REFRESH_INSTALL_FRAGMENT.replace('__BASE__', '/');
          }
        },
      },
    };
  });
}
