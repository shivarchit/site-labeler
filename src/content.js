// Get the site key (host:port or hostname)
function getSiteKey() {
  return window.location.host || window.location.hostname;
}

function removeExistingLabel() {
  const old = document.getElementById('custom-site-label-box');
  if (old) old.remove();
}

function getDefaultSettings(siteKey) {
  const entry = SITE_LABELS[siteKey] || SITE_LABELS[window.location.hostname];
  if (!entry) {
    return {
      labelText: '',
      labelPosition: 'top-left',
      labelBgColor: '#222222',
      labelOpacity: 1
    };
  }
  // If entry is a string (legacy), treat as labelText only
  if (typeof entry === 'string') {
    return {
      labelText: entry,
      labelPosition: 'top-left',
      labelBgColor: '#222222',
      labelOpacity: 1
    };
  }
  return {
    labelText: entry.labelText || '',
    labelPosition: entry.labelPosition || 'top-left',
    labelBgColor: entry.labelBgColor || '#222222',
    labelOpacity: typeof entry.labelOpacity === 'number' ? entry.labelOpacity : 1
  };
}

function renderLabel(settings) {
  removeExistingLabel();
  if (!settings.labelText) return;
  const labelBox = document.createElement('div');
  labelBox.textContent = settings.labelText;
  labelBox.style.position = 'fixed';
  // Position logic
  if (settings.labelPosition === 'top-left') {
    labelBox.style.top = '10px';
    labelBox.style.left = '10px';
    labelBox.style.right = '';
    labelBox.style.bottom = '';
  } else if (settings.labelPosition === 'top-right') {
    labelBox.style.top = '10px';
    labelBox.style.right = '10px';
    labelBox.style.left = '';
    labelBox.style.bottom = '';
  } else if (settings.labelPosition === 'bottom-left') {
    labelBox.style.bottom = '10px';
    labelBox.style.left = '10px';
    labelBox.style.top = '';
    labelBox.style.right = '';
  } else if (settings.labelPosition === 'bottom-right') {
    labelBox.style.bottom = '10px';
    labelBox.style.right = '10px';
    labelBox.style.top = '';
    labelBox.style.left = '';
  }
  labelBox.style.background = settings.labelBgColor;
  labelBox.style.opacity = settings.labelOpacity;
  labelBox.style.color = '#fff';
  labelBox.style.padding = '6px 16px';
  labelBox.style.borderRadius = '6px';
  labelBox.style.zIndex = 99999;
  labelBox.style.fontSize = '16px';
  labelBox.style.fontFamily = 'sans-serif';
  labelBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  labelBox.id = 'custom-site-label-box';
  document.body.appendChild(labelBox);
}

function loadAndRender() {
  const siteKey = getSiteKey();
  const defaultSettings = getDefaultSettings(siteKey);
  chrome.storage.sync.get(siteKey, function(items) {
    const settings = Object.assign({}, defaultSettings, items[siteKey]);
    renderLabel(settings);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAndRender);
} else {
  loadAndRender();
}

// Listen for messages from popup to update label live
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateLabelStyle') {
    loadAndRender();
  }
});
