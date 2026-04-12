export default {
  arrowParens: 'always',
  endOfLine: 'lf',
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  overrides: [
    {
      files: ['*.json'],
      options: {
        parser: 'json',
        trailingComma: 'none',
      },
    },
    {
      files: ['*.md'],
      options: {
        parser: 'markdown',
      },
    },
    {
      files: ['*.mdx'],
      options: {
        parser: 'mdx',
      },
    },
  ],
};
