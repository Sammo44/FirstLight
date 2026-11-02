// The vault: a list of closed items that open one at a time (closing one hides its secrets again), and ideas for what
// to put in it. Uses the real encryption, with a made-up passphrase and made-up items.
window.addEventListener('error',e=>document.body.setAttribute('data-err',(document.body.getAttribute('data-err')||'')+e.message+' @'+e.lineno+'; '));
setTimeout(async()=>{const r=[];const errs=[];try{const q=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),click=e=>e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true})),wait=ms=>new Promise(res=>setTimeout(res,ms));
const setv=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
const check=(name,ok,detail)=>{r.push((ok?'ok   ':'FAIL ')+name+(detail?' | '+detail:''));if(!ok)errs.push(name);};
const act=async(a,ds)=>{const b=document.createElement('button');b.dataset.act=a;Object.assign(b.dataset,ds||{});document.body.appendChild(b);click(b);b.remove();await wait(40);};
// Encryption takes real time, so wait on real work, not just timers.
const until=async(fn,n=400)=>{for(let i=0;i<n&&!fn();i++){await crypto.subtle.digest('SHA-256',new Uint8Array(1<<18));await wait(20);}return fn();};
const txt=s=>((q(s)||{}).textContent||'').trim();
const heads=()=>all('.vault .entry').map(e=>[txt.call(null,'x'),e.querySelector('.entry-title').textContent,e.querySelector('.entry-sub').textContent,e.querySelector('.tag').textContent].slice(1).join('|'));
const openN=()=>all('.vault .entry.open').length;
const openId=()=>(q('.vault .entry.open [data-act=vopen]')||{dataset:{}}).dataset.id;
const vb=(id,k)=>q(`[data-vb="${id}|${k}"]`);
const idea=n=>all('.vault [data-act=vadd]').find(b=>b.textContent.trim()==='+ '+n);
const pass='harbour pencil mango rocket';

click(q('[data-act=example]'));await wait(80);
await act('go',{v:'chapter',ch:'admin',stid:'vault'});
await act('vack');q('#vp1').value=pass;q('#vp2').value=pass;await act('vcreate');
check('vault created and unlocked',await until(()=>/Your vault/.test(txt('.vault h3'))),txt('.vault h3'));

// Ideas for what to put in it.
const start=all('.videas > .chips')[0];
check('start with the ones that unlock everything else',!!start&&['Phone passcode','Main email','Password manager master password','Computer password'].every(n=>start.textContent.includes(n)),start&&start.textContent);
const sums=all('.videas details summary').map(s=>s.textContent.replace(/\s*\(\d+\)/,'').trim());
check('ideas in groups',sums.join(', ')==='Logins, Cards, Codes and PINs, ID numbers, Private notes',sums.join(', '));
check('the groups start closed',!q('.videas details[open]'));
check('ID numbers to add',['Tax file number','Medicare card','Centrelink CRN','Passport','Driver licence'].every(n=>!!idea(n)));
check('logins to add',['Online banking','Apple ID','Google account','myGov','Super fund','PayPal'].every(n=>!!idea(n)));
check('says what never goes in',/Never put in here: the vault’s own passphrase, a card’s 3-digit security code, or a crypto recovery phrase/.test(txt('.videas')));
check('anything else can still be added',['Card','Login','Code or PIN','ID number','Private note'].every(n=>!!idea(n)));

// Add a card: it opens, with its number showing while you type it in.
click(idea('Credit card'));await wait(40);
const card=openId();
check('a new item opens',openN()===1&&txt('.vault .entry.open .entry-title')==='Credit card');
check('its number shows while it’s new',vb(card,'number').type==='text'&&/Hide the card number/.test(txt('.vault .entry.open [data-act=vshow]')),txt('.vault .entry.open [data-act=vshow]'));
setv(vb(card,'bank'),'Example Bank');setv(vb(card,'number'),'4111 1111 1111 1234');setv(vb(card,'expiry'),'08/29');
check('an idea that’s been added is no longer offered',!idea('Credit card'));
// Add a login: the card closes.
click(idea('Main email'));await wait(40);
const em=openId();
check('only one item is open at a time',openN()===1&&em!==card&&txt('.vault .entry.open .entry-title')==='Main email');
setv(vb(em,'username'),'alex@example.com');setv(vb(em,'password'),'made-up-pass-123');
await act('vopen',{id:''});
check('Done closes it',openN()===0);
check('closed items show what they are, nothing secret',heads().join(' / ')==='Credit card|Example Bank · ends 1234 · expires 08/29|Card / Main email|alex@example.com|Login',heads().join(' / '));
check('secrets aren’t on the page while closed',!document.body.innerHTML.includes('4111')&&!document.body.innerHTML.includes('made-up-pass-123'));
// Open it again: the number is hidden until asked for.
click(all('.vault .entry-head').find(h=>/Credit card/.test(h.textContent)));await wait(40);
check('opening it again keeps the number hidden',openN()===1&&vb(card,'number').type==='password'&&/Show the card number/.test(txt('.vault .entry.open [data-act=vshow]')));
await act('vshow',{id:card});
check('Show the card number shows it',vb(card,'number').type==='text');
click(q('.vault .entry.open .entry-head'));await wait(40);
check('tapping the open item closes it',openN()===0);
click(all('.vault .entry-head').find(h=>/Credit card/.test(h.textContent)));await wait(40);
check('closing it hid the number again',vb(card,'number').type==='password');
// An ID number.
click(idea('Tax file number'));await wait(40);
const tfn=openId();
check('ID number: its own kind',!!vb(tfn,'number')&&/The full number goes here/.test(txt('.vault .entry.open .help'))&&txt('.vault .entry.open .tag')==='ID number',txt('.vault .entry.open .tag'));
setv(vb(tfn,'number'),'123 456 782');
// Lock and unlock: back to a closed list.
await act('vlock');
check('locking straight after typing still counts every item',await until(()=>txt('.vault h3')==='3 items in the vault'),txt('.vault h3'));
check('and saves the count',window.__amfy.plan().vault.count===3,window.__amfy.plan().vault.count);
q('#vpu').value=pass;await act('vunlock');
check('unlocked again',await until(()=>/Your vault/.test(txt('.vault h3'))));
check('after unlocking, every item is closed',all('.vault .entry').length===3&&openN()===0,all('.vault .entry').length+' items, '+openN()+' open');
check('the list says how many, and how to open one',/3 items\. Tap one to open it\./.test(txt('.vault')));
check('what was typed was kept',heads()[0]==='Credit card|Example Bank · ends 1234 · expires 08/29|Card',heads()[0]);
// Delete one.
click(all('.vault .entry-head').find(h=>/Main email/.test(h.textContent)));await wait(40);
await act('vdel',{id:em});await act('vdelyes',{id:em});
check('deleting closes it and removes it',all('.vault .entry').length===2&&openN()===0&&!heads().some(h=>/Main email/.test(h)));
check('the deleted idea is offered again',!!idea('Main email'));

