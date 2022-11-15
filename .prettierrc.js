const defaultConfig = require('@stacks/prettier-config');

module.exports = {
  ...defaultConfig,
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
