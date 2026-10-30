(function(){
  const errs = [], log = [];
  window.addEventListener("error", e => errs.push((e.message || "") + " @" + (e.lineno || "")));
  const click = el => { if (el) el.dispatchEvent(new MouseEvent("click", {bubbles:true})); };
  const all = s => Array.from(document.querySelectorAll(s));
  const q = s => document.querySelector(s);
  const goTo = (v, ch) => { const b = document.createElement("button"); b.dataset.act = "go"; b.dataset.v = v; if (ch) b.dataset.ch = ch; document.body.appendChild(b); click(b); b.remove(); };
  const nav = v => goTo(v);
  function sweep(tag){
    goTo("overview"); const navs = [{v:"today"},{v:"overview"}].concat(all(".chap[data-ch]").map(b => ({v:"chapter", ch:b.dataset.ch})), ["words","strengthen","family","outputs","review","release","settings"].map(v => ({v})));
    navs.forEach(n => {
      goTo(n.v, n.ch);
      if (n.v === "today") { click(q(".nextstep [data-act=talk]")); for (let k = 0; k < 10 && q("[data-act=talknext]"); k++) click(q("[data-act=talknext]")); log.push(tag + " talk=" + (q(".thread .ask") || {textContent:"none"}).textContent.slice(0, 25)); goTo("today"); }
      if (n.v === "chapter") {
        const count = all(".topic").length;
        for (let i = 0; i < count; i++) {
          click(all(".topic")[i]);
          const heads = all(".entry-head"); if (heads.length) { click(heads[0]); click(q(".entry.open [data-act=pick]")); }
          const fu = q("textarea[data-assist=s]");
          if (fu) { fu.value = "My super, Netflix, my lawyer, the dog, facebook, my medication"; fu.dispatchEvent(new Event("input", {bubbles:true})); if (!q(".fu")) log.push(tag + " no followups " + n.ch + i); }
          const addc = q("[data-act=add]"); if (addc && i % 2) click(addc);
        }
      }
      if (n.v === "words") { all(".tabs button").forEach(t => click(t)); click(all(".tabs button")[0]); click(q("[data-act=newletter]")); click(q("[data-act=prompt]")); }
      if (n.v === "strengthen") { all(".sug>button").slice(0, 3).forEach(b => click(b)); log.push(tag + " sugs=" + all(".sug").length); }
      if (n.v === "outputs") { const lens = []; for (let i = 0; i < 6; i++) { click(all(".tabs button")[i]); lens.push((q("#doc") || {innerText:""}).innerText.length); } log.push(tag + " outs=" + lens.join("/")); }
      if (n.v === "review") { click(q("[data-act=reviewed]")); }
      if (n.v === "release") { click(all("[data-act=pick]").find(x => x.dataset.b === "rel|confirm" && x.dataset.v === "3")); }
    });
  }
  setTimeout(() => {
    try {
      // CSV parsing
      const cba = "01/06/2026,-25.99,\"NETFLIX.COM MELBOURNE AU Card xx1234\",+1000.00\n01/07/2026,-25.99,\"NETFLIX.COM MELBOURNE AU Card xx1234\",+974.01\n03/06/2026,-640.00,\"Direct Debit 123456 ORIGIN ENERGY\",+300\n03/09/2026,-655.20,\"Direct Debit 123456 ORIGIN ENERGY\",+300\n05/06/2026,-17.95,\"ANYTIME FITNESS PADDINGTON\",+1\n12/06/2026,-17.95,\"ANYTIME FITNESS PADDINGTON\",+1\n19/06/2026,-17.95,\"ANYTIME FITNESS PADDINGTON\",+1\n07/06/2026,-84.50,\"WOOLWORTHS 1234 BRISBANE\",+1\n09/06/2026,-12.00,\"CAFE NERO\",+1\n15/06/2026,-49.00,\"BOWLS CLUB SUBS\",+1\n15/07/2026,-49.00,\"BOWLS CLUB SUBS\",+1\n02/06/2026,3500.00,\"SALARY ACME\",+1";
      const wbc = "Bank Account,Date,Narrative,Debit Amount,Credit Amount,Balance,Categories,Serial\n032000123456,02/06/2026,DEBIT CARD PURCHASE SPOTIFY P1234 SYDNEY AUS,22.99,,100,OTHER,\n032000123456,02/07/2026,DEBIT CARD PURCHASE SPOTIFY P1234 SYDNEY AUS,22.99,,100,OTHER,\n032000123456,10/06/2026,TELSTRA BPAY,65.00,,100,OTHER,\n032000123456,10/07/2026,TELSTRA BPAY,65.00,,100,OTHER,\n032000123456,11/06/2026,BUNNINGS,120.00,,100,OTHER,";
      const p1 = window.__amfy.parseStatement(cba), p2 = window.__amfy.parseStatement(wbc);
      log.push("csv1=" + p1.map(x => x.provider + ":" + x.amount + ":" + x.freq).join(","));
      log.push("csv2=" + p2.map(x => x.provider + ":" + x.amount + ":" + x.freq).join(","));
      // check
      click(q("[data-act=check]"));
      all(".qrow").forEach((r, i) => {});
      ["accounts","bills","docs","meds","epoa","digital","house","wishes"].forEach((k, i) => click(all("[data-act=pick]").find(x => x.dataset.b === "ck|" + k && x.dataset.v === ["yes","partly","no"][i % 3])));
      click(q("[data-act=checkdone]")); log.push("score=" + (q(".score strong") || {textContent:"?"}).textContent);
      // example sweep
      click(q("[data-act=go][data-v=welcome]")); click(q("[data-act=example]")); sweep("AU");
      goTo("today"); click(q(".out.no")); click(q("[data-act=go][data-v=today]"));
      log.push("essBack=" + (q("h1") || {textContent:""}).textContent.slice(0, 30));
      nav("settings"); click(all("[data-act=pick]").find(x => x.dataset.b === "set|country" && x.dataset.v === "NZ")); sweep("NZ");
      // parent plan
      nav("settings"); click(q("[data-act=reset]")); click(q("[data-act=resetyes]"));
      click(q("[data-act=startparent]"));
      for (let pg = 0; pg < 8 && !q("[data-act=scanfinish]"); pg++) {
        const n = all(".scanq .field").length;
        for (let i = 0; i < n; i++) { const f = all(".scanq .field")[i]; click(f && f.querySelector(".chip")); }
        click(all("[data-act=scannext]").pop());
      }
      click(all("[data-act=scanfinish]").pop());
      log.push("parentEss=" + (q(".thread .ask") || {textContent:""}).textContent.slice(0, 40));
      click(q("[data-act=go][data-v=overview]")); sweep("PARENT");
      goTo("overview"); log.push("chapters=" + all(".chap[data-ch]").length);
    } catch (e) { errs.push("harness: " + e.message + " " + (e.stack || "").split("\n")[1]); }
    document.body.setAttribute("data-test", JSON.stringify({errs, log}));
  }, 300);
})();
