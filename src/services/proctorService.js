/**
 * proctorService.js
 * Module-level singleton — manages camera stream, keyboard lock,
 * screenshot block, and phone detection across the assessment flow.
 */

// ─── Camera ───────────────────────────────────────────────────
let _stream = null;

export async function startCamera() {
  if (_stream) return _stream;
  _stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 320, height: 240, facingMode: 'user' },
    audio: false,
  });
  return _stream;
}

export function getStream() { return _stream; }

export function stopCamera() {
  if (_stream) {
    _stream.getTracks().forEach(t => t.stop());
    _stream = null;
  }
}

// ─── Device Fingerprint ───────────────────────────────────────
let _fp = null;

export function generateFingerprint() {
  const data = [
    navigator.userAgent,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    navigator.language,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.platform || '',
  ].join('|');
  let h = 0;
  for (let i = 0; i < data.length; i++) {
    h = ((h << 5) - h) + data.charCodeAt(i);
    h |= 0;
  }
  _fp = Math.abs(h).toString(16).toUpperCase().padStart(8, '0');
  return _fp;
}

export function getFingerprint() { return _fp || generateFingerprint(); }

// ─── Keyboard Lock ────────────────────────────────────────────
let _keyLockActive = false;
let _keyLockCb = null;

function _keyHandler(e) {
  if (!_keyLockActive) return;

  const k = e.key?.toLowerCase() || '';

  // Always block developer tools
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && 'ijc'.includes(k)) ||
    (e.ctrlKey && k === 'u')
  ) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  // Block dangerous Ctrl/Meta combos (copy, cut, paste, select-all, save, print)
  if ((e.ctrlKey || e.metaKey) && 'cvxaspu'.includes(k)) {
    e.preventDefault();
    _keyLockCb?.('Ctrl+' + k.toUpperCase() + ' blocked');
    return;
  }

  // Allow MCQ answer keys A/B/C/D
  if ('abcd'.includes(k) && !e.ctrlKey && !e.altKey && !e.metaKey) return;

  // Allow navigation + utility keys
  const allowed = [
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'Tab', 'Enter', 'Escape', 'Backspace', 'Delete',
    'Home', 'End', 'PageUp', 'PageDown',
  ];
  if (allowed.includes(e.key)) return;

  // Allow browser F-keys (except F12 which is blocked above)
  if (/^F\d+$/.test(e.key)) return;

  // Block everything else
  e.preventDefault();
}

function _ctxHandler(e) {
  if (_keyLockActive) e.preventDefault();
}

export function installKeyLock(onBlock) {
  _keyLockCb = onBlock || null;
  if (!_keyLockActive) {
    _keyLockActive = true;
    document.addEventListener('keydown', _keyHandler, true);
    document.addEventListener('contextmenu', _ctxHandler);
    document.addEventListener('selectstart', _selHandler);
    document.addEventListener('dragstart', _dragHandler);
  }
}

export function removeKeyLock() {
  _keyLockActive = false;
  _keyLockCb = null;
  document.removeEventListener('keydown', _keyHandler, true);
  document.removeEventListener('contextmenu', _ctxHandler);
  document.removeEventListener('selectstart', _selHandler);
  document.removeEventListener('dragstart', _dragHandler);
}

function _selHandler(e)  { if (_keyLockActive) e.preventDefault(); }
function _dragHandler(e) { e.preventDefault(); }

// ─── Screenshot Block ─────────────────────────────────────────
let _ssCb = null;

// keydown — catches PrintScreen on most browsers + Win+Shift+S when browser receives it
function _ssKeydownHandler(e) {
  const isPrtSc = e.key === 'PrintScreen' || e.code === 'PrintScreen';
  // Win+Shift+S: Windows key = metaKey OR getModifierState('Meta'|'OS')
  const hasWinKey = e.metaKey
    || e.getModifierState?.('Meta')
    || e.getModifierState?.('OS');
  const isSnip = e.shiftKey && hasWinKey && e.key?.toLowerCase() === 's';

  if (isPrtSc || isSnip) {
    e.preventDefault();
    e.stopPropagation();
    // Overwrite clipboard so the captured image is replaced with nothing
    navigator.clipboard?.writeText('').catch(() => {});
    _ssCb?.(isPrtSc ? 'PrintScreen' : 'Win+Shift+S (Snipping Tool)');
  }
}

// keyup — catches PrintScreen on browsers that only fire it on keyup (Firefox, some Chrome builds)
function _ssKeyupHandler(e) {
  if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
    e.preventDefault();
    navigator.clipboard?.writeText('').catch(() => {});
    _ssCb?.('PrintScreen');
  }
}

// focus blur — when Win+Shift+S activates the Snipping Tool overlay it steals window focus;
// the browser fires window blur even though the OS never sent a keydown to us
function _ssBlurHandler() {
  _ssCb?.('Win+Shift+S (Snipping Tool)');
}

