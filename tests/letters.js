window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(r=>setTimeout(r,ms));const r=[];
click(q('[data-act=example]'));await wait(50);(()=>{const b=document.createElement('button');b.dataset.act='go';b.dataset.v='words';document.body.appendChild(b);click(b);b.remove();})();await wait(50);
r.push('tips open='+(q('details[data-keep=letterTips]')||{}).open);
const entries=all('.entry-head');r.push('letters='+entries.length);click(entries[1]);await wait(50); // Tom
r.push('eyebrow='+(q('.guide .eyebrow')||{}).textContent);
r.push('rel chips='+all('[data-b$="|rel"], .chips button').filter(b=>/Grown-up child|drifted/.test(b.textContent)).length);
click(q('[data-act=lgmode][data-v=quick]'));await wait(40);
const qs=all('.guide textarea');r.push('quick qs='+qs.length);
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
setv(qs[0],'how you narrate everything to the dog');setv(qs[2],'it is fine to be sad and still be okay');await wait(20);
click(q('[data-act=ldraft]'));await wait(50);r.push('BODY1:\n'+q('textarea.letter').value);
r.push('mode now parts='+!!q('.gpart'));click(all('[data-act=lpart]')[2]);await wait(50);r.push('BODY2 tail:'+JSON.stringify(q('textarea.letter').value.slice(-60)));
r.push('ticks='+all('.gpart strong').filter(s=>s.textContent.startsWith('✓')).length);
// occasions
r.push('occ chips='+all('[data-act=locc]').map(b=>b.textContent).join('/'));
click(all('[data-act=locc]')[3]);await wait(30);r.push('occasion set='+(all('input').find(i=>/\|occasion$/.test(i.dataset.b||''))||{}).value);
// new letter to Sam (brother)
click(all('[data-act=newletter]').find(b=>/Sam/.test(b.textContent)));await wait(50);r.push('Sam eyebrow='+(q('.guide .eyebrow')||{}).textContent);
click(q('[data-act=lgmode][data-v=parts]'));await wait(30);click(all('[data-act=lpart]')[0]);await wait(30);r.push('Sam body='+JSON.stringify(q('textarea.letter').value));
// blank letter, no rel
click(all('[data-act=newletter]').find(b=>!b.dataset.pid));await wait(50);r.push('no rel note='+!!(q('.entry.open .note')));
document.body.setAttribute('data-r',r.join('\n'));}catch(e){document.body.setAttribute('data-r','ERR '+e.message+' '+e.stack)}},300);
