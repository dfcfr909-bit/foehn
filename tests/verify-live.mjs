/* 公開URLに実際に配信されているものを検証する（デプロイ後の確認）。
 *
 * なぜ要るか:
 *   開発環境からもCIのスモークテストからも、**公開URLは見ていない**。
 *   スモークは手元の `sotoki_v4.html` を読み込んで通信をスタブするので、
 *   「デプロイされたか」「外部APIが実際に叩けるか」は一切分からない。
 *   実際に #27 では「標高が出ない」という報告に対して、原因は不具合ではなく
 *   **まだマージしていなかった**だけ、という往復が2回起きた。
 *
 * ⚠ **これは実機確認の代わりにはならない。**
 *   iOS Safari とホーム画面のPWAは Chromium とは別物で、このリポジトリは
 *   iOS特有のフィルタ不具合を2回踏んでいる（`tests/smoke_mapui.js` の注記）。
 *   ここで見るのは「配信されているか」「外から叩けるか」まで。
 *
 * 検査は2つあり、**性質がまったく違うので分けて走らせられる**ようにしてある。
 *
 *   ① deploy  … 配信物の sha256 が手元の版と一致するか。**外部を1つも叩かない**。
 *                赤は必ず「本当に配信されていない」を意味する。毎デプロイで自動
 *   ② browser … 実ブラウザで起動するか・Nominatim・地理院が叩けるか。
 *                **外部を実際に叩く**ので手動実行のみ
 *
 * ⚠ **②を毎デプロイに戻さないこと。** Nominatim の制限はIP単位で、Actions の
 *   ランナーは他人のCIと共有の(Azure)IPを使う。こちらの行儀と無関係に絞られうるので、
 *   自動で回すと**「赤いが直すところが無い」通知**が定期的に出る。
 *   赤の意味が割れた検査は、そのうち誰も見なくなる。
 *
 * 使い方: node tests/verify-live.mjs [URL] [--only=deploy|browser]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const URL_LIVE = args.find(a => !a.startsWith('--')) ||
  'https://dfcfr909-bit.github.io/foehn/sotoki_v4.html';

/* ⚠ **綴りの誤りを黙って通さないこと。** `--only=browsers` のような打ち間違いを
     既定（両方）にフォールバックさせると、CI側の意図と食い違ったまま緑になる。
     「検証していないものが検証済みに見える」のがこの手の道具のいちばん悪い嘘。 */
const onlyArg = args.find(a => a.startsWith('--only='));
const ONLY = onlyArg ? onlyArg.slice('--only='.length) : 'all';
if (!['all', 'deploy', 'browser'].includes(ONLY)) {
  console.error(`--only は deploy / browser のいずれか（受け取った値: ${JSON.stringify(ONLY)}）`);
  process.exit(2);
}

