/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

declare global {
  interface Window {
    openApp: () => void;
  }
}

const comboWindowMs = 400;
let lastDotPressedAt = 0;
let lastEnterPressedAt = 0;
const pressedKeys = new Set<string>();

const shouldTriggerCombo = () => {
  if (pressedKeys.has('.') && pressedKeys.has('Enter')) {
    return true;
  }

  if (lastDotPressedAt === 0 || lastEnterPressedAt === 0) {
    return false;
  }

  return Math.abs(lastDotPressedAt - lastEnterPressedAt) <= comboWindowMs;
};

const triggerOpenApp = () => {
  window.openApp?.();
  lastDotPressedAt = 0;
  lastEnterPressedAt = 0;
};

window.addEventListener('keydown', (event) => {
  if (event.repeat) {
    return;
  }

  pressedKeys.add(event.key);

  if (event.key === '.') {
    lastDotPressedAt = Date.now();
  }

  if (event.key === 'Enter') {
    lastEnterPressedAt = Date.now();
  }

  if (shouldTriggerCombo()) {
    triggerOpenApp();
  }
});

window.addEventListener('keyup', (event) => {
  pressedKeys.delete(event.key);
});

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite',
);
