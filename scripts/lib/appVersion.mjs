/* 版数の読み取りと比較。**ここだけが `<span id="app-version">` の在りかを知っている。**
 *
 * なぜ切り出したか:
 *   版数を読む処理が `checkVersion.mjs`（打つ版数との突き合わせ）と
 *   `checkVersionBump.mjs`（上げ忘れの検出）の2か所で要る。
 *   ⚠ **同じ正規表現を2か所に置くと、片方だけ変わって食い違う。**
 *     このリポジトリは 2026-08-20 に写し違いで3回落ちている（→ tests/smoke_workflows.mjs）。
 *     ワークフローの `grep` で読むのも同じ理由で禁じ手（→ checkVersion.mjs の `--print`）。
 */

/* HTML から版数を1つ取り出す。読めなければ理由を返す（例外は投げない）。
   ⚠ **複数見つかったら失敗にする。** 版数の表記が2か所に増えると、
     どちらが正か分からないまま片方だけ直す事故が起きる。 */
export function readAppVersion(html) {
  const hits = [...html.matchAll(/<span id="app-version">([^<]*)<\/span>/g)].map(m => m[1].trim());
  if (hits.length === 0) return { error: '<span id="app-version"> が無い', hits };
  if (hits.length > 1) return { error: `<span id="app-version"> が${hits.length}か所ある: ${JSON.stringify(hits)}`, hits };
  return { version: hits[0], hits };
}

/* `v4.90.0` の書式かどうか。
   ⚠ **ここを緩めると、あとで文字列としてシェルに渡る値の素性が分からなくなる。** */
export const isVersion = s => /^v\d+\.\d+\.\d+$/.test(String(s || '').trim());

/* 大小比較（a>b で正）。⚠ **文字列の辞書順で比べないこと。**
   `v4.9.0` > `v4.10.0` になり、10番台に入った瞬間に上げ忘れを見逃す。 */
export function compareVersion(a, b) {
  const na = a.slice(1).split('.').map(Number);
  const nb = b.slice(1).split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (na[i] !== nb[i]) return na[i] - nb[i];
  }
  return 0;
}
