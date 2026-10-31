// SIT crawler: visit every screen, click every safe button, fill every field, change every dropdown, log errors.
(function(){
const errs=[]; let where='boot';
window.addEventListener('error',e=>errs.push(where+' :: '+(e.message||'')+' @'+(e.lineno||'')));
window.addEventListener('unhandledrejection',e=>errs.push(where+' :: (promise) '+((e.reason&&e.reason.message)||e.reason)));
const ce=console.error; console.error=function(){errs.push(where+' :: console.error '+Array.from(arguments).join(' ').slice(0,160)); ce.apply(console,arguments);};
const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true}));
const tick=(ms)=>new Promise(r=>setTimeout(r,ms||0));
const mk=a=>{const b=document.createElement('button');b.className='__sit';Object.entries(a).forEach(([k,v])=>b.dataset[k]=v);document.body.appendChild(b);click(b);b.remove();};
const EXCL=new Set(['start','startparent','example','resetyes','savefile','copydoc','vunlock','vsetup','vreset','vresetyes','aread']);
const MODE=(document.currentScript&&document.currentScript.dataset.mode)||window.__SITMODE||'example';
let clicks=0, fields=0, views=0, part=''; const blank=[];
async function crawl(name, nav){
  where=name; views++;
  try{ await nav(); }catch(e){ errs.push(name+' :: nav '+e.message); return; }
  await tick();
  const n=Math.min(all('#app [data-act]').length,70);
  for(let i=0;i<n;i++){
    try{ await nav(); }catch(e){ errs.push(name+' :: renav '+e.message); return; }
    await tick();
    const b=all('#app [data-act]')[i]; if(!b||b.disabled||EXCL.has(b.dataset.act)) continue;
    where=name+' > '+b.dataset.act+(b.dataset.v?'('+b.dataset.v+')':'');document.body.setAttribute('data-progress',where+' #'+clicks);
    try{ click(b); clicks++; }catch(e){ errs.push(where+' :: threw '+e.message); }
    await tick(5);
    if(!q('#app')||q('#app').innerHTML.length<200) blank.push(where);
  }
  // fields: type into every text box, change every dropdown
  try{ await nav(); await tick(); }catch(e){}
  where=name+' > fields';
  all('#app input[type=text], #app textarea, #app input:not([type])').forEach(el=>{ if(el.id==='vpu'||/pass/i.test(el.id)) return; try{ el.value=el.value||'Test entry 0400 000 000'; el.dispatchEvent(new Event('input',{bubbles:true})); fields++; }catch(e){ errs.push(where+' :: input '+e.message);} });
  await tick();
  all('#app select').forEach(el=>{ try{ if(el.options.length>1){ el.selectedIndex=Math.min(1,el.options.length-1); el.dispatchEvent(new Event('change',{bubbles:true})); el.dispatchEvent(new Event('input',{bubbles:true})); fields++; } }catch(e){ errs.push(where+' :: select '+e.message);} });
  await tick(5);
}
setTimeout(async()=>{
 try{
  // set up the state for this run
  if(MODE==='example'){ click(q('[data-act=example]')); }
  else { click(q(MODE==='parent'?'[data-act=startparent]':'[data-act=start]')); await tick(10);
    for(let i=0;i<14&&!q('[data-act=scanfinish]');i++){ all('.scanq .field').forEach(f=>click(f.querySelector('.chip'))); click(all('[data-act=scannext]').pop()); await tick(5); }
    click(all('[data-act=scanfinish]').find(b=>!b.dataset.ess)); }
  await tick(30);
  const chapters=(mk({act:'go',v:'overview'}), all('.chap[data-ch]').map(b=>b.dataset.ch));
  const V=[];
  V.push(['today',()=>mk({act:'go',v:'today'})]);
  V.push(['overview',()=>mk({act:'go',v:'overview'})]);
  V.push(['strengthen',()=>mk({act:'go',v:'strengthen'})]);
  V.push(['family',()=>mk({act:'go',v:'family'})]);
  V.push(['famview unwell',async()=>{mk({act:'go',v:'famview'}); await tick(); mk({act:'fvsit',v:'unwell'});}]);
  V.push(['famview die',async()=>{mk({act:'go',v:'famview'}); await tick(); mk({act:'fvsit',v:'die'});}]);
  ['hospital','first','executor','manual','wallet'].forEach(t=>V.push(['outputs '+t,()=>mk({act:'go',v:'outputs',otab:t})]));
  V.push(['release',()=>mk({act:'go',v:'release'})]);
  V.push(['review',()=>mk({act:'go',v:'review'})]);
  V.push(['settings',()=>mk({act:'go',v:'settings'})]);
  ['letters','why','questions','forward'].forEach(t=>V.push(['words '+t,()=>mk({act:'go',v:'words',wtab:t})]));
  ['people','call','meds','house','act','bills','accounts','will','findout','body','anything','story:questions:6'].forEach(t=>V.push(['talk '+t,()=>mk({act:'talk',v:t})]));
  for(let i=0;i<11;i++) V.push(['walk stop '+i,async()=>{mk({act:'walkstart'}); await tick(); mk({act:'walkgo',v:String(i)});}]);
  V.push(['walk guide',()=>mk({act:'walkguide'})]);
  V.push(['sunday',()=>mk({act:'go',v:'sunday'})]);
  V.push(['check',()=>mk({act:'check'})]);
  for(const ch of chapters){
    mk({act:'go',v:'chapter',ch}); await tick();
    const n=all('.topic').length||1;
    for(let s=0;s<n;s++) V.push(['chapter '+ch+' #'+s,()=>mk({act:'go',v:'chapter',ch,st:String(s)})]);
  }
  ['cats','upload','allocate','list'].forEach(st=>V.push(['bills fine '+st,async()=>{mk({act:'go',v:'chapter',ch:'admin',stid:'bills'}); await tick(); mk({act:'bmode',v:'fine'}); await tick(); mk({act:'bstep',v:st});}]));
  V.push(['bills quick',async()=>{mk({act:'go',v:'chapter',ch:'admin',stid:'bills'}); await tick(); mk({act:'bmode',v:'quick'});}]);
  V.push(['bills swipe',async()=>{mk({act:'go',v:'chapter',ch:'admin',stid:'bills'}); await tick(); mk({act:'bmode',v:'quick'}); await tick(); mk({act:'swipestart'});}]);
  V.push(['welcome',()=>mk({act:'go',v:'welcome'})]);
  // Long runs are split into parts (__SITFROM / __SITTO), because the test browser stops after a few thousand clicks.
  const FROM=window.__SITFROM||0, TO=Math.min(window.__SITTO||V.length, V.length); for(const [n,f] of V.slice(FROM,TO)) await crawl(n,f);
  // The last part also does the Life Scan pages and "Tailor your plan" (rescan and tailor change nothing destructive).
  if(TO>=V.length){
    for(let p=0;p<4;p++) await crawl('scan page '+p,async()=>{mk({act:'rescan'}); await tick(); for(let k=0;k<p;k++){ click(all('[data-act=scannext]').pop()); await tick(); }});
    for(let p=1;p<=3;p++) await crawl('tailor page '+p,async()=>{mk({act:'tailor'}); await tick(); for(let k=1;k<p;k++){ click(all('[data-act=scannext]').pop()); await tick(); }});
  }
  part=(FROM>0||TO<V.length)?FROM+'-'+TO+' of '+V.length:'';
 }catch(e){ errs.push('crawler :: '+e.message+' '+(e.stack||'').split('\n')[1]); }
 const uniq=[...new Set(errs)];
 document.body.setAttribute('data-sit',JSON.stringify({mode:MODE,part,views,clicks,fields,errors:uniq.length,errs:uniq.slice(0,60),blank:blank.slice(0,20)}));
},400);
})();
