# 2点間の距離（m、球面近似）
import sys,math
def d(a,b):
    la1,lo1=map(float,a.split(',')[::-1]); la2,lo2=map(float,b.split(',')[::-1])
    R=6371000; p=math.radians
    x=math.sin(p(la2-la1)/2)**2+math.cos(p(la1))*math.cos(p(la2))*math.sin(p(lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(x))
for pair in sys.argv[1:]:
    n,a,b=pair.split('|'); print(f'{n}\t{d(a,b):.0f} m')
