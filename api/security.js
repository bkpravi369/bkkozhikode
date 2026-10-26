const crypto = require('crypto');

/**
 * Brahma Kumaris Kozhikode - Central Security & Sanitization Layer
 */

const DEFAULT_SECRET = process.env.ADMIN_PASSWORD || 'Kozhikode@2026';

/**
 * Verify HMAC SHA-256 Signed Admin Session Token (24-hour expiration)
 */
function verifyToken(token, secret = DEFAULT_SECRET) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [tsStr, sig] = parts;
  const ts = parseInt(tsStr, 10);
  if (isNaN(ts)) return false;
  
  // 24 hour expiry
  if (Date.now() - ts > 24 * 60 * 60 * 1000) return false;
  // Future timestamp defense (max 5 minutes clock skew)
  if (ts - Date.now() > 5 * 60 * 1000) return false;

  const expected = crypto.createHmac('sha256', secret).update(tsStr).digest('hex');
  if (sig.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch (e) {
    return false;
  }
}

/**
 * Generate HMAC SHA-256 Signed Admin Session Token
 */
function generateToken(secret = DEFAULT_SECRET) {
  const ts = Date.now().toString();
  const sig = crypto.createHmac('sha256', secret).update(ts).digest('hex');
  return `${ts}.${sig}`;
}

/**
 * Sanitize plain string against XSS & script injection
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onclick\s*=/gi, '')
    .replace(/onmouseover\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .trim();
}

/**
 * Sanitize URL to prevent javascript: or data: injection
 */
function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  const clean = url.trim();
  if (!clean) return '';
  if (/^(https?:\/\/|\/|assets\/|data:image\/)/i.test(clean)) {
    return clean;
  }
  return '';
}

/**
 * Recursively sanitize objects and arrays
 */
function sanitizeObject(val) {
  if (typeof val === 'string') {
    return sanitizeString(val);
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeObject);
  }
  if (val && typeof val === 'object') {
    const clean = {};
    for (const [k, v] of Object.entries(val)) {
      // Disallow dangerous prototype pollution keys
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      clean[sanitizeString(k)] = sanitizeObject(v);
    }
    return clean;
  }
  return val;
}

/**
 * Strip sensitive administrative credentials before sending data to public visitors
 */
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

module.exports = {
  verifyToken,
  generateToken,
  sanitizeString,
  sanitizeUrl,
  sanitizeObject,
  stripSensitiveFields,
  DEFAULT_SECRET
};
