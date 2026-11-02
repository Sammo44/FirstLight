// A bill's amount follows its charges: removing a charge works it out again, and picking how often gives the average
// cost per week, month or year. Made-up charges only.
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const act=async(a,ds)=>{const b=document.createElement('button');b.dataset.act=a;Object.assign(b.dataset,ds||{});document.body.appendChild(b);click(b);b.remove();await wait(40);};
const A=window.__amfy,S=()=>A.plan(),f2=v=>v==null?'null':v.toFixed(2);
const tx=(d,a,t)=>({d,a,t:t||'CHARGE',s:'Made-up card',m:''});
const months=['2026-03-25','2026-04-25','2026-05-25','2026-06-25','2026-07-25','2026-08-25','2026-09-25','2026-10-25'];
const dashpass=months.map(d=>tx(d,9.99,'PAYPAL *DASHPASS'));
const orders=[['2026-03-02',42.5],['2026-03-19',61.2],['2026-04-08',38.9],['2026-05-14',75.35],['2026-06-01',29.95],['2026-06-22',55],['2026-07-30',48.6],['2026-08-12',66.4],['2026-09-03',31.75],['2026-10-11',58.2]].map(([d,a])=>tx(d,a,'PAYPAL *DOORDASH ORDER'));

// The sums on their own.
check('monthly subscription: the charge itself',f2(A.costFromTx(dashpass,'Monthly'))==='9.99',f2(A.costFromTx(dashpass,'Monthly')));
check('monthly subscription as yearly: 12 times',f2(A.costFromTx(dashpass,'Yearly'))==='119.88',f2(A.costFromTx(dashpass,'Yearly')));
check('monthly subscription as weekly',f2(A.costFromTx(dashpass,'Weekly'))==='2.31',f2(A.costFromTx(dashpass,'Weekly')));
check('a missing month doesn’t change a subscription',f2(A.costFromTx(dashpass.filter((x,i)=>i!==3),'Monthly'))==='9.99');
const mix=dashpass.concat(orders),tot=mix.reduce((s,x)=>s+x.a,0),span=(Date.parse('2026-10-25')-Date.parse('2026-03-02'))/864e5,perMo=tot/((span+30)/30.44);
check('varying charges: total spread over the months they cover',f2(A.costFromTx(mix,'Monthly'))===perMo.toFixed(2),f2(A.costFromTx(mix,'Monthly'))+' vs '+perMo.toFixed(2));
check('varying charges as yearly: 12 months’ worth',f2(A.costFromTx(mix,'Yearly'))===(perMo*12).toFixed(2),f2(A.costFromTx(mix,'Yearly')));
check('as needed: the average charge',f2(A.costFromTx(orders,'Ad hoc'))===(orders.reduce((s,x)=>s+x.a,0)/orders.length).toFixed(2),f2(A.costFromTx(orders,'Ad hoc')));
check('one charge: that charge',f2(A.costFromTx([tx('2026-05-01',120)],'Yearly'))==='120.00');
check('no charges: nothing to work out',A.costFromTx([],'Monthly')===null);
check('no charges: $640 quarterly is $213.33 monthly',f2(A.convertAmount('640','Quarterly','Monthly'))==='213.33');
check('no charges: can’t convert to Other',A.convertAmount('640','Quarterly','Other')===null);

// In the app: a DoorDash-like bill with a subscription and food orders mixed together.
click(q('[data-act=example]'));await wait(80);
const id='dd1';S().reg.costs.push({id,provider:'DoorDash',type:'',billers:['DoorDash'],category:'Other',amount:perMo.toFixed(2),freq:'Monthly',seen:mix.map(x=>Object.assign({},x))});
await act('go',{v:'chapter',ch:'admin',stid:'bills'});await act('bmode',{v:'fine'});await act('bstep',{v:'list'});
await act('open',{id});await act('btx',{id});
const it=()=>S().reg.costs.find(x=>x.id===id);
const rmBtns=()=>all(`#bill_${id} [data-act=rmtx]`);
check('the bill’s charges are listed with remove buttons',rmBtns().length===18,rmBtns().length+' remove buttons');
// Remove the food orders one by one, keeping the $9.99 subscription.
const before=+it().amount;let first=null;
for(let i=0;i<10;i++){const b=rmBtns().find(x=>!/\|9\.99\|/.test(x.dataset.k));if(!b)break;click(b);await wait(30);if(first===null)first=+it().amount;}
check('removing a charge works the amount out again',first!==null&&first<before,before+' → '+first);
check('with only the subscription left, it’s $9.99 monthly',it().amount==='9.99'&&it().seen.length===8,it().amount+' from '+it().seen.length);
check('the card header shows the new amount',/\$9\.99 monthly/.test((q(`#bill_${id} .acard-h`)||{}).textContent||''),(q(`#bill_${id} .acard-h .amt`)||{}).textContent);
check('a message says what changed',/DoorDash: now \$9\.99 monthly, from 8 charges/.test((q('.toast')||{}).textContent||''),(q('.toast')||{}).textContent);

