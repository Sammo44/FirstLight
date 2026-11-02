// Password managers: several can be added on the vault page, each with its own steps for emergency access, its own
// status and its own people. They reach Strengthen, the executor's list, the family view and Ask the plan.
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const act=async(a,ds)=>{const b=document.createElement('button');b.dataset.act=a;Object.assign(b.dataset,ds||{});document.body.appendChild(b);click(b);b.remove();await wait(40);};
const S=()=>window.__amfy.plan(),pms=()=>S().reg.pms;
const subOf=t=>{const h=all('.pmsec .entry-head').find(h=>h.querySelector('.entry-title').textContent===t);return h?h.querySelector('.entry-sub').textContent:'(missing)';};
const how=()=>((q('.entry.open .howto')||{}).textContent||'').replace(/\s+/g,' ');
const labels=()=>all('.entry.open .field > label, .entry.open .field > .label').map(l=>l.textContent.trim());
const addPreset=async n=>{click(all('.pmsec [data-act=add][data-reg=pms]').find(b=>b.textContent.trim()==='+ '+n));await wait(40);return pms()[pms().length-1];};

click(q('[data-act=example]'));await wait(80);
await act('go',{v:'chapter',ch:'admin',stid:'vault'});
check('vault page lists password managers',/Your password managers/.test((q('.pmsec h3')||{}).textContent||''));
check('the old single question is gone',!/Which password manager do you use for everything else/.test(document.body.textContent));
check('example has two',all('.pmsec .entry').length===2,all('.pmsec .entry-title').map(x=>x.textContent).join(', '));
check('Bitwarden header: set up, and who',subOf('Bitwarden')==='emergency access set up · for Jo Morgan',subOf('Bitwarden'));
check('Apple header: not set up yet',subOf('Apple Passwords')==='not set up yet',subOf('Apple Passwords'));
const presets=all('.pmsec [data-act=add][data-reg=pms]').map(b=>b.textContent.replace('+ ',''));
check('quick-add for each password manager',['Bitwarden','1Password','Apple Passwords','Google Password Manager','LastPass','Keeper','NordPass','Proton Pass','Dashlane','Passwords saved in my browser'].every(n=>presets.includes(n)),presets.join(', '));

// Each one has its own steps.
await act('open',{id:pms()[0].id});
check('Bitwarden steps',/How to set up emergency access in Bitwarden/.test(how())&&/Settings › Emergency access/.test(how())&&/Add emergency contact/.test(how())&&/Premium/.test(how()),how().slice(0,160));
check('steps are a numbered list',all('.entry.open .howto ol li').length===4);
check('link to the company’s own guide',!!q('.entry.open .howto a[href="https://bitwarden.com/help/emergency-access/"][target=_blank]'));
await act('open',{id:pms()[1].id});
check('Apple: Legacy Contact doesn’t cover passwords, share a group instead',/How to leave a way into Apple Passwords/.test(how())&&/doesn’t include passwords/.test(how())&&/New Group/.test(how())&&/Legacy Contact/.test(how()),how().slice(0,160));
check('Apple asks about a way in, not emergency access',labels().includes('Is there a way in for your family?')&&!labels().includes('Is emergency access set up?'),labels().join(' | '));

// Add more: as many as you use.
const lp=await addPreset('LastPass');
check('LastPass added and opened',lp.what==='LastPass'&&!!q('.entry.open')&&/People I Trust/.test(how()),how().slice(0,120));
check('LastPass asks about emergency access',labels().includes('Is emergency access set up?'),labels().join(' | '));
click(all('.entry.open .pf .chip.add').find(b=>/Sam Morgan/.test(b.textContent)));await wait(30);
click(all('.entry.open .pf .chip.add').find(b=>/Mia Morgan/.test(b.textContent)));await wait(30);
click(q(`[data-b="r|pms|${lp.id}|access"][data-v=yes]`));await wait(30);
setv(q(`[data-b="r|pms|${lp.id}|account"]`),'my work email');
check('LastPass: own people and status',subOf('LastPass')==='emergency access set up · for Sam Morgan and Mia Morgan'&&lp.account==='my work email',subOf('LastPass'));
const op=await addPreset('1Password');
check('1Password: no emergency access, use the Emergency Kit',/1Password has no emergency access/.test(how())&&/Get Emergency Kit/.test(how())&&/family organiser/.test(how()),how().slice(0,140));
setv(q(`[data-b="r|pms|${op.id}|kit"]`),'Fireproof box in the study');
for(const n of ['Google Password Manager','Keeper','NordPass','Proton Pass','Dashlane','Passwords saved in my browser']){await addPreset(n);}
const g=pms().find(x=>x.what==='Google Password Manager');await act('open',{id:g.id});
check('Google: share with a family group, and Inactive Account Manager',/choose Share/.test(how())&&/myaccount\.google\.com\/inactive/.test(how()),how().slice(0,140));
await act('open',{id:pms().find(x=>x.what==='Proton Pass').id});
check('Proton: Settings › Recovery',/Settings › Recovery/.test(how())&&/Proton email address/.test(how()));
await act('open',{id:pms().find(x=>x.what==='Dashlane').id});
check('Dashlane: no emergency contacts any more',/Dashlane no longer has emergency contacts/.test(how()));
// Another one, typed.
click(all('.pmsec [data-act=add][data-reg=pms]').find(b=>/Add another/.test(b.textContent)));await wait(40);
const en=pms()[pms().length-1];setv(q(`[data-b="r|pms|${en.id}|what"]`),'Enpass');await act('open',{id:en.id});await act('open',{id:en.id});
check('another one gets general steps',/Look in its settings for Emergency access/.test(how()),how().slice(0,120));
check('all eleven stay in the plan',pms().length===11,pms().map(x=>x.what).join(', '));

// Strengthen names the ones not set up.
await act('go',{v:'strengthen'});
const sug=q('[data-act=sug][data-id=pmaccess]');
check('Strengthen lists the ones without a way in',!!sug&&/Apple Passwords/.test(document.body.textContent)&&!/Set up a way into[^\n]*LastPass/.test(document.body.innerText),sug?(document.body.innerText.match(/Set up a way into[^\n]*/)||[''])[0].slice(0,140):'no suggestion');

// Executor's list, family view and Ask the plan.
await act('go',{v:'outputs'});click(all('[data-act]').find(b=>/xecutor/.test(b.textContent)));await wait(60);
const ex=document.body.innerText;
check('executor: Bitwarden with who and how',/Bitwarden: Jo Morgan can get in\. Sign in to your own Bitwarden account/.test(ex)&&/Emergency kit or recovery code: Sealed envelope with the will/.test(ex),(ex.match(/Bitwarden:[^\n]*/)||[''])[0].slice(0,200));
check('executor: 1Password with where the kit is',/1Password: Sign in with the Emergency Kit\.[^\n]*Fireproof box in the study/.test(ex),(ex.match(/1Password:[^\n]*/)||[''])[0]);
await act('go',{v:'famview'});const die=q('[data-act=fvsit][data-v=die]');if(die){click(die);await wait(40);}
const fv=document.body.innerText;
check('family view: a job for each',/Get into Bitwarden/.test(fv)&&/Get into LastPass/.test(fv),(fv.match(/Get into[^\n]*/g)||[]).slice(0,4).join(' / '));
check('no [object Object]',!/object Object/.test(fv+ex));
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},400);
