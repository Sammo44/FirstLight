// The letter interview: questions worded for the relationship, a stage at a time, questions from the plan (an heirloom
// being left to them, a job they've been given), and a letter put together from the answers, with or without Claude.
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const act=async(a,ds)=>{const b=document.createElement('button');b.dataset.act=a;Object.assign(b.dataset,ds||{});document.body.appendChild(b);click(b);b.remove();await wait(40);};
const P=()=>window.__amfy.plan();
const title=()=>((q('.guide .qtitle')||{}).textContent||'').trim();
const titles=()=>all('.guide .qdot').map(d=>d.title);
const jump=async re=>{const i=titles().findIndex(t=>re.test(t));await act('livgo',{id:lt.id,v:String(i)});return i;};
const ans=()=>q('#liv_'+lt.id);

click(q('[data-act=example]'));await wait(80);
await act('go',{v:'words'});
const lt=P().reg.letters.find(x=>x.rel==='young');await act('open',{id:lt.id});
check('a letter starts with “Talk me through it”',!!q('[data-act=lgmode][data-v=talk].on'));
check('the first question uses their name',title()==='What do you call Tom? A nickname, if there is one',title());
check('progress shows the stage',/The two of you · stage 1 of 3 · 0 of \d+ answered/.test((q('.guide .qnav')||{}).textContent||''),(q('.guide .qnav')||{}).textContent);
setv(ans(),'Tommy');
await act('livgo',{id:lt.id,v:'1'});
check('how things are between you, as choices',title()==='How would you describe the two of you right now?'&&all('[data-act=livpick]').length===5,title());
click(all('[data-act=livpick]').find(b=>b.dataset.v==='close'));await wait(40);
check('a choice moves to the next question',title()==='How do you usually show Tom you love them?'&&lt.iv_now==='close',title());
check('for a child: how old they’ll be when they read it',titles().some(t=>/How old will Tom be when they read this\?/.test(t)));
check('what they’ll find hardest',titles().some(t=>/What do you think Tom will find hardest/.test(t)));
check('stories worded for a young child',titles().some(t=>/The day Tom came into your life/.test(t))&&titles().some(t=>/What you most want Tom never to doubt/.test(t)));
check('from the plan: the heirloom being left to them',titles().some(t=>/You’re leaving Grandad’s watch to Tom\. Why do you want them to have it\?/.test(t)),titles().filter(t=>/leaving/.test(t)).join(''));
await jump(/always makes you smile/);
check('example to help',/e\.g\. how you narrate/.test(ans().placeholder));
setv(ans(),'how you narrate everything to the dog');
check('the coach helps go deeper',/moment|detail|start/i.test((q('#co_liv_'+lt.id)||{}).textContent||''),(q('#co_liv_'+lt.id)||{}).textContent);
await jump(/leaving Grandad’s watch/);setv(ans(),'it was Grandad’s, and he wore it every day');
await jump(/^How old will Tom be/);setv(ans(),'18');
await jump(/^How should the letter feel/);click(all('[data-act=livpick]').find(b=>b.dataset.v==='light'));await wait(40);
await jump(/^The last thing/);setv(ans(),'you made every day better');
await jump(/^How would you like to sign it/);setv(ans(),'All my love, Dad');
check('answers are kept with the letter',lt.iv_call==='Tommy'&&lt.iv_smile==='how you narrate everything to the dog'&&lt.iv_tone==='light');
await jump(/^What you already see in Tom/);setv(ans(),'Tom sticks up for kids who get left out');
// Put together without Claude: composed, not stitched.
await act('ldeep',{id:lt.id});
const pv=((q('.lpreview blockquote')||{}).innerText||'').trim();
check('without Claude: an opening that fits the occasion and the tone',/^Dear Tommy,\n\nI asked for this letter to reach you on your 18th birthday\. Happy birthday\. I’ve never been much good at the soppy stuff, so bear with me\./.test(pv),JSON.stringify(pv.slice(0,200)));
check('answers woven into sentences, said to them',/Something you do always makes me smile: how you narrate everything to the dog\. Even now, I can see it in you: you stick up for kids who get left out\./.test(pv),JSON.stringify(pv.slice(0,400)));
check('a closing, and their sign-off',/And the last thing, the one I most want you to keep: you made every day better\.\n\nAll my love,\nDad$/.test(pv),JSON.stringify(pv.slice(-120)));
check('no stitched “question. answer.” pairs',!/There’s something you do that always makes me smile\. How/.test(pv));
check('only context, not answers like the age, goes in as text',!/about 18/.test(pv));
check('nothing changes until you choose',!lt.body);
await act('lprevuse',{id:lt.id,v:'replace'});
check('use it as the letter',/^Dear Tommy,/.test(lt.body||'')&&!q('.lpreview'));
// Before writing, Claude asks a few more questions from what's been said.
check('offer of a few more questions',!!q('[data-act=lmoreq]'));
await act('lmoreq',{id:lt.id});for(let i=0;i<40&&!(lt.ivx||[]).length;i++)await wait(20);await wait(40);
check('the follow-up questions join the interview',(lt.ivx||[]).length===2&&title()==='What does the dog do while Tom narrates?'&&/A few more questions · stage 4 of 4/.test((q('.guide .qnav')||{}).textContent||''),title()+' | '+((q('.guide .qnav')||{}).textContent||'').slice(0,60));
setv(ans(),'he just tilts his head, like he’s taking notes');
// Written by Claude.
await act('ldeepai',{id:lt.id,v:'new'});for(let i=0;i<40&&!q('.lpreview');i++)await wait(20);
const gp=(window.__gprompts||[]).slice(-1)[0]||'';
check('Claude gets the relationship, the context and all the answers',/The letter is to their child, still young, Tom Morgan, whom they call "Tommy"/.test(gp)&&/about 18 when they read it/.test(gp)&&/right now as: close/.test(gp)&&/The feeling they want: light, with some laughs/.test(gp)&&/Q: You’re leaving Grandad’s watch to Tom/.test(gp)&&/Q: What does the dog do while Tom narrates\?\nA: he just tilts his head/.test(gp),gp.slice(0,300));
check('and is asked to write, not stitch: thread, tense, creativity',/Don't follow the order of the notes/.test(gp)&&/Fix the tense, the person and the grammar/.test(gp)&&/Be creative with the writing/.test(gp)&&/Let their humour come through/.test(gp));
check('while staying true, and careful for the relationship',/don't invent events, people, places, dates or promises/.test(gp)&&/Be careful with this: Don’t give them jobs/.test(gp)&&/end with their sign-off, "All my love, Dad"/.test(gp));
check('a letter worth keeping gets the most careful writing',(window.__gopts||{}).modelTier==='complex');
check('the letter is shown first, with ways to try again',/Your letter, written from your answers/.test((q('.lpreview')||{}).textContent||'')&&!!q('[data-act=lprevuse][data-v=add]')&&all('.lpreview [data-act=ldeepai]').map(b=>b.textContent).join('/')==='Another version/Shorter/Longer/Warmer/Lighter, with more humour/Simpler words');
await act('ldeepai',{id:lt.id,v:'shorter'});for(let i=0;i<40&&(window.__gprompts||[]).length<3;i++)await wait(20);
const gp2=(window.__gprompts||[]).slice(-1)[0]||'';
check('“Shorter” rewrites the draft on screen',/Here is the draft you wrote before/.test(gp2)&&/Dear Tommy,\n\nYou narrate everything to the dog/.test(gp2)&&/Make it about half as long/.test(gp2),gp2.slice(-200));
const before=lt.body;await act('lprevuse',{id:lt.id,v:'replace'});
check('use it instead, keeping what was there',/^Dear Tommy,\n\nYou narrate everything/.test(lt.body)&&lt.versions[0].text===before);
check('a way back, right there',!!q('.guide [data-act=lrestore][data-i="0"]')&&/Earlier versions \(1\)/.test((q('details[data-keep="lver:'+lt.id+'"] summary')||{}).textContent||''));
const claudeDraft=lt.body;await act('lrestore',{id:lt.id,i:'0'});
check('the earlier version can be brought back, and the other is kept',lt.body===before&&lt.versions[0].text===claudeDraft);
// A partner, with jobs in the plan.
click(all('[data-act=newletter]').find(b=>/Jo Morgan/.test(b.textContent)));await wait(50);
const jo=P().reg.letters[P().reg.letters.length-1];
check('a partner gets partner questions',jo.rel==='partner'&&titles().some(t=>/How you met, and what you first noticed about Jo/.test(t))&&titles().some(t=>/A moment with Jo you’d live again/.test(t)),jo.rel);
const jt=titles().filter(t=>/jobs?:/.test(t));
check('and one question about the jobs they have in the plan',jt.length===1&&/You’ve asked Jo to take on some big jobs: looking after everything as my executor, managing my money if I can’t, making medical decisions if I can’t and organising my funeral\./.test(jt[0]),jt.join(' / '));
// Someone you've drifted from: gentler, no "how do you show love".
click(all('[data-act=pick]').find(b=>b.dataset.b===`r|letters|${jo.id}|rel`&&b.dataset.v==='drifted'));await wait(40);
check('drifted: your part, what you wish, no reply needed',titles().some(t=>/Your own part in what went wrong/.test(t))&&titles().some(t=>/free Jo from having to reply/.test(t))&&!titles().some(t=>/show Jo you love them/.test(t)),titles().join(' / ').slice(0,200));
check('no [object Object]',!/object Object/.test(document.body.innerText));
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},500);
