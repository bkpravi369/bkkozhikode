const { verifyToken } = require('../security');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
  const correctPassword = process.env.ADMIN_PASSWORD || 'Kozhikode@2026';

  const isValid = verifyToken(token, correctPassword);

  if (isValid) {
    return res.status(200).json({ authenticated: true, message: 'Session is active and valid.' });
  } else {
    return res.status(401).json({ authenticated: false, error: 'Unauthorized: Session is invalid or expired.' });
  }
};
