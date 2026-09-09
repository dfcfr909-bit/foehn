import fs from 'node:fs'; import path from 'node:path';
import { chromium } from 'playwright-core';
const ROOT='/home/user/foehn';
const HTML=fs.readFileSync(path.join(ROOT,'sotoki_v4.html'),'utf8');
const U=fs.readFileSync(path.join(ROOT,'tests/node_modules/uplot/dist/uPlot.iife.min.js'),'utf8');
const C=fs.readFileSync(path.join(ROOT,'tests/node_modules/uplot/dist/uPlot.min.css'),'utf8');
const pad=n=>String(n).padStart(2,'0');
function fake(){
  const h={time:[],temperature_2m:[],apparent_temperature:[],precipitation:[],snowfall:[],
    surface_pressure:[],windspeed_10m:[],winddirection_10m:[],windgusts_10m:[],weathercode:[],cloudcover:[]};
  const s=new Date(); s.setHours(0,0,0,0); s.setDate(s.getDate()-3);
  for(let i=0;i<288;i++){const d=new Date(s.getTime()+i*3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(24);h.apparent_temperature.push(28);h.precipitation.push(0);h.snowfall.push(0);
    h.surface_pressure.push(1013-i*0.02);h.windspeed_10m.push(0);h.winddirection_10m.push(270);
    h.windgusts_10m.push(2);h.weathercode.push(2);h.cloudcover.push(40);}
  const daily={time:[],sunrise:[],sunset:[]};
  for(let dd=0;dd<13;dd++){const b=new Date(s.getTime()+dd*24*3600e3);
    const ds=`${b.getFullYear()}-${pad(b.getMonth()+1)}-${pad(b.getDate())}`;
    daily.time.push(ds);daily.sunrise.push(`${ds}T05:17`);daily.sunset.push(`${ds}T17:59`);}
  return {hourly:h,daily,elevation:194};
}
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||'/opt/pw-browsers/chromium',headless:true});
const p=await b.newPage({viewport:{width:390,height:780},deviceScaleFactor:2});
await p.route('**/*',r=>{const u=r.request().url();
  if(u==='https://sotoki.test/')return r.fulfill({contentType:'text/html',body:HTML});
  if(u.includes('uPlot.iife.min.js'))return r.fulfill({contentType:'application/javascript',body:U});
  if(u.includes('uPlot.min.css'))return r.fulfill({contentType:'text/css',body:C});
  if(u.includes('api.open-meteo.com'))return r.fulfill({contentType:'application/json',body:JSON.stringify(fake())});
  return r.abort();});
await p.addInitScript(()=>localStorage.setItem('sotoki_last',JSON.stringify({lat:35.9,lon:139.6,name:'自宅'})));
await p.goto('https://sotoki.test/'); await p.waitForTimeout(1500);
const m=await p.evaluate(()=>{
  setSelectedIndex(Math.max(0,state.sliderIndex));
  const el=document.getElementById('scrub-popup');
  const r=el.getBoundingClientRect();
  return {w:Math.round(r.width),h:Math.round(r.height),text:el.innerText.replace(/\n/g,' / ')};
});
console.log(`窓の大きさ: ${m.w} x ${m.h} px`);
console.log(`中身: ${m.text}`);
await p.locator('#scrub-popup').screenshot({path:'/home/user/foehn/tests/_popup.png'});
await p.screenshot({path:'/home/user/foehn/tests/_full.png'});
await b.close();
