# 🛡️ Remove Anti-Adblock & Auto Continue Links

[![Version](https://img.shields.io/badge/Version-4.1-blue?style=for-the-badge)](https://github.com/rehandilawar)
[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-Install%20Script-red?style=for-the-badge&logo=greasyfork)](https://update.greasyfork.org/scripts/592517/Remove%20Anti-Adblock%20Popup%20-%20Advanced.user.js)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Supported-green?style=for-the-badge&logo=tampermonkey)](https://www.tampermonkey.net/)
[![Violentmonkey](https://img.shields.io/badge/Violentmonkey-Supported-orange?style=for-the-badge)](https://violentmonkey.github.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

An aggressive, lightweight, and unified userscript designed to eliminate persistent anti-adblock popups, backdrop overlays, and scroll locks, while automating shortlink progression, paralyzing pop-unders, and caching destination endpoints across **pahe.ink**, mirrors, and popular file hosts.

---

> [!IMPORTANT]
> **Dual-Engine Architecture:**  
> This userscript operates alongside your existing browser ad blocker (e.g., uBlock Origin, AdGuard). It performs Cross-Realm Shadow DOM un-hooking, DOM tree purification, pop-under blocking, and synthetic event dispatching that standard filter lists cannot handle.

> [!WARNING]
> **Adblocker Notice & Safe-Mode (`pahe.plus` & `intercelestial.com`):**  
> 1. **Extension Whitelisting Required:** Whitelist or disable your extension ad blocker (uBlock Origin, AdGuard, Brave Shields) specifically on **`pahe.plus`** and **`intercelestial.com`**.  
> 2. **Auto-Bypass Excluded on Intercelestial:** Automated clicking and bypass logic are strictly disabled on `intercelestial.com` to prevent triggering server-side anti-bot security locks.  
> 3. **Pahe.plus Captcha Behavior:** Because you must turn off your adblocker on `pahe.plus`, the site will attempt to open redirect ads when you click. Our script **blocks these pop-unders and forces all links into your current tab**. If clicking the hCaptcha checkbox seems to do nothing, it means a redirect was caught and killed. **Just click again.** Once the real click registers and you pass the challenge, the script will automatically click "Continue" for you.

> [!TIP]
> **Zero Captcha Interference:**  
> All hCaptcha and Cloudflare Turnstile assets (challenge frames, checkboxes, and container modals) are excluded from element purges and click handlers, guaranteeing that human verification prompts function normally without breakage.

---

## ✨ Features

- 🛑 **Aggressive Anti-Adblock Vacuum:** Continuously scans top-level and Shadow DOM hierarchies (including Cross-Realm iframe hijacking) to eliminate full-screen backdrops, invisible click blockers, and randomized custom-tag wrappers before layout flashing occurs.
- 🚫 **Pop-Under & Dialog Silencer:** Intercepts `window.open`, `window.alert`, `confirm`, and `prompt`. Forcefully converts target `_blank` links to `_self`, completely paralyzing background redirect ads and browser lockups.
- ⚡ **Universal Auto-Clicker:** Automatically clicks "Continue", "Get Link", and "Free Download" buttons across Pahe mirrors, OuO networks, and supported file hosts the moment they unlock.
- 🔓 **Scroll Restoration:** Forcefully restores scrollbars and static positioning to `<html>` and `<body>` whenever anti-adblock scripts try to lock the page.
- 🛡️ **Captcha Shielding:** Built-in safeguards ensure interactive captcha modals (Cloudflare/hCaptcha) are never hidden, deleted, or misclicked.

---

## 🌐 Supported Domains

| Platform / Category | Domains | Anti-Adblock Removal | Auto-Continue Bypass | Notes |
| :--- | :--- | :---: | :---: | :--- |
| **Pahe Core & Mirrors** | `pahe.ink`, `pahe.plus`, `old.pahe.plus`, `tpi.li`, `oii.la`, `linegee.net`, `spacetica.com`, etc. | ✅ Active | ✅ Active | Full automation. Disable adblocker on `pahe.plus` and click through blocked redirects. |
| **Intercelestial** | `intercelestial.com` | ❌ **Excluded** | ❌ **Excluded** | **Safe-Mode:** Disable adblocker. Auto-clicking is disabled to avoid token bans. |
| **Shortlink Services** | `ouo.io`, `ouo.press`, `vexfile.com`, `cloudhostt.com`, `financeehelp.com`, etc. | ✅ Active | ✅ Active | Navigates steps automatically. |
| **File Host Gateways** | `uploadrar.com`, `filespayouts.com`, `modsfire.com`, `www.file-upload.org`, `safefileku.com`, `send.now`, `upfilesgo.com`, etc. | ✅ Active | ✅ Active | Selects free tier and triggers final download buttons. |
| **Captcha Services** | `*.hcaptcha.com/*`, `challenges.cloudflare.com` | ❌ **Excluded** | ❌ **Excluded** | **Whitelisted:** Preserves verification checkboxes and challenge frames. |

---

## 🚀 Installation

### Step 1: Install a Userscript Manager
Make sure you have an active userscript extension installed:
- 🐵 **[Tampermonkey](https://www.tampermonkey.net/)** *(Recommended)*
- 🐒 **[Violentmonkey](https://violentmonkey.github.io/)**

### Step 2: Install the Script
Install or update to version 4.0 via your manager:  
👉 **[Install from Greasy Fork](https://update.greasyfork.org/scripts/592517/Remove%20Anti-Adblock%20Popup%20-%20Advanced.user.js)**

### Step 3: Configure Safe-Mode Domains
Pause or whitelist your browser ad blocker (e.g., uBlock Origin) on `intercelestial.com` and `pahe.plus` so their server handshakes and captchas complete smoothly. Let the userscript handle the rogue popups!

---

## 📄 License

This project is open source and distributed under the **[GPL-3.0](https://spdx.org/licenses/GPL-3.0.html)**.

---

## 🛠️ Author & Support
- Developed and maintained by **[Rehan Dilawar](https://github.com/rehandilawar)**.
- Encountered a broken selector or new anti-adblock script? Open an issue on **[GitHub](https://github.com/RehanDilawar/remove-anti-adblock-pop-up)**.

---

<p align="center">
  ⭐️ <em>If you found this script helpful, please consider starring the repository!</em>
</p>
```eof
