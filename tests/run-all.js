// スモークテストを一括実行し、結果をまとめて表示する
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const TESTS = [
  ['smoke_window',  '表示ウィンドウ（実績72h+予報168h・241点）・祝日判定'],
  ['smoke_hscroll', 'スクラバー帯操作・現在ボタン・4パネル'],
  ['smoke_rank',    'ランキング（全山域・日付切替・峰タップ遷移）'],
  ['smoke_align',   '赤の選択線と選択indexの位置一致・タップ選択'],
  ['smoke_outlook', 'AI全国概況カードの表示/非表示'],
  ['smoke_favpicker', 'お気に入り円柱ピッカー（円周配置・省スペース・選択確定）'],
  ['smoke_cloud',   '雲パネル（無段階表示・青空と白い雲・月齢で夜の濃さ）'],
  ['smoke_press',   '気圧パネル（ΔP6hのバー・急降下の爆弾マーク・目盛りの帯）'],
  ['smoke_wind',    '判定に使う風の高度（山頂の気圧面風・安全弁・フォールバック）'],
  ['smoke_snowrank', '新雪ランキング推定（SLR・補正係数k・評価窓・信頼度）'],
  ['smoke_snowui',  '新雪ランキングUI（タブ・順位・タグ絞り込み・信頼度表示）'],
  ['smoke_mapui',  '地図選択（ベース5種・オーバーレイ・赤色立体図風・標高タイル・永続化）'],
  ['smoke_tilecache', '地図タイルキャッシュ（対象ホスト・cache-first・LRU・削除）'],
  ['smoke_rain',   '雨の予告（毎時の見込み・ナウキャスト1画素読み・分きざみ）'],
  ['smoke_pwa',    'PWA（manifest・アイコン・Service Worker）'],
  ['smoke_kyt',    'KYT分析用紙（様式寸法・上限字数・印刷1枚・溢れ検知）'],
  ['smoke_worker', '下書き生成Worker（秘密パス・CORS・日次上限・内部を漏らさない）'],
];

let failed = 0;
for (const [name, desc] of TESTS) {
  process.stdout.write(`${name.padEnd(14)} ${desc} ... `);
  try {
    // WorkerのテストはESM（.mjs）。拡張子は存在する方を使う
    const file = ['.js', '.mjs'].map(ext => path.join(__dirname, name + ext)).find(fs.existsSync);
    execFileSync(process.execPath, [file], { stdio: 'pipe' });
    console.log('PASS');
  } catch (e) {
    failed++;
    console.log('FAIL');
    console.log(String(e.stdout || '').split('\n').slice(-25).join('\n'));
  }
}
console.log(failed === 0 ? `\n✅ 全${TESTS.length}件PASS` : `\n❌ ${failed}件FAIL`);
process.exit(failed === 0 ? 0 : 1);
