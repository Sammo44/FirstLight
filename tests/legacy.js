// Older plans stored beneficiaries and owners as plain text. They should still read, as separate people with shares.
// Runs before the app boots: puts an old-style plan in local storage.
localStorage.setItem('amfy-plan-v2', JSON.stringify({started:true, scanDone:true,
  settings:{name:"Lee", tone:"soft", faith:"neutral", country:"AU", region:"NSW", subject:"me", subjectName:""},
  scan:{retire:"yes", partner:"married"},
  reg:{people:[{id:"p1", name:"Jo Smith", rel:"Wife", roles:[]}, {id:"p2", name:"Sam Smith", rel:"Son", roles:[]}],
       retire:[{id:"r1", fund:"HESTA", nomination:"Binding (non-lapsing)", nominee:"Jo 50%, Sam 30% and Mia 20%"}],
       belongings:[{id:"b1", item:"Ring", forWhom:"Jo & Sam"}],
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
await go('personal','belongings');
check('old "Jo & Sam" reads as two people',/for Jo and Sam/.test((all('.entry-sub')[0]||{}).textContent||''),(all('.entry-sub')[0]||{}).textContent);
await go('money','accounts');
check('old joint text reads',/Joint with Jo/.test((all('.entry-sub')[0]||{}).textContent||''),(all('.entry-sub')[0]||{}).textContent);
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},600);
