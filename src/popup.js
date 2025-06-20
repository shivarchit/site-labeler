function getSiteKey(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.host || u.hostname;
  } catch {
    return url;
  }
}

function updatePreview() {
  const preview = document.getElementById('preview');
  const labelText = document.getElementById('labelText').value || 'Label Preview';
  const bgColor = document.getElementById('bgColor').value;
  const opacity = parseFloat(document.getElementById('opacity').value);
  const position = document.getElementById('position').value;
  preview.style.background = bgColor;
  preview.style.opacity = opacity;
  preview.textContent = labelText;
  preview.style.position = 'static';
  preview.style.margin = '18px 0 0 0';
  preview.style.float = '';
  preview.style.display = 'inline-block';
  preview.style.float = (position.includes('right')) ? 'right' : 'left';
}

function saveOptions(e) {
  e.preventDefault();
  const siteKey = document.getElementById('siteKey').value.trim();
  if (!siteKey) {
    document.getElementById('status').textContent = 'Please enter a site.';
    return;
  }
  const labelText = document.getElementById('labelText').value;
  const position = document.getElementById('position').value;
  const bgColor = document.getElementById('bgColor').value;
  const opacity = parseFloat(document.getElementById('opacity').value);
  const siteSettings = {};
  siteSettings[siteKey] = {
    labelText: labelText,
    labelPosition: position,
    labelBgColor: bgColor,
    labelOpacity: opacity
  };
  chrome.storage.sync.set(siteSettings, function () {
    document.getElementById('status').textContent = 'Saved!';
    setTimeout(() => { document.getElementById('status').textContent = ''; }, 1200);
    // Try to update the label on the current page if it matches
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (siteKey) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateLabelStyle' });
      }
    });
  });
}

function restoreOptions() {
  // Always set siteKey to the current tab's host and disable editing
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let siteKeyInput = document.getElementById('siteKey');
    let siteKey = '';
    if (tabs && tabs[0] && tabs[0].url) {
      try {
        const u = new URL(tabs[0].url);
        siteKey = u.host;
        siteKeyInput.value = siteKey;
      } catch { }
    }
    // If no valid tab, leave blank
    if (!siteKey) return;
    chrome.storage.sync.get(siteKey, function (items) {
      const settings = items[siteKey] || {
        labelText: '',
        labelPosition: 'top-left',
        labelBgColor: '#222222',
        labelOpacity: 1
      };
      document.getElementById('labelText').value = settings.labelText || '';
      document.getElementById('position').value = settings.labelPosition;
      document.getElementById('bgColor').value = settings.labelBgColor;
      document.getElementById('opacity').value = settings.labelOpacity;
      updatePreview();
    });
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('settingsForm').addEventListener('submit', saveOptions);
document.getElementById('labelText').addEventListener('input', updatePreview);
document.getElementById('position').addEventListener('change', updatePreview);
document.getElementById('bgColor').addEventListener('input', updatePreview);
document.getElementById('opacity').addEventListener('input', updatePreview);
