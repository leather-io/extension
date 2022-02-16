/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  extends: 'dependency-cruiser/configs/recommended',

  forbidden: [
    {
      name: 'no-orphans',
      severity: 'warn',
      from: { orphan: true },
      to: {},
    },
    {
      name: 'script-context-not-to-another',
      comment: 'One script context must not depend on another',
      severity: 'error',
      from: { path: '(^src/)([^/]+)/' },
      to: { path: '^$1', pathNot: ['$1$2', '^src/shared'] },
    },
    {
      name: 'only-import-state-via-hooks',
      severity: 'error',
      from: { path: '^src/app/*', pathNot: ['^src/app/store/*'] },
      to: {
        path: ['^src/app/store/*'],
        pathNot: [
          `src/app/store/index.ts`,
          `src/app.*\.actions\.ts`,
          `src/app.*\.selectors\.ts`,
          `src/app.*\.hooks\.ts`,
          `src/app.*\.slice\.ts`,
          `src/app.*\.models\.ts`,
          `src/app.*\.utils\.ts`,
        ],
      },
    },
    {
      name: 'ban-jotai-outside-store',
      severity: 'error',
      from: { path: '^src', pathNot: ['^src/app/store/*'] },
      to: { path: 'jotai*' },
    },
    {
      name: 'component-cannot-import-pages-or-features',
      severity: 'error',
      from: { path: 'src/app/components*' },
      to: { path: ['^src/app/pages*', '^src/app/features/*'] },
    },
    {
      name: 'no-circular',
      severity: 'warn',
      comment:
        'This dependency is part of a circular relationship. You might want to revise ' +
        'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
      from: {},
      to: { circular: true },
    },
    // @kyranjamie: imo components in `components/` should be dumb
    // so would be nice to enable this rule, though following state
    // refactor, this has been disabled to be more permissive
    // {
    //   name: 'components-must-not-import-store',
    //   severity: 'error',
    //   from: { path: '^src/components/.*' },
    //   to: { path: '^src/store/.*' },
    // },
    {
      name: 'features-cannot-import-pages',
      severity: 'error',
      from: { path: '^src/app/features/.*' },
      to: { path: '^src/app/pages/.*' },
    },
    {
      name: 'only-allow-react-icons-fi',
      comment: 'Ensure only icons from `fi` group are allowed',
      severity: 'error',
      from: { path: '^src' },
      to: { path: 'react-icons.*', pathNot: 'react-icons/fi' },
    },
    {
      name: 'no-using-pino-directly',
      comment: 'Enforce use of Pino logging library via @logger wrapper',
      severity: 'error',
      from: { path: '^src', pathNot: ['^src/shared/logger.ts$'] },
      to: { path: 'pino' },
    },
    {
      name: 'no-inter-pages-deps',
      comment: 'Prohibit dependencies between pages',
      severity: 'error',
      from: { path: '^src/app/pages/([^/]+)/.+' },
      to: {
        path: '^src/app/pages/([^/]+)/.+',
        pathNot: '^src/app/pages/$1/.+',
      },
    },
    {
      name: 'no-feature-component-external-use',
      comment: `Only a given feature may import its child 'src/feature/xxx/components'`,
      severity: 'error',
      from: { path: '(^src/app/features/)([^/]+)' },
      to: {
        path: '^src/app/features/[^/]+/components',
        pathNot: '$1$2/',
      },
    },
    {
      name: 'no-feature-component-sibling-use',
      comment: `Features cannot depend on a sibling feature's components`,
      severity: 'error',
      from: { pathNot: ['^src/app/features'] },
      to: { path: '^src/app/features/([^/]+)/components' },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
      dependencyTypes: ['npm', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-bundled', 'npm-no-pkg'],
    },
    webpackConfig: {
      fileName: './webpack/webpack.config.prod.js',
    },
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: {
        /* pattern of modules that can be consolidated in the detailed
           graphical dependency graph. The default pattern in this configuration
           collapses everything in node_modules to one folder deep so you see
           the external modules, but not the innards your app depends upon.
         */
        collapsePattern: 'node_modules/[^/]+',
      },
      archi: {
        /* pattern of modules that can be consolidated in the high level
          graphical dependency graph. If you use the high level graphical
          dependency graph reporter (`archi`) you probably want to tweak
          this collapsePattern to your situation.
        */
        collapsePattern: '^(node_modules|packages|src|lib|app|bin|test(s?)|spec(s?))/[^/]+',
      },
    },
  },
};
