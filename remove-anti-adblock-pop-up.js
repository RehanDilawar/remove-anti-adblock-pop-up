// ==UserScript==
// @name         Remove Anti-Adblock Popup - Advanced
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Bypasses AntiAdBlock Core Shadow DOM by ghosting dimensions to fool heartbeat probes, plus auto-continues shortlinks.
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
// @match        https://financeguidz.com/*
// @match        *://*.financeguidz.com/*
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
// @match        https://srnky.com/*
// @match        https://shrinkearn.com/*
// @match        https://clk.sh/*
// @match        https://shrinkbixby.com/*
//
// @exclude      *://*.hcaptcha.com/*
// @exclude      https://*.hcaptcha.com/*
// @exclude      *://challenges.cloudflare.com/*
// @exclude      https://challenges.cloudflare.com/*
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

(function () {
  'use strict';

  const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const trackedRoots = new Set();

  const adblockSignatures = [
    'antiadblockcore.com',
    'blocking ads',
    'Adblocker detected',
    'disable your adblocker',
    'rely on ads to keep this site free'
  ];

  // =====================================================================
  // MODULE 0: TARGETED TIMER ACCELERATION (Speedrun)
  // =====================================================================
  try {
    const currentHost = w.location.hostname;
    if (currentHost.includes('financeguidz.com') || currentHost.includes('advertisingcamps.com')) {
      const originalSetInterval = w.setInterval;
      const originalSetTimeout = w.setTimeout;
      w.setInterval = function(func, delay, ...args) {
          const newDelay = typeof delay === 'number' ? delay * 0.05 : delay;
          return originalSetInterval(func, newDelay, ...args);
      };
      w.setTimeout = function(func, delay, ...args) {
          const newDelay = typeof delay === 'number' ? delay * 0.05 : delay;
          return originalSetTimeout(func, newDelay, ...args);
      };
    }
  } catch (e) {}

  // =====================================================================
  // MODULE 1: POP-UNDER BLOCKER & NATIVE DIALOG SILENCER
  // =====================================================================
  try {
    const blockDialog = () => true;
    Object.defineProperty(w, 'alert', { get: () => blockDialog, set: () => {} });
    Object.defineProperty(w, 'confirm', { get: () => blockDialog, set: () => {} });
    Object.defineProperty(w, 'prompt', { get: () => blockDialog, set: () => {} });

    const blockOpen = () => null;
    Object.defineProperty(w, 'open', { get: () => blockOpen, set: () => {} });
  } catch (e) {}

  w.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link && (link.getAttribute('target') === '_blank' || link.getAttribute('target') === '_new')) {
          link.removeAttribute('target');
          link.target = '_self';
      }
  }, true);

  w.addEventListener('submit', function(e) {
      if (e.target && e.target.tagName === 'FORM') {
          if (e.target.getAttribute('target') === '_blank' || e.target.getAttribute('target') === '_new') {
              e.target.removeAttribute('target');
              e.target.target = '_self';
          }
      }
  }, true);

  // =====================================================================
  // MODULE 2: CAPTCHA GUARD (Ignores Cloudflare & hCaptcha)
  // =====================================================================
  function isCaptchaAsset(el) {
    if (!el || typeof el !== 'object') return false;
    try {
      if (el.tagName === 'IFRAME') {
        const src = el.src || '';
        if (src.includes('hcaptcha.com') || src.includes('challenges.cloudflare.com') || src.includes('recaptcha')) return true;
      }
      const id = typeof el.id === 'string' ? el.id.toLowerCase() : '';
      const cls = typeof el.className === 'string' ? el.className.toLowerCase() : (el.getAttribute?.('class') || '').toLowerCase();

      if (id.includes('captcha') || cls.includes('captcha') || id.includes('turnstile') || cls.includes('turnstile') || id.includes('cf-chl') || cls.includes('cf-chl')) return true;
      if (el.closest && el.closest('[id*="captcha" i], [class*="captcha" i], [id*="cf-chl" i], [class*="cf-" i]')) return true;
    } catch (e) {}
    return false;
  }

  // =====================================================================
  // MODULE 3: CROSS-REALM HIJACKING (For anti-adblock detection)
  // =====================================================================
  function patchRealm(win) {
    if (!win || win.__vacuum_patched) return;
    try {
      win.__vacuum_patched = true;
      const origAttach = win.Element.prototype.attachShadow;
      if (origAttach) {
        win.Element.prototype.attachShadow = new Proxy(origAttach, {
          apply(target, thisArg, args) {
            const shadowRoot = Reflect.apply(target, thisArg, args);
            if (!isCaptchaAsset(thisArg)) trackedRoots.add(shadowRoot);
            return shadowRoot;
          }
        });
      }
      Object.defineProperty(win, 'alert', { get: () => () => true, set: () => {} });
      Object.defineProperty(win, 'confirm', { get: () => () => true, set: () => {} });
      Object.defineProperty(win, 'prompt', { get: () => () => true, set: () => {} });
      Object.defineProperty(win, 'open', { get: () => () => null, set: () => {} });
    } catch (e) {}
  }

  patchRealm(w);
  try {
    const iframeDesc = Object.getOwnPropertyDescriptor(w.HTMLIFrameElement.prototype, 'contentWindow');
    if (iframeDesc && iframeDesc.get) {
      Object.defineProperty(w.HTMLIFrameElement.prototype, 'contentWindow', {
        ...iframeDesc,
        get() {
          const cw = Reflect.apply(iframeDesc.get, this, []);
          if (cw && !isCaptchaAsset(this)) patchRealm(cw);
          return cw;
        }
      });
    }
  } catch (e) {}

  // =====================================================================
  // MODULE 4: THE CONTINUOUS AAB VACUUM
  // =====================================================================
  setInterval(() => {
    if (document.body && document.body.style.overflow === 'hidden') document.body.style.setProperty('overflow', 'auto', 'important');
    if (document.documentElement && document.documentElement.style.overflow === 'hidden') document.documentElement.style.setProperty('overflow', 'auto', 'important');

    trackedRoots.forEach(shadowRoot => {
      try {
        const host = shadowRoot.host;
        if (!host || isCaptchaAsset(host)) return;
        const html = shadowRoot.innerHTML || '';
        const isCustomElement = host.tagName.includes('-');
        const isAAB = adblockSignatures.some(sig => html.includes(sig));

        if (isAAB) {
          if (host !== document.body && host !== document.documentElement && isCustomElement) {
            host.remove();
          } else {
            const children = shadowRoot.children;
            for (let i = children.length - 1; i >= 0; i--) {
              const child = children[i];
              if (child.tagName === 'SLOT' || child.tagName === 'STYLE') continue;
              child.remove();
            }
          }
        }
      } catch (e) {}
    });

    const rogueOverlays = document.querySelectorAll(
      '[data-ca88aeac3-card], [data-cb638915e-card], [data-c7a920ed5-card], div[role="dialog"][aria-modal="true"]'
    );
    rogueOverlays.forEach(el => {
        if (!isCaptchaAsset(el)) el.remove();
    });
  }, 50);

  // =====================================================================
  // MODULE 5: UNIVERSAL AUTO-CLICKER & REDIRECTOR
  // =====================================================================
  document.addEventListener('DOMContentLoaded', function() {

      setInterval(() => {
          // 1. Auto-Click common shortlink / filehost buttons
          const clickTargets = [
              '#invisibleCaptchaShortlink:not([disabled]):not(.disabled)',
              '#btn-main:not([disabled]):not(.disabled)',
              'button#continue:not([disabled]):not(.disabled)',
              'button.btn-primary.btn-captcha:not([disabled]):not(.disabled)',
              'button#startButton:not([disabled]):not(.disabled)',
              'button#getnewlink:not([disabled]):not(.disabled)',
              'button[name="method_free"]:not([disabled]):not(.disabled)',
              '#downloadbtn:not([disabled]):not(.disabled)',

              // FinanceGuidz, AdvertisingCamps, and related WP shortlinks
              '#tp98:not([disabled]):not(.disabled)',
              '#btn6:not([disabled]):not(.disabled)',
              '#tp-snp2:not([disabled]):not(.disabled)',
              '#pro-continue:not([disabled]):not(.disabled)',
              '#gotolink:not([disabled]):not(.disabled)',
              '.bt-success:not([disabled]):not(.disabled)',
              '.btn-captcha.btn-primary.btn:not([disabled]):not(.disabled)',

              // Fallback form clickers for specific WP themes
              'button#nextpage',
              'button#getmylink'
          ];

          clickTargets.forEach(selector => {
              const btn = document.querySelector(selector);
              // Ensure button is visible and hasn't been clicked yet
              if (btn && btn.offsetParent !== null && !btn.dataset.clicked) {
                  btn.dataset.clicked = "true";
                  btn.click();
              }
          });

          // 2. Form submit bypass for specific shortlinks
          const formTargets = ['form#nextpage', 'form#getmylink', 'form[name="dsb"]', 'form[name="tp"]'];
          formTargets.forEach(selector => {
              const form = document.querySelector(selector);
              if (form && !form.dataset.submitted) {
                  form.dataset.submitted = "true";
                  form.submit();
              }
          });

          // 3. Auto-Redirect for final destination buttons
          const redirectTargets = [
              'a.get-link:not([disabled]):not(.disabled)',
              '#open-continue-btn:not([disabled]):not(.disabled)',
              'a#pro-btn:not([disabled]):not(.disabled)',
              'a#btn7:not([disabled]):not(.disabled)'
          ];

          redirectTargets.forEach(selector => {
              const link = document.querySelector(selector);
              // Ensure it's a valid link and hasn't been executed yet
              if (link && link.href && !link.href.includes('javascript:') && !link.href.includes('#!') && !link.dataset.clicked) {
                  link.dataset.clicked = "true";
                  window.location.assign(link.href);
              }
          });

      }, 1000);

  });

})();