const fails = [];
const ok = (c, label, extra) => {
  console.log(`${c ? '  ✓' : '  ✗'} ${label}` + (!c && extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 400)}` : ''));
  if (!c) fails.push(label);
};

console.log(`公開URLを検証します: ${URL_LIVE}`);
console.log(`検査: ${{ all: '① 配信物 ＋ ② 実ブラウザ', deploy: '① 配信物のみ', browser: '② 実ブラウザのみ' }[ONLY]}\n`);

/* --- ① 配信されているものが手元の版と同一か ---
   ⚠ **ここがいちばん効く。** 「直したのに変わらない」の大半は
     不具合ではなく「まだ配信されていない」。先にこれを潰す。
   ⚠ **外部は1つも叩かない**（GitHub Pages だけ）。だから毎デプロイで自動に回せる。 */
if (ONLY === 'browser') {
  console.log('① 配信物の同一性 … このジョブでは見ない');
} else {
  console.log('① 配信物の同一性');
  const sha = b => crypto.createHash('sha256').update(b).digest('hex');
  /* ⚠ **取得に失敗したら本文を配信物として扱わないこと。**
       403 のエラーページ（109バイト）をHTMLと突き合わせて「一致しない」と
       報告してしまい、**到達できないのか中身が違うのかが区別できなくなる**。
       最初にそう書いて、手元で走らせて気づいた。 */
  let liveHtml = null;
  try {
    const res = await fetch(URL_LIVE, { signal: AbortSignal.timeout(30000), cache: 'no-store' });
    ok(res.ok, `取得できる（HTTP ${res.status}）`);
    if (res.ok) liveHtml = await res.text();
  } catch (e) {
    ok(false, '取得できる', e.message);
  }
  if (liveHtml === null) {
    console.log('    → 取得できていないので同一性は判定しない（中身の問題ではない）');
  } else {
    const local = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'));
    const same = sha(Buffer.from(liveHtml)) === sha(local);
    ok(same, '★配信物がこのコミットの sotoki_v4.html と一致する',
      same ? undefined : { live: sha(Buffer.from(liveHtml)).slice(0, 12), local: sha(local).slice(0, 12),
        ヒント: 'デプロイがまだか、別のコミットが配信されている' });
    const v = (liveHtml.match(/id="app-version">(v[0-9.]*)/) || [])[1];
    console.log(`    配信中の版: ${v || '不明'} / ${liveHtml.length} bytes`);
  }
}

/* --- ② 実ブラウザで起動するか・外部APIが叩けるか ---
   ⚠ **外部（Nominatim・地理院）を実際に叩く。** 相手方に迷惑をかけないよう、
     検索は**1回だけ**。手動実行のみで、定期実行もデプロイ後の自動も足さないこと。 */
if (ONLY === 'deploy') {
  console.log('\n② 実ブラウザでの起動と外部の疎通 … このジョブでは見ない（外部を叩くので手動実行のみ）');
} else {
  console.log('\n② 実ブラウザでの起動と外部の疎通');
  /* ⚠ **playwright-core は動的に読むこと。** 先頭で import すると、
       ①だけを回すジョブ（Chromium も npm install も要らないはずの軽いジョブ）が
       依存が無いというだけで落ちる。 */
  const { chromium } = await import('playwright-core');
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  /* ⚠ **到達できないときに例外で落とさないこと。** そこで落ちると以降の検査が
       走らず、サマリーにもスタックトレースしか残らない。
       「届かなかった」も検証結果の一つとして整然と報告する。 */
  let reached = false;
  try {
    await page.goto(URL_LIVE, { waitUntil: 'domcontentloaded', timeout: 60000 });
    reached = true;
  } catch (e) {
    ok(false, '★公開URLに到達できる', e.message.split('\n')[0]);
  }

  try {
    if (!reached) throw new Error('到達できていないので以降は省略');
    await page.waitForTimeout(6000);   // 気象データの取得を待つ

    const boot = await page.evaluate(() => ({
      hasState: typeof state !== 'undefined',
      loading: (() => { const el = document.getElementById('loading-overlay');
        return !!el && getComputedStyle(el).display !== 'none'; })(),
    })).catch(e => ({ err: e.message }));
    ok(boot.hasState === true, '★起動する（スクリプトが評価されている）', boot);
    ok(boot.loading === false, '読み込みオーバーレイが消える', boot);
    ok(errors.length === 0, 'ページ内で例外が出ていない', errors);

    /* 検索を1回だけ実行する。⚠ 実際に Nominatim と地理院を叩くので増やさないこと。
       ここで**地理院由来の候補が出れば CORS が通っている**と言える
       （ブラウザでしか確かめられない。#27 では人の目に頼るしかなかった）。 */
    const rows = await page.evaluate(async () => {
      document.getElementById('map-search-input').value = '五竜岳';
      await doMapSearch();
      await new Promise(r => setTimeout(r, 3000));   // 標高の読み取りを待つ
      return [...document.querySelectorAll('#map-results .map-result-item')].map(el => ({
        name: el.querySelector('.map-result-name').textContent,
        sub: el.querySelector('.map-result-sub').textContent,
        elev: el.querySelector('.map-result-elev').textContent,
        badge: (el.querySelector('.map-result-badge') || {}).textContent || '',
      }));
    }).catch(e => ({ err: e.message }));

    if (Array.isArray(rows)) {
      console.log('    検索結果:', JSON.stringify(rows));
      ok(rows.length > 0, '★検索が結果を返す（Nominatimに到達できている）', rows);
      ok(rows.some(r => r.sub.includes('国土地理院')),
        '★★地理院の候補が混ざる（ブラウザからCORSで叩けている）', rows);
      ok(rows.some(r => /\d+m/.test(r.elev)),
        '★標高が読める（標高タイルをCanvasで読めている）', rows);
      ok(rows.some(r => r.badge === '百名山'), '百名山の印が出る', rows);
    } else {
      ok(false, '検索を実行できる', rows);
    }
  } catch (e) {
    if (reached) ok(false, '検証を最後まで進められる', e.message);
  } finally {
    await browser.close();
  }
}

console.log('');
if (fails.length) {
  console.log(`❌ ${fails.length}件が期待どおりでない:`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log('✅ 公開URLは期待どおり');
