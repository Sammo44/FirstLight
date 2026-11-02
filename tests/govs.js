// Government services: one card per service, each with its own details, how to let someone deal with it for you,
// and what the family does later. They reach Strengthen, the executor's list, the family view and Ask the plan.
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const act=async(a,ds)=>{const b=document.createElement('button');b.dataset.act=a;Object.assign(b.dataset,ds||{});document.body.appendChild(b);click(b);b.remove();await wait(40);};
const S=()=>window.__amfy.plan(),govs=()=>S().reg.govs;
const subOf=t=>{const h=all('.entry-head').find(h=>h.querySelector('.entry-title').textContent===t);return h?h.querySelector('.entry-sub').textContent:'(missing)';};
const how=()=>all('.entry.open .howto').map(h=>h.textContent).join(' / ').replace(/\s+/g,' ');
const labels=()=>all('.entry.open .field > label, .entry.open .field > .label').map(l=>l.textContent.trim());
const presets=()=>all('[data-act=add][data-reg=govs]').map(b=>b.textContent.replace('+ ','').trim());
const addPreset=async n=>{click(all('[data-act=add][data-reg=govs]').find(b=>b.textContent.trim()==='+ '+n));await wait(40);return govs()[govs().length-1];};
const goGov=()=>act('go',{v:'chapter',ch:'admin',stid:'gov'});

click(q('[data-act=example]'));await wait(80);
await goGov();
check('the old tick list is gone',!/Which do you use\?/.test(document.body.textContent));
check('example has a card each for myGov, Medicare and the ATO',all('.entry-title').map(x=>x.textContent).join(', ')==='myGov, Medicare, ATO',all('.entry-title').map(x=>x.textContent).join(', '));
check('tip: one form tells Centrelink, Medicare and Child Support',/Advice of death form/.test(document.body.textContent));
check('quick-add only offers services not added yet',['Centrelink','My Aged Care','DVA','NDIS','Child Support'].every(n=>presets().includes(n))&&!presets().includes('Medicare')&&!presets().includes('myGov'),presets().join(', '));
check('Medicare header shows what, status and number',subOf('Medicare')==='Family card, with Jo, Mia and Tom on it · nobody set up to deal with it yet · number ends 4821',subOf('Medicare'));

// myGov is a sign-in only.
await act('open',{id:govs()[0].id});
check('myGov: nobody else may sign in, add each linked service',/How myGov works/.test(how())&&/Nobody else is allowed to sign in/.test(how())&&/Don’t sign in to their myGov/.test(how()),how().slice(0,140));
check('myGov asks which email, not who acts or a number',labels().includes('Which email it’s under')&&!labels().includes('Is someone set up to deal with them for you?')&&!labels().some(l=>/number/.test(l)),labels().join(' | '));
// Medicare: its own arrangement.
await act('open',{id:govs()[1].id});
check('Medicare: power of attorney, and a new card for the others',/How to let someone deal with Medicare for you/.test(how())&&/power of attorney/.test(how())&&/isn’t sent automatically/.test(how()),how().slice(0,160));
check('Medicare links to its own guide',!!q('.entry.open .howto a[href="https://www.servicesaustralia.gov.au/someone-to-act-for-you-with-medicare"][target=_blank]'));
check('Medicare asks for the last 4 of the number',labels().includes('Your number with them (last 4 only)'),labels().join(' | '));
// ATO: no tax file number, but the tax agent.
await act('open',{id:govs()[2].id});
check('ATO: never write the tax file number',/deal with the ATO for you/.test(how())&&/Never write your tax file number/.test(how())&&/date of death/.test(how()),how().slice(0,160));
check('ATO asks for the tax agent and has no number field',labels().includes('Your tax agent or accountant')&&!labels().some(l=>/number/.test(l)),labels().join(' | '));

