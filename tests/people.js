// People fields: several beneficiaries with shares (super, insurance, assets), several names (joint accounts, heirlooms),
// one name picked from the plan (bills, devices), and old plans that stored plain text.
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const go=async(ch,stid)=>{const b=document.createElement('button');b.dataset.act='go';b.dataset.v='chapter';b.dataset.ch=ch;b.dataset.stid=stid;document.body.appendChild(b);click(b);b.remove();await wait(40);};
const openEntry=async(text)=>{click(all('.entry-head').find(h=>h.textContent.includes(text)));await wait(30);};
const rows=()=>all('.entry.open .prow').map(x=>x.querySelector('.pname').textContent+((x.querySelector('.ppct input')||{}).value!==undefined?' '+x.querySelector('.ppct input').value+'%':''));
const total=()=>((q('.entry.open .ptotal')||{}).textContent||'').trim();

click(q('[data-act=example]'));await wait(60);

// Super: the example has three beneficiaries.
await go('money','retire');await openEntry('AustralianSuper');
check('super shows three beneficiaries',rows().length===3,rows().join(', '));
check('super shares add to 100',/100%/.test(total()),total());
check('super header shows the split',/Jo Morgan 60%, Mia Morgan 20% and Tom Morgan 20%/.test(q('.entry.open .entry-sub').textContent),q('.entry.open .entry-sub').textContent);
const chipsNow=all('.entry.open .pf .chip.add').map(b=>b.textContent);
check('pick list offers people not yet added',chipsNow.some(t=>/Sam Morgan/.test(t))&&!chipsNow.some(t=>/Jo Morgan/.test(t))&&chipsNow.some(t=>/My estate/.test(t)),chipsNow.join(', '));
check('professionals left out of beneficiaries',!chipsNow.some(t=>/Priya|Helen/.test(t)),chipsNow.join(', '));
// Add Sam: total no longer 100 until shares are fixed.
click(all('.entry.open .pf .chip.add').find(b=>/Sam Morgan/.test(b.textContent)));await wait(30);
check('adding Sam makes four',rows().length===4,rows().join(', '));
check('a blank share is pointed out',/Sam Morgan doesn’t have a share yet/.test(total())&&!!q('.entry.open [data-act=peq]'),total());
setv(q('.entry.open .ppct input[data-i="3"]'),'10');await wait(10);
check('typing a share updates the total',/110%/.test(total())&&/10% too much/.test(total()),total());
setv(q('.entry.open .ppct input[data-i="0"]'),'5x0');await wait(10);
check('shares keep digits only',q('.entry.open .ppct input[data-i="0"]').value==='50',q('.entry.open .ppct input[data-i="0"]').value);
check('total after edit is 100',/100%/.test(total()),total());
click(q('.entry.open [data-act=peq]'));await wait(30);
// After an exact 100, there is no split-equally button; force it via an uneven edit first.
setv(q('.entry.open .ppct input[data-i="1"]'),'1');await wait(10);click(q('.entry.open [data-act=peq]'));await wait(30);
check('split equally gives 25 each',rows().every(x=>/ 25%$/.test(x)),rows().join(', '));
check('an even split says so',/Split equally\. Type over a share/.test(total())&&!q('.entry.open [data-act=peq]'),total());
// Someone new, typed: an even split stays even.
setv(q('.entry.open .pf-add input'),'Aunty Bev');click(q('.entry.open [data-act=pnew]'));await wait(30);
check('typed name added and split five ways by itself',rows().join(', ')==='Jo Morgan 20%, Mia Morgan 20%, Tom Morgan 20%, Sam Morgan 20%, Aunty Bev 20%',rows().join(', '));
// Remove one: still even.
click(all('.entry.open [data-act=prm]').pop());await wait(30);
check('remove takes the last one off and splits again',rows().join(', ')==='Jo Morgan 25%, Mia Morgan 25%, Tom Morgan 25%, Sam Morgan 25%',rows().join(', '));
for(let i=0;i<4;i++){setv(q(`.entry.open .ppct input[data-i="${i}"]`),'20');await wait(10);}
check('total warns when shares are typed short',/80%/.test(total())&&/20% still to give/.test(total()),total());

// Strengthen flags shares that don't add up.
let sb=document.createElement('button');sb.dataset.act='go';sb.dataset.v='strengthen';document.body.appendChild(sb);click(sb);sb.remove();await wait(40);
click(q('[data-act=sug][data-id=shares-retire]'));await wait(30);
check('strengthen flags the 80% split',/Check the shares add up to 100%/.test(document.body.innerText)&&/AustralianSuper don’t add up/.test(document.body.innerText),((q('.sug-body')||{}).innerText||'no card').slice(0,120));
// Leaving and coming back keeps the four.
await go('money','accounts');await go('money','retire');await openEntry('AustralianSuper');
check('shares are kept after leaving the page',rows().join(', ')==='Jo Morgan 20%, Mia Morgan 20%, Tom Morgan 20%, Sam Morgan 20%',rows().join(', '));

// Insurance: shares split evenly by default as people are added and removed.
await go('money','insurance');
click(all('[data-act=add][data-reg=policies]').pop());await wait(30);
const addChip=async re=>{click(all('.entry.open .pf .chip.add').find(b=>re.test(b.textContent)));await wait(30);};
await addChip(/Jo Morgan/);
check('one beneficiary gets 100%',rows().join(', ')==='Jo Morgan 100%',rows().join(', '));
await addChip(/My estate/);
check('two beneficiaries get 50% each, without pressing anything',rows().join(', ')==='Jo Morgan 50%, My estate 50%',rows().join(', '));
await addChip(/Mia Morgan/);
check('three beneficiaries get a third each, adding to 100',rows().join(', ')==='Jo Morgan 33.33%, My estate 33.33%, Mia Morgan 33.34%'&&/Split equally/.test(total()),rows().join(', ')+' | '+total());
click(all('.entry.open [data-act=prm]').pop());await wait(30);
check('removing one goes back to 50/50',rows().join(', ')==='Jo Morgan 50%, My estate 50%',rows().join(', '));

