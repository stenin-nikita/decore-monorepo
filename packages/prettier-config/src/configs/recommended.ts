import type { Config } from 'prettier';

import { prettierBaseConfig } from './prettier-base';
import { importOrderBaseConfig, ImportModuleType } from './import-order-base';

const SCOPE_RE = `^@[^/].`;
const ALIAS_RE = `^@/.`;

export const recommended: Config = {
  ...prettierBaseConfig,
  ...importOrderBaseConfig,
  importOrder: [
    ImportModuleType.BUILTIN,
    '',
    '^react$',
    '^react-dom',
    ImportModuleType.THIRD_PARTY,
    SCOPE_RE,
    '',
    ALIAS_RE,
    '',
    ImportModuleType.RELATIVE,
    '',
    ImportModuleType.IMAGE,
    '',
    ImportModuleType.STYLE,
  ],
};
