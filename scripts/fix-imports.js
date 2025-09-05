#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import path mappings
const importMappings = {
  // UI components
  '@/components/ui/': '@ui/',
  '@/components/ui/button': '@ui/button',
  '@/components/ui/input': '@ui/input',
  '@/components/ui/card': '@ui/card',
  '@/components/ui/dialog': '@ui/dialog',
  '@/components/ui/textarea': '@ui/textarea',
  
  // Shared components
  '@/components/': '@shared/components/',
  '@/components/kb/': '@shared/components/kb/',
  '@/components/client/': '@shared/components/client/',
  '@/components/messaging/': '@shared/components/messaging/',
  '@/components/layout/': '@shared/components/layout/',
  
  // Lib and utils
  '@/lib/': '@shared/lib/',
  '@/lib/kbApi': '@shared/lib/kbApi',
  '@/lib/queryClient': '@shared/lib/queryClient',
  '@/lib/utils': '@shared/lib/utils',
  
  // Auth and context
  '@/auth/': '@shared/auth/',
  '@/auth/AuthProvider': '@shared/auth/AuthProvider',
  '@/context/UserContext': '@shared/auth/context/UserContext',
  
  // Hooks
  '@/hooks/': '@shared/hooks/',
  '@/hooks/use-toast': '@shared/hooks/use-toast',
  '@/hooks/useWebSocket': '@shared/hooks/useWebSocket',
  
  // Utils
  '@/utils/': '@shared/utils/',
  '@/utils/authGuards': '@shared/utils/authGuards',
  
  // Pages
  '@/pages/': '@shared/pages/',
};

// Function to fix imports in a file
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply import mappings
    for (const [oldPath, newPath] of Object.entries(importMappings)) {
      if (content.includes(oldPath)) {
        content = content.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
        modified = true;
      }
    }
    
    // Fix specific patterns
    content = content.replace(/from ['"]@\/([^'"]+)['"]/g, 'from \'@shared/$1\'');
    content = content.replace(/import ['"]@\/([^'"]+)['"]/g, 'import \'@shared/$1\'');
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Function to process directory recursively
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .git
      if (file !== 'node_modules' && file !== '.git') {
        processDirectory(fullPath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx')) {
      fixImportsInFile(fullPath);
    }
  }
}

// Main execution
console.log('🔧 Fixing import paths...');
console.log('📁 Processing directories: apps/, shared/, packages/');

// Process main directories
const directories = ['apps', 'shared', 'packages'];
for (const dir of directories) {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`\n📂 Processing ${dir}/`);
    processDirectory(dirPath);
  }
}

console.log('\n✨ Import path fixing complete!');
console.log('\n📝 Next steps:');
console.log('1. Run: pnpm run typecheck:client');
console.log('2. Fix any remaining TypeScript errors');
console.log('3. Test the build: pnpm run build:client');
