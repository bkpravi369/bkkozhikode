const { generateToken } = require('../security');

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

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const password = (body && body.password ? body.password : '').trim();
    const correctPassword = process.env.ADMIN_PASSWORD || 'Kozhikode@2026';

    if (!password || password !== correctPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrative credentials.'
      });
    }

    const token = generateToken(correctPassword);

    return res.status(200).json({
      success: true,
      token: token,
      expiresIn: 86400,
      message: 'Administrative authentication successful.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Authentication processing error.' });
  }
};
