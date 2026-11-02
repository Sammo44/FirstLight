// Guided writing: every open box asks short questions (that fit what's ticked nearby) and turns the answers into
// words, with starters, lines from the plan, an example, and the coach. Answers left behind are saved on leaving.
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const act=async(a,ds)=>{const b=document.createElement('button');b.dataset.act=a;Object.assign(b.dataset,ds||{});document.body.appendChild(b);click(b);b.remove();await wait(40);};
const P=()=>window.__amfy.plan(),A=k=>P().answers[k];
const go=(ch,stid)=>act('go',{v:'chapter',ch,stid});
const field=k=>all('.gfield').find(f=>f.querySelector(`[data-act=wmode][data-key="a|${k}"]`)||f.querySelector(`textarea[data-b="a|${k}"]`));
const qs=k=>{const f=field(k);return f?Array.from(f.querySelectorAll('.gsteps .field > label, .gsteps .field > .label')).map(l=>l.textContent.trim()):[];};
const stepIn=(k,i)=>{const f=field(k);return f?f.querySelectorAll('.gsteps input, .gsteps textarea')[i]:null;};
const mode=(k,v)=>act('wmode',{key:'a|'+k,v});
const pending=()=>Object.keys(P().answers).filter(k=>k.includes('~'));

click(q('[data-act=example]'));await wait(80);
for(let i=0;i<20&&!q('.gfield');i++)await wait(20);

// People who wouldn't otherwise know: questions for each group ticked.
await go('family','wouldnt');
check('an empty box starts with questions, not a blank box',!!field('family.wouldnt.list')&&!q('textarea[data-b="a|family.wouldnt.list"]')&&qs('family.wouldnt.list').length===3,qs('family.wouldnt.list').join(' / '));
click(q('[data-b="a|family.wouldnt.groups"][data-v=clubs]'));await wait(40);
click(q('[data-b="a|family.wouldnt.groups"][data-v=overseas]'));await wait(40);
const wq=qs('family.wouldnt.list');
check('the questions follow what’s ticked',wq.length===3&&/^Family or friends overseas/.test(wq[0])&&/^Clubs, teams or community groups/.test(wq[1])&&/^Anyone else/.test(wq[2]),wq.join(' / '));
check('each question has an example',/e\.g\./.test(stepIn('family.wouldnt.list',0).placeholder),stepIn('family.wouldnt.list',0).placeholder);
setv(stepIn('family.wouldnt.list',0),'the cousins in Glasgow, through Aunty Jean’s WhatsApp');
setv(stepIn('family.wouldnt.list',1),'Paddington Bowls Club; ring Pat.');
await act('gsteps',{b:'a|family.wouldnt.list'});
check('answers become words, one line each',A('family.wouldnt.list')==='Overseas: the cousins in Glasgow, through Aunty Jean’s WhatsApp.\nClubs and groups: Paddington Bowls Club; ring Pat.',JSON.stringify(A('family.wouldnt.list')));
check('then it shows what was written, with starters and the coach',!!q('textarea[data-b="a|family.wouldnt.list"]')&&!!field('family.wouldnt.list').querySelector('[data-act=gadd]')&&!!field('family.wouldnt.list').querySelector('.coachbox'));
check('the question answers are cleared',!pending().length,pending().join(', '));
await act('gadd',{b:'a|family.wouldnt.list',p:'Please tell',end:'sp'});
check('a starter is added on a new line, ready to finish',A('family.wouldnt.list').endsWith('\nPlease tell '),JSON.stringify(A('family.wouldnt.list').slice(-20)));

