(function(){const s=async()=>({text:''});s.json=async(p)=>{window.__lastPrompt=p;return {question:'Where were you when you decided to start this?',starter:'It was the night'};};s.limits=async()=>({images:false});
window.claude={use:n=>new Promise(r=>setTimeout(()=>r(n==='sample'?s:null),50))};})();
