# HTMLを素朴にテキスト化（見出しとアンカーを残す）
import sys,re,html
t=open(sys.argv[1],encoding='utf-8',errors='replace').read()
t=re.sub(r'(?s)<(script|style|noscript)[^>]*>.*?</\1>','',t)
t=re.sub(r'(?is)<(h[1-6])[^>]*id="([^"]+)"[^>]*>','\n\n### [#\\2] ',t)
t=re.sub(r'(?is)<[^>]*id="(ch-[^"]+)"[^>]*>','\n\n### [#\\1] ',t)
t=re.sub(r'(?is)<br\s*/?>|</p>|</li>|</h[1-6]>|</tr>|</div>','\n',t)
t=re.sub(r'(?is)<img[^>]*alt="([^"]*)"[^>]*>','[img:\\1]',t)
t=re.sub(r'(?s)<[^>]+>','',t)
t=html.unescape(t)
t=re.sub(r'[ \t　]+',' ',t)
t=re.sub(r'\n\s*\n+','\n',t)
print(t)