// Life story: one question at a time, then written up.
await go('personal','obituary');
const lf=field('personal.obituary.text');
check('life story: one question at a time, with progress',!!lf&&/0 of 8 answered/.test(lf.textContent)&&qs('personal.obituary.text').length===1&&/Where were you born/.test(qs('personal.obituary.text')[0]),lf&&lf.querySelector('.qnav')&&lf.querySelector('.qnav').textContent);
setv(stepIn('personal.obituary.text',0),'in Brisbane in 1971, raised by Mum and Nan');
await act('gqgo',{b:'a|personal.obituary.text',v:'1'});
check('next question',/A memory from growing up/.test(qs('personal.obituary.text')[0])&&/1 of 8 answered/.test(field('personal.obituary.text').textContent));
await act('gqgo',{b:'a|personal.obituary.text',v:'4'});
setv(stepIn('personal.obituary.text',0),'fishing at Tin Can Bay');
check('write it up with Claude is offered',!!q('[data-act=gai][data-b="a|personal.obituary.text"]'),(q('[data-act=gai]')||{}).textContent);
await act('gai',{b:'a|personal.obituary.text'});for(let i=0;i<40&&!filled2();i++)await wait(20);
function filled2(){return /Brisbane/.test(A('personal.obituary.text')||'');}
const gp=(window.__gprompts||[]).slice(-1)[0]||'';
check('Claude gets only the answers, and is told not to invent anything',/Q: Where were you born, and who raised you\?\nA: in Brisbane in 1971, raised by Mum and Nan/.test(gp)&&/Q: What you loved doing\nA: fishing at Tin Can Bay/.test(gp)&&/Don't invent names/.test(gp)&&!/Growing up/.test(gp.split('<<<')[1]||''),gp.slice(0,120));
check('the draft goes in the box',/^I was born in Brisbane in 1971/.test(A('personal.obituary.text')||''),JSON.stringify((A('personal.obituary.text')||'').slice(0,60)));
// Without Claude, the answers still become words.
await mode('personal.obituary.text','steps');
setv(stepIn('personal.obituary.text',0),'in Brisbane in 1971');
await act('gsteps',{b:'a|personal.obituary.text'});
check('without Claude, answers become sentences, added after what’s there',/\n\nI was born in Brisbane in 1971\.$/.test(A('personal.obituary.text')),JSON.stringify(A('personal.obituary.text').slice(-40)));

// Answers left behind are saved on leaving the page.
await go('personal','care');
setv(stepIn('personal.care.nonneg',0),'to be kept alive on machines with no hope of recovery');
await go('personal','away');
check('answers not turned into words are saved when you leave',A('personal.care.nonneg')==='I would never want to be kept alive on machines with no hope of recovery.'&&!pending().length,JSON.stringify(A('personal.care.nonneg')));

// How things work: a question for each thing ticked.
await go('home','systems');await mode('home.systems.how','steps');
const sq=qs('home.systems.how');
check('how things work: a question for each thing ticked',sq.length===4&&/^Turn off the water/.test(sq[0])&&/^Reset the switchboard/.test(sq[1])&&/^Solar or battery/.test(sq[2])&&/^Reset the internet/.test(sq[3]),sq.join(' / '));
// The year at a glance: lines from the bills.
await go('home','year');await mode('home.year.list','write');
const yl=all('.gfield [data-act=gadd][data-end=nl]').map(b=>b.dataset.p);
check('the year: renewals from the bills, ready to add',yl.includes('14 Mar: RACQ renews ($109).')&&yl.includes('1 Feb: Suncorp renews ($96).'),yl.join(' / '));
await act('gadd',{b:'a|home.year.list',p:'14 Mar: RACQ renews ($109).',end:'nl'});
check('a line from the plan is added, then no longer offered',A('home.year.list')==='14 Mar: RACQ renews ($109).'&&!all('.gfield [data-act=gadd]').some(b=>b.dataset.p==='14 Mar: RACQ renews ($109).'),JSON.stringify(A('home.year.list')));
// Routines: a question for each child in the plan.
await go('family','dependants');await mode('family.dependants.routines','steps');
const rq=qs('family.dependants.routines');
check('routines: a question for each child in the plan',/^Tom: routines/.test(rq[0])&&!rq.some(x=>/Mia/.test(x)),rq.join(' / '));
// Private: never sent to Claude.
await go('family','private');
check('private box: says so, and no write-up or follow-up offered',/never sent to Claude/.test(field('family.private.who').textContent)&&!field('family.private.who').querySelector('[data-act=gai]'));

// Notes on cards: lines from the plan.
await go('money','accounts');
const cba=P().reg.accounts.find(x=>x.inst==='Commonwealth Bank');await act('open',{id:cba.id});
const idea=all('.entry.open [data-act=gadd][data-end=nl]').map(b=>b.dataset.p);
check('account notes: bills paid from it, from the plan',idea.some(x=>/^Bills paid from here: Origin Energy, Telstra and Suncorp\.$/.test(x)),idea.join(' / '));
// The story behind an heirloom: questions, for a new one.
await go('personal','belongings');
click(all('[data-act=add][data-reg=belongings]').pop());await wait(40);
const bl=P().reg.belongings[P().reg.belongings.length-1],sb=`r|belongings|${bl.id}|story`;
const bin=all(`.entry.open [data-b^="${sb}~"]`);
check('a new heirloom asks where it came from and why it matters',bin.length===3,bin.length);
setv(bin[0],'Nan’s from Glasgow');setv(bin[1],'she wore it to every wedding');
await act('gsteps',{b:sb});
check('its story is written from the answers',bl.story==='Nan’s from Glasgow. It matters because she wore it to every wedding.',JSON.stringify(bl.story));

// Every open box on the step pages has a guide.
const missing=[];for(const ch of ['home','money','admin','family','personal']){await go(ch,'');const n=all('.topic').length;for(let i=0;i<n;i++){await act('go',{v:'chapter',ch,st:String(i)});all('#stepcard textarea, .stepcard textarea, #app textarea').forEach(t=>{const b=t.dataset.b||'';if(/^a\|[a-z]+\.[a-z]+\.[A-Za-z]+$/.test(b)&&!t.closest('.gfield'))missing.push(b);});}}
check('no plain open boxes left on the step pages',!missing.length,missing.join(', '));
check('no [object Object]',!/object Object/.test(document.body.innerText));
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},500);
