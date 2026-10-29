(function () {
  "use strict";

  const E = window.MZE;
  const LEVELS = window.MZ_LEVELS, TOPICS = window.MZ_TOPICS, SKILLS = window.MZ_SKILLS;
  const app = document.getElementById("app");

  const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
  const LV = byId(LEVELS), TP = byId(TOPICS), SK = byId(SKILLS);
  SKILLS.forEach((s) => { s.level = TP[s.topic].level; });
  const FORMULAS = TOPICS.flatMap((t) => t.formulas.map((f) => ({ ...f, topic: t })));
  const BRANCHES = [...new Set(TOPICS.map((t) => t.branch))];
  const FEATURED = new Set([
    "Quadratic formula", "Pythagoras' theorem", "Euler's formula", "Binomial theorem", "Taylor series", "Heron's formula",
    "Fundamental theorem", "Chain rule", "Compound amount", "Bayes' theorem", "Sum of n terms", "Infinite GP", "Sphere",
    "Pythagorean identity", "Sine of a sum", "Normal density", "Fermat's little theorem", "Definition", "Integration by parts",
    "Combinations", "Handshake lemma", "Euler's formula for planar graphs", "Section formula", "Double angle", "Sum of cubes",
  ]);
  const DAILY = FORMULAS.filter((f) => FEATURED.has(f.name));

  const store = {
    get(k, d) { try { const v = localStorage.getItem("mz-" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("mz-" + k, JSON.stringify(v)); } catch (e) {} },
  };
  const done = new Set(store.get("done", []));
  const saveDone = () => store.set("done", [...done]);

  /* ---------- Rendering helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function tex(s, display) {
    if (window.katex) {
      try { return window.katex.renderToString(s, { displayMode: !!display, throwOnError: false, output: "html" }); } catch (e) {}
    }
    return `<code class="tex-fallback">${esc(s)}</code>`;
  }

  function rich(s) {
    return String(s)
      .split(/(\$[^$]+\$)/g)
      .map((p) => (p.length > 2 && p[0] === "$" && p[p.length - 1] === "$" ? tex(p.slice(1, -1)) : esc(p)))
      .join("");
  }

  function nt(x) {
    if (!isFinite(x)) return "\\text{undefined}";
    const f = E.toFrac(x, 1000);
    if (f && f[1] !== 1) return `${f[0] < 0 ? "-" : ""}\\frac{${Math.abs(f[0])}}{${f[1]}}`;
    const s = E.fmt(x);
    const m = /^(-?[\d.]+)e([+-]\d+)$/.exec(s);
    return m ? `${m[1]} \\times 10^{${+m[2]}}` : s;
  }
  const pn = (x) => (x < 0 ? `(${nt(x)})` : nt(x));

  function tp(list) {
    let s = "";
    for (const [c, v] of list) {
      if (!c) continue;
      const a = Math.abs(c);
      const body = v ? (a === 1 ? v : nt(a) + v) : nt(a);
      s += s ? (c < 0 ? " - " : " + ") + body : (c < 0 ? "-" : "") + body;
    }
    return s || "0";
  }

  function plain(list) {
    let s = "";
    for (const [c, v] of list) {
      if (!c) continue;
      const a = Math.abs(c);
      const body = v ? (a === 1 ? v : E.fmt(a) + v) : E.fmt(a);
      s += s ? (c < 0 ? " - " : " + ") + body : (c < 0 ? "-" : "") + body;
    }
    return s || "0";
  }

  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    sigma: '<path d="M18 7V4H6l6 8-6 8h12v-3"/>',
    tools: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    calc: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 10.5h.01M12 10.5h.01M16 10.5h.01M8 14.5h.01M12 14.5h.01M16 14.5h.01M8 18.5h.01M12 18.5h.01M16 18.5h.01"/>',
    graph: '<path d="M3 3v18h18"/><path d="m7 15 4-6 4 3 5-7"/>',
    solver: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10h8M8 14h8"/>',
    frac: '<circle cx="12" cy="6" r="1.5"/><path d="M5 12h14"/><circle cx="12" cy="18" r="1.5"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
    percent: '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
    matrix: '<path d="M7 4H5v16h2M17 4h2v16h-2"/><path d="M9.5 9h.01M14.5 9h.01M9.5 15h.01M14.5 15h.01"/>',
    stats: '<path d="M3 21h18"/><rect x="5" y="11" width="3" height="7" rx="1"/><rect x="10.5" y="6" width="3" height="12" rx="1"/><rect x="16" y="14" width="3" height="4" rx="1"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/>',
    blocks: '<rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><rect x="8" y="3" width="8" height="8" rx="1.5"/>',
    ruler: '<path d="M4 20V4l16 16z"/><path d="M8 16v-4.5l4.5 4.5z"/>',
    axes: '<path d="M4 4v16h16"/><path d="M7 16c3-8 6-8 11-10"/>',
    integral: '<path d="M16 4.5c-1.6-1.3-4.3-.9-4.6 2l-1.2 11c-.3 2.9-3 3.3-4.6 2"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3.5 2.7 8.5 2.7 12 0v-5"/><path d="M22 9v6"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  };
  const icon = (n) => `<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ""}</svg></span>`;

  const TOOLS = [
    { id: "calculator", name: "Scientific calculator", short: "Calculator", blurb: "Trig, logs, powers, roots and factorials, in degrees or radians.", icon: "calc", run: calcTool },
    { id: "graph", name: "Graph plotter", short: "Graphs", blurb: "Plot up to three functions. Drag to move; pinch or scroll to zoom.", icon: "graph", run: graphTool },
    { id: "solver", name: "Equation solver", short: "Solver", blurb: "Linear, quadratic and simultaneous equations, with every step shown.", icon: "solver", run: solverTool },
    { id: "fractions", name: "Fraction calculator", short: "Fractions", blurb: "Add, subtract, multiply and divide fractions and mixed numbers.", icon: "frac", run: fracTool },
    { id: "numbers", name: "Primes, HCF and LCM", short: "Primes", blurb: "Prime factorisation, divisors, and the HCF and LCM of any list.", icon: "hash", run: numberTool },
    { id: "percent", name: "Percentages", short: "Percent", blurb: "Percent of a number, percent change, and what percent one number is of another.", icon: "percent", run: percentTool },
    { id: "matrix", name: "Matrix calculator", short: "Matrices", blurb: "Determinant, inverse, transpose and eigenvalues for 2×2 and 3×3 matrices.", icon: "matrix", run: matrixTool },
    { id: "stats", name: "Statistics", short: "Statistics", blurb: "Mean, median, mode, quartiles, variance and standard deviation.", icon: "stats", run: statsTool },
  ];
  const TL = byId(TOOLS);

  /* ---------- Shared pieces ---------- */
  function levelStats(l) {
    const ts = TOPICS.filter((t) => t.level === l.id);
    const d = ts.filter((t) => done.has(t.id)).length;
    return { ts, d, pct: ts.length ? Math.round((d / ts.length) * 100) : 0 };
  }

  const progress = (pct, label) => `<div class="prog" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(label)}"><i style="width:${pct}%"></i></div>`;

  function levelCard(l, i) {
    const { ts, d, pct } = levelStats(l);
    return `<a class="level-card" href="#/learn/${l.id}" style="--c:${l.color}">
      <span class="lv-ic">${icon(l.icon)}</span>
      <small>Stage ${i + 1} · ${esc(l.range)}</small>
      <b>${esc(l.name)}</b>
      ${progress(pct, l.name + " progress")}
      <span class="muted">${d} of ${ts.length} learned</span>
    </a>`;
  }

  const toolCard = (t) => `<a class="tool-card" href="#/tools/${t.id}"><span class="tool-ic">${icon(t.icon)}</span><b>${esc(t.name)}</b><span>${esc(t.blurb)}</span></a>`;

  function formulaCard(f, withTopic) {
    return `<div class="f-card"><span class="f-name">${esc(f.name)}</span><div class="f-tex">${tex(f.tex, true)}</div>${withTopic ? `<a class="f-topic" href="#/topic/${f.topic.id}">${esc(f.topic.title)} ${icon("right")}</a>` : ""}</div>`;
  }

  const pageHead = (ic, title, lead, color) => `<div class="page-head"${color ? ` style="--c:${color}"` : ""}><span class="ph-ic">${icon(ic)}</span><div><h1>${esc(title)}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div></div>`;
  const back = (href, label) => `<a class="back" href="${href}">${icon("left")} ${esc(label)}</a>`;

  /* ---------- Views ---------- */
  function homeView() {
    const last = TP[store.get("last")];
    const fotd = DAILY[Math.floor(Date.now() / 864e5) % DAILY.length];
    const picks = ["linear", "quadratic", "percent", "frac-add", "trig", "derivative"].map((id) => SK[id]);
    app.innerHTML = `
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow">${icon("sparkle")} Free · no sign-up · works on any phone</span>
          <h1>All of maths, from counting to calculus.</h1>
          <p>${TOPICS.length} topics in five stages, ${FORMULAS.length} formulas, ${TOOLS.length} tools and practice questions that never run out.</p>
          <div class="hero-acts">
            <a class="btn light" href="#/learn">Start learning ${icon("arrow")}</a>
            <a class="btn glass" href="#/tools/calculator">${icon("calc")} Calculator</a>
          </div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="tile t1">${tex("e^{i\\pi} + 1 = 0")}</div>
          <div class="tile t2">${tex("a^2 + b^2 = c^2")}</div>
          <div class="tile t3">${tex("\\int_0^1 x^2\\,dx = \\tfrac13")}</div>
          <div class="tile t4">${tex("x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}")}</div>
        </div>
      </section>
      ${last ? `<a class="continue" href="#/topic/${last.id}" style="--c:${LV[last.level].color}">
        <span class="continue-ic">${icon(LV[last.level].icon)}</span>
        <span class="continue-txt"><small>Continue where you left off</small><b>${esc(last.title)}</b><span>${esc(LV[last.level].name)} · ${esc(last.branch)}</span></span>
        ${icon("right")}</a>` : ""}
      <div class="sec-head"><h2>Your roadmap</h2><a href="#/learn">See all</a></div>
      <div class="level-row">${LEVELS.map(levelCard).join("")}</div>
      <div class="sec-head"><h2>Tools</h2><a href="#/tools">All tools</a></div>
      <div class="tool-grid compact">${TOOLS.map(toolCard).join("")}</div>
      <div class="duo">
        <a class="card fotd" href="#/topic/${fotd.topic.id}">
          <small>${icon("sparkle")} Formula of the day</small>
          <b>${esc(fotd.name)}</b>
          <div class="f-tex">${tex(fotd.tex, true)}</div>
          <span class="muted">From ${esc(fotd.topic.title)}</span>
        </a>
        <div class="card practice-cta">
          <small>${icon("target")} Quick practice</small>
          <b>Ten questions, new ones every time</b>
          <div class="chip-links">${picks.map((s) => `<a href="#/practice/${s.id}" style="--c:${LV[s.level].color}">${esc(s.name)}</a>`).join("")}</div>
          <a class="btn primary" href="#/practice">All practice ${icon("arrow")}</a>
        </div>
      </div>`;
    return "";
  }

  function learnView() {
    app.innerHTML = `
      ${pageHead("map", "Learning roadmap", "Five stages, in order. Open a topic, read the key ideas and the worked example, mark it learned, then practise until it sticks.")}
      <ol class="road">
        ${LEVELS.map((l, i) => {
          const { ts, d, pct } = levelStats(l);
          return `<li class="road-stage" style="--c:${l.color}">
            <span class="road-node">${icon(l.icon)}</span>
            <div class="road-body card">
              <a class="road-head" href="#/learn/${l.id}">
                <span><small>Stage ${i + 1} · ${esc(l.range)}</small><b>${esc(l.name)}</b></span>
                <span class="pill">${d}/${ts.length}</span>
              </a>
              <p class="muted">${esc(l.blurb)}</p>
              ${progress(pct, l.name + " progress")}
              <ul class="road-topics">
                ${ts.map((t, k) => `<li><a href="#/topic/${t.id}" class="${done.has(t.id) ? "is-done" : ""}"><span class="tick">${done.has(t.id) ? icon("check") : k + 1}</span>${esc(t.title)}</a></li>`).join("")}
              </ul>
            </div>
          </li>`;
        }).join("")}
      </ol>`;
    return "Learning roadmap";
  }

  function levelView(l) {
    const i = LEVELS.indexOf(l);
    const { ts, d, pct } = levelStats(l);
    app.innerHTML = `
      ${back("#/learn", "Roadmap")}
      <section class="level-hero" style="--c:${l.color}">
        <span class="lv-ic big">${icon(l.icon)}</span>
        <small>Stage ${i + 1} · ${esc(l.range)}</small>
        <h1>${esc(l.name)}</h1>
        <p>${esc(l.blurb)}</p>
        ${progress(pct, l.name + " progress")}
        <span class="muted">${d} of ${ts.length} topics learned</span>
      </section>
      <div class="topic-list">
        ${ts.map((t, k) => `<a class="topic-card" href="#/topic/${t.id}" style="--c:${l.color}">
          <span class="tnum">${String(k + 1).padStart(2, "0")}</span>
          <span class="tbody">
            <b>${esc(t.title)}</b>
            <span class="tsum">${rich(t.summary)}</span>
            <span class="tmeta"><span>${esc(t.branch)}</span><span>${t.formulas.length} formula${t.formulas.length === 1 ? "" : "s"}</span>${t.skills.length ? `<span>${icon("target")} Practice</span>` : ""}</span>
          </span>
          <span class="tstate ${done.has(t.id) ? "is-done" : ""}">${icon(done.has(t.id) ? "check" : "right")}</span>
        </a>`).join("")}
      </div>
      <nav class="pager">
        ${i > 0 ? `<a href="#/learn/${LEVELS[i - 1].id}">${icon("left")}<span><small>Previous stage</small>${esc(LEVELS[i - 1].name)}</span></a>` : "<span></span>"}
        ${i < LEVELS.length - 1 ? `<a class="next" href="#/learn/${LEVELS[i + 1].id}"><span><small>Next stage</small>${esc(LEVELS[i + 1].name)}</span>${icon("right")}</a>` : ""}
      </nav>`;
    return l.name;
  }

  function topicView(t) {
    const l = LV[t.level];
    const idx = TOPICS.indexOf(t), prev = TOPICS[idx - 1], next = TOPICS[idx + 1];
    const tool = t.tool && TL[t.tool];
    store.set("last", t.id);
    app.innerHTML = `
      ${back(`#/learn/${l.id}`, l.name)}
      <header class="topic-head" style="--c:${l.color}">
        <div class="chips"><span class="chip lv">${icon(l.icon)} ${esc(l.range)}</span><span class="chip">${esc(t.branch)}</span></div>
        <h1>${esc(t.title)}</h1>
        <p class="lead">${rich(t.summary)}</p>
        <div class="acts">
          <button type="button" class="btn" id="doneBtn"></button>
          ${t.skills.map((s) => `<a class="btn primary" href="#/practice/${s}">${icon("target")} ${t.skills.length > 1 ? esc(SK[s].name) : "Practise"}</a>`).join("")}
          ${tool ? `<a class="btn" href="#/tools/${tool.id}">${icon(tool.icon)} ${esc(tool.short)}</a>` : ""}
        </div>
      </header>
      <section>
        <h2>Key ideas</h2>
        <ul class="ideas card">${t.ideas.map((s) => `<li>${rich(s)}</li>`).join("")}</ul>
      </section>
      <section>
        <h2>Formulas</h2>
        <div class="formula-grid">${t.formulas.map((f) => formulaCard(f)).join("")}</div>
      </section>
      <section>
        <h2>Worked example</h2>
        <div class="example card" style="--c:${l.color}">
          <p class="ex-q">${icon("bulb")}<span>${rich(t.example.q)}</span></p>
          <ol class="steps">${t.example.steps.map((s) => `<li>${rich(s)}</li>`).join("")}</ol>
          <p class="ex-a"><span class="ex-lab">Answer</span><span>${rich(t.example.ans)}</span></p>
        </div>
      </section>
      <nav class="pager">
        ${prev ? `<a href="#/topic/${prev.id}">${icon("left")}<span><small>Previous</small>${esc(prev.title)}</span></a>` : "<span></span>"}
        ${next ? `<a class="next" href="#/topic/${next.id}"><span><small>Next</small>${esc(next.title)}</span>${icon("right")}</a>` : ""}
      </nav>`;
    const btn = document.getElementById("doneBtn");
    const paint = () => {
      const on = done.has(t.id);
      btn.classList.toggle("is-done", on);
      btn.setAttribute("aria-pressed", on);
      btn.innerHTML = `${icon("check")} ${on ? "Learned" : "Mark as learned"}`;
    };
    btn.addEventListener("click", () => {
      if (done.has(t.id)) done.delete(t.id); else done.add(t.id);
      saveDone();
      paint();
    });
    paint();
    return t.title;
  }

  function formulasView() {
    app.innerHTML = `
      ${pageHead("sigma", "Formula sheet", `All ${FORMULAS.length} formulas on MathsZone, grouped by branch. Tap a topic name to see the ideas and a worked example.`)}
      <div class="filter-bar">
        <label class="sr" for="fq">Filter formulas</label>
        <span class="field-ic">${icon("search")}<input id="fq" class="field" type="search" placeholder="Filter, for example: area, sin, derivative" autocomplete="off"></span>
        <div class="chip-row" id="fchips" role="group" aria-label="Branch">
          <button type="button" data-b="" aria-pressed="true">All</button>
          ${BRANCHES.map((b) => `<button type="button" data-b="${esc(b)}" aria-pressed="false">${esc(b)}</button>`).join("")}
        </div>
      </div>
      <div id="flist">
        ${BRANCHES.map((b) => `<section class="f-group" data-b="${esc(b)}">
          <h2>${esc(b)}</h2>
          <div class="formula-grid">${FORMULAS.filter((f) => f.topic.branch === b).map((f) => {
            const key = `${f.name} ${f.topic.title} ${f.tex.replace(/\\/g, " ")}`.toLowerCase();
            return `<div class="f-wrap" data-s="${esc(key)}">${formulaCard(f, true)}</div>`;
          }).join("")}</div>
        </section>`).join("")}
        <p class="empty" id="fempty" hidden>No formulas match that filter.</p>
      </div>`;
    const q = document.getElementById("fq"), chips = document.getElementById("fchips");
    let branch = "";
    const apply = () => {
      const s = q.value.trim().toLowerCase();
      let any = false;
      app.querySelectorAll(".f-group").forEach((g) => {
        let n = 0;
        g.querySelectorAll(".f-wrap").forEach((w) => {
          const show = !s || w.dataset.s.includes(s);
          w.hidden = !show;
          if (show) n++;
        });
        g.hidden = !n || (branch && g.dataset.b !== branch);
        if (!g.hidden) any = true;
      });
      document.getElementById("fempty").hidden = any;
    };
    q.addEventListener("input", apply);
    chips.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      branch = b.dataset.b;
      chips.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      apply();
    });
    return "Formula sheet";
  }

  function toolsView() {
    app.innerHTML = `${pageHead("tools", "Tools", "Calculators and solvers that show their working. Everything runs on your device.")}<div class="tool-grid">${TOOLS.map(toolCard).join("")}</div>`;
    return "Tools";
  }

  function toolView(t) {
    app.innerHTML = `${back("#/tools", "Tools")}${pageHead(t.icon, t.name, esc(t.blurb))}<div id="tool" class="tool"></div>`;
    teardown = t.run(document.getElementById("tool")) || null;
    return t.name;
  }

  function practiceView() {
    const best = store.get("best", {});
    app.innerHTML = `
      ${pageHead("target", "Practice", "Ten questions a round, freshly generated every time. Your best score for each skill is saved on this device.")}
      ${LEVELS.map((l) => {
        const list = SKILLS.filter((s) => s.level === l.id);
        return `<section class="skill-sec" style="--c:${l.color}">
          <h2><span class="lv-dot">${icon(l.icon)}</span>${esc(l.name)} <small>${esc(l.range)}</small></h2>
          <div class="skill-grid">${list.map((s) => `<a class="skill-card" href="#/practice/${s.id}">
            <b>${esc(s.name)}</b>
            <span>${esc(TP[s.topic].title)}</span>
            ${best[s.id] != null ? `<span class="best">${icon("trophy")} Best ${best[s.id]}/10</span>` : `<span class="best new">Not tried yet</span>`}
          </a>`).join("")}</div>
        </section>`;
      }).join("")}`;
    return "Practice";
  }

  function sessionView(s) {
    const N = 10, t = TP[s.topic], l = LV[s.level];
    let i = 0, score = 0, cur = null, answered = false, seen = new Set();
    app.innerHTML = `
      ${back("#/practice", "Practice")}
      ${pageHead("target", s.name, `${esc(l.name)} · <a href="#/topic/${t.id}">${esc(t.title)}</a>`, l.color)}
      <div class="quiz card" id="quiz" style="--c:${l.color}"></div>`;
    const box = document.getElementById("quiz");

    function nextQ() {
      for (let k = 0; k < 15; k++) {
        cur = s.gen();
        if (!seen.has(cur.q)) break;
      }
      seen.add(cur.q);
      answered = false;
      render();
    }

    function render() {
      box.innerHTML = `
        <div class="quiz-top"><span>Question ${i + 1} of ${N}</span><span class="score">${icon("trophy")} <b id="qScore">${score}</b></span></div>
        ${progress(Math.round((i / N) * 100), "Round progress")}
        <div class="q-text">${rich(cur.q)}</div>
        <form class="q-form" id="qForm" autocomplete="off">
          <label class="sr" for="qIn">Your answer</label>
          <input id="qIn" class="field" placeholder="Your answer" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go">
          <button class="btn primary" id="qGo">Check</button>
        </form>
        <p class="q-read" id="qRead">${esc(cur.hint || "")}</p>
        <div class="q-fb" id="qFb" hidden></div>
        <div class="q-acts"><button type="button" class="btn ghost sm" id="qSkip">Show answer</button></div>`;
      const inp = document.getElementById("qIn"), read = document.getElementById("qRead");
      inp.focus({ preventScroll: true });
      inp.addEventListener("input", () => {
        read.classList.remove("err");
        const v = inp.value.trim();
        if (/[a-z/^*()√π]/i.test(v)) {
          try {
            const parts = v.split(/[,;]/).map((p) => E.fmt(+E.evaluate(p.replace(/^\s*[a-z]\s*=/i, "")).toPrecision(8)));
            read.textContent = "Reads as " + parts.join(", ");
          } catch (e) { read.textContent = cur.hint || ""; }
        } else read.textContent = cur.hint || "";
      });
      document.getElementById("qForm").addEventListener("submit", (e) => {
        e.preventDefault();
        if (answered) return advance();
        const r = window.MZ_CHECK(inp.value, cur);
        if (r.empty) { inp.focus(); return; }
        if (r.error) { read.textContent = r.error; read.classList.add("err"); return; }
        finish(r.ok, false);
      });
      document.getElementById("qSkip").addEventListener("click", () => (answered ? advance() : finish(false, true)));
    }

    function finish(ok, skipped) {
      answered = true;
      if (ok) score++;
      const fb = document.getElementById("qFb"), go = document.getElementById("qGo");
      fb.hidden = false;
      fb.className = "q-fb " + (ok ? "good" : "bad");
      fb.innerHTML = `<b>${ok ? `${icon("check")} Correct` : skipped ? `${icon("bulb")} Here's the answer` : `${icon("x")} Not quite`}</b>
        <p>Answer: ${rich(cur.show)}</p><p class="muted">${rich(cur.how)}</p>`;
      document.getElementById("qIn").readOnly = true;
      document.getElementById("qSkip").hidden = true;
      document.getElementById("qScore").textContent = score;
      go.textContent = i + 1 < N ? "Next question" : "See my score";
      go.focus({ preventScroll: true });
    }

    function advance() {
      i++;
      if (i >= N) return summary();
      nextQ();
    }

    function summary() {
      const best = store.get("best", {});
      const prev = best[s.id];
      if (prev == null || score > prev) { best[s.id] = score; store.set("best", best); }
      const msg = score === N ? "Perfect round." : score >= 8 ? "Excellent work." : score >= 5 ? "Good going. Another round will lock it in." : "Worth another look at the topic, then try again.";
      box.innerHTML = `<div class="summary">
        <span class="big-ic">${icon("trophy")}</span>
        <h2>${score} out of ${N}</h2>
        <p>${msg}</p>
        <p class="muted">${prev != null && score > prev ? `New best! Your previous best was ${prev}/${N}.` : `Best: ${Math.max(prev ?? 0, score)}/${N}`}</p>
        <div class="acts"><button type="button" class="btn primary" id="again">${icon("refresh")} Practise again</button><a class="btn" href="#/topic/${t.id}">Review the topic</a></div>
      </div>`;
      document.getElementById("again").addEventListener("click", () => { i = 0; score = 0; seen = new Set(); nextQ(); });
    }

    nextQ();
    return s.name;
  }

  function searchView(q) {
    app.innerHTML = `
      ${pageHead("search", "Search", "Find topics, formulas, tools and practice.")}
      <span class="field-ic big">${icon("search")}<input id="sq" class="field" type="search" placeholder="Try: quadratic, area of circle, matrix" value="${esc(q)}" autocomplete="off" enterkeyhint="search"></span>
      <div id="sres" class="sres"></div>`;
    const inp = document.getElementById("sq"), out = document.getElementById("sres");
    const run = () => {
      const s = inp.value.trim().toLowerCase();
      history.replaceState(null, "", "#/search" + (s ? "?q=" + encodeURIComponent(s) : ""));
      if (!s) { out.innerHTML = `<p class="empty">Start typing to search ${TOPICS.length} topics and ${FORMULAS.length} formulas.</p>`; return; }
      const words = s.split(/\s+/);
      const hit = (text) => { const low = text.toLowerCase(); return words.every((w) => low.includes(w)); };
      const topics = TOPICS.filter((t) => hit(`${t.title} ${t.summary} ${t.branch} ${t.ideas.join(" ")} ${LV[t.level].range}`))
        .sort((a, b) => hit(b.title) - hit(a.title)).slice(0, 20);
      const forms = FORMULAS.filter((f) => hit(`${f.name} ${f.topic.title} ${f.tex.replace(/\\/g, " ")}`)).slice(0, 12);
      const tools = TOOLS.filter((t) => hit(`${t.name} ${t.blurb}`));
      const skills = SKILLS.filter((k) => hit(`${k.name} ${TP[k.topic].title}`)).slice(0, 8);
      if (!topics.length && !forms.length && !tools.length && !skills.length) { out.innerHTML = `<p class="empty">Nothing matches "${esc(s)}". Try a shorter word.</p>`; return; }
      out.innerHTML = `
        ${topics.length ? `<h2>Topics</h2><div class="res-list">${topics.map((t) => `<a class="res" href="#/topic/${t.id}" style="--c:${LV[t.level].color}"><span class="lv-dot">${icon(LV[t.level].icon)}</span><span><b>${esc(t.title)}</b><small>${esc(LV[t.level].name)} · ${esc(t.branch)}</small></span>${icon("right")}</a>`).join("")}</div>` : ""}
        ${tools.length ? `<h2>Tools</h2><div class="res-list">${tools.map((t) => `<a class="res" href="#/tools/${t.id}"><span class="lv-dot">${icon(t.icon)}</span><span><b>${esc(t.name)}</b><small>${esc(t.blurb)}</small></span>${icon("right")}</a>`).join("")}</div>` : ""}
        ${skills.length ? `<h2>Practice</h2><div class="res-list">${skills.map((k) => `<a class="res" href="#/practice/${k.id}" style="--c:${LV[k.level].color}"><span class="lv-dot">${icon("target")}</span><span><b>${esc(k.name)}</b><small>${esc(TP[k.topic].title)}</small></span>${icon("right")}</a>`).join("")}</div>` : ""}
        ${forms.length ? `<h2>Formulas</h2><div class="formula-grid">${forms.map((f) => formulaCard(f, true)).join("")}</div>` : ""}`;
    };
    inp.addEventListener("input", run);
    run();
    inp.focus();
    return "Search";
  }

  function notFound() {
    app.innerHTML = `<div class="empty-page"><h1>Page not found</h1><p class="lead">That link doesn't lead anywhere on MathsZone.</p><a class="btn primary" href="#/">Go home</a></div>`;
    return "Not found";
  }

  /* ---------- Tools ---------- */
  function calcTool(el) {
    const KEYS = [
      ["sin⁻¹", "asin(", "fn"], ["cos⁻¹", "acos(", "fn"], ["tan⁻¹", "atan(", "fn"], ["eˣ", "exp(", "fn"], ["n!", "!", "fn"],
      ["sin", "sin(", "fn"], ["cos", "cos(", "fn"], ["tan", "tan(", "fn"], ["ln", "ln(", "fn"], ["log", "log(", "fn"],
      ["(", "(", "op"], [")", ")", "op"], ["x²", "^2", "op"], ["xʸ", "^", "op"], ["√", "sqrt(", "op"],
      ["7", "7"], ["8", "8"], ["9", "9"], ["÷", "/", "op"], ["AC", "#AC", "danger"],
      ["4", "4"], ["5", "5"], ["6", "6"], ["×", "*", "op"], ["⌫", "#DEL", "op"],
      ["1", "1"], ["2", "2"], ["3", "3"], ["−", "-", "op"], ["Ans", "ans", "op"],
      ["0", "0"], [".", "."], ["π", "pi", "op"], ["+", "+", "op"], ["=", "#EQ", "eq"],
    ];
    let deg = store.get("deg", true), ans = store.get("ans", 0), hist = store.get("hist", []), fresh = false;
    el.innerHTML = `
      <div class="calc card">
        <div class="calc-screen">
          <div class="calc-top">
            <div class="seg sm" role="group" aria-label="Angle unit"><button type="button" data-deg="1">DEG</button><button type="button" data-deg="0">RAD</button></div>
            <span class="calc-ans">Ans = <b id="cAns"></b></span>
          </div>
          <input id="cIn" class="calc-in" inputmode="none" autocomplete="off" spellcheck="false" aria-label="Expression" placeholder="0">
          <output id="cOut" class="calc-out" aria-live="polite"></output>
        </div>
        <div class="keys">${KEYS.map(([label, ins, cls]) => `<button type="button" class="key ${cls || ""}" data-ins="${esc(ins)}">${label}</button>`).join("")}</div>
      </div>
      <p class="hint">You can type with a keyboard too: <code>2sin(30) + sqrt(16)</code>, <code>5!</code>, <code>e^2</code>, <code>log(1000)</code>. Press Enter for the answer.</p>
      <div class="sec-head"><h2>History</h2><button type="button" class="link-btn" id="cClear">Clear</button></div>
      <ol class="hist" id="cHist"></ol>`;
    const inp = el.querySelector("#cIn"), out = el.querySelector("#cOut"), histEl = el.querySelector("#cHist");
    const hasTrig = (s) => /sin|cos|tan|sec|csc|cot/.test(s);
    const show = (v, src) => {
      if (Math.abs(v) < 1e-13 && hasTrig(src)) v = 0;
      const f = Number.isInteger(v) ? null : E.toFrac(v, 1000);
      return E.fmt(v) + (f && f[1] !== 1 ? `  =  ${f[0]}/${f[1]}` : "");
    };
    const paintMode = () => el.querySelectorAll("[data-deg]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.deg === "1") === String(deg)));
    const paintAns = () => { el.querySelector("#cAns").textContent = E.fmt(ans); };
    const paintHist = () => {
      histEl.innerHTML = hist.length ? hist.map((h, k) => `<li><button type="button" data-h="${k}"><span>${esc(h.e)}</span><b>= ${esc(h.r)}</b></button></li>`).join("") : `<li class="empty">Your calculations will appear here.</li>`;
    };
    function preview() {
      out.className = "calc-out";
      const s = inp.value.trim();
      if (!s) { out.textContent = ""; return; }
      try { const v = E.evaluate(s, { ans }, { deg }); out.textContent = isFinite(v) || Number.isNaN(v) ? "= " + show(v, s) : "= " + E.fmt(v); }
      catch (e) { out.textContent = ""; }
    }
    function equals() {
      const s = inp.value.trim();
      if (!s) return;
      try {
        let v = E.evaluate(s, { ans }, { deg });
        if (Math.abs(v) < 1e-13 && hasTrig(s)) v = 0;
        out.className = "calc-out final";
        out.textContent = "= " + show(v, s);
        if (isFinite(v)) {
          ans = v; store.set("ans", v); paintAns();
          hist.unshift({ e: s, r: E.fmt(v) }); hist = hist.slice(0, 20); store.set("hist", hist); paintHist();
        }
        fresh = true;
      } catch (e) {
        out.className = "calc-out err";
        out.textContent = e.message;
      }
    }
    function insert(txt) {
      if (fresh) {
        fresh = false;
        inp.value = /^[+\-*/^!%]/.test(txt) ? "ans" : "";
      }
      const a = inp.selectionStart ?? inp.value.length, b = inp.selectionEnd ?? a;
      const pos = document.activeElement === inp ? [a, b] : [inp.value.length, inp.value.length];
      inp.value = inp.value.slice(0, pos[0]) + txt + inp.value.slice(pos[1]);
      const p = pos[0] + txt.length;
      try { inp.setSelectionRange(p, p); } catch (e) {}
      preview();
    }
    el.querySelector(".keys").addEventListener("click", (e) => {
      const b = e.target.closest(".key");
      if (!b) return;
      const k = b.dataset.ins;
      if (k === "#AC") { inp.value = ""; fresh = false; preview(); }
      else if (k === "#DEL") {
        if (fresh) { fresh = false; }
        const s = inp.value, m = /(asin\(|acos\(|atan\(|sqrt\(|sin\(|cos\(|tan\(|exp\(|log\(|ln\(|ans|pi)$/.exec(s);
        inp.value = m ? s.slice(0, -m[0].length) : s.slice(0, -1);
        preview();
      } else if (k === "#EQ") equals();
      else insert(k);
    });
    inp.addEventListener("input", () => { fresh = false; preview(); });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); equals(); }
      else if (e.key === "Escape") { inp.value = ""; preview(); }
      else if (fresh && e.key.length === 1) {
        fresh = false;
        if (/[+\-*/^!%]/.test(e.key)) { inp.value = "ans"; } else inp.value = "";
      }
    });
    el.querySelector("[role=group]").addEventListener("click", (e) => {
      const b = e.target.closest("[data-deg]");
      if (!b) return;
      deg = b.dataset.deg === "1"; store.set("deg", deg); paintMode(); preview();
    });
    histEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-h]");
      if (!b) return;
      inp.value = hist[+b.dataset.h].e; fresh = false; preview();
    });
    el.querySelector("#cClear").addEventListener("click", () => { hist = []; store.set("hist", hist); paintHist(); });
    paintMode(); paintAns(); paintHist();
  }

  function graphTool(el) {
    const COLORS = ["#6d4aff", "#ec4899", "#10b981"];
    let fns = store.get("graph", ["sin(x)", "x^2/4 - 1", ""]);
    if (!Array.isArray(fns)) fns = ["sin(x)", "", ""];
    fns = fns.slice(0, 3);
    while (fns.length < 3) fns.push("");
    el.innerHTML = `
      <div class="card graph">
        <div class="fn-list">${fns.map((f, i) => `<div class="fn-row" style="--c:${COLORS[i]}">
          <span class="fn-dot"></span><label class="fn-lab" for="fn${i}">y =</label>
          <input id="fn${i}" class="field" value="${esc(f)}" placeholder="${["sin(x)", "x^2 - 2", "1/x"][i]}" autocomplete="off" spellcheck="false" autocapitalize="off">
          <small class="fn-err" id="fe${i}"></small></div>`).join("")}</div>
        <div class="graph-box">
          <canvas id="gc" role="img" aria-label="Graph of the functions above"></canvas>
          <div class="graph-ctl">
            <button type="button" class="icon-btn sm" data-z="in" aria-label="Zoom in">+</button>
            <button type="button" class="icon-btn sm" data-z="out" aria-label="Zoom out">−</button>
            <button type="button" class="icon-btn sm" data-z="reset" aria-label="Reset view">${icon("refresh")}</button>
          </div>
          <div class="graph-read" id="gr"></div>
        </div>
      </div>
      <p class="hint">Drag to move; pinch or scroll to zoom. Use x as the variable: <code>2sin(x)</code>, <code>x^3 - 3x</code>, <code>1/x</code>, <code>sqrt(x)</code>, <code>abs(x) - 2</code>, <code>e^x</code>. Trig uses radians.</p>`;
    const cv = el.querySelector("#gc"), ctx = cv.getContext("2d"), read = el.querySelector("#gr");
    const view = { cx: 0, cy: 0, s: 40 };
    let compiled = [], hoverX = null;

    function compileAll() {
      compiled = fns.map((src, i) => {
        const err = el.querySelector("#fe" + i);
        err.textContent = "";
        const s = src.replace(/^\s*y\s*=/i, "").trim();
        if (!s) return null;
        try { return E.compile(s, { vars: ["x"] }); } catch (e) { err.textContent = e.message; return null; }
      });
    }

    const niceStep = (raw) => { const p = 10 ** Math.floor(Math.log10(raw)); const m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; };

    function draw() {
      const W = cv.clientWidth, H = cv.clientHeight, dpr = window.devicePixelRatio || 1;
      if (!W || !H) return;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cs = getComputedStyle(document.documentElement), col = (n) => cs.getPropertyValue(n).trim();
      ctx.fillStyle = col("--surface"); ctx.fillRect(0, 0, W, H);
      const X = (x) => W / 2 + (x - view.cx) * view.s, Y = (y) => H / 2 - (y - view.cy) * view.s;
      const x0 = view.cx - W / 2 / view.s, x1 = view.cx + W / 2 / view.s, y0 = view.cy - H / 2 / view.s, y1 = view.cy + H / 2 / view.s;
      const step = niceStep(80 / view.s);
      const grid = (st, color) => {
        if (st * view.s < 9) return;
        ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath();
        for (let k = Math.ceil(x0 / st); k <= Math.floor(x1 / st); k++) { const px = Math.round(X(k * st)) + 0.5; ctx.moveTo(px, 0); ctx.lineTo(px, H); }
        for (let k = Math.ceil(y0 / st); k <= Math.floor(y1 / st); k++) { const py = Math.round(Y(k * st)) + 0.5; ctx.moveTo(0, py); ctx.lineTo(W, py); }
        ctx.stroke();
      };
      grid(step / 5, col("--grid-minor"));
      grid(step, col("--grid"));
      const ax = X(0), ay = Y(0);
      ctx.strokeStyle = col("--muted"); ctx.lineWidth = 1.3; ctx.beginPath();
      if (ax >= 0 && ax <= W) { ctx.moveTo(Math.round(ax) + 0.5, 0); ctx.lineTo(Math.round(ax) + 0.5, H); }
      if (ay >= 0 && ay <= H) { ctx.moveTo(0, Math.round(ay) + 0.5); ctx.lineTo(W, Math.round(ay) + 0.5); }
      ctx.stroke();
      const dec = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
      const lab = (v) => { const s = v.toFixed(dec); return s === "-0" || /^-0\.0*$/.test(s) ? "0" : s; };
      ctx.fillStyle = col("--muted"); ctx.font = "11px " + (col("--sans") || "sans-serif");
      const ly = Math.min(Math.max(ay + 4, 4), H - 16);
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (let k = Math.ceil(x0 / step); k <= Math.floor(x1 / step); k++) { if (k) ctx.fillText(lab(k * step), X(k * step), ly); }
      const lx = Math.min(Math.max(ax - 5, 30), W - 4);
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (let k = Math.ceil(y0 / step); k <= Math.floor(y1 / step); k++) { if (k) ctx.fillText(lab(k * step), lx, Y(k * step)); }
      compiled.forEach((f, i) => {
        if (!f) return;
        ctx.strokeStyle = COLORS[i]; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.beginPath();
        let pen = false, prev = 0;
        for (let px = 0; px <= W; px += 1) {
          const y = f({ x: x0 + px / view.s });
          if (!isFinite(y)) { pen = false; continue; }
          const py = Y(y);
          if (pen && Math.abs(py - prev) > H) pen = false;
          const cy = Math.max(-H, Math.min(2 * H, py));
          if (pen) ctx.lineTo(px, cy); else ctx.moveTo(px, cy);
          pen = true; prev = py;
        }
        ctx.stroke();
      });
      if (hoverX != null) {
        const rows = [`x = ${E.fmt(+hoverX.toPrecision(4))}`];
        compiled.forEach((f, i) => {
          if (!f) return;
          const y = f({ x: hoverX });
          if (!isFinite(y)) return;
          ctx.fillStyle = COLORS[i]; ctx.strokeStyle = col("--surface"); ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(X(hoverX), Y(y), 4.5, 0, 7); ctx.fill(); ctx.stroke();
          rows.push(`<span style="color:${COLORS[i]}">y${i + 1} = ${E.fmt(+y.toPrecision(4))}</span>`);
        });
        read.innerHTML = rows.join("");
        read.hidden = false;
      } else read.hidden = true;
    }

    const toUnitX = (px) => view.cx + (px - cv.clientWidth / 2) / view.s;
    function zoomAt(px, py, f) {
      const W = cv.clientWidth, H = cv.clientHeight;
      const x = view.cx + (px - W / 2) / view.s, y = view.cy - (py - H / 2) / view.s;
      view.s = Math.min(1e5, Math.max(0.5, view.s * f));
      view.cx = x - (px - W / 2) / view.s;
      view.cy = y + (py - H / 2) / view.s;
    }

    const pts = new Map();
    let pinch = null;
    const pinchState = () => { const [a, b] = [...pts.values()]; return { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }; };
    cv.addEventListener("pointerdown", (e) => {
      cv.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
      if (pts.size === 2) pinch = pinchState();
      hoverX = toUnitX(e.offsetX); draw();
    });
    cv.addEventListener("pointermove", (e) => {
      const p = pts.get(e.pointerId);
      if (!p) { if (e.pointerType === "mouse") { hoverX = toUnitX(e.offsetX); draw(); } return; }
      if (pts.size === 1) {
        view.cx -= (e.offsetX - p.x) / view.s; view.cy += (e.offsetY - p.y) / view.s;
        p.x = e.offsetX; p.y = e.offsetY;
        hoverX = toUnitX(e.offsetX);
      } else if (pts.size === 2 && pinch) {
        p.x = e.offsetX; p.y = e.offsetY;
        const n = pinchState();
        view.cx -= (n.mx - pinch.mx) / view.s; view.cy += (n.my - pinch.my) / view.s;
        zoomAt(n.mx, n.my, n.d / (pinch.d || 1));
        pinch = n;
      }
      draw();
    });
    const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; };
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse" && !pts.size) { hoverX = null; draw(); } });
    cv.addEventListener("wheel", (e) => { e.preventDefault(); zoomAt(e.offsetX, e.offsetY, Math.exp(-e.deltaY * 0.0015)); draw(); }, { passive: false });
    el.querySelector(".graph-ctl").addEventListener("click", (e) => {
      const b = e.target.closest("[data-z]");
      if (!b) return;
      if (b.dataset.z === "reset") { view.cx = 0; view.cy = 0; view.s = 40; }
      else zoomAt(cv.clientWidth / 2, cv.clientHeight / 2, b.dataset.z === "in" ? 1.5 : 1 / 1.5);
      draw();
    });
    el.querySelectorAll(".fn-row input").forEach((inp, i) => inp.addEventListener("input", () => {
      fns[i] = inp.value; store.set("graph", fns); compileAll(); draw();
    }));
    compileAll();
    const ro = new ResizeObserver(() => draw());
    ro.observe(cv);
    window.addEventListener("mz-theme", draw);
    return () => { ro.disconnect(); window.removeEventListener("mz-theme", draw); };
  }

  function solverTool(el) {
    const MODES = {
      quad: { label: "Quadratic", def: { a: "1", b: "-5", c: "6" } },
      lin: { label: "Linear", def: { a: "3", b: "7", c: "22" } },
      sys: { label: "Simultaneous", def: { a1: "1", b1: "1", c1: "10", a2: "1", b2: "-1", c2: "2" } },
    };
    let mode = store.get("solver-mode", "quad");
    if (!MODES[mode]) mode = "quad";
    const vals = store.get("solver", {});
    el.innerHTML = `
      <div class="seg wide" role="tablist" id="smode">${Object.entries(MODES).map(([k, m]) => `<button type="button" role="tab" data-m="${k}">${m.label}</button>`).join("")}</div>
      <div class="card solver"><div class="eq-in" id="sin"></div><div class="s-out" id="sout"></div></div>
      <p class="hint">Each box accepts fractions and expressions, such as <code>1/2</code>, <code>-3</code> or <code>sqrt(2)</code>.</p>`;
    const sin = el.querySelector("#sin"), sout = el.querySelector("#sout");
    const val = (k) => ((vals[mode] || {})[k] ?? MODES[mode].def[k]);
    const box = (k, label) => `<input class="field coef" data-k="${k}" value="${esc(val(k))}" autocomplete="off" spellcheck="false" aria-label="${label}">`;

    function paint() {
      el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-selected", b.dataset.m === mode));
      if (mode === "quad") sin.innerHTML = `<div class="eq-line">${box("a", "a")}<span>x² +</span>${box("b", "b")}<span>x +</span>${box("c", "c")}<span>= 0</span></div>`;
      else if (mode === "lin") sin.innerHTML = `<div class="eq-line">${box("a", "a")}<span>x +</span>${box("b", "b")}<span>=</span>${box("c", "c")}</div>`;
      else sin.innerHTML = `<div class="eq-line">${box("a1", "a1")}<span>x +</span>${box("b1", "b1")}<span>y =</span>${box("c1", "c1")}</div><div class="eq-line">${box("a2", "a2")}<span>x +</span>${box("b2", "b2")}<span>y =</span>${box("c2", "c2")}</div>`;
      sin.querySelectorAll("input").forEach((inp) => inp.addEventListener("input", () => {
        vals[mode] = { ...(vals[mode] || MODES[mode].def), [inp.dataset.k]: inp.value };
        store.set("solver", vals);
        solve();
      }));
      solve();
    }

    function read() {
      const o = {};
      for (const inp of sin.querySelectorAll("input")) {
        const s = inp.value.trim();
        if (!s) throw new Error("Fill in every box.");
        try { o[inp.dataset.k] = E.evaluate(s); } catch (e) { throw new Error(`Box ${inp.dataset.k}: ${e.message}`); }
        if (!isFinite(o[inp.dataset.k])) throw new Error(`Box ${inp.dataset.k} isn't a number.`);
      }
      return o;
    }

    function render(result, verdict, steps, extra, plot) {
      sout.innerHTML = `
        <div class="s-result"><small>${esc(verdict)}</small>${tex(result, true)}</div>
        <h3>Working</h3>
        <ol class="s-steps">${steps.map((s) => `<li>${tex(s, true)}</li>`).join("")}</ol>
        ${extra || ""}
        ${plot ? `<button type="button" class="btn" id="toGraph">${icon("graph")} See the graph</button>` : ""}`;
      if (plot) sout.querySelector("#toGraph").addEventListener("click", () => { store.set("graph", plot); location.hash = "#/tools/graph"; });
    }

    function solve() {
      let o;
      try { o = read(); } catch (e) { sout.innerHTML = `<p class="err">${esc(e.message)}</p>`; return; }
      if (mode === "lin") {
        const { a, b, c } = o;
        const eq = `${tp([[a, "x"], [b, ""]])} = ${nt(c)}`;
        if (a === 0) return render(eq, b === c ? "Every value of x works" : "No solution", [eq, b === c ? "\\text{Both sides are always equal.}" : "\\text{The x term is zero, so the sides can never match.}"]);
        const x = (c - b) / a, steps = [eq];
        if (b) steps.push(`${tp([[a, "x"]])} = ${nt(c)} ${b < 0 ? "+" : "-"} ${nt(Math.abs(b))} = ${nt(c - b)}`);
        steps.push(`x = \\frac{${nt(c - b)}}{${nt(a)}} = ${nt(x)}`);
        return render(`x = ${nt(x)}`, "One solution", steps, "", [plain([[a, "x"], [b - c, ""]]), "", ""]);
      }
      if (mode === "quad") {
        const { a, b, c } = o;
        if (a === 0) {
          if (b === 0) return render(`${nt(c)} = 0`, c === 0 ? "Every value of x works" : "No solution", ["\\text{With } a = b = 0 \\text{ there is no } x \\text{ left to solve for.}"]);
          return render(`x = ${nt(-c / b)}`, "a = 0, so this is a linear equation", [`${tp([[b, "x"], [c, ""]])} = 0`, `x = ${nt(-c / b)}`]);
        }
        const D = b * b - 4 * a * c, h = -b / (2 * a), k = c - (b * b) / (4 * a);
        const steps = [`${tp([[a, "x^2"], [b, "x"], [c, ""]])} = 0`, `D = b^2 - 4ac = ${pn(b)}^2 - 4 \\cdot ${pn(a)} \\cdot ${pn(c)} = ${nt(D)}`];
        let result, verdict;
        if (Math.abs(D) < 1e-12) {
          steps.push(`x = -\\frac{b}{2a} = ${nt(h)}`);
          result = `x = ${nt(h)}`; verdict = "D = 0: one repeated real root";
        } else if (D > 0) {
          const r = Math.sqrt(D), x1 = (-b - r) / (2 * a), x2 = (-b + r) / (2 * a);
          steps.push(`x = \\frac{-b \\pm \\sqrt{D}}{2a} = \\frac{${nt(-b)} \\pm \\sqrt{${nt(D)}}}{${nt(2 * a)}}`);
          if (Number.isInteger(r)) steps.push(`x = \\frac{${nt(-b)} \\pm ${nt(r)}}{${nt(2 * a)}}`);
          result = `x = ${nt(Math.min(x1, x2))} \\quad\\text{or}\\quad x = ${nt(Math.max(x1, x2))}`; verdict = "D > 0: two real roots";
        } else {
          const im = Math.sqrt(-D) / (2 * Math.abs(a));
          steps.push(`x = \\frac{${nt(-b)} \\pm \\sqrt{${nt(D)}}}{${nt(2 * a)}} = ${h ? nt(h) + " " : ""}\\pm ${nt(im)}\\,i`);
          result = `x = ${h ? nt(h) + " " : ""}\\pm ${nt(im)}\\,i`; verdict = "D < 0: no real roots, two complex roots";
        }
        const extra = `<div class="s-facts">
          <div><small>Vertex</small>${tex(`(${nt(h)},\\ ${nt(k)})`)}</div>
          <div><small>Sum of roots</small>${tex(`-\\tfrac{b}{a} = ${nt(-b / a)}`)}</div>
          <div><small>Product of roots</small>${tex(`\\tfrac{c}{a} = ${nt(c / a)}`)}</div>
        </div>`;
        return render(result, verdict, steps, extra, [plain([[a, "x^2"], [b, "x"], [c, ""]]), "", ""]);
      }
      const { a1, b1, c1, a2, b2, c2 } = o;
      const D = a1 * b2 - a2 * b1, Dx = c1 * b2 - c2 * b1, Dy = a1 * c2 - a2 * c1;
      const steps = [
        `${tp([[a1, "x"], [b1, "y"]])} = ${nt(c1)},\\qquad ${tp([[a2, "x"], [b2, "y"]])} = ${nt(c2)}`,
        `D = a_1b_2 - a_2b_1 = ${pn(a1)}\\cdot${pn(b2)} - ${pn(a2)}\\cdot${pn(b1)} = ${nt(D)}`,
        `D_x = c_1b_2 - c_2b_1 = ${nt(Dx)},\\qquad D_y = a_1c_2 - a_2c_1 = ${nt(Dy)}`,
      ];
      const lineFor = (a, b, c) => (b ? plain([[-a / b, "x"], [c / b, ""]]) : "");
      const plot = [lineFor(a1, b1, c1), lineFor(a2, b2, c2), ""];
      if (Math.abs(D) < 1e-12) {
        const inf = Math.abs(Dx) < 1e-12 && Math.abs(Dy) < 1e-12;
        return render(inf ? "\\text{infinitely many solutions}" : "\\text{no solution}", inf ? "D = 0: the two equations are the same line" : "D = 0: the lines are parallel", steps, "", plot);
      }
      steps.push(`x = \\frac{D_x}{D} = ${nt(Dx / D)},\\qquad y = \\frac{D_y}{D} = ${nt(Dy / D)}`);
      return render(`x = ${nt(Dx / D)},\\quad y = ${nt(Dy / D)}`, "One solution: where the two lines cross", steps, "", plot);
    }

    el.querySelector("#smode").addEventListener("click", (e) => {
      const b = e.target.closest("[data-m]");
      if (!b) return;
      mode = b.dataset.m; store.set("solver-mode", mode); paint();
    });
    paint();
  }

  function fracTool(el) {
    const norm = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = E.gcd(n, d) || 1; return [n / g, d / g]; };
    function parseRat(raw) {
      const s = raw.trim().replace(/[−–]/g, "-");
      let m;
      if (!s) throw new Error("Fill in both boxes.");
      if ((m = /^(-)?(\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(s))) {
        const w = +m[2], n = +m[3], d = +m[4];
        if (!d) throw new Error("A denominator can't be 0.");
        return norm((m[1] ? -1 : 1) * (w * d + n), d);
      }
      if ((m = /^(-?\d+)\s*\/\s*(-?\d+)$/.exec(s))) {
        if (+m[2] === 0) throw new Error("A denominator can't be 0.");
        return norm(+m[1], +m[2]);
      }
      if ((m = /^(-?)(\d*)\.(\d+)$/.exec(s))) {
        const k = m[3].length;
        return norm((m[1] ? -1 : 1) * (+(m[2] || 0) * 10 ** k + +m[3]), 10 ** k);
      }
      if (/^-?\d+$/.test(s)) return [+s, 1];
      let v;
      try { v = E.evaluate(s); } catch (e) { throw new Error(`"${s}" isn't a fraction.`); }
      const f = E.toFrac(v, 100000);
      if (!f) throw new Error(`"${s}" isn't a fraction.`);
      return f;
    }
    const ft = ([n, d]) => (d === 1 ? `${n}` : `${n < 0 ? "-" : ""}\\frac{${Math.abs(n)}}{${d}}`);
    const mixed = ([n, d]) => (d === 1 || Math.abs(n) < d ? null : `${n < 0 ? "-" : ""}${Math.floor(Math.abs(n) / d)}\\tfrac{${Math.abs(n) % d}}{${d}}`);
    let op = store.get("frac-op", "+");
    const saved = store.get("frac", ["3/4", "5/6"]);
    el.innerHTML = `
      <div class="card frac-tool">
        <div class="frac-row">
          <label class="sr" for="fa">First fraction</label><input id="fa" class="field big-in" value="${esc(saved[0])}" autocomplete="off">
          <div class="seg ops" role="group" aria-label="Operation">${["+", "−", "×", "÷"].map((o) => `<button type="button" data-op="${o}">${o}</button>`).join("")}</div>
          <label class="sr" for="fb">Second fraction</label><input id="fb" class="field big-in" value="${esc(saved[1])}" autocomplete="off">
        </div>
        <div class="s-out" id="fout"></div>
      </div>
      <p class="hint">Type fractions like <code>3/4</code>, mixed numbers like <code>1 1/2</code>, whole numbers or decimals like <code>0.25</code>.</p>`;
    const fa = el.querySelector("#fa"), fb = el.querySelector("#fb"), out = el.querySelector("#fout");
    function calc() {
      el.querySelectorAll("[data-op]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.op === op));
      store.set("frac", [fa.value, fb.value]);
      let A, B;
      try { A = parseRat(fa.value); B = parseRat(fb.value); } catch (e) { out.innerHTML = `<p class="err">${esc(e.message)}</p>`; return; }
      const [a, b] = A, [c, d] = B;
      let R, steps;
      const opTex = { "+": "+", "−": "-", "×": "\\times", "÷": "\\div" }[op];
      if (op === "+" || op === "−") {
        const L = E.lcm(b, d), s = op === "+" ? 1 : -1, N = a * (L / b) + s * c * (L / d);
        R = norm(N, L);
        steps = [`\\text{Common denominator: LCM}(${b}, ${d}) = ${L}`, `\\frac{${a * (L / b)}}{${L}} ${opTex} \\frac{${c * (L / d)}}{${L}} = \\frac{${N}}{${L}}`];
      } else if (op === "×") {
        R = norm(a * c, b * d);
        steps = [`\\frac{${a} \\times ${c}}{${b} \\times ${d}} = \\frac{${a * c}}{${b * d}}`];
      } else {
        if (c === 0) { out.innerHTML = `<p class="err">You can't divide by zero.</p>`; return; }
        R = norm(a * d, b * c);
        steps = [`${ft(A)} \\times ${ft(norm(d, c))} = \\frac{${a * d}}{${b * c}}`];
      }
      if (!Number.isSafeInteger(R[0]) || !Number.isSafeInteger(R[1])) { out.innerHTML = `<p class="err">Those numbers are too large to keep exact.</p>`; return; }
      steps.push(`\\text{Simplest form: } ${ft(R)}`);
      const mx = mixed(R);
      out.innerHTML = `
        <div class="s-result"><small>Result</small>${tex(`${ft(A)} ${opTex} ${ft(B)} = ${ft(R)}`, true)}</div>
        <div class="s-facts">
          ${mx ? `<div><small>Mixed number</small>${tex(mx)}</div>` : ""}
          <div><small>Decimal</small><b>${E.fmt(R[0] / R[1])}</b></div>
          <div><small>Percentage</small><b>${E.fmt(+((R[0] / R[1]) * 100).toPrecision(10))}%</b></div>
        </div>
        <h3>Working</h3>
        <ol class="s-steps">${steps.map((s) => `<li>${tex(s, true)}</li>`).join("")}</ol>`;
    }
    el.querySelector(".ops").addEventListener("click", (e) => {
      const b = e.target.closest("[data-op]");
      if (!b) return;
      op = b.dataset.op; store.set("frac-op", op); calc();
    });
    fa.addEventListener("input", calc);
    fb.addEventListener("input", calc);
    calc();
  }

  function numberTool(el) {
    const factTex = (f) => f.map(([p, k]) => (k > 1 ? `${p}^{${k}}` : `${p}`)).join(" \\times ");
    el.innerHTML = `
      <div class="card">
        <h3>Prime factorisation</h3>
        <label class="sr" for="nn">Whole number</label>
        <input id="nn" class="field big-in" value="${esc(store.get("num", "360"))}" inputmode="numeric" autocomplete="off">
        <div id="nout" class="s-out"></div>
      </div>
      <div class="card">
        <h3>HCF and LCM</h3>
        <label class="sr" for="nl">Numbers separated by commas</label>
        <input id="nl" class="field big-in" value="${esc(store.get("numlist", "12, 18, 30"))}" autocomplete="off">
        <div id="lout" class="s-out"></div>
      </div>`;
    const nn = el.querySelector("#nn"), nl = el.querySelector("#nl");
    function one() {
      const out = el.querySelector("#nout"), s = nn.value.replace(/[,\s_]/g, "");
      store.set("num", nn.value);
      if (!/^\d+$/.test(s) || +s < 1 || +s > 1e12) { out.innerHTML = `<p class="err">Enter a whole number from 1 to 1,000,000,000,000.</p>`; return; }
      const n = +s;
      if (n === 1) { out.innerHTML = `<div class="s-result"><small>1 is neither prime nor composite</small>${tex("1", true)}</div>`; return; }
      const f = E.factorize(n), prime = f.length === 1 && f[0][1] === 1;
      const count = f.reduce((c, [, k]) => c * (k + 1), 1);
      const sum = f.reduce((s2, [p, k]) => s2 * ((p ** (k + 1) - 1) / (p - 1)), 1);
      let divs = "";
      if (count <= 160) {
        let list = [1];
        for (const [p, k] of f) { const next = []; for (const d of list) { let m = 1; for (let j = 0; j <= k; j++) { next.push(d * m); m *= p; } } list = next; }
        divs = `<h3>All ${count} divisors</h3><p class="divs">${list.sort((a, b) => a - b).join(", ")}</p>`;
      }
      out.innerHTML = `
        <div class="s-result"><small>${prime ? `${n.toLocaleString("en-IN")} is prime` : `${n.toLocaleString("en-IN")} is composite`}</small>${tex(`${n} = ${factTex(f)}`, true)}</div>
        <div class="s-facts">
          <div><small>Number of divisors</small><b>${count}</b></div>
          <div><small>Sum of divisors</small><b>${E.fmt(sum)}</b></div>
          <div><small>Perfect square</small><b>${f.every(([, k]) => k % 2 === 0) ? "Yes" : "No"}</b></div>
        </div>${divs}`;
    }
    function many() {
      const out = el.querySelector("#lout");
      store.set("numlist", nl.value);
      const nums = (nl.value.match(/\d+/g) || []).map(Number).filter((v) => v > 0);
      if (nums.length < 2) { out.innerHTML = `<p class="err">Enter at least two positive whole numbers.</p>`; return; }
      if (nums.some((v) => v > 1e12)) { out.innerHTML = `<p class="err">Keep each number under 1,000,000,000,000.</p>`; return; }
      const H = nums.reduce((a, b) => E.gcd(a, b));
      let L = 1;
      for (const v of nums) { L = E.lcm(L, v); if (L > Number.MAX_SAFE_INTEGER) break; }
      out.innerHTML = `
        <div class="s-facts two">
          <div><small>HCF</small><b class="big">${H.toLocaleString("en-IN")}</b></div>
          <div><small>LCM</small><b class="big">${L > Number.MAX_SAFE_INTEGER ? "too large" : L.toLocaleString("en-IN")}</b></div>
        </div>
        <h3>Prime factorisations</h3>
        <ol class="s-steps">${nums.map((v) => `<li>${tex(`${v} = ${v === 1 ? "1" : factTex(E.factorize(v))}`, true)}</li>`).join("")}</ol>`;
    }
    nn.addEventListener("input", one);
    nl.addEventListener("input", many);
    one(); many();
  }

  function percentTool(el) {
    const saved = store.get("pct", { a: "12.5", b: "480", c: "60", d: "480", e: "480", f: "540" });
    const inp = (k, label) => `<input class="field coef wide" data-k="${k}" value="${esc(saved[k] ?? "")}" aria-label="${label}" autocomplete="off">`;
    el.innerHTML = `
      <div class="pct-grid">
        <div class="card pct"><h3>Percent of a number</h3><p class="sentence">What is ${inp("a", "percent")} % of ${inp("b", "number")} ?</p><div class="pct-out" id="p1"></div></div>
        <div class="card pct"><h3>What percent?</h3><p class="sentence">${inp("c", "part")} is what % of ${inp("d", "whole")} ?</p><div class="pct-out" id="p2"></div></div>
        <div class="card pct"><h3>Percent change</h3><p class="sentence">From ${inp("e", "old value")} to ${inp("f", "new value")}</p><div class="pct-out" id="p3"></div></div>
      </div>`;
    const v = (k) => { const s = el.querySelector(`[data-k="${k}"]`).value.trim(); if (!s) return NaN; try { return E.evaluate(s); } catch (e) { return NaN; } };
    const put = (id, html) => { el.querySelector("#" + id).innerHTML = html; };
    const bad = `<span class="muted">Enter two numbers.</span>`;
    function calc() {
      el.querySelectorAll("[data-k]").forEach((i) => { saved[i.dataset.k] = i.value; });
      store.set("pct", saved);
      const a = v("a"), b = v("b"), c = v("c"), d = v("d"), e = v("e"), f = v("f");
      put("p1", isFinite(a) && isFinite(b) ? `<b>${E.fmt(+((a * b) / 100).toPrecision(12))}</b>${tex(`\\frac{${nt(a)} \\times ${nt(b)}}{100}`)}` : bad);
      put("p2", isFinite(c) && isFinite(d) && d !== 0 ? `<b>${E.fmt(+((c / d) * 100).toPrecision(10))}%</b>${tex(`\\frac{${nt(c)}}{${nt(d)}} \\times 100`)}` : bad);
      if (isFinite(e) && isFinite(f) && e !== 0) {
        const p = ((f - e) / Math.abs(e)) * 100;
        put("p3", `<b class="${p > 0 ? "up" : p < 0 ? "down" : ""}">${p > 0 ? "+" : ""}${E.fmt(+p.toPrecision(10))}%</b><span class="muted">${p > 0 ? "increase" : p < 0 ? "decrease" : "no change"}</span>${tex(`\\frac{${nt(f)} - ${pn(e)}}{${nt(Math.abs(e))}} \\times 100`)}`);
      } else put("p3", bad);
    }
    el.querySelectorAll("[data-k]").forEach((i) => i.addEventListener("input", calc));
    calc();
  }

  function matrixTool(el) {
    let n = store.get("mat-n", 2);
    if (n !== 2 && n !== 3) n = 2;
    const saved = store.get("mat", { 2: ["2", "1", "5", "3"], 3: ["2", "0", "1", "1", "3", "2", "1", "1", "1"] });
    el.innerHTML = `
      <div class="seg wide" role="tablist" id="msz"><button type="button" role="tab" data-n="2">2 × 2</button><button type="button" role="tab" data-n="3">3 × 3</button></div>
      <div class="card"><div class="mat-wrap"><span class="mat-label">A =</span><div class="mat" id="mgrid"></div></div><div class="s-out" id="mout"></div></div>
      <p class="hint">Entries can be fractions or expressions, such as <code>1/2</code> or <code>sqrt(2)</code>.</p>`;
    const grid = el.querySelector("#mgrid"), out = el.querySelector("#mout");
    const bm = (M) => `\\begin{bmatrix} ${M.map((r) => r.map(nt).join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;
    function det(M) {
      const A = M.map((r) => r.slice()), k = A.length;
      let d = 1;
      for (let i = 0; i < k; i++) {
        let p = i;
        for (let r = i + 1; r < k; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
        if (Math.abs(A[p][i]) < 1e-12) return 0;
        if (p !== i) { [A[p], A[i]] = [A[i], A[p]]; d = -d; }
        d *= A[i][i];
        for (let r = i + 1; r < k; r++) { const f = A[r][i] / A[i][i]; for (let c = i; c < k; c++) A[r][c] -= f * A[i][c]; }
      }
      return d;
    }
    function inverse(M) {
      const k = M.length, A = M.map((r, i) => [...r, ...r.map((_, j) => (i === j ? 1 : 0))]);
      for (let i = 0; i < k; i++) {
        let p = i;
        for (let r = i + 1; r < k; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
        if (Math.abs(A[p][i]) < 1e-12) return null;
        [A[p], A[i]] = [A[i], A[p]];
        const piv = A[i][i];
        for (let c = 0; c < 2 * k; c++) A[i][c] /= piv;
        for (let r = 0; r < k; r++) if (r !== i) { const f = A[r][i]; for (let c = 0; c < 2 * k; c++) A[r][c] -= f * A[i][c]; }
      }
      return A.map((r) => r.slice(k).map((v) => (Math.abs(v) < 1e-12 ? 0 : v)));
    }
    function paint() {
      el.querySelectorAll("[data-n]").forEach((b) => b.setAttribute("aria-selected", +b.dataset.n === n));
      grid.style.setProperty("--n", n);
      grid.innerHTML = saved[n].map((v, i) => `<input class="field coef" data-i="${i}" value="${esc(v)}" aria-label="Row ${Math.floor(i / n) + 1}, column ${(i % n) + 1}" autocomplete="off">`).join("");
      grid.querySelectorAll("input").forEach((i) => i.addEventListener("input", () => { saved[n][+i.dataset.i] = i.value; store.set("mat", saved); calc(); }));
      calc();
    }
    function calc() {
      let M;
      try {
        const v = saved[n].map((s, i) => {
          if (!String(s).trim()) throw new Error("Fill in every entry.");
          const x = E.evaluate(s);
          if (!isFinite(x)) throw new Error(`Entry ${i + 1} isn't a number.`);
          return x;
        });
        M = Array.from({ length: n }, (_, r) => v.slice(r * n, r * n + n));
      } catch (e) { out.innerHTML = `<p class="err">${esc(e.message)}</p>`; return; }
      const d = det(M), inv = inverse(M), T = M[0].map((_, c) => M.map((r) => r[c])), tr = M.reduce((s, r, i) => s + r[i], 0);
      let eig = "";
      if (n === 2) {
        const D = tr * tr - 4 * d;
        const r = Math.sqrt(Math.abs(D)), exact = Math.abs(r - Math.round(r)) < 1e-9;
        const short = (x) => nt(+x.toPrecision(6));
        const ev = Math.abs(D) < 1e-12 ? `\\lambda = ${nt(tr / 2)}\\ (\\text{repeated})`
          : D > 0 ? (exact ? `\\lambda_1 = ${nt((tr + r) / 2)},\\quad \\lambda_2 = ${nt((tr - r) / 2)}` : `\\lambda = \\frac{${nt(tr)} \\pm \\sqrt{${nt(D)}}}{2} \\approx ${short((tr + r) / 2)},\\ ${short((tr - r) / 2)}`)
          : `\\lambda = ${nt(tr / 2)} \\pm ${exact ? nt(r / 2) : `\\tfrac{\\sqrt{${nt(-D)}}}{2}`}\\,i`;
        eig = `<h3>Eigenvalues</h3><ol class="s-steps"><li>${tex(`\\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A = ${tp([[1, "\\lambda^2"], [-tr, "\\lambda"], [d, ""]])} = 0`, true)}</li><li>${tex(ev, true)}</li></ol>`;
      }
      out.innerHTML = `
        <div class="s-facts two">
          <div><small>Determinant</small>${tex(`\\det A = ${nt(d)}`)}</div>
          <div><small>Trace</small>${tex(`\\operatorname{tr} A = ${nt(tr)}`)}</div>
        </div>
        <h3>Inverse</h3>
        ${inv ? `<div class="f-tex">${tex(`A^{-1} = ${bm(inv)}`, true)}</div>` : `<p class="muted">No inverse: the determinant is 0, so A is singular.</p>`}
        <h3>Transpose</h3>
        <div class="f-tex">${tex(`A^{T} = ${bm(T)}`, true)}</div>
        ${eig}`;
    }
    el.querySelector("#msz").addEventListener("click", (e) => {
      const b = e.target.closest("[data-n]");
      if (!b) return;
      n = +b.dataset.n; store.set("mat-n", n); paint();
    });
    paint();
  }

  function statsTool(el) {
    el.innerHTML = `
      <div class="card">
        <label class="lbl" for="sd">Your numbers, separated by commas or spaces</label>
        <textarea id="sd" class="field area" rows="3" spellcheck="false">${esc(store.get("stats", "2, 4, 4, 4, 5, 5, 7, 9"))}</textarea>
        <div id="sout" class="s-out"></div>
      </div>
      <p class="hint">Quartiles use the median-of-halves method taught in schools. Sample variance divides by n − 1; population variance divides by n.</p>`;
    const ta = el.querySelector("#sd"), out = el.querySelector("#sout");
    const median = (a) => { const m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
    const f = (x) => E.fmt(+x.toPrecision(10));
    function calc() {
      store.set("stats", ta.value);
      const xs = (ta.value.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).map(Number).filter(isFinite);
      if (!xs.length) { out.innerHTML = `<p class="err">Type at least one number.</p>`; return; }
      const s = xs.slice().sort((a, b) => a - b), n = s.length, sum = s.reduce((a, b) => a + b, 0), mean = sum / n;
      const ss = s.reduce((a, b) => a + (b - mean) ** 2, 0);
      const counts = new Map();
      s.forEach((v) => counts.set(v, (counts.get(v) || 0) + 1));
      const top = Math.max(...counts.values());
      const modes = top > 1 ? [...counts].filter(([, c]) => c === top).map(([v]) => f(v)) : [];
      const lower = s.slice(0, n >> 1), upper = s.slice(n - (n >> 1));
      const q1 = lower.length ? median(lower) : NaN, q3 = upper.length ? median(upper) : NaN;
      const cells = [
        ["Count", n], ["Sum", f(sum)], ["Mean", f(mean)], ["Median", f(median(s))],
        ["Mode", modes.length ? modes.join(", ") : "None"], ["Range", f(s[n - 1] - s[0])],
        ["Minimum", f(s[0])], ["Maximum", f(s[n - 1])],
        ["Q1", n > 1 ? f(q1) : "–"], ["Q3", n > 1 ? f(q3) : "–"], ["IQR", n > 1 ? f(q3 - q1) : "–"],
        ["Population variance", f(ss / n)], ["Population SD", f(Math.sqrt(ss / n))],
        ["Sample variance", n > 1 ? f(ss / (n - 1)) : "–"], ["Sample SD", n > 1 ? f(Math.sqrt(ss / (n - 1))) : "–"],
      ];
      out.innerHTML = `<div class="stat-grid">${cells.map(([k, v]) => `<div><small>${k}</small><b>${esc(String(v))}</b></div>`).join("")}</div>
        <h3>Sorted</h3><p class="divs">${s.map(f).join(", ")}</p>`;
    }
    ta.addEventListener("input", calc);
    calc();
  }

  /* ---------- Router and chrome ---------- */
  let teardown = null;

  function route() {
    if (teardown) { try { teardown(); } catch (e) {} teardown = null; }
    const raw = location.hash.replace(/^#\/?/, "");
    const [path, query = ""] = raw.split("?");
    const [a, b] = path.split("/").filter(Boolean).map(decodeURIComponent);
    let section = a || "home", title;
    if (!a) title = homeView();
    else if (a === "learn" && b && LV[b]) title = levelView(LV[b]);
    else if (a === "learn" && !b) title = learnView();
    else if (a === "topic" && TP[b]) { title = topicView(TP[b]); section = "learn"; }
    else if (a === "formulas") title = formulasView();
    else if (a === "tools" && b && TL[b]) title = toolView(TL[b]);
    else if (a === "tools" && !b) title = toolsView();
    else if (a === "practice" && b && SK[b]) title = sessionView(SK[b]);
    else if (a === "practice" && !b) title = practiceView();
    else if (a === "search") title = searchView(new URLSearchParams(query).get("q") || "");
    else title = notFound();
    document.title = title ? `${title} · MathsZone` : "MathsZone · All of maths, from counting to calculus";
    document.querySelectorAll("[data-route]").forEach((el) => {
      if (el.dataset.route === section) el.setAttribute("aria-current", "page"); else el.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }

  const themeBtn = document.getElementById("themeBtn");
  function paintTheme() {
    const dark = document.documentElement.dataset.theme === "dark";
    themeBtn.innerHTML = icon(dark ? "sun" : "moon");
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeBtn.title = dark ? "Light mode" : "Dark mode";
    document.querySelector('meta[name="theme-color"]').content = dark ? "#0e0d16" : "#f7f7fb";
  }
  themeBtn.addEventListener("click", () => {
    const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("mz-theme", t); } catch (e) {}
    paintTheme();
    window.dispatchEvent(new Event("mz-theme"));
  });

  document.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
  paintTheme();
  window.addEventListener("hashchange", route);
  route();
})();
