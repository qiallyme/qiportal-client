#!/usr/bin/env node

// Environment verification script
// Run with: node scripts/verify-env.js

console.log('🔍 Environment Verification\n');

// Frontend variables (Vite)
const frontendUrl = process.env.VITE_SUPABASE_URL;
const frontendKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('📱 Frontend (Vite):');
console.log(`  URL: ${frontendUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`  Anon Key: ${frontendKey ? '✅ Set' : '❌ Missing'}`);

// Backend variables (Node/Server)
const backendUrl = process.env.SUPABASE_URL;
const backendKey = process.env.SUPABASE_SERVICE_KEY;

console.log('\n🖥️  Backend (Node/Server):');
console.log(`  URL: ${backendUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`  Service Key: ${backendKey ? '✅ Set' : '❌ Missing'}`);

// Validation
console.log('\n📋 Validation:');
if (frontendUrl && frontendKey) {
  console.log('  ✅ Frontend ready for development');
} else {
  console.log('  ❌ Frontend missing environment variables');
}

if (backendUrl && backendKey) {
  console.log('  ✅ Backend ready for scripts/exporter');
} else {
  console.log('  ❌ Backend missing environment variables');
}

// Quick test for exporter
const clientSlug = process.env.CLIENT_SLUG;
console.log(`\n📦 Exporter: ${clientSlug ? `Ready for ${clientSlug}` : 'Set CLIENT_SLUG to test'}`);

console.log('\n💡 Next steps:');
if (!frontendUrl || !frontendKey) {
  console.log('  1. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
}
if (!backendUrl || !backendKey) {
  console.log('  2. Set SUPABASE_URL and SUPABASE_SERVICE_KEY for server scripts');
}
if (!clientSlug) {
  console.log('  3. Set CLIENT_SLUG to test the exporter');
}
