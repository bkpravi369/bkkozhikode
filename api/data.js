/**
 * Vercel Serverless Function: /api/data
 * Centralized Single Source of Truth for live site data
 */

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const candidatePaths = [
      path.join('/tmp', 'site_data.json'),
      path.join(process.cwd(), 'siteData.json'),
      path.join(process.cwd(), 'public', 'siteData.json'),
      path.join(process.cwd(), 'data', 'site_data.json'),
      path.join(process.cwd(), 'src', 'data', 'siteData.json')
    ];

    let content = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          const raw = fs.readFileSync(p, 'utf-8');
          if (raw && raw.trim().startsWith('{')) {
            content = raw;
            break;
          }
        } catch (e) {}
      }
    }

    if (content) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).send(content);
    }
    return res.status(200).json({});
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
