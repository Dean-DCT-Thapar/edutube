// replaceAxiosWithWrapper.js
const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname); // adjust if your frontend folder is named differently
const WRAPPER_IMPORT = "import apiClient from '@/utils/apiClient';";

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // skip node_modules
      if (file === 'node_modules') return;
      walkDir(fullPath);
    } else if (stats.isFile() && (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.tsx'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = content;

      // Replace axios import
      if (/import\s+axios\s+from\s+['"]axios['"]/.test(updated)) {
        updated = updated.replace(/import\s+axios\s+from\s+['"]axios['"]/, WRAPPER_IMPORT);
      }

      // Replace all axios usages
      updated = updated.replace(/\baxios\./g, 'apiClient.');

      if (updated !== content) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  });
}

walkDir(FRONTEND_DIR);
console.log('✅ All axios imports and usages replaced with apiClient.');