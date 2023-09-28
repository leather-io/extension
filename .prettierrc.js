const defaultConfig = require('@stacks/prettier-config');

module.exports = {
  ...defaultConfig,
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  importOrder: [
    '^react',
    '<THIRD_PARTY_MODULES>',
    '^@shared/(.*)$',
    '^@(app|content-script|inpage|background)/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
