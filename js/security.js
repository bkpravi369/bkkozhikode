/**
 * Brahma Kumaris Kozhikode — Client-Side Security & Sanitization Layer
 * Provides robust XSS protection, input sanitization, and secure token management.
 */

(function () {
  'use strict';

  const bkSecurity = {
    /**
     * Escape special HTML characters to prevent XSS injection
     */
    escapeHtml(str) {
      if (typeof str !== 'string') return '';
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return str.replace(/[&<>"']/g, m => map[m]);
    },

    /**
     * Sanitize plain text string (strips tags and executable script schemes)
     */
    sanitizeText(str) {
      if (typeof str !== 'string') return '';
      return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
        .replace(/javascript\s*:/gi, '')
        .replace(/vbscript\s*:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    },

    /**
     * Sanitize URL ensuring only secure protocols (http, https, relative, safe data image)
     */
    sanitizeUrl(url) {
      if (typeof url !== 'string') return '';
      const clean = url.trim();
      if (!clean) return '';
      if (/^(https?:\/\/|\/|assets\/|data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,)/i.test(clean)) {
        return clean;
      }
      return '';
    },

    /**
     * Sanitize all inputs within a form element before processing
     */
    sanitizeFormInputs(formElement) {
      if (!formElement) return {};
      const inputs = formElement.querySelectorAll('input, textarea, select');
      const sanitized = {};
      inputs.forEach(input => {
        if (!input.name && !input.id) return;
        const key = input.name || input.id;
        const val = input.value;
        if (input.type === 'email') {
          sanitized[key] = this.sanitizeText(val).toLowerCase();
        } else if (input.type === 'url') {
          sanitized[key] = this.sanitizeUrl(val);
        } else if (input.type === 'checkbox') {
          sanitized[key] = input.checked;
        } else {
          sanitized[key] = this.sanitizeText(val);
        }
      });
      return sanitized;
    },

    /**
     * Get active admin session token
     */
    getAdminToken() {
      return (typeof sessionStorage !== 'undefined') ? (sessionStorage.getItem('bk_admin_token') || '') : '';
    },

    /**
     * Check if admin token is present and structurally valid
     */
    hasAdminToken() {
      const token = this.getAdminToken();
      return Boolean(token && token.includes('.') && token.split('.').length === 2);
    },

    /**
     * Clear admin session token
     */
    clearAdminSession() {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('bk_admin_token');
        sessionStorage.removeItem('bk_kozhikode_admin_session');
        sessionStorage.removeItem('bk_admin_session_auth');
      }
    }
  };

  window.bkSecurity = Object.freeze(bkSecurity);
})();
