// Finding bills on real-life statements: breaks in a schedule (a bill moved to another card, a missed month, a new
// billing day, a pause), prices that change, and rent and water paid to the same agent. Things that aren't bills
// (commuting fares, a regular weekly shop, scattered purchases at one price) stay out. Made-up statements only.
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const A=window.__amfy;
const D=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d);};
const fmt=dt=>`${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
const add=(s,days)=>{const dt=D(s);dt.setDate(dt.getDate()+days);return dt;};
const rows=[];const charge=(dt,name,amt)=>rows.push([typeof dt==='string'?D(dt):dt,name,amt]);
const every=(start,days,n,name,amtOf,skip)=>{for(let i=0;i<n;i++){if(skip&&skip.includes(i))continue;charge(add(start,days*i),name,typeof amtOf==='function'?amtOf(i):amtOf);}};
const monthly=(day,from,to,name,amtOf)=>{let [y,m]=from.split('-').map(Number);const [ty,tm]=to.split('-').map(Number);let i=0;while(y<ty||(y===ty&&m<=tm)){charge(new Date(y,m-1,day),name,typeof amtOf==='function'?amtOf(i,y,m):amtOf);i++;m++;if(m>12){m=1;y++;}}};

// 1. Moved to another card: two charges, an 85-day break, then every 28 days. The price drops from $30 to $25.
charge('2025-07-19','ACME MOBILE PTY LTD SYDNEY','30.00');charge('2025-08-16','ACME MOBILE PTY LTD SYDNEY','30.00');
every('2025-11-09',28,13,'ACME MOBILE PTY LTD SYDNEY',i=>i<5?'30.00':'25.00');
// 2. One odd month: $25.96 on the 1st, but $45.76 in July.
monthly(1,'2026-01','2026-10','CLOUDCO WORKSPACE PYRMONT',(i,y,m)=>m===7?'45.76':'25.96');
// 3. A new billing day: the 11th once, then the 1st.
charge('2025-09-11','FLICKNET STREAMING MELBOURNE','84.99');monthly(1,'2025-10','2026-10','FLICKNET STREAMING MELBOURNE','84.99');
// 4. A price that keeps going up, from a biller the app doesn't know.
[85.95,85.86,85.86,109,110.09,110.1,110.1,109,111.19,115.11,115.15,115.15].forEach((a,i)=>charge(new Date(2025,10+i,8),'SKYLINK BROADBAND BRISBANE',a.toFixed(2)));
// 5. Rent and water paid to the same agent. Rent is weekly, $880 with one double gap, then $900.
every('2025-10-31',7,41,'12 SAMPLE ST Rent 2 weeks in advance - BPAY Bill Payment - Receipt 1234 To ACME REAL ESTATE','880.00',[6]);
every('2026-08-21',7,10,'12 SAMPLE ST Rent 2 weeks in advance - BPAY Bill Payment - Receipt 1234 To ACME REAL ESTATE','900.00');
charge('2025-11-19','12 Sample St water - BPAY Bill Payment - Receipt 5678 To ACME REAL ESTATE','101.66');
charge('2026-02-27','12 Sample St Water - BPAY Bill Payment - Receipt 5679 To ACME REAL ESTATE','99.84');
charge('2026-05-20','12 Sample St water Inv0044 - BPAY Bill Payment - Receipt 5680 To ACME REAL ESTATE','130.58');
// 6. A paused subscription that came back after eight months.
monthly(12,'2025-08','2025-12','FLICKS ENTERTAINMENT PTY LTD','32.00');charge('2026-08-12','FLICKS ENTERTAINMENT PTY LTD','32.00');monthly(12,'2026-09','2026-10','FLICKS ENTERTAINMENT PTY LTD','32.00');
// Not bills: commuting fares, a regular weekly shop, scattered purchases at one price, and topping up a money app.
every('2026-05-04',7,20,'TFNSW OPAL FARE SYDNEY','16.56');
every('2026-05-02',7,20,'FRESHMART KELLYVILLE',i=>[182.4,211.95,164.35,240.1,198.75,156.2,225.6,171.05,249.3,190.8,207.15,143.9,232.45,176.6,219.85,161.3,244.7,188.15,203.4,169.95][i].toFixed(2));
['2025-11-03','2025-12-03','2026-02-13','2026-06-20','2026-09-27'].forEach(d=>charge(d,'GAMESHOP ONLINE SYDNEY','49.99'));
every('2026-06-05',7,8,'Revolut**1234* - Visa Purchase - Receipt 999','250.00');
// The statement runs to the end of October 2026.
charge('2026-10-29','CORNER CAFE SYDNEY','4.50');

rows.sort((a,b)=>a[0]-b[0]);
const text='Bank Account,Date,Narrative,Debit Amount,Credit Amount,Balance,Categories,Serial\n'+rows.map(([d,n,a])=>`032000123456,${fmt(d)},${n},${a},,1000,OTHER,`).join('\n');
const res=A.parseStatements([{name:'made-up.csv',text}]),items=res.items;
const find=re=>items.find(x=>re.test(x.provider||''));
r.push('found: '+items.map(x=>`${x.provider} $${x.amount} ${x.freq}${x.stopped?' (stopped)':''}`).join('; '));

const mob=find(/acme mobile/i);
check('a bill moved to another card is still found',!!mob&&mob.pick&&!mob.stopped,mob&&mob.note);
check('it shows the latest price',mob&&+mob.amount===25&&mob.freq==='Monthly',mob&&mob.amount+' '+mob.freq);
const ws=find(/cloudco/i);
check('one odd month doesn’t hide a bill',!!ws&&ws.pick&&+ws.amount===25.96&&ws.freq==='Monthly',ws&&ws.amount+' '+ws.freq);
const fl=find(/flicknet/i);
check('a new billing day doesn’t hide a bill',!!fl&&fl.pick&&+fl.amount===84.99&&fl.freq==='Monthly',fl&&fl.note);
const sky=find(/skylink/i);
check('a price that keeps rising: one bill at the latest price',!!sky&&sky.pick&&+sky.amount===115.15&&sky.freq==='Monthly',sky&&sky.amount+' '+(sky&&sky.note));
const rent=find(/^rent$/i),water=find(/water/i);
check('rent is found, at the new price, weekly',!!rent&&+rent.amount===900&&rent.freq==='Weekly'&&!rent.stopped,rent&&rent.amount+' '+rent.freq);
check('rent keeps all its charges',rent&&rent.txs.length>=24,rent&&rent.txs.length);
check('water to the same agent is its own bill',!!water&&water!==rent&&water.txs.length===3&&!water.txs.some(t=>+t.a>=880),water&&water.provider+' '+water.txs.length);
const fk=find(/flicks/i);
check('a paused subscription that came back is found',!!fk&&fk.pick&&+fk.amount===32,fk&&fk.note);
check('commuting fares are not a bill',!find(/tfnsw|opal/i));
check('a regular weekly shop is not a bill',!find(/freshmart/i));
check('scattered purchases at one price are not a bill',!find(/gameshop/i));
check('topping up a money app is not a bill',!find(/revolut/i));
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},400);
