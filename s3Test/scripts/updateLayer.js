import { existsSync, readdir, rm, stat, copyFile, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootNodeModulesPath = join(__dirname, '..', 'node_modules');
const layerNodeModulesPath = join(__dirname, '..', 'layer', 'nodejs', 'node18', 'node_modules');

// Function to copy node_modules to layer directory
function updateLayer() {
  // Check if root node_modules exists
  if (existsSync(rootNodeModulesPath)) {
    // Ensure the layer directory exists
    ensureDir(layerNodeModulesPath);

    // Clear the target node_modules directory
    clearDirectory(layerNodeModulesPath, () => {
      // After clearing, copy the contents of node_modules to the layer
      if (existsSync(rootNodeModulesPath)) {
        copyDirectory(rootNodeModulesPath, layerNodeModulesPath);
      } else {
        console.log('No node_modules found in the root directory.');
      }
    });
  } else {
    console.log('No node_modules found in the root directory.');
  }
}

// Function to clear the contents of a directory
function clearDirectory(dir, callback) {
  if (existsSync(dir)) {
    readdir(dir, (err, files) => {
      if (err) {
        console.error('Error reading target directory:', err);
        return;
      }
      let fileCount = files.length;
      if (fileCount === 0) {
        callback(); // Call callback if directory is already empty
      }

      files.forEach((file) => {
        const filePath = join(dir, file);
        rm(filePath, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(`Error removing file ${filePath}:`, err);
          } else {
            console.log(`Removed ${filePath}`);
          }
          fileCount--;
          if (fileCount === 0) {
            callback(); // Call callback after all files have been removed
          }
        });
      });
    });
  } else {
    callback(); // Call callback if directory doesn't exist
  }
}

// Function to ensure a directory exists
function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true }); // Create the directory recursively
  }
}

// Function to copy files and directories
function copyDirectory(source, target) {
  // Read the contents of the source directory
  readdir(source, (err, files) => {
    if (err) {
      console.error('Error reading source directory:', err);
      return;
    }

    // Iterate through each file in the source directory
    files.forEach((file) => {
      const srcFile = join(source, file);
      const destFile = join(target, file);

      // Check if the current item is a directory or a file
      stat(srcFile, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        if (stats.isDirectory()) {
          // Recursively copy directories
          ensureDir(destFile); // Ensure the destination directory exists
          copyDirectory(srcFile, destFile); // Copy the directory
        } else {
          // Copy the file
          copyFile(srcFile, destFile, (err) => {
            if (err) {
              console.error(`Error copying file ${srcFile} to ${destFile}:`, err);
            } else {
              console.log(`Copied ${srcFile} to ${destFile}`);
            }
          });
        }
      });
    });
  });
}

// Execute the function
updateLayer();

export default updateLayer;
