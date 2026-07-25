// icons/icon.svg から各サイズのPNGを書き出す。
// 環境にImageMagick等が無いため、同梱のChromiumでSVGを描画してスクリーンショットを撮る。
//
//   node scripts/gen-icons.mjs
//
// 生成物（すべて icons/ 配下）:
//   icon-192.png / icon-512.png      … manifest用（any）
//   icon-maskable-512.png            … manifest用（maskable。安全域を確保するため余白付き）
//   apple-touch-icon.png (180)       … iOSのホーム画面用
//   favicon-32.png / favicon-16.png  … タブのアイコン
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// playwright-core は tests/ の依存として入っているのでそこから解決する
const require = createRequire(join(root, 'tests', 'package.json'));
const { chromium } = require('playwright-core');
const svg = readFileSync(join(root, 'icons', 'icon.svg'), 'utf8');

// maskableはランチャーが円形などに切り抜くため、図柄を中央80%に収めて周囲を余白にする
const MASKABLE_INSET = 0.1;

const TARGETS = [
  { file: 'icon-192.png',          size: 192, maskable: false },
  { file: 'icon-512.png',          size: 512, maskable: false },
  { file: 'icon-maskable-512.png', size: 512, maskable: true  },
  { file: 'apple-touch-icon.png',  size: 180, maskable: false },
  { file: 'favicon-32.png',        size: 32,  maskable: false },
  { file: 'favicon-16.png',        size: 16,  maskable: false },
];

function page(size, maskable) {
  const inner = maskable ? Math.round(size * (1 - MASKABLE_INSET * 2)) : size;
  const pad = Math.round((size - inner) / 2);
  return `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;background:#87ceeb}
  /* maskable時は図柄を縮めて周囲に安全域を作る。地色は原図の空色に合わせる */
  #box{width:${size}px;height:${size}px;background:#87ceeb;overflow:hidden}
  svg{display:block;width:${inner}px;height:${inner}px;margin:${pad}px}
</style>
<div id="box">${svg}</div>`;
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true });
for (const t of TARGETS) {
  const p = await browser.newPage({ viewport: { width: t.size, height: t.size } });
  await p.setContent(page(t.size, t.maskable));
  const buf = await p.locator('#box').screenshot({ omitBackground: false });
  writeFileSync(join(root, 'icons', t.file), buf);
  console.log(`${t.file.padEnd(24)} ${t.size}x${t.size}  ${buf.length} bytes`);
  await p.close();
}
await browser.close();
console.log('アイコンを生成しました。');
