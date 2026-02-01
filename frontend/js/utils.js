/*
  utils.js
  --------
  Small, dependency-free utilities shared across pages.

  Keep this file stable and framework-agnostic.
*/

(function () {
  const PF = (window.PF = window.PF || {});

  PF.storage = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
      localStorage.removeItem(key);
    }
  };

  PF.dom = {
    $(sel, root) {
      return (root || document).querySelector(sel);
    },
    $all(sel, root) {
      return Array.from((root || document).querySelectorAll(sel));
    }
  };

  PF.format = {
    currency(amount) {
      const n = Number(amount || 0);
      return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
    }
  };

  PF.validation = {
    // Email: pragmatic UI validation (not full RFC).
    email(value) {
      const v = String(value || '').trim();
      if (!v) return { ok: false, message: 'Email is required.' };

      // Simple and widely used pattern for UI validation.
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!re.test(v)) {
        return { ok: false, message: 'Enter a valid email (e.g., name@company.com).' };
      }
      return { ok: true, message: '' };
    },

    // Password: 8-64 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special.
    // UI-only: these rules can be adjusted later to match backend policy.
    password(value) {
      const v = String(value || '');
      if (!v.trim()) return { ok: false, message: 'Password is required.' };
      if (v.length < 8 || v.length > 64) {
        return { ok: false, message: 'Password must be 8–64 characters long.' };
      }
      if (/\s/.test(v)) {
        return { ok: false, message: 'Password must not contain spaces.' };
      }

      const hasLower = /[a-z]/.test(v);
      const hasUpper = /[A-Z]/.test(v);
      const hasNumber = /\d/.test(v);
      const hasSpecial = /[^A-Za-z0-9]/.test(v);

      if (!(hasLower && hasUpper && hasNumber && hasSpecial)) {
        return {
          ok: false,
          message: 'Password must include uppercase, lowercase, number, and special character.'
        };
      }

      // Optional weak-password blocklist (UI-only, small sample).
      const lowered = v.toLowerCase();
      const blocked = ['password', 'password123', 'admin123', 'qwerty', 'letmein'];
      if (blocked.some((b) => lowered.includes(b))) {
        return { ok: false, message: 'Password is too common. Choose a stronger password.' };
      }

      return { ok: true, message: '' };
    }
  };

  PF.paths = {
    // Internal pages live in /pages; login is root.
    login() {
      return '../index.html';
    }
  };
})();
