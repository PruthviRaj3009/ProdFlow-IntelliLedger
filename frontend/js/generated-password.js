/*
  generated-password.js
  ---------------------
  UI-only page reached after OTP verification.

  IMPORTANT:
  - This page does NOT generate passwords.
  - The user enters their own new password.

  Features:
  - Show/hide toggles
  - Rule validation (min 10, upper, lower, number, special)
  - Confirm match validation
  - Copy-to-clipboard button enabled only when valid
  - Toast/snackbar feedback
*/

(function () {
  const checksFor = (pwd) => {
    const v = String(pwd || '');
    return {
      len: v.length >= 10,
      upper: /[A-Z]/.test(v),
      lower: /[a-z]/.test(v),
      num: /\d/.test(v),
      special: /[^A-Za-z0-9]/.test(v)
    };
  };

  const toast = (el, msg) => {
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      el.hidden = true;
    }, 1400);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('setPasswordForm');
    if (!form) return;

    const newPwd = document.getElementById('newPassword');
    const confirmPwd = document.getElementById('confirmPassword');

    const toggleNewBtn = document.getElementById('toggleNewBtn');
    const toggleConfirmBtn = document.getElementById('toggleConfirmBtn');

    const copyBtn = document.getElementById('copyPrimaryBtn');
    const toastEl = document.getElementById('toast');

    const pwdMsg = document.getElementById('pwdMsg');
    const matchMsg = document.getElementById('matchMsg');

    const ruleEls = {
      len: document.getElementById('rLen'),
      upper: document.getElementById('rUpper'),
      lower: document.getElementById('rLower'),
      num: document.getElementById('rNum'),
      special: document.getElementById('rSpecial')
    };

    const setInline = (el, msg, kind) => {
      if (!el) return;
      el.textContent = msg || '';
      el.className = 'pf-inline' + (kind ? ` is-${kind}` : '');
    };

    const setRuleOk = (key, ok) => {
      const el = ruleEls[key];
      if (!el) return;
      el.classList.toggle('is-ok', !!ok);
    };

    const toggle = (input, btn) => {
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.setAttribute('aria-pressed', String(!showing));
      btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    };

    toggleNewBtn?.addEventListener('click', () => toggle(newPwd, toggleNewBtn));
    toggleConfirmBtn?.addEventListener('click', () => toggle(confirmPwd, toggleConfirmBtn));

    const validate = () => {
      const a = String(newPwd.value || '');
      const b = String(confirmPwd.value || '');

      const c = checksFor(a);
      Object.keys(c).forEach((k) => setRuleOk(k, c[k]));

      const strong = c.len && c.upper && c.lower && c.num && c.special;

      if (!a) {
        setInline(pwdMsg, 'New password is required.', 'error');
      } else if (!strong) {
        setInline(pwdMsg, 'Password does not meet the requirements.', 'error');
      } else {
        setInline(pwdMsg, 'Password meets requirements.', 'success');
      }

      let match = false;
      if (!b) {
        setInline(matchMsg, '', null);
      } else if (a !== b) {
        setInline(matchMsg, 'Passwords do not match.', 'error');
      } else {
        setInline(matchMsg, 'Passwords match.', 'success');
        match = true;
      }

      copyBtn.disabled = !(strong && match);
      return strong && match;
    };

    newPwd?.addEventListener('input', validate);
    confirmPwd?.addEventListener('input', validate);

    const copy = async () => {
      const ok = validate();
      if (!ok) return;

      const pwd = newPwd.value;
      try {
        await navigator.clipboard.writeText(pwd);
        toast(toastEl, 'Password copied to clipboard.');
      } catch {
        newPwd.type = 'text';
        newPwd.select();
        document.execCommand('copy');
        newPwd.type = 'password';
        toast(toastEl, 'Password copied to clipboard.');
      }
    };

    copyBtn?.addEventListener('click', copy);

    // Initial
    validate();
  });
})();
