// AI概況カード: outlook.jsonがあれば表示、空なら非表示 を検証
const { chromium } = require('playwright-core');
const fs = require('fs');
const HTML = fs.readFileSync(require('path').join(__dirname,'..','sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');
function pad(n){return String(n).padStart(2,'0');}
function fakeWeather(){
  const h={time:[],temperature_2m:[],apparent_temperature:[],precipitation:[],snowfall:[],surface_pressure:[],windspeed_10m:[],winddirection_10m:[],weathercode:[],cloudcover:[]};
  const s=new Date();s.setHours(0,0,0,0);s.setDate(s.getDate()-1);
  for(let i=0;i<120;i++){const d=new Date(s.getTime()+i*3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(10);h.apparent_temperature.push(8);h.precipitation.push(0);h.snowfall.push(0);
    h.surface_pressure.push(1013);h.windspeed_10m.push(4);h.winddirection_10m.push(180);h.weathercode.push(2);h.cloudcover.push(40);}
  return {hourly:h,daily:{time:[],sunrise:[],sunset:[]}};
}
const OUTLOOK_FULL = JSON.stringify({
  generatedAt: new Date().toISOString(), model:'claude-haiku-4-5', pattern:'移動性高気圧',
  sections:[
    {key:'weekend',label:'今週末 7/25(土)〜7/26(日)',text:'週末は高気圧に覆われ晴れる見込み。'},
    {key:'tomorrow',label:'明日 7/24(金)',text:'明日は晴れ間が広がる見込み。'},
  ],
  disclaimer:'AIによる全国概況（参考）。正式な予報は気象庁を確認してください。'
});
const OUTLOOK_EMPTY = JSON.stringify({ generatedAt:null, pattern:'', sections:[], status:'pending', disclaimer:'x' });

async function run(outlookBody){
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless:true });
  const page = await browser.newPage({ viewport:{width:390,height:820} });
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*', route=>{
    const url=route.request().url();
    if(url==='https://sotoki.test/') return route.fulfill({contentType:'text/html',body:HTML});
    if(url.includes('uPlot.iife.min.js')) return route.fulfill({contentType:'application/javascript',body:UPLOT_JS});
    if(url.includes('uPlot.min.css')) return route.fulfill({contentType:'text/css',body:UPLOT_CSS});
    if(url.includes('outlook.json')) return route.fulfill({contentType:'application/json',body:outlookBody});
    if(url.includes('api.open-meteo.com')) return route.fulfill({contentType:'application/json',body:JSON.stringify(fakeWeather())});
    return route.abort();
  });
  await page.addInitScript(()=>localStorage.setItem('sotoki_last',JSON.stringify({lat:36.57,lon:137.65,name:'立山・黒部'})));
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(900);
  const r = await page.evaluate(()=>{
    const el=document.getElementById('ai-outlook');
    return {
      display: el.style.display,
      pattern: document.getElementById('ai-outlook-pattern').textContent,
      secs: document.querySelectorAll('#ai-outlook-body .ai-sec').length,
      collapsedInitially: el.classList.contains('collapsed'),
      bodyHtml: document.getElementById('ai-outlook-body').innerHTML.length,
    };
  });
  // 展開トグル（可視性ゲート回避のためevaluateで呼ぶ）
  await page.evaluate(()=>toggleOutlook());
  const afterToggle = await page.evaluate(()=>document.getElementById('ai-outlook').classList.contains('collapsed'));
  await page.screenshot({path:__dirname+'/smoke_outlook.png'});
  await browser.close();
  return { r, afterToggle, errors };
}

(async()=>{
  const full = await run(OUTLOOK_FULL);
  const empty = await run(OUTLOOK_EMPTY);
  console.log(JSON.stringify({full, empty}, null, 2));
  const ok = full.errors.length===0 && empty.errors.length===0 &&
    full.r.display==='block' && full.r.secs===2 && full.r.pattern==='移動性高気圧' &&
    full.r.collapsedInitially===true && full.afterToggle===false &&
    empty.r.display==='none' && empty.r.secs===0;
  console.log(ok ? 'OUTLOOK SMOKE PASSED' : 'OUTLOOK SMOKE FAILED');
  process.exit(ok?0:1);
})();
