// The UX round: faster start, no dead ends without Claude, backup and restore, shorter forms, one people picker,
// readiness numbers that agree, "Add it" links in empty summaries, bigger tap targets, the welcome page and wide layouts.
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const act=async(a,ds)=>{const b=document.createElement('button');b.dataset.act=a;Object.assign(b.dataset,ds||{});document.body.appendChild(b);click(b);b.remove();await wait(40);};
const main=()=>(q('main')||document.body).innerText;

// Welcome
check('welcome: one main button',all('.ctas .btn.primary').length===1&&all('.ctas .btn').length===2,all('.ctas .btn').map(b=>b.textContent).join(' / '));
check('welcome: example is a text link',!!q('.linkbtn[data-act=example]'));
check('welcome: parent route above the promises',!!q('.herocopy .parentcta [data-act=startparent]'));
check('welcome: keyhole hero art and app preview',!!q('.heromark')&&!!q('.mock .mock-card'));

// The check, out of 10
click(q('[data-act=check]'));await wait(40);
for(const k of ['accounts','docs','meds','digital','house','wishes'])click(q(`[data-b="ck|${k}"][data-v=yes]`)),await wait(15);
click(q('[data-b="ck|bills"][data-v=no]'));await wait(15);click(q('[data-b="ck|epoa"][data-v=yes]'));await wait(15);
click(q('[data-act=checkdone]'));await wait(40);
check('check result is out of 10',/out of 10 ready/.test(main()),(q('.score')||{}).textContent);

// Faster start: three setup questions, two Life Scan pages
click(q('[data-act=checkbuild]'));await wait(40);
check('setup has no tone or faith questions',!q('[data-b="set|tone"]')&&!q('[data-b="set|faith"]')&&!!q('[data-b="set|country"]'));
setv(q('[data-b="set|name"]'),'Lee');
click(q('[data-act=scannext]'));await wait(40);
check('Life Scan page 1 of 2',/Life Scan · 1 of 2/i.test(main()),(q('main .eyebrow')||{}).textContent);
click(q('[data-b="s|partner"][data-v=married]'));await wait(15);
click(q('[data-act=scannext]'));await wait(40);
check('Life Scan page 2 of 2',/Life Scan · 2 of 2/i.test(main()));
click(q('[data-act=scannext]'));await wait(40);
check('ready page: 10 essentials, bills first after your people',/10 essentials/.test(main())&&/missing: bills that keep coming\./.test(main()),(q('main .note')||{}).textContent);

// Essentials order follows the check's gaps; offline wording and the bills tick-list
click(q('[data-act=scanfinish][data-ess]'));await wait(60);
check('essentials start with your people, offline wording',/Add each one/.test((q('.ask')||{}).textContent||''),(q('.ask')||{}).textContent);
check('essentials counter uses the 10-point measure',/of 10 ready/.test(main()));
const nx=q('[data-act=talknext]');
check('next essential is bills (the check said no)',nx&&nx.dataset.v==='bills',nx&&nx.dataset.v);
click(nx);await wait(60);
check('bills offline: a tick-list, not a dead end',all('[data-act=qbill]').length>=12&&!/Go to bills/.test(main()));
click(all('[data-act=qbill]').find(b=>b.textContent.trim()==='Electricity'));await wait(40);
check('ticking Electricity adds it',all('.chip.on[data-act=qbill]').some(b=>/Electricity/.test(b.textContent)));
setv(q('#qb_new'),'Shannons');click(q('[data-act=qbillnew]'));await wait(40);
check('typed bill added',/2 bills in your plan/.test(main()),(main().match(/\d+ bills? in your plan/)||[''])[0]);

// Tell me anything, offline: a best guess for where it goes
await act('talk',{v:'anything'});
check('anything: offline wording',/I’ll suggest where it goes/.test((q('.ask')||{}).textContent||''));
setv(q('#cap_text'),'The spare key is under the frog by the back door');click(q('[data-act=capsend]'));await wait(60);
const sel=q('[data-capf="0|key"]');
check('anything: spare key goes to Getting in',sel&&sel.value==='home.access.spare',sel&&sel.value);
check('anything: no repeated heading',!/Where should this go\?/.test(main()));
click(q('[data-act=capsave]'));await wait(40);

