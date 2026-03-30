import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 根目錄絕對路徑
const rootPath = path.resolve(__dirname, '..');
const envLocalPath = path.resolve(rootPath, '.env.local');
const envPath = path.resolve(rootPath, '.env');

console.log('--- [Debug] Env Loading ---');
console.log('Root Path:', rootPath);

if (fs.existsSync(envLocalPath)) {
  console.log('Found .env.local, loading...');
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  console.log('Found .env, loading...');
  dotenv.config({ path: envPath });
} else {
  console.warn('❌ No .env or .env.local file found in root!');
}

console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Loaded ✅' : 'Missing ❌');
console.log('--- [Debug] End ---');
