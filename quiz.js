(function () {
  "use strict";

  const U = window.MZU;
  const { E, LEVELS, TOPICS, SKILLS, LV, TP, SK, app, store, esc, rich, tex, icon, progress, back, stageChips, myLevel, DAILY } = U;
  const make = window.MZ_MAKE, seeded = window.MZ_SEEDED, shuffle = window.MZ_SHUFFLE, check = window.MZ_CHECK;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const $ = (id) => document.getElementById(id);

  /* ---------- Profile ---------- */
  const P = Object.assign(
    { xp: 0, mode: "mcq", sound: true, haptic: true, goal: 20, days: {}, sk: {}, best: {}, badges: {}, n: 0, c: 0, sessions: 0, perfect: 0, dailies: 0, fixed: 0, last: null, daily: null },
    store.get("prof", {})
  );
  const save = () => store.set("prof", P);
  const mist = () => store.get("mist", []);

  const dkey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = () => dkey(new Date());
  const dayAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return dkey(d); };
  const day = () => P.days[today()] || (P.days[today()] = { a: 0, c: 0, s: 0, x: 0 });

  function streak() {
    let k = P.days[today()] && P.days[today()].s ? 0 : 1, n = 0;
    while (P.days[dayAgo(k)] && P.days[dayAgo(k)].s) { n++; k++; }
    return n;
  }
  function bestStreak() {
    let best = 0, run = 0, prev = null;
    for (const k of Object.keys(P.days).filter((k) => P.days[k].s).sort()) {
      const d = new Date(k + "T00:00:00");
      run = prev && Math.round((d - prev) / 864e5) === 1 ? run + 1 : 1;
      best = Math.max(best, run);
      prev = d;
    }
    return best;
  }
  const levelOf = (xp) => Math.floor((1 + Math.sqrt(1 + (8 * xp) / 100)) / 2);
  const xpFor = (L) => 50 * L * (L - 1);
  const acc = (id) => { const s = P.sk[id]; return s && s.a ? Math.round((100 * s.c) / s.a) : null; };
  function stars(id) {
    const s = P.sk[id];
    if (!s || s.a < 5) return 0;
    const a = s.c / s.a;
    return a >= 0.9 && s.a >= 20 ? 3 : a >= 0.75 && s.a >= 10 ? 2 : a >= 0.5 ? 1 : 0;
  }
  const starHtml = (n) => `<span class="stars" aria-label="${n} of 3 stars">${[0, 1, 2].map((k) => `<i class="${k < n ? "on" : ""}">${icon("star")}</i>`).join("")}</span>`;
  function weak() {
    return SKILLS.filter((s) => P.sk[s.id] && P.sk[s.id].a >= 4)
      .map((s) => ({ s, a: P.sk[s.id].c / P.sk[s.id].a }))
      .filter((x) => x.a < 0.7)
      .sort((x, y) => x.a - y.a)
      .slice(0, 4)
      .map((x) => x.s);
  }
  const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  function untilMidnight() {
    const n = new Date(), m = new Date(n);
    m.setHours(24, 0, 0, 0);
    const mins = Math.ceil((m - n) / 6e4);
    return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
  }
  const levelIndex = (s) => LEVELS.findIndex((l) => l.id === s.level);

  function slim(it) {
    const o = {};
    for (const k of ["skill", "q", "ans", "ordered", "tol", "show", "how", "hint", "choices", "ci", "mcqOnly"]) if (it[k] !== undefined) o[k] = it[k];
    return o;
  }

  function rec(it, ok, xp) {
    const d = day();
    d.a++; if (ok) d.c++; d.x += xp;
    P.n++; if (ok) P.c++; P.xp += xp;
    const s = P.sk[it.skill] || (P.sk[it.skill] = { a: 0, c: 0 });
    s.a++; if (ok) s.c++;
    const list = mist(), i = list.findIndex((m) => m.q === it.q);
    if (!ok && i < 0) { list.unshift(slim(it)); list.length = Math.min(list.length, 80); store.set("mist", list); }
    if (ok && i >= 0 && it.fromMistakes) { list.splice(i, 1); P.fixed++; store.set("mist", list); }
    save();
  }
  function bonus(xp) { P.xp += xp; day().x += xp; save(); }

  const BADGES = [
    { id: "first", name: "First steps", desc: "Finish your first quiz", icon: "play", test: () => P.sessions >= 1 },
    { id: "perfect", name: "Perfectionist", desc: "Score 100% on a quiz of 5 or more", icon: "star", test: () => P.perfect >= 1 },
    { id: "streak3", name: "On a roll", desc: "Practise 3 days in a row", icon: "flame", test: () => bestStreak() >= 3 },
    { id: "streak7", name: "Week warrior", desc: "Practise 7 days in a row", icon: "flame", test: () => bestStreak() >= 7 },
    { id: "q100", name: "Century", desc: "Answer 100 questions", icon: "check", test: () => P.n >= 100 },
    { id: "daily7", name: "Daily habit", desc: "Finish 7 daily challenges", icon: "calendar", test: () => P.dailies >= 7 },
    { id: "speed20", name: "Lightning", desc: "Score 20 in a speed round", icon: "bolt", test: () => Object.keys(P.best).some((k) => k.startsWith("speed:") && P.best[k] >= 20) },
    { id: "survive20", name: "Survivor", desc: "Reach 20 in survival", icon: "heart", test: () => (P.best.survival || 0) >= 20 },
    { id: "mock80", name: "Exam ready", desc: "Score 80% or more in a mock test", icon: "award", test: () => Object.keys(P.best).some((k) => k.startsWith("mock:") && P.best[k] >= 80) },
    { id: "fixer", name: "Fixer", desc: "Clear 20 mistakes", icon: "refresh", test: () => P.fixed >= 20 },
    { id: "explorer", name: "Explorer", desc: "Practise in all five stages", icon: "map", test: () => LEVELS.every((l) => SKILLS.some((s) => s.level === l.id && P.sk[s.id])) },
    { id: "q1000", name: "Thousand club", desc: "Answer 1,000 questions", icon: "trophy", test: () => P.n >= 1000 },
    { id: "streak30", name: "Unstoppable", desc: "Practise 30 days in a row", icon: "flame", test: () => bestStreak() >= 30 },
    { id: "level10", name: "Level 10", desc: "Reach level 10", icon: "award", test: () => levelOf(P.xp) >= 10 },
  ];
  function checkBadges() {
    const got = [];
    for (const b of BADGES) if (!P.badges[b.id] && b.test()) { P.badges[b.id] = today(); got.push(b); }
    if (got.length) save();
    return got;
  }

  function endSession(r) {
    const before = streak();
    if (r.n > 0) {
      day().s++;
      P.sessions++;
      if (r.n >= 5 && r.score === r.n) P.perfect++;
    }
    save();
    paintChrome();
    const after = streak();
    return { streakUp: after > before ? after : 0, badges: r.n > 0 ? checkBadges() : [] };
  }

  function paintChrome() {
    const pill = $("streakPill");
    if (!pill) return;
    const s = streak();
    pill.querySelector("b").textContent = s;
    pill.classList.toggle("on", !!(P.days[today()] && P.days[today()].s));
    pill.title = `${s}-day streak`;
  }

  /* ---------- Feedback ---------- */
  let actx = null;
  function beep(ok) {
    if (!P.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t = actx.currentTime;
      const notes = ok ? [[660, 0], [990, 0.08]] : [[200, 0], [160, 0.09]];
      for (const [f, dt] of notes) {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = ok ? "sine" : "triangle";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + dt);
        g.gain.exponentialRampToValueAtTime(0.13, t + dt + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.17);
        o.connect(g).connect(actx.destination);
        o.start(t + dt);
        o.stop(t + dt + 0.2);
      }
    } catch (e) {}
  }
  const buzz = (ok) => { if (P.haptic && !ok && navigator.vibrate) try { navigator.vibrate(70); } catch (e) {} };

  function confetti() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas");
    c.className = "confetti";
    document.body.appendChild(c);
    const dpr = window.devicePixelRatio || 1, W = innerWidth, H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    const g = c.getContext("2d");
    g.scale(dpr, dpr);
    const cols = ["#6d4aff", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#fde68a"];
    const ps = Array.from({ length: 140 }, () => ({ x: W / 2 + (Math.random() - 0.5) * 120, y: H * 0.32, vx: (Math.random() - 0.5) * 11, vy: -Math.random() * 11 - 4, r: Math.random() * 6 + 5, c: pick(cols), a: Math.random() * 6, va: (Math.random() - 0.5) * 0.35 }));
    const t0 = performance.now();
    (function frame(t) {
      const el = t - t0;
      g.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.vy += 0.28; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.globalAlpha = Math.max(0, 1 - el / 2000); g.fillStyle = p.c; g.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); g.restore();
      }
      if (el < 2000 && c.isConnected) requestAnimationFrame(frame); else c.remove();
    })(t0);
  }

  function ask(title, body, ok = "OK", cancel = "Cancel", danger = false) {
    return new Promise((res) => {
      const m = document.createElement("div");
      m.className = "modal";
      m.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="mT"><h2 id="mT">${esc(title)}</h2><p>${body}</p>
        <div class="modal-acts"><button type="button" class="btn" data-v="0">${esc(cancel)}</button><button type="button" class="btn ${danger ? "danger" : "primary"}" data-v="1">${esc(ok)}</button></div></div>`;
      document.body.appendChild(m);
      const done = (v) => { m.remove(); document.removeEventListener("keydown", key, true); res(v); };
      const key = (e) => { if (e.key === "Escape") { e.stopPropagation(); done(false); } };
      document.addEventListener("keydown", key, true);
      m.addEventListener("click", (e) => { const b = e.target.closest("[data-v]"); if (b) done(b.dataset.v === "1"); else if (e.target === m) done(false); });
      requestAnimationFrame(() => m.classList.add("in"));
      m.querySelector('[data-v="1"]').focus();
    });
  }

  const ring = (pct, cls = "ring") => {
    const C = 2 * Math.PI * 52, p = Math.max(0, Math.min(100, pct || 0));
    return `<svg viewBox="0 0 120 120" class="${cls}" aria-hidden="true"><circle cx="60" cy="60" r="52" class="ring-bg"/>${p > 0 ? `<circle cx="60" cy="60" r="52" class="ring-fg" stroke-dasharray="${((C * p) / 100).toFixed(1)} ${C.toFixed(1)}"/>` : ""}</svg>`;
  };

  /* ---------- Question sources ---------- */
  function source(list) {
    const seen = new Set();
    let last = null;
    return () => {
      let it, s;
      for (let k = 0; k < 25; k++) {
        const pool = list.length > 1 ? list.filter((x) => x !== last) : list;
        s = pick(pool);
        it = make(s);
        if (!seen.has(it.q)) break;
      }
      last = s;
      seen.add(it.q);
      return it;
    };
  }
  function batch(list, n) {
    const out = [], seen = new Set();
    let pool = [];
    for (let i = 0; out.length < n && i < n * 6; i++) {
      if (!pool.length) pool = shuffle(list.slice());
      const it = make(pool.pop());
      if (seen.has(it.q)) continue;
      seen.add(it.q);
      out.push(it);
    }
    return out;
  }
  const stageSkills = (lv) => SKILLS.filter((s) => s.level === lv.id);
  const closeP = (s) => { const o = (s.match(/\(/g) || []).length - (s.match(/\)/g) || []).length; return o > 0 ? s + ")".repeat(o) : s; };

  /* ---------- Player ---------- */
  const PRAISE = ["Correct!", "Nice work!", "Spot on!", "Great job!", "You got it!", "Brilliant!", "Exactly right!"];
  const KEYS = ["7", "8", "9", "/", "del", "4", "5", "6", "√", "(", "1", "2", "3", "π", ")", "-", "0", ".", ",", "go"];
  const keyLabel = { del: icon("backspace"), go: "Check", "-": "−", "/": "÷" };
  const keyAria = { del: "Delete", go: "Check answer", "-": "Minus", "/": "Divide or fraction", "√": "Square root", "π": "Pi", ",": "Comma", ".": "Decimal point" };
  const keypad = () => `<div class="keypad" role="group" aria-label="Answer keypad">${KEYS.map((k) => `<button type="button" class="kp ${k === "go" ? "go" : k === "del" ? "del" : /[0-9.]/.test(k) ? "" : "fn"}" data-key="${esc(k)}"${keyAria[k] ? ` aria-label="${keyAria[k]}"` : ""}>${keyLabel[k] || esc(k)}</button>`).join("")}</div>`;

  function play(cfg) {
    document.body.classList.add("playing");
    window.scrollTo(0, 0);
    const st = { i: 0, score: 0, lives: cfg.lives || 0, run: 0, bestRun: 0, xp: 0, log: [], t0: Date.now(), left: cfg.time || 0, ended: false, paused: false, locked: true, cur: null, typed: "" };
    app.innerHTML = `<div class="play" style="--c:${cfg.color}">
      <div class="play-top">
        <button type="button" class="icon-btn sm" id="pQuit" aria-label="Leave this round">${icon("x")}</button>
        <div class="play-bar" aria-hidden="true"><i id="pBar"></i></div>
        <div class="play-stat" id="pStat" aria-live="polite"></div>
      </div>
      <div class="play-main" id="pMain"></div>
      <div class="play-foot" id="pFoot"></div>
      <div class="sheet" id="pSheet" hidden></div>
    </div>`;
    const main = $("pMain"), foot = $("pFoot"), sheetEl = $("pSheet");
    let tick = null, autoT = null;

    function paintStat() {
      let h;
      if (cfg.time) h = `<span class="pst ${st.left <= 10 ? "warn" : ""}">${icon("clock")}<b>${Math.max(0, Math.ceil(st.left))}</b></span><span class="pst acc">${icon("bolt")}<b>${st.score}</b></span>`;
      else if (cfg.lives) h = `<span class="hearts">${Array.from({ length: cfg.lives }, (_, k) => `<i class="${k < st.lives ? "" : "lost"}">${icon("heart")}</i>`).join("")}</span><span class="pst acc"><b>${st.score}</b></span>`;
      else h = `<span class="pst ${st.run >= 3 ? "hot" : ""}" title="Answers in a row">${icon("flame")}<b>${st.run}</b></span>`;
      $("pStat").innerHTML = h;
      const pct = cfg.time ? (st.left / cfg.time) * 100 : cfg.total ? (st.i / cfg.total) * 100 : cfg.barPct ? cfg.barPct(st) : 0;
      $("pBar").style.width = Math.max(0, Math.min(100, pct)) + "%";
    }

    function next() {
      if (st.ended) return;
      if ((cfg.total && st.i >= cfg.total) || (cfg.lives && st.lives <= 0)) return finish();
      const it = cfg.next(st);
      if (!it) return finish();
      st.cur = it;
      st.locked = false;
      st.typed = "";
      render();
    }

    function render() {
      const it = st.cur, s = SK[it.skill], lv = LV[s.level];
      const typing = cfg.answer === "type" && !it.mcqOnly;
      main.innerHTML = `<div class="q-wrap">
        <div class="q-tag" style="--c:${lv.color}">${icon(lv.icon)}<span>${esc(cfg.tag ? cfg.tag(st, s) : s.name)}</span>${cfg.total ? `<em>${st.i + 1} of ${cfg.total}</em>` : ""}</div>
        <div class="q-text">${rich(it.q)}</div>
        ${typing
          ? `<div class="ans-box" id="ansBox"><span id="ansTxt" aria-live="polite"></span><i class="caret" aria-hidden="true"></i></div><p class="q-read" id="qRead">${esc(it.hint || "Use the keypad to type your answer.")}</p>`
          : `<div class="opts" id="opts">${it.choices.map((c, k) => `<button type="button" class="opt" data-k="${k}"><span class="opt-k">${"ABCD"[k]}</span><span class="opt-t">${rich(c)}</span></button>`).join("")}</div>`}
      </div>`;
      foot.innerHTML = typing ? keypad() : cfg.instant ? "" : `<button type="button" class="btn ghost sm" id="pSkip">${icon("bulb")} I don't know</button>`;
      foot.classList.toggle("has-pad", typing);
      main.scrollTop = 0;
      if (typing) foot.querySelector(".keypad").addEventListener("click", (e) => { const b = e.target.closest("[data-key]"); if (b) key(b.dataset.key); });
      else $("opts").addEventListener("click", (e) => { const b = e.target.closest(".opt"); if (b) choose(+b.dataset.k); });
      const sk = $("pSkip");
      if (sk) sk.addEventListener("click", skip);
      paintStat();
    }

    function key(k) {
      if (st.locked) return;
      if (k === "go") return submitTyped();
      if (k === "del") st.typed = st.typed.endsWith("√(") ? st.typed.slice(0, -2) : st.typed.slice(0, -1);
      else if (k === "√") st.typed += "√(";
      else if (st.typed.length < 40) st.typed += k;
      $("ansTxt").textContent = st.typed.replace(/-/g, "−");
      const read = $("qRead"), v = closeP(st.typed.trim());
      read.classList.remove("err");
      read.textContent = st.cur.hint || "Use the keypad to type your answer.";
      if (/[/√π(]/.test(v)) {
        try {
          const parts = v.split(/[,;]/).map((p) => E.fmt(+E.evaluate(p.replace(/π/g, "pi").replace(/√/g, "sqrt")).toPrecision(8)));
          read.textContent = "Reads as " + parts.join(", ");
        } catch (e) {}
      }
    }

    function submitTyped() {
      const txt = closeP(st.typed);
      const r = check(txt, st.cur);
      if (r.empty) { const b = $("ansBox"); b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); return; }
      if (r.error) { const rd = $("qRead"); rd.textContent = r.error; rd.classList.add("err"); return; }
      resolve(r.ok, esc(txt.replace(/-/g, "−")), false);
    }

    function mark(k) {
      main.querySelectorAll(".opt").forEach((b, j) => {
        b.disabled = true;
        b.classList.add(j === st.cur.ci ? "good" : j === k ? "bad" : "dim");
      });
    }
    function choose(k) {
      if (st.locked) return;
      mark(k);
      resolve(k === st.cur.ci, rich(st.cur.choices[k]), false);
    }
    function skip() {
      if (st.locked) return;
      if (main.querySelector(".opt")) mark(-1);
      resolve(false, null, true);
    }

    function floater(txt, good) {
      const f = document.createElement("span");
      f.className = "floater" + (good ? " good" : "");
      f.textContent = txt;
      document.querySelector(".play-top").appendChild(f);
      setTimeout(() => f.remove(), 900);
    }

    function resolve(ok, givenHtml, skipped) {
      st.locked = true;
      const it = st.cur, gain = ok ? cfg.xp : 0;
      if (ok) { st.score++; st.run++; st.bestRun = Math.max(st.bestRun, st.run); }
      else { st.run = 0; if (cfg.lives) st.lives--; }
      st.xp += gain;
      rec(it, ok, gain);
      st.log.push({ it, ok, givenHtml, skipped });
      st.i++;
      const box = $("ansBox");
      if (box) box.classList.add(ok ? "good" : "bad");
      beep(ok);
      buzz(ok);
      paintStat();
      if (cfg.instant) {
        if (!ok && cfg.time) { st.left = Math.max(0, st.left - 3); floater("−3s"); paintStat(); }
        autoT = setTimeout(next, ok ? 260 : 750);
        return;
      }
      if (ok && cfg.autoCorrect) { floater(`+${gain} XP`, true); autoT = setTimeout(next, 650); return; }
      showSheet(ok, skipped);
    }

    function showSheet(ok, skipped) {
      const it = st.cur, last = (cfg.total && st.i >= cfg.total) || (cfg.lives && st.lives <= 0);
      sheetEl.className = "sheet " + (ok ? "good" : "bad");
      sheetEl.innerHTML = `<div class="sheet-in">
        <div class="sheet-head"><span class="sheet-ic">${icon(ok ? "check" : skipped ? "bulb" : "x")}</span><b>${ok ? pick(PRAISE) : skipped ? "Here's the answer" : "Not quite"}</b>${ok ? `<span class="xp-chip">+${cfg.xp} XP</span>` : ""}</div>
        ${ok ? "" : `<p class="sheet-ans"><small>Correct answer</small><span>${rich(it.show)}</span></p>`}
        <details class="working"${ok ? "" : " open"}><summary>${icon("bulb")} How to solve it</summary><div>${rich(it.how)}</div></details>
        <button type="button" class="btn block lg ${ok ? "go-good" : "go-bad"}" id="pNext">${last ? "See results" : "Continue"} ${icon("arrow")}</button>
      </div>`;
      sheetEl.hidden = false;
      requestAnimationFrame(() => sheetEl.classList.add("up"));
      $("pNext").addEventListener("click", cont);
      $("pNext").focus({ preventScroll: true });
    }
    function cont() {
      if (sheetEl.hidden) return;
      sheetEl.classList.remove("up");
      sheetEl.hidden = true;
      next();
    }

    function onKey(e) {
      if (st.ended || document.querySelector(".modal")) return;
      if (e.target.closest && e.target.closest("input, textarea, select")) return;
      if (!sheetEl.hidden) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cont(); } return; }
      if (st.locked || !st.cur) return;
      if (!$("ansBox")) {
        let k = "1234".indexOf(e.key);
        if (k < 0) k = "abcd".indexOf(e.key.toLowerCase());
        if (k >= 0 && k < st.cur.choices.length) { e.preventDefault(); choose(k); }
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") { e.preventDefault(); key("go"); }
      else if (e.key === "Backspace") { e.preventDefault(); key("del"); }
      else if (/^[0-9.,\-/()]$/.test(e.key)) { e.preventDefault(); key(e.key); }
      else if (e.key === "p") key("π");
      else if (e.key === "r" || e.key === "s") key("√");
    }
    document.addEventListener("keydown", onKey);

    if (cfg.time) {
      let lastT = performance.now();
      tick = setInterval(() => {
        const now = performance.now(), dt = (now - lastT) / 1000;
        lastT = now;
        if (st.ended || st.paused) return;
        st.left -= dt;
        if (st.left <= 0) { st.left = 0; paintStat(); finish(); } else paintStat();
      }, 100);
    }

    const stop = () => { st.ended = true; clearInterval(tick); clearTimeout(autoT); document.removeEventListener("keydown", onKey); };
    U.setTeardown(stop);

    $("pQuit").addEventListener("click", async () => {
      if (!st.log.length) { stop(); return U.go(cfg.back); }
      st.paused = true;
      const yes = await ask("Leave this round?", "Answers you've already given still count towards your stats.", "Leave", "Keep going");
      st.paused = false;
      if (yes) { stop(); U.go(cfg.back); }
    });

    function finish() {
      if (st.ended) return;
      stop();
      const r = { score: st.score, n: st.log.length, log: st.log, xp: st.xp, time: (Date.now() - st.t0) / 1000, bestRun: st.bestRun };
      if (cfg.onEnd) cfg.onEnd(r);
      const s = endSession(r);
      r.streakUp = s.streakUp;
      r.badges = s.badges;
      results(cfg, r);
    }

    next();
  }

  /* ---------- Exam mode ---------- */
  function exam(cfg) {
    document.body.classList.add("playing");
    window.scrollTo(0, 0);
    const items = cfg.items, N = items.length;
    const sel = Array(N).fill(-1), flag = Array(N).fill(false);
    let cur = 0, left = cfg.time || 0, ended = false, paused = false, tick = null, autoT = null;
    const t0 = Date.now();
    app.innerHTML = `<div class="play exam" style="--c:${cfg.color}">
      <div class="play-top">
        <button type="button" class="icon-btn sm" id="eQuit" aria-label="Leave the test">${icon("x")}</button>
        <div class="exam-title"><b>${esc(cfg.title)}</b><small id="eCount"></small></div>
        <div class="play-stat">${cfg.time ? `<span class="pst" id="eTime">${icon("clock")}<b></b></span>` : ""}</div>
      </div>
      <div class="play-bar thin" aria-hidden="true"><i id="eBar"></i></div>
      <div class="play-main" id="eMain"></div>
      <div class="exam-foot">
        <button type="button" class="btn" id="ePrev" aria-label="Previous question">${icon("left")}</button>
        <button type="button" class="btn" id="eFlag" aria-pressed="false">${icon("flag")}<span>Flag</span></button>
        <button type="button" class="btn" id="ePal" aria-label="All questions">${icon("grid")}<span id="eDone"></span></button>
        <button type="button" class="btn primary" id="eNext"></button>
      </div>
      <div class="sheet pal-sheet" id="eSheet" hidden></div>
    </div>`;
    const main = $("eMain"), sh = $("eSheet");

    function render() {
      const it = items[cur], s = SK[it.skill], lv = LV[s.level];
      main.innerHTML = `<div class="q-wrap">
        <div class="q-tag" style="--c:${lv.color}">${icon(lv.icon)}<span>${esc(TP[s.topic].title)}</span>${flag[cur] ? `<em class="flagged">${icon("flag")} Flagged</em>` : ""}</div>
        <div class="q-text">${rich(it.q)}</div>
        <div class="opts">${it.choices.map((c, k) => `<button type="button" class="opt ${sel[cur] === k ? "sel" : ""}" data-k="${k}" aria-pressed="${sel[cur] === k}"><span class="opt-k">${"ABCD"[k]}</span><span class="opt-t">${rich(c)}</span></button>`).join("")}</div>
        ${sel[cur] >= 0 ? `<button type="button" class="link-btn clear-ans" id="eClear">Clear my answer</button>` : ""}
      </div>`;
      main.querySelector(".opts").addEventListener("click", (e) => { const b = e.target.closest(".opt"); if (b) choose(+b.dataset.k); });
      const cl = $("eClear");
      if (cl) cl.addEventListener("click", () => { sel[cur] = -1; render(); });
      $("eCount").textContent = `Question ${cur + 1} of ${N}`;
      $("ePrev").disabled = cur === 0;
      $("eFlag").setAttribute("aria-pressed", flag[cur]);
      $("eFlag").classList.toggle("on", flag[cur]);
      $("eNext").innerHTML = cur === N - 1 ? `Submit` : `Next ${icon("right")}`;
      const answered = sel.filter((x) => x >= 0).length;
      $("eDone").textContent = `${answered}/${N}`;
      $("eBar").style.width = (answered / N) * 100 + "%";
      main.scrollTop = 0;
    }
    function go(k) { clearTimeout(autoT); cur = Math.max(0, Math.min(N - 1, k)); render(); }
    function choose(k) {
      const first = sel[cur] < 0;
      sel[cur] = k;
      render();
      if (first && cur < N - 1) autoT = setTimeout(() => go(cur + 1), 380);
    }
    function paintTime() {
      const el = $("eTime");
      if (!el) return;
      el.querySelector("b").textContent = mmss(Math.max(0, left));
      el.classList.toggle("warn", left <= 60);
    }
    function palette() {
      sh.innerHTML = `<div class="sheet-in">
        <div class="sheet-head"><b>All questions</b><button type="button" class="icon-btn sm" data-x aria-label="Close">${icon("x")}</button></div>
        <div class="pal-grid">${items.map((_, k) => `<button type="button" class="pal ${sel[k] >= 0 ? "done" : ""} ${flag[k] ? "flag" : ""} ${k === cur ? "cur" : ""}" data-k="${k}" aria-label="Question ${k + 1}">${k + 1}</button>`).join("")}</div>
        <div class="pal-legend"><span><i class="done"></i>Answered</span><span><i class="flag"></i>Flagged</span><span><i></i>Not answered</span></div>
        <button type="button" class="btn primary block lg" data-submit>Submit test</button>
      </div>`;
      sh.hidden = false;
      requestAnimationFrame(() => sh.classList.add("up"));
      sh.onclick = (e) => {
        const b = e.target.closest("[data-k]");
        if (b) { closePal(); go(+b.dataset.k); }
        else if (e.target === sh || e.target.closest("[data-x]")) closePal();
        else if (e.target.closest("[data-submit]")) { closePal(); submit(false); }
      };
    }
    const closePal = () => { sh.classList.remove("up"); sh.hidden = true; };

    async function submit(force) {
      if (ended) return;
      if (!force) {
        const un = sel.filter((x) => x < 0).length;
        paused = true;
        const ok = await ask("Submit your test?", un ? `You have ${un} unanswered question${un > 1 ? "s" : ""}. Unanswered questions are marked wrong.` : "You've answered every question.", "Submit", "Keep working");
        paused = false;
        if (!ok || ended) return;
      }
      stop();
      const log = items.map((it, k) => {
        const ok = sel[k] === it.ci;
        if (sel[k] >= 0) rec(it, ok, ok ? 10 : 0);
        return { it, ok, givenHtml: sel[k] >= 0 ? rich(it.choices[sel[k]]) : null, skipped: sel[k] < 0 };
      });
      const score = log.filter((x) => x.ok).length;
      const r = { score, n: N, log, xp: score * 10, time: (Date.now() - t0) / 1000, exam: true };
      if (cfg.onEnd) cfg.onEnd(r);
      const s = endSession(r);
      r.streakUp = s.streakUp;
      r.badges = s.badges;
      r.extra = (r.extra || "") + breakdown(log);
      results(cfg, r);
    }

    function onKey(e) {
      if (ended || document.querySelector(".modal")) return;
      if (!sh.hidden) { if (e.key === "Escape") closePal(); return; }
      let k = "1234".indexOf(e.key);
      if (k < 0 && e.key.length === 1) k = "abcd".indexOf(e.key.toLowerCase());
      if (k >= 0 && k < items[cur].choices.length) { e.preventDefault(); choose(k); }
      else if (e.key === "ArrowRight") go(cur + 1);
      else if (e.key === "ArrowLeft") go(cur - 1);
    }
    document.addEventListener("keydown", onKey);
    const stop = () => { ended = true; clearInterval(tick); clearTimeout(autoT); document.removeEventListener("keydown", onKey); };
    U.setTeardown(stop);

    $("ePrev").addEventListener("click", () => go(cur - 1));
    $("eNext").addEventListener("click", () => (cur === N - 1 ? submit(false) : go(cur + 1)));
    $("eFlag").addEventListener("click", () => { flag[cur] = !flag[cur]; render(); });
    $("ePal").addEventListener("click", palette);
    $("eQuit").addEventListener("click", async () => {
      paused = true;
      const yes = await ask("Leave the test?", "Your answers in this test won't be saved.", "Leave", "Keep working", true);
      paused = false;
      if (yes) { stop(); U.go(cfg.back); }
    });

    if (cfg.time) {
      let lastT = performance.now();
      paintTime();
      tick = setInterval(() => {
        const now = performance.now(), dt = (now - lastT) / 1000;
        lastT = now;
        if (ended || paused) return;
        left -= dt;
        paintTime();
        if (left <= 0) submit(true);
      }, 250);
    }
    render();
  }

  function breakdown(log) {
    const g = {};
    for (const x of log) {
      const t = TP[SK[x.it.skill].topic];
      const e = g[t.id] || (g[t.id] = { t, n: 0, c: 0 });
      e.n++;
      if (x.ok) e.c++;
    }
    const rows = Object.values(g).sort((a, b) => a.c / a.n - b.c / b.n);
    if (rows.length < 2) return "";
    return `<div class="breakdown"><h3>By topic</h3>${rows.map((e) => {
      const pct = Math.round((100 * e.c) / e.n);
      return `<div class="bd-row" style="--c:${pct >= 70 ? "var(--good)" : pct >= 40 ? "#f59e0b" : "var(--bad)"}"><span>${esc(e.t.title)}</span><b>${e.c}/${e.n}</b>${progress(pct, e.t.title)}</div>`;
    }).join("")}</div>`;
  }

  const grade = (p) => (p >= 90 ? "A+" : p >= 80 ? "A" : p >= 70 ? "B" : p >= 60 ? "C" : p >= 40 ? "D" : "E");

  /* ---------- Results ---------- */
  function results(cfg, r) {
    document.body.classList.remove("playing");
    window.scrollTo(0, 0);
    const pct = r.n ? Math.round((100 * r.score) / r.n) : 0;
    const counted = cfg.time || cfg.lives;
    const msg = r.title || (r.n === 0 ? "No questions answered" : pct === 100 ? "Perfect score!" : pct >= 80 ? "Excellent work!" : pct >= 50 ? "Good going!" : "Keep practising!");
    if ((pct === 100 && r.n >= 5) || r.newBest) setTimeout(confetti, 200);
    app.innerHTML = `
      <section class="result" style="--c:${cfg.color}">
        <div class="res-ring">${ring(counted ? Math.min(100, (r.score / (cfg.ringMax || 20)) * 100) : pct)}<div class="res-num"><b>${counted ? r.score : `${r.score}/${r.n}`}</b><small>${cfg.time ? "correct" : cfg.lives ? "answered" : `${pct}%`}</small></div></div>
        <h1>${esc(msg)}</h1>
        ${r.sub ? `<p class="lead">${r.sub}</p>` : ""}
        ${r.newBest ? `<span class="best-pill">${icon("trophy")} New personal best</span>` : ""}
        <div class="res-stats">
          <div><small>Accuracy</small><b>${pct}%</b></div>
          <div><small>XP earned</small><b>+${r.xp}</b></div>
          <div><small>Time</small><b>${mmss(r.time)}</b></div>
        </div>
        ${r.streakUp ? `<div class="banner flame">${icon("flame")}<span><b>${r.streakUp}-day streak!</b> Practise again tomorrow to keep it going.</span></div>` : ""}
        ${r.badges.map((b) => `<div class="banner unlock">${icon(b.icon)}<span><small>Badge unlocked</small><b>${esc(b.name)}</b> · ${esc(b.desc)}</span></div>`).join("")}
        ${r.extra || ""}
        <div class="res-acts">
          ${cfg.restart ? `<button type="button" class="btn primary" id="rAgain">${icon("refresh")} ${esc(cfg.againLabel || "Play again")}</button>` : ""}
          <button type="button" class="btn" id="rDone">Done</button>
        </div>
      </section>
      ${review(r.log)}`;
    const again = $("rAgain");
    if (again) again.addEventListener("click", () => cfg.restart());
    $("rDone").addEventListener("click", () => U.go(cfg.back));
    wireReview();
  }

  function review(log) {
    if (!log.length) return "";
    const wrong = log.filter((x) => !x.ok).length;
    return `<section class="review">
      <div class="sec-head"><h2>Review answers</h2>${wrong && wrong < log.length ? `<div class="seg sm" id="rvSeg" role="group" aria-label="Filter"><button type="button" data-f="all" aria-pressed="true">All ${log.length}</button><button type="button" data-f="wrong" aria-pressed="false">Wrong ${wrong}</button></div>` : ""}</div>
      <div class="rv-list">${log.map((x, k) => `<article class="rv ${x.ok ? "ok" : "no"}" data-ok="${x.ok ? 1 : 0}">
        <div class="rv-head"><span class="rv-n">${k + 1}</span><div class="rv-q">${rich(x.it.q)}</div><span class="rv-ic">${icon(x.ok ? "check" : "x")}</span></div>
        <div class="rv-a">
          ${x.ok ? "" : `<div><small>Your answer</small>${x.givenHtml == null ? `<span class="muted">Not answered</span>` : `<span>${x.givenHtml}</span>`}</div>`}
          <div><small>Correct answer</small><span>${rich(x.it.show)}</span></div>
        </div>
        <details class="working"><summary>${icon("bulb")} How to solve it</summary><div>${rich(x.it.how)}</div></details>
      </article>`).join("")}</div>
    </section>`;
  }
  function wireReview() {
    const seg = $("rvSeg");
    if (!seg) return;
    seg.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      app.querySelectorAll(".rv").forEach((r) => { r.hidden = b.dataset.f === "wrong" && r.dataset.ok === "1"; });
    });
  }

  /* ---------- Modes ---------- */
  const MODES = {
    daily: { name: "Daily challenge", desc: "Ten questions for your class, the same for everyone today. Bonus XP and your streak.", icon: "calendar", color: "#f59e0b", href: "#/daily" },
    quick: { name: "Quick quiz", desc: "Five questions from your class. About two minutes.", icon: "play", color: "#6d4aff", href: "#/quick" },
    topics: { name: "Topic practice", desc: "Choose one skill and practise it, with the working after every answer.", icon: "target", color: "#10b981", href: "#/topics" },
    speed: { name: "Speed round", desc: "60 seconds on the clock. Wrong answers cost 3 seconds.", icon: "bolt", color: "#ec4899", href: "#/speed" },
    survival: { name: "Survival", desc: "Three lives. Questions climb from Class 1 to college.", icon: "heart", color: "#e5484d", href: "#/survival" },
    test: { name: "Chapter test", desc: "Pick chapters and get a timed test with a full report.", icon: "clipboard", color: "#3b82f6", href: "#/test" },
    mock: { name: "Mock test", desc: "A full paper for your stage: 20 questions in 30 minutes.", icon: "file", color: "#8b5cf6", href: "#/mock" },
    mistakes: { name: "Mistakes", desc: "Every question you got wrong. Get it right to clear it.", icon: "refresh", color: "#0ea5e9", href: "#/mistakes" },
  };
  function modeMeta(id) {
    if (id === "daily") return P.daily && P.daily.date === today() ? `Done today · ${P.daily.score}/${P.daily.n}` : "Not done today";
    if (id === "speed") { const b = Math.max(0, ...Object.keys(P.best).filter((k) => k.startsWith("speed:")).map((k) => P.best[k])); return b ? `Best ${b}` : "No score yet"; }
    if (id === "survival") return P.best.survival ? `Best ${P.best.survival}` : "No score yet";
    if (id === "mock") { const b = Math.max(0, ...Object.keys(P.best).filter((k) => k.startsWith("mock:")).map((k) => P.best[k])); return b ? `Best ${b}%` : "No score yet"; }
    if (id === "mistakes") { const n = mist().length; return n ? `${n} to fix` : "All clear"; }
    if (id === "topics") return `${SKILLS.length} skills`;
    if (id === "test") return "10 to 30 questions";
    if (id === "quick") return "5 questions";
    return "";
  }
  const modeRow = (id) => {
    const m = MODES[id];
    return `<a class="mode-row" href="${m.href}" style="--c:${m.color}"><span class="mode-ic">${icon(m.icon)}</span><span class="mode-txt"><b>${esc(m.name)}</b><small>${esc(m.desc)}</small><em>${esc(modeMeta(id))}</em></span>${icon("right")}</a>`;
  };
  const modeTile = (id) => {
    const m = MODES[id];
    const n = id === "mistakes" ? mist().length : 0;
    return `<a class="mode-tile" href="${m.href}" style="--c:${m.color}"><span class="mode-ic">${icon(m.icon)}</span><b>${esc(m.name)}</b><small>${esc(modeMeta(id))}</small>${n ? `<span class="count">${n}</span>` : ""}</a>`;
  };
  const modeHero = (id, extra = "") => {
    const m = MODES[id];
    return `<section class="mode-hero" style="--c:${m.color}"><span class="mh-ic">${icon(m.icon)}</span><div><h1>${esc(m.name)}</h1><p>${esc(m.desc)}</p>${extra}</div></section>`;
  };

  function dailyCard() {
    const lv = myLevel(), done = P.daily && P.daily.date === today();
    const d = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
    return `<a class="daily-card${done ? " done" : ""}" href="#/daily">
      <span class="dc-txt"><small>${icon("calendar")} Daily challenge · ${esc(d)}</small>
        <b>${done ? `Done! You scored ${P.daily.score}/${P.daily.n}` : "Today's 10 questions"}</b>
        <span>${done ? `Next challenge in ${untilMidnight()}` : `${lv ? esc(lv.range) : "Your class"} · +50 XP bonus`}</span></span>
      <span class="dc-go">${icon(done ? "check" : "play")}</span></a>`;
  }

  function classPicker() {
    return `<section class="card class-pick"><h2>Which class are you in?</h2><p class="muted">We'll choose questions at the right level. You can change this any time on the Me page.</p>
      <div class="class-grid">${LEVELS.map((l) => `<button type="button" data-cls="${l.id}" style="--c:${l.color}"><span class="lv-dot">${icon(l.icon)}</span><b>${esc(l.range)}</b><small>${esc(l.name)}</small></button>`).join("")}</div></section>`;
  }
  function wireClassPicker(after) {
    app.querySelectorAll("[data-cls]").forEach((b) => b.addEventListener("click", () => { store.set("cls", b.dataset.cls); after ? after() : U.go(location.hash || "#/"); }));
  }

  function home() {
    const lv = myLevel(), L = levelOf(P.xp), st = streak(), d = P.days[today()] || { a: 0 };
    const h = new Date().getHours();
    const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    const into = P.xp - xpFor(L), span = xpFor(L + 1) - xpFor(L);
    const week = Array.from({ length: 7 }, (_, k) => {
      const dt = new Date(); dt.setDate(dt.getDate() - (6 - k));
      const on = P.days[dkey(dt)] && P.days[dkey(dt)].s;
      return `<i class="${on ? "on" : ""} ${k === 6 ? "today" : ""}" title="${dkey(dt)}">${"SMTWTFS"[dt.getDay()]}</i>`;
    }).join("");
    const last = SK[P.last], weakList = weak();
    const fotd = DAILY[Math.floor(Date.now() / 864e5) % DAILY.length];
    app.innerHTML = `
      <section class="hello">
        <div><small>${greet}</small><h1>Ready to practise?</h1></div>
        <a class="lvl-badge" href="#/me" aria-label="Level ${L}, ${P.xp} XP">${ring((into / span) * 100, "ring sm")}<b>${L}</b><small>Level</small></a>
      </section>
      ${lv ? "" : classPicker()}
      ${dailyCard()}
      <div class="today">
        <div class="goal-card card"><span class="mini-ring">${ring(Math.min(100, (d.a / P.goal) * 100), "ring sm")}<b>${Math.min(99, d.a)}</b></span><span><small>Today's goal</small><b>${d.a} of ${P.goal}</b><span class="muted">questions</span></span></div>
        <a class="streak-card card" href="#/me"><span class="flame-ic ${d.s ? "on" : ""}">${icon("flame")}</span><span><b>${st}</b><small>day streak</small></span><span class="week" aria-label="Last 7 days">${week}</span></a>
      </div>
      <a class="quick-btn" href="#/quick"><span class="qb-ic">${icon("play")}</span><span><b>Quick quiz</b><small>5 questions from ${lv ? esc(lv.range) : "every class"}</small></span>${icon("arrow")}</a>
      <div class="sec-head"><h2>Practice modes</h2><a href="#/practice">See all</a></div>
      <div class="mode-grid">${["topics", "speed", "survival", "test", "mock", "mistakes"].map(modeTile).join("")}</div>
      ${last || weakList.length ? `<div class="sec-head"><h2>Keep going</h2></div><div class="row-list">
        ${last ? `<a class="mode-row" href="#/practice/${last.id}" style="--c:${LV[last.level].color}"><span class="mode-ic">${icon("refresh")}</span><span class="mode-txt"><b>${esc(last.name)}</b><small>Pick up where you left off${acc(last.id) != null ? ` · ${acc(last.id)}% accuracy` : ""}</small></span>${icon("right")}</a>` : ""}
        ${weakList.filter((s) => s !== last).slice(0, 3).map((s) => `<a class="mode-row" href="#/practice/${s.id}" style="--c:var(--bad)"><span class="mode-ic">${icon("target")}</span><span class="mode-txt"><b>${esc(s.name)}</b><small>Needs work · ${acc(s.id)}% accuracy</small></span>${icon("right")}</a>`).join("")}
      </div>` : ""}
      <div class="sec-head"><h2>Learn and tools</h2></div>
      <div class="link-grid">
        <a href="#/learn"><span>${icon("book")}</span>Topics</a>
        <a href="#/formulas"><span>${icon("sigma")}</span>Formulas</a>
        <a href="#/tools/calculator"><span>${icon("calc")}</span>Calculator</a>
        <a href="#/tools/graph"><span>${icon("graph")}</span>Graphs</a>
      </div>
      <a class="card fotd" href="#/topic/${fotd.topic.id}">
        <small>${icon("sparkle")} Formula of the day</small>
        <b>${esc(fotd.name)}</b>
        <div class="f-tex">${tex(fotd.tex, true)}</div>
        <span class="muted">From ${esc(fotd.topic.title)}</span>
      </a>`;
    wireClassPicker();
    return "";
  }

  function hub() {
    app.innerHTML = `
      <h1 class="page-title">Practice</h1>
      <p class="lead small">Questions are generated fresh every time, so you'll never run out.</p>
      ${myLevel() ? "" : classPicker()}
      ${dailyCard()}
      <h2 class="group-h">Everyday</h2><div class="row-list">${["quick", "topics"].map(modeRow).join("")}</div>
      <h2 class="group-h">Challenges</h2><div class="row-list">${["speed", "survival"].map(modeRow).join("")}</div>
      <h2 class="group-h">Exam prep</h2><div class="row-list">${["test", "mock"].map(modeRow).join("")}</div>
      <h2 class="group-h">Review</h2><div class="row-list">${modeRow("mistakes")}</div>`;
    wireClassPicker();
    return "Practice";
  }

  function topicsView(lv) {
    lv = lv || myLevel() || LEVELS[0];
    const ts = TOPICS.filter((t) => t.level === lv.id && t.skills.length);
    app.innerHTML = `
      ${back("#/practice", "Practice")}
      <h1 class="page-title">Topic practice</h1>
      <p class="lead small">Pick a skill. Stars show how well you know it: one for 50% accuracy, three for 90% over 20 questions.</p>
      ${stageChips(lv, (l) => `#/topics/${l.id}`)}
      ${ts.map((t) => `<section class="skill-group" style="--c:${lv.color}">
        <div class="sg-head"><h3>${esc(t.title)}</h3><a href="#/topic/${t.id}">${icon("book")} Revise</a></div>
        <div class="row-list">${t.skills.map((id) => {
          const s = SK[id], a = acc(id);
          return `<a class="skill-row" href="#/practice/${id}"><span class="sr-main"><b>${esc(s.name)}</b>${a != null ? progress(a, s.name + " accuracy") : `<small class="muted">Not tried yet</small>`}</span><span class="sr-meta">${starHtml(stars(id))}<small>${a != null ? a + "%" : "New"}</small></span>${icon("right")}</a>`;
        }).join("")}</div>
      </section>`).join("")}`;
    return "Topic practice";
  }

  function skillSetup(s) {
    const lv = LV[s.level], t = TP[s.topic], a = acc(s.id), b = P.best["s:" + s.id];
    const typeable = Array.from({ length: 6 }, () => s.gen()).some((it) => it.ans);
    let n = store.get("cnt", 10), mode = typeable ? P.mode : "mcq";
    app.innerHTML = `
      ${back("#/topics/" + lv.id, "Topic practice")}
      <section class="setup" style="--c:${lv.color}">
        <div class="setup-head"><span class="lv-ic big">${icon(lv.icon)}</span><div><small>${esc(lv.range)} · ${esc(t.title)}</small><h1>${esc(s.name)}</h1></div></div>
        <div class="mini-stats">
          <div><small>Best round</small><b>${b != null ? b + "%" : "–"}</b></div>
          <div><small>Accuracy</small><b>${a != null ? a + "%" : "–"}</b></div>
          <div><small>Mastery</small>${starHtml(stars(s.id))}</div>
        </div>
        ${typeable ? `<label class="lbl">How do you want to answer?</label>
        <div class="seg wide big" id="mSeg" role="group" aria-label="Answer style">
          <button type="button" data-v="mcq" aria-pressed="${mode === "mcq"}">${icon("grid")} Tap to choose</button>
          <button type="button" data-v="type" aria-pressed="${mode === "type"}">${icon("calc")} Type it</button>
        </div>` : `<p class="hint">${icon("grid")} These questions are multiple choice.</p>`}
        <label class="lbl">Questions</label>
        <div class="seg wide big" id="nSeg" role="group" aria-label="Number of questions">${[5, 10, 20].map((k) => `<button type="button" data-v="${k}" aria-pressed="${k === n}">${k}</button>`).join("")}</div>
        <button type="button" class="btn primary block lg" id="go">${icon("play")} Start practice</button>
        <a class="link-btn center" href="#/topic/${t.id}">Revise ${esc(t.title)} first</a>
      </section>`;
    const seg = (id, f) => {
      const el = $(id);
      if (!el) return;
      el.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        el.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === btn));
        f(btn.dataset.v);
      });
    };
    seg("mSeg", (v) => { mode = v; P.mode = v; save(); });
    seg("nSeg", (v) => { n = +v; store.set("cnt", n); });
    const start = () => {
      P.last = s.id; save();
      const nextQ = source([s]);
      play({
        color: lv.color, back: "#/practice/" + s.id, total: n, xp: 10, answer: mode, next: () => nextQ(), restart: start, againLabel: "Practise again",
        onEnd(r) {
          if (r.n >= 5) {
            const pct = Math.round((100 * r.score) / r.n), prev = P.best["s:" + s.id];
            if (prev == null || pct > prev) { P.best["s:" + s.id] = pct; r.newBest = prev != null; save(); }
          }
          r.sub = `${esc(s.name)} · ${r.score} of ${r.n} correct`;
        },
      });
    };
    $("go").addEventListener("click", start);
    return s.name;
  }

  function topicQuiz(t) {
    const lv = LV[t.level];
    const start = () => {
      const nextQ = source(t.skills.map((id) => SK[id]));
      play({ color: lv.color, back: "#/topic/" + t.id, total: 10, xp: 10, answer: P.mode, next: () => nextQ(), restart: start, onEnd(r) { r.sub = `${esc(t.title)} · ${r.score} of ${r.n} correct`; } });
    };
    start();
    return t.title + " quiz";
  }

  function quick() {
    const lv = myLevel();
    const list = lv ? stageSkills(lv) : SKILLS;
    const start = () => {
      const nextQ = source(list);
      play({ color: MODES.quick.color, back: "#/", total: 5, xp: 10, answer: P.mode, next: () => nextQ(), restart: start, againLabel: "Another quick quiz", onEnd(r) { r.sub = `Quick quiz · ${lv ? esc(lv.range) : "all classes"}`; } });
    };
    start();
    return "Quick quiz";
  }

  function daily() {
    const lv = myLevel();
    const done = P.daily && P.daily.date === today();
    if (!lv) {
      app.innerHTML = `${back("#/practice", "Practice")}${modeHero("daily")}${classPicker()}`;
      wireClassPicker();
      return "Daily challenge";
    }
    app.innerHTML = `
      ${back("#/practice", "Practice")}
      ${modeHero("daily")}
      ${done ? `<section class="card done-card">
          <div class="res-ring sm">${ring((P.daily.score / P.daily.n) * 100)}<div class="res-num"><b>${P.daily.score}/${P.daily.n}</b></div></div>
          <div><h2>Done for today</h2><p class="muted">A new challenge unlocks in ${untilMidnight()}. Your streak is ${streak()} day${streak() === 1 ? "" : "s"}.</p></div>
        </section>
        <div class="row-list">${modeRow("quick")}${modeRow("speed")}</div>`
      : `<section class="card info-card">
          <ul class="facts">
            <li>${icon("list")} 10 questions from ${esc(lv.range)} (${esc(lv.name)})</li>
            <li>${icon("star")} +10 XP per correct answer, plus a 50 XP bonus</li>
            <li>${icon("flame")} Keeps your streak going</li>
            <li>${icon("lock")} Same questions for everyone in your class today</li>
          </ul>
          <button type="button" class="btn primary block lg" id="go">${icon("play")} Start today's challenge</button>
        </section>`}`;
    const go = $("go");
    if (go) go.addEventListener("click", () => {
      const base = today().split("-").join("") * 7 + LEVELS.indexOf(lv) * 104729;
      const list = stageSkills(lv), seen = new Set();
      const items = [];
      for (let k = 0; items.length < 10 && k < 40; k++) {
        const it = seeded(base + k * 7919, () => make(list[Math.floor(Math.random() * list.length)]));
        if (!seen.has(it.q)) { seen.add(it.q); items.push(it); }
      }
      play({
        color: MODES.daily.color, back: "#/daily", total: items.length, xp: 10, answer: "mcq", next: (st) => items[st.i],
        onEnd(r) {
          if (!(P.daily && P.daily.date === today())) {
            P.daily = { date: today(), score: r.score, n: r.n };
            P.dailies++;
            bonus(50);
            r.xp += 50;
            save();
          }
          r.sub = `Daily challenge · ${esc(lv.range)} · includes a 50 XP bonus`;
        },
      });
    });
    return "Daily challenge";
  }

  const SPEED = [
    { id: "tables", name: "Times tables", desc: "Multiplication and division facts", ids: ["tables", "divide"] },
    { id: "mental", name: "Mental maths", desc: "Adding, subtracting, percentages and roots", ids: ["add", "missing", "tables", "divide", "integers", "bodmas", "percent", "sqrt", "round", "decimals"] },
    { id: "class", name: "My class", desc: "Quick questions from your stage", ids: null },
    { id: "mixed", name: "Everything", desc: "Quick questions from every stage", ids: SKILLS.filter((s) => s.quick).map((s) => s.id) },
  ];
  function speedList(set) {
    if (set.ids) return set.ids.map((id) => SK[id]);
    const lv = myLevel() || LEVELS[1], i = LEVELS.indexOf(lv);
    let list = SKILLS.filter((s) => s.quick && s.level === lv.id);
    for (let j = i - 1; list.length < 6 && j >= 0; j--) list = list.concat(SKILLS.filter((s) => s.quick && levelIndex(s) === j));
    return list;
  }
  function speed() {
    let sel = store.get("speedSet", "mental");
    app.innerHTML = `
      ${back("#/practice", "Practice")}
      ${modeHero("speed")}
      <h2 class="group-h">Choose a set</h2>
      <div class="choice-list" id="sets" role="radiogroup">${SPEED.map((s) => `<button type="button" class="choice" role="radio" data-id="${s.id}" aria-checked="${s.id === sel}">
        <span class="radio"></span><span class="ch-txt"><b>${esc(s.name)}</b><small>${esc(s.id === "class" && myLevel() ? myLevel().range : s.desc)}</small></span><span class="ch-best">${P.best["speed:" + s.id] ? `${icon("trophy")} ${P.best["speed:" + s.id]}` : ""}</span></button>`).join("")}</div>
      <button type="button" class="btn primary block lg" id="go">${icon("bolt")} Start · 60 seconds</button>`;
    $("sets").addEventListener("click", (e) => {
      const b = e.target.closest("[data-id]");
      if (!b) return;
      sel = b.dataset.id;
      store.set("speedSet", sel);
      $("sets").querySelectorAll("[data-id]").forEach((x) => x.setAttribute("aria-checked", x === b));
    });
    const start = () => {
      const set = SPEED.find((s) => s.id === sel), nextQ = source(speedList(set));
      play({
        color: MODES.speed.color, back: "#/speed", time: 60, instant: true, xp: 5, answer: "mcq", ringMax: 30, next: () => nextQ(), restart: start, againLabel: "Go again",
        tag: (st, s) => `${set.name} · ${s.name}`,
        onEnd(r) {
          const k = "speed:" + set.id, prev = P.best[k];
          if (r.score > (prev || 0)) { P.best[k] = r.score; r.newBest = prev != null; save(); }
          r.title = r.score >= 25 ? "Lightning fast!" : r.score >= 15 ? "Speedy!" : r.score >= 8 ? "Nice run!" : "Warming up!";
          r.sub = `${esc(set.name)}${P.best[k] ? ` · best ${P.best[k]}` : ""}`;
        },
      });
    };
    $("go").addEventListener("click", start);
    return "Speed round";
  }

  function survival() {
    const b = P.best.survival || 0;
    app.innerHTML = `
      ${back("#/practice", "Practice")}
      ${modeHero("survival")}
      <section class="card info-card">
        <ul class="facts">
          <li>${icon("heart")} You have 3 lives. A wrong answer costs one.</li>
          <li>${icon("map")} Every 4 correct answers moves you up a stage, from Class 1 to college.</li>
          <li>${icon("bulb")} After a mistake you'll see how to solve it.</li>
          <li>${icon("trophy")} Your best: ${b ? `${b} correct` : "not played yet"}</li>
        </ul>
        <button type="button" class="btn primary block lg" id="go">${icon("play")} Start</button>
      </section>`;
    const start = () => {
      const srcs = LEVELS.map((l) => source(stageSkills(l)));
      let stage = 0;
      play({
        color: MODES.survival.color, back: "#/survival", lives: 3, autoCorrect: true, xp: 10, answer: "mcq", restart: start, againLabel: "Try again",
        next: (st) => { stage = Math.min(LEVELS.length - 1, Math.floor(st.score / 4)); return srcs[stage](); },
        tag: (st, s) => `Stage ${stage + 1} · ${s.name}`,
        barPct: (st) => (stage >= LEVELS.length - 1 ? 100 : ((st.score % 4) / 4) * 100),
        ringMax: 25,
        onEnd(r) {
          const prev = P.best.survival;
          if (r.score > (prev || 0)) { P.best.survival = r.score; r.newBest = prev != null; save(); }
          const reached = LEVELS[Math.min(LEVELS.length - 1, Math.floor(r.score / 4))];
          r.title = `You reached ${reached.name}`;
          r.sub = `${r.score} correct before running out of lives${P.best.survival ? ` · best ${P.best.survival}` : ""}`;
        },
      });
    };
    $("go").addEventListener("click", start);
    return "Survival";
  }

  function testBuilder(qs) {
    const pre = qs.get("topic");
    const lv = LV[qs.get("stage")] || (pre && TP[pre] && LV[TP[pre].level]) || myLevel() || LEVELS[0];
    const ts = TOPICS.filter((t) => t.level === lv.id && t.skills.length);
    let n = store.get("testN", 10), timer = store.get("testT", 60);
    app.innerHTML = `
      ${back("#/practice", "Practice")}
      ${modeHero("test")}
      <h2 class="group-h">1. Stage</h2>
      ${stageChips(lv, (l) => `#/test?stage=${l.id}`)}
      <div class="group-h row"><h2>2. Chapters</h2><button type="button" class="link-btn" id="all">Select all</button></div>
      <div class="check-list" id="chk">${ts.map((t) => `<label class="check"><input type="checkbox" value="${t.id}" ${t.id === pre ? "checked" : ""}><span class="box">${icon("check")}</span><span class="ck-txt"><b>${esc(t.title)}</b><small>${t.skills.length} question type${t.skills.length > 1 ? "s" : ""}</small></span></label>`).join("")}</div>
      <h2 class="group-h">3. Settings</h2>
      <div class="card settings">
        <div class="set-row"><span>Questions</span><div class="seg" id="nSeg">${[10, 15, 20, 30].map((k) => `<button type="button" data-v="${k}" aria-pressed="${k === n}">${k}</button>`).join("")}</div></div>
        <div class="set-row"><span>Time limit</span><div class="seg" id="tSeg">${[[0, "Off"], [60, "1 min each"], [30, "30 s each"]].map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${v === timer}">${l}</button>`).join("")}</div></div>
      </div>
      <div class="sticky-acts single"><button type="button" class="btn primary block lg" id="go">${icon("clipboard")} Start test</button></div>`;
    const chk = $("chk"), go = $("go");
    const chosen = () => [...chk.querySelectorAll("input:checked")].map((x) => TP[x.value]);
    const paint = () => { const c = chosen().length; go.disabled = !c; go.innerHTML = `${icon("clipboard")} ${c ? `Start test · ${c} chapter${c > 1 ? "s" : ""}` : "Choose at least one chapter"}`; };
    chk.addEventListener("change", paint);
    $("all").addEventListener("click", () => { const all = chk.querySelectorAll("input"); const on = [...all].some((x) => !x.checked); all.forEach((x) => { x.checked = on; }); paint(); });
    const seg = (id, f) => $(id).addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; $(id).querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b)); f(+b.dataset.v); });
    seg("nSeg", (v) => { n = v; store.set("testN", v); });
    seg("tSeg", (v) => { timer = v; store.set("testT", v); });
    paint();
    go.addEventListener("click", () => {
      const tp = chosen();
      if (!tp.length) return;
      const list = tp.flatMap((t) => t.skills.map((id) => SK[id]));
      const title = tp.length === 1 ? tp[0].title : `${lv.range} · ${tp.length} chapters`;
      const start = () => exam({
        title, color: MODES.test.color, back: location.hash, items: batch(list, n), time: timer ? timer * n : 0, restart: start, againLabel: "New test, same chapters",
        onEnd(r) { const p = Math.round((100 * r.score) / r.n); r.title = `Grade ${grade(p)}`; r.sub = `${r.score} of ${r.n} correct · ${esc(title)}`; },
      });
      start();
    });
    return "Chapter test";
  }

  function mock() {
    const mine = myLevel();
    const order = mine ? [mine, ...LEVELS.filter((l) => l !== mine)] : LEVELS;
    app.innerHTML = `
      ${back("#/practice", "Practice")}
      ${modeHero("mock")}
      <div class="row-list">${order.map((l) => {
        const b = P.best["mock:" + l.id];
        return `<button type="button" class="mode-row" data-lv="${l.id}" style="--c:${l.color}"><span class="mode-ic">${icon(l.icon)}</span><span class="mode-txt"><b>${esc(l.range)} mock test${l === mine ? ` <span class="tag">Your class</span>` : ""}</b><small>${esc(l.name)} · 20 questions · 30 minutes</small><em>${b != null ? `Best ${b}%` : "Not taken yet"}</em></span>${icon("right")}</button>`;
      }).join("")}</div>`;
    app.querySelectorAll("[data-lv]").forEach((b) => b.addEventListener("click", async () => {
      const l = LV[b.dataset.lv];
      const ok = await ask(`Start the ${l.range} mock test?`, "20 questions from the whole stage, 30 minutes. The timer starts straight away, and answers are shown when you submit.", "Start test", "Not now");
      if (!ok) return;
      const start = () => exam({
        title: `${l.range} mock test`, color: l.color, back: "#/mock", items: batch(stageSkills(l), 20), time: 30 * 60, restart: start, againLabel: "Take another mock",
        onEnd(r) {
          const p = Math.round((100 * r.score) / r.n), k = "mock:" + l.id, prev = P.best[k];
          if (prev == null || p > prev) { P.best[k] = p; r.newBest = prev != null; save(); }
          r.title = `Grade ${grade(p)}`;
          r.sub = `${r.score} of ${r.n} correct · ${p}% · best ${P.best[k]}%`;
        },
      });
      start();
    }));
    return "Mock test";
  }

  function mistakes() {
    const list = mist();
    app.innerHTML = `
      ${back("#/practice", "Practice")}
      ${modeHero("mistakes")}
      ${list.length ? `<button type="button" class="btn primary block lg" id="go">${icon("refresh")} Fix ${Math.min(10, list.length)} mistake${list.length > 1 ? "s" : ""}</button>
        <div class="sec-head"><h2>${list.length} saved</h2><button type="button" class="link-btn" id="clear">Clear all</button></div>
        <div class="rv-list">${list.map((m, k) => {
          const s = SK[m.skill];
          return `<article class="rv no"><div class="rv-head"><span class="rv-n">${icon(s ? LV[s.level].icon : "x")}</span><div class="rv-q"><small class="muted">${esc(s ? s.name : "")}</small>${rich(m.q)}</div><button type="button" class="icon-btn sm" data-del="${k}" aria-label="Remove">${icon("trash")}</button></div>
            <div class="rv-a"><div><small>Correct answer</small><span>${rich(m.show)}</span></div></div>
            <details class="working"><summary>${icon("bulb")} How to solve it</summary><div>${rich(m.how)}</div></details></article>`;
        }).join("")}</div>`
      : `<div class="empty-state card"><span class="big-ic">${icon("check")}</span><h2>Nothing to fix</h2><p class="muted">Questions you get wrong in any mode are saved here so you can try them again.</p><a class="btn primary" href="#/quick">${icon("play")} Take a quick quiz</a></div>`}`;
    const go = $("go");
    if (go) go.addEventListener("click", () => {
      const items = shuffle(mist().slice()).slice(0, 10).map((m) => Object.assign({}, m, { fromMistakes: true, choices: m.choices.slice() }));
      items.forEach((it) => { const right = it.choices[it.ci]; shuffle(it.choices); it.ci = it.choices.indexOf(right); });
      play({ color: MODES.mistakes.color, back: "#/mistakes", total: items.length, xp: 10, answer: P.mode, next: (st) => items[st.i], onEnd(r) { r.sub = `${r.score} cleared · ${mist().length} left to fix`; } });
    });
    const clear = $("clear");
    if (clear) clear.addEventListener("click", async () => { if (await ask("Clear all mistakes?", "This removes every saved question from the list.", "Clear all", "Cancel", true)) { store.set("mist", []); U.go("#/mistakes"); } });
    app.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => { const l = mist(); l.splice(+b.dataset.del, 1); store.set("mist", l); U.go("#/mistakes"); }));
    return "Mistakes";
  }

  function me() {
    const L = levelOf(P.xp), into = P.xp - xpFor(L), span = xpFor(L + 1) - xpFor(L);
    const lv = myLevel();
    const weeks = 16, start = new Date();
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - (weeks - 1) * 7);
    const cells = [];
    for (let k = 0; k < weeks * 7; k++) {
      const d = new Date(start); d.setDate(start.getDate() + k);
      const key = dkey(d), a = (P.days[key] && P.days[key].a) || 0, future = d > new Date();
      const lvl = future ? "f" : a === 0 ? 0 : a < 10 ? 1 : a < 20 ? 2 : a < 40 ? 3 : 4;
      cells.push(`<i class="h${lvl}" title="${key}: ${a} question${a === 1 ? "" : "s"}"></i>`);
    }
    const weakList = weak();
    app.innerHTML = `
      <h1 class="page-title">Me</h1>
      <section class="profile card">
        <span class="lvl-ring">${ring((into / span) * 100)}<b>${L}</b><small>Level</small></span>
        <div class="pf-txt"><b>${P.xp.toLocaleString("en-IN")} XP</b><span class="muted">${(xpFor(L + 1) - P.xp).toLocaleString("en-IN")} XP to level ${L + 1}</span>${progress((into / span) * 100, "Level progress")}
          <button type="button" class="chip lv" id="clsBtn" style="--c:${lv ? lv.color : "var(--accent)"}">${icon(lv ? lv.icon : "user")} ${lv ? esc(lv.range) : "Choose your class"}</button></div>
      </section>
      <div class="stat-tiles">
        <div><span style="--c:#f97316">${icon("flame")}</span><b>${streak()}</b><small>Day streak</small></div>
        <div><span style="--c:#f59e0b">${icon("trophy")}</span><b>${bestStreak()}</b><small>Best streak</small></div>
        <div><span style="--c:#6d4aff">${icon("check")}</span><b>${P.n.toLocaleString("en-IN")}</b><small>Answered</small></div>
        <div><span style="--c:#10b981">${icon("target")}</span><b>${P.n ? Math.round((100 * P.c) / P.n) + "%" : "–"}</b><small>Accuracy</small></div>
        <div><span style="--c:#3b82f6">${icon("play")}</span><b>${P.sessions}</b><small>Quizzes</small></div>
        <div><span style="--c:#0ea5e9">${icon("refresh")}</span><b>${P.fixed}</b><small>Fixed</small></div>
      </div>
      <h2>Activity</h2>
      <div class="card heat-card"><div class="heat" style="--w:${weeks}">${cells.join("")}</div><div class="heat-key"><span>Less</span><i class="h0"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i><i class="h4"></i><span>More</span></div></div>
      <h2>Needs work</h2>
      ${weakList.length ? `<div class="row-list">${weakList.map((s) => `<a class="skill-row" href="#/practice/${s.id}"><span class="sr-main"><b>${esc(s.name)}</b>${progress(acc(s.id), s.name)}</span><span class="sr-meta"><small>${acc(s.id)}%</small></span>${icon("right")}</a>`).join("")}</div>`
        : `<p class="muted small-p">Nothing yet. Skills where your accuracy is under 70% will show up here.</p>`}
      <h2>Badges <small class="muted">${Object.keys(P.badges).length} of ${BADGES.length}</small></h2>
      <div class="badge-grid">${BADGES.map((b) => `<div class="badge ${P.badges[b.id] ? "on" : ""}"><span>${icon(P.badges[b.id] ? b.icon : "lock")}</span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></div>`).join("")}</div>
      <h2>Mastery</h2>
      ${LEVELS.map((l) => {
        const list = stageSkills(l), tried = list.filter((s) => P.sk[s.id]).length;
        return `<details class="mastery card" style="--c:${l.color}"${l === lv ? " open" : ""}><summary><span class="lv-dot">${icon(l.icon)}</span><b>${esc(l.name)}</b><small>${tried}/${list.length} tried</small></summary>
          <div class="row-list">${list.map((s) => { const a = acc(s.id); return `<a class="skill-row" href="#/practice/${s.id}"><span class="sr-main"><b>${esc(s.name)}</b>${a != null ? progress(a, s.name) : `<small class="muted">Not tried yet</small>`}</span><span class="sr-meta">${starHtml(stars(s.id))}</span></a>`; }).join("")}</div></details>`;
      }).join("")}
      <h2>Settings</h2>
      <div class="card settings">
        <div class="set-row"><span>Answer style</span><div class="seg" id="sMode"><button type="button" data-v="mcq" aria-pressed="${P.mode === "mcq"}">Tap</button><button type="button" data-v="type" aria-pressed="${P.mode === "type"}">Type</button></div></div>
        <div class="set-row"><span>Daily goal</span><div class="seg" id="sGoal">${[10, 20, 30, 50].map((g) => `<button type="button" data-v="${g}" aria-pressed="${g === P.goal}">${g}</button>`).join("")}</div></div>
        <div class="set-row"><span>${icon("volume")} Sound effects</span><button type="button" class="switch" role="switch" id="sSound" aria-checked="${P.sound}"><i></i></button></div>
        <div class="set-row"><span>${icon("phone")} Vibrate on mistakes</span><button type="button" class="switch" role="switch" id="sHap" aria-checked="${P.haptic}"><i></i></button></div>
        <div class="set-row"><span>Reset all progress</span><button type="button" class="btn sm danger-ghost" id="sReset">${icon("trash")} Reset</button></div>
      </div>
      <p class="muted small-p">Your progress is saved only in this browser on this device. Nothing is uploaded.</p>`;
    $("clsBtn").addEventListener("click", async () => {
      const m = document.createElement("div");
      m.className = "modal";
      m.innerHTML = `<div class="modal-card">${classPicker()}</div>`;
      document.body.appendChild(m);
      requestAnimationFrame(() => m.classList.add("in"));
      m.addEventListener("click", (e) => { if (e.target === m) m.remove(); });
      m.querySelectorAll("[data-cls]").forEach((b) => b.addEventListener("click", () => { store.set("cls", b.dataset.cls); m.remove(); U.go("#/me"); }));
    });
    const seg = (id, f) => $(id).addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; $(id).querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b)); f(b.dataset.v); save(); });
    seg("sMode", (v) => { P.mode = v; });
    seg("sGoal", (v) => { P.goal = +v; });
    const sw = (id, k) => $(id).addEventListener("click", () => { P[k] = !P[k]; $(id).setAttribute("aria-checked", P[k]); save(); if (k === "sound" && P[k]) beep(true); });
    sw("sSound", "sound");
    sw("sHap", "haptic");
    $("sReset").addEventListener("click", async () => {
      if (!(await ask("Reset all progress?", "This deletes your XP, streaks, badges, scores and saved mistakes on this device. It can't be undone.", "Reset everything", "Cancel", true))) return;
      for (const k of ["prof", "mist", "done", "last", "cls"]) try { localStorage.removeItem("mz-" + k); } catch (e) {}
      location.hash = "#/";
      location.reload();
    });
    return "Me";
  }

  function route(a, b, qs) {
    const R = (title, section = "practice") => ({ title, section });
    switch (a) {
      case "": return R(home(), "home");
      case "practice": return b ? (SK[b] ? R(skillSetup(SK[b])) : null) : R(hub());
      case "topics": return R(topicsView(LV[b]));
      case "quiz": return TP[b] && TP[b].skills.length ? R(topicQuiz(TP[b]), "learn") : null;
      case "quick": return R(quick(), "home");
      case "daily": return R(daily());
      case "speed": return R(speed());
      case "survival": return R(survival());
      case "test": return R(testBuilder(qs));
      case "mock": return R(mock());
      case "mistakes": return R(mistakes());
      case "me": return R(me(), "me");
      default: return null;
    }
  }

  window.MZQ = { route };
  paintChrome();
})();
