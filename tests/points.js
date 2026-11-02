// Points, vouchers and credit: their own page, set out like assets, with who gets each one (and their shares),
// member or card numbers, balance, expiry, a linked card, and what should happen. They reach the executor's list,
// the family view, Ask the plan and Strengthen.
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const act=async(a,ds)=>{const b=document.createElement('button');b.dataset.act=a;Object.assign(b.dataset,ds||{});document.body.appendChild(b);click(b);b.remove();await wait(40);};
const go=(ch,stid)=>act('go',{v:'chapter',ch,stid});
const rows=()=>all('.entry.open .prow').map(x=>x.querySelector('.pname').textContent+(x.querySelector('.ppct input')?' '+x.querySelector('.ppct input').value+'%':''));
const labels=()=>all('.entry.open .field > label, .entry.open .field > .label').map(l=>l.textContent.trim());
const subOf=t=>{const h=all('.entry-head').find(h=>h.querySelector('.entry-title').textContent===t);return h?h.querySelector('.entry-sub').textContent:'(missing)';};
const P=()=>window.__amfy.plan();

click(q('[data-act=example]'));await wait(60);
await go('money','points');
check('points page is its own step',/Points, vouchers and credit/.test((q('#stepcard h2')||{}).textContent||''),(q('#stepcard h2')||{}).textContent);
check('example has three cards',all('.entries .entry').length===3,all('.entry-title').map(x=>x.textContent).join(', '));
check('header shows type, balance and who gets it',subOf('Qantas Frequent Flyer')==='Frequent flyer · 84,000 points · to Jo Morgan',subOf('Qantas Frequent Flyer'));
check('header shows a split',/to Mia Morgan 50% and Tom Morgan 50%/.test(subOf('Westpac Altitude Rewards')),subOf('Westpac Altitude Rewards'));
check('header shows expiry',/expires 2027-12-24/.test(subOf('Myer gift card')),subOf('Myer gift card'));
const presets=all('[data-act=add][data-reg=points]').map(b=>b.textContent);
check('quick-add buttons for programs and cards',['Qantas Frequent Flyer','Velocity Frequent Flyer','Flybuys','Gift card','Store credit'].every(n=>presets.some(t=>t.includes(n))),presets.join(', '));