// Important documents: anything with a digital copy can keep its login in the vault.
const P=()=>window.__amfy.plan(),will=()=>P().reg.docs.find(x=>x.type==='Will');
check('documents with a digital copy are listed',/Important documents/.test(txt('.vdocs'))&&/Will/.test(txt('.vdocs'))&&/Scanned copy in Google Drive/.test(txt('.vdocs'))&&/\+ Add its login/.test(txt('.vdocs')),txt('.vdocs').slice(0,200));
click(all('.vdocs [data-act=vdoc]')[0]);await wait(40);
const wl=openId();
check('adding a document’s login opens it, filled in',openN()===1&&txt('.vault .entry.open .entry-title')==='Will'&&vb(wl,'where').value==='Scanned copy in Google Drive, Family folder'&&!!vb(wl,'username')&&!!vb(wl,'password')&&!!vb(wl,'filepw'));
setv(vb(wl,'username'),'alex@example.com');setv(vb(wl,'password'),'drive-pass-456');
check('the plan records that a login is there, and nothing else',will().vault===true&&!JSON.stringify(P().reg.docs).includes('drive-pass-456'));
check('the document now says its login is there',/Open its login/.test(txt('.vdocs')));
// From the document's own card, while the vault is locked.
await act('vlock');
await act('go',{v:'chapter',ch:'admin',stid:'docs'});
check('document header says the login is in the vault',/digital copy, login in the vault/.test(txt('.entry-sub')),txt('.entry-sub'));
await act('open',{id:will().id});
const btn=q('.entry.open [data-act=vdoc]');
check('the document card links to its login',!!btn&&btn.textContent==='Open it in the vault'&&/Saved in the vault/.test(txt('.entry.open .vdl')),btn&&btn.textContent);
click(btn);await wait(60);
check('it goes to the vault and says what will open',/Unlock the vault, and the login for your will opens/.test(txt('.vault')),txt('.vault').slice(0,120));
q('#vpu').value=pass;await act('vunlock');
check('after unlocking, the will’s login is open',await until(()=>openN()===1&&txt('.vault .entry.open .entry-title')==='Will'),txt('.vault .entry.open .entry-title'));
// A new document: the button appears as soon as a digital copy is typed.
await act('go',{v:'chapter',ch:'admin',stid:'docs'});
click(all('[data-act=add][data-reg=docs]').find(b=>b.textContent.trim()==='+ Passport'));await wait(40);
const pp=P().reg.docs[P().reg.docs.length-1];
check('no login button until there’s a digital copy',!q('.entry.open [data-act=vdoc]'));
setv(q(`[data-b="r|docs|${pp.id}|digital"]`),'iCloud Drive');
check('typing a digital copy offers to keep its login in the vault',(q('.entry.open [data-act=vdoc]')||{}).textContent==='Keep its login in the vault');
// Deleting the will's login clears the record.
await act('go',{v:'chapter',ch:'admin',stid:'vault'});q('#vpu').value=pass;await act('vunlock');await until(()=>/Your vault/.test(txt('.vault h3')));
check('both documents listed in the vault',all('.vdocs .vdoc').length===2,all('.vdocs .vdoc').length);
click(all('.vault .entry-head').find(h=>/^Will/.test(h.textContent)));await wait(40);
await act('vdel',{id:wl});await act('vdelyes',{id:wl});
check('deleting a document’s login clears its record',!will().vault&&/\+ Add its login/.test(txt('.vdocs')));
// The executor's list says where digital copies are.
await act('go',{v:'outputs'});click(all('[data-act]').find(b=>/xecutor/.test(b.textContent)));await wait(60);
check('executor’s list: digital copies',/Digital copies of documents: Will \(Scanned copy in Google Drive, Family folder\); Passport \(iCloud Drive\)\./.test(document.body.innerText),(document.body.innerText.match(/Digital copies[^\n]*/)||[''])[0]);
check('no [object Object]',!/object Object/.test(document.body.innerText));
}catch(e){r.push('ERR '+e.message+' '+e.stack)}
if(errs.length)r.push('ERR '+errs.length+' check(s) failed');
document.body.setAttribute('data-r',r.join('\n'));},400);
