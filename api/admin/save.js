const crypto = require('crypto');

function verifyToken(token, secret) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [tsStr, sig] = parts;
  const ts = parseInt(tsStr, 10);
  if (isNaN(ts)) return false;
  if (Date.now() - ts > 24 * 60 * 60 * 1000) return false;
  const expected = crypto.createHmac('sha256', secret).update(tsStr).digest('hex');
  if (sig.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
  const correctPassword = process.env.ADMIN_PASSWORD || 'OmShanti@Kozhikode2026';

  if (!verifyToken(token, correctPassword)) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Valid administrative session required for write operations.' });
  }

  return res.status(200).json({ success: true, message: 'Settings saved successfully.' });
};
