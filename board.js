(function () {
  "use strict";

  const U = window.MZU;
  if (!U) return;
  const { icon, rich, store } = U;

  // Pen colours chosen to read on a near-white board in both light and dark themes.
  const COLORS = [
    { id: "ink", v: "#1f2430", name: "Black" },
    { id: "blue", v: "#2563eb", name: "Blue" },
    { id: "red", v: "#dc2626", name: "Red" },
    { id: "green", v: "#059669", name: "Green" },
    { id: "orange", v: "#d97706", name: "Orange" },
    { id: "purple", v: "#7c3aed", name: "Purple" },
  ];
  const SIZES = { pen: [2, 3.5, 6], marker: [14, 20, 28], eraser: [18, 34, 60] };
  const SIZE_NAMES = ["Thin", "Medium", "Thick"];

  let root = null, surf = null, paper = null, canvas = null, qBand = null, barEl = null;
  let vctx = null, base = null, cssW = 0, paperH = 0, dpr = 1;
  let strokes = [], redo = [], cur = null, drawing = false, ptId = null;
  let tool = "pen", color = COLORS[0].v, sizeIx = 1, open = false, grew = false;

  const lineW = () => SIZES[tool][sizeIx];

  function build() {
    if (root) return;
    root = document.createElement("div");
    root.className = "wb";
    root.hidden = true;
    root.innerHTML = `
      <div class="wb-bar" id="wbBar">
        <div class="wb-grp" role="group" aria-label="Drawing tools">
          <button type="button" class="wb-t" data-tool="pen" aria-label="Pen" aria-pressed="true">${icon("pen")}</button>
          <button type="button" class="wb-t" data-tool="marker" aria-label="Highlighter" aria-pressed="false">${icon("marker")}</button>
          <button type="button" class="wb-t" data-tool="eraser" aria-label="Eraser" aria-pressed="false">${icon("eraser")}</button>
          <button type="button" class="wb-t" data-tool="pan" aria-label="Move / scroll" aria-pressed="false">${icon("hand")}</button>
        </div>
        <div class="wb-grp wb-cols" role="group" aria-label="Pen colour">
          ${COLORS.map((c, i) => `<button type="button" class="wb-col${i === 0 ? " on" : ""}" data-col="${c.v}" style="--wc:${c.v}" aria-label="${c.name}" aria-pressed="${i === 0}"></button>`).join("")}
        </div>
        <div class="wb-grp wb-sizes" role="group" aria-label="Pen size">
          ${SIZE_NAMES.map((n, i) => `<button type="button" class="wb-sz${i === 1 ? " on" : ""}" data-sz="${i}" aria-label="${n}" aria-pressed="${i === 1}"><i></i></button>`).join("")}
        </div>
        <div class="wb-grp" role="group" aria-label="History">
          <button type="button" class="wb-t" id="wbUndo" aria-label="Undo" disabled>${icon("undo")}</button>
          <button type="button" class="wb-t" id="wbRedo" aria-label="Redo" disabled>${icon("redo")}</button>
          <button type="button" class="wb-t" id="wbClear" aria-label="Clear board">${icon("trash")}</button>
        </div>
        <div class="wb-grp wb-right">
          <button type="button" class="wb-t" id="wbGrow" aria-label="Add more space">${icon("expand")}</button>
          <button type="button" class="wb-t" id="wbQToggle" aria-label="Hide question" aria-pressed="true">${icon("list")}</button>
          <button type="button" class="wb-t wb-close" id="wbClose" aria-label="Close whiteboard">${icon("x")}</button>
        </div>
      </div>
      <div class="wb-q" id="wbQ"></div>
      <div class="wb-surf" id="wbSurf"><div class="wb-paper" id="wbPaper"><canvas></canvas></div></div>`;
    document.body.appendChild(root);

    surf = root.querySelector("#wbSurf");
    paper = root.querySelector("#wbPaper");
    canvas = paper.querySelector("canvas");
    qBand = root.querySelector("#wbQ");
    barEl = root.querySelector("#wbBar");
    vctx = canvas.getContext("2d");
    base = document.createElement("canvas");

    barEl.addEventListener("click", onBar);
    root.querySelector("#wbClose").addEventListener("click", hide);
    root.querySelector("#wbUndo").addEventListener("click", undo);
    root.querySelector("#wbRedo").addEventListener("click", doRedo);
    root.querySelector("#wbClear").addEventListener("click", clearBoard);
    root.querySelector("#wbGrow").addEventListener("click", () => addSpace(true));
    root.querySelector("#wbQToggle").addEventListener("click", toggleQ);

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", onResize);
  }

  function onBar(e) {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.tool) {
      tool = t.dataset.tool;
      barEl.querySelectorAll("[data-tool]").forEach((b) => b.setAttribute("aria-pressed", b === t));
      applyTool();
    } else if (t.dataset.col) {
      color = t.dataset.col;
      barEl.querySelectorAll("[data-col]").forEach((b) => { const on = b === t; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      if (tool === "eraser") { tool = "pen"; barEl.querySelectorAll("[data-tool]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.tool === "pen")); applyTool(); }
    } else if (t.dataset.sz != null) {
      sizeIx = +t.dataset.sz;
      barEl.querySelectorAll("[data-sz]").forEach((b) => { const on = b === t; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    }
  }

  function applyTool() {
    const pan = tool === "pan";
    canvas.style.pointerEvents = pan ? "none" : "auto";
    canvas.style.cursor = pan ? "grab" : "crosshair";
    root.classList.toggle("wb-pan", pan);
  }

  function toggleQ() {
    const b = root.querySelector("#wbQToggle");
    const hidden = qBand.classList.toggle("off");
    b.setAttribute("aria-pressed", !hidden);
    b.setAttribute("aria-label", hidden ? "Show question" : "Hide question");
    sizeSurface();
  }

  // ---- geometry ----
  function sizeSurface() {
    if (!open) return;
    const r = surf.getBoundingClientRect();
    const w = Math.max(280, Math.round(r.width));
    const minH = Math.max(Math.round(r.height), 1);
    if (!grew || paperH < minH) paperH = Math.max(paperH, minH);
    if (w !== cssW || canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(paperH * dpr)) {
      cssW = w;
      resizeCanvas(cssW, paperH);
    }
  }

  function resizeCanvas(w, h) {
    dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    for (const cv of [canvas, base]) {
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    }
    canvas.style.width = base.style.width = w + "px";
    canvas.style.height = base.style.height = h + "px";
    paper.style.height = h + "px";
    for (const g of [vctx, base.getContext("2d")]) { g.setTransform(1, 0, 0, 1, 0, 0); g.scale(dpr, dpr); }
    rebuild();
  }

  function addSpace(manual) {
    paperH += Math.round(surf.getBoundingClientRect().height * 0.8) || 500;
    grew = true;
    resizeCanvas(cssW, paperH);
    if (manual) surf.scrollTo({ top: surf.scrollHeight, behavior: "smooth" });
  }

  // ---- drawing ----
  function pt(e) {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  function stroke(g, s) {
    const p = s.pts;
    if (!p.length) return;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.globalCompositeOperation = s.mode === "eraser" ? "destination-out" : "source-over";
    g.globalAlpha = s.mode === "marker" ? 0.3 : 1;
    g.strokeStyle = s.mode === "eraser" ? "rgba(0,0,0,1)" : s.color;
    g.fillStyle = g.strokeStyle;
    g.lineWidth = s.size;
    if (p.length === 1) {
      g.beginPath();
      g.arc(p[0][0], p[0][1], s.size / 2, 0, Math.PI * 2);
      g.fill();
    } else {
      g.beginPath();
      g.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length - 1; i++) {
        const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2;
        g.quadraticCurveTo(p[i][0], p[i][1], mx, my);
      }
      g.lineTo(p[p.length - 1][0], p[p.length - 1][1]);
      g.stroke();
    }
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
  }

  function rebuild() {
    const g = base.getContext("2d");
    g.clearRect(0, 0, base.width, base.height);
    for (const s of strokes) stroke(g, s);
    paint();
  }

  function paint() {
    vctx.clearRect(0, 0, canvas.width, canvas.height);
    vctx.drawImage(base, 0, 0, cssW, paperH);
    if (cur) stroke(vctx, cur);
  }

  function onDown(e) {
    if (tool === "pan" || drawing) return;
    e.preventDefault();
    drawing = true;
    ptId = e.pointerId;
    try { canvas.setPointerCapture(ptId); } catch (err) {}
    cur = { mode: tool, color, size: lineW(), pts: [pt(e)] };
    paint();
  }

  function onMove(e) {
    if (!drawing || e.pointerId !== ptId) return;
    e.preventDefault();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs.length ? evs : [e]) cur.pts.push(pt(ev));
    const last = cur.pts[cur.pts.length - 1];
    if (last[1] > paperH - 80) addSpace(false);
    paint();
  }

  function onUp(e) {
    if (!drawing || e.pointerId !== ptId) return;
    drawing = false;
    try { canvas.releasePointerCapture(ptId); } catch (err) {}
    if (cur && cur.pts.length) {
      stroke(base.getContext("2d"), cur);
      strokes.push(cur);
      redo = [];
    }
    cur = null;
    paint();
    syncHistory();
  }

  function undo() {
    if (!strokes.length) return;
    redo.push(strokes.pop());
    rebuild();
    syncHistory();
  }
  function doRedo() {
    if (!redo.length) return;
    strokes.push(redo.pop());
    rebuild();
    syncHistory();
  }
  function clearBoard() {
    if (!strokes.length) return;
    redo = [];
    strokes = [];
    rebuild();
    syncHistory();
  }
  function syncHistory() {
    root.querySelector("#wbUndo").disabled = !strokes.length;
    root.querySelector("#wbRedo").disabled = !redo.length;
  }

  function onResize() {
    if (!open) return;
    grew = false;
    paperH = 0;
    sizeSurface();
  }

  function onKey(e) {
    if (!open) return;
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); hide(); return; }
    if (e.ctrlKey || e.metaKey) {
      const k = e.key.toLowerCase();
      if (k === "z") { e.preventDefault(); e.stopPropagation(); e.shiftKey ? doRedo() : undo(); }
      else if (k === "y") { e.preventDefault(); e.stopPropagation(); doRedo(); }
    }
  }

  // ---- public ----
  function setQuestion(html) {
    build();
    qBand.innerHTML = `<span class="wb-q-tag">Question</span><div class="wb-q-body">${rich(html || "")}</div>`;
    strokes = [];
    redo = [];
    cur = null;
    grew = false;
    paperH = 0;
    if (open) { sizeSurface(); syncHistory(); }
  }

  function show() {
    build();
    if (open) return;
    open = true;
    root.hidden = false;
    document.body.classList.add("wb-open");
    applyTool();
    requestAnimationFrame(() => { paperH = 0; grew = false; sizeSurface(); syncHistory(); });
  }

  function hide() {
    if (!open) return;
    open = false;
    root.hidden = true;
    document.body.classList.remove("wb-open");
  }

  function toggle(html) {
    build();
    if (html != null && !open) setQuestion(html);
    open ? hide() : show();
  }

  document.addEventListener("keydown", onKey, true);

  window.MZB = { show, hide, toggle, setQuestion, isOpen: () => open };
})();