// Picking how often gives the average per that period.
await act('bmore',{id});
const pickF=async v=>{click(q(`#bill_${id} [data-b="r|costs|${id}|freq"][data-v="${v}"]`));await wait(40);};
check('the amount says how it’s worked out',/The average of the 8 charges/.test((q(`#bill_${id}`)||{}).textContent||''));
await pickF('Yearly');
check('yearly: 12 months of the subscription',it().amount==='119.88'&&it().freq==='Yearly',it().amount+' '+it().freq);
check('message gives the average',/DoorDash: \$119\.88 yearly, the average of 8 charges/.test((q('.toast')||{}).textContent||''),(q('.toast')||{}).textContent);
await pickF('Weekly');
check('weekly',it().amount==='2.31',it().amount);
await pickF('Monthly');
check('back to monthly',it().amount==='9.99',it().amount);
await pickF('Ad hoc');
check('as needed: the average charge',it().amount==='9.99'&&it().freq==='Ad hoc',it().amount+' '+it().freq);
await pickF('Monthly');

// A typed amount stays when the frequency changes ("$12.50" then "Yearly" means $12.50 a year), with a way back to the average.
setv(q(`#bill_${id} [data-b="r|costs|${id}|amount"]`),'12.50');await wait(20);
check('a typed amount is kept',it().amount==='12.50'&&it().amountOwn===true);
await pickF('Yearly');
check('a typed amount stays when the frequency changes',it().amount==='12.50'&&it().freq==='Yearly',it().amount+' '+it().freq);
const back=q(`#bill_${id} [data-act=amtcalc]`);
check('a button offers the average instead',!!back&&/Use the average, \$119\.88/.test(back.textContent)&&/You typed this amount/.test(q(`#bill_${id}`).textContent),back&&back.textContent);
click(back);await wait(40);
check('using the average',it().amount==='119.88'&&!it().amountOwn&&!q(`#bill_${id} [data-act=amtcalc]`),it().amount);
await pickF('Monthly');
check('the average follows the frequency again',it().amount==='9.99',it().amount);
setv(q(`#bill_${id} [data-b="r|costs|${id}|amount"]`),'12.50');await wait(20);
click(rmBtns()[0]);await wait(30);
check('removing a charge works it out again from what’s left',it().amount==='9.99'&&it().seen.length===7,it().amount);
// Remove every charge: the amount stays.
for(let i=0;i<10&&rmBtns().length;i++){click(rmBtns()[0]);await wait(20);}
check('with no charges left, the amount stays',it().seen.length===0&&it().amount==='9.99'&&/no charges left/.test((q('.toast')||{}).textContent||''),it().amount+' | '+(q('.toast')||{}).textContent);
await pickF('Quarterly');
check('with no charges, a new frequency converts the amount',it().amount==='29.97',it().amount);

// A bill in the quick view: its Edit panel's frequency does the same.
const og=S().reg.costs.find(x=>/Origin/.test(x.provider));
await act('bmode',{v:'quick'});await act('swipeone',{id:og.id});
check('Origin opens with its edit panel',!!q(`#bqe_${og.id}`));
const mean=og.seen.reduce((s,x)=>s+x.a,0)/og.seen.length;
click(q(`#bqe_${og.id} [data-b="r|costs|${og.id}|freq"][data-v="Monthly"]`));await wait(40);
check('quarterly power bill as monthly: a third of the average bill',og.amount===(mean/3).toFixed(2)&&og.freq==='Monthly',og.amount+' vs '+(mean/3).toFixed(2));
check('the card header follows',new RegExp('\\$'+og.amount.replace('.','\\.')+' monthly').test((q('.bqhead')||{}).textContent||''),(q('.bqhead')||{}).textContent);
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},400);
