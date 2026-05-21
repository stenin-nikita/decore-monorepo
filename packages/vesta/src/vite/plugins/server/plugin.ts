import assert from 'node:assert';
import path from 'node:path';

import { isRunnableDevEnvironment, type Plugin, type UserConfig } from 'vite';

import { SERVER_MANIFEST_FILE_NAME, ViteEnvironmentName } from '../../constants';
import type { VestaOptions } from '../../types';
import { emptyDir } from '../../utils';
import { createMiddleware } from './middleware';
import { Runner } from './runner';
import {
  normalizeBuildOptions,
  normalizeClientOptions,
  normalizeServerOptions,
  readServerManifest,
} from './utils';

export function serverPlugin(options: VestaOptions = {}) {
  const { mode = 'client-server' } = options;
  const buildOptions = normalizeBuildOptions(options.build);
  const serverOptions = normalizeServerOptions(options.server);
  const clientOptions = normalizeClientOptions(options.client);

  let isTest = false;

  const resolveSourceEntryPath = (rootDir: string) => {
    const input = serverOptions.input[serverOptions.entry];

    return path.resolve(rootDir, input);
  };

  const server: Plugin = {
    name: 'vesta:server',
    config(inlineConfig) {
      isTest = inlineConfig.mode === 'test';

      const ssrEnvironmentOptions = inlineConfig.environments?.[ViteEnvironmentName.SSR];

      const pluginConfig = {
        appType: 'custom',
        environments: {
          [ViteEnvironmentName.CLIENT]: {
            consumer: 'client',
            build: {
              emptyOutDir: false,
              outDir: path.join(buildOptions.outDir, clientOptions.output.dir),
              rolldownOptions: {
                input: clientOptions.input,
                output: {
                  hashCharacters: buildOptions.hashCharacters,
                  entryFileNames: clientOptions.output.entryFileNames,
                  chunkFileNames: clientOptions.output.chunkFileNames,
                  assetFileNames: clientOptions.output.assetFileNames,
                },
              },
            },
          },
          [ViteEnvironmentName.SSR]: {
            consumer: 'server',
            build: {
              manifest: SERVER_MANIFEST_FILE_NAME,
              emptyOutDir: false,
              copyPublicDir: ssrEnvironmentOptions?.build?.copyPublicDir ?? false,
              outDir: path.join(buildOptions.outDir, serverOptions.output.dir),
              rolldownOptions: {
                input: serverOptions.input,
                output: {
                  hashCharacters: buildOptions.hashCharacters,
                  entryFileNames: serverOptions.output.entryFileNames,
                  chunkFileNames: serverOptions.output.chunkFileNames,
                  assetFileNames: clientOptions.output.assetFileNames,
                },
              },
            },
          },
        },
        builder: {
          sharedPlugins: true,
          async buildApp(builder) {
            const clientEnv = builder.environments[ViteEnvironmentName.CLIENT];
            const serverEnv = builder.environments[ViteEnvironmentName.SSR];

            if (buildOptions.emptyOutDir) {
              const buildDir = path.resolve(builder.config.root, buildOptions.outDir);

              emptyDir(buildDir);
            }

            if (!serverEnv.isBuilt) {
              await builder.build(serverEnv);
            }

            if (mode === 'client-server' && !clientEnv.isBuilt) {
              await builder.build(clientEnv);
            }
          },
        },
      } satisfies UserConfig;

      return pluginConfig;
    },
    async configureServer(server) {
      if (isTest) {
        return;
      }

      const ssrEnvironment = server.environments[ViteEnvironmentName.SSR];

      assert(isRunnableDevEnvironment(ssrEnvironment));

      const runner = new Runner(ssrEnvironment.runner);

      const sourceEntryPath = resolveSourceEntryPath(server.config.root);
      const middleware = createMiddleware(runner, sourceEntryPath);

      server.httpServer?.once('listening', async () => {
        runner.import(sourceEntryPath).catch((error) => {
          server.config.logger.error(error);
        });
      });

      return () => {
        server.middlewares.use(middleware);
      };
    },
    async configurePreviewServer(server) {
      const ssrEnvironmentConfig = server.config.environments[ViteEnvironmentName.SSR];
      const outDir = ssrEnvironmentConfig.build.outDir;

      const sourceEntryPath = resolveSourceEntryPath(server.config.root);
      const relativePath = path.relative(server.config.root, sourceEntryPath);

      const manifestPath = path.resolve(outDir, SERVER_MANIFEST_FILE_NAME);
      const manifest = await readServerManifest(manifestPath);
      const entrypoint = path.resolve(outDir, manifest[relativePath].file);

      const runner = new Runner();
      const middleare = createMiddleware(runner, entrypoint);

      return () => {
        server.middlewares.use(middleare);
      };
    },
  };

  return server;
}
