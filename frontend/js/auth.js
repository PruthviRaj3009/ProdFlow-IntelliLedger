/*
  auth.js
  -------
  UI-only auth/session simulation.

  Goals:
  - No real authentication
  - No API calls
  - Provide a stable contract that backend integration can later replace

  Session model (stored in localStorage):
  pf.session = {
    isAuthenticated: boolean,
    role: 'admin' | 'distributor' | 'sub_distributor',
    email: string,
    requiresPasswordChange: boolean
  }
*/

(function () {
  const PF = (window.PF = window.PF || {});

  const SESSION_KEY = 'pf.session';

  PF.auth = {
    getSession() {
      return PF.storage.get(SESSION_KEY, null);
    },

    setSession(session) {
      PF.storage.set(SESSION_KEY, session);
    },

    clearSession() {
      PF.storage.remove(SESSION_KEY);
    },

    isLoggedIn() {
      const s = PF.auth.getSession();
      return !!(s && s.isAuthenticated);
    },

    getRole() {
      return PF.auth.getSession()?.role || 'sub_distributor';
    },

    requireAuth() {
      // Redirect unauthenticated users to login.
      if (!PF.auth.isLoggedIn()) {
        window.location.href = PF.paths.login();
      }
    },

    requireRole(allowedRoles) {
      // Ensure logged in first.
      PF.auth.requireAuth();

      const role = PF.auth.getRole();
      const ok = allowedRoles.includes(role);
      if (!ok) {
        // UI-only: for now just show a message (if present) and prevent page interaction.
        const denied = document.getElementById('accessDenied');
        if (denied) denied.hidden = false;

        // Hide main content cards (simple protection for prototype)
        document.querySelectorAll('.pf-main .pf-card').forEach((el) => {
          el.style.display = 'none';
        });
      }

      return ok;
    },

    login({ email, role, remember }) {
      // UI-only: treat any non-empty email/password as "success".
      const requiresPasswordChange = false;

      PF.auth.setSession({
        isAuthenticated: true,
        role,
        email,
        requiresPasswordChange,
        remember: !!remember,
        createdAt: Date.now()
      });
    },

    logout() {
      PF.auth.clearSession();
      // On internal pages, go back to root login.
      window.location.href = PF.paths.login();
    }
  };

  // Page wiring
  document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Login page wiring
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      const emailEl = document.getElementById('email');
      const passEl = document.getElementById('password');
      const roleEl = document.getElementById('role');
      const rememberEl = document.getElementById('remember');
      const errorEl = document.getElementById('loginError');
      const toggleBtn = document.getElementById('togglePassword');

      const setError = (msg) => {
        if (!errorEl) return;
        errorEl.textContent = msg;
        errorEl.hidden = !msg;
      };

      const setInvalid = (el, invalid) => {
        if (!el) return;
        el.setAttribute('aria-invalid', invalid ? 'true' : 'false');
      };

      toggleBtn?.addEventListener('click', () => {
        const showing = passEl.type === 'text';
        passEl.type = showing ? 'password' : 'text';
        toggleBtn.setAttribute('aria-pressed', String(!showing));
        toggleBtn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
      });

      // Clear errors as user types
      const clearOnInput = (el) => {
        el?.addEventListener('input', () => {
          setInvalid(el, false);
          setError('');
        });
      };
      clearOnInput(emailEl);
      clearOnInput(passEl);

      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = (emailEl.value || '').trim();
        const password = (passEl.value || '');
        const role = roleEl?.value || 'sub_distributor';

        // Validate email format
        const emailCheck = PF.validation?.email?.(email);
        if (emailCheck && !emailCheck.ok) {
          setInvalid(emailEl, true);
          setError(emailCheck.message);
          return;
        }

        // Validate password format (UI-only policy)
        const pwdCheck = PF.validation?.password?.(password);
        if (pwdCheck && !pwdCheck.ok) {
          setInvalid(passEl, true);
          setError(pwdCheck.message);
          return;
        }

        setError('');
        setInvalid(emailEl, false);
        setInvalid(passEl, false);

        PF.auth.login({ email, role, remember: rememberEl?.checked });

        // Future expansion: if requiresPasswordChange, redirect to change-password.
        window.location.href = 'pages/dashboard.html';
      });

      // If already logged in, go to dashboard.
      if (PF.auth.isLoggedIn()) {
        window.location.href = 'pages/dashboard.html';
      }

      return;
    }

    // Internal page wiring
    if (PF.auth.isLoggedIn()) {
      const roleEl = document.getElementById('sessionRole');
      if (roleEl) {
        const r = PF.auth.getRole();
        roleEl.textContent = r.replace('_', ' ');
      }

      const logoutBtn = document.getElementById('logoutBtn');
      logoutBtn?.addEventListener('click', PF.auth.logout);
    }
  });
})();
