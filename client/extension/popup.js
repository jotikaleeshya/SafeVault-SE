// Change this if your server runs on a different URL
const API_BASE = 'https://safevault-se-production.up.railway.app/api';

// ── Storage helpers ──────────────────────────────────────────────────────────

const storage = {
  get: (keys) => new Promise((resolve) => chrome.storage.local.get(keys, resolve)),
  set: (items) => new Promise((resolve) => chrome.storage.local.set(items, resolve)),
  remove: (keys) => new Promise((resolve) => chrome.storage.local.remove(keys, resolve)),
};

// ── API helpers ──────────────────────────────────────────────────────────────

async function apiLogin(email, masterPassword) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, masterPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data; // { token, user }
}

async function apiGetEntries(token) {
  const res = await fetch(`${API_BASE}/vault`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw Object.assign(new Error('Unauthorized'), { status: 401 });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch entries');
  return data.entries; // array of vault entry objects
}

async function apiGetSettings(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user?.settings ?? null;
}

async function apiRevealEntry(token, id) {
  const res = await fetch(`${API_BASE}/vault/${id}/reveal`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw Object.assign(new Error('Unauthorized'), { status: 401 });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to reveal entry');
  return data.entry; // { _id, siteName, siteURL, username, password (decrypted) }
}

// ── Domain matching ──────────────────────────────────────────────────────────

function normHost(rawUrl) {
  try {
    const full = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    return new URL(full).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
}

function matchesDomain(entry, hostname) {
  const raw = (entry.siteURL || '').trim();
  if (!raw) return false;

  const entryHost = normHost(raw);
  const currentHost = hostname.toLowerCase().replace(/^www\./, '');

  if (!entryHost) {
    // Fallback: plain string contains
    return raw.toLowerCase().includes(currentHost);
  }

  return (
    entryHost === currentHost ||
    currentHost.endsWith(`.${entryHost}`) ||
    entryHost.endsWith(`.${currentHost}`)
  );
}

// ── DOM shortcuts ────────────────────────────────────────────────────────────

const $ = (id) => document.getElementById(id);

document.getElementById('toggle-password').addEventListener('click', () => {
  const input = document.getElementById('master-password');
  const icon = document.getElementById('eye-icon');
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  icon.innerHTML = isPassword
    ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
});

const show = (el) => el.classList.remove('hidden');
const hide = (el) => el.classList.add('hidden');

function showToast(msg, isError = false) {
  const toast = $('toast');
  toast.textContent = msg;
  toast.classList.toggle('error-toast', isError);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function showView(id) {
  ['loading-view', 'login-view', 'main-view'].forEach((v) => {
    $(v).classList.toggle('hidden', v !== id);
  });
}

// ── Autofill / copy actions ──────────────────────────────────────────────────

async function getRevealedPassword(entry) {
  const { sv_token: token } = await storage.get(['sv_token']);
  return apiRevealEntry(token, entry._id);
}

async function handleAutofill(entry, btn) {
  btn.disabled = true;
  btn.textContent = 'Filling…';

  try {
    const revealed = await getRevealedPassword(entry);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'SAFEVAULT_AUTOFILL',
        username: revealed.username || revealed.email || entry.username || '',
        password: revealed.password,
      });
    } catch {
      // Content script might not be injected yet — programmatically inject then retry
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content_script.js'] });
      await chrome.tabs.sendMessage(tab.id, {
        type: 'SAFEVAULT_AUTOFILL',
        username: revealed.username || revealed.email || entry.username || '',
        password: revealed.password,
      });
    }

    showToast('Autofilled!');
  } catch (err) {
    console.error('Autofill error:', err);
    showToast('Autofill failed — no login form found?', true);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Autofill';
  }
}

async function handleCopy(entry, btn) {
  btn.disabled = true;
  const original = btn.textContent;

  try {
    const revealed = await getRevealedPassword(entry);
    await navigator.clipboard.writeText(revealed.password);
    btn.textContent = '✓ Copied!';
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 2000);
  } catch (err) {
    console.error('Copy error:', err);
    btn.disabled = false;
    btn.textContent = original;
    showToast('Copy failed', true);
  }
}