// Assets: shares typed by hand are kept. Someone new gets what's left, and one person on their own gets 100%.
await go('money','assets');
click(all('[data-act=add][data-reg=assets]').pop());await wait(30);
check('assets has a people field with shares',!!q('.entry.open .pf')&&all('.entry.open .pf .chip.add').length>0,all('.entry.open .pf .chip.add').length+' choices');
await addChip(/Jo Morgan/);
setv(q('.entry.open .ppct input[data-i="0"]'),'60');await wait(10);
await addChip(/Mia Morgan/);
check('after a typed 60%, the next person gets the other 40%',rows().join(', ')==='Jo Morgan 60%, Mia Morgan 40%',rows().join(', '));
await addChip(/Tom Morgan/);
check('typed shares are kept when someone else is added',rows().join(', ')==='Jo Morgan 60%, Mia Morgan 40%, Tom Morgan %'&&/Tom Morgan doesn’t have a share yet/.test(total())&&!!q('.entry.open [data-act=peq]'),rows().join(', ')+' | '+total());
click(all('.entry.open [data-act=prm]').pop());await wait(30);
check('typed shares are kept when someone is removed',rows().join(', ')==='Jo Morgan 60%, Mia Morgan 40%',rows().join(', '));
click(all('.entry.open [data-act=prm]').pop());await wait(30);
check('one person left gets 100%',rows().join(', ')==='Jo Morgan 100%',rows().join(', '));
click(all('.entry.open [data-act=prm]').pop());await wait(30);
check('removing the last person leaves no rows',rows().length===0,rows().join(', '));

// Joint account: several names, no shares.
await go('money','accounts');await openEntry('ING');
check('joint account lists Jo',rows().join(',')==='Jo Morgan',rows().join(','));
check('joint account has no share boxes',!q('.entry.open .ppct'));

// Belongings: several names.
await go('personal','belongings');await openEntry('watch');
click(all('.entry.open .pf .chip.add').find(b=>/Mia Morgan/.test(b.textContent)));await wait(30);
check('heirloom can go to two people',rows().join(', ')==='Tom Morgan, Mia Morgan',rows().join(', '));

// Bills: one name picked from the plan. Spotify was handed to "Mia", which matches Mia Morgan.
await go('admin','bills');
click(all('[data-act=bmode]').find(b=>/fine/.test(b.dataset.v||'')));await wait(30);
// Open Spotify by its id through a synthetic open button.
const spRow=all('[id^=bill_]').find(x=>/Spotify/.test(x.textContent));const spId=spRow?spRow.id.slice(5):'';
let ob=document.createElement('button');ob.dataset.act='open';ob.dataset.id=spId;document.body.appendChild(ob);click(ob);ob.remove();await wait(40);
const onChip=()=>all('.pf .chip.on').map(b=>b.textContent);
check('bill transfer shows the chosen person',onChip().includes('Mia Morgan'),spId+' '+onChip().join(','));
click(all('.pf [data-act=pone]').find(b=>b.textContent==='Jo Morgan'));await wait(30);
check('bill transfer changes to Jo',onChip().join(',')==='Jo Morgan',onChip().join(','));

// Executor's list shows the splits.
let outb=document.createElement('button');outb.dataset.act='go';outb.dataset.v='outputs';document.body.appendChild(outb);click(outb);outb.remove();await wait(40);
const execBtn=all('[data-act]').find(b=>/xecutor/.test(b.textContent));click(execBtn);await wait(60);
const txt=document.body.innerText;
check('executor list has the super split',/Nomination: Non-binding, to Jo Morgan 20%, Mia Morgan 20%, Tom Morgan 20% and Sam Morgan 20%/.test(txt),(txt.match(/Claim from AustralianSuper[^\n]*/)||[''])[0]);
check('executor list has insurance beneficiaries',/Beneficiaries: Jo Morgan 50% and My estate 50%/.test(txt));
check('executor list has the heirloom to two people',/Give Grandad’s watch to Tom Morgan and Mia Morgan/.test(txt));
check('no [object Object] anywhere',!/object Object/.test(txt));

// Family view: the claim tasks carry the beneficiaries.
let fb=document.createElement('button');fb.dataset.act='go';fb.dataset.v='famview';document.body.appendChild(fb);click(fb);fb.remove();await wait(40);
const die=q('[data-act=fvsit][data-v=die]');if(die){click(die);await wait(40);}
const ft=document.body.innerText;
check('family view: claim from super with the split',/Claim from AustralianSuper/.test(ft)&&/To Jo Morgan 20%/.test(ft),(ft.match(/Claim from Aus[^\n]*\n?[^\n]*/)||['none'])[0]);
check('family view: no [object Object]',!/object Object/.test(ft));

// Household manual and Ask the plan don't show raw objects either.
outb=document.createElement('button');outb.dataset.act='go';outb.dataset.v='outputs';document.body.appendChild(outb);click(outb);outb.remove();await wait(40);
const manBtn=all('[data-act]').find(b=>/manual/i.test(b.textContent));click(manBtn);await wait(60);
check('manual: no [object Object]',!/object Object/.test(document.body.innerText));
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},400);