// A new gift card, set out like an asset.
click(all('[data-act=add][data-reg=points]').find(b=>/Gift card/.test(b.textContent)));await wait(40);
const id=P().reg.points[P().reg.points.length-1].id;
check('new card opens with its type set',!!q('.entry.open')&&P().reg.points.find(x=>x.id===id).type==='Gift card',JSON.stringify(P().reg.points.find(x=>x.id===id)));
const want=['Program, store or card','Type','Member or card number','Balance or value','Expires on (if known)','Where is the card, app or login?','What should happen to it?','Who should get it?'];
check('card has the asset-style fields',want.every(w=>labels().includes(w)),labels().join(' | '));
check('more details: linked card and notes',/Earned through a card or account and Notes/.test((q('.entry.open [data-act=entrymore]')||{}).textContent||''),(q('.entry.open [data-act=entrymore]')||{}).textContent);
setv(q(`.entry.open [data-b="r|points|${id}|what"]`),'JB Hi-Fi gift card');
setv(q(`.entry.open [data-b="r|points|${id}|member"]`),'Ends 7781');
setv(q(`.entry.open [data-b="r|points|${id}|balance"]`),'$150');
setv(q(`.entry.open [data-b="r|points|${id}|expires"]`),'2028-03-01');
setv(q(`.entry.open [data-b="r|points|${id}|where"]`),'Wallet');
const it=()=>P().reg.points.find(x=>x.id===id);
check('details are saved',it().what==='JB Hi-Fi gift card'&&it().member==='Ends 7781'&&it().balance==='$150'&&it().expires==='2028-03-01'&&it().where==='Wallet',JSON.stringify(it()));
// Beneficiaries, split evenly by default.
const chips=all('.entry.open .pf .chip.add').map(b=>b.textContent);
check('beneficiaries picked from your people, plus My estate',chips.some(t=>/Jo Morgan/.test(t))&&chips.some(t=>/My estate/.test(t))&&!chips.some(t=>/Priya/.test(t)),chips.join(', '));
const addChip=async re=>{click(all('.entry.open .pf .chip.add').find(b=>re.test(b.textContent)));await wait(30);};
await addChip(/Sam Morgan/);
check('one beneficiary gets 100%',rows().join(', ')==='Sam Morgan 100%',rows().join(', '));
await addChip(/Tom Morgan/);
check('two get 50% each',rows().join(', ')==='Sam Morgan 50%, Tom Morgan 50%',rows().join(', '));
click(q(`.entry.open [data-b="r|points|${id}|outcome"][data-v=Transfer]`));await wait(30);
check('header shows the new card',subOf('JB Hi-Fi gift card')==='Gift card · $150 · expires 2028-03-01 · to Sam Morgan 50% and Tom Morgan 50%',subOf('JB Hi-Fi gift card'));
// Linked card.
click(q('.entry.open [data-act=entrymore]'));await wait(30);
const sel=q(`.entry.open select[data-bsel="r|points|${id}|linked"]`);
check('linked card picker lists the accounts',!!sel&&Array.from(sel.options).some(o=>/Westpac/.test(o.textContent)),sel?Array.from(sel.options).map(o=>o.textContent).join(', '):'no select');
check('linked card has a warning about closing the card',/lost when the card is closed/.test((sel&&sel.parentElement.textContent)||''));
// Close hides the beneficiaries.
click(q(`.entry.open [data-b="r|points|${id}|outcome"][data-v=Close]`));await wait(30);
check('closing it hides who gets it',!labels().includes('Who should get it?')&&/close it$/.test(subOf('JB Hi-Fi gift card')),subOf('JB Hi-Fi gift card'));
click(q(`.entry.open [data-b="r|points|${id}|outcome"][data-v=Transfer]`));await wait(30);
// Shares typed short are flagged by Strengthen.
setv(q('.entry.open .ppct input[data-i="0"]'),'30');await wait(10);
await act('go',{v:'strengthen'});
check('Strengthen flags points shares that don’t add up',!!q('[data-act=sug][data-id=shares-points]'),all('[data-act=sug]').map(b=>b.dataset.id).join(', '));
await go('money','points');if(!q('.entry.open'))await act('open',{id});
setv(q('.entry.open .ppct input[data-i="0"]'),'50');await wait(10);

// Executor's list.
await act('go',{v:'outputs'});click(all('[data-act]').find(b=>/xecutor/.test(b.textContent)));await wait(60);
const ex=document.body.innerText;
check('executor: frequent flyer transfer',/Qantas Frequent Flyer: transfer it to Jo Morgan\. Member or card: 1928 3746\. Balance: 84,000 points\./.test(ex),(ex.match(/Qantas Frequent Flyer:[^\n]*/)||[''])[0]);
check('executor: card points warn about closing the card',/Westpac Altitude Rewards: use or redeem it for Mia Morgan 50% and Tom Morgan 50%\..*Earned through Westpac[^\n]*before the card is closed/.test(ex),(ex.match(/Westpac Altitude Rewards:[^\n]*/)||[''])[0]);
check('executor: gift card with expiry and where',/JB Hi-Fi gift card: transfer it to Sam Morgan 50% and Tom Morgan 50%\. Member or card: Ends 7781\. Balance: \$150\. Expires 2028-03-01\. Where: Wallet\./.test(ex),(ex.match(/JB Hi-Fi gift card:[^\n]*/)||[''])[0]);
check('executor: no old points line',!/Ask about transferring points/.test(ex));

// Family view and Ask the plan.
await act('go',{v:'famview'});const die=q('[data-act=fvsit][data-v=die]');if(die){click(die);await wait(40);}
const fv=document.body.innerText;
check('family view has a job for each card',/Qantas Frequent Flyer: transfer it to Jo Morgan/.test(fv)&&/Myer gift card: use or redeem it for Mia Morgan/.test(fv),(fv.match(/Qantas Frequent Flyer[^\n]*/)||['none'])[0]);
check('no [object Object] anywhere',!/object Object/.test(fv+ex));

// Deleting the linked account clears the link.
const ccId=P().reg.points.find(x=>x.what==='Westpac Altitude Rewards').linked;
await act('delyes',{reg:'accounts',id:ccId});
check('deleting the card clears the link',!P().reg.points.find(x=>x.what==='Westpac Altitude Rewards').linked);
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},400);
