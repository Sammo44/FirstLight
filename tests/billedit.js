// Bills from statements can be fully edited: name, what it's for, amount, how often, renewal, account, notes and who takes it on.
// Uses made-up statements (no personal data).
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const act=async(a,ds)=>{const b=document.createElement('button');b.dataset.act=a;Object.assign(b.dataset,ds||{});document.body.appendChild(b);click(b);b.remove();await wait(40);};
const head=()=>((q('.bqhead')||{}).innerText||'').replace(/\s+/g,' ');
const csv=(rows)=>'Bank Account,Date,Narrative,Debit Amount,Credit Amount,Balance,Categories,Serial\n'+rows.map(([d,n,a])=>`032000123456,${d},${n},${a},,100,OTHER,`).join('\n');
const monthly=(day,name,amt)=>['05','06','07','08','09','10'].map(m=>[`${day}/${m}/2026`,name,amt]);
const upload=async(name,text,until)=>{const dt=new DataTransfer();dt.items.add(new File([text],name,{type:'text/csv'}));const fin=q('#csv_in');fin.files=dt.files;fin.dispatchEvent(new Event('change',{bubbles:true}));for(let i=0;i<100&&!q(until);i++)await wait(50);};
const S=()=>window.__amfy.plan(),samePerson=window.__amfy.samePerson,familyPeople=()=>S().reg.people.filter(p=>!(p.roles||[]).includes('professional')&&p.name);
const bill=re=>S().reg.costs.find(c=>re.test(c.provider||''));

click(q('[data-act=example]'));await wait(80);
await act('go',{v:'chapter',ch:'admin',stid:'bills'});await act('bmode',{v:'quick'});
await upload('everyday.csv',csv(monthly('05','DEBIT CARD PURCHASE KAYO SPORTS MELBOURNE AUS','25.00').concat(monthly('12','RED ENERGY BPAY','180.00'))),'.bqcard');
check('upload goes to one card at a time',!!q('.bqcard'));
let guard=0;while(q('.bqcard')&&!/KAYO/i.test(head())&&guard++<20){click(q('[data-act=swipeset][data-v=Decide]'));await wait(40);}
check('found the Kayo card',/KAYO/i.test(head()),head().slice(0,80));
const id=(q('.bqcard')||{id:''}).id.replace('bq_','');
const it=S().reg.costs.find(c=>c.id===id);const origName=it&&it.provider;

