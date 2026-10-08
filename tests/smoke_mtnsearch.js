/* 手元の山の検索（#171・第1段階）の検証。
 *
 * 引くのは areas.json の110峰（読み・都道府県・総称・別名は data/peak_meta.json）。
 * 点数 = 一致度（完全120／前方80／部分60／曖昧30）＋履歴＋名山。**不一致は候補から外す。**
 * Enter のときは、区切りの下に地名検索（Nominatim・地理院）の結果を足す。
 *
 * 通信はスタブする。
 */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const ENGINE = fs.readFileSync(path.join(ROOT, 'snowRanking.js'), 'utf8');
const AREAS = fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8');
const META = fs.readFileSync(path.join(ROOT, 'data', 'peak_meta.json'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');
const LEAFLET_JS = fs.readFileSync(__dirname + '/node_modules/leaflet/dist/leaflet.js', 'utf8');
const LEAFLET_CSS = fs.readFileSync(__dirname + '/node_modules/leaflet/dist/leaflet.css', 'utf8');

const LAT = 36.5, LON = 137.7;   // 北アルプス付近を見ている
// 地名検索の側。五竜岳は areas.json と同じ座標（手元に出るので外れる）と、遠い同名（残る）
const GORYU_NEAR = { place_id: 20, lat: '36.6585', lon: '137.7527', display_name: '五竜岳, 黒部市, 富山県, 日本' };
const GORYU_FAR  = { place_id: 21, lat: '38.9000', lon: '140.1500', display_name: '五竜岳, 山形県, 日本' };
const NOMINATIM = {
  '五竜岳': [GORYU_NEAR, GORYU_FAR],
  '月山': [{ place_id: 5, lat: '38.5489', lon: '140.0270', display_name: '月山, 山形県, 日本' }],
  // 山頂名（#176）。手元の「雄山（立山）」と同じ山（1km以内）なので地名検索の側から外れる
  '雄山': [{ place_id: 30, lat: '36.5760', lon: '137.6199', display_name: '雄山, 立山町, 富山県, 日本' }],
};

(async () => {
  const fails = [];
  const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
  const errors = [];
  let nominatimFail = false;

  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => d.accept());
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.endsWith('/snowRanking.js')) return route.fulfill({ contentType: 'application/javascript', body: ENGINE });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('leaflet.min.js') || url.includes('leaflet.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
    if (url.includes('leaflet.min.css') || url.includes('leaflet.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
    if (url.endsWith('areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
    if (url.endsWith('data/peak_meta.json')) return route.fulfill({ contentType: 'application/json', body: META });
    if (url.includes('nominatim.openstreetmap.org/search')) {
      if (nominatimFail) return route.fulfill({ status: 500, body: '' });
      const q = new URL(url).searchParams.get('q');
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(NOMINATIM[q] || []),
        headers: { 'access-control-allow-origin': '*' } });
    }
    if (url.includes('msearch.gsi.go.jp/address-search')) {
      if (nominatimFail) return route.fulfill({ status: 500, body: '' });
      return route.fulfill({ contentType: 'application/json', body: '[]', headers: { 'access-control-allow-origin': '*' } });
    }
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.addInitScript(ll => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: ll[0], lon: ll[1], name: '北アルプス' }));
  }, [LAT, LON]);
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(800);

  const boot = await page.evaluate(() => (typeof mtnSearch === 'undefined'
    ? 'mtnSearch未定義（スクリプトが評価されていない）' : null)).catch(e => e.message);
  if (boot) throw new Error(`起動に失敗: ${boot} / pageerror: ${errors.join(' / ') || 'なし'}`);
  await page.evaluate(() => openMap());
  await page.waitForTimeout(300);
  await page.evaluate(async () => { await ensureMtnIndex(); });

  // 打ったときの手元の候補（表示名の並び）
  const typed = q => page.evaluate(q => {
    const input = document.getElementById('map-search-input');
    input.focus();
    input.value = q;
    input.dispatchEvent(new Event('input'));
    return [...document.querySelectorAll('#mtn-results .mtn-item .mtn-name')].map(e => e.textContent);
  }, q);
  const focusEmpty = () => page.evaluate(() => {
    const q = document.getElementById('map-search-input');
    q.value = ''; q.blur(); q.focus();
    return {
      mtn: [...document.querySelectorAll('#mtn-results .mtn-item .mtn-name')].map(e => e.textContent),
      head: (document.querySelector('#mtn-results .mtn-head') || {}).textContent || '',
      place: document.querySelectorAll('#map-results .map-hist-row').length,
    };
  });

  /* --- 読みの下書きが110峰ぶんある --- */
  const idx = await page.evaluate(() => ({ n: mtnIndex.length, kana: mtnIndex.filter(p => p.kana).length }));
  ok(idx.n === 110 && idx.kana === 110, '★110峰すべてに読みが入っている（data/peak_meta.json）', idx);

  /* --- 表記揺れ：槍ケ岳／槍ヶ岳／ヤリガタケ／やりがたけ --- */
  for (const q of ['槍ケ岳', '槍ヶ岳', 'ヤリガタケ', 'やりがたけ']) {
    const r = await typed(q);
    ok(r[0] === '槍ヶ岳', `★★「${q}」で槍ヶ岳が先頭に出る`, r);
    // ⚠ 先頭に出るだけでは足りない（畳めていなくても曖昧一致で拾えてしまう）。完全一致で当たること
    const m = await page.evaluate(q => (mtnSearch(q).find(r => r.p.name === '槍ヶ岳') || {}).match, q);
    ok(m === 120, `★★「${q}」は槍ヶ岳に完全一致（表記揺れを畳めている）`, m);
  }
  /* --- 濁点違いは曖昧一致で拾う --- */
  const fuzzy = await page.evaluate(() => {
    const hit = mtnSearch('やりがだけ').find(r => r.p.name === '槍ヶ岳');
    return hit ? hit.match : 0;
  });
  ok(fuzzy === 30, '★「やりがだけ」（濁点違い）が曖昧一致（30）で槍ヶ岳に当たる', fuzzy);
  ok((await typed('やりがだけ')).includes('槍ヶ岳'), '★曖昧一致の候補が画面に出る');

  /* --- 別名・総称の表示 --- */
  const dewa = await typed('出羽富士');
  ok(dewa[0] === '新山（鳥海山）', '★★別名「出羽富士」で鳥海山（新山）に当たり、「新山（鳥海山）」と出る', dewa);
  const chokai = await typed('ちょうかいさん');
  ok(chokai.includes('新山（鳥海山）'), '総称の読みでも当たる', chokai);

  /* --- 無関係な入力は0件 --- */
  for (const q of ['東京タワー', 'zzzz', 'ぱぴぷぺ']) {
    const r = await typed(q);
    ok(r.length === 0, `★無関係な入力「${q}」は手元の候補0件`, r);
  }

  /* --- 名山ティア・履歴の上乗せ（試験用データで） --- */
  const tier = await page.evaluate(() => {
    const areas = { areas: [{ id: 't', name: '試験', peaks: [
      { name: 'あ山', lat: 36, lon: 137, elev: 1000 },
      { name: 'い山', lat: 36, lon: 137, elev: 1000, hyakumeizan: true },
      { name: 'う山', lat: 36, lon: 137, elev: 1000 },
      { name: '別の山', lat: 36, lon: 137, elev: 1000 } ] }] };
    const meta = { peaks: {
      't/あ山': { kana: 'てすとあ' }, 't/い山': { kana: 'てすとい' },
      't/う山': { kana: 'てすとう' }, 't/別の山': { kana: 'べつ' } } };
    const ix = buildPeakIndex(areas, meta);
    const order = hist => mtnSortList(mtnSearch('てすと', ix, hist, 1e12), 'rec', null).map(r => r.p.name);
    const now = 1e12;
    return {
      base: order([]),
      afterPick: order([{ id: 't/う山', count: 1, lastAt: now }]),
      unmatched: order([{ id: 't/別の山', count: 9, lastAt: now }]),
      boostMax: mtnHistBoost({ count: 1000, lastAt: now }, now),
      halfLife: mtnHistBoost({ count: 7, lastAt: now - 14 * 86400000 }, now),
      tierBoost: mtnTierBoost(['新百', '二百', '百']),
    };
  });
  ok(tier.base[0] === 'い山', '★★同じ前方一致なら名山ティアが上', tier);
  ok(tier.afterPick.indexOf('う山') < tier.base.indexOf('う山'), '★★一度選んだ山が同じ入力で上位に上がる', tier);
  ok(!tier.unmatched.includes('別の山'), '★不一致の山は履歴があっても候補に出ない', tier);
  ok(Math.abs(tier.boostMax - 40) < 1e-9, '履歴の上乗せは上限40', tier.boostMax);
  ok(Math.abs(tier.halfLife - 20) < 1e-9, '14日で半分になる（7回で回数の係数は1）', tier.halfLife);
  ok(tier.tierBoost === 30, '名山の上乗せは最上位のティア1つ分だけ', tier.tierBoost);

  /* --- 照合キーの衝突：か・け・が を畳んでも、別の峰どうしの名前・読み・別名が完全一致しない --- */
  const clash = await page.evaluate(() => {
    const seen = new Map(), out = [];
    for (const p of mtnIndex) {
      const ks = new Set([p.name, String(p.name).replace(/[（(].*$/, ''), p.kana, p.summit, p.summitKana, ...p.aliases].filter(Boolean).map(mtnKey));
      for (const k of ks) {
        if (seen.has(k) && seen.get(k) !== p.id) out.push(`${k}: ${seen.get(k)} / ${p.id}`);
        seen.set(k, p.id);
      }
    }
    return out;
  });
  ok(clash.length === 0, '★別の峰どうしで照合キー（名前・読み・山頂名・別名）が一致しない', clash);

  /* --- 主峰・最高峰（#176） --- */
  // groups の打ち間違いを拾う。⚠ 名前の一覧をここに書き写さない（データ側の absent だけを頼る）
  const gcheck = await page.evaluate(async () => {
    const meta = await (await fetch('data/peak_meta.json')).json();
    const groups = meta.groups || {}, bad = [];
    const members = {};
    for (const [id, x] of Object.entries(meta.peaks)) {
      if (!x.group) continue;
      const base = x.summit || id.split('/')[1].replace(/[（(].*$/, '');
      (members[x.group] = members[x.group] || []).push(base);
    }
    for (const g of Object.keys(members)) if (!groups[g]) bad.push(`groups に無い総称: ${g}`);
    for (const [g, v] of Object.entries(groups)) {
      if (!members[g]) { bad.push(`使われていない総称: ${g}`); continue; }
      for (const k of ['main', 'highest']) {
        if (!v[k]) continue;   // main を書かない総称（大峰山など）は飛ばす
        if (!members[g].includes(v[k]) && !(v.absent || []).includes(v[k])) bad.push(`${g}.${k}=${v[k]} が総称の峰にも absent にも無い`);
      }
      for (const a of v.absent || []) if (members[g].includes(a)) bad.push(`${g}: absent の ${a} が手元にある`);
      for (const c of v.check || []) if (!['main', 'highest'].includes(c)) bad.push(`${g}: check の値 ${c}`);
    }
    return bad;
  });
  ok(gcheck.length === 0, '★★groups の総称・主峰・最高峰の名前が峰のデータと食い違わない', gcheck);

  const roleRow = q => page.evaluate(q => {
    const input = document.getElementById('map-search-input');
    input.focus(); input.value = q; input.dispatchEvent(new Event('input'));
    const el = document.querySelector('#mtn-results .mtn-item');
    if (!el) return null;
    return { name: el.querySelector('.mtn-name').textContent,
      roles: [...el.querySelectorAll('.mtn-role')].map(e => e.textContent),
      tags: [...el.querySelectorAll('.mtn-tag')].map(e => e.textContent),
      sub: el.querySelector('.mtn-sub').textContent };
  }, q);
  for (const q of ['柴安嵓', 'しばやすぐら', '燧ヶ岳']) {
    const r = await roleRow(q);
    ok(r && r.name === '柴安嵓（燧ヶ岳）' && r.roles.join() === '主峰,最高峰' && r.tags.join() === '百',
      `★★「${q}」で「柴安嵓（燧ヶ岳）」[主峰][最高峰][百]`, r);
  }
  let r = await roleRow('茶臼岳');
  ok(r && r.name === '茶臼岳（那須岳）' && r.roles.join() === '主峰' && r.sub.startsWith('※最高峰は三本槍岳 · '),
    '★★茶臼岳は [主峰]、2行目に「※最高峰は三本槍岳」', r);
  r = await roleRow('三本槍岳');
  ok(r && r.roles.join() === '最高峰' && r.sub.startsWith('※主峰は茶臼岳 · '), '★★三本槍岳は [最高峰]、「※主峰は茶臼岳」', r);
  r = await roleRow('高田大岳');
  ok(r && r.roles.length === 0 && r.sub.startsWith('※主峰・最高峰は大岳 · '), '★主峰も最高峰も違う峰は「※主峰・最高峰は大岳」', r);
  r = await roleRow('久住山');
  ok(r && r.roles.join() === '主峰' && r.sub.startsWith('※最高峰は中岳'), '★手元に無い最高峰（中岳）も注釈に出せる', r);
  r = await roleRow('八経ヶ岳');
  ok(r && r.roles.join() === '最高峰' && !r.sub.startsWith('※'), '主峰を書かない総称は [最高峰] だけ・注釈なし', r);
  r = await roleRow('雄山');
  ok(r && r.name === '雄山（立山）' && r.sub.startsWith('※最高峰は大汝山'), '★山頂名で表示「雄山（立山）」', r);
  const info = await page.evaluate(() => ({
    none: mtnRoleInfo('x', null), diff: mtnRoleInfo('乙', { main: '甲', highest: '丙' }) }));
  ok(info.none.roles.length === 0 && info.none.note === '' && info.diff.note === '※主峰は甲・最高峰は丙',
    'mtnRoleInfo は純関数（#173 からも呼べる）', info);
  // 選んだあとの地点名は areas.json の名前のまま（決定3）
  await roleRow('柴安嵓');
  await page.evaluate(() => document.querySelector('#mtn-results .mtn-item').click());
  ok(await page.evaluate(() => state.locationName === '燧ヶ岳' && state.summitElev === 2356),
    '★選んだあとの地点名は areas.json の名前（燧ヶ岳）のまま');
  await page.evaluate(() => localStorage.removeItem('mtnSearchHistory.v1'));
  const one = await typed('か');
  ok(one.length > 0 && one.length <= 8, '1文字（「か」）でも候補は上限8件以内', one.length);

  /* --- 選ぶと公称の標高を渡し、山の履歴に残る --- */
  await page.evaluate(() => localStorage.removeItem('mtnSearchHistory.v1'));
  await typed('槍ヶ岳');
  await page.evaluate(() => document.querySelector('#mtn-results .mtn-item').click());
  const picked = await page.evaluate(() => ({ elev: state.summitElev, name: state.locationName,
    hist: JSON.parse(localStorage.getItem('mtnSearchHistory.v1') || '[]') }));
  ok(picked.elev === 3180 && picked.name === '槍ヶ岳', '★★手元の山を選ぶと areas.json の標高を渡す（ADR-0006）', picked);
  ok(picked.hist.length === 1 && picked.hist[0].id === 'kitaalps_s/槍ヶ岳' && picked.hist[0].count === 1,
    '★選んだ山を id・回数・時刻で残す', picked.hist);
  ok(await page.evaluate(() => loadSearchHist().length === 0), '山を選んでも地名の履歴には残さない（決定3）');

  /* --- 空入力：山の履歴が新しい順 → 地名の履歴 --- */
  await page.evaluate(() => {
    localStorage.setItem('mtnSearchHistory.v1', JSON.stringify([
      { id: 'kitaalps_s/槍ヶ岳', count: 1, lastAt: 1000 },
      { id: 'chokai/新山', count: 1, lastAt: 3000 },
      { id: '消えた/山', count: 1, lastAt: 4000 },          // 改名などで見つからない id は黙って捨てる
      { id: 'kitaalps_n/五竜岳', count: 2, lastAt: 2000 }]));
    localStorage.setItem('sotoki_search_hist', JSON.stringify([{ name: '月山', lat: 38.5489, lon: 140.027, t: 1 }]));
  });
  let empty = await focusEmpty();
  ok(JSON.stringify(empty.mtn) === JSON.stringify(['新山（鳥海山）', '五竜岳', '槍ヶ岳']),
    '★★空入力で山の履歴が新しい順（見つからない id は出さない）', empty);
  ok(empty.place === 1, '★山の履歴の下に地名の履歴も出る（決定3）', empty);
  const order = await page.evaluate(() => {
    const ch = [...document.getElementById('map-results').children];
    return { mtn: ch.findIndex(e => e.id === 'mtn-results'), place: ch.findIndex(e => e.classList.contains('map-hist-row')),
      clears: document.querySelectorAll('#map-results .map-hist-clear').length };
  });
  ok(order.mtn === 0 && order.place > 0, '山の履歴が上、地名の履歴が下', order);
  ok(order.clears === 1, '「履歴を消去」は1つだけ', order);

  // 山の履歴の行から選び直しても標高を渡す。地名の履歴からは渡さない
  await page.evaluate(() => document.querySelector('#mtn-results .mtn-hist-row .mtn-item').click());
  ok(await page.evaluate(() => state.summitElev === 2236), '★山の履歴から選んでも areas.json の標高を渡す');
  await focusEmpty();
  await page.evaluate(() => document.querySelector('#map-results .map-hist-row .map-result-item').click());
  ok(await page.evaluate(() => state.summitElev === null), '★地名の履歴から選ぶと標高は渡さない（従来どおり）');

  // 個別削除
  await focusEmpty();
  await page.evaluate(() => document.querySelector('#mtn-results .mtn-hist-del').click());
  empty = await page.evaluate(() => [...document.querySelectorAll('#mtn-results .mtn-item .mtn-name')].map(e => e.textContent));
  ok(!empty.includes('新山（鳥海山）') && empty.length === 2, '★✕で1件だけ消える', empty);

  // 全消去（山・地名の両方）
  await page.evaluate(() => document.querySelector('#map-results .map-hist-clear').click());
  ok(await page.evaluate(() => loadMtnHist().length === 0 && loadSearchHist().length === 0),
    '★「履歴を消去」で山・地名の両方が消える');

  /* --- 履歴が無ければ名山ティア順（上限20） --- */
  empty = await focusEmpty();
  ok(empty.head.includes('名山') && empty.mtn.length === 20, '★履歴が無ければ名山を出す（上限20）', empty);
  ok(empty.place === 0, '地名の履歴が空なら地名の見出しを出さない', empty);

  /* --- 履歴の上限50・壊れたJSON --- */
  const lim = await page.evaluate(() => {
    localStorage.removeItem('mtnSearchHistory.v1');
    mtnIndex.slice(0, 60).forEach((p, i) => addMtnHist(p.id, 1000 + i));
    const a = loadMtnHist();
    return { n: a.length, newest: a[0].id === mtnIndex[59].id };
  });
  ok(lim.n === 50 && lim.newest, '★山の履歴は50件まで（古いものから落とす）', lim);
  const broken = await page.evaluate(() => {
    localStorage.setItem('mtnSearchHistory.v1', '{壊れた');
    const input = document.getElementById('map-search-input');
    input.value = '槍'; input.dispatchEvent(new Event('input'));
    const rows = document.querySelectorAll('#mtn-results .mtn-item').length;
    addMtnHist('kitaalps_s/槍ヶ岳');
    return { rows, after: loadMtnHist().length };
  });
  ok(broken.rows > 0 && broken.after === 1, '★壊れたJSONでも検索は止まらず、記録し直せる', broken);

  /* --- 並べ替え：距離・標高 --- */
  await typed('岳');
  const sorts = await page.evaluate(() => {
    const read = () => [...document.querySelectorAll('#mtn-results .mtn-item')].map(el => mtnById(el.dataset.id));
    const chip = m => document.querySelector(`#mtn-results .mtn-sort-chip[data-mode="${m}"]`);
    const on = () => (document.querySelector('#mtn-results .mtn-sort-chip.on') || {}).textContent;
    const def = on();
    chip('high').click();
    const high = read().map(p => p.elevation);
    chip('dist').click();
    const o = mtnDistOrigin();
    const dist = read().map(p => haversineKm(o.lat, o.lon, p.lat, p.lon));
    const origin = (document.querySelector('#mtn-results .mtn-origin') || {}).textContent;
    chip('rec').click();
    return { def, high, dist, origin };
  });
  const isSorted = (a, cmp) => a.every((v, i) => i === 0 || cmp(a[i - 1], v) <= 0);
  // 同点は読みの五十音順（漢字の文字コード順にしない）
  const tie = await page.evaluate(() => mtnSortList(mtnSearch('だけ'), 'rec', null)
    .filter((r, i, a) => r.score === a[0].score).map(r => r.p.summitKana || r.p.kana));   // 表示名が山頂名なら山頂名の読み
  ok(tie.length > 1 && tie.every((k, i) => i === 0 || tie[i - 1].localeCompare(k, 'ja') <= 0),
    '★同点は読みの五十音順', tie.slice(0, 5));
  ok(sorts.def === 'おすすめ', '★並べ替えの既定は「おすすめ」', sorts.def);
  ok(sorts.high.length > 1 && isSorted(sorts.high, (a, b) => b - a), '★標高は高い順', sorts.high);
  ok(sorts.dist.length > 1 && isSorted(sorts.dist, (a, b) => a - b), '★距離は近い順（haversine）', sorts.dist);
  ok(/地図の中心から|現在地から/.test(sorts.origin || ''), '距離の基準を書き添える', sorts.origin);

  /* --- 行の中身：都道府県・距離・チップ --- */
  await typed('五竜岳');
  const row = await page.evaluate(() => {
    const el = document.querySelector('#mtn-results .mtn-item');
    const tag = el.querySelector('.mtn-tag');
    const before = state.locationName;
    tag.click();
    return { sub: el.querySelector('.mtn-sub').textContent, tag: tag.textContent, elev: el.querySelector('.mtn-elev').textContent,
      picked: state.locationName !== before };
  });
  ok(/長野県・富山県 · \d/.test(row.sub), '★行に都道府県と距離を出す（決定5）', row);
  ok(row.tag === '百' && row.elev === '2,814m', '百名山は [百] のチップ、標高は公称値', row);
  ok(!row.picked, 'チップを押しても地点は選ばない', row);

  /* --- Enter：手元の候補の下に地名検索。同じ山は2行出さない --- */
  const enter = await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '五竜岳';
    await doMapSearch();
    return {
      mtn: [...document.querySelectorAll('#mtn-results .mtn-item .mtn-name')].map(e => e.textContent),
      sep: (document.querySelector('#map-results .place-sep') || {}).textContent || '',
      place: [...document.querySelectorAll('#place-results .map-result-item .map-result-sub')].map(e => e.textContent),
    };
  });
  ok(enter.mtn[0] === '五竜岳', '★Enter でも手元の候補は上に残る', enter);
  ok(enter.sep.includes('地名'), '★手元と地名検索の間に区切りを入れる', enter);
  ok(enter.place.length === 1 && enter.place[0].includes('山形県'),
    '★★手元に出した五竜岳（1km以内）は地名検索の側から外し、遠い同名は残す', enter);

  /* --- 山頂名でも同じ山を2行出さない（#176） --- */
  const oyama = await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '雄山';
    await doMapSearch();
    return { mtn: [...document.querySelectorAll('#mtn-results .mtn-item .mtn-name')].map(e => e.textContent),
      place: document.querySelectorAll('#place-results .map-result-item').length };
  });
  ok(oyama.mtn[0] === '雄山（立山）' && oyama.place === 0, '★地名検索の「雄山」は手元の「雄山（立山）」と同じ山なので外す', oyama);

  /* --- 地名検索が失敗しても手元の候補は残す --- */
  nominatimFail = true;
  const failed = await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '槍ヶ岳';
    await doMapSearch();
    return { mtn: document.querySelectorAll('#mtn-results .mtn-item').length,
      msg: (document.querySelector('#place-results .map-result-msg') || {}).textContent || '' };
  });
  nominatimFail = false;
  ok(failed.mtn > 0 && failed.msg.startsWith('検索失敗'), '★地名検索が落ちても手元の候補は出したまま、区切りの下に失敗と言う', failed);

  /* --- スマホ幅：はみ出さない --- */
  for (const w of [360, 390]) {
    await page.setViewportSize({ width: w, height: 760 });
    await typed(w === 360 ? 'しばやすぐら' : 'おくほたか');   // 360px は名前＋チップ3つの最長の行
    const of = await page.evaluate(() => {
      const box = document.getElementById('map-results');
      const items = [...document.querySelectorAll('#mtn-results .mtn-item')];
      return { box: box.scrollWidth <= box.clientWidth,
        rows: items.every(el => el.scrollWidth <= el.clientWidth),
        oneLine: items.every(el => { const n = el.querySelector('.mtn-name'); return n.getBoundingClientRect().height < 30; }) };
    });
    ok(of.box && of.rows && of.oneLine, `★${w}px で横にはみ出さず、山名は1行`, of);
  }
  if (process.env.MTN_SHOT) await page.screenshot({ path: process.env.MTN_SHOT }).catch(() => {});   // 目視用（任意）

  ok(errors.length === 0, 'ページ内で例外が出ていない', errors);
  await browser.close();
  if (fails.length) {
    console.log('MTNSEARCH SMOKE FAILED');
    fails.forEach(f => console.log('  ✗ ' + f));
    process.exit(1);
  }
  console.log('MTNSEARCH SMOKE PASSED');
})().catch(e => { console.log('MTNSEARCH SMOKE FAILED: ' + e.message); process.exit(1); });
