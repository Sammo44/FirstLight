window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
click(q('[data-act=example]'));await wait(60);
r.push('ways='+all('.way strong').map(x=>x.textContent).join(' | '));
click(all('.way').find(b=>/Walk/.test(b.textContent)));await wait(40);
r.push('stop1: '+q('.walk .eyebrow').textContent+' / '+q('.walkwhere').textContent+' | prefill='+q('#walk_note').value);
// photo: make a small PNG blob via canvas
const cv=document.createElement('canvas');cv.width=40;cv.height=30;cv.getContext('2d').fillRect(0,0,20,20);const blob=await new Promise(res=>cv.toBlob(res,'image/png'));
const inp=q('#walk_photo');const dt=new DataTransfer();dt.items.add(new File([blob],'p.png',{type:'image/png'}));inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));
for(let i=0;i<40&&!q('.walkphoto img');i++)await wait(50);await wait(200);
r.push('photo shown='+!!q('.walkphoto img')+' src='+((q('.walkphoto img')||{}).src||'').slice(0,5)+' hidden='+(q('.walkphoto img')||{}).hidden);
setv(q('#walk_note'),'Under the frog by the back door');click(q('[data-act=walksave]'));await wait(40);
r.push('stop2: '+q('.walk .eyebrow').textContent);click(all('[data-act=walkgo]').pop());await wait(30);
r.push('stop3: '+q('.walk .eyebrow').textContent);setv(q('#walk_note'),'Under the round cover by the letterbox. Turn clockwise.');click(q('[data-act=walksave]'));await wait(30);
setv(q('#walk_note'),'Garage, left of the roller door.');click(q('[data-act=walksave]'));await wait(30);
for(let i=0;i<10&&q('[data-act=walksave]');i++){click(q('[data-act=walksave]'));await wait(20);}
r.push('guide: '+q('main h1').textContent+' | items='+all('.gitem strong').map(x=>x.textContent).join(', ')+' | imgs='+all('.gitem img').length);
const P=JSON.parse(localStorage.getItem('amfy-plan-v2')||'{}');await wait(1000);const P2=JSON.parse(localStorage.getItem('amfy-plan-v2')||'{}');
r.push('spare='+P2.answers['home.access.spare']+' | how='+JSON.stringify(P2.answers['home.systems.how'])+' | list='+P2.answers['home.systems.list']);
// family view house section
click(q('[data-act=go][data-v=famview]'));await wait(40);r.push('famview house section='+!!q('[data-keep=fvhouse]'));
// Sunday mode
const b=document.createElement('button');b.dataset.act='go';b.dataset.v='sunday';document.body.appendChild(b);click(b);b.remove();await wait(30);
r.push('sunday: '+q('main h1').textContent+' | start disabled='+q('[data-act=sunstart]').disabled+' | first='+(q('.sundayset .small.muted')||{}).textContent);
click(q('#sun_ok'));await wait(20);r.push('after consent disabled='+q('[data-act=sunstart]').disabled);
click(q('[data-act=sunstart]'));await wait(40);
r.push('q1: '+q('.sunbar .small').textContent+' | '+q('.thread .eyebrow').textContent+' | ask='+q('.thread .ask').textContent.slice(0,50)+' | readout='+!!q('[data-act=speak]'));
// skip to a story
let g=0;while(!/story/i.test(q('.thread .eyebrow').textContent)&&g<6){click(q('[data-act=sunnext]'));await wait(30);g++;}
r.push('story: '+q('.thread .ask').textContent+' | joggers='+all('.joggers li').length+' | photo btn='+!!q('#cap_photo'));
setv(q('#cap_text'),'The Christmas Uncle Pete set the pudding on fire.');click(q('[data-act=capsend]'));await wait(40);
r.push('saved: '+all('.reply').map(x=>x.textContent).join(' | '));
click(q('[data-act=sunend]'));await wait(40);r.push('done: '+q('main h1').textContent+' | '+all('.sundayset .calm-list li').map(x=>x.textContent).join(', '));
document.body.setAttribute('data-r',r.join('\n'));}catch(e){document.body.setAttribute('data-r',r.join('\n')+'\nERR '+e.message+' '+e.stack)}},400);
