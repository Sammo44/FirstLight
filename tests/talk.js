window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(r=>setTimeout(r,ms));const r=[];window.__r=r;
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const plan=()=>JSON.parse(localStorage.getItem('amfy-plan-v2'));
// fresh plan: start, finish scan
click(q('[data-act=start]'));await wait(30);setv(q('input[data-b="set|name"]')||document.createElement('input'),'Alex');for(let i=0;i<12&&!q('[data-act=scanfinish]');i++){click(q('[data-act=scannext]'));await wait(20);}r.push('finish btns='+all('[data-act=scanfinish]').map(b=>b.textContent+(b.dataset.ess?'(ess)':'')).join(','));click(all('[data-act=scanfinish]').find(b=>!b.dataset.ess));await wait(80);
r.push('view after scan: h1='+(q('main h1')||{}).textContent+' | places='+all('.places button').map(b=>b.textContent+(b.classList.contains('on')?'*':'')).join(','));
r.push('next='+(q('.nextstep h2')||{}).textContent);
r.push('readiness head='+(q('.readiness h2')||{}).textContent+' | no items='+all('.out.no').length);
// Answer now -> people topic (mock returns nothing for people) -> type text
click(q('.nextstep [data-act=talk]'));await wait(50);r.push('talk ask='+(q('.thread .ask')||{}).textContent);
// jump straight to meds via Today readiness
click(q('[data-act=go][data-v=today]'));await wait(30);
click(all('.out.no').find(b=>/medications/.test(b.textContent)));await wait(50);
setv(q('#cap_text'),'atorvastatin 20 at night, ramipril 5 morning, allergic to penicillin, GP Helen Lee. card 4111 1111 1111 1111');
click(q('[data-act=capsend]'));await wait(150);
r.push('masked in prompt='+!/4111 1111 1111 1111/.test(window.__prompts[0])+' | heard rows='+all('.heard .hf').length+' | '+all('.heard .hf').map(x=>x.textContent.replace(/Ãƒâ€”/,'').trim()).join(' / '));
// drop one, fix one
click(all('.heard [data-act=capdrop]')[1]);await wait(20);
click(q('[data-act=capedit]'));await wait(20);const inp=q('.heard input[data-capf]');setv(inp,'Atorvastatin 40mg at night');
click(q('[data-act=capsave]'));await wait(1300);
let P=plan();r.push('saved meds='+JSON.stringify(P.answers['personal.health.meds'])+' allergies='+P.answers['personal.health.allergies']+' gp='+P.answers['personal.health.gp']);
r.push('reply='+all('.reply').map(x=>x.textContent).join(' | '));
r.push('next btn='+(q('[data-act=talknext]')||{}).textContent);
// who to call
click(q('[data-act=talknext]'));await wait(50);r.push('next ask='+(q('.thread .ask')||{}).textContent);
if(!/called first/.test(q('.thread .ask').textContent)){click(q('[data-act=go][data-v=today]'));await wait(20);click(all('.out.no').find(b=>/call first/.test(b.textContent)));await wait(50);}
setv(q('#cap_text'),'Jo first, then my brother Sam');click(q('[data-act=capsend]'));await wait(150);click(q('[data-act=capsave]'));await wait(1300);
P=plan();r.push('people='+P.reg.people.map(p=>p.name+'['+p.roles.join(',')+']').join('; '));
// tell me anything from Today
click(q('[data-act=go][data-v=today]'));await wait(40);setv(q('#home_text'),'the spare key is under the frog');click(q('[data-act=homesend]'));await wait(150);
r.push('anything heard='+all('.heard .hf').map(x=>x.textContent.replace(/Ãƒâ€”/,'').trim()).join(' / '));click(q('[data-act=capsave]'));await wait(1300);
P=plan();r.push('spare='+P.answers['home.access.spare']);
click(q('[data-act=go][data-v=today]'));await wait(40);r.push('today ready='+(q('.lampcount')||{}).textContent.trim()+' | yes='+all('.out.yes').map(x=>x.textContent.trim()).join(', '));
// snooze next
const nx=(q('.nextstep h2')||{}).textContent;click(q('[data-act=snooze]'));await wait(30);r.push('snoozed: '+nx.slice(0,30)+' -> '+(q('.nextstep h2')||{}).textContent.slice(0,40));
// Aa popover + theme
click(q('[data-act=pop][data-v=aa]'));await wait(20);click(all('.pop [data-act=pick]').find(b=>b.dataset.v==='large'));await wait(20);r.push('size attr='+document.documentElement.dataset.size+' theme='+document.documentElement.dataset.theme+' pop still open='+!!q('.pop'));
click(document.querySelector('main h1'));await wait(20);r.push('pop closed='+!q('.pop'));
// family tab and my plan
click(q('.places [data-v=family]'));await wait(30);r.push('family h1='+q('main h1').textContent+' rows='+all('.famrow').length);
click(q('.famrow[data-v=outputs]'));await wait(30);r.push('outputs crumb='+(q('.crumb')||{}).textContent+' place on='+(q('.places .on')||{}).textContent);
click(q('.places [data-v=overview]'));await wait(30);r.push('plan h1='+q('main h1').textContent+' areas='+all('.chap').length);
document.body.setAttribute('data-r',r.join('\n'));}catch(e){document.body.setAttribute('data-r',(window.__r||[]).join('\n')+'\nERR '+e.message+' | main='+(document.querySelector('main')||document.body).innerText.slice(0,600))}},500);
