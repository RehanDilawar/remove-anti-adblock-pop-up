// ==UserScript==
// @name         Remove Anti-Adblock Popup - Advanced
// @namespace    http://tampermonkey.net/
// @version      2.2
// @license MIT
// @description  Neutrally hides AntiAdBlock Core popups and restores scroll without triggering anti-tamper detection.
// @author       rehandilawar
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
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    html, body {
      overflow: auto !important;
      position: static !important;
    }
    /* Visually collapse known AAB containers without removing them from DOM */
    div[class*="antiadblock"],
    div[id*="antiadblock"],
    .give-freely-root {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;
  (document.head || document.documentElement).appendChild(styleEl);

  function unlockScroll() {
    if (document.body) document.body.style.setProperty('overflow', 'auto', 'important');
    if (document.documentElement) document.documentElement.style.setProperty('overflow', 'auto', 'important');
  }

  function hideElement(el) {
    if (!el || !el.style) return;
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.style.setProperty('pointer-events', 'none', 'important');
    el.style.setProperty('opacity', '0', 'important');
    unlockScroll();
  }

  function isAABHost(el) {
    if (!el || !el.attributes) return false;
    for (let i = 0; i < el.attributes.length; i++) {
      if (/^data-[a-z0-9]{6,12}-(h|card|style)$/i.test(el.attributes[i].name)) return true;
    }
    return false;
  }

  const nativeToString = Function.prototype.toString;
  const originalAttachShadow = Element.prototype.attachShadow;

  Element.prototype.attachShadow = function (...args) {
    const shadowRoot = originalAttachShadow.apply(this, args);
    const host = this;

    const inspectAndHide = () => {
      try {
        const content = shadowRoot.innerHTML || '';
        if (
          content.includes('antiadblockcore') ||
          content.includes('Adblocker detected') ||
          content.includes('disable your adblocker') ||
          shadowRoot.querySelector('a[href*="antiadblockcore"]')
        ) {
          hideElement(host);
        }
      } catch (e) {}
    };

    const shadowObserver = new MutationObserver(inspectAndHide);
    shadowObserver.observe(shadowRoot, { childList: true, subtree: true });
    setTimeout(inspectAndHide, 0);

    return shadowRoot;
  };

  Function.prototype.toString = function () {
    if (this === Element.prototype.attachShadow) return nativeToString.call(originalAttachShadow);
    return nativeToString.apply(this, arguments);
  };

  function scanAndHide() {
    const elements = document.querySelectorAll('div, template[shadowrootmode]');
    elements.forEach(el => {
      if (isAABHost(el)) hideElement(el);
      if (el.tagName === 'TEMPLATE' && el.innerHTML.includes('antiadblockcore')) {
        hideElement(el.parentElement || el);
      }
    });
    unlockScroll();
  }

  function handleFallbackPage() {
    const hqInput = document.querySelector('form input[name="hq"]');
    if (hqInput && document.body.textContent.includes('Ad blocker or auto-click script detected')) {
      const btn = hqInput.closest('form').querySelector('button[type="submit"]');
      if (btn && !btn.dataset.recovering) {
        btn.dataset.recovering = "true";
        setTimeout(() => btn.click(), 1000);
      }
    }
  }

  const domObserver = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1 && isAABHost(node)) {
          hideElement(node);
        }
      }
    }
  });

  domObserver.observe(document.documentElement, { childList: true, subtree: true });

  scanAndHide();
  document.addEventListener('DOMContentLoaded', () => {
    scanAndHide();
    handleFallbackPage();
  });
  window.addEventListener('load', scanAndHide);

  const poller = setInterval(scanAndHide, 300);
  setTimeout(() => clearInterval(poller), 12000);
})();
