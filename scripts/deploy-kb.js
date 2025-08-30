#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const KB_BUILD_DIR = path.join(ROOT_DIR, 'public/kb');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('🚀 Knowledge Base Deployment Script');
console.log('=====================================\n');

// Check if we're in the right directory
if (!fs.existsSync(path.join(ROOT_DIR, 'package.json'))) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if kb-config.json exists
const configPath = path.join(ROOT_DIR, 'kb-config.json');
if (!fs.existsSync(configPath)) {
  console.error('❌ Error: kb-config.json not found. Please create the configuration file first.');
  process.exit(1);
}

console.log('📋 Configuration check passed\n');

try {
  // Step 1: Build knowledge base
  console.log('🔨 Step 1: Building knowledge base...');
  execSync('npm run build:kb', { cwd: ROOT_DIR, stdio: 'inherit' });
  console.log('✅ Knowledge base built successfully\n');

  // Step 2: Check if build was successful
  if (!fs.existsSync(KB_BUILD_DIR)) {
    throw new Error('Knowledge base build directory not found');
  }

  const kbFiles = fs.readdirSync(KB_BUILD_DIR);
  if (kbFiles.length === 0) {
    throw new Error('No knowledge base files generated');
  }

  console.log('📊 Build Summary:');
  console.log(`   - Generated files: ${kbFiles.length}`);
  console.log(`   - Build directory: ${KB_BUILD_DIR}`);
  
  // Count HTML files
  const htmlFiles = kbFiles.filter(file => file.endsWith('.html'));
  console.log(`   - HTML pages: ${htmlFiles.length}`);
  
  // Count client directories
  const clientDirs = kbFiles.filter(file => {
    const stat = fs.statSync(path.join(KB_BUILD_DIR, file));
    return stat.isDirectory();
  });
  console.log(`   - Client organizations: ${clientDirs.length}\n`);

  // Step 3: Build main application (optional)
  const buildApp = process.argv.includes('--build-app');
  if (buildApp) {
    console.log('🔨 Step 2: Building main application...');
    execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
    console.log('✅ Application built successfully\n');
  }

  // Step 4: Copy KB files to dist if it exists
  if (fs.existsSync(DIST_DIR)) {
    console.log('📁 Step 3: Copying knowledge base to dist directory...');
    const distKbDir = path.join(DIST_DIR, 'kb');
    
    // Remove existing kb directory if it exists
    if (fs.existsSync(distKbDir)) {
      fs.rmSync(distKbDir, { recursive: true, force: true });
    }
    
    // Copy kb directory
    fs.cpSync(KB_BUILD_DIR, distKbDir, { recursive: true });
    console.log('✅ Knowledge base copied to dist directory\n');
  }

  // Step 5: Generate deployment report
  console.log('📋 Step 4: Generating deployment report...');
  const report = {
    timestamp: new Date().toISOString(),
    buildDirectory: KB_BUILD_DIR,
    files: kbFiles,
    clients: clientDirs,
    htmlPages: htmlFiles.length,
    totalFiles: kbFiles.length
  };

  const reportPath = path.join(ROOT_DIR, 'kb-deployment-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`✅ Deployment report saved to: ${reportPath}\n`);

  // Step 6: Validation
  console.log('🔍 Step 5: Validating build...');
  
  // Check access control file
  const accessControlPath = path.join(KB_BUILD_DIR, 'access-control.json');
  if (!fs.existsSync(accessControlPath)) {
    throw new Error('Access control file not found');
  }
  
  // Check main index
  const mainIndexPath = path.join(KB_BUILD_DIR, 'index.html');
  if (!fs.existsSync(mainIndexPath)) {
    throw new Error('Main index file not found');
  }
  
  // Check each client directory
  for (const clientDir of clientDirs) {
    const clientPath = path.join(KB_BUILD_DIR, clientDir);
    const clientIndexPath = path.join(clientPath, 'index.html');
    const searchIndexPath = path.join(clientPath, 'search-index.json');
    
    if (!fs.existsSync(clientIndexPath)) {
      throw new Error(`Client index not found for ${clientDir}`);
    }
    
    if (!fs.existsSync(searchIndexPath)) {
      throw new Error(`Search index not found for ${clientDir}`);
    }
  }
  
  console.log('✅ Build validation passed\n');

  // Success message
  console.log('🎉 Knowledge Base Deployment Complete!');
  console.log('=====================================');
  console.log('');
  console.log('📁 Files are ready in:');
  console.log(`   ${KB_BUILD_DIR}`);
  console.log('');
  console.log('🌐 To deploy:');
  console.log('   1. Upload the contents of public/kb/ to your web server');
  console.log('   2. Ensure /kb/* routes are properly configured');
  console.log('   3. Verify access control is working correctly');
  console.log('');
  console.log('🔧 Next steps:');
  console.log('   - Test the knowledge base in a staging environment');
  console.log('   - Verify user access control');
  console.log('   - Monitor performance and usage');
  console.log('');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.error('');
  console.error('🔧 Troubleshooting:');
  console.error('   - Check that all dependencies are installed');
  console.error('   - Verify kb-config.json is valid');
  console.error('   - Ensure kb-content directory exists with markdown files');
  console.error('   - Check file permissions');
  process.exit(1);
}

