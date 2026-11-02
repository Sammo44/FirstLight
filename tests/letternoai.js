// Letters on a copy without Claude (like GitHub Pages): it says why Claude can't write here, the letter is put
// together on the device, it can be tried another way (another version, shorter, warmer, lighter, plainer), and
// every earlier version can be brought back.
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const act=async(a,ds)=>{const b=document.createElement('button');b.dataset.act=a;Object.assign(b.dataset,ds||{});document.body.appendChild(b);click(b);b.remove();await wait(40);};
const P=()=>window.__amfy.plan();
click(q('[data-act=example]'));await wait(80);
await act('go',{v:'words'});
const lt=P().reg.letters.find(x=>x.rel==='young');await act('open',{id:lt.id});
const titles=()=>all('.guide .qdot').map(d=>d.title);
const jump=async re=>{await act('livgo',{id:lt.id,v:String(titles().findIndex(t=>re.test(t)))});};
const ans=()=>q('#liv_'+lt.id);
await jump(/always makes you smile/);setv(ans(),'how you narrate everything to the dog');
await jump(/^What you already see in Tom/);setv(ans(),'you stick up for kids who get left out');
await jump(/^The last thing/);setv(ans(),'you made every day better');
await act('livgo',{id:lt.id,v:'0'});
check('says plainly why Claude can’t write it here',/isn’t running inside Claude \(for example, the copy on GitHub Pages\)/.test((q('.lbring .note')||{}).textContent||''),(q('.lbring .note')||{}).textContent);
check('no Claude-only buttons',!q('[data-act=ldeepai]')&&!q('[data-act=lmoreq]')&&!!q('.lbring [data-act=ldeep]'));
await act('ldeep',{id:lt.id});
const pv=()=>((q('.lpreview blockquote')||{}).innerText||'').trim();
const v1=pv();
check('try another way',all('.lpreview [data-act=ldeep]').map(b=>b.textContent).join('/')==='Another version/Shorter/Warmer/Lighter/Plainer');
await act('ldeep',{id:lt.id,v:'again'});const v2=pv();
check('another version reads differently',v2!==v1&&v2.split('\n\n')[1]!==v1.split('\n\n')[1],JSON.stringify(v2.slice(0,160)));
await act('ldeep',{id:lt.id,v:'warmer'});
check('warmer changes the feeling',/so you’ll always have them|what I most want you to know|come back to them whenever/.test(pv()),JSON.stringify(pv().slice(0,200)));
await act('ldeep',{id:lt.id,v:'shorter'});
check('shorter is shorter',pv().length<v2.length,pv().length+' vs '+v2.length);
await act('lprevuse',{id:lt.id,v:'replace'});const first=lt.body;
check('used as the letter',/^Dear Tom,/.test(first||''),JSON.stringify((first||'').slice(0,30)));
await act('ldeep',{id:lt.id,v:'again'});await act('lprevuse',{id:lt.id,v:'replace'});
check('replacing it keeps the one before',lt.versions.length===1&&lt.versions[0].text===first&&!!q('[data-act=lrestore]'));
const second=lt.body;await act('lrestore',{id:lt.id,i:'0'});
check('bring it back, and the swapped one is kept',lt.body===first&&lt.versions[0].text===second);
// A letter from before version history keeps its earlier version.
const old=P().reg.letters.find(x=>x.rel!=='young');old.prevBody='An older draft.';await act('open',{id:old.id});
check('an older letter’s earlier version carries over',(old.versions||[]).length===1&&old.versions[0].text==='An older draft.'&&!('prevBody' in old));
check('no [object Object]',!/object Object/.test(document.body.innerText));
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},500);
