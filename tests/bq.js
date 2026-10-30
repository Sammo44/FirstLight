window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const goBills=()=>{const b=document.createElement('button');b.dataset.act='go';b.dataset.v='chapter';b.dataset.ch='admin';b.dataset.stid='bills';document.body.appendChild(b);click(b);b.remove();};
// fresh plan with people
click(q('[data-act=start]'));await wait(30);for(let i=0;i<12&&!q('[data-act=scanfinish]');i++){click(q('[data-act=scannext]'));await wait(15);}click(all('[data-act=scanfinish]').find(b=>!b.dataset.ess));await wait(50);
goBills();await wait(40);
r.push('empty: '+(q('.bq-hero h3')||{}).textContent+' | btns='+all('.bq-hero .btn, .bq-hero label').map(b=>b.textContent).join(','));
const inp=q('#csv_in');const dt=new DataTransfer();window.__files.forEach(f=>dt.items.add(new File([f.text],f.name,{type:'text/csv'})));inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));
for(let i=0;i<200&&!q('.bqcard');i++)await wait(50);
r.push('intro: '+(q('.bq-intro')||{innerText:'none'}).innerText.replace(/\n+/g,' / '));
const card=()=>{const c=q('.bqcard');return c?c.innerText.replace(/\n+/g,' / ').slice(0,160):'none';};
r.push('card1: '+card()+' | top='+(q('.bq-top .small')||{}).textContent);
r.push('acts='+all('.bqacts .btn').map(b=>b.textContent).join(',')+' | chips='+all('[data-act=swipeset].chip').map(b=>b.textContent).join(','));
click(all('[data-act=swipeset]').find(b=>b.dataset.v==='Cancel'));await wait(30);r.push('card2: '+card());
click(all('[data-act=swipeset]').find(b=>b.dataset.v==='Keep'));await wait(30);
click(q('[data-act=swipeback]'));await wait(30);r.push('back to: '+card().slice(0,40));
click(q('[data-act=swipeskip]'));await wait(30);
// find an untyped one
let guard=0;while(q('.bqcard')&&!q('.bqfile')&&guard<40){click(all('[data-act=swipeset]').find(b=>b.dataset.v==='Decide'));await wait(20);guard++;}
r.push('untyped card: '+card()+' | has picker='+!!q('.bqfile select'));
if(q('.bqfile')){click(q('[data-act=swipenot]'));await wait(30);r.push('after not-a-bill: '+card().slice(0,40));}
click(q('[data-act=swipestop]'));await wait(30);
r.push('home: '+(q('.bq-hero')||{innerText:'none'}).innerText.replace(/\n+/g,' / '));
r.push('groups: '+all('.bqgroups summary').map(s=>s.textContent).join(', '));
click(q('[data-act=swipestart]'));await wait(30);let n=0;while(q('.bqcard')&&n<60){click(all('[data-act=swipeset]').find(b=>b.dataset.v==='Keep'));await wait(10);n++;}
r.push('done screen: '+(q('.bq-hero.done')||{innerText:'none'}).innerText.replace(/\n+/g,' / '));
click(q('[data-act=bmode][data-v=fine]'));await wait(30);r.push('fine: steps='+all('.flowsteps button').length+' back='+!!q('[data-act=bmode][data-v=quick]'));
const P=JSON.parse(localStorage.getItem('amfy-plan-v2')||'null');r.push('saved bills='+(P?P.reg.costs.length:'?')+' undecided='+(P?P.reg.costs.filter(x=>!x.outcome).length:'?')+' notBills='+(P?(P.notBills||[]).length:'?'));
document.body.setAttribute('data-r',r.join('\n'));}catch(e){document.body.setAttribute('data-r',r.join('\n')+'\nERR '+e.message+' '+e.stack)}},400);
