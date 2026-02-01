(() => {
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('formError');
  const emailEl = document.getElementById('email');
  const passwordEl = document.getElementById('password');
  const toggleBtn = document.getElementById('togglePassword');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const setError = (message) => {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = !message;
  };

  const setInvalid = (el, isInvalid) => {
    if (!el) return;
    el.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
  };

  const trimValue = (el) => (el?.value ?? '').trim();

  // UI-only: password visibility toggle
  if (toggleBtn && passwordEl) {
    toggleBtn.addEventListener('click', () => {
      const showing = passwordEl.type === 'text';
      passwordEl.type = showing ? 'password' : 'text';

      toggleBtn.setAttribute('aria-pressed', String(!showing));
      toggleBtn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  }

  // Clear error state as user types
  const attachClear = (el) => {
    if (!el) return;
    el.addEventListener('input', () => {
      setInvalid(el, false);
      if (!trimValue(emailEl) || !trimValue(passwordEl)) return;
      setError('');
    });
  };

  attachClear(emailEl);
  attachClear(passwordEl);

  // UI-only: basic empty-field validation
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = trimValue(emailEl);
      const password = trimValue(passwordEl);

      let hasError = false;

      if (!email) {
        setInvalid(emailEl, true);
        hasError = true;
      }
      if (!password) {
        setInvalid(passwordEl, true);
        hasError = true;
      }

      if (hasError) {
        setError('Please enter your email address and password.');
        (email ? passwordEl : emailEl)?.focus();
        return;
      }

      // No backend calls / authentication. UI prototype only.
      setError('');

      // Optional UI feedback: simulate a successful submission without navigating.
      // Keep it minimal and non-animated.
      alert('UI prototype: Form submitted. No authentication is performed.');
    });
  }
})();