// ── Entry card ───────────────────────────────────────────────────────────────

function buildEntryCard(entry, autofillEnabled) {
  const card = document.createElement('div');
  card.className = 'entry-card';

  if (!autofillEnabled) {
    const banner = document.createElement('div');
    banner.className = 'autofill-disabled-banner';
    banner.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="3" stroke-linecap="round"/>
      </svg>
      Autofill is disabled. Enable it in Settings.
    `;
    card.append(banner);
    return card;
  }

  const site = document.createElement('div');
  site.className = 'entry-site';
  site.textContent = entry.siteName || entry.siteURL || 'Unknown site';

  const uname = document.createElement('div');
  uname.className = 'entry-username';
  uname.textContent = entry.username || '—';

  const autofillBtn = document.createElement('button');
  autofillBtn.className = 'btn-autofill';
  autofillBtn.textContent = 'Autofill';
  autofillBtn.addEventListener('click', () => handleAutofill(entry, autofillBtn));

  const copyBtn = document.createElement('button');
  copyBtn.className = 'btn-copy';
  copyBtn.textContent = 'Copy pw';
  copyBtn.addEventListener('click', () => handleCopy(entry, copyBtn));

  const actions = document.createElement('div');
  actions.className = 'entry-actions';
  actions.append(autofillBtn, copyBtn);

  card.append(site, uname, actions);
  return card;
}

// ── Main view ────────────────────────────────────────────────────────────────

async function loadMainView() {
  showView('main-view');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let hostname = '';
  try {
    hostname = new URL(tab.url).hostname;
  } catch {
    hostname = tab.url || '';
  }
  $('current-domain').textContent = hostname || '—';

  const loadingEl = $('entries-loading');
  const noEntriesEl = $('no-entries');
  const errorEl = $('error-state');
  const listEl = $('entries-list');

  show(loadingEl);
  hide(noEntriesEl);
  hide(errorEl);
  listEl.innerHTML = '';

  try {
    const { sv_token: token } = await storage.get(['sv_token']);
    const [entries, settings] = await Promise.all([apiGetEntries(token), apiGetSettings(token)]);
    const autofillEnabled = settings?.autofill ?? true;

    hide(loadingEl);

    // Cek autofill dulu sebelum apapun
    if (!autofillEnabled) {
      const warn = document.createElement('div');
      warn.className = 'state-msg';
      warn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="3" stroke-linecap="round"/>
        </svg>
        <p>Autofill is disabled.</p>
        <p class="hint">Enable it in SafeVault Settings to use this extension.</p>
      `;
      listEl.appendChild(warn);
      return;
    }

    // Baru cek domain
    const matched = entries.filter((e) => matchesDomain(e, hostname));

    if (matched.length === 0) {
      show(noEntriesEl);
    } else {
      matched.forEach((e) => listEl.appendChild(buildEntryCard(e, autofillEnabled)));
    }
  } catch (err) {
    hide(loadingEl);
    if (err.status === 401) {
      await storage.remove(['sv_token']);
      showView('login-view');
    } else {
      $('error-text').textContent = err.message || 'Failed to load vault';
      show(errorEl);
    }
  }
}

// ── Login form ───────────────────────────────────────────────────────────────

$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = $('email').value.trim();
  const password = $('master-password').value;
  const errorEl = $('login-error');
  const btn = $('login-btn');

  hide(errorEl);
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  try {
    const data = await apiLogin(email, password);
    await storage.set({ sv_token: data.token });
    await loadMainView();
  } catch (err) {
    errorEl.textContent = err.message || 'Login failed';
    show(errorEl);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
});

$('logout-btn').addEventListener('click', async () => {
  await storage.remove(['sv_token']);
  showView('login-view');
});

// ── Init ─────────────────────────────────────────────────────────────────────

(async () => {
  const { sv_token: token } = await storage.get(['sv_token']);
  if (token) {
    await loadMainView();
  } else {
    showView('login-view');
  }
})();
