# Site Labeler Chrome Extension

Site Labeler is a Chrome extension that displays a customizable floating label/banner on any website based on its hostname or IP address. You can use it to visually distinguish between environments (e.g., production, staging, dev) or highlight important sites.

## Features
- Show a custom label for any site or IP (with optional port)
- Per-site settings: label text, position, background color, opacity
- Default config for common sites (see `src/config.js`)
- Settings are persistent and can be managed from the extension popup

## Example
When you visit `abc.com`, you might see a floating label in the top-left corner saying `ABC` with your chosen color and opacity. You can set a different label for `10.10.10.10:4502` or any other site.

## Folder Structure
```
site-labeler/
├── assets/           # (optional) icons and images
├── public/
│   └── popup.html    # Extension popup UI
├── src/
│   ├── config.js     # Default site label config (see below)
│   ├── content.js    # Content script to inject label
│   └── popup.js      # Popup logic
├── manifest.json     # Chrome extension manifest
├── README.md         # This file
└── .gitignore        # Ignore user config and build files
```

## Example `src/config.js`
```js
// Mapping of hostnames/hosts to default labels and settings
const SITE_LABELS = {
  "abc.com": {
    labelText: "ABC",
    labelPosition: "top-left",
    labelBgColor: "#222222",
    labelOpacity: 1
  },
  "10.10.10.10": {
    labelText: "Bad Company",
    labelPosition: "top-left",
    labelBgColor: "#e21b1b",
    labelOpacity: 1
  },
  "localhost": {
    labelText: "Local Dev",
    labelPosition: "top-left",
    labelBgColor: "#007bff",
    labelOpacity: 1
  }
};
```

## .gitignore
```
# Ignore Chrome extension build and user files
node_modules/
dist/
*.log
# Ignore user-specific config (if you want to keep your own labels private)
user-config.js
```

## Usage
1. Load the extension as an unpacked extension in Chrome.
2. Click the extension icon to set or update labels for the current site.
3. Visit any configured site to see your custom label.

---

Feel free to customize the config and popup as needed!
