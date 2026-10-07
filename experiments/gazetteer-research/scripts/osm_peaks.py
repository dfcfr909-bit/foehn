# OSM API の map 応答（XML）から natural=peak / volcano の節点だけを抜き出す
import sys, json, xml.etree.ElementTree as ET
out=[]
for path in sys.argv[1:]:
    root=ET.parse(path).getroot()
    for n in root.iter('node'):
        tags={t.get('k'):t.get('v') for t in n.iter('tag')}
        if tags.get('natural') in ('peak','volcano'):
            out.append({'id':n.get('id'),'lat':n.get('lat'),'lon':n.get('lon'),'tags':tags,'src':path.split('/')[-1]})
print(json.dumps(out,ensure_ascii=False))
