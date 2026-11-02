// Older plans stored beneficiaries and owners as plain text. They should still read, as separate people with shares.
// Runs before the app boots: puts an old-style plan in local storage.
localStorage.setItem('amfy-plan-v2', JSON.stringify({started:true, scanDone:true,
  settings:{name:"Lee", tone:"soft", faith:"neutral", country:"AU", region:"NSW", subject:"me", subjectName:""},
  scan:{retire:"yes", partner:"married"},
  answers:{"money.points.list":"Qantas Frequent Flyer, Flybuys, a gift card in the kitchen drawer"},
  reg:{people:[{id:"p1", name:"Jo Smith", rel:"Wife", roles:[]}, {id:"p2", name:"Sam Smith", rel:"Son", roles:[]}],
       retire:[{id:"r1", fund:"HESTA", nomination:"Binding (non-lapsing)", nominee:"Jo 50%, Sam 30% and Mia 20%"}],
       belongings:[{id:"b1", item:"Ring", forWhom:"Jo & Sam"}],
       policies:[{id:"i1", insurer:"TAL", type:"Life", heldVia:"Myself", beneficiary:[{name:"Jo Smith", pct:""}, {name:"Sam Smith", pct:""}]}],
       assets:[{id:"s1", what:"Caravan", intendedFor:"Jo & Sam & Mia"}, {id:"s2", what:"Boat", intendedFor:[{name:"Sam Smith", pct:""}]}],
       accounts:[{id:"a1", inst:"NAB", type:"Everyday", owner:"Joint", jointWith:"Jo"}],
       costs:[{id:"c1", provider:"Netflix", amount:"20", freq:"Monthly", outcome:"Transfer", transferTo:"Sam"}]}}));
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const go=async(ch,stid)=>{const b=document.createElement('button');b.dataset.act='go';b.dataset.v='chapter';b.dataset.ch=ch;b.dataset.stid=stid;document.body.appendChild(b);click(b);b.remove();await wait(40);};
const openEntry=async(text)=>{click(all('.entry-head').find(h=>h.textContent.includes(text)));await wait(30);};
const rows=()=>all('.entry.open .prow').map(x=>x.querySelector('.pname').textContent+(x.querySelector('.ppct input')?' '+x.querySelector('.ppct input').value+'%':''));
await go('money','retire');
check('old text shows in the header',/to Jo 50%, Sam 30% and Mia 20%/.test((all('.entry-sub')[0]||{}).textContent||''),(all('.entry-sub')[0]||{}).textContent);
await openEntry('HESTA');
check('old text becomes three people with shares',rows().join(', ')==='Jo 50%, Sam 30%, Mia 20%',rows().join(', '));
check('Jo and Sam are not offered again',!all('.entry.open .pf .chip.add').some(b=>/Jo Smith|Sam Smith/.test(b.textContent)),all('.entry.open .pf .chip.add').map(b=>b.textContent).join(', '));
// Shares never filled in are split evenly when the plan opens. Shares that were given are left alone.
const P=window.__amfy.plan(),pcts=v=>(Array.isArray(v)?v:[]).map(x=>x.name+' '+x.pct).join(', ');
check('blank insurance shares become 50/50',pcts(P.reg.policies[0].beneficiary)==='Jo Smith 50, Sam Smith 50',pcts(P.reg.policies[0].beneficiary));
check('old "Jo & Sam & Mia" asset becomes a third each',pcts(P.reg.assets[0].intendedFor)==='Jo 33.33, Sam 33.33, Mia 33.34',JSON.stringify(P.reg.assets[0].intendedFor));
check('one person with no share gets 100%',pcts(P.reg.assets[1].intendedFor)==='Sam Smith 100',pcts(P.reg.assets[1].intendedFor));
check('given shares are left as they were',P.reg.retire[0].nominee==='Jo 50%, Sam 30% and Mia 20%',JSON.stringify(P.reg.retire[0].nominee));
check('old written points list becomes one card each',(P.reg.points||[]).map(x=>x.what+' ('+x.type+')').join(', ')==='Qantas Frequent Flyer (Frequent flyer), Flybuys (Loyalty points), A gift card in the kitchen drawer (Gift card)',JSON.stringify(P.reg.points));
check('old written points list is not kept twice',!('money.points.list' in P.answers),JSON.stringify(P.answers));
check('heirlooms have no shares added',P.reg.belongings[0].forWhom==='Jo & Sam',JSON.stringify(P.reg.belongings[0].forWhom));
await go('personal','belongings');
check('old "Jo & Sam" reads as two people',/for Jo and Sam/.test((all('.entry-sub')[0]||{}).textContent||''),(all('.entry-sub')[0]||{}).textContent);
await go('money','accounts');
check('old joint text reads',/Joint with Jo/.test((all('.entry-sub')[0]||{}).textContent||''),(all('.entry-sub')[0]||{}).textContent);
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},600);
