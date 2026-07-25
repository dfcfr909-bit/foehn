// 赤の選択線の画面x位置が、バッジ時刻(state.sliderIndex)のチャート上の位置と一致するか検証
const { chromium } = require('playwright-core');
const fs = require('fs');
const HTML = fs.readFileSync(require('path').join(__dirname,'..','sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');
function pad(n){return String(n).padStart(2,'0');}
function fakeWeather(){
  const h={time:[],temperature_2m:[],apparent_temperature:[],precipitation:[],snowfall:[],surface_pressure:[],windspeed_10m:[],winddirection_10m:[],weathercode:[],cloudcover:[]};
  const start=new Date();start.setHours(0,0,0,0);start.setDate(start.getDate()-1);
  for(let i=0;i<120;i++){const d=new Date(start.getTime()+i*3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(10+8*Math.sin(i/10));h.apparent_temperature.push(8);
    h.precipitation.push(0);h.snowfall.push(0);h.surface_pressure.push(1013);
    h.windspeed_10m.push(4);h.winddirection_10m.push(180);h.weathercode.push(2);h.cloudcover.push(40);}
  const daily={time:[],sunrise:[],sunset:[]};
  for(let dd=0;dd<5;dd++){const b=new Date(start.getTime()+dd*24*3600e3);
    const s=`${b.getFullYear()}-${pad(b.getMonth()+1)}-${pad(b.getDate())}`;
    daily.time.push(s);daily.sunrise.push(s+'T04:40');daily.sunset.push(s+'T19:00');}
  return {hourly:h,daily};
}
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',headless:true});
  const page=await browser.newPage({viewport:{width:390,height:800}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{const url=route.request().url();
    if(url==='https://sotoki.test/')return route.fulfill({contentType:'text/html',body:HTML});
    if(url.includes('uPlot.iife.min.js'))return route.fulfill({contentType:'application/javascript',body:UPLOT_JS});
    if(url.includes('uPlot.min.css'))return route.fulfill({contentType:'text/css',body:UPLOT_CSS});
    if(url.includes('api.open-meteo.com'))return route.fulfill({contentType:'application/json',body:JSON.stringify(fakeWeather())});
    return route.abort();});
  await page.addInitScript(()=>localStorage.setItem('sotoki_last',JSON.stringify({lat:36.57,lon:137.65,name:'立山・黒部'})));
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1000);

  // 選択線の実スクリーンx（charts-outer基準）と、選択indexのチャート上スクリーンxを比較
  const measure = () => page.evaluate(() => {
    const outer=document.getElementById('charts-outer').getBoundingClientRect();
    const line=document.getElementById('scrub-line').getBoundingClientRect();
    const lineX = line.left - outer.left;                 // 赤線の画面x
    const idx = state.sliderIndex;
    const idxScreenX = indexScreenX(idx);
    const uplotX = 0;
    return { lineX, idxScreenX, uplotX, idx, badge: document.getElementById('pop-time').textContent, nowRound: Math.round(nowIndexFrac()) };
  });

  const initM = await measure();
  // 少しスクロール
  const bx = await page.evaluate(()=>{const r=document.getElementById('charts-outer').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};});
  await page.mouse.click(bx.x+bx.w*0.7, bx.y+bx.h*0.3);
  await page.waitForTimeout(300);
  const scrM = await measure();

  await browser.close();
  const near=(a,b,t=2)=>Math.abs(a-b)<=t;
  const pxHalfHour = initM.__pph ? initM.__pph/2+1 : 8;
  console.log(JSON.stringify({initM,scrM,errors},null,2));
  const ok = errors.length===0 &&
    near(initM.lineX, initM.idxScreenX, 1) && Math.abs(initM.idx - initM.nowRound) <= 1 &&
    near(scrM.lineX, scrM.idxScreenX, 1) && scrM.idx !== initM.idx;
  console.log(ok?'ALIGN SMOKE PASSED':'ALIGN SMOKE FAILED');
  process.exit(ok?0:1);
})();
