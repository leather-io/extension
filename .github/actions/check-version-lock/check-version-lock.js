import core from '@actions/core';

import appPackage from '../../../package.json' assert { type: 'json' };

const illegalVersionSymbol = ['~', '^', '>', '<'];

function containsIllegalChar(input) {
  return illegalVersionSymbol.some(symbol => input.includes(symbol));
}

(async () => {
  try {
    const dependencies = appPackage.dependencies;
    const devDependencies = appPackage.devDependencies;

    const allPackages = [...Object.entries(dependencies), ...Object.entries(devDependencies)];

    const illegalPackages = allPackages
      .filter(([pkg, version]) => containsIllegalChar(version))
      .map(([pkg, version]) => ({ package: pkg, version }));

    if (illegalPackages.length > 0) {
      core.setFailed(`
        There are packages with non-exact versions defined. This presents a security risk.
        ${JSON.stringify(illegalPackages, null, 2)}
      `);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
