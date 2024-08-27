import fs from 'fs/promises';

const filePath = './package.json';
const backupFilePath = './package-original.json';

async function modifyUiPackageJson() {
  try {
    // Check if a backup already exists
    try {
      await fs.access(backupFilePath);
      console.log(`Backup file already exists: ${backupFilePath}`);
    } catch {
      await fs.copyFile(filePath, backupFilePath);
      console.log(`Backup created: ${backupFilePath}`);
    }

    // Read and parse the package.json file
    const data = await fs.readFile(filePath, 'utf-8');
    let packageJson = JSON.parse(data);

    // Modify the @leather.io/ui dependency
    packageJson.dependencies['@leather.io/ui'] = 'file:../mono/packages/ui';

    // Ensure pnpm and pnpm.overrides are initialized
    if (!packageJson.pnpm) {
      packageJson.pnpm = {};
    }
    if (!packageJson.pnpm.overrides) {
      packageJson.pnpm.overrides = {};
    }

    // Add the specified overrides
    const overrides = {
      '@leather.io/rpc': 'file:../mono/packages/rpc',
      '@leather.io/constants': 'file:../mono/packages/constants',
      '@leather.io/models': 'file:../mono/packages/models',
      '@leather.io/tokens': 'file:../mono/packages/tokens',
      '@leather.io/utils': 'file:../mono/packages/utils'
    };

    packageJson.pnpm.overrides = { ...packageJson.pnpm.overrides, ...overrides };

    // Write the modified package.json back to the file
    await fs.writeFile(filePath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
    console.log(`Successfully updated ${filePath}`);

  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

// Execute the function
modifyUiPackageJson();
