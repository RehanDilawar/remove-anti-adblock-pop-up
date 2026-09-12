# 🛡️ Remove Anti-Adblock & Auto Continue Links

[![Version](https://img.shields.io/badge/Version-3.0-blue?style=for-the-badge)](https://github.com/rehandilawar)
[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-Install%20Script-red?style=for-the-badge&logo=greasyfork)](https://update.greasyfork.org/scripts/592517/Remove%20Anti-Adblock%20Popup%20-%20Advanced.user.js)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Supported-green?style=for-the-badge&logo=tampermonkey)](https://www.tampermonkey.net/)
[![Violentmonkey](https://img.shields.io/badge/Violentmonkey-Supported-orange?style=for-the-badge)](https://violentmonkey.github.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

An aggressive, lightweight, and unified userscript designed to eliminate persistent anti-adblock popups, backdrop overlays, and scroll locks, while automating shortlink progression, accelerating countdown timers, and caching destination endpoints across **pahe.ink**, mirrors, and popular file hosts.

---

> [!IMPORTANT]
> **Dual-Engine Architecture:**  
> This userscript operates alongside your existing browser ad blocker (e.g., uBlock Origin, AdGuard). It performs DOM tree purification, Shadow DOM un-hooking, timer acceleration, and synthetic event dispatching that standard filter lists cannot handle.

> [!WARNING]
> **Adblocker Notice & Safe-Mode for Intercelestial (`intercelestial.com`):**  
> 1. **Auto-Bypass Excluded:** Automated clicking and bypass logic are strictly disabled on `intercelestial.com` to prevent triggering server-side anti-bot security locks. The script only dissolves anti-adblock popups/overlays on this domain.  
> 2. **Extension Whitelisting Required:** Whitelist or disable your extension ad blocker (uBlock Origin, AdGuard, Brave Shields) specifically on `intercelestial.com`. Intercelestial detects blocked telemetry and returns an *"Ad blocker or auto-click script detected"* roadblock. Whitelisting permits the token handshake to succeed while this script cleans the remaining visual junk.

> [!TIP]
> **Zero hCaptcha Interference:**  
> All hCaptcha assets (`*.hcaptcha.com/*`, challenge frames, checkboxes, and container modals) are excluded from element purges and click handlers, guaranteeing that human verification prompts function normally without breakage.

---

## ✨ Features

- 🛑 **Aggressive Anti-Adblock Removal:** Continuously scans top-level and Shadow DOM hierarchies to eliminate full-screen backdrops, invisible click blockers (`z-index: 2147483647`), and antiadblockcore wrappers before layout flashing occurs.
- ⚡ **Automated Shortlink Progression:** Automatically clicks "Continue", "Get Link", and "Free Download" buttons across Pahe mirrors, OuO networks, and supported file hosts.
- ⏱️ **Timer & Interval Acceleration:** Intercepts `setInterval`, `setTimeout`, and `Date` calls with a speed factor of `0.05` (~20x faster) to bypass countdown wait screens.
- 🔓 **Scroll Restoration:** Forcefully restores scrollbars and static positioning to `<html>` and `<body>` whenever anti-adblock scripts try to lock the page.
- 🛡️ **hCaptcha Shielding:** Built-in safeguards ensure interactive captcha modals and checkboxes are never hidden, deleted, or misclicked.
- 🌐 **Cloudflare Worker Cache:** Synchronizes destination URLs to a Cloudflare Worker backend on supported gateways (`tpi.li`, `oii.la`) for instant next-time redirection.

---

## 🌐 Supported Domains

| Platform / Category | Domains | Anti-Adblock Removal | Auto-Continue Bypass | Notes |
| :--- | :--- | :---: | :---: | :--- |
| **Pahe Core & Mirrors** | `pahe.ink`, `pahe.plus`, `old.pahe.plus`, `tpi.li`, `oii.la`, `linegee.net`, `spacetica.com`, etc. | ✅ Active | ✅ Active | Full automation, timer acceleration & Cloudflare link caching. |
| **Intercelestial** | `intercelestial.com` | ✅ Active | ❌ **Excluded** | **Safe-Mode:** Removes overlays only. Auto-clicking is disabled to avoid token bans. |
| **Shortlink Services** | `ouo.io`, `ouo.press`, `vexfile.com`, `cloudhostt.com`, `financeehelp.com`, etc. | ✅ Active | ✅ Active | Accelerates countdown timers and progresses steps. |
| **File Host Gateways** | `uploadrar.com`, `filespayouts.com`, `modsfire.com`, `www.file-upload.org`, `safefileku.com`, `send.now`, `upfilesgo.com`, etc. | ✅ Active | ✅ Active | Selects free tier and triggers final download buttons. |
| **Captcha Services** | `*.hcaptcha.com/*` | ❌ **Excluded** | ❌ **Excluded** | **Whitelisted:** Preserves verification checkboxes and challenge frames. |

---

## 🚀 Installation

### Step 1: Install a Userscript Manager
Make sure you have an active userscript extension installed:
* 🐵 **[Tampermonkey](https://www.tampermonkey.net/)** *(Recommended)*
* 🐒 **[Violentmonkey](https://violentmonkey.github.io/)**

### Step 2: Install the Script
Install or update to version 3.0 via your manager:  
👉 **[Install from Greasy Fork](https://update.greasyfork.org/scripts/592517/Remove%20Anti-Adblock%20Popup%20-%20Advanced.user.js)**

### Step 3: Configure `intercelestial.com`
Pause or whitelist your browser ad blocker (e.g., uBlock Origin) on `intercelestial.com` so its server handshake completes smoothly.

---

## 📄 License

This project is open source and distributed under the **[MIT License](LICENSE)**.

---

## 🛠️ Author & Support
* Developed and maintained by **[Rehan Dilawar](https://github.com/rehandilawar)**.
* Encountered a broken selector or new anti-adblock script? Open an issue on **[GitHub](https://github.com/rehandilawar)**.

---

<p align="center">
  ⭐️ <em>If you found this script helpful, please consider starring the repository!</em>
</p>