// Shorter person card
await act('go',{v:'chapter',ch:'family',stid:'everyone'});
click(all('[data-act=add][data-reg=people]').pop());await wait(40);
const roleChips=all('.entry.open [data-act=toggle]');
check('person card: five common roles first',roleChips.length===5,roleChips.map(b=>b.textContent).join(', '));
check('person card: more roles behind a button',/More roles \(\d+\)/.test((q('.entry.open [data-act=moreopts]')||{}).textContent||''));
check('person card: email and notes tucked away',/Email and Notes/.test((q('.entry.open [data-act=entrymore]')||{}).textContent||''));
setv(q('.entry.open input[data-b$="|name"]'),'Jo Lee');setv(q('.entry.open input[data-b$="|rel"]'),'Wife');
click(q('.entry.open [data-act=moreopts]'));await wait(30);
check('more roles shows them all',all('.entry.open [data-act=toggle]').length>10);
click(q('.entry.open [data-act=entrymore]'));await wait(30);
check('email shows when asked',!!q('.entry.open input[data-b$="|email"]'));

// One people picker for roles
await act('go',{v:'chapter',ch:'home',stid:'access'});
const ra=all('[data-act=roleadd]').find(b=>/Jo Lee/.test(b.textContent));
check('roles use tap-to-add chips',!!ra&&!q('select[data-roleselect]'));
click(ra);await wait(40);
check('Jo now has a key',all('.pf .prow .pname').some(x=>/Jo Lee/.test(x.textContent)));
check('phone topic selector exists',!!q('#topicsel'));

// Readiness agrees between Today and My plan
await act('go',{v:'today'});
const tN=+(((q('.lampcount')||{}).textContent||'').match(/(\d+) of 10/)||[])[1];
check('Today shows the check comparison',/2-minute check/.test((q('.progressnote')||{}).textContent||''),(q('.progressnote')||{}).textContent);
await act('go',{v:'overview'});
const oN=+((main().match(/My plan · (\d+) of 10 ready/i)||[])[1]);
check('Today and My plan agree',tN>=1&&tN===oN,tN+' vs '+oN);

// Tailor your plan
click(q('[data-act=tailor]'));await wait(40);
check('tailor: page 1 of 3',/Tailor your plan · 1 of 3/i.test(main()));
click(q('[data-act=scannext]'));await wait(30);click(q('[data-act=scannext]'));await wait(30);click(q('[data-act=scannext]'));await wait(40);
check('tailor: back to My plan',/My plan ·/i.test(main()));

// Empty summaries link to where to add
await act('go',{v:'outputs'});
const links=all('#doc .addlink');
check('hospital summary has Add it links',links.length>=4,links.length+' links');
click(links[0]);await wait(40);
check('Add it goes to the right topic',!!q('#stepcard')&&/Health and medications/.test(q('#stepcard').textContent),(q('#stepcard h2')||{}).textContent);


// Release wording follows the number of trusted contacts
await act('go',{v:'release'});
click(all('[data-act=roleadd]').find(b=>/Jo Lee/.test(b.textContent)));await wait(40);
check('release: one trusted contact confirms',/Opens when 1 trusted contact confirms/.test(main()),(main().match(/Opens when[^.]*/)||[''])[0]);

// Backup and restore
await act('go',{v:'settings'});
check('settings: backup and restore',!!q('#datacard [data-act=backup]')&&!!q('label[for=restore_in]'));
check('settings: Aa wording mentions the phone Menu',/Menu on a phone/.test(main()));
const ch1=q('main .chip');check('chips at least 44px tall',ch1&&ch1.getBoundingClientRect().height>=44,ch1&&Math.round(ch1.getBoundingClientRect().height));
const dt=new DataTransfer();dt.items.add(new File([JSON.stringify({app:'FirstLight',kind:'backup',version:1,savedAt:'2026-10-01T00:00:00Z',plan:{started:true,scanDone:true,settings:{name:'Robin',subject:'me',country:'AU',region:'NSW'},reg:{people:[{id:'x1',name:'Sam Robin',roles:[]}]}},tx:[]})],'b.json',{type:'application/json'}));
const fin=q('#restore_in');fin.files=dt.files;fin.dispatchEvent(new Event('change',{bubbles:true}));await wait(200);
check('restore asks first',!!q('[data-act=restoreyes]'),(q('#datacard .note')||{}).textContent);
click(q('[data-act=restoreyes]'));await wait(80);
check('restore replaces the plan',/Robin/.test(((q('.today .eyebrow')||{}).textContent)||''),((q('.today .eyebrow')||{}).textContent));
check('menu has backup items',(click(q('.topbtn.menu')),await wait(30),!!q('.pop [data-act=backup]')&&!!q('.pop label[for=restore_in2]')));

// Wide layouts are in place
await act('go',{v:'today'});check('Today has the two-column grid',!!q('.today-grid .tg-ready')&&!!q('.today-grid .tg-next'));
await act('go',{v:'chapter',ch:'home',stid:'access'});check('sections have a side column',!!q('.chapterwrap .chapside'));
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},400);
