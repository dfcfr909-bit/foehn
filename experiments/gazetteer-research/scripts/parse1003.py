# 1003山PDFの pdftotext -layout 出力を行に分解し、リンク（座標）をページ内の順で対応づけて TSV にする
import sys, re, json
txt=open(sys.argv[1],encoding='utf-8').read(); links=json.load(open(sys.argv[2],encoding='utf-8'))
pages=txt.split('\f'); rows=[]; bad=[]
pat=re.compile(r'^\s*(\d+)\s+(\d+(?:-\d+)?)\s+(.+?)\s{2,}(.+?)\s{2,}([\d,]+(?:\.\d+)?)\s+(\S+)\s+(.+?)\s*$')
for pi,pg in enumerate(pages):
    for line in pg.split('\n'):
        if not re.match(r'^\s*\d+\s+\d',line): continue
        m=pat.match(line)
        if m: rows.append([pi+1]+list(m.groups()))
        else: bad.append((pi+1,line))
# ページごとにリンクを y 降順で並べ、行と順に対応
from collections import defaultdict
lp=defaultdict(list)
for l in links: lp[l['page']].append(l)
rp=defaultdict(list)
for r in rows: rp[r[0]].append(r)
out=[]
for p in sorted(rp):
    ls=sorted(lp[p],key=lambda l:-l['y'])
    if len(ls)!=len(rp[p]): print('MISMATCH page',p,len(ls),len(rp[p]),file=sys.stderr)
    for r,l in zip(rp[p],ls):
        m=re.search(r'#(\d+)/([-\d.]+)/([-\d.]+)',l['uri'])
        out.append(r[1:]+[m.group(2),m.group(3)] if m else r[1:]+['',''])
print('連番\t索引番号\t山名<山頂名>\t山名よみ<山頂名よみ>\t標高値m\t種別\t都道府県\t緯度(リンク)\t経度(リンク)')
for o in out: print('\t'.join(o))
for b in bad: print('BAD',b,file=sys.stderr)
