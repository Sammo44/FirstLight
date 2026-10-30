(function(){
const s=async()=>({text:''});
s.json=async(p,opts)=>{window.__prompts=(window.__prompts||[]).concat([p]);window.__opts=opts;
  if(/You answer questions from/.test(p)){const line=(p.split('\n').find(l=>/spare keys/i.test(l))||'');const id=(line.match(/^(f\d+)/)||[])[1];const leak=/vault|passphrase|Anyone who shouldn/i.test(p);window.__askLeak=leak;return {answer:'It’s on the hook inside the laundry cupboard.',sources:id?[id]:[],found:true};}
  const t=(p.match(/Topic: ([^.]+)\./)||[])[1]||'';
  if(t==='Medications and doctor')return {meds:['Atorvastatin 20mg at night','Ramipril 5mg in the morning'],allergies:'Penicillin',conditions:'',gp:'Dr Helen Lee, Paddington Family Practice',followup:'Do you see any specialists?'};
  if(t==='Who to call')return {people:[{name:'Jo',rel:'Wife',phone:'0400 000 101'},{name:'Sam Morgan',rel:'Brother',phone:'0400 000 102'}],followup:''};
  if(t==='Tell me anything')return {items:[{key:'home.access.spare',text:'Under the frog by the back door'}],people:[],bills:[],followup:''};
  if(t==='Your will')return {hasWill:'yes',location:'With Priya Shah at Shah Legal',holder:'Shah Legal',date:'2014',executors:[{name:'Jo'}],backup:[{name:'Sam'}],followup:''};
  return {followup:''};
};
s.limits=async()=>({images:true});
window.claude={use:n=>new Promise(r=>setTimeout(()=>r(n==='sample'?s:null),30))};
})();
