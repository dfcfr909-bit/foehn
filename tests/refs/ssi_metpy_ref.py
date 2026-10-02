import sys, json
sys.path.insert(0, './pylib')
import numpy as np
import metpy.calc as mpcalc
from metpy.units import units
import metpy
cases = [(15,10,-5),(20,18,-8),(10,0,-12),(12,12,-10),(5,-10,-20),(10,-50,-18),(18,15,-10),(0,-2,-25),(25,22,-3),(8,6,-15),(22,2,-6),(3,3,-30)]
out=[]
for t850, td850, t500 in cases:
    p = np.array([850., 500.]) * units.hPa
    T = np.array([t850, t500]) * units.degC
    Td = np.array([min(td850,t850), t500-5]) * units.degC
    ssi = mpcalc.showalter_index(p, T, Td)
    v = np.atleast_1d(ssi.to('delta_degC').m)[0]; out.append([t850, td850, t500, round(float(v),3)])
print(metpy.__version__)
print(json.dumps(out))
