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

  PF.paths = {
    // Internal pages live in /pages; login is root.
    login() {
      return '../index.html';
    }
  };
})();
