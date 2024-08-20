import fs from 'fs/promises';

// Paths to your package.json files
const filePath = './package.json';
const backupFilePath = './package-original.json';

async function revertPackageJson() {
  try {
    // Check if backup file exists
    try {
      await fs.access(backupFilePath);
    } catch {
      throw new Error(`Backup file not found: ${backupFilePath}`);
    }

    // Restore the original package.json
    await fs.copyFile(backupFilePath, filePath);
    console.log(`Successfully reverted ${filePath}`);

    // Remove the backup file
    await fs.unlink(backupFilePath);
    console.log(`Backup file removed: ${backupFilePath}`);

  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

revertPackageJson();
