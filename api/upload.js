/**
 * Vercel Serverless Function: /api/upload
 * Supports direct and forwarded image uploads into Cloudinary (uo0dcjpe)
 * under 'Website event images' folder.
 */

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
    const pinHeader = req.headers['x-admin-pin'] || '';
    const correctPassword = process.env.ADMIN_PASSWORD || 'Kozhikode@2026';

    const crypto = await import('crypto');
    let isAuth = false;
    if (pinHeader && pinHeader === correctPassword) {
      isAuth = true;
    } else if (token && token.includes('.')) {
      const parts = token.split('.');
      if (parts.length === 2) {
        const [tsStr, sig] = parts;
        const ts = parseInt(tsStr, 10);
        if (!isNaN(ts) && (Date.now() - ts <= 24 * 60 * 60 * 1000)) {
          const expected = crypto.default.createHmac('sha256', correctPassword).update(tsStr).digest('hex');
          isAuth = (sig === expected);
        }
      }
    }

    if (!isAuth) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Administrative authentication required for uploads.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const dataUrl = body.data || body.image || '';
    const fileName = body.name || body.fileName || 'image.jpg';
    const folder = process.env.CLOUDINARY_FOLDER || body.folder || 'Website event images';
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || body.cloudName || 'uo0dcjpe';
    const preset = process.env.CLOUDINARY_UPLOAD_PRESET || body.uploadPreset || 'qux0sq4f';

    const apiKey = body.apiKey || process.env.CLOUDINARY_API_KEY || '';
    const apiSecret = body.apiSecret || process.env.CLOUDINARY_API_SECRET || '';

    if (!dataUrl) {
      return res.status(400).json({ success: false, error: 'No image data provided.' });
    }

    let cldUrl = null;

    // 1. Try signed upload if API key & secret available
    if (apiKey && apiSecret) {
      try {
        const crypto = await import('crypto');
        const ts = Math.floor(Date.now() / 1000);
        const toSign = `folder=${folder}&timestamp=${ts}`;
        const signature = crypto.default.createHash('sha1').update(toSign + apiSecret).digest('hex');

        const formData = new URLSearchParams();
        formData.append('file', dataUrl);
        formData.append('folder', folder);
        formData.append('timestamp', String(ts));
        formData.append('api_key', apiKey);
        formData.append('signature', signature);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });

        if (response.ok) {
          const json = await response.json();
          if (json && (json.secure_url || json.url)) {
            cldUrl = json.secure_url || json.url;
          }
        }
      } catch (err) {
        console.warn('Vercel signed Cloudinary upload error:', err);
      }
    }

    // 2. Try unsigned upload if not yet successful
    const presetsToTry = ['qux0sq4f', body.uploadPreset, preset, 'website_event_images', 'uo0dcjpe', 'ml_default', 'unsigned', 'website'].filter(Boolean);

    for (const p of presetsToTry) {
      if (cldUrl) break;
      try {
        const formData = new URLSearchParams();
        formData.append('file', dataUrl);
        formData.append('upload_preset', p);
        formData.append('folder', folder);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });

        if (response.ok) {
          const json = await response.json();
          if (json && (json.secure_url || json.url)) {
            cldUrl = json.secure_url || json.url;
            break;
          }
        }
      } catch (err) {
        // Continue to next preset
      }
    }

    if (cldUrl) {
      return res.status(200).json({
        success: true,
        url: cldUrl,
        secure_url: cldUrl,
        cloudinary: true,
        name: fileName
      });
    }

    // Fallback: return dataUrl
    return res.status(200).json({
      success: true,
      url: dataUrl,
      secure_url: dataUrl,
      cloudinary: false,
      name: fileName
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
