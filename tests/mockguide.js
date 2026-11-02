// A stand-in for Claude for guides.js: writing a draft from answers, and the coach's follow-up question.
(function(){
const s=async(p,opts)=>{window.__gprompts=(window.__gprompts||[]).concat([p]);window.__gopts=opts;
  if(/letter to someone they love/.test(p))return {text:'Dear Tommy,\n\nYou narrate everything to the dog, and it makes me smile every time.\n\nAll my love,\nDad',truncated:false};
  return {text:/life story/.test(p)?'I was born in Brisbane in 1971, and Mum and Nan raised me.\n\nI loved fishing at Tin Can Bay.':'A draft.',truncated:false};};
s.json=async(p)=>{window.__gjson=(window.__gjson||[]).concat([p]);return {question:'What did Nan’s kitchen smell like?',starter:'Nan’s kitchen always smelled of'};};
s.limits=async()=>({images:false});
window.claude={use:n=>new Promise(r=>setTimeout(()=>r(n==='sample'?s:null),30))};
})();
