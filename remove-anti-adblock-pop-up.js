// ==UserScript==
// @name         Remove Anti-Adblock Popup - Advanced
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aggressively remove anti-adblock popups with CSS injection on pahe.ink
// @author       rehandilawar
// @homepageURL  https://github.com/rehandilawar
// @supportURL   https://github.com/rehandilawar
// @match        *://pahe.ink/*
// @match        *://*.pahe.ink/*
// @icon         https://raw.githubusercontent.com/RehanDilawar/remove-anti-adblock-pop-up/refs/heads/main/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  const styles = `
    #n32dbfd7a,
    #n32dbfd7a * {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    [data-cdf4246a7-card],
    [data-cdf4246a7-card] * {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .give-freely-root {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #give-freely-root-kkkbiiikppgjdiebcabomlbidfodipjg {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    [data-cdf4246a7-style] {
      display: none !important;
    }

    body {
      overflow: auto !important;
    }

    html {
      overflow: auto !important;
    }

    [style*="z-index: 2147483647"],
    [style*="position: fixed"][style*="inset: 0px"] {
      display: none !important;
      pointer-events: none !important;
    }
  `;

  function injectStyles() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'adblock-popup-killer';
    style.textContent = styles;
    
    if (document.head) {
      document.head.appendChild(style);
    } else {
      document.documentElement.appendChild(style);
    }
  }

  function removePopup() {
    const selectors = [
      '#n32dbfd7a',
      '[data-cdf4246a7-card]',
      '.give-freely-root',
      '#give-freely-root-kkkbiiikppgjdiebcabomlbidfodipjg',
      '[style*="z-index: 2147483647"]',
      'div[style*="position: fixed"][style*="inset: 0px"]'
    ];

    selectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          el.remove();
        });
      } catch (e) {
      }
    });

    document.body.style.overflow = 'auto !important';
    document.documentElement.style.overflow = 'auto !important';
  }

  function preventCreation() {
    const originalCreate = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreate.call(this, tagName);
      
      const originalSetAttr = element.setAttribute;
      element.setAttribute = function(name, value) {
        if ((name === 'id' && value === 'n32dbfd7a') ||
            (name === 'class' && value.includes('cdf4246a7'))) {
          console.log('Prevented popup element creation');
          return;
        }
        return originalSetAttr.call(this, name, value);
      };
      
      return element;
    };

    const originalInsert = Element.prototype.insertAdjacentHTML;
    Element.prototype.insertAdjacentHTML = function(position, html) {
      if (html.includes('cdf4246a7') || 
          html.includes('n32dbfd7a') ||
          html.includes('give-freely-root')) {
        console.log('Blocked popup HTML injection');
        return;
      }
      return originalInsert.call(this, position, html);
    };

    const originalHTMLSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
    Object.defineProperty(Element.prototype, 'innerHTML', {
      set: function(html) {
        if (html.includes('cdf4246a7') || 
            html.includes('n32dbfd7a') ||
            html.includes('give-freely-root')) {
          console.log('Blocked popup innerHTML injection');
          return;
        }
        return originalHTMLSetter.call(this, html);
      }
    });

    const originalAppend = Element.prototype.appendChild;
    Element.prototype.appendChild = function(node) {
      if (node.id === 'n32dbfd7a' || 
          node.classList?.contains('cdf4246a7') ||
          node.classList?.contains('give-freely-root')) {
        console.log('Prevented popup appendChild');
        return node;
      }
      return originalAppend.call(this, node);
    };
  }

  function blockResources() {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = String(args[0]);
      if (url.includes('antiadblockcore') || 
          url.includes('freelygreatestscammer') ||
          url.includes('give-freely') ||
          url.includes('cdf4246a7')) {
        console.log('Blocked popup resource:', url);
        return Promise.reject(new Error('Blocked'));
      }
      return originalFetch.apply(this, args);
    };

    const originalXHR = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
      if (String(args[1]).includes('antiadblockcore') ||
          String(args[1]).includes('give-freely')) {
        console.log('Blocked popup XHR:', args[1]);
        return;
      }
      return originalXHR.apply(this, args);
    };
  }

  injectStyles();
  removePopup();
  preventCreation();
  blockResources();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      removePopup();
      injectStyles();
    });
  }

  const monitor = setInterval(() => {
    removePopup();
  }, 250);

  setTimeout(() => {
    clearInterval(monitor);
  }, 30000);

  console.log('Anti-adblock popup killer (Advanced) loaded');
})();
