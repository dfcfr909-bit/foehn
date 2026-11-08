# 地理院ベクトルタイル（pbf）を復号し、注記（label）レイヤーの漢字・読み・注記種別を一覧にする
# 使い方: python -I gsi_vt.py <pbfファイル> [<pbfファイル> ...]
import sys, json, mapbox_vector_tile
out=[]
for p in sys.argv[1:]:
    d=mapbox_vector_tile.decode(open(p,'rb').read())
    for lname,layer in d.items():
        for f in layer['features']:
            pr=f['properties']
            if 'knj' in pr or 'kana' in pr or 'annoCtg' in pr:
                out.append({'tile':p.split('/')[-1],'layer':lname,**{k:pr.get(k) for k in ('annoCtg','knj','kana','ftCode','vt_code','dspPos') if k in pr}, 'otherKeys':sorted(set(pr)-{'annoCtg','knj','kana','ftCode'})})
print(json.dumps(out,ensure_ascii=False))
