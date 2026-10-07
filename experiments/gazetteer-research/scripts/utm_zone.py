# 緯度経度から UTM ゾーン番号と MGRS 緯度帯の文字を求める（日本の範囲の確認用。例外帯は日本に掛からない）
import sys
BANDS='CDEFGHJKLMNPQRSTUVWX'
for a in sys.argv[1:]:
    name,lat,lon=a.split(',')
    lat,lon=float(lat),float(lon)
    z=int((lon+180)//6)+1; b=BANDS[min(19,int((lat+80)//8))]
    print(f'{name}\tlat={lat:.4f}\tlon={lon:.4f}\tzone={z}\tband={b}\t中央子午線={z*6-183}E')