export function installScreenBlock(onBlock) {
  _ssCb = onBlock || null;
  document.addEventListener('keydown', _ssKeydownHandler, true);
  document.addEventListener('keyup',   _ssKeyupHandler,   true);
  window.addEventListener('blur', _ssBlurHandler);
}

export function removeScreenBlock() {
  document.removeEventListener('keydown', _ssKeydownHandler, true);
  document.removeEventListener('keyup',   _ssKeyupHandler,   true);
  window.removeEventListener('blur', _ssBlurHandler);
  _ssCb = null;
}

// ─── Phone Detection ──────────────────────────────────────────
// Simplified 2-trait algorithm derived from the reference HTML.
// Trait A: uniform rectangular region with phone aspect ratio
// Trait B: dark circular region (camera lens signature)

const PD_W = 128;
const PD_H = 96;

let _pdCanvas = null;
let _pdCtx    = null;

export function initPhoneDetector() {
  if (_pdCanvas) return true;
  _pdCanvas = document.createElement('canvas');
  _pdCanvas.width  = PD_W;
  _pdCanvas.height = PD_H;
  _pdCtx = _pdCanvas.getContext('2d', { willReadFrequently: true });
  return !!_pdCtx;
}

/** Returns a score 0–1. Above 0.45 = phone likely present. */
export function detectPhone(videoEl) {
  if (!videoEl || videoEl.readyState < 2 || !_pdCtx) return 0;

  _pdCtx.drawImage(videoEl, 0, 0, PD_W, PD_H);
  let px;
  try { px = _pdCtx.getImageData(0, 0, PD_W, PD_H).data; } catch { return 0; }

  // Build luminance map
  const L = new Float32Array(PD_W * PD_H);
  for (let i = 0; i < PD_W * PD_H; i++) {
    const p = i * 4;
    L[i] = (px[p] * 0.299 + px[p + 1] * 0.587 + px[p + 2] * 0.114) / 255;
  }

  // ── Trait A: find uniform rectangle with phone aspect ratio ──
  const SW = 32, SH = 24; // downscale for speed
  const sL = new Float32Array(SW * SH);
  for (let y = 0; y < SH; y++) {
    for (let x = 0; x < SW; x++) {
      sL[y * SW + x] = L[Math.floor(y * PD_H / SH) * PD_W + Math.floor(x * PD_W / SW)];
    }
  }

  let bestShape = 0;
  const step = 4;
  for (let y1 = 0; y1 < SH - 6; y1 += step) {
    for (let x1 = 0; x1 < SW - 4; x1 += step) {
      for (let h = 6; y1 + h <= SH; h += step) {
        for (let w = 4; x1 + w <= SW; w += step) {
          const ar = w / h;
          // Phone portrait (0.38–0.68) or landscape (1.45–2.6)
          if (!((ar >= 0.38 && ar <= 0.68) || (ar >= 1.45 && ar <= 2.6))) continue;

          let sum = 0, sum2 = 0, cnt = 0;
          for (let dy = 0; dy < h; dy += 2) {
            for (let dx = 0; dx < w; dx += 2) {
              const v = sL[(y1 + dy) * SW + (x1 + dx)];
              sum += v; sum2 += v * v; cnt++;
            }
          }
          if (cnt < 4) continue;
          const mean = sum / cnt;
          const variance = sum2 / cnt - mean * mean;
          if (variance > 0.035) continue; // must be uniform (solid body)

          const areaFrac = (w * h) / (SW * SH);
          if (areaFrac < 0.10) continue;

          const score = areaFrac * (1 - variance / 0.035);
          if (score > bestShape) bestShape = score;
        }
      }
    }
  }

  // ── Trait B: dark circular spot (camera lens) ──
  let bestLens = 0;
  for (let cy = 5; cy < PD_H - 5; cy += 3) {
    for (let cx = 5; cx < PD_W - 5; cx += 3) {
      const cL = L[cy * PD_W + cx];
      if (cL > 0.38) continue; // lens must be dark

      // Sample a ring of radius ~5px
      let ringSum = 0, ringCnt = 0;
      for (let dy = -7; dy <= 7; dy++) {
        for (let dx = -7; dx <= 7; dx++) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 3.5 || dist > 6.5) continue;
          const ni = (cy + dy) * PD_W + (cx + dx);
          if (ni >= 0 && ni < PD_W * PD_H) { ringSum += L[ni]; ringCnt++; }
        }
      }
      if (ringCnt < 6) continue;
      const delta = ringSum / ringCnt - cL;
      if (delta > 0.14) {
        bestLens = Math.max(bestLens, Math.min(1, delta * 3.5));
      }
    }
  }

  // Weighted combination — both traits needed for high confidence
  const bodyBoost = (bestShape > 0.5 && bestLens > 0.35) ? 0.15 : 0;
  return Math.min(1, bestShape * 0.55 + bestLens * 0.45 + bodyBoost);
}
