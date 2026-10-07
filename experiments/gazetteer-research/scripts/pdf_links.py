# PDF の各ページのリンク注釈（URI）を、ページ番号と矩形の上端y座標つきで出す
import sys, json
from pypdf import PdfReader
r=PdfReader(sys.argv[1]); out=[]
for i,p in enumerate(r.pages):
    for a in p.get('/Annots') or []:
        a=a.get_object(); A=a.get('/A')
        if A and A.get('/URI'): out.append({'page':i+1,'y':float(a['/Rect'][3]),'uri':str(A['/URI'])})
print(json.dumps(out,ensure_ascii=False))