// Add Centrelink and fill it in.
const cl=await addPreset('Centrelink');
check('Centrelink added and opened with its steps',cl.what==='Centrelink'&&/add a nominee/.test(how())&&/correspondence nominee/.test(how())&&/132 300/.test(how()),how().slice(0,160));
check('Centrelink is no longer offered',!presets().includes('Centrelink'),presets().join(', '));
setv(q(`[data-b="r|govs|${cl.id}|gets"]`),'Age Pension');
setv(q(`[data-b="r|govs|${cl.id}|ref"]`),'12345678');
click(q(`[data-b="r|govs|${cl.id}|act"][data-v=yes]`));await wait(40);
check('“Who?” shows once someone is set up',labels().includes('Who?'),labels().join(' | '));
click(all('.entry.open .pf .chip.add').find(b=>/Jo Morgan/.test(b.textContent)));await wait(40);
setv(q(`[data-b="r|govs|${cl.id}|where"]`),'Blue folder in the study');
check('only the last 4 digits are kept',cl.ref==='1234',cl.ref);
await act('open',{id:''});
check('Centrelink header',subOf('Centrelink')==='Age Pension · dealt with by Jo Morgan · number ends 1234',subOf('Centrelink'));
const dva=await addPreset('DVA');
check('DVA: 1800 VETERAN',/1800 838 372/.test(how()));
// Another service, typed.
click(all('[data-act=add][data-reg=govs]').find(b=>/Add another/.test(b.textContent)));await wait(40);
const sc=govs()[govs().length-1];setv(q(`[data-b="r|govs|${sc.id}|what"]`),'Seniors Card');await act('open',{id:sc.id});await act('open',{id:sc.id});
check('another service gets general steps',/nominee, an agent or an authorised person/.test(how()),how().slice(0,120));
check('all six stay in the plan',govs().length===6,govs().map(x=>x.what).join(', '));

// Strengthen: the ones that pay, with nobody set up.
await act('go',{v:'strengthen'});
const line=(document.body.innerText.match(/Let someone deal with[^\n]*/)||[''])[0];
check('Strengthen names DVA, not Centrelink',/DVA/.test(line)&&!/Centrelink/.test(line),line);

// Executor's list, family view and Ask the plan.
await act('go',{v:'outputs'});click(all('[data-act]').find(b=>/xecutor/.test(b.textContent)));await wait(60);
const ex=document.body.innerText;
check('executor: Centrelink with what to do, number and where',/Centrelink: Tell Services Australia within 28 days[^\n]*Their number ends in 1234\. Cards and letters: Blue folder in the study\./.test(ex),(ex.match(/Centrelink:[^\n]*/)||[''])[0].slice(0,220));
check('executor: Medicare',/Medicare: The Advice of death form/.test(ex));
await act('go',{v:'famview'});click(q('[data-act=fvsit][data-v=die]'));await wait(40);
const fv=document.body.innerText;
check('family view: a job for each',/Tell Centrelink/.test(fv)&&/Leave their myGov account alone/.test(fv)&&/Tell DVA/.test(fv),(fv.match(/Tell (Centrelink|DVA)[^\n]*/g)||[]).join(' / '));
click(q('[data-act=fvsit][data-v=unwell]'));await wait(40);
check('in hospital: Jo deals with Centrelink',/Deal with Centrelink for/.test(document.body.innerText),(document.body.innerText.match(/Deal with[^\n]*/)||['none'])[0]);
check('no [object Object]',!/object Object/.test(fv+ex+document.body.innerText));

// New Zealand has its own services.
S().settings.country='NZ';await goGov();
check('NZ: its own services',['RealMe','Inland Revenue (myIR)','MSD / Work and Income','ACC','Kāinga Ora'].every(n=>presets().includes(n)),presets().join(', '));
await addPreset('MSD / Work and Income');
check('NZ: Work and Income agent form',/Appointment of an agent/.test(how())&&/0800 552 002/.test(how()),how().slice(0,140));
await addPreset('Inland Revenue (myIR)');
check('NZ: Inland Revenue nominated person',/Add a nominated person/.test(how())&&/Never write your IRD number/.test(how()));
S().settings.country='AU';
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},400);
