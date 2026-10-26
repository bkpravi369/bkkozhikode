/**
 * Vercel Serverless Function: /api/data
 * Centralized Single Source of Truth for live site data
 * Automatically sanitizes and strips internal administrative credentials.
 */

import fs from 'fs';
import path from 'path';

function stripSensitiveFields(data) {
  if (!data || typeof data !== 'object') return data;
  const clone = JSON.parse(JSON.stringify(data));
  if (clone.settings && typeof clone.settings === 'object') {
    delete clone.settings.adminPin;
    delete clone.settings.githubToken;
    delete clone.settings.cloudinaryApiKey;
    delete clone.settings.cloudinaryApiSecret;
  }
  delete clone.password;
  delete clone.adminPin;
  delete clone.githubToken;
  return clone;
}

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
      path.join(process.cwd(), 'data', 'site_data.json'),
      path.join(process.cwd(), 'src', 'data', 'siteData.json')
    ];

    let contentObj = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          const raw = fs.readFileSync(p, 'utf-8');
          if (raw && raw.trim().startsWith('{')) {
            contentObj = JSON.parse(raw);
            break;
          }
        } catch (e) {}
      }
    }

    if (contentObj) {
      const sanitized = stripSensitiveFields(contentObj);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).json(sanitized);
    }
    return res.status(200).json({});
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
