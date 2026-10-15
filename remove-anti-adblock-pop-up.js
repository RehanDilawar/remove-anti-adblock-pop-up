// ==UserScript==
// @name         Remove Anti-Adblock Popup - Advanced
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Dissolves anti-adblock popups/overlays (including closed Shadow DOM on body) and auto-continues shortlinks with hCaptcha and Intercelestial exclusions.
// @author       rehan dilawar, hdyzen
// @license      GPL-3.0
// @icon         https://www.google.com/s2/favicons?domain=pahe.ink
//
// @match        *://pahe.ink/*
// @match        *://*.pahe.ink/*
// @match        https://teknoasian.com/*
// @match        https://intercelestial.com/*
// @match        https://linegee.net/*
// @match        https://spacetica.com/*
// @match        https://pahe.plus/*
// @match        https://oii.la/*
// @match        https://uii.io/*
// @match        https://wp2hostt.com/*
// @match        https://wordcounter.icu/*
// @match        https://tpi.li/*
// @match        https://blogmystt.com/*
// @match        https://old.pahe.plus/*
// @match        https://hosttbuzz.com/*
// @match        https://policiesreview.com/*
// @match        https://healthylifez.com/*
// @match        https://insurancemyst.com/*
// @match        https://*.gdflix.dad/file/*
// @match        https://pixeldrain.com/*
// @match        https://hostingbixby.com/*
// @match        https://policiesbuzzz.com/*
// @match        https://hostingzbuzz.com/*
// @match        https://bixbyfortech.com/*
// @match        https://serverguidez.com/*
// @match        https://comparepolicyy.com/*
// @match        https://cheaplann.com/*
// @match        https://vpshostplans.com/*
// @match        https://ensureguide.com/*
// @match        https://fitnessplanss.com/*
// @match        https://sharedwebs.com/*
// @match        https://hostserverz.com/*
// @match        https://cloudhostingz.com/*
// @match        https://carensureplan.com/*
// @match        https://playareaz.com/*
// @match        https://fitnesstipz.com/*
// @match        https://ensuretips.com/*
// @match        https://softdevelopp.com/*
// @match        https://vpzserver.com/*
// @match        https://tophostdeal.com/*
// @match        https://evensuregd.com/*
// @match        https://bestensuree.com/*
// @match        https://hostzteam.com/*
// @match        https://devsoftwr.com/*
// @match        https://zpserver.com/*
// @match        https://fitpractise.com/*
// @match        https://autoshieldd.com/*
// @match        https://selfhostt.com/*
// @match        https://ssdhostting.com/*
// @match        https://financeehelp.com/*
// @match        https://cloudhostt.com/*
// @match        https://ouo.io/*
// @match        https://ouo.press/*
// @match        https://vexfile.com/*
// @match        https://filespayouts.com/*
// @match        https://modsfire.com/*
// @match        https://www.file-upload.org/*
// @match        https://djxmaza.in/*
// @match        https://smartfeecalculator.com/*
// @match        https://gujjukhabar.in/*
// @match        https://pdfhindibook.com/*
// @match        https://upfilesgo.com/*
// @match        https://safefileku.com/*
// @match        https://uploadrar.com/*
// @match        https://send.now/*
// @match        https://clksz.com/*
//
// @exclude      *://*.hcaptcha.com/*
// @exclude      https://*.hcaptcha.com/*
// @exclude      *://*.intercelestial.com/*
// @exclude      https://intercelestial.com/*
//
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      shortlinks.fdyzen.workers.dev
// @run-at       document-start
// @downloadURL  https://update.greasyfork.org/scripts/592517/Remove%20Anti-Adblock%20Popup%20-%20Advanced.user.js
// @updateURL    https://update.greasyfork.org/scripts/592517/Remove%20Anti-Adblock%20Popup%20-%20Advanced.meta.js
// ==/UserScript==
// Copyright (C) 2026 hdyzen (andradeatdev). This script is free software:
// you may copy, modify and redistribute it only under the GNU General Public
// License v3. Source and this notice must be kept intact (GPL-3.0, §4–§5).

