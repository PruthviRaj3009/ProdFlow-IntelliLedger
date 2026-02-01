/*
  forgot-password.js
  ------------------
  UI-only progressive Forgot Password flow.

  Steps:
  1) Identify user (email or phone) -> Send OTP
  2) Verify OTP (static: 123456) + resend timer
  3) Reset password -> show success

  No backend / no API calls.
*/

(function () {
  const PF = (window.PF = window.PF || {});

  // Basic validators (UI-only)
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const isPhone = (v) => /^\+?[0-9][0-9\s-]{7,}$/.test(v); // permissive

  const passwordChecks = (pwd) => {
    const v = String(pwd || '');
    return {
      len: v.length >= 8,
      upper: /[A-Z]/.test(v),
      num: /\d/.test(v),
      special: /[^A-Za-z0-9]/.test(v)
    };
  };

  document.addEventListener('DOMContentLoaded', () => {
    const stepIdentify = document.getElementById('stepIdentify');
    const stepOtp = document.getElementById('stepOtp');
    const stepReset = document.getElementById('stepReset');

    const fpSuccess = document.getElementById('fpSuccess');
    const fpError = document.getElementById('fpError');

    const identifier = document.getElementById('identifier');
    const identifierMsg = document.getElementById('identifierMsg');
    const identifyForm = document.getElementById('identifyForm');
    const sendOtpBtn = document.getElementById('sendOtpBtn');

    const otpForm = document.getElementById('otpForm');
    const otpMsg = document.getElementById('otpMsg');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const otpBoxes = Array.from(document.querySelectorAll('.pf-otp__box'));
    const timerEl = document.getElementById('timer');
    const resendBtn = document.getElementById('resendBtn');

    const resetForm = document.getElementById('resetForm');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const pwdMsg = document.getElementById('pwdMsg');
    const matchMsg = document.getElementById('matchMsg');
    const resetBtn = document.getElementById('resetBtn');

    const rules = {
      len: document.getElementById('rLen'),
      upper: document.getElementById('rUpper'),
      num: document.getElementById('rNum'),
      special: document.getElementById('rSpecial')
    };

    const setHidden = (el, hidden) => {
      if (!el) return;
      el.hidden = !!hidden;
    };

    const setInline = (el, msg, type) => {
      if (!el) return;
      el.textContent = msg || '';
      el.classList.remove('is-error', 'is-success');
      if (type) el.classList.add(type === 'error' ? 'is-error' : 'is-success');
    };

    const showError = (msg) => {
      setHidden(fpSuccess, true);
      if (fpError) {
        fpError.textContent = msg;
        fpError.hidden = !msg;
      }
    };

    const clearGlobal = () => {
      setHidden(fpError, true);
      setHidden(fpSuccess, true);
    };

    // Step 1: identifier validation
    const validateIdentifier = () => {
      const v = String(identifier.value || '').trim();
      if (!v) {
        setInline(identifierMsg, 'This field is required.', 'error');
        sendOtpBtn.disabled = true;
        return false;
      }
      const ok = isEmail(v) || isPhone(v);
      if (!ok) {
        setInline(identifierMsg, 'Enter a valid email or phone number.', 'error');
        sendOtpBtn.disabled = true;
        return false;
      }
      setInline(identifierMsg, 'Looks good.', 'success');
      sendOtpBtn.disabled = false;
      return true;
    };

    identifier?.addEventListener('input', () => {
      clearGlobal();
      validateIdentifier();
    });

    // Step 2: OTP simulation
    const OTP_VALUE = '123456';
    let otpExpiresAt = 0;
    let timerId = null;

    const startTimer = (seconds) => {
      const end = Date.now() + seconds * 1000;
      otpExpiresAt = end;
      resendBtn.disabled = true;
      if (timerId) clearInterval(timerId);

      const tick = () => {
        const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
        if (timerEl) timerEl.textContent = String(left);
        if (left <= 0) {
          resendBtn.disabled = false;
          if (timerId) clearInterval(timerId);
        }
      };

      tick();
      timerId = setInterval(tick, 250);
    };

    const getOtp = () => otpBoxes.map((b) => (b.value || '').trim()).join('');

    const validateOtpBoxes = () => {
      const otp = getOtp();
      verifyOtpBtn.disabled = otp.length !== 6;
    };

    otpBoxes.forEach((box, idx) => {
      box.addEventListener('input', (e) => {
        clearGlobal();
        setInline(otpMsg, '', null);

        // accept digits only
        box.value = (box.value || '').replace(/\D/g, '').slice(0, 1);
        if (box.value && idx < otpBoxes.length - 1) otpBoxes[idx + 1].focus();
        validateOtpBoxes();
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && idx > 0) {
          otpBoxes[idx - 1].focus();
        }
      });
    });

    identifyForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      clearGlobal();

      if (!validateIdentifier()) return;

      // Reveal OTP step
      setHidden(stepOtp, false);
      setInline(otpMsg, 'OTP sent. (UI-only demo OTP: 123456)', 'success');

      // Reset OTP boxes
      otpBoxes.forEach((b) => (b.value = ''));
      otpBoxes[0]?.focus();
      verifyOtpBtn.disabled = true;

      // Start resend timer: 30s
      startTimer(30);

      // Scroll to step 2
      stepOtp?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    resendBtn?.addEventListener('click', () => {
      clearGlobal();
      setInline(otpMsg, 'OTP resent. (UI-only demo OTP: 123456)', 'success');
      otpBoxes.forEach((b) => (b.value = ''));
      otpBoxes[0]?.focus();
      verifyOtpBtn.disabled = true;
      startTimer(30);
    });

    otpForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      clearGlobal();

      const otp = getOtp();
      if (Date.now() > otpExpiresAt) {
        setInline(otpMsg, 'OTP expired.', 'error');
        return;
      }
      if (otp !== OTP_VALUE) {
        setInline(otpMsg, 'Invalid OTP.', 'error');
        return;
      }

      setInline(otpMsg, 'OTP verified.', 'success');

      // Navigate to the generated password confirmation page.
      // (UI-only; no backend state)
      window.location.href = 'generated-password.html';
    });

    // Step 3: Reset password
    const renderPwdRules = () => {
      const checks = passwordChecks(newPassword.value);
      const setRule = (el, ok) => el?.classList.toggle('is-ok', !!ok);
      setRule(rules.len, checks.len);
      setRule(rules.upper, checks.upper);
      setRule(rules.num, checks.num);
      setRule(rules.special, checks.special);
      return checks;
    };

    const validateReset = () => {
      clearGlobal();

      const a = String(newPassword.value || '');
      const b = String(confirmPassword.value || '');

      const checks = renderPwdRules();
      const pwdOk = checks.len && checks.upper && checks.num && checks.special;

      if (!a) {
        setInline(pwdMsg, 'New password is required.', 'error');
      } else if (!pwdOk) {
        setInline(pwdMsg, 'Password does not meet the requirements.', 'error');
      } else {
        setInline(pwdMsg, 'Password meets requirements.', 'success');
      }

      let matchOk = false;
      if (!b) {
        setInline(matchMsg, '', null);
      } else if (a !== b) {
        setInline(matchMsg, 'Passwords do not match.', 'error');
      } else {
        setInline(matchMsg, 'Passwords match.', 'success');
        matchOk = true;
      }

      resetBtn.disabled = !(pwdOk && matchOk);
    };

    newPassword?.addEventListener('input', validateReset);
    confirmPassword?.addEventListener('input', validateReset);

    resetForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      validateReset();

      if (!resetBtn.disabled) {
        showError('');
        setHidden(fpSuccess, false);
        fpSuccess.textContent = 'Password reset successfully. Please log in.';

        // Hide steps (optional)
        setHidden(stepIdentify, true);
        setHidden(stepOtp, true);
        // Keep reset step visible to show message + Back to Sign In link
      }
    });

    // Initialize
    validateIdentifier();
    validateOtpBoxes();
    validateReset();

    // Default: hide step 2 & 3
    setHidden(stepOtp, true);
    setHidden(stepReset, true);
  });
})();
