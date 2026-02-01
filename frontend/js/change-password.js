/*
  change-password.js
  ------------------
  UI-only Change Password behaviors:
  - show/hide password toggles
  - strength indicator (Weak / Medium / Strong)
  - inline rules (min 8, uppercase, number, special)
  - confirm match validation
  - disable Update button until valid
  - success + error feedback states

  No backend calls.
*/

(function () {
  const PF = (window.PF = window.PF || {});

  // This page is an internal page; require session.
  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    const isForgotMode = params.get('mode') === 'forgot';

    // Normal behavior: internal page requires a session.
    // UI-only exception: forgot mode lets users open this screen from login.
    if (!isForgotMode) {
      PF.auth?.requireAuth?.();
    } else {
      document.body.classList.add('pf-forgot-mode');
    }

    const form = document.getElementById('changePasswordForm');
    if (!form) return;

    const cur = document.getElementById('currentPassword');
    const next = document.getElementById('newPassword');
    const confirm = document.getElementById('confirmPassword');

    const updateBtn = document.getElementById('updateBtn');

    // In forgot mode, replace the Logout button with a "Back to Sign In" action.
    if (isForgotMode) {
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.textContent = 'Back to Sign In';
        logoutBtn.addEventListener('click', () => {
          window.location.href = '../index.html';
        });
      }

      // Role badge may be empty; hide it.
      const roleBadge = document.getElementById('sessionRole');
      if (roleBadge) roleBadge.style.display = 'none';
    }

    const successEl = document.getElementById('cpSuccess');
    const errorEl = document.getElementById('cpError');

    const curMsg = document.getElementById('curMsg');
    const newMsg = document.getElementById('newMsg');
    const matchMsg = document.getElementById('matchMsg');

    const strengthFill = document.getElementById('strengthFill');
    const strengthPill = document.getElementById('strengthPill');

    const rules = {
      len: document.getElementById('ruleLen'),
      upper: document.getElementById('ruleUpper'),
      num: document.getElementById('ruleNum'),
      special: document.getElementById('ruleSpecial')
    };

    const setHidden = (el, hidden) => {
      if (!el) return;
      el.hidden = !!hidden;
    };

    const setInlineMsg = (el, msg, type) => {
      if (!el) return;
      el.textContent = msg || '';
      el.classList.remove('is-error', 'is-success');
      if (type) el.classList.add(type === 'error' ? 'is-error' : 'is-success');
    };

    const setInvalid = (input, invalid) => {
      if (!input) return;
      input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    };

    // Eye toggles
    document.querySelectorAll('[data-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-toggle');
        const input = document.getElementById(id);
        if (!input) return;

        const showing = input.type === 'text';
        input.type = showing ? 'password' : 'text';
        btn.setAttribute('aria-pressed', String(!showing));
        btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
      });
    });

    // Strength calculation (UI-only)
    const strength = (pwd) => {
      const v = String(pwd || '');
      const checks = {
        len: v.length >= 8,
        upper: /[A-Z]/.test(v),
        num: /\d/.test(v),
        special: /[^A-Za-z0-9]/.test(v)
      };

      const score = Object.values(checks).filter(Boolean).length;
      // Weak: 0-2, Medium: 3, Strong: 4
      const level = score <= 2 ? 'weak' : score === 3 ? 'medium' : 'strong';
      return { checks, score, level };
    };

    const renderStrength = () => {
      const v = next.value || '';
      const { checks, score, level } = strength(v);

      // Update requirement ticks
      const setRule = (el, ok) => {
        if (!el) return;
        el.classList.toggle('is-ok', !!ok);
      };
      setRule(rules.len, checks.len);
      setRule(rules.upper, checks.upper);
      setRule(rules.num, checks.num);
      setRule(rules.special, checks.special);

      // Bar fill
      const pct = (score / 4) * 100;
      if (strengthFill) {
        strengthFill.style.width = `${pct}%`;
        if (level === 'weak') strengthFill.style.background = 'rgba(180,35,24,0.60)';
        if (level === 'medium') strengthFill.style.background = 'rgba(180,83,9,0.70)';
        if (level === 'strong') strengthFill.style.background = 'rgba(6,118,71,0.70)';
      }

      if (strengthPill) {
        strengthPill.textContent = level[0].toUpperCase() + level.slice(1);
        strengthPill.setAttribute('data-level', level);
      }

      return { checks, level };
    };

    const validateMatch = () => {
      const a = String(next.value || '');
      const b = String(confirm.value || '');

      if (!b) {
        setInlineMsg(matchMsg, '', null);
        setInvalid(confirm, false);
        return { ok: false, empty: true };
      }

      if (a !== b) {
        setInlineMsg(matchMsg, 'Passwords do not match.', 'error');
        setInvalid(confirm, true);
        return { ok: false };
      }

      setInlineMsg(matchMsg, 'Passwords match.', 'success');
      setInvalid(confirm, false);
      return { ok: true };
    };

    const validateAll = () => {
      setHidden(successEl, true);
      setHidden(errorEl, true);

      // Current password required
      const curVal = (cur.value || '').trim();
      if (!curVal) {
        setInlineMsg(curMsg, 'Current password is required.', 'error');
        setInvalid(cur, true);
      } else {
        setInlineMsg(curMsg, '', null);
        setInvalid(cur, false);
      }

      // New password rules (min 8 + uppercase + number + special)
      const { checks, level } = renderStrength();

      const newVal = String(next.value || '');
      const newOk = checks.len && checks.upper && checks.num && checks.special;

      if (!newVal) {
        setInlineMsg(newMsg, 'New password is required.', 'error');
        setInvalid(next, true);
      } else if (!newOk) {
        setInlineMsg(newMsg, 'Password does not meet the requirements.', 'error');
        setInvalid(next, true);
      } else {
        // Treat "medium" or "strong" as acceptable; requirements ensure at least medium.
        setInlineMsg(newMsg, `Strength: ${level[0].toUpperCase() + level.slice(1)}`, 'success');
        setInvalid(next, false);
      }

      const match = validateMatch();

      const allOk = !!curVal && newOk && match.ok;
      if (updateBtn) updateBtn.disabled = !allOk;

      return allOk;
    };

    // Revalidate on typing
    [cur, next, confirm].forEach((el) => {
      el?.addEventListener('input', validateAll);
      el?.addEventListener('blur', validateAll);
    });

    // Initial render
    validateAll();

    // Submit (UI-only)
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const ok = validateAll();
      if (!ok) return;

      // UI-only: simulate incorrect current password if user types "wrong".
      const curVal = (cur.value || '').trim().toLowerCase();
      if (curVal === 'wrong') {
        setHidden(errorEl, false);
        errorEl.textContent = 'Current password is incorrect.';
        setInvalid(cur, true);
        return;
      }

      setHidden(errorEl, true);
      setHidden(successEl, false);
      successEl.textContent = 'Password updated successfully.';

      // Optional UX: simulate logout after change.
      // In forgot mode we just show success; in normal mode we log out.
      if (!isForgotMode) {
        setTimeout(() => {
          PF.auth?.logout?.();
        }, 1200);
      }
    });
  });
})();
