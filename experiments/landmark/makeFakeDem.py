# 偽の地形（円錐＋鋭い尾根＋丸い尾根＋±1mの凹凸）を GeoTIFF に書く。使い方: python makeFakeDem.py <升目m> <出力.tif>
import sys, numpy as np, rasterio
from rasterio.transform import from_origin
cell=float(sys.argv[1]); n=int(round(6000/cell))
X,Y=np.meshgrid((np.arange(n)+.5)*cell,(np.arange(n)[::-1]+.5)*cell)
cone=1500-0.35*np.hypot(X-1500,Y-3000); sharp=1250-0.6*abs(X-3800)-0.02*Y; rnd=1150-((X-5200)**2)/1600-0.02*Y
z=np.maximum.reduce([np.full_like(X,300),cone,sharp,rnd])+np.sin(X*.37+Y*.91)*np.cos(X*.53-Y*.29)
crs='+proj=tmerc +lat_0=36 +lon_0=139 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +units=m'
with rasterio.open(sys.argv[2],'w',driver='GTiff',width=n,height=n,count=1,dtype='float32',crs=crs,transform=from_origin(0,n*cell,cell,cell),nodata=-9999) as d: d.write(z.astype('float32'),1)
print(n)
