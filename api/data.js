/**
 * Vercel Serverless Function: /api/data
 * Serves persistent site data
 */

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const tmpFilePath = path.join('/tmp', 'site_data.json');
    const srcDataFilePath = path.join(process.cwd(), 'src', 'data', 'siteData.json');
    const dataFilePath = path.join(process.cwd(), 'data', 'site_data.json');

    let content = null;
    if (fs.existsSync(tmpFilePath)) {
      try {
        content = fs.readFileSync(tmpFilePath, 'utf-8');
      } catch (e) {}
    }
    if (!content && fs.existsSync(srcDataFilePath)) {
      try {
        content = fs.readFileSync(srcDataFilePath, 'utf-8');
      } catch (e) {}
    }
    if (!content && fs.existsSync(dataFilePath)) {
      try {
        content = fs.readFileSync(dataFilePath, 'utf-8');
      } catch (e) {}
    }

    if (content) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).send(content);
    }
    return res.status(200).json({});
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
