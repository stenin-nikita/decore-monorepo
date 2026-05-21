import type { ResolvedConfig } from 'vite';

import type { Manifest } from '../../../node/manifest';

export type GenerateBuildIdFn = () => string | null | Promise<string | null>;

export type TransformManifestFn = (
  manifest: Manifest,
  config: ResolvedConfig,
) => Manifest | Promise<Manifest>;

export interface ManifestPluginOptions {
  fileName?: string;
  generateBuildId?: GenerateBuildIdFn;
  transform?: TransformManifestFn;
}
