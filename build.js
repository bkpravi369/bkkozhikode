const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');

// Clean previous dist
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });

// Copy all website files into dist
const itemsToCopy = [
  'index.html',
  'admin',
  'css',
  'js',
  'assets',
  'data',
  'public',
  'siteData.json',
  'cloudinary_migration_map.json'
];

for (const item of itemsToCopy) {
  const src = path.join(root, item);
  const dest = path.join(dist, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
  }
}

// Guarantee siteData.json is present in dist/ and dist/public/
const sourceSiteData = fs.existsSync(path.join(root, 'public', 'siteData.json'))
  ? path.join(root, 'public', 'siteData.json')
  : (fs.existsSync(path.join(root, 'siteData.json')) ? path.join(root, 'siteData.json') : null);

if (sourceSiteData) {
  fs.mkdirSync(path.join(dist, 'public'), { recursive: true });
  fs.copyFileSync(sourceSiteData, path.join(dist, 'public', 'siteData.json'));
  fs.copyFileSync(sourceSiteData, path.join(dist, 'siteData.json'));
}

console.log('✅ Build successful: "dist" directory generated for Vercel deployment.');