(function () {
  'use strict';

  const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  // ==========================================
  // SHARED UTILITIES & CAPTCHA GUARDS
  // ==========================================

  function isCaptchaAsset(el) {
    if (!el) return false;
    try {
      if (el.tagName === 'IFRAME') {
        const src = el.src || '';
        const name = el.name || '';
        const id = el.id || '';
        if (
          src.includes('hcaptcha.com') ||
          name.includes('hcaptcha') ||
          src.includes('challenges.cloudflare.com') ||
          id.includes('cf-chl-widget')
        ) {
          return true;
        }
      }
      const id = typeof el.id === 'string' ? el.id : '';
      const className = typeof el.className === 'string' ? el.className : (el.getAttribute?.('class') || '');
      if (
        id.includes('hcaptcha') ||
        className.includes('hcaptcha') ||
        id.includes('captchaShortlink') ||
        id.includes('cf-chl-widget')
      ) {
        return true;
      }
      if (el.hasAttribute?.('data-hcaptcha-widget-id') || el.hasAttribute?.('data-hcaptcha-response')) return true;
      if (
        el.closest?.(
          '[class*="hcaptcha"], [id*="hcaptcha"], [data-hcaptcha-widget-id], iframe[src*="hcaptcha"], #captchaShortlink, iframe[src*="challenges.cloudflare.com"]'
        )
      ) {
        return true;
      }
      if (
        el.querySelector?.(
          'iframe[src*="hcaptcha"], [class*="hcaptcha"], [id*="hcaptcha"], [data-hcaptcha-widget-id], iframe[src*="challenges.cloudflare.com"]'
        )
      ) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  // ==========================================
  // MODULE 1: REMOVE ANTI-ADBLOCK POPUPS
  // ==========================================

  const AAB_KEYWORDS = [
    'antiadblockcore',
    'Adblocker detected',
    'disable your adblocker',
    'Your network is blocking ads',
    'blocking ad domains',
    'How to disable your adblocker',
  ];

  function containsAABText(str) {
    if (!str) return false;
    const lower = str.toLowerCase();
    return AAB_KEYWORDS.some(k => lower.includes(k.toLowerCase()));
  }

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    html, body {
      overflow: auto !important;
      position: static !important;
    }
    /* Neutralize maximum z-index backdrop overlays while sparing Captcha modals */
    div[style*="2147483647"]:not([class*="hcaptcha"]):not([id*="hcaptcha"]):not(:has(iframe[src*="hcaptcha"])):not(:has(iframe[src*="challenges.cloudflare.com"])),
    div[style*="z-index: 2147483647"]:not([class*="hcaptcha"]):not([id*="hcaptcha"]):not(:has(iframe[src*="hcaptcha"])):not(:has(iframe[src*="challenges.cloudflare.com"])),
    div[class*="antiadblock"]:not([class*="hcaptcha"]),
    div[id*="antiadblock"]:not([id*="hcaptcha"]),
    .give-freely-root {
      display: none !important;
      pointer-events: none !important;
      visibility: hidden !important;
      width: 0 !important;
      height: 0 !important;
    }
  `;
  (document.head || document.documentElement).appendChild(styleEl);

  function unlockScroll() {
    if (document.body && document.body.style.overflow === 'hidden') {
      document.body.style.setProperty('overflow', 'auto', 'important');
    }
    if (document.documentElement && document.documentElement.style.overflow === 'hidden') {
      document.documentElement.style.setProperty('overflow', 'auto', 'important');
    }
  }

  function hideElement(el) {
    if (!el || !el.style || el === document.body || el === document.documentElement || isCaptchaAsset(el)) return;
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.style.setProperty('pointer-events', 'none', 'important');
    el.style.setProperty('opacity', '0', 'important');
    el.style.setProperty('width', '0px', 'important');
    el.style.setProperty('height', '0px', 'important');
    unlockScroll();
  }

  function isAABElement(el) {
    if (!el || el === document.body || el === document.documentElement || isCaptchaAsset(el)) return false;
    if (el.attributes) {
      for (let i = 0; i < el.attributes.length; i++) {
        const name = el.attributes[i].name;
        if (/^data-[a-z0-9]{6,12}-(h|card|style|badge|retry|reload|tips|tipsbox|body|title|brand|foot)/i.test(name)) {
          return true;
        }
      }
    }
    if (el.style && (el.style.zIndex === '2147483647' || Number(el.style.zIndex) >= 2147483640)) {
      return true;
    }
    return false;
  }

  function purgeHierarchy(el) {
    if (!el || el === document.body || el === document.documentElement || isCaptchaAsset(el)) return;
    hideElement(el);

    let parent = el.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      if (isCaptchaAsset(parent)) break;
      hideElement(parent);
      parent = parent.parentElement;
    }
  }

  // Neutralize inside a ShadowRoot without removing nodes (prevents watchdog respawn & preserves <slot>)
  function neutralizeShadowRoot(shadowRoot, host) {
    try {
      if (isCaptchaAsset(host)) return;
      const html = shadowRoot.innerHTML || '';
      const hasAABAttr = shadowRoot.querySelector?.(
        '[role="dialog"], [style*="2147483647"], a[href*="antiadblockcore"]'
      );

      if (!containsAABText(html) && !hasAABAttr) return;

      // 1. Inject permanent CSS suppressor inside the ShadowRoot (leaves <slot> intact!)
      if (!shadowRoot.querySelector('style[data-aab-neutralizer]')) {
        const shadowStyle = document.createElement('style');
        shadowStyle.setAttribute('data-aab-neutralizer', '1');
        shadowStyle.textContent = `
          div, [role="dialog"], [class], [id] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            z-index: -999999 !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
          }
          slot {
            display: contents !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
          }
        `;
        shadowRoot.appendChild(shadowStyle);
      }

      // 2. Hide all non-slot children inside the shadow root (do NOT remove them, or watchdog re-creates them)
      Array.from(shadowRoot.children).forEach(child => {
        if (child.tagName !== 'SLOT' && child.tagName !== 'STYLE') {
          child.style?.setProperty('display', 'none', 'important');
          child.style?.setProperty('visibility', 'hidden', 'important');
          child.style?.setProperty('pointer-events', 'none', 'important');
        }
      });

      // 3. If the host is NOT body/html, also hide the host element
      if (host && host !== document.body && host !== document.documentElement) {
        purgeHierarchy(host);
      }

      unlockScroll();
    } catch (e) {}
  }

  // Hook attachShadow on BOTH unsafeWindow and sandbox window
  function hookAttachShadow(targetWin) {
    if (!targetWin || !targetWin.Element) return;
    const origAttach = targetWin.Element.prototype.attachShadow;
    const nativeToStr = targetWin.Function.prototype.toString;

    const wrappedAttach = function (...args) {
      // Force open mode internally if you want inspection, or keep original & hold reference
      const shadowRoot = origAttach.apply(this, args);
      const host = this;

      const checkShadow = () => neutralizeShadowRoot(shadowRoot, host);

      const shadowObs = new MutationObserver(checkShadow);
      shadowObs.observe(shadowRoot, { childList: true, subtree: true, attributes: true });

      checkShadow();
      setTimeout(checkShadow, 0);
      setTimeout(checkShadow, 150);

      return shadowRoot;
    };

    targetWin.Element.prototype.attachShadow = wrappedAttach;
    try {
      targetWin.Function.prototype.toString = new Proxy(nativeToStr, {
        apply(target, thisArg, argArray) {
          if (thisArg === wrappedAttach) return nativeToStr.call(origAttach);
          return Reflect.apply(target, thisArg, argArray);
        },
      });
    } catch (e) {}
  }

  hookAttachShadow(w);
  if (w !== window) hookAttachShadow(window);

  // Neutralize app_vars adblock flags and block ads_block.js
  try {
    let appVarsVal = w.app_vars;
    Object.defineProperty(w, 'app_vars', {
      configurable: true,
      enumerable: true,
      get() {
        return appVarsVal;
      },
      set(val) {
        if (val && typeof val === 'object') {
          val.force_disable_adblock = '0';
          val.enable_adblock_check = '0';
        }
        appVarsVal = val;
      },
    });
  } catch (e) {}

  function scanAndPurge() {
    const elements = document.querySelectorAll('div, style, template[shadowrootmode], script[src*="ads_block"]');
    elements.forEach(el => {
      if (el.tagName === 'SCRIPT' && el.src?.includes('ads_block')) {
        el.remove();
        return;
      }
      if (isCaptchaAsset(el)) return;
      if (isAABElement(el)) {
        purgeHierarchy(el);
      }
      if (el.tagName === 'TEMPLATE' && containsAABText(el.innerHTML)) {
        const parent = el.parentElement;
        el.remove();
        if (parent && parent !== document.body && parent !== document.documentElement) {
          purgeHierarchy(parent);
        }
      }
    });
    unlockScroll();
  }

  const domObserver = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'attributes' && (m.target === document.body || m.target === document.documentElement)) {
        unlockScroll();
        continue;
      }
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) {
          if (node.tagName === 'SCRIPT' && node.src?.includes('ads_block')) {
            node.type = 'javascript/blocked';
            node.remove();
            continue;
          }
          if (isCaptchaAsset(node)) continue;
          if (isAABElement(node)) {
            purgeHierarchy(node);
          } else if (node.tagName === 'TEMPLATE' && containsAABText(node.innerHTML)) {
            node.remove();
          }
        }
      }
    }
  });

  domObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
  });

  scanAndPurge();
  document.addEventListener('DOMContentLoaded', scanAndPurge);
  window.addEventListener('load', scanAndPurge);

  const poller = setInterval(scanAndPurge, 250);
  setTimeout(() => clearInterval(poller), 15000);

  // ==========================================
  // MODULE 2: PAHE AUTO CONTINUE LINKS
  // ==========================================

  const CONFIG = {
    TIMEOUT_INTERVAL: 250,
    PATCH_TIMER_FACTOR: 0.05,
    WORKER_URL: 'https://shortlinks.fdyzen.workers.dev',
    FINAL_DOMAINS: [
      'send.now',
      '1fichier.com',
      '1024tera.com',
      'gdflix.io',
      'gdflix.dev',
      'mega.nz',
      'vik1ngfile.site',
    ],
  };

  const TEMPLATES = {
    TPI_OII: () => {
      // Only click #continue once Turnstile/Captcha is solved (or if no Turnstile exists)
      justClick(":has([name='cf-turnstile-response'][value]:not([value=''])) #continue:not([disabled]), #continue:not([disabled]):not(:has(~ * [name='cf-turnstile-response']))");
      justClick('.get-link[href]:not(.disabled)');
    },
    HOSTING: () => {
      patchInterval();
      justRemove('#page > div', { text: 'detected' });
      justClick('#startButton');
      justClick("a[href='#getmylink']", { visible: true });
      justClick('#getnewlink');
    },
    OUO: () => {
      patchInterval();
      justClick('#btn-main:not(.disabled)');
    },
    DEVUPLOADS: () => {
      patchInterval();
      justClick("#gdl[style*='block']");
      justClick("#gdlf[style*='block']");
      justScrollTo('#dln');
    },
  };

  // Intercelestial is excluded from auto-bypass handlers
  const DOMAINS = {
    'tpi.li': TEMPLATES.TPI_OII,
    'oii.la': TEMPLATES.TPI_OII,
    'clksz.com': () => {
      justClick(":has([name='cf-turnstile-response'][value]:not([value=''])) #continue:not([disabled])");
      justClick('.get-link[href]:not(.disabled)');
    },
    'financeehelp.com': TEMPLATES.HOSTING,
    'cloudhostt.com': TEMPLATES.HOSTING,
    'linegee.net': async () => {
      justClick('.btn-primary[href]', { wait: 2000 });
    },
    'ouo.io': TEMPLATES.OUO,
    'ouo.press': TEMPLATES.OUO,
    'pahe.plus': () => {
      justClick(':has([data-hcaptcha-response]) #invisibleCaptchaShortlink:not([disabled]), .get-link:not(.disabled)');
    },
    'vexfile.com': () => {
      justClick('.generate-link:not(.blocked)');
    },
    'filespayouts.com': () => {
      patchInterval({ text: 'tick' });
      justClick('#method_free');
    },
    'modsfire.com': () => {
      patchInterval();
      justClick('.download-button:not([href])');
    },
    'www.file-upload.org': () => {
      justClick("button[name='method_free'], :has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) #downloadbtn:not([disabled])");
    },
    'djxmaza.in': TEMPLATES.DEVUPLOADS,
    'smartfeecalculator.com': TEMPLATES.DEVUPLOADS,
    'gujjukhabar.in': TEMPLATES.DEVUPLOADS,
    'pdfhindibook.com': TEMPLATES.DEVUPLOADS,
    'upfilesgo.com': () => {
      justClick('#link-button-free:not([disabled]), #file-captcha #link-button:not([disabled])');
    },
    'safefileku.com': () => {
      patchInterval();
      justClick(":has([name='cf-turnstile-response'][value]) button[type='submit']");
    },
    'uploadrar.com': () => {
      justClick("button[name='method_free'], #downloadbtn:not([disabled])");
    },
    'send.now': async () => {
      justClick(":has([name='cf-turnstile-response'][value]) [type='submit']");
    },
  };

  const HOOKS = {
    setTimeout: w.setTimeout.bind(w),
    clearTimeout: w.clearTimeout.bind(w),
    Date: w.Date,
  };

  async function runAutoBypass() {
    const { hostname } = location;

    // Strict exclusion for Intercelestial and hCaptcha domains
    if (hostname.includes('intercelestial.com') || hostname.includes('hcaptcha.com')) return;

    const handler = DOMAINS[hostname];
    if (!handler) return;

    if (CONFIG.WORKER_URL && isOriginHost(hostname)) {
      try {
        const check = await requestAPI('GET', `/api/check?url=${encodeURIComponent(location.href)}`);
        if (check && check.status === 'ok' && check.destination) {
          navigateTo(check.destination);
          return;
        }
      } catch (e) {}
    }

    listenerNavigation();
    handler();
  }

  function click(node) {
    if (!node || isCaptchaAsset(node)) return;
    // Strip inline ad-popup onclick before clicking (#continue has window.open('https://tryedesign.com/...'))
    if (node.id === 'continue' && node.getAttribute('onclick')?.includes('window.open')) {
      node.removeAttribute('onclick');
    }
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: w,
    });
    node.dispatchEvent(event);
  }

  async function justClick(selector, options = {}) {
    const { wait = 0 } = options;
    const node = await whenElement(selector, options);
    if (!node || isCaptchaAsset(node)) return;
    node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    if (wait > 0) {
      return safeSetTimeout(() => click(node), wait);
    }
    click(node);
  }

  async function justScrollTo(selector, options = {}) {
    const node = await whenElement(selector, options);
    if (!node || isCaptchaAsset(node)) return;
    node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }

  async function justRemove(selector, options = {}) {
    const node = await whenElement(selector, options);
    if (!node || isCaptchaAsset(node)) return;
    node.remove();
  }

  function whenElement(selector, options = {}) {
    const { visible = false, text = null } = options;

    return new Promise(resolve => {
      const check = () => {
        const nodes = document.querySelectorAll(selector);
        for (const node of nodes) {
          if (!node || isCaptchaAsset(node)) continue;
          if (visible && !node.offsetParent) continue;
          if (typeof text === 'string' && !node.innerText.includes(text)) continue;
          if (text instanceof RegExp && !text.test(node.innerText)) continue;

          resolve(node);
          return;
        }
        safeSetTimeout(check, 250);
      };
      safeSetTimeout(check, 250);
    });
  }

  function safeSetTimeout(callback, delay) {
    const startTime = HOOKS.Date.now();
    let timeoutId;

    const check = () => {
      const elapsed = HOOKS.Date.now() - startTime;
      if (elapsed >= delay) {
        callback();
      } else {
        timeoutId = HOOKS.setTimeout(check, delay - elapsed);
      }
    };

    timeoutId = HOOKS.setTimeout(check, delay);
    return () => HOOKS.clearTimeout(timeoutId);
  }

  function patchInterval(options = {}) {
    const { factor = CONFIG.PATCH_TIMER_FACTOR, text, ms } = options;
    const startTime = HOOKS.Date.now();

    const now = () => {
      const realElapsed = HOOKS.Date.now() - startTime;
      const virtualElapsed = factor === 0 ? realElapsed / 0.001 : realElapsed / factor;
      return startTime + virtualElapsed;
    };

    const cb = (target, thisArg, argArray) => {
      if (typeof argArray[1] !== 'number') {
        return Reflect.apply(target, thisArg, argArray);
      }

      const fn = argArray[0]?.toString();
      if (text && !fn.includes(text)) {
        return Reflect.apply(target, thisArg, argArray);
      }

      if (ms != null && ms === argArray[1]) {
        return Reflect.apply(target, thisArg, argArray);
      }

      argArray[1] *= factor;
      return Reflect.apply(target, thisArg, argArray);
    };

    w.setInterval = new Proxy(w.setInterval, { apply: cb });
    w.setTimeout = new Proxy(w.setTimeout, { apply: cb });

    w.Date = new Proxy(w.Date, {
      construct(target, args) {
        if (args.length === 0) return new target(now());
        return new target(...args);
      },
      apply(target, thisArg, args) {
        if (args.length === 0) return new target(now()).toString();
        return target(...args);
      },
      get(target, prop, receiver) {
        if (prop === 'now') return () => now();
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  function isFinalHost(hostname) {
    return CONFIG.FINAL_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain));
  }

  function isOriginHost(host) {
    return host === 'tpi.li' || host === 'oii.la';
  }

  function requestAPI(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url: `${CONFIG.WORKER_URL}${endpoint}`,
        headers: { 'Content-Type': 'application/json' },
        responseType: 'json',
        data: data ? JSON.stringify(data) : undefined,
        onload: res => resolve(res.response),
        onerror: err => reject(err),
      });
    });
  }

  function navigateTo(url, info = 'bypass_link') {
    if (w.navigation?.navigate) {
      w.navigation.navigate(url, { info });
    } else {
      location.href = url;
    }
  }

  function listenerNavigation() {
    if (!w.navigation || !CONFIG.WORKER_URL) return;

    w.navigation.addEventListener('navigate', async ev => {
      if (ev.info === 'bypass_link') return;
      if (!isOriginHost(location.hostname)) return;

      try {
        const destURL = new URL(ev.destination.url);
        if (!isFinalHost(destURL.hostname)) return;

        if (ev.cancelable) {
          ev.preventDefault();
          await requestAPI('POST', '/api/save', {
            shortlink: location.href,
            destination: ev.destination.url,
          });
          navigateTo(ev.destination.url);
        }
      } catch (e) {}
    });
  }

  runAutoBypass();
})();
