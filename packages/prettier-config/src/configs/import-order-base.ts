import type { Config } from 'prettier';

const QS = '([?].*)?';
const STYLE_EXT = 'css|less|sass|scss|styl|stylus|pcss|postcss|sss';
const IMAGE_EXT = 'apng|bmp|png|jpe?g|jfif|pjpeg|pjp|gif|svg|ico|webp|avif|cur|jxl';
const NOT_STYLE_OR_ASSET = `(.(?![.](?:${STYLE_EXT}|${IMAGE_EXT})${QS}$))*`;
const RELATIVE_RE = `^[.]{1,2}${NOT_STYLE_OR_ASSET}$`;
const IMAGE_RE = `^[.]{1,2}.+[.](${IMAGE_EXT})${QS}$`;
const STYLE_RE = `^[.]{1,2}.+[.](${STYLE_EXT})${QS}$`;

export const ImportModuleType = {
  BUILTIN: '<BUILTIN_MODULES>',
  THIRD_PARTY: '<THIRD_PARTY_MODULES>',
  RELATIVE: RELATIVE_RE,
  IMAGE: IMAGE_RE,
  STYLE: STYLE_RE,
};

export const importOrderBaseConfig: Config = {
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
};
