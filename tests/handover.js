// Handing bills on: the big "Hand it to …" button follows the person picked last, and a bill already handed on shows
// its own person there. "My estate" is never offered as a person. Uses made-up statements (no personal data).
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const act=async(a,ds)=>{const b=document.createElement('button');b.dataset.act=a;Object.assign(b.dataset,ds||{});document.body.appendChild(b);click(b);b.remove();await wait(40);};
const head=()=>((q('.bqhead')||{}).innerText||'').replace(/\s+/g,' ');
const csv=(rows)=>'Bank Account,Date,Narrative,Debit Amount,Credit Amount,Balance,Categories,Serial\n'+rows.map(([d,n,a])=>`032000123456,${d},${n},${a},,100,OTHER,`).join('\n');
const monthly=(day,name,amt)=>['05','06','07','08','09','10'].map(m=>[`${day}/${m}/2026`,name,amt]);
const S=()=>window.__amfy.plan(),samePerson=window.__amfy.samePerson;
const mainBtn=()=>q('.bqacts [data-v=Transfer]');
const mainTxt=()=>((mainBtn()||{}).textContent||'').trim();
const chipTo=()=>all('.bqwho [data-act=swipeset][data-to]').map(b=>b.dataset.to);
const cardBill=()=>S().reg.costs.find(c=>c.id===(q('.bqcard')||{id:''}).id.replace('bq_',''));

click(q('[data-act=example]'));await wait(80);
// "My estate" named as a beneficiary must not turn up as a person who can take bills on.
S().reg.policies[0].beneficiary=[{name:'My estate',pct:'100'}];
await act('go',{v:'chapter',ch:'admin',stid:'bills'});await act('bmode',{v:'quick'});
const dt=new DataTransfer();dt.items.add(new File([csv(monthly('03','ACME WATER BPAY','90.00').concat(monthly('09','BOLT GYM DIRECT DEBIT','60.00'),monthly('15','CLOUDY STORAGE SYDNEY','30.00')))],'made-up.csv',{type:'text/csv'}));
const fin=q('#csv_in');fin.files=dt.files;fin.dispatchEvent(new Event('change',{bubbles:true}));for(let i=0;i<100&&!q('.bqcard');i++)await wait(50);
check('three made-up bills to decide',!!q('.bqcard')&&/1 of 3/.test((q('.bq-top')||{}).textContent||''),(q('.bq-top')||{}).textContent);
check('first card: big button is the main person',/^Hand it to Jo$/.test(mainTxt())&&samePerson(mainBtn().dataset.to,'Jo Morgan'),mainTxt());
check('My estate is not offered as a person',!chipTo().some(n=>/estate/i.test(n))&&!all('.bqwho .chip').some(b=>/^My$/.test(b.textContent.trim())),all('.bqwho .chip').map(b=>b.textContent).join(', '));

// Pick Mia from the small buttons: the next card defaults to Mia.
const b1=cardBill();
click(all('.bqwho [data-act=swipeset][data-to]').find(b=>/Mia/.test(b.dataset.to)));await wait(40);
check('first bill goes to Mia',b1.outcome==='Transfer'&&samePerson(b1.transferTo,'Mia Morgan'),b1.transferTo);
check('picking someone makes them the default',samePerson(S().billTo,'Mia Morgan'),S().billTo);
check('next card: big button is now Mia',/^Hand it to Mia$/.test(mainTxt()),mainTxt());
check('Jo moves to the small buttons',chipTo().some(n=>samePerson(n,'Jo Morgan'))&&!chipTo().some(n=>samePerson(n,'Mia Morgan')),chipTo().join(', '));
check('the toast says so',/Bills now go to Mia by default/.test((q('.toast')||document.body).textContent||''),((q('.toast')||{}).textContent||'').slice(0,90));

// The big button hands it to Mia; the default stays Mia.
const b2=cardBill();click(mainBtn());await wait(40);
check('second bill goes to Mia with one tap',b2.outcome==='Transfer'&&samePerson(b2.transferTo,'Mia Morgan'),b2.transferTo);
check('third card still defaults to Mia',/^Hand it to Mia$/.test(mainTxt()),mainTxt());

// Someone new, typed: they become the default.
const b3=cardBill();setv(q(`#bqto_${b3.id}`),'Uncle Bob');click(q('[data-act=swipeto]'));await wait(40);
check('typed name becomes the default',b3.transferTo==='Uncle Bob'&&S().billTo==='Uncle Bob',S().billTo);
check('the toast uses the whole typed name',/Bills now go to Uncle Bob by default/.test((q('.toast')||{}).textContent||''),(q('.toast')||{}).textContent);

// Reopen the first bill: its own person is on the big button, ticked, even though the default is now Uncle Bob.
click(all('.bqrow').find(b=>b.textContent.includes(b1.provider)));await wait(40);
check('a bill already handed on shows its person on the big button',/^✓ Hand it to Mia$/.test(mainTxt())&&mainBtn().getAttribute('aria-pressed')==='true',mainTxt());
check('the default is one tap away',chipTo().includes('Uncle Bob'),chipTo().join(', '));
click(q('[data-act=swipestop]'));await wait(40);

// A bill with no decision yet uses the default.
const un=S().reg.costs.find(c=>/RACQ/.test(c.provider));un.outcome='';un.transferTo='';
click(all('.bqrow').find(b=>/RACQ/.test(b.textContent)));await wait(40);
check('an undecided bill offers the default',/^Hand it to Uncle Bob$/.test(mainTxt()),mainTxt());
click(q('[data-act=swipestop]'));await wait(40);

// Fine-tune: picking who takes a bill on there changes the default too.
await act('bmode',{v:'fine'});await act('bstep',{v:'list'});
const sp=S().reg.costs.find(c=>/Spotify/.test(c.provider));await act('open',{id:sp.id});
click(all(`[data-act=pone][data-b="r|costs|${sp.id}|transferTo"]`).find(b=>/Tom/.test(b.dataset.v)));await wait(40);
check('fine-tune pick changes the default',samePerson(S().billTo,'Tom Morgan')&&samePerson(sp.transferTo,'Tom Morgan'),S().billTo+' / '+sp.transferTo);

// If the default person is removed from the plan, it falls back to the main person.
S().billTo='Nobody Here';await act('bmode',{v:'quick'});
click(all('.bqrow').find(b=>/RACQ/.test(b.textContent)));await wait(40);
check('a default that is no longer in the plan falls back',/^Hand it to Jo$/.test(mainTxt()),mainTxt());
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},400);
