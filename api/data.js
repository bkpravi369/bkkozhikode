/**
 * Vercel Serverless Function: /api/data
 * Serves persistent site data
 */

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'site_data.json');
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf-8');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).send(content);
    }
    return res.status(200).json({});
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
