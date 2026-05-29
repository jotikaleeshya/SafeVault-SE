// Injected into every page. Listens for autofill commands from the popup.

function isVisible(el) {
  const s = window.getComputedStyle(el);
  return (
    s.display !== 'none' &&
    s.visibility !== 'hidden' &&
    s.opacity !== '0' &&
    el.offsetParent !== null
  );
}

function findLoginFields() {
  const passwordFields = Array.from(document.querySelectorAll('input[type="password"]')).filter(isVisible);
  if (passwordFields.length === 0) return null;

  const passwordField = passwordFields[0];
  const allInputs = Array.from(document.querySelectorAll('input')).filter(isVisible);
  const pwIdx = allInputs.indexOf(passwordField);

  let usernameField = null;
  for (let i = pwIdx - 1; i >= 0; i--) {
    const t = (allInputs[i].type || '').toLowerCase();
    if (t === 'email' || t === 'text' || t === 'tel') {
      usernameField = allInputs[i];
      break;
    }
  }

  return { usernameField, passwordField };
}

// Sets a field value in a way that triggers React / Vue / Angular change detection
function fillField(el, value) {
  if (!el) return;
  el.focus();

  const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  if (nativeSet) {
    nativeSet.call(el, value);
  } else {
    el.value = value;
  }

  el.dispatchEvent(new Event('input',  { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  el.blur();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== 'SAFEVAULT_AUTOFILL') return;

  const fields = findLoginFields();
  if (!fields) {
    sendResponse({ success: false, error: 'No password field found on this page' });
    return;
  }

  const { usernameField, passwordField } = fields;

  if (usernameField && message.username) fillField(usernameField, message.username);
  fillField(passwordField, message.password);

  sendResponse({ success: true });
});
