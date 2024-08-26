import fs from 'fs/promises';

const filePath = './package.json';
const backupFilePath = './package-original.json';

async function revertPackageJson() {
  try {
    try {
      await fs.access(backupFilePath);
    } catch {
      throw new Error(`Backup file not found: ${backupFilePath}`);
    }

    await fs.copyFile(backupFilePath, filePath);
    console.log(`Successfully reverted ${filePath}`);

    await fs.unlink(backupFilePath);
    console.log(`Backup file removed: ${backupFilePath}`);

  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

revertPackageJson();
