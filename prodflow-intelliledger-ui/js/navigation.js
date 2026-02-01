/*
  navigation.js
  -------------
  Sidebar/menu behaviors.

  Responsibilities:
  - Ensure user is authenticated on internal pages
  - Hide menu items that are not allowed for a role (UI-only)
  - Highlight the active page link

  Menu items can specify:
    data-requires-role="admin,distributor"
*/

(function () {
  const PF = (window.PF = window.PF || {});

  document.addEventListener('DOMContentLoaded', () => {
    // Skip login page.
    if (document.getElementById('loginForm')) return;

    PF.auth.requireAuth();

    const role = PF.auth.getRole();

    // Hide disallowed menu items.
    document.querySelectorAll('[data-requires-role]').forEach((el) => {
      const allowed = String(el.getAttribute('data-requires-role') || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (allowed.length && !allowed.includes(role)) {
        el.classList.add('pf-hidden');
      }
    });

    // Active link highlighting.
    const current = location.pathname.split('/').pop();
    document.querySelectorAll('[data-nav]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href) return;

      const isActive = href === current;
      if (isActive) {
        a.style.background = 'rgba(15,118,110,0.08)';
        a.style.border = '1px solid rgba(15,118,110,0.20)';
      } else {
        a.style.border = '1px solid transparent';
      }
    });

    // Page-level guard: users.html should only be visible to admin/distributor.
    if (current === 'users.html') {
      PF.auth.requireRole(['admin', 'distributor']);
    }
  });
})();