// Every field can be changed on the card
check('card has an Edit button',!!q(`[data-act=swipeedit][data-id="${id}"]`));
click(q(`[data-act=swipeedit][data-id="${id}"]`));await wait(40);
const fld=k=>q(`#bqe_${id} [data-b="r|costs|${id}|${k}"]`);
check('edit: name, what it is for, amount, renewal, how often, paid from, notes',['provider','desc','amount','renews','freq','notes'].every(fld)&&!!q(`#bqe_${id} [data-bsel="r|costs|${id}|paidFrom"]`),['provider','desc','amount','renews','freq','notes'].filter(k=>!fld(k)).join(','));
setv(fld('provider'),'Footy streaming');
check('rename shows at once',/Footy streaming/.test(head()),head().slice(0,80));
check('statement name is kept',new RegExp('On your statements as .*'+origName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(head()),head());
setv(fld('desc'),'Footy for Dad');setv(fld('amount'),'30');
check('amount and description show at once',/\$30/.test(head())&&/Footy for Dad/.test(head()),head());
click(q(`[data-b="r|costs|${id}|freq"][data-v=Yearly]`));await wait(40);
check('how often: yearly',/\$30 yearly/.test(head()),head());
click(q(`[data-b="r|costs|${id}|freq"][data-v=Other]`));await wait(40);
check('how often: other asks in your words',!!fld('freqOther'));
setv(fld('freqOther'),'Every two years');
check('own words show at once',/\$30 Every two years/.test(head()),head());
setv(fld('renews'),'2027-03-01');setv(fld('notes'),'Cancel after the grand final');
const ps=q(`[data-bsel="r|costs|${id}|paidFrom"]`);if(ps&&ps.options.length>1){ps.selectedIndex=1;ps.dispatchEvent(new Event('change',{bubbles:true}));await wait(40);}
check('editor stays open after changes',!!q(`#bqe_${id}`));
check('all saved on the bill',it.provider==='Footy streaming'&&it.desc==='Footy for Dad'&&it.amount==='30'&&it.freq==='Other'&&it.freqOther==='Every two years'&&it.renews==='2027-03-01'&&/grand final/.test(it.notes)&&!!it.paidFrom,JSON.stringify({p:it.provider,a:it.amount,f:it.freq,fo:it.freqOther,r:it.renews,pf:it.paidFrom}));
click(q(`[data-act=swipeedit][data-id="${id}"].primary`));await wait(40);
check('Done editing closes the editor',!q(`#bqe_${id}`)&&/Footy streaming/.test(head()));

// Who takes it on: anyone in the plan, or someone new
const tos=all('[data-act=swipeset][data-to]').map(b=>b.dataset.to);
check('everyone in the plan can take it on',familyPeople().every(p=>tos.some(n=>samePerson(n,p.name))),tos.join(', '));
check('someone else can be typed',!!q(`#bqto_${id}`)&&!!q('[data-act=swipeto]'));
setv(q(`#bqto_${id}`),'Uncle Bob');click(q('[data-act=swipeto]'));await wait(40);
check('handed to someone new',it.outcome==='Transfer'&&it.transferTo==='Uncle Bob',it.outcome+' '+it.transferTo);
if(q('.bqcard')){const nx=q('.bqcard').id.replace('bq_',''),nb=S().reg.costs.find(c=>c.id===nx),ch=all('.bqwho [data-act=swipeset][data-to]')[0];
  if(ch){click(ch);await wait(40);check('handed to a person from the plan',nb.outcome==='Transfer'&&samePerson(nb.transferTo,ch.dataset.to),nb.transferTo);} }
if(q('.bqcard'))click(q('[data-act=swipestop]'));await wait(40);

// Change it later from the list
const row=all('.bqrow').find(b=>/Footy streaming/.test(b.textContent));
check('list shows the new name, amount and who',!!row&&/\$30 Every two years/.test(row.textContent)&&/to Uncle Bob/.test(row.textContent),row&&row.textContent);
click(row);await wait(40);
check('opens on its own, ready to edit',!!q(`#bqe_${id}`)&&!q('[data-act=swipeskip]')&&!!q('.bq-foot [data-act=swipestop].primary'));
const ub=all('.bqwho [data-act=swipeset][data-to]').find(b=>b.dataset.to==='Uncle Bob');
check('current choice is shown',!!ub&&ub.getAttribute('aria-pressed')==='true');
click(q('[data-act=swipeset][data-v=Keep]'));await wait(40);
check('a new choice goes back to the list',!q('.bqcard')&&it.outcome==='Keep'&&!!q('.bqrow'));
click(all('.bqrow').find(b=>/Footy streaming/.test(b.textContent)));await wait(40);
check('Keep is shown as chosen',(q('.bqacts .on')||{}).textContent==='✓ Keep paying it',(q('.bqacts .on')||{}).textContent);
click(q(`[data-act=swipefine][data-id="${id}"]`));await wait(60);
check('Transactions and more opens the full card',!!q(`#bill_${id}.acard`)&&!q('.bqcard'));
click(q(`#bill_${id} [data-act=bmore]`));await wait(40);
check('full card: name and amount editable',!!q(`#bill_${id} [data-b="r|costs|${id}|provider"]`)&&!!q(`#bill_${id} [data-b="r|costs|${id}|amount"]`));

// Fine-tune upload: change a biller's name, amount and how often before saving
await act('bstep',{v:'upload'});
await upload('card.csv',csv(monthly('20','SHANNONS INSURANCE','96.50').concat(monthly('05','DEBIT CARD PURCHASE KAYO SPORTS MELBOURNE AUS','25.00'))),'[data-act=asave]');
check('fine-tune upload goes to Allocate',!!q('[data-act=asave]'));
const findCard=()=>all('.acard').find(c=>/shannons/i.test((c.querySelector('.acard-h strong')||{}).textContent||''));
if(!findCard()){const fr=all('.frow-c').find(x=>/shannons/i.test(x.textContent));click(fr&&fr.querySelector('[data-act=aedit]'));await wait(40);}
let card=findCard();check('Shannons card shown',!!card);
click(card.querySelector('[data-act=aname]'));await wait(40);card=findCard();
const ap=card.querySelector('input[data-b$="|provider"]'),aa=card.querySelector('input[data-b$="|amount"]');
check('allocate: name and amount editable',!!ap&&!!aa);
setv(ap,'Shannons car insurance');setv(aa,'289.50');
click(card.querySelector('[data-b$="|freq"][data-v=Quarterly]'));await wait(40);card=findCard();
check('allocate: amount and how often update',/\$289\.50 quarterly/.test(card.querySelector('.amt').textContent),card.querySelector('.amt').textContent);
click(card.querySelector('[data-act=aname]'));await wait(40);card=findCard();
check('allocate: new name, statement name kept',/Shannons car insurance/.test(card.querySelector('.acard-h strong').textContent)&&/On your statements as/i.test(card.textContent));
click(q('[data-act=asave]'));await wait(60);
const sh=bill(/^Shannons car insurance$/);
check('saved with the new name and amount',!!sh&&parseFloat(sh.amount)===289.5,sh&&JSON.stringify({a:sh.amount,f:sh.freq}));
check('saved quarterly, statement name kept',!!sh&&sh.freq==='Quarterly'&&(sh.billers||[]).some(n=>/^shannons/i.test(n)&&n!==sh.provider),sh&&(sh.billers||[]).join('|'));
check('a renamed bill still matches its statement name',S().reg.costs.filter(c=>/footy/i.test(c.provider||'')).length===1&&!S().reg.costs.some(c=>/kayo/i.test(c.provider||'')),S().reg.costs.map(c=>c.provider).join(', '));
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
const de=document.body.getAttribute('data-err');if(de)r.push('ERR page error: '+de);
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},400);
