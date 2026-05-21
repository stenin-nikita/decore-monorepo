import assert from 'node:assert';

import { perEnvironmentPlugin, type Plugin, type ResolvedConfig, type Rolldown } from 'vite';

import { ViteEnvironmentName } from '../../constants';
import { removeFile, serialize, writeFile } from '../../utils';
import { DEFAULT_FILE_NAME, VITE_MANIFEST_PATH } from './constants';
import type { ManifestPluginOptions } from './types';
import { generateManifest, resolveManifestPath } from './utils';

interface InternalConfig {
  viteManifestPath: string;
  skipRemoveManifest: boolean;
  manifestPath: string | null;
}

export function manifestPlugin(options: ManifestPluginOptions = {}) {
  const { fileName = DEFAULT_FILE_NAME, generateBuildId = () => null, transform } = options;

  const internalConfig: InternalConfig = {
    viteManifestPath: VITE_MANIFEST_PATH,
    skipRemoveManifest: false,
    manifestPath: null,
  };

  async function emit(config: ResolvedConfig, bundle?: Rolldown.OutputBundle) {
    const manifest = await generateManifest({ config, bundle, generateBuildId, transform });
    const content = serialize(manifest, !config.isProduction);

    assert(internalConfig.manifestPath, 'Manifest path is not defined');

    await writeFile(internalConfig.manifestPath, content);
  }

  const configPlugin: Plugin = {
    name: 'vesta:manifest:config',
    config(userConfig) {
      const manifest = userConfig.environments?.[ViteEnvironmentName.CLIENT]?.build?.manifest;

      internalConfig.skipRemoveManifest = typeof manifest === 'string' || manifest === true;

      return {
        environments: {
          [ViteEnvironmentName.CLIENT]: {
            build: {
              manifest: typeof manifest === 'string' ? manifest : true,
            },
          },
        },
      };
    },
    configResolved(config) {
      const clientEnvironment = config.environments[ViteEnvironmentName.CLIENT];
      const manifest = clientEnvironment.build.manifest;

      if (typeof manifest === 'string') {
        internalConfig.viteManifestPath = manifest;
      }

      internalConfig.manifestPath = resolveManifestPath(config, fileName);
    },
  };

  const devManifestPlugin: Plugin = {
    name: 'vesta:manifest:dev',
    configureServer(server) {
      const { httpServer } = server;

      if (!httpServer) {
        return;
      }

      const create = () => emit(server.config);
      const remove = () => {
        assert(internalConfig.manifestPath, 'Manifest path is not defined');

        removeFile(internalConfig.manifestPath);
      };

      httpServer.once('listening', create);
      httpServer.once('close', remove);
    },
  };

  const manifestEnvPlugin = perEnvironmentPlugin('vesta:manifest:env', (environment) => {
    if (environment.config.consumer !== 'client') {
      return false;
    }

    return {
      name: 'vesta:manifest',
      enforce: 'post',
      generateBundle: {
        order: 'post',
        async handler(_options, bundle) {
          const config = environment.getTopLevelConfig();

          await emit(config, bundle);

          if (!internalConfig.skipRemoveManifest && bundle[internalConfig.viteManifestPath]) {
            delete bundle[internalConfig.viteManifestPath];
          }
        },
      },
    };
  });

  return [configPlugin, devManifestPlugin, manifestEnvPlugin];
}
