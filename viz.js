/* MathsZone — animated "Watch it" solutions.
   Each practice item may carry `viz: { t, ...data }`. A builder turns it into a scene whose
   elements carry data-s (first frame shown), data-x (frame hidden), data-h (frames highlighted)
   and data-a ("frame class", class added from that frame on). */
(function () {
  "use strict";
  const U = () => window.MZU, Hp = () => window.MZ_HELP, E = () => window.MZE;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const r1 = (v) => Math.round(v * 10) / 10;
  const nm = (v) => { const x = +(+v).toFixed(6); return x < 0 ? "−" + Math.abs(x) : String(x); };
  const IN = (v) => Number(v).toLocaleString("en-IN");
  const tx = (s) => U().tex(s);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const plain = (s) => String(s).replace(/-/g, "−").replace(/\\cdot/g, "·").replace(/\^\{?(\d)\}?/g, (m, d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
  const COL = ["#8b5cf6", "#f59e0b", "#10b981", "#ec4899", "#3b82f6"];
  const hc = (i, s) => `\\textcolor{${COL[i]}}{${s}}`;
  const par = (n) => (n < 0 ? `(${n})` : `${n}`);
  let uid = 0;

  function Scene() {
    const caps = [];
    return { caps, step(c) { caps.push(c); return caps.length - 1; } };
  }
  const A = (k, o) => {
    o = o || {};
    let s = k == null ? "" : ` data-s="${k}"`;
    if (o.x != null) s += ` data-x="${o.x}"`;
    const hs = o.h == null ? [] : [].concat(o.h).filter((v) => v != null && v >= 0);
    if (hs.length) s += ` data-h="${hs.join(" ")}"`;
    if (o.add) s += ` data-a="${o.add[0]} ${o.add[1]}"`;
    const st = [o.d != null ? `--d:${o.d}` : "", o.st || ""].filter(Boolean).join(";");
    if (st) s += ` style="${st}"`;
    return s;
  };

  /* ---------- SVG primitives ---------- */
  const svg = (w, h, body, cls) => `<svg class="vz-svg${cls ? " " + cls : ""}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${body}</svg>`;
  const T = (x, y, s, k, cls, o) => {
    o = o || {};
    return `<text x="${r1(x)}" y="${r1(y)}"${cls ? ` class="${cls}"` : ""} text-anchor="${o.a || "middle"}"${o.fs ? ` font-size="${o.fs}"` : ""}${A(k, o)}>${esc(s)}</text>`;
  };
  const P = (d, k, cls, o) => { o = o || {}; return `<path d="${d}" class="${cls || "ln"}${o.draw ? " draw" : ""}"${o.draw ? ' pathLength="1"' : ""}${o.clip ? ` clip-path="url(#${o.clip})"` : ""}${A(k, o)}/>`; };
  const Ln = (x1, y1, x2, y2, k, cls, o) => P(`M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`, k, cls, o);
  const Ci = (cx, cy, r, k, cls, o) => `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" class="${cls || "ln"}"${A(k, o)}/>`;
  const Rc = (x, y, w, h, k, cls, o) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(Math.max(0, w))}" height="${r1(Math.max(0, h))}"${o && o.rx ? ` rx="${o.rx}"` : ""} class="${cls || "ln"}"${A(k, o)}/>`;
  const G = (body, k, o) => `<g${A(k, o)}>${body}</g>`;
  const Poly = (pts, k, cls, o) => P("M" + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L") + "Z", k, cls, o);
  const head = (x, y, ang, cls) => {
    const a = 8, w = 0.42;
    return `<path d="M${r1(x)} ${r1(y)}L${r1(x - a * Math.cos(ang - w))} ${r1(y - a * Math.sin(ang - w))}L${r1(x - a * Math.cos(ang + w))} ${r1(y - a * Math.sin(ang + w))}Z" class="hd ${cls || ""}"/>`;
  };
  const Ar = (x1, y1, x2, y2, k, cls, o) => G(Ln(x1, y1, x2, y2, null, cls || "ln") + head(x2, y2, Math.atan2(y2 - y1, x2 - x1), cls), k, o);
  const Hop = (x1, x2, y, up, k, cls, label, o) => {
    const h = Math.min(36, Math.max(14, Math.abs(x2 - x1) * 0.4)) * (up ? -1 : 1), mx = (x1 + x2) / 2;
    return G(P(`M${r1(x1)} ${r1(y)}Q${r1(mx)} ${r1(y + 2 * h)} ${r1(x2)} ${r1(y)}`, null, `${cls} thick`) + head(x2, y, Math.atan2(-2 * h, x2 - mx), cls) +
      (label != null ? T(mx, y + h + (up ? -9 : 12), label, null, `${cls} b`) : ""), k, o);
  };
  const arcPath = (cx, cy, r, t0, t1) => {
    const p = (t) => [cx + r * Math.cos(t), cy - r * Math.sin(t)];
    const [x0, y0] = p(t0), [x1, y1] = p(t1), big = Math.abs(t1 - t0) > Math.PI ? 1 : 0, sw = t1 > t0 ? 0 : 1;
    return `M${r1(x0)} ${r1(y0)}A${r1(r)} ${r1(r)} 0 ${big} ${sw} ${r1(x1)} ${r1(y1)}`;
  };
  const sector = (cx, cy, r, t0, t1) => `M${r1(cx)} ${r1(cy)}L` + arcPath(cx, cy, r, t0, t1).slice(1) + "Z";
  const rightMark = (x, y, ux, uy, vx, vy, s, k) => P(`M${r1(x + ux * s)} ${r1(y + uy * s)}L${r1(x + (ux + vx) * s)} ${r1(y + (uy + vy) * s)}L${r1(x + vx * s)} ${r1(y + vy * s)}`, k, "ln thin");

  function fit(pts, W, H, pad) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min((W - 2 * pad) / (x1 - x0 || 1), (H - 2 * pad) / (y1 - y0 || 1));
    const ox = (W - (x1 - x0) * s) / 2, oy = (H - (y1 - y0) * s) / 2;
    return { s, f: ([x, y]) => [ox + (x - x0) * s, H - oy - (y - y0) * s] };
  }

  function niceStep(r, n) {
    const raw = r / (n || 8), p = 10 ** Math.floor(Math.log10(raw));
    for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= raw - 1e-12) return m * p;
    return 10 * p;
  }
  function plane(o) {
    const W = o.w || 320, H = o.h || 236, pl = 28, pr = 12, pt = 12, pb = 22;
    const { x0, x1, y0, y1 } = o;
    const X = (x) => pl + ((x - x0) / (x1 - x0)) * (W - pl - pr), Y = (y) => H - pb - ((y - y0) / (y1 - y0)) * (H - pt - pb);
    const sx = o.sx || niceStep(x1 - x0), sy = o.sy || niceStep(y1 - y0, 6);
    const ax = Math.min(Math.max(0, y0), y1), ay = Math.min(Math.max(0, x0), x1);
    let g = "";
    for (let x = Math.ceil(x0 / sx - 1e-9) * sx; x <= x1 + 1e-9; x += sx) {
      g += Ln(X(x), Y(y1), X(x), Y(y0), null, "gd");
      if (Math.abs(x) > 1e-9 || ay !== 0) g += T(X(x), Math.min(Y(ax) + 11, H - 6), nm(+x.toFixed(4)), null, "tk");
    }
    for (let y = Math.ceil(y0 / sy - 1e-9) * sy; y <= y1 + 1e-9; y += sy) {
      g += Ln(X(x0), Y(y), X(x1), Y(y), null, "gd");
      if (Math.abs(y) > 1e-9 || ax !== 0) g += T(Math.max(X(ay) - 4, 10), Y(y), nm(+y.toFixed(4)), null, "tk", { a: "end" });
    }
    if (y0 <= 0 && y1 >= 0) g += Ln(X(x0), Y(0), X(x1), Y(0), null, "ax");
    if (x0 <= 0 && x1 >= 0) g += Ln(X(0), Y(y0), X(0), Y(y1), null, "ax");
    if (o.lx) g += T(X(x1) - 2, Y(ax) - 8, o.lx, null, "tk i", { a: "end" });
    if (o.ly) g += T(X(ay) + 8, Y(y1) + 6, o.ly, null, "tk i", { a: "start" });
    const id = "vzc" + ++uid;
    const clip = `<clipPath id="${id}"><rect x="${pl}" y="${pt}" width="${W - pl - pr}" height="${H - pt - pb}"/></clipPath>`;
    const fn = (f, k, cls, q) => {
      q = q || {};
      const a = q.a != null ? q.a : x0, b = q.b != null ? q.b : x1, n = 200;
      const lo = y0 - (y1 - y0), hi = y1 + (y1 - y0);
      let d = "", pen = false;
      for (let i = 0; i <= n; i++) {
        const x = a + ((b - a) * i) / n, y = f(x);
        if (!isFinite(y) || y < lo || y > hi) { pen = false; continue; }
        d += `${pen ? "L" : "M"}${r1(X(x))} ${r1(Y(y))}`;
        pen = true;
      }
      return P(d || "M0 0", k, cls || "k1 thick", { ...q, draw: q.draw !== false, clip: id });
    };
    const pt_ = (x, y, k, cls, label, q) => {
      q = q || {};
      const dx = q.dx != null ? q.dx : 0, dy = q.dy != null ? q.dy : -12;
      return G(Ci(X(x), Y(y), q.r || 4.5, null, `dot ${cls || "k1"}`) + (label ? T(X(x) + dx, Y(y) + dy, label, null, `${cls || "k1"} b`, { a: q.a }) : ""), k, q);
    };
    return { W, H, X, Y, clipId: id, fn, pt: pt_, svg: (body) => svg(W, H, `<defs>${clip}</defs><g>${g}</g>${body}`) };
  }

  /* ---------- HTML primitives ---------- */
  const cel = (v, k, cls, o) => `<div class="vc${cls ? " " + cls : ""}"${A(k, o)}>${v}</div>`;
  const grid = (cols, body, cls) => `<div class="vg${cls ? " " + cls : ""}" style="grid-template-columns:${cols}">${body}</div>`;
  const eq = (v, k, cls, o) => `<div class="vz-eq${cls ? " " + cls : ""}"${A(k, o)}>${v}</div>`;
  const chip = (v, k, cls, o) => `<span class="vchip${cls ? " " + cls : ""}"${A(k, o)}>${v}</span>`;
  const stack = (items) => `<div class="vstack">${items.join("")}</div>`;
  const R = (S, html) => ({ html, caps: S.caps });

  function chainOf(lines, intro) {
    const S = Scene();
    let h = "";
    if (intro) { const k = S.step(intro[1]); h += `<div class="ch-l intro"${A(k, { h: k })}>${tx("\\displaystyle " + intro[0])}</div>`; }
    lines.forEach(([t, c]) => { const k = S.step(c); h += `<div class="ch-l"${A(k, { h: k })}>${tx("\\displaystyle " + t)}</div>`; });
    return R(S, `<div class="chain">${h}</div>`);
  }

  function fbar(parts, fill, k, o) {
    o = o || {};
    const thin = parts > 36;
    let seg = "";
    for (let i = 0; i < parts; i++) {
      const c = typeof fill === "function" ? fill(i) : i < fill ? "f1" : "";
      seg += `<i class="${c}${o.group && i && i % o.group === 0 ? " g" : ""}"></i>`;
    }
    return `<div class="fb${thin ? " thin" : ""}${o.cls ? " " + o.cls : ""}"${A(k, o)}>${seg}</div>`;
  }

  const B = {};

  /* ================= Foundation ================= */
  B.place = ({ n, i }) => {
    const S = Scene(), s = String(n), names = ["ten thousands", "thousands", "hundreds", "tens", "ones"], vals = [10000, 1000, 100, 10, 1];
    const d = +s[i], p = vals[i];
    const k0 = S.step(`Write each digit of ${IN(n)} in the place value chart.`);
    const k1 = S.step(`The ${d} is in the ${names[i]} column.`);
    const k2 = S.step(`Each ${names[i].replace(/s$/, "")} is worth ${IN(p)}, so the ${d} is worth $${d} \\times ${p} = ${d * p}$.`);
    let h = "";
    ["TTh", "Th", "H", "T", "O"].forEach((c, j) => { h += cel(c, k0, "vh", j === i ? { h: [k1, k2] } : {}); });
    [...s].forEach((c, j) => { h += cel(c, k0, "big", j === i ? { h: [k1, k2], d: j } : { d: j, add: [k1, "dim"] }); });
    [...s].forEach((c, j) => { h += cel(j < i ? "" : j === i ? d : "0", j < i ? null : k2, "big k1"); });
    return R(S, grid("repeat(5, 46px)", h, "pv") + eq(`${tx(`${d} \\times ${p} = ${d * p}`)}`, k2, "k1"));
  };

  B.round = ({ n, p }) => {
    const S = Scene(), lo = Math.floor(n / p) * p, hi = lo + p, mid = lo + p / 2, r = Math.round(n / p) * p, up = r === hi;
    const X = (v) => 30 + ((v - lo) / p) * 260, y = 70;
    const k0 = S.step(`${IN(n)} lies between ${IN(lo)} and ${IN(hi)}.`);
    const k1 = S.step(`Halfway between them is ${IN(mid)}.`);
    const k2 = S.step(`${IN(n)} is ${n >= mid ? "at or past" : "before"} the halfway mark.`);
    const k3 = S.step(`So it is closer to ${IN(r)}: round ${up ? "up" : "down"} to ${IN(r)}.`);
    let b = Ln(X(lo) - 12, y, X(hi) + 12, y, k0, "ax thick");
    for (let j = 0; j <= 10; j++) b += Ln(X(lo + (j * p) / 10), y - (j % 5 ? 4 : 8), X(lo + (j * p) / 10), y + (j % 5 ? 4 : 8), k0, "ln thin");
    b += T(X(lo), y + 22, IN(lo), k0, "b", { h: up ? null : k3 }) + T(X(hi), y + 22, IN(hi), k0, "b", { h: up ? k3 : null });
    b += Ln(X(mid), y - 16, X(mid), y + 16, k1, "k2 thick") + T(X(mid), y + 32, `halfway ${IN(mid)}`, k1, "k2 sm");
    b += G(Ci(X(n), y, 6, null, "dot k1") + T(X(n), y - 22, IN(n), null, "k1 b"), k2);
    b += Hop(X(n), X(r), y, true, k3, "k3", null);
    return R(S, svg(320, 120, b));
  };

  B.col = ({ a, b, op, dp = 0 }) => {
    const S = Scene(), add = op === "+", res = add ? a + b : a - b;
    const dig = (v, i) => Math.floor(v / 10 ** i) % 10;
    const len = (v) => Math.max(String(v).length, dp + 1);
    const w = Math.max(len(a), len(b), len(res));
    const PL = ["ones", "tens", "hundreds", "thousands", "ten thousands"];
    const place = (i) => (i - dp >= 0 ? PL[i - dp] : i - dp === -1 ? "tenths" : "hundredths");
    const fd = (v) => (dp ? (v / 10 ** dp).toFixed(dp) : String(v));
    const cols = [];
    for (let i = w - 1; i >= 0; i--) { cols.push(i); if (dp && i === dp) cols.push("."); }
    const carry = {}, adj = {}, resd = {}, hiA = {}, strike = {};
    S.step(`Line up the digits by place value${dp ? ", with the decimal points in a column" : ""}.`);
    if (add) {
      let c = 0;
      for (let i = 0; i < w; i++) {
        const da = dig(a, i), db = dig(b, i), t = da + db + c, onlyCarry = i >= len(a) && i >= len(b);
        const k = S.step(onlyCarry ? `The carried 1 becomes the ${place(i)} digit.` : `${cap(place(i))}: $${da}${i < len(b) ? ` + ${db}` : ""}${c ? " + 1" : ""} = ${t}$${t >= 10 ? `. Write ${t % 10} and carry 1.` : "."}`);
        resd[i] = { v: t % 10, k }; hiA[i] = k;
        if (c) carry[i].h = k;
        c = t >= 10 ? 1 : 0;
        if (c) carry[i + 1] = { v: 1, k };
      }
    } else {
      const cur = [];
      for (let i = 0; i < w; i++) cur.push(dig(a, i));
      const setAdj = (i, v, k) => { (adj[i] = adj[i] || []).push({ v, k }); if (strike[i] == null) strike[i] = k; };
      for (let i = 0; i < w && i < len(a); i++) {
        const bd = i < len(b) ? dig(b, i) : 0;
        let cap_;
        if (cur[i] < bd) {
          const before = cur[i];
          let j = i + 1; while (cur[j] === 0) j++;
          const k = S.caps.length;
          cur[j]--; setAdj(j, cur[j], k);
          for (let m = j - 1; m > i; m--) { cur[m] = 9; setAdj(m, 9, k); }
          cur[i] += 10; setAdj(i, cur[i], k);
          cap_ = `${cap(place(i))}: ${before} is less than ${bd}, so borrow 1 from the ${place(j)}${j > i + 1 ? " (the zeros in between become 9s)" : ""}. $${cur[i]} - ${bd} = ${cur[i] - bd}$.`;
        } else cap_ = `${cap(place(i))}: $${cur[i]} - ${bd} = ${cur[i] - bd}$.`;
        const k = S.step(cap_);
        resd[i] = { v: cur[i] - bd, k, hide: i >= len(res) && i > dp }; hiA[i] = k;
      }
    }
    const kF = S.step(`So $${fd(a)} ${add ? "+" : "-"} ${fd(b)} = ${fd(res)}$.`);
    const n = cols.length + 1;
    const row = (fn) => [`<div class="vc"></div>`, ...cols.map((c) => (c === "." ? fn(".") : fn(c)))].join("");
    let h = "";
    if (add) h += row((c) => (c === "." ? cel("", null, "dotc") : carry[c] ? cel(carry[c].v, carry[c].k, "carry", { h: carry[c].h }) : cel("", null, "carry")));
    else h += row((c) => (c === "." ? cel("", null, "dotc") : adj[c] ? `<div class="vc carry vst">${adj[c].map((v, j) => `<span${A(v.k, { x: adj[c][j + 1] ? adj[c][j + 1].k : null })}>${v.v}</span>`).join("")}</div>` : cel("", null, "carry")));
    h += row((c) => (c === "." ? cel(".", null, "dotc big") : cel(c < len(a) ? dig(a, c) : "", 0, "big", { h: hiA[c], add: strike[c] != null ? [strike[c], "strike"] : null })));
    h += `<div class="vc big op">${add ? "+" : "−"}</div>` + cols.map((c) => (c === "." ? cel(".", null, "dotc big ul") : cel(c < len(b) ? dig(b, c) : "", 0, "big ul", { h: hiA[c] }))).join("");
    h += row((c) => (c === "." ? cel(".", resd[dp] ? resd[dp].k : kF, "dotc big k1") : resd[c] && !resd[c].hide ? cel(resd[c].v, resd[c].k, "big k1", { h: c === 0 ? kF : null }) : cel("", null, "big")));
    return R(S, grid(`repeat(${n}, auto)`, h, "colm"));
  };

  B.partwhole = ({ whole, part, ans, take }) => {
    const S = Scene();
    const k0 = S.step(`The whole amount is ${whole}.`);
    const k1 = S.step(take ? `${part} is what is left after taking some away.` : `One part is ${part}.`);
    const k2 = S.step(`The missing part is the rest of the whole: $${whole} - ${part}$.`);
    const k3 = S.step(`$${whole} - ${part} = ${ans}$, so the missing number is ${ans}.`);
    const h = `<div class="pw">
      <div class="pw-whole"${A(k0)}>
        <span class="pw-cap">whole</span>
        <span class="pw-val">${whole}</span>
      </div>
      <div class="pw-brace" aria-hidden="true"></div>
      <div class="pw-parts">
        <div class="pw-seg miss"${A(k2, { st: `flex:${ans}` })}>
          <span class="pw-cap">missing</span>
          <span class="pw-val vst"><span${A(k2, { x: k3 })}>?</span><span${A(k3)}>${ans}</span></span>
        </div>
        <div class="pw-seg part"${A(k1, { st: `flex:${part}` })}>
          <span class="pw-cap">${take ? "left" : "part"}</span>
          <span class="pw-val">${part}</span>
        </div>
      </div>
      <div class="pw-eq"${A(k2, { h: k3 })}>${tx(`${whole} - ${part} = `)}<span class="vst"><span${A(k2, { x: k3 })}>?</span><span class="pw-ans"${A(k3)}>${ans}</span></span></div>
    </div>`;
    return R(S, h);
  };

  function longMulViz(a, b, opts = {}) {
    const S = Scene();
    const dpA = opts.dpA || 0, dpB = opts.dpB || 0, dp = dpA + dpB;
    const showA = dpA ? a / 10 ** dpA : a, showB = dpB ? b / 10 ** dpB : b;
    const product = a * b, showP = dp ? +(product / 10 ** dp).toFixed(dp) : product;
    const shown = (x) => (Number.isInteger(x) ? String(x) : E().fmt(x));
    const places = ["ones", "tens", "hundreds", "thousands"];
    let top = a, bot = b;
    if (String(b).length > String(a).length) { top = b; bot = a; }
    const w = Math.max(String(top).length, String(bot).length, String(product).length);
    const ncols = w + 1;
    const blank = () => cel("", null, "sd-sp");
    const put = (c) => (c ? cel(c.v, c.k, c.cls || "big", c.o) : blank());
    const fromRight = (n, k, cls) => {
      const row = Array(ncols).fill(null), s = String(n);
      for (let i = 0; i < s.length; i++) row[ncols - s.length + i] = { v: s[i], k, cls };
      return row;
    };
    if (dp) S.step(`Ignore the decimal points: treat $${shown(showA)} \\times ${shown(showB)}$ as $${a} \\times ${b}$.`);
    else S.step(`Write ${top} and ${bot} in columns. Multiply from the ones.`);
    const botLen = String(bot).length, rows = [];
    let kF;
    if (botLen === 1 && String(top).length === 1) {
      const kP = S.step(`$${bot} \\times ${top} = ${product}$. Write ${product} underneath.`);
      kF = S.step(dp ? `${dpA} + ${dpB} = ${dp} decimal places, so ${product} becomes ${shown(showP)}.` : `So $${top} \\times ${bot} = ${product}$.`);
      const botR = fromRight(bot, 0, "big ul");
      botR[0] = { v: "×", k: 0, cls: "big op" };
      rows.push(fromRight(top, 0, "big"), botR, fromRight(product, kP, "big k1"));
    } else if (botLen === 1) {
      const d = bot, topS = String(top);
      let carry = 0;
      const carryRow = Array(ncols).fill(null), prodRow = Array(ncols).fill(null);
      for (let i = 0; i < topS.length || carry; i++) {
        const da = i < topS.length ? +topS[topS.length - 1 - i] : 0, t = da * d + carry, write = t % 10, next = Math.floor(t / 10);
        const k = S.step(i < topS.length
          ? `$${d} \\times ${da}${carry ? ` + ${carry}` : ""} = ${t}$.${t >= 10 ? ` Write ${write} and carry ${next}.` : ` Write ${write} underneath.`}`
          : `Write the carried ${carry}.`);
        prodRow[ncols - 1 - i] = { v: write, k, cls: "big k1" };
        if (next && ncols - 2 - i > 0) carryRow[ncols - 2 - i] = { v: next, k, cls: "carry" };
        carry = next;
      }
      kF = S.step(dp ? `The whole-number product is ${product}. ${dp} decimal places: ${shown(showP)}.` : `So $${top} \\times ${bot} = ${product}$.`);
      const botR = fromRight(bot, 0, "big ul");
      botR[0] = { v: "×", k: 0, cls: "big op" };
      if (carryRow.some(Boolean)) rows.push(carryRow);
      rows.push(fromRight(top, 0, "big"), botR, prodRow);
    } else {
      const partials = [];
      for (let p = 0; p < botLen; p++) {
        const d = Math.floor(bot / 10 ** p) % 10;
        if (!d) { S.step(`The ${places[p]} digit of ${bot} is 0, so that row is 0.`); continue; }
        const raw = top * d, val = raw * 10 ** p;
        const k = S.step(p === 0
          ? `Ones of ${bot}: $${top} \\times ${d} = ${raw}$. Write ${raw} underneath.`
          : `${cap(places[p])} of ${bot}: $${top} \\times ${d} = ${raw}$, then a 0 in the ones (it is really ${val}).`);
        partials.push({ val, k });
      }
      const kAdd = partials.length > 1 ? S.step(`Add the rows: $${partials.map((p) => p.val).join(" + ")} = ${product}$.`) : partials[0].k;
      kF = S.step(dp ? `${dp} decimal places, so ${product} becomes ${shown(showP)}.` : `So $${top} \\times ${bot} = ${product}$.`);
      const botR = fromRight(bot, 0, "big ul");
      botR[0] = { v: "×", k: 0, cls: "big op" };
      rows.push(fromRight(top, 0, "big"), botR);
      partials.forEach((p, i) => {
        const last = i === partials.length - 1, r = fromRight(p.val, p.k, last && partials.length > 1 ? "big ul" : "big");
        if (i === 1) r[0] = { v: "+", k: p.k, cls: "big op" };
        rows.push(r);
      });
      if (partials.length > 1) rows.push(fromRight(product, kAdd, "big k1"));
      else rows[rows.length - 1] = fromRight(partials[0].val, partials[0].k, "big k1");
    }
    let h = "";
    rows.forEach((row) => { for (let i = 0; i < ncols; i++) h += put(row[i]); });
    return R(S, grid(`repeat(${ncols}, auto)`, h, "colm lmul") + (dp ? eq(`${shown(showA)} × ${shown(showB)} = <b>${shown(showP)}</b>`, kF, "k1") : ""));
  }

  B.array = ({ a, b }) => longMulViz(a, b);

  B.shortdiv = ({ a, b }) => {
    const S = Scene(), ds = String(a).split("").map(Number), q = a / b, n = ds.length, cols = n + 2;
    const qCell = Array(n).fill(null), extra = [];
    S.step(`Set it out as long division: ${b} outside, ${IN(a)} inside. Work from the left.`);
    let rem = 0, started = false;
    ds.forEach((d, j) => {
      const cur = rem * 10 + d, qd = Math.floor(cur / b), prod = qd * b, nr = cur - prod;
      if (!qd && !started) {
        S.step(j + 1 < n ? `${b} doesn't go into ${cur}, so look at the next digit too.` : `${b} doesn't go into ${cur}.`);
        rem = cur;
        return;
      }
      const kQ = S.step(`${b} goes into ${cur} ${qd} time${qd === 1 ? "" : "s"}. Write ${qd} on top.`);
      qCell[j] = { v: qd, k: kQ };
      started = true;
      const kP = S.step(`$${b} \\times ${qd} = ${prod}$. Write ${prod} under ${cur}.`);
      const kS = S.step(`Subtract: $${cur} - ${prod} = ${nr}$.`);
      const pds = String(prod).split(""), end = j + 1, p0 = end - pds.length + 1;
      const prodRow = Array(cols).fill(null);
      prodRow[Math.max(0, p0 - 1)] = { v: "−", k: kP, cls: "big op" };
      pds.forEach((ch, i) => { prodRow[p0 + i] = { v: ch, k: kP, cls: "big ul" }; });
      prodRow[cols - 1] = { v: `${b}×${qd}`, k: kP, cls: "sd-mul" };
      extra.push(prodRow);
      const remRow = Array(cols).fill(null);
      const rds = String(nr).split("");
      rds.forEach((ch, i) => { remRow[end - rds.length + 1 + i] = { v: ch, k: kS, cls: "big k1" }; });
      if (j + 1 < n) {
        const next = nr * 10 + ds[j + 1];
        const kB = S.step(`Bring down the ${ds[j + 1]}. Now we have ${next}.`);
        remRow[j + 2] = { v: ds[j + 1], k: kB, cls: "big k2" };
      }
      extra.push(remRow);
      rem = nr;
    });
    const kF = S.step(`So $${a} \\div ${b} = ${q}$. Check: $${b} \\times ${q} = ${a}$.`);
    const blank = () => cel("", null, "sd-sp");
    const put = (c) => (c ? cel(c.v, c.k, c.cls, c.o) : blank());
    let h = blank() + ds.map((_, j) => (qCell[j] ? cel(qCell[j].v, qCell[j].k, "big k1") : blank())).join("") + blank();
    h += cel(b, 0, "big sd-div") + ds.map((d) => cel(d, 0, "big sd-in")).join("") + blank();
    extra.forEach((row) => { row.forEach((c) => { h += put(c); }); });
    return R(S, grid(`repeat(${cols}, auto)`, h, "sdiv ldiv"));
  };

  B.roman = ({ n, r }) => {
    const S = Scene(), letters = [["I", 1], ["V", 5], ["X", 10], ["L", 50]];
    const k0 = S.step(`Roman letters: I = 1, V = 5, X = 10, L = 50.`);
    const map = [[40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    const built = [];
    let left = n;
    map.forEach(([v, s]) => { while (left >= v) { built.push(s); left -= v; } });
    const k1 = S.step(`Build ${n} from the largest letter that fits: ${built.join(" + ")}.`);
    const k2 = S.step(`So ${n} = ${r}.`);
    let h = letters.map(([s, v]) => cel(s, k0, "big k1") + cel(v, k0, "sm")).join("");
    h += `<div class="rom-build"${A(k1)}>${built.map((s, i) => `<b${A(k1, { d: i })}>${s}</b>`).join("<i>+</i>")}</div>`;
    return R(S, grid("repeat(4, auto)", h, "roman") + eq(`<b>${r}</b> = ${n}`, k2, "k1"));
  };

  B.shape = ({ kind, n }) => {
    const S = Scene(), N = n, R0 = 70, cx = 160, cy = 88;
    const pts = Array.from({ length: N }, (_, i) => {
      const t = -Math.PI / 2 + (2 * Math.PI * i) / N;
      return [cx + R0 * Math.cos(t), cy + R0 * Math.sin(t)];
    });
    const k0 = S.step(`Draw a ${kind}: a closed shape with ${N} straight sides.`);
    const k1 = S.step(`Count the sides: ${N}.`);
    const k2 = S.step(`Each corner is a vertex. A ${kind} has ${N} vertices too.`);
    let g = Poly(pts, k0, "f1 ln thick");
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % N];
      g += Ln(p[0], p[1], q[0], q[1], k1, "k2 thick5", { draw: true, d: i });
      g += Ci(p[0], p[1], 5, k2, "dot k3", { d: i });
    });
    return R(S, svg(320, 180, g) + eq(`${kind}: <b>${N}</b> sides, <b>${N}</b> vertices`, k2, "k1"));
  };

  B.symm = ({ kind, lines }) => {
    const S = Scene(), cx = 160, cy = 90;
    const k0 = S.step(`Draw a ${kind}.`);
    const k1 = S.step(lines ? `A line of symmetry folds the shape onto itself. This one has ${lines}.` : `No fold matches both halves, so it has 0 lines of symmetry.`);
    let body = "";
    if (kind.startsWith("square")) body = Rc(cx - 50, cy - 50, 100, 100, k0, "f1 ln thick");
    else if (kind.startsWith("rectangle")) body = Rc(cx - 70, cy - 40, 140, 80, k0, "f1 ln thick");
    else {
      const eq = kind.includes("equilateral"), iso = kind.includes("isosceles");
      const pts = eq ? [[cx, cy - 58], [cx - 62, cy + 48], [cx + 62, cy + 48]]
        : iso ? [[cx, cy - 58], [cx - 48, cy + 48], [cx + 48, cy + 48]]
        : [[cx - 10, cy - 58], [cx - 70, cy + 48], [cx + 62, cy + 36]];
      body = Poly(pts, k0, "f1 ln thick");
    }
    const folds = [];
    if (kind.startsWith("square")) folds.push([cx, cy - 62, cx, cy + 62], [cx - 62, cy, cx + 62, cy], [cx - 50, cy - 50, cx + 50, cy + 50], [cx + 50, cy - 50, cx - 50, cy + 50]);
    else if (kind.startsWith("rectangle")) folds.push([cx, cy - 52, cx, cy + 52], [cx - 82, cy, cx + 82, cy]);
    else if (kind.includes("equilateral")) {
      folds.push([cx, cy - 68, cx, cy + 56]);
      folds.push([cx - 58, cy - 22, cx + 40, cy + 52]);
      folds.push([cx + 58, cy - 22, cx - 40, cy + 52]);
    } else if (kind.includes("isosceles")) folds.push([cx, cy - 68, cx, cy + 56]);
    let g = body;
    folds.forEach((f, i) => { g += Ln(f[0], f[1], f[2], f[3], k1, "k4 dash", { d: i }); });
    return R(S, svg(320, 190, g) + eq(`lines of symmetry: <b>${lines}</b>`, k1, "k1"));
  };

  B.primes = ({ n, list }) => {
    const S = Scene(), hi = Math.max(n, 10);
    const k0 = S.step(`Write the numbers from 1 to ${hi}.`);
    const k1 = S.step(`Cross out 1: it is not a [[primes|prime]].`);
    const k2 = S.step(`A [[primes|prime]] has exactly two factors. Highlight ${list.join(", ")}.`);
    let h = "";
    for (let i = 1; i <= hi; i++) {
      const p = list.includes(i);
      h += cel(i, k0, `big${i === 1 ? "" : p ? " k1" : ""}`, { add: i === 1 ? [k1, "strike dim"] : !p ? [k2, "dim"] : null, h: p ? k2 : i === 1 ? k1 : null });
    }
    return R(S, grid("repeat(5, auto)", h, "pgrid") + eq(`primes: <b>${list.join(", ")}</b>`, k2, "k1"));
  };

  B.quadang = ({ a, b, c, d }) => {
    const S = Scene();
    const pts = [[40, 40], [260, 28], [280, 150], [50, 168]];
    const k0 = S.step(`A quadrilateral has four angles. They always add to $360^\\circ$.`);
    const k1 = S.step(`Add the three you know: $${a} + ${b} + ${c} = ${a + b + c}$.`);
    const k2 = S.step(`The leftover is $360 - ${a + b + c} = ${d}$.`);
    const labs = [a, b, c, "?"];
    let g = Poly(pts, k0, "f1 ln thick");
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % 4], r = pts[(i + 3) % 4];
      const mx = p[0] * 0.72 + (q[0] + r[0]) * 0.14, my = p[1] * 0.72 + (q[1] + r[1]) * 0.14;
      g += T(mx, my, i < 3 ? `${labs[i]}°` : "?", i < 3 ? k1 : k1, i === 3 ? "k4 b" : "b");
    });
    g += T(160, 200, `${d}°`, k2, "k1 big");
    return R(S, svg(320, 220, g));
  };

  B.solid3d = ({ kind, F, E, V, ask }) => {
    const S = Scene();
    const k0 = S.step(`A ${kind} is a solid. Count faces (flat sides), edges and vertices (corners).`);
    const kF = S.step(`Faces: ${F}.`);
    const kE = S.step(`Edges: ${E}.`);
    const kV = S.step(`Vertices: ${V}.`);
    S.step(`Euler's check: $${F} + ${V} - ${E} = ${F + V - E}$.`);
    const row = (lab, val, k, cls) => cel(lab, k, "vh") + cel(val, k, `big ${cls || ""}`);
    return R(S, grid("auto 56px", row("faces", F, kF, ask === "F" ? "k1" : "") + row("edges", E, kE, ask === "E" ? "k1" : "") + row("vertices", V, kV, ask === "V" ? "k1" : ""), "tbl") + eq(`F + V − E = <b>${F + V - E}</b>`, kV + 1, "k1"));
  };

  const ftex = (n, d) => tx(d === 1 ? `${n}` : `\\dfrac{${n}}{${d}}`);
  const frow = (bar, label, k, o) => `<div class="fr"${A(k, o)}>${bar}<span class="fl">${label}</span></div>`;

  B.fracadd = ({ n1, d1, n2, d2 }) => {
    const S = Scene(), L = E().lcm(d1, d2), a = n1 * (L / d1), b = n2 * (L / d2), N = a + b, g = E().gcd(N, L);
    const k0 = S.step(`Draw $\\frac{${n1}}{${d1}}$ and $\\frac{${n2}}{${d2}}$ as bars of the same length.`);
    const k1 = S.step(`The pieces are different sizes, so cut both bars into ${L} equal pieces (the LCM of ${d1} and ${d2}).`);
    const k2 = S.step(`Now $\\frac{${n1}}{${d1}} = \\frac{${a}}{${L}}$ and $\\frac{${n2}}{${d2}} = \\frac{${b}}{${L}}$. Put the shaded pieces together: ${a} + ${b} = ${N} pieces.`);
    const k3 = g > 1 ? S.step(`Group the pieces in ${g}s: $\\frac{${N}}{${L}} = ${L / g === 1 ? N / g : `\\frac{${N / g}}{${L / g}}`}$.`) : S.step(`${N} and ${L} share no factor, so the answer is $\\frac{${N}}{${L}}$.`);
    const col = (i) => (i < a ? "f1" : i < N ? "f2" : "");
    const nb = Math.ceil(N / L);
    let res = "";
    for (let j = 0; j < nb; j++) res += fbar(L, (i) => col(i + j * L), null, { group: g > 1 ? g : 0 });
    let h = frow(stack([fbar(d1, n1, k0, { x: k1 }), fbar(L, a, k1, { group: L / d1 })]), `<span class="vst"><span${A(k0, { x: k1 })}>${ftex(n1, d1)}</span><span${A(k1)}>${ftex(a, L)}</span></span>`, k0, {});
    h += frow(stack([fbar(d2, (i) => (i < n2 ? "f2" : ""), k0, { x: k1 }), fbar(L, (i) => (i < b ? "f2" : ""), k1, { group: L / d2 })]), `<span class="vst"><span${A(k0, { x: k1 })}>${ftex(n2, d2)}</span><span${A(k1)}>${ftex(b, L)}</span></span>`, k0, {});
    h += `<div class="fsum"${A(k2)}>${res.replace(/<div class="fb/g, '<div class="fb')}<span class="fl"><span class="vst"><span${A(k2, { x: g > 1 ? k3 : null })}>${ftex(N, L)}</span>${g > 1 ? `<span${A(k3)}>${ftex(N / g, L / g)}</span>` : ""}</span></span></div>`;
    return R(S, `<div class="fracs">${h}</div>`);
  };

  B.fracsimp = ({ N, D, k: f }) => {
    const S = Scene(), n0 = N / f, d0 = D / f;
    const k0 = S.step(`$\\frac{${N}}{${D}}$: a bar cut into ${D} pieces with ${N} shaded.`);
    const k1 = S.step(`The HCF of ${N} and ${D} is ${f}, so group the pieces in ${f}s.`);
    const k2 = S.step(`Now there are ${d0} bigger pieces and ${n0} are shaded: $\\frac{${N}}{${D}} = \\frac{${n0}}{${d0}}$. Same amount, simpler fraction.`);
    const h = frow(stack([fbar(D, N, k0, { x: k1 }), fbar(D, N, k1, { group: f, x: k2 }), fbar(d0, n0, k2, { cls: "bold" })]),
      `<span class="vst"><span${A(k0, { x: k2 })}>${ftex(N, D)}</span><span${A(k2)}>${ftex(n0, d0)}</span></span>`, k0);
    return R(S, `<div class="fracs">${h}</div>`);
  };

  B.fraccmp = ({ list, big }) => {
    const S = Scene();
    const k0 = S.step(`Draw each fraction as a bar of the same length.`);
    const k1 = S.step(`Compare how much of each bar is shaded. Dividing top by bottom gives the decimals.`);
    const k2 = S.step(`The ${big ? "longest" : "shortest"} shaded part is $\\frac{${list[0][0]}}{${list[0][1]}}$, so it is the ${big ? "largest" : "smallest"}.`);
    const h = list.map(([n, d], i) => frow(fbar(d, n, null), `${ftex(n, d)}<small${A(k1)}> ≈ ${(n / d).toFixed(3)}</small>`, k0, { d: i, h: i === 0 ? k2 : null, add: i ? [k2, "dim"] : null })).join("");
    return R(S, `<div class="fracs">${h}</div>`);
  };

  B.shift = ({ ds, ip, m, pre, post, tail }) => {
    const S = Scene(), len = ds.length, end = ip + m, dir = Math.sign(m);
    const L0 = Math.min(0, end - 1), R0 = Math.max(len, end) - 1;
    const k0 = S.step(pre);
    const hops = [];
    for (let h = 1; h <= Math.abs(m); h++) hops.push(S.step(`Hop ${h}${h === Math.abs(m) ? "." : ""}`));
    const kF = S.step(post);
    const posAt = (f) => ip + dir * f;
    const firstNZ = [...ds].findIndex((c) => c !== "0"), lastNZ = len - 1 - [...ds].reverse().findIndex((c) => c !== "0");
    let h = "";
    const gap = (g) => {
      let s = "";
      if (g === ip) s += `<b class="pt"${A(k0, { x: hops[0] != null ? hops[0] : null })}>.</b>`;
      hops.forEach((k, j) => { if (posAt(j + 1) === g) s += `<b class="pt"${A(k, { x: hops[j + 1] != null ? hops[j + 1] : null })}>.</b>`; });
      return `<span class="gap">${s}</span>`;
    };
    for (let c = L0; c <= R0; c++) {
      h += gap(c);
      const isPad = c < 0 || c >= len, digit = isPad ? "0" : ds[c];
      let hopK = null, hopN = 0;
      hops.forEach((k, j) => { const from = posAt(j), to = posAt(j + 1); if (Math.min(from, to) === c) { hopK = k; hopN = j + 1; } });
      let padK = null;
      if (isPad) hops.forEach((k, j) => { const to = posAt(j + 1); if (padK == null && ((c < 0 && to <= c + 1) || (c >= len && to > c))) padK = k; });
      const dimNow = (c < end - 1 && (c < firstNZ || isPad && c < 0)) || (c >= end && (c > lastNZ || c >= len));
      h += `<span class="dg${isPad ? " pad" : ""}"${isPad ? A(padK != null ? padK : kF) : ""}${dimNow ? ` data-a="${kF} dim"${isPad ? "" : ' data-s="0"'}` : ""}>${digit}${hopK != null ? `<sup${A(hopK)}>${hopN}</sup>` : ""}</span>`;
    }
    h += gap(R0 + 1);
    return R(S, `<div class="shift">${h}</div>${tail ? eq(U().rich(tail), kF, "k1") : ""}`);
  };

  B.groups = ({ n, unit, extra, u1, u1s, u2 }) => {
    const S = Scene(), total = n * unit + extra, many = n > 6, one = u1s || u1, nu = n === 1 ? one : u1;
    const k0 = S.step(`1 ${one} = ${unit} ${u2}.`);
    let h = "";
    if (many) h += `<div class="gblk"${A(k0)}><b>${n} × ${unit}</b><small>${n} ${nu}</small></div>`;
    else for (let i = 0; i < n; i++) h += `<div class="gblk"${A(k0, { d: i })}><b>${unit}</b><small>1 ${one}</small></div>`;
    const k1 = S.step(`${n} ${nu} $= ${n} \\times ${unit} = ${n * unit}$ ${u2}.`);
    const k2 = S.step(`Add the extra ${extra} ${u2}.`);
    const k3 = S.step(`$${n * unit} + ${extra} = ${total}$ ${u2}.`);
    h += `<div class="gblk k2"${A(k2)}><b>${extra}</b><small>${u2}</small></div>`;
    return R(S, `<div class="gwrap">${h}</div>${eq(`${n * unit} ${u2}`, k1, "", { x: k3 })}${eq(`${n * unit} + ${extra} = <b>${total}</b> ${u2}`, k3, "k1")}`);
  };

  B.rect = ({ l, b, mode }) => {
    const S = Scene(), s = Math.min(250 / l, 140 / b), w = l * s, h = b * s, x0 = (320 - w) / 2 + 8, y0 = 22;
    let g = "";
    if (mode === "area") {
      const k0 = S.step(`The rectangle is ${l} cm long and ${b} cm wide.`);
      const k1 = S.step(`Cover it with 1 cm squares. One row holds ${l} squares.`);
      const k2 = S.step(`There are ${b} rows of ${l} squares.`);
      const k3 = S.step(`Area $= ${l} \\times ${b} = ${l * b}$ cm².`);
      g += Rc(x0, y0, w, s, k1, "f1", { x: k2 }) + Rc(x0, y0, w, h, k2, "f1");
      let gl = "", gl1 = "";
      for (let i = 1; i < l; i++) { gl += Ln(x0 + i * s, y0, x0 + i * s, y0 + h, null, "gd2"); gl1 += Ln(x0 + i * s, y0, x0 + i * s, y0 + s, null, "gd2"); }
      for (let j = 1; j < b; j++) gl += Ln(x0, y0 + j * s, x0 + w, y0 + j * s, null, "gd2");
      g += G(gl1, k1, { x: k2 }) + G(gl, k2) + Rc(x0, y0, w, h, k0, "ln thick");
      g += T(x0 + w / 2, y0 + h + 16, `${l} cm`, k0, "b") + T(x0 - 8, y0 + h / 2, `${b} cm`, k0, "b", { a: "end" });
      g += T(x0 + w / 2, y0 + h / 2, `${l * b} cm²`, k3, "k1 big");
    } else {
      const k0 = S.step(`The perimeter is the distance all the way round.`);
      const sides = [[x0, y0, x0 + w, y0, l, "top"], [x0 + w, y0, x0 + w, y0 + h, b, "right"], [x0 + w, y0 + h, x0, y0 + h, l, "bottom"], [x0, y0 + h, x0, y0, b, "left"]];
      g += Rc(x0, y0, w, h, k0, "ln thick");
      let run = 0;
      sides.forEach(([a1, b1, a2, b2, v, nmS], i) => {
        run += v;
        const k = S.step(i === 0 ? `Top: ${v} cm.` : `${cap(nmS)}: $${run - v} + ${v} = ${run}$ cm.`);
        g += Ln(a1, b1, a2, b2, k, `k${i % 2 ? 2 : 1} thick5`, { draw: true });
        const mx = (a1 + a2) / 2, my = (b1 + b2) / 2;
        g += T(mx + (i === 1 ? 10 : i === 3 ? -10 : 0), my + (i === 0 ? -9 : i === 2 ? 16 : 0), `${v}`, k, `k${i % 2 ? 2 : 1} b`, { a: i === 1 ? "start" : i === 3 ? "end" : null });
      });
      S.step(`$P = 2(${l} + ${b}) = ${2 * (l + b)}$ cm.`);
    }
    return R(S, svg(320, y0 + h + 30, g));
  };

  /* ================= Middle school ================= */
  B.hops = ({ a, b, c }) => {
    const S = Scene(), p1 = a + b, p2 = p1 - c;
    const lo = Math.min(a, p1, p2, 0) - 3, hi = Math.max(a, p1, p2, 0) + 3;
    const st = [1, 2, 5, 10, 20, 50, 100].find((s) => (hi - lo) / s <= 8) || 200, X = (v) => 16 + ((v - lo) / (hi - lo)) * 288, y = 80;
    const k0 = S.step(`Start at ${a} on the number line.`);
    const k1 = S.step(b < 0 ? `Adding ${b} means moving ${-b} to the left. You land on ${p1}.` : `Adding ${b} means moving ${b} to the right. You land on ${p1}.`);
    const k2 = S.step(c < 0 ? `Subtracting ${c} is the same as adding ${-c}: move ${-c} to the right. You land on ${p2}.` : `Subtracting ${c} means moving ${c} to the left. You land on ${p2}.`);
    S.step(`So the answer is ${p2}.`);
    let g = Ln(8, y, 312, y, null, "ax thick");
    if (hi - lo <= 40) for (let v = Math.ceil(lo); v <= hi; v++) if (v % st) g += Ln(X(v), y - 3, X(v), y + 3, null, "ln thin");
    for (let v = Math.ceil(lo / st) * st; v <= hi; v += st) g += Ln(X(v), y - 6, X(v), y + 6, null, "ln thin") + T(X(v), y + 17, nm(v), null, "tk");
    g += G(Ci(X(a), y, 5, null, "dot k1") + T(X(a), y - 10, nm(a), null, "k1 b"), k0);
    g += Hop(X(a), X(p1), y - 4, true, k1, "k2", b < 0 ? `−${-b}` : `+${b}`);
    g += Ci(X(p1), y, 4.5, k1, "dot k2");
    g += Hop(X(p1), X(p2), y + 4, false, k2, "k3", c < 0 ? `+${-c}` : `−${c}`);
    g += G(Ci(X(p2), y, 6, null, "dot k3") + T(X(p2), y + 52, nm(p2), null, "k3 big"), k2, { h: k2 + 1 });
    return R(S, svg(320, 150, g));
  };

  B.bodmas = ({ k, a, b, c, d, q }) => {
    const u = (s, v) => `\\underbrace{${s}}_{${hc(0, v)}}`;
    if (k === 0) return chainOf([
      [`${a} + ${u(`${b} \\times ${c}`, b * c)}`, `Multiplication comes before addition, so do $${b} \\times ${c}$ first.`],
      [`${u(`${a} + ${b * c}`, a + b * c)}`, `Then add.`],
      [`= ${hc(2, a + b * c)}`, `The answer is ${a + b * c}.`],
    ], [`${a} + ${b} \\times ${c}`, `Look for the operation to do first.`]);
    if (k === 1) return chainOf([
      [`${a} - ${u(`${b} \\div ${c}`, q)} \\times ${d}`, `Division and multiplication come before subtraction. Go left to right: divide first.`],
      [`${a} - ${u(`${q} \\times ${d}`, q * d)}`, `Then multiply.`],
      [`${u(`${a} - ${q * d}`, a - q * d)}`, `Subtract last.`],
      [`= ${hc(2, a - q * d)}`, `The answer is ${a - q * d}.`],
    ], [`${a} - ${b} \\div ${c} \\times ${d}`, `Look for the operation to do first.`]);
    return chainOf([
      [`${u(`(${a} + ${b})`, a + b)} \\times ${c} - ${d}`, `Brackets first.`],
      [`${u(`${a + b} \\times ${c}`, (a + b) * c)} - ${d}`, `Then multiply.`],
      [`${u(`${(a + b) * c} - ${d}`, (a + b) * c - d)}`, `Subtract last.`],
      [`= ${hc(2, (a + b) * c - d)}`, `The answer is ${(a + b) * c - d}.`],
    ], [`(${a} + ${b}) \\times ${c} - ${d}`, `Look for the operation to do first.`]);
  };

  const isPrime = (n) => {
    n = Math.abs(n);
    if (n < 2) return false;
    const f = E().factorize(n);
    return f.length === 1 && f[0][1] === 1;
  };
  const primeWord = (n) => (isPrime(n) ? `[[primes|${n}]]` : String(n));

  B.ladder = ({ a, b, mode }) => {
    const S = Scene(), side = [], rows = [[a, b]];
    let x = a, y = b;
    for (;;) {
      const g = E().gcd(x, y);
      if (g === 1) break;
      let p = 2; while (g % p) p++;
      side.push(p); x /= p; y /= p; rows.push([x, y]);
    }
    const H = side.reduce((s, v) => s * v, 1), L = H * x * y;
    const k0 = S.step(`Write ${a} and ${b} side by side. Divide both by a [[primes|prime]] that goes into both.`);
    const ks = side.map((p, r) => S.step(`${p} goes into both: $${rows[r][0]} \\div ${p} = ${rows[r + 1][0]}$ and $${rows[r][1]} \\div ${p} = ${rows[r + 1][1]}$.`));
    const bothPrime = isPrime(x) && isPrime(y);
    const kStop = S.step(`No [[primes|prime]] goes into both ${primeWord(x)} and ${primeWord(y)}, so stop.${bothPrime ? " Tap a leftover prime to learn about [[primes|prime numbers]]." : ""}`);
    const kR = mode === "hcf"
      ? S.step(`HCF = multiply the numbers down the side: $${side.join(" \\times ")} = ${H}$.`)
      : S.step(`LCM = the side numbers times the bottom numbers: $${[...side, x, y].join(" \\times ")} = ${L}$.`);
    const leftover = (n, k, cls, o) => {
      if (!isPrime(n)) return cel(n, k, cls, o);
      return `<div class="vc ${cls} lad-prime"${A(k, o)}><a class="term" href="#/topic/primes">${n}</a></div>`;
    };
    let h = "";
    rows.forEach(([u, v], r) => {
      const k = r === 0 ? k0 : ks[r - 1], cut = r < side.length ? ks[r] : null, last = r === rows.length - 1;
      h += r < side.length ? cel(side[r], ks[r], "lad-p k1", { h: kR }) : cel("", null, "lad-p");
      const oU = { add: cut != null ? [cut, "cut cutl"] : null, h: last ? (mode === "lcm" ? [kStop, kR] : kStop) : null };
      const oV = { add: cut != null ? [cut, "cut"] : null, h: last ? (mode === "lcm" ? [kStop, kR] : kStop) : null };
      h += last ? leftover(u, k, "big lad-n", oU) : cel(u, k, "big lad-n", oU);
      h += last ? leftover(v, k, "big lad-n", oV) : cel(v, k, "big lad-n", oV);
    });
    return R(S, grid("auto 64px 64px", h, "ladder") + eq(mode === "hcf" ? `HCF = ${side.join(" × ")} = <b>${H}</b>` : `LCM = ${[...side, x, y].join(" × ")} = <b>${L}</b>`, kR, "k1"));
  };

  B.ratiotab = ({ a, b, k }) => {
    const S = Scene();
    const k0 = S.step(`Put the two ratios in a table: ${a} goes with ${b}, and ${a * k} goes with $x$.`);
    const k1 = S.step(`${a} became ${a * k}: that is $\\times ${k}$.`);
    const k2 = S.step(`Do the same to the other side: $x = ${b} \\times ${k} = ${b * k}$.`);
    let g = T(100, 40, a, k0, "big") + T(220, 40, b, k0, "big") + T(160, 40, ":", k0, "big") + T(160, 150, ":", k0, "big");
    g += T(100, 150, a * k, k0, "big") + `<g${A(k0, { x: k2 })}>${T(220, 150, "x", null, "big i")}</g>` + T(220, 150, b * k, k2, "big k1");
    g += Ar(100, 56, 100, 128, k1, "k2") + T(80, 94, `×${k}`, k1, "k2 b", { a: "end" });
    g += Ar(220, 56, 220, 128, k2, "k2") + T(240, 94, `×${k}`, k2, "k2 b", { a: "start" });
    return R(S, svg(320, 180, g));
  };

  B.share = ({ a, b, k, N, big }) => {
    const S = Scene(), who = big === "a" ? "Asha" : "Ravi";
    const k0 = S.step(`Draw ${a} boxes for Asha and ${b} for Ravi.`);
    const k1 = S.step(`That is $${a} + ${b} = ${a + b}$ equal parts sharing ${IN(N)}.`);
    const k2 = S.step(`Each part is ${IN(N)} ÷ ${a + b} = ${IN(k)}.`);
    const k3 = S.step(`${who} has ${big === "a" ? a : b} parts: $${big === "a" ? a : b} \\times ${k} = ${(big === "a" ? a : b) * k}$.`);
    const row = (name, n, me) => `<div class="sh-row"${A(k0, me ? { h: k3 } : {})}><span class="sh-name">${name}</span><span class="sh-boxes">${Array.from({ length: n }, (_, i) => `<i${A(k0, { d: i })}><span${A(k2)}>${IN(k)}</span></i>`).join("")}</span><b class="sh-tot"${A(k3)}>${me ? "₹" + IN(n * k) : ""}</b></div>`;
    return R(S, `<div class="sh">${eq(`Total ₹${IN(N)} = ${a + b} parts`, k1, "k2")}${row("Asha", a, big === "a")}${row("Ravi", b, big !== "a")}</div>`);
  };

  B.sdt = ({ s, hrs: t }) => {
    const S = Scene(), n = Math.ceil(t), seg = 280 / t;
    const k0 = S.step(`At ${s} km/h the car covers ${s} km every hour.`);
    const k1 = S.step(`In ${t} hours that happens ${t} times${t % 1 ? " (the last one is half an hour, so half of " + s + " km)" : ""}.`);
    const k2 = S.step(`Distance $= ${s} \\times ${t} = ${s * t}$ km.`);
    let g = "";
    for (let i = 0; i < n; i++) {
      const w = Math.min(1, t - i) * seg, x = 20 + i * seg, k = i === 0 ? k0 : k1;
      g += Rc(x, 40, w, 30, k, i % 2 ? "f2 ln" : "f1 ln", { d: i }) + T(x + w / 2, 55, `${Math.min(1, t - i) * s} km`, k, "sm b", { d: i });
      g += T(x + w / 2, 86, t - i < 1 ? "½ h" : `hour ${i + 1}`, k, "tk", { d: i });
    }
    g += Ln(20, 110, 300, 110, k2, "k3 thick", { draw: true }) + T(160, 128, `${s * t} km`, k2, "k3 big");
    return R(S, svg(320, 145, g));
  };

  B.percent = ({ p, y }) => {
    const S = Scene(), v = (p * y) / 100;
    const k0 = S.step(`The whole bar is ${IN(y)}, which is 100%.`);
    const k1 = S.step(`Each 10% is a tenth of the bar: $${y} \\div 10 = ${y / 10}$.`);
    const k2 = S.step(`Shade ${p}% of the bar.`);
    const k3 = S.step(`${p}% of ${IN(y)} $= \\frac{${p}}{100} \\times ${y} = ${+v.toFixed(4)}$.`);
    const ticks = Array.from({ length: 11 }, (_, i) => `<i${A(k1, { d: i, st: `left:${i * 10}%` })}>${i % 2 ? "" : `<small>${i * 10}%</small>`}</i>`).join("");
    return R(S, `<div class="pbar"${A(k0)}><div class="pfill${p < 14 ? " out" : ""}"${A(k2, { st: `width:${p}%` })}><span${A(k3)}>${nm(v)}</span></div>${ticks}</div>${eq(`${p}% of ${IN(y)} = <b>${nm(v)}</b>`, k3, "k1")}`);
  };

  B.profit = ({ CP, SP, p, gain, find }) => {
    const S = Scene(), diff = Math.abs(SP - CP), mx = Math.max(CP, SP), w = (v) => `width:${(v / mx) * 100}%`;
    const word = gain ? "profit" : "loss", sm = diff / mx < 0.22;
    const k0 = S.step(`Cost price (what it was bought for): ₹${IN(CP)}.`);
    let k1, k2;
    if (find === "pct") {
      k1 = S.step(`Selling price: ₹${IN(SP)}.`);
      k2 = S.step(`The difference is the ${word}: ₹${IN(diff)}.`);
      S.step(`${cap(word)} % compares it with the cost price: $\\frac{${diff}}{${CP}} \\times 100 = ${p}\\%$.`);
    } else {
      k2 = S.step(`${p}% of ₹${IN(CP)} is ₹${IN(diff)}: that is the ${word}.`);
      k1 = S.step(gain ? `Add it on: $${CP} + ${diff} = ${SP}$.` : `Take it off: $${CP} - ${diff} = ${SP}$.`);
    }
    const h = `<div class="pl">
      <div class="pl-row"${A(k0)}><span class="pl-l">CP</span><span class="pl-bar"><i class="c5"${A(k0, { st: w(CP) })}>₹${IN(CP)}</i></span></div>
      <div class="pl-row"${A(find === "pct" ? k1 : k2)}><span class="pl-l">${find === "pct" ? "SP" : cap(word)}</span><span class="pl-bar">${gain
        ? `<i class="c5 dimc"${A(find === "pct" ? k1 : k2, { st: w(CP) })}></i><i class="c3"${A(k2, { st: w(diff) })}>${sm ? "" : `+₹${IN(diff)}`}</i>`
        : `<i class="c5"${A(find === "pct" ? k1 : k2, { st: w(SP) })}>${find === "pct" ? "₹" + IN(SP) : ""}</i><i class="c4 gapc"${A(k2, { st: w(diff) })}>${sm ? "" : `−₹${IN(diff)}`}</i>`}</span>${sm ? `<b class="pl-d ${gain ? "g" : "r"}"${A(k2)}>${gain ? "+" : "−"}₹${IN(diff)}</b>` : ""}</div>
      ${find === "pct" ? "" : `<div class="pl-row"${A(k1)}><span class="pl-l">SP</span><span class="pl-bar"><i class="c1"${A(k1, { st: w(SP) })}>₹${IN(SP)}</i></span></div>`}
    </div>`;
    return R(S, h);
  };

  B.si = ({ P: Pr, R: Rt, T: Tm }) => {
    const S = Scene(), I = (Pr * Rt) / 100;
    const k0 = S.step(`Start with the principal ₹${IN(Pr)}.`);
    const ks = [];
    for (let i = 1; i <= Tm; i++) ks.push(S.step(i === 1 ? `Each year adds the same interest: ${Rt}% of ₹${IN(Pr)} = ₹${IN(I)}.` : `Year ${i}: another ₹${IN(I)}.`));
    S.step(`${Tm} years: $${Tm} \\times ${I} = ${I * Tm}$, so the interest is ₹${IN(I * Tm)}.`);
    const unit = 100 / (Pr + I * Tm);
    const h = `<div class="pl"><div class="pl-row"><span class="pl-bar tall"><i class="c5"${A(k0, { st: `width:${Pr * unit}%` })}>₹${IN(Pr)}</i>${ks.map((k, i) => `<i class="c3"${A(k, { st: `width:${I * unit}%` })}>${Tm > 3 ? "" : "+" + IN(I)}</i>`).join("")}</span></div>
      <div class="sh-boxes yrs">${ks.map((k, i) => `<span${A(k)}>Year ${i + 1}: +₹${IN(I)}</span>`).join("")}</div></div>`;
    return R(S, h);
  };

  B.ci = ({ P: Pr, R: Rt }) => {
    const S = Scene(), I1 = (Pr * Rt) / 100, A1 = Pr + I1, I2 = (A1 * Rt) / 100, extra = I2 - I1, A2 = A1 + I2;
    const k0 = S.step(`Start with ₹${IN(Pr)}.`);
    const k1 = S.step(`Year 1: ${Rt}% of ₹${IN(Pr)} = ₹${IN(I1)}. The amount grows to ₹${IN(A1)}.`);
    const k2 = S.step(`Year 2: ${Rt}% of ₹${IN(A1)} = ₹${IN(I2)}. That is ₹${IN(I1)} again plus ₹${IN(extra)} of interest on last year's interest.`);
    S.step(`CI $= ${A2} - ${Pr} = ${A2 - Pr}$, so the compound interest is ₹${IN(A2 - Pr)}.`);
    const u = 100 / A2, wd = (v) => `width:${v * u}%`;
    const h = `<div class="pl">
      <div class="pl-row"${A(k0)}><span class="pl-l">Start</span><span class="pl-bar"><i class="c5"${A(k0, { st: wd(Pr) })}>₹${IN(Pr)}</i></span></div>
      <div class="pl-row"${A(k1)}><span class="pl-l">Year 1</span><span class="pl-bar"><i class="c5 dimc"${A(k1, { st: wd(Pr) })}></i><i class="c3"${A(k1, { st: wd(I1) })}></i></span><b class="pl-d g"${A(k1)}>+₹${IN(I1)}</b></div>
      <div class="pl-row"${A(k2)}><span class="pl-l">Year 2</span><span class="pl-bar"><i class="c5 dimc"${A(k2, { st: wd(Pr) })}></i><i class="c3 dimc"${A(k2, { st: wd(I1) })}></i><i class="c3"${A(k2, { st: wd(I1) })}></i><i class="c2"${A(k2, { st: wd(extra) })}></i></span><b class="pl-d g"${A(k2)}>+₹${IN(I2)}</b></div>
    </div>${eq(`<span class="sw c2"></span> interest on interest: ₹${IN(extra)}`, k2, "sm")}`;
    return R(S, h);
  };

  B.expo = ({ b, m, n }) => {
    const S = Scene(), e = m + n;
    const tiles = (c, k, cls, o) => Array.from({ length: Math.abs(c) }, (_, i) => chip(c > 0 ? `×${b}` : `÷${b}`, k, (c > 0 ? "k1" : "k4") + (cls ? " " + cls : ""), { ...(o ? o(i) : {}), d: i })).join("");
    const k0 = S.step(m > 0 ? `$${b}^{${m}}$ means multiply by ${b}, ${m} time${m > 1 ? "s" : ""}.` : `$${b}^{${m}}$ means divide by ${b}, ${-m} time${m < -1 ? "s" : ""}.`);
    const k1 = S.step(n > 0 ? `$${b}^{${n}}$ adds ${n} more "×${b}".` : `$${b}^{${n}}$ adds ${-n} "÷${b}".`);
    const opp = Math.sign(m) !== Math.sign(n), cancel = opp ? Math.min(Math.abs(m), Math.abs(n)) : 0;
    const k2 = S.step(opp ? `Each "×${b}" cancels a "÷${b}": ${cancel} pair${cancel > 1 ? "s" : ""} cancel. That is adding the powers: $${m} + ${par(n)} = ${e}$.` : `Altogether that is $${m} + ${par(n)} = ${e}$ of them: add the powers.`);
    const val = e >= 0 ? `${b ** e}` : `\\frac{1}{${b ** -e}}`;
    S.step(`$${b}^{${m}} \\times ${b}^{${n}} = ${b}^{${e}} = ${val}$`);
    const strikeM = (i) => (opp && i < cancel ? { add: [k2, "strike"] } : {});
    return R(S, `<div class="tiles"><div class="trow"><b${A(k0)}>${tx(`${b}^{${m}}`)}</b>${tiles(m, k0, "", strikeM)}</div><div class="trow"><b${A(k1)}>${tx(`${b}^{${n}}`)}</b>${tiles(n, k1, "", strikeM)}</div></div>${eq(tx(`${b}^{${e}} = ${val}`), k2 + 1, "k1")}`);
  };

  B.identity = ({ base, k }) => {
    const S = Scene(), a = 10, bb = Math.max(2.4, Math.min(4, (k / base) * 10 * 2.5)), s = 11, ox = 60, oy = 190;
    const X = (u) => ox + u * s, Y = (v) => oy - v * s;
    const k0 = S.step(`$${base + k} \\times ${base - k}$ is the area of a ${base + k} by ${base - k} rectangle.`);
    const k1 = S.step(`Cut off the ${k}-wide strip on the right and move it to the top.`);
    const k2 = S.step(`Now it is a ${base} by ${base} square with a ${k} by ${k} corner missing: $${base}^2 - ${k}^2$.`);
    S.step(`$${base}^2 - ${k}^2 = ${base * base} - ${k * k} = ${base * base - k * k}$`);
    let g = Rc(X(0), Y(a - bb), a * s, (a - bb) * s, k0, "f1 ln");
    g += Rc(X(a), Y(a - bb), bb * s, (a - bb) * s, k0, "f2 ln", { x: k1 });
    g += Rc(X(0), Y(a), (a - bb) * s, bb * s, k1, "f2 ln");
    g += Rc(X(a - bb), Y(a), bb * s, bb * s, k2, "miss");
    g += T(X(a / 2), Y(0) + 14, `${base}`, k0, "b") + T(X(a + bb / 2), Y(0) + 14, `${k}`, k0, "k2 b", { x: k1 });
    g += T(X(0) - 6, Y((a - bb) / 2), `${base - k}`, k0, "b", { a: "end" }) + T(X(0) - 6, Y(a - bb / 2), `${k}`, k1, "k2 b", { a: "end" });
    g += T(X(a - bb / 2), Y(a - bb / 2), `${k}²`, k2, "k4 b");
    return R(S, svg(320, 214, g));
  };

  B.liketerms = ({ a1, b1, a2, b2 }) => {
    const S = Scene(), t = (c, v) => Hp().terms([[c, v]]);
    const k0 = S.step(`Colour the like terms: $x$ terms in purple, $y$ terms in orange.`);
    const k1 = S.step(`Collect the $x$ terms: $${a1} - ${a2} = ${a1 - a2}$.`);
    const k2 = S.step(`Collect the $y$ terms: $${b1} + ${par(b2)} = ${b1 + b2}$.`);
    const k3 = S.step(`Put them together.`);
    const items = [[t(a1, "x"), 0], [t(b1, "y"), 1], [t(-a2, "x"), 0], [t(b2, "y"), 1]];
    const row1 = items.map(([s, c], i) => chip(tx(s), k0, c ? "k2" : "k1", { d: i })).join("");
    return R(S, `<div class="lt">${row1}</div>
      <div class="lt"${A(k1)}>${chip(tx(t(a1, "x")), k1, "k1")}${chip(tx(t(-a2, "x")), k1, "k1")}<span class="arw">→</span>${chip(tx(t(a1 - a2, "x")), k1, "k1 big")}</div>
      <div class="lt"${A(k2)}>${chip(tx(t(b1, "y")), k2, "k2")}${chip(tx(t(b2, "y")), k2, "k2")}<span class="arw">→</span>${chip(tx(t(b1 + b2, "y")), k2, "k2 big")}</div>
      ${eq(tx(Hp().terms([[a1 - a2, "x"], [b1 + b2, "y"]])), k3, "k1")}`);
  };

  B.balance = ({ a, b, c, x }) => {
    const S = Scene(), t = (list) => Hp().terms(list).replace(/-/g, "−");
    const k0 = S.step(`An equation is a balance: both sides weigh the same.`);
    const k1 = S.step(`${b > 0 ? "Take away" : "Add"} ${Math.abs(b)} on both sides to leave the $x$ term alone.`);
    const k2 = a !== 1 ? S.step(`Divide both sides by ${a}.`) : null;
    const kE = S.step(`So $x = ${x}$. It balances: $${a} \\times ${par(x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${c}$.`);
    const pan = (cx, labels) => {
      let s = Ln(cx - 46, 70, cx, 30, null, "ln thin") + Ln(cx + 46, 70, cx, 30, null, "ln thin") + P(`M${cx - 52} 70 Q${cx} 92 ${cx + 52} 70 Z`, null, "f5 ln");
      labels.forEach(([txt, k, xk, cls]) => { s += T(cx, 58, txt, k, `big ${cls || ""}`, { x: xk }); });
      return s;
    };
    let g = Poly([[160, 40], [146, 150], [174, 150]], null, "f0 ln") + Ln(60, 30, 260, 30, null, "ln thick5") + Ci(160, 30, 5, null, "dot k0");
    g += pan(70, [[t([[a, "x"], [b, ""]]), k0, k1], [t([[a, "x"]]), k1, k2 != null ? k2 : kE, "k1"], ...(k2 != null ? [[a === -1 ? "−x" : "x", k2, null, "k3"]] : [["x", kE, null, "k3"]])]);
    g += pan(250, [[nm(c), k0, k1], [nm(c - b), k1, k2 != null ? k2 : kE, "k1"], [nm(x), k2 != null ? k2 : kE, null, "k3"]]);
    g += T(70, 112, `${b > 0 ? "−" : "+"}${Math.abs(b)}`, k1, "k4 b", { x: k2 != null ? k2 : kE }) + T(250, 112, `${b > 0 ? "−" : "+"}${Math.abs(b)}`, k1, "k4 b", { x: k2 != null ? k2 : kE });
    if (k2 != null) g += T(70, 112, `÷${nm(a)}`, k2, "k4 b", { x: kE }) + T(250, 112, `÷${nm(a)}`, k2, "k4 b", { x: kE });
    return R(S, svg(320, 160, g));
  };

  B.angles = ({ A: a, B: b }) => {
    const S = Scene(), c = 180 - a - b, rad = Math.PI / 180;
    const L = Math.sin(b * rad) / Math.sin(c * rad), P2 = [Math.cos(a * rad) * L, Math.sin(a * rad) * L];
    const F = fit([[0, 0], [1, 0], P2], 300, 140, 14), [p0, p1, p2] = [[0, 0], [1, 0], P2].map(F.f);
    const k0 = S.step(`Two angles are ${a}° and ${b}°. The third is unknown.`);
    const k1 = S.step(`Tear off the angles and put them side by side: the three angles of a triangle always make a straight line, 180°.`);
    const k2 = S.step(`${a}° + ${b}° = ${a + b}°.`);
    const k3 = S.step(`The third angle fills the rest: $180^\\circ - ${a + b}^\\circ = ${c}^\\circ$.`);
    const arc = (p, t0, t1, cls, k, o) => P(sector(p[0], p[1], 20, t0, t1), k, cls, o);
    const ang = (u, v) => Math.atan2(-(v[1] - u[1]), v[0] - u[0]);
    let g = Poly([p0, p1, p2], k0, "ln thick f0");
    g += arc(p0, 0, ang(p0, p2), "f1 ln thin", k0) + arc(p1, ang(p1, p2), Math.PI, "f2 ln thin", k0);
    g += arc(p2, ang(p2, p0), ang(p2, p1) + (ang(p2, p1) < ang(p2, p0) ? 2 * Math.PI : 0), "f3 ln thin", k0);
    g += T(p0[0] + 30, p0[1] - 8, `${a}°`, k0, "k1 b", { a: "start" }) + T(p1[0] - 30, p1[1] - 8, `${b}°`, k0, "k2 b", { a: "end" });
    g += `<g${A(k0, { x: k3 })}>${T(p2[0], p2[1] - 12, "?", null, "k3 big")}</g>` + T(p2[0], p2[1] - 12, `${c}°`, k3, "k3 big");
    const cx = 160, cy = 232, rr = 58;
    g += Ln(cx - 80, cy, cx + 80, cy, k1, "ax thick");
    g += P(sector(cx, cy, rr, Math.PI - a * rad, Math.PI), k1, "f1 ln thin") + P(sector(cx, cy, rr, Math.PI - (a + b) * rad, Math.PI - a * rad), k1, "f2 ln thin");
    g += P(sector(cx, cy, rr, 0, Math.PI - (a + b) * rad), k3, "f3 ln thin");
    const lab = (t, s, k, cls) => T(cx + rr * 0.62 * Math.cos(t), cy - rr * 0.62 * Math.sin(t), s, k, cls);
    g += lab(Math.PI - (a * rad) / 2, `${a}°`, k1, "k1 sm b") + lab(Math.PI - (a + b / 2) * rad, `${b}°`, k1, "k2 sm b") + lab(((180 - a - b) * rad) / 2, `${c}°`, k3, "k3 sm b");
    g += T(cx, cy + 14, "180°", k2, "tk b");
    return R(S, svg(320, 250, g));
  };

  B.circle = ({ r, diam, mode }) => {
    const S = Scene(), cx = 160, cy = 100, R0 = 76;
    let g = Ci(cx, cy, R0, null, "ln thick") + Ci(cx, cy, 3, null, "dot k0");
    if (diam) {
      const kd = S.step(`The diameter is ${2 * r} cm.`);
      g += Ln(cx - R0, cy, cx + R0, cy, kd, "k2 thick", { draw: true, x: kd + 1 }) + T(cx, cy + 14, `${2 * r} cm`, kd, "k2 b", { x: kd + 1 });
    }
    const kr = S.step(diam ? `The radius is half of it: ${r} cm.` : `The radius is ${r} cm.`);
    g += Ln(cx, cy, cx + R0, cy, kr, "k1 thick", { draw: true }) + T(cx + R0 / 2, cy - 10, `r = ${r}`, kr, "k1 b");
    if (mode === "area") {
      const k1 = S.step(`Area $= \\pi r^2 = \\frac{22}{7} \\times ${r} \\times ${r}$: the whole inside is shaded.`);
      const k2 = S.step(`$= ${(22 * r * r) / 7}$ cm².`);
      g = Ci(cx, cy, R0, k1, "f1") + g + T(cx, cy + 30, `${(22 * r * r) / 7} cm²`, k2, "k1 big");
    } else {
      const k1 = S.step(`Circumference $= 2\\pi r$: the distance once round the edge.`);
      const k2 = S.step(`$2 \\times \\frac{22}{7} \\times ${r} = ${(44 * r) / 7}$ cm.`);
      g += P(arcPath(cx, cy, R0, 0, -Math.PI * 1.999), k1, "k3 thick5", { draw: true }) + T(cx, cy + R0 + 18, `${(44 * r) / 7} cm`, k2, "k3 big");
    }
    return R(S, svg(320, 206, g));
  };

  B.triarea = ({ kind, b, h, a, c }) => {
    const S = Scene();
    let g = "";
    if (kind === "tri") {
      const F = fit([[0, 0], [b, 0], [b * 0.35, h]], 260, 150, 10), [p0, p1, p2] = [[0, 0], [b, 0], [b * 0.35, h]].map(F.f), ox = 30, oy = 10;
      const sh = ([x, y]) => [x + ox, y + oy], [q0, q1, q2] = [p0, p1, p2].map(sh);
      const k0 = S.step(`The base is ${b} cm and the height is ${h} cm.`);
      const k1 = S.step(`Draw the rectangle around it: ${b} by ${h}. The triangle is exactly half of it.`);
      const k2 = S.step(`Area $= \\frac12 \\times ${b} \\times ${h} = ${(b * h) / 2}$ cm².`);
      g += Rc(q0[0], q2[1], q1[0] - q0[0], q0[1] - q2[1], k1, "dash f2");
      g += Poly([q0, q1, q2], k0, "f1 ln thick") + Ln(q2[0], q2[1], q2[0], q0[1], k0, "k2 dash") + T(q2[0] + 6, (q2[1] + q0[1]) / 2, `h = ${h}`, k0, "k2 b", { a: "start" });
      g += T((q0[0] + q1[0]) / 2, q0[1] + 15, `${b} cm`, k0, "b") + T((q0[0] + q1[0]) / 2, (q0[1] + q2[1]) / 2 + 26, `${(b * h) / 2} cm²`, k2, "k1 big");
    } else if (kind === "para") {
      const sl = Math.min(b * 0.3, h * 0.6), pts = [[0, 0], [b, 0], [b + sl, h], [sl, h]];
      const F = fit([...pts, [b + sl, 0]], 280, 140, 10), q = pts.map(F.f), base = F.f([b + sl, 0]), qs = F.f([sl, 0]);
      const k0 = S.step(`A parallelogram with base ${b} cm and height ${h} cm.`);
      const k1 = S.step(`Cut the triangle off the left end and slide it to the right end.`);
      const k2 = S.step(`It becomes a ${b} by ${h} rectangle: area $= ${b} \\times ${h} = ${b * h}$ cm².`);
      g += Poly(q, k0, "f1 ln thick", { x: k1 }) + Poly([qs, q[2], q[3]].map((p) => p), null, "") ;
      g += Poly([qs, q[1], q[2], q[3]], k1, "f1 ln thick") + Poly([q[0], qs, q[3]], k0, "f2 ln", { x: k1 }) + Poly([q[1], base, q[2]], k1, "f2 ln");
      g += T((q[0][0] + q[1][0]) / 2, q[0][1] + 15, `${b} cm`, k0, "b") + Ln(q[3][0], q[3][1], qs[0], qs[1], k0, "k2 dash") + T(q[3][0] + 6, (q[3][1] + qs[1]) / 2, `${h}`, k0, "k2 b", { a: "start" });
      g += T((qs[0] + q[1][0]) / 2, (q[0][1] + q[3][1]) / 2, `${b * h} cm²`, k2, "k1 big");
    } else {
      const off = (c - a) / 2, pts = [[0, 0], [c, 0], [off + a, h], [off, h]];
      const F = fit([[0, 0], [c + a, 0], [c + a, h], [0, h]], 290, 130, 8), q = pts.map(F.f);
      const q2 = [[c, 0], [c + a, 0], [c + a - off, h], [off + a, h]].map(F.f);
      const k0 = S.step(`A trapezium with parallel sides ${a} cm and ${c} cm, height ${h} cm.`);
      const k1 = S.step(`Turn a copy upside down and fit it on the side: together they make a parallelogram with base $${a} + ${c} = ${a + c}$.`);
      const k2 = S.step(`The trapezium is half of it: $\\frac12 \\times ${a + c} \\times ${h} = ${((a + c) * h) / 2}$ cm².`);
      g += Poly(q, k0, "f1 ln thick") + Poly(q2, k1, "f2 ln dash");
      g += T((q[3][0] + q[2][0]) / 2, q[3][1] - 8, `${a}`, k0, "b") + T((q[0][0] + q[1][0]) / 2, q[0][1] + 15, `${c}`, k0, "b");
      g += T((q2[3][0] + q2[2][0]) / 2, q2[3][1] - 8, `${c}`, k1, "k2 b") + T((q2[0][0] + q2[1][0]) / 2, q2[0][1] + 15, `${a}`, k1, "k2 b");
      g += T((q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, `${((a + c) * h) / 2} cm²`, k2, "k1 big");
    }
    return R(S, svg(320, 176, g));
  };

  B.sqrt = ({ n }) => {
    const S = Scene(), N = n * n, t = Math.floor(n / 10) * 10, last = N % 10;
    const ends = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => (d * d) % 10 === last), cands = ends.map((d) => t + d);
    const X = (v) => 26 + ((v - t) / 10) * 268, y = 70;
    const k0 = S.step(`$${t}^2 = ${t * t}$ and $${t + 10}^2 = ${(t + 10) ** 2}$, so $\\sqrt{${N}}$ is between ${t} and ${t + 10}.`);
    const k1 = S.step(`${N} ends in ${last}. Only numbers ending in ${ends.join(" or ")} have squares ending in ${last}: ${cands.join(" or ")}.`);
    const k2 = S.step(`Try ${n}: $${n} \\times ${n} = ${N}$ ✓ So $\\sqrt{${N}} = ${n}$.`);
    let g = Ln(14, y, 306, y, k0, "ax thick");
    for (let v = t; v <= t + 10; v++) g += Ln(X(v), y - 5, X(v), y + 5, k0, "ln thin") + (v === t || v === t + 10 ? T(X(v), y + 18, v, k0, "b") + T(X(v), y + 34, `${v * v}`, k0, "tk") : "");
    cands.forEach((c, i) => { g += G(Ci(X(c), y, 6, null, "dot k2") + T(X(c), y - 16, c, null, "k2 b"), k1, { d: i, h: c === n ? k2 : null, add: c !== n ? [k2, "dim"] : null }); });
    g += T(160, 128, `${n} × ${n} = ${N}`, k2, "k3 big");
    return R(S, svg(320, 146, g));
  };

  B.cuberoot = ({ n }) => {
    const S = Scene(), N = n ** 3, d = n % 10;
    const k0 = S.step(`The last digit of a cube depends only on the last digit of the number.`);
    const k1 = S.step(`${IN(N)} ends in ${N % 10}, and only ${d}³ ends in ${N % 10}. So the root ends in ${d}.`);
    const k2 = n > 9 ? S.step(`$10^3 = 1000$ and $20^3 = 8000$, so the root is between 10 and 20.`) : null;
    S.step(`Try ${n}: $${n} \\times ${n} \\times ${n} = ${N}$ ✓`);
    let h = cel("n", k0, "vh") + Array.from({ length: 10 }, (_, i) => cel(i, k0, "big", { d: i, h: i === d ? k1 : null })).join("");
    h += cel("n³ ends", k0, "vh") + Array.from({ length: 10 }, (_, i) => cel((i ** 3) % 10, k0, "big k2", { d: i, h: i === d ? k1 : null, add: i !== d ? [k1, "dim"] : null })).join("");
    return R(S, grid("auto repeat(10, 1fr)", h, "cube") + (k2 != null ? eq("1000 < " + IN(N) + " < 8000", k2) : "") + eq(`${n} × ${n} × ${n} = <b>${IN(N)}</b>`, S.caps.length - 1, "k1"));
  };

  B.mean = ({ vals }) => {
    const S = Scene(), sum = vals.reduce((a, b) => a + b, 0), m = sum / vals.length, mx = Math.max(...vals);
    const sc = 120 / mx, base = 150, bw = 36, gap = (320 - 40 - vals.length * bw) / (vals.length - 1);
    const k0 = S.step(`Draw each value as a bar.`);
    const k1 = S.step(`Add them up: $${vals.join(" + ")} = ${sum}$.`);
    const k2 = S.step(`Share the total equally between the ${vals.length} bars: they all level out at ${m}.`);
    S.step(`Mean $= ${sum} \\div ${vals.length} = ${m}$.`);
    let g = Ln(14, base, 306, base, null, "ax");
    vals.forEach((v, i) => {
      const x = 20 + i * (bw + gap);
      g += Rc(x, base - v * sc, bw, v * sc, k0, "f1 ln", { x: k2, d: i }) + T(x + bw / 2, base - v * sc - 8, v, k0, "b", { x: k2, d: i });
      g += Rc(x, base - m * sc, bw, m * sc, k2, "f3 ln", { d: i });
    });
    g += Ln(14, base - m * sc, 306, base - m * sc, k2, "k4 dash thick") + T(306, base - m * sc - 8, `mean ${m}`, k2, "k4 b", { a: "end" });
    g += T(160, base + 18, `total ${sum}`, k1, "k2 b");
    return R(S, svg(320, 176, g));
  };

  B.median = ({ vals, mode }) => {
    const S = Scene();
    if (mode === "median") {
      const s = vals.slice().sort((a, b) => a - b), mid = (s.length - 1) / 2;
      const k0 = S.step(`Here are the ${vals.length} values as they were given.`);
      const k1 = S.step(`Put them in order from smallest to largest.`);
      const k2 = S.step(`The middle one (number ${mid + 1} of ${s.length}) is ${s[mid]}: that is the median.`);
      return R(S, `<div class="lt">${vals.map((v, i) => chip(v, k0, "", { d: i, add: [k1, "dim"] })).join("")}</div>
        <div class="lt">${s.map((v, i) => chip(v, k1, i === mid ? "k1" : "", { d: i, h: i === mid ? k2 : null, add: i !== mid ? [k2, "dim"] : null })).join("")}</div>`);
    }
    const counts = {};
    vals.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
    const keys = Object.keys(counts).map(Number).sort((a, b) => a - b), best = keys.reduce((a, b) => (counts[b] > counts[a] ? b : a));
    const k0 = S.step(`Here are the values.`);
    const k1 = S.step(`Stack equal values on top of each other.`);
    const k2 = S.step(`${best} has the tallest stack (${counts[best]} times), so it is the mode.`);
    return R(S, `<div class="lt">${vals.map((v, i) => chip(v, k0, "", { d: i, add: [k1, "dim"] })).join("")}</div>
      <div class="stacks"${A(k1)}>${keys.map((v, i) => `<div class="stk"${A(k1, { d: i, h: v === best ? k2 : null, add: v !== best ? [k2, "dim"] : null })}>${Array.from({ length: counts[v] }, () => `<i>${v}</i>`).join("")}</div>`).join("")}</div>`);
  };

  B.cards = ({ intro, items, ans }) => {
    const S = Scene(), k0 = S.step(intro), ks = [];
    items.forEach((_, i) => { if (i !== ans) ks[i] = S.step(items[i][1]); });
    ks[ans] = S.step(items[ans][1]);
    const { rich } = U();
    return R(S, `<div class="vcards">${items.map(([t, , lab], i) => `<div class="vcard${i === ans ? " ans" : ""}"${A(k0, { d: i, h: i === ans ? ks[ans] : null, add: [ks[i], i === ans ? "hit" : "ok"] })}><b>${rich(t)}</b><small${A(ks[i])}>${esc(lab || "")}</small></div>`).join("")}</div>`);
  };

  B.polyeval = ({ a, b, c, d, k }) => {
    const S = Scene(), t = Hp().terms, cs = [[a, "x^3", 3], [b, "x^2", 2], [c, "x", 1], [d, "", 0]];
    const k0 = S.step(`The remainder is $p(${k})$. Put $x = ${k}$ into each term.`);
    let h = "";
    const ks = cs.map(([co, v, e]) => S.step(e ? `$${co} \\times ${par(k)}${e > 1 ? `^${e}` : ""} = ${co * k ** e}$` : `The constant stays $${co}$.`));
    const vals = cs.map(([co, , e]) => co * k ** e), sum = vals.reduce((x, y) => x + y, 0);
    const kS = S.step(`Add them: $${vals.map(par).join(" + ")} = ${sum}$. The remainder is ${sum}.`);
    cs.forEach(([co, v], i) => { h += cel(tx(t([[co, v]])), k0, "", { h: ks[i] }); });
    cs.forEach(([co, , e], i) => { h += cel(tx(e ? `${co} \\times ${par(k)}${e > 1 ? `^${e}` : ""}` : `${co}`), ks[i], "sm"); });
    cs.forEach((_, i) => { h += cel(nm(vals[i]), ks[i], "big k1", { h: kS }); });
    return R(S, grid("repeat(4, 1fr)", h, "peval") + eq(`p(${nm(k)}) = <b>${nm(sum)}</b>`, kS, "k1"));
  };

  B.diamond = ({ p, q }) => {
    const S = Scene(), c = p * q, bs = -(p + q), fx = Hp().fx;
    const k0 = S.step(`Find two numbers that multiply to ${c} (top) and add to ${bs} (bottom).`);
    const k1 = S.step(`Try pairs that multiply to ${c}. ${-p} works…`);
    const k2 = S.step(`…with ${-q}: $${par(-p)} \\times ${par(-q)} = ${c}$ and $${-p} + ${par(-q)} = ${bs}$.`);
    S.step(`So the factors are $${fx(p)}${fx(q)}$.`);
    let g = Ln(90, 20, 230, 160, null, "ln thick") + Ln(230, 20, 90, 160, null, "ln thick");
    g += T(160, 30, c, k0, "big k2") + T(160, 150, bs, k0, "big k3") + T(160, 12, "multiply", k0, "tk") + T(160, 170, "add", k0, "tk");
    g += T(98, 90, nm(-p), k1, "big k1") + T(222, 90, nm(-q), k2, "big k1");
    return R(S, svg(320, 180, g) + eq(tx(`${fx(p)}${fx(q)}`), 3, "k1"));
  };

  B.zeros = ({ a, b, c, sum }) => {
    const t = Hp().terms, f = Hp().frac;
    const poly = `${hc(0, a)}x^2 ${b < 0 ? "-" : "+"} ${hc(1, Math.abs(b))}x ${c < 0 ? "-" : "+"} ${hc(2, Math.abs(c))}`;
    return chainOf([
      [`a = ${hc(0, a)},\\ b = ${hc(1, b)},\\ c = ${hc(2, c)}`, `Read off the coefficients $a$, $b$ and $c$.`],
      sum ? [`\\alpha + \\beta = -\\frac{${hc(1, "b")}}{${hc(0, "a")}}`, `The sum of the zeros is $-\\frac{b}{a}$.`] : [`\\alpha\\beta = \\frac{${hc(2, "c")}}{${hc(0, "a")}}`, `The product of the zeros is $\\frac{c}{a}$.`],
      sum ? [`= -\\frac{${hc(1, b)}}{${hc(0, a)}} = ${f(-b, a)}`, `Substitute: the answer is $${f(-b, a)}$.`] : [`= \\frac{${hc(2, c)}}{${hc(0, a)}} = ${f(c, a)}`, `Substitute: the answer is $${f(c, a)}$.`],
    ], [poly, `The quadratic is $${t([[a, "x^2"], [b, "x"], [c, ""]])}$.`]);
  };

  const lineTxt = (a, b, c) => Hp().terms([[a, "x"], [b, "y"]]).replace(/-/g, "−") + " = " + nm(c);
  B.system = ({ a1, b1, c1, a2, b2, c2, x, y }) => {
    const S = Scene(), pl = plane({ x0: x - 7, x1: x + 7, y0: y - 6, y1: y + 6, lx: "x", ly: "y" });
    const k0 = S.step(`Draw the first line: $${Hp().terms([[a1, "x"], [b1, "y"]])} = ${c1}$.`);
    const k1 = S.step(`Draw the second line: $${Hp().terms([[a2, "x"], [b2, "y"]])} = ${c2}$.`);
    const k2 = S.step(`The answer is where they cross: $(${x}, ${y})$. That point fits both equations.`);
    let g = pl.fn((t) => (c1 - a1 * t) / b1, k0, "k1 thick") + pl.fn((t) => (c2 - a2 * t) / b2, k1, "k2 thick");
    g += T(pl.W - 14, 20, lineTxt(a1, b1, c1), k0, "k1 b", { a: "end" }) + T(pl.W - 14, 36, lineTxt(a2, b2, c2), k1, "k2 b", { a: "end" });
    g += pl.pt(x, y, k2, "k3", `(${nm(x)}, ${nm(y)})`, { r: 6, dy: -14 });
    return R(S, pl.svg(g));
  };

  function autoY(f, x0, x1, extra) {
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i <= 80; i++) { const y = f(x0 + ((x1 - x0) * i) / 80); if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } }
    (extra || []).forEach((v) => { lo = Math.min(lo, v); hi = Math.max(hi, v); });
    const pad = (hi - lo || 2) * 0.12;
    return [lo - pad, hi + pad];
  }

  B.quad = ({ p, q }) => {
    const S = Scene(), f = (x) => (x - p) * (x - q), lo = Math.min(p, q), hi = Math.max(p, q);
    const x0 = lo - 3, x1 = hi + 3, vy = f((p + q) / 2);
    const top = Math.min(Math.max(f(x0), f(x1)), Math.max(6, -vy * 1.4 + 4));
    const pl = plane({ x0, x1, y0: Math.min(vy, -1) * 1.15 - 1, y1: top, lx: "x", ly: "y" });
    const fx = Hp().fx;
    const k0 = S.step(`Picture the graph of $y = ${Hp().terms([[1, "x^2"], [-(p + q), "x"], [p * q, ""]])}$.`);
    const k1 = S.step(p === q ? `It factorises to $y = ${fx(p)}^2$.` : `It factorises to $y = ${fx(p)}${fx(q)}$.`);
    const k2 = S.step(p === q ? `$y = 0$ only when $x = ${p}$: the graph just touches the $x$-axis there (a repeated root).` : `$y = 0$ when either bracket is 0: $x = ${lo}$ or $x = ${hi}$. That is where the graph crosses the $x$-axis.`);
    let g = pl.fn(f, k0, "k1 thick");
    g += T(pl.W - 14, 20, p === q ? `y = ${plain(fx(p))}²` : `y = ${plain(fx(p) + fx(q))}`, k1, "k2 b", { a: "end" });
    g += pl.pt(lo, 0, k2, "k3", nm(lo), { r: 6, dy: 16 }) + (p !== q ? pl.pt(hi, 0, k2, "k3", nm(hi), { r: 6, dy: 16 }) : "");
    return R(S, pl.svg(g));
  };

  B.nature = ({ a, b, c }) => {
    const S = Scene(), f = (x) => a * x * x + b * x + c, D = b * b - 4 * a * c, xv = -b / (2 * a);
    const span = Math.max(2.5, D > 0 ? Math.sqrt(D) / Math.abs(2 * a) + 1.5 : 2.5);
    const x0 = xv - span, x1 = xv + span, [y0, y1] = autoY(f, x0, x1, [0]);
    const pl = plane({ x0, x1, y0, y1, lx: "x", ly: "y" });
    const k0 = S.step(`The roots are where the graph of $y = ${Hp().terms([[a, "x^2"], [b, "x"], [c, ""]])}$ meets the $x$-axis.`);
    const k1 = S.step(`$D = b^2 - 4ac = ${par(b)}^2 - 4 \\times ${par(a)} \\times ${par(c)} = ${D}$.`);
    const k2 = S.step(D > 0 ? `$D > 0$: the graph crosses the $x$-axis twice, so two distinct real roots.` : D === 0 ? `$D = 0$: the graph just touches the $x$-axis, so two equal real roots.` : `$D < 0$: the graph never reaches the $x$-axis, so no real roots.`);
    let g = pl.fn(f, k0, "k1 thick") + T(pl.W - 14, 20, `D = ${nm(D)}`, k1, "k2 b", { a: "end" });
    if (D >= 0) {
      const r1_ = (-b - Math.sqrt(D)) / (2 * a), r2_ = (-b + Math.sqrt(D)) / (2 * a);
      g += pl.pt(r1_, 0, k2, "k3", null, { r: 6 }) + (D > 0 ? pl.pt(r2_, 0, k2, "k3", null, { r: 6 }) : "");
    } else g += T(pl.X(xv), pl.Y(0) + (a > 0 ? 16 : -10), "no crossing", k2, "k4 b");
    return R(S, pl.svg(g));
  };

  B.ap = ({ a, d, n }) => {
    const S = Scene(), v = a + (n - 1) * d;
    const k0 = S.step(`The sequence starts at ${a}.`);
    const k1 = S.step(`Each step adds the common difference $d = ${d}$.`);
    const k2 = S.step(`To reach term ${n} from term 1 takes ${n - 1} steps of ${d}.`);
    S.step(`$a_{${n}} = ${a} + ${n - 1} \\times ${par(d)} = ${v}$`);
    let h = "";
    for (let i = 0; i < 4; i++) {
      h += `<div class="seq-b${i ? "" : " k1"}"${A(i ? k1 : k0, { d: i })}><small>term ${i + 1}</small><b>${nm(a + i * d)}</b></div>`;
      if (i < 3) h += `<span class="seq-a"${A(k1, { d: i })}>${d < 0 ? "−" : "+"}${Math.abs(d)}</span>`;
    }
    h += `<span class="seq-a dots"${A(k2)}>…</span><div class="seq-b k3"${A(k2)}><small>term ${n}</small><b${A(k2 + 1)}>${nm(v)}</b></div>`;
    return R(S, `<div class="seq">${h}</div>${eq(`${nm(a)} + ${n - 1} × ${d < 0 ? `(${nm(d)})` : d} = <b>${nm(v)}</b>`, k2, "k2", { x: null })}`);
  };

  B.apsum = ({ a, d, n }) => {
    const S = Scene(), l = a + (n - 1) * d, Sn = (n * (a + l)) / 2;
    const terms = Array.from({ length: n }, (_, i) => a + i * d), show = n <= 8 ? terms.map((_, i) => i) : [0, 1, 2, -1, n - 2, n - 1];
    const k0 = S.step(`Write the terms from first to last. The last (${n}th) term is $${a} + ${n - 1} \\times ${d} = ${l}$.`);
    const k1 = S.step(`Write them again backwards underneath.`);
    const k2 = S.step(`Each column adds to the same total: $${a} + ${l} = ${a + l}$.`);
    const k3 = S.step(`${n} columns of ${a + l} is twice the sum, so $S_{${n}} = \\frac{${n} \\times ${a + l}}{2} = ${Sn}$.`);
    let h = "";
    show.forEach((i) => { h += i < 0 ? cel("…", k0, "") : cel(terms[i], k0, "", { d: Math.max(0, i) }); });
    show.forEach((i) => { h += i < 0 ? cel("…", k1, "") : cel(terms[n - 1 - i], k1, "k2", { d: Math.max(0, i) }); });
    show.forEach((i) => { h += i < 0 ? cel("…", k2, "") : cel(a + l, k2, "k1 b ol", { d: Math.max(0, i), h: k3 }); });
    return R(S, grid(`repeat(${show.length}, 1fr)`, h, "pairs") + eq(`${n} × ${a + l} ÷ 2 = <b>${IN(Sn)}</b>`, k3, "k1"));
  };

  B.dist = ({ x1, y1, x2, y2, mode }) => {
    const S = Scene(), dx = x2 - x1, dy = y2 - y1, cp = mode === "cplx";
    const xs = [x1, x2, 0], ys = [y1, y2, 0];
    const pl = plane({ x0: Math.min(...xs) - 1.5, x1: Math.max(...xs) + 1.5, y0: Math.min(...ys) - 1.5, y1: Math.max(...ys) + 1.5, lx: cp ? "Re" : "x", ly: cp ? "Im" : "y" });
    const d = Math.sqrt(dx * dx + dy * dy);
    const k0 = S.step(cp ? `Plot $z$ as the point $(${x2}, ${y2})$: across ${x2}, up ${y2}.` : `Plot the two points.`);
    const k1 = S.step(mode === "slope" ? `Run (across): $${x2} - ${par(x1)} = ${dx}$.` : cp ? `Across from 0: ${Math.abs(dx)}.` : `Across: $${x2} - ${par(x1)} = ${dx}$.`);
    const k2 = S.step(mode === "slope" ? `Rise (up or down): $${y2} - ${par(y1)} = ${dy}$.` : cp ? `Up or down: ${Math.abs(dy)}.` : `Up or down: $${y2} - ${par(y1)} = ${dy}$.`);
    const k3 = S.step(mode === "slope" ? `Slope $= \\frac{\\text{rise}}{\\text{run}} = \\frac{${dy}}{${dx}}${Hp().frac(dy, dx) === `\\frac{${dy}}{${dx}}` ? "" : ` = ${Hp().frac(dy, dx)}`}$.` : `The ${cp ? "distance from 0" : "distance"} is the long side of the right triangle: $\\sqrt{${dx * dx} + ${dy * dy}} = ${+d.toFixed(3)}$.`);
    const X = pl.X, Y = pl.Y;
    let g = Ln(X(x1), Y(y1), X(x2), Y(y1), k1, "k2 thick5", { draw: true }) + T((X(x1) + X(x2)) / 2, Y(y1) + (dy > 0 ? 14 : -8), Math.abs(dx), k1, "k2 b");
    g += Ln(X(x2), Y(y1), X(x2), Y(y2), k2, "k3 thick5", { draw: true }) + T(X(x2) + (dx > 0 ? 10 : -10), (Y(y1) + Y(y2)) / 2, Math.abs(dy), k2, "k3 b", { a: dx > 0 ? "start" : "end" });
    if (mode !== "slope") g += Ln(X(x1), Y(y1), X(x2), Y(y2), k3, "k1 thick5", { draw: true }) + T((X(x1) + X(x2)) / 2 - (dy * dx > 0 ? 10 : -10), (Y(y1) + Y(y2)) / 2 - 8, +d.toFixed(2), k3, "k1 big");
    else g += Ln(X(x1), Y(y1), X(x2), Y(y2), k0, "k1 thin dash");
    g += pl.pt(x1, y1, cp ? null : k0, "k4", cp ? "0" : `(${nm(x1)}, ${nm(y1)})`, { dy: dy > 0 ? 16 : -12 }) + pl.pt(x2, y2, k0, "k4", cp ? `${nm(x2)} ${y2 < 0 ? "−" : "+"} ${Math.abs(y2)}i` : `(${nm(x2)}, ${nm(y2)})`, { dy: dy > 0 ? -12 : 16 });
    return R(S, pl.svg(g));
  };

  B.mid = ({ x1, y1, x2, y2 }) => {
    const S = Scene(), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const pl = plane({ x0: Math.min(x1, x2, 0) - 1.5, x1: Math.max(x1, x2, 0) + 1.5, y0: Math.min(y1, y2, 0) - 1.5, y1: Math.max(y1, y2, 0) + 1.5, lx: "x", ly: "y" });
    const X = pl.X, Y = pl.Y;
    const k0 = S.step(`Plot the two points and join them.`);
    const k1 = S.step(`Halfway across: the average of the $x$s, $\\frac{${x1} + ${par(x2)}}{2} = ${mx}$.`);
    const k2 = S.step(`Halfway up: the average of the $y$s, $\\frac{${y1} + ${par(y2)}}{2} = ${my}$.`);
    S.step(`The midpoint is $(${mx}, ${my})$.`);
    let g = Ln(X(x1), Y(y1), X(x2), Y(y2), k0, "k1 thick", { draw: true });
    g += Ln(X(x1), Y(y1), X(x1), Y(0), k1, "k2 dash") + Ln(X(x2), Y(y2), X(x2), Y(0), k1, "k2 dash") + Ci(X(mx), Y(0), 5, k1, "dot k2") + T(X(mx), Y(0) + 16, nm(mx), k1, "k2 b");
    g += Ln(X(x1), Y(y1), X(0), Y(y1), k2, "k3 dash") + Ln(X(x2), Y(y2), X(0), Y(y2), k2, "k3 dash") + Ci(X(0), Y(my), 5, k2, "dot k3") + T(X(0) - 8, Y(my), nm(my), k2, "k3 b", { a: "end" });
    g += pl.pt(x1, y1, k0, "k4", `(${nm(x1)}, ${nm(y1)})`) + pl.pt(x2, y2, k0, "k4", `(${nm(x2)}, ${nm(y2)})`) + pl.pt(mx, my, k2 + 1, "k1", `(${nm(mx)}, ${nm(my)})`, { r: 6 });
    return R(S, pl.svg(g));
  };

  B.pythag = ({ a, b, c, find }) => {
    const S = Scene(), pts = [[0, 0], [a, 0], [0, b]], all = [[-b, 0], [a + b, 0], [0, -a], [b, b + a], [a + b, a], [-b, b]];
    const F = fit([...pts, ...all], 300, 260, 6), f = F.f;
    const O = f([0, 0]), Aa = f([a, 0]), Bb = f([0, b]);
    const sqA = [[0, 0], [a, 0], [a, -a], [0, -a]].map(f), sqB = [[0, 0], [0, b], [-b, b], [-b, 0]].map(f), sqC = [[a, 0], [0, b], [b, b + a], [a + b, a]].map(f);
    const cen = (q) => [q.reduce((s, p) => s + p[0], 0) / 4, q.reduce((s, p) => s + p[1], 0) / 4];
    const k0 = S.step(find === "hyp" ? `Legs ${a} and ${b}. The long side (hypotenuse) is unknown.` : `Hypotenuse ${c} and one leg ${a}. The other leg is unknown.`);
    let g = "";
    if (find === "hyp") {
      const k1 = S.step(`Build a square on the leg ${a}: area $${a}^2 = ${a * a}$.`);
      const k2 = S.step(`Build a square on the leg ${b}: area $${b}^2 = ${b * b}$.`);
      const k3 = S.step(`Pythagoras: the square on the hypotenuse has the same area as the other two together: $${a * a} + ${b * b} = ${c * c}$.`);
      S.step(`Its side is $\\sqrt{${c * c}} = ${c}$.`);
      g += Poly(sqA, k1, "f1 ln") + T(...cen(sqA), `${a * a}`, k1, "k1 b") + Poly(sqB, k2, "f2 ln") + T(...cen(sqB), `${b * b}`, k2, "k2 b") + Poly(sqC, k3, "f3 ln") + T(...cen(sqC), `${c * c}`, k3, "k3 big");
    } else {
      const k1 = S.step(`The square on the hypotenuse has area $${c}^2 = ${c * c}$.`);
      const k2 = S.step(`The square on the known leg has area $${a}^2 = ${a * a}$.`);
      const k3 = S.step(`The square on the missing leg is what's left: $${c * c} - ${a * a} = ${b * b}$.`);
      S.step(`Its side is $\\sqrt{${b * b}} = ${b}$.`);
      g += Poly(sqC, k1, "f3 ln") + T(...cen(sqC), `${c * c}`, k1, "k3 b") + Poly(sqA, k2, "f1 ln") + T(...cen(sqA), `${a * a}`, k2, "k1 b") + Poly(sqB, k3, "f2 ln") + T(...cen(sqB), `${b * b}`, k3, "k2 big");
    }
    const last = S.caps.length - 1;
    g += Poly([O, Aa, Bb], k0, "f0 ln thick") + rightMark(O[0], O[1], 1, 0, 0, -1, 9, k0);
    g += T((O[0] + Aa[0]) / 2, O[1] - 8, a, k0, "b");
    g += `<g${A(k0, { x: find === "leg" ? last : null })}>${T(O[0] + 9, (O[1] + Bb[1]) / 2, find === "leg" ? "?" : b, null, "b", { a: "start" })}</g>` + (find === "leg" ? T(O[0] + 9, (O[1] + Bb[1]) / 2, b, last, "k2 big", { a: "start" }) : "");
    const mx = (Aa[0] + Bb[0]) / 2, my = (Aa[1] + Bb[1]) / 2, hl = Math.hypot(Bb[0] - Aa[0], Bb[1] - Aa[1]);
    let nx = (Bb[1] - Aa[1]) / hl, ny = -(Bb[0] - Aa[0]) / hl;
    if (nx * (mx - O[0]) + ny * (my - O[1]) < 0) { nx = -nx; ny = -ny; }
    const hx = mx + nx * 14, hy = my + ny * 14;
    g += `<g${A(k0, { x: find === "hyp" ? last : null })}>${T(hx, hy, find === "hyp" ? "?" : c, null, "b")}</g>` + (find === "hyp" ? T(hx, hy, c, last, "k3 big") : "");
    return R(S, svg(300, 260, g));
  };

  B.tangent = ({ r, len: t, d }) => {
    const sc = Math.min(210 / d, 284 / (r + d), 100 / r), Rr = r * sc, O = [Math.max(60, Rr + 12), 120], Pp = [O[0] + d * sc, 120], ph = Math.acos(r / d), S = Scene();
    const Tt = [O[0] + Rr * Math.cos(ph), O[1] - Rr * Math.sin(ph)];
    const k0 = S.step(`The point is ${d} cm from the centre O.`);
    const k1 = S.step(`Draw the radius to where the tangent touches: ${r} cm.`);
    const k2 = S.step(`The tangent meets the radius at a right angle, so the three lines make a right triangle with hypotenuse ${d}.`);
    S.step(`Pythagoras: $t = \\sqrt{${d}^2 - ${r}^2} = \\sqrt{${d * d - r * r}} = ${t}$ cm.`);
    let g = Ci(O[0], O[1], Rr, null, "ln thick") + Ci(O[0], O[1], 3.5, null, "dot k0") + T(O[0] - 10, O[1] + 4, "O", null, "b");
    g += Ln(O[0], O[1], Pp[0], Pp[1], k0, "k2 thick") + T((O[0] + Pp[0]) / 2 + 20, O[1] + 14, `${d}`, k0, "k2 b") + Ci(Pp[0], Pp[1], 4, k0, "dot k2") + T(Pp[0] + 8, Pp[1], "P", k0, "b", { a: "start" });
    g += Ln(O[0], O[1], Tt[0], Tt[1], k1, "k1 thick", { draw: true }) + T((O[0] + Tt[0]) / 2 - 8, (O[1] + Tt[1]) / 2 - 4, `${r}`, k1, "k1 b", { a: "end" });
    const ux = (O[0] - Tt[0]) / Rr, uy = (O[1] - Tt[1]) / Rr, pl_ = Math.hypot(Pp[0] - Tt[0], Pp[1] - Tt[1]), vx = (Pp[0] - Tt[0]) / pl_, vy = (Pp[1] - Tt[1]) / pl_;
    g += Ln(Tt[0], Tt[1], Pp[0], Pp[1], k2, "k3 thick5", { draw: true }) + rightMark(Tt[0], Tt[1], ux, uy, vx, vy, 10, k2);
    g += `<g${A(k2, { x: k2 + 1 })}>${T((Tt[0] + Pp[0]) / 2 + 6, (Tt[1] + Pp[1]) / 2 - 10, "t = ?", null, "k3 b")}</g>` + T((Tt[0] + Pp[0]) / 2 + 6, (Tt[1] + Pp[1]) / 2 - 10, `t = ${t}`, k2 + 1, "k3 big");
    return R(S, svg(320, Math.max(200, 128 + Rr), g));
  };

  function rtTri(base, ht, W, H) {
    const F = fit([[0, 0], [base, 0], [base, ht]], W, H, 26);
    return [[0, 0], [base, 0], [base, ht]].map(F.f);
  }
  B.trig = ({ f, a, val }) => {
    const S = Scene();
    if (a === 0 || a === 90) {
      const cx = 160, cy = 110, Rr = 80, [c, s] = a === 0 ? [1, 0] : [0, 1];
      const k0 = S.step(`On a circle of radius 1, the point at angle $\\theta$ is $(\\cos\\theta, \\sin\\theta)$.`);
      const k1 = S.step(`At $${a}^\\circ$ the point is $(${c}, ${s})$.`);
      S.step(`So $\\${f} ${a}^\\circ = ${val}$.`);
      let g = Ln(cx - Rr - 14, cy, cx + Rr + 14, cy, null, "ax") + Ln(cx, cy + Rr + 10, cx, cy - Rr - 14, null, "ax") + Ci(cx, cy, Rr, k0, "ln thick");
      g += Ln(cx, cy, cx + c * Rr, cy - s * Rr, k1, "k1 thick5", { draw: true }) + G(Ci(cx + c * Rr, cy - s * Rr, 6, null, "dot k1") + T(cx + c * Rr + (a ? 10 : 6), cy - s * Rr - 12, `(${c}, ${s})`, null, "k1 b", { a: "start" }), k1);
      return R(S, svg(320, 214, g));
    }
    const sides = a === 45 ? [1, 1, "1", "1", "√2"] : a === 30 ? [Math.sqrt(3), 1, "√3", "1", "2"] : [1, Math.sqrt(3), "1", "√3", "2"];
    const [p0, p1, p2] = rtTri(sides[0], sides[1], 300, 170);
    const which = { sin: ["opp", "hyp"], cos: ["adj", "hyp"], tan: ["opp", "adj"] }[f];
    const NAME = { opp: "opposite", adj: "adjacent", hyp: "hypotenuse" };
    const k0 = S.step(a === 45 ? `Use the right isosceles triangle with sides 1, 1 and √2.` : `Use half of an equilateral triangle of side 2: sides 1, √3 and 2.`);
    const k1 = S.step(`From the ${a}° angle, the ${NAME[which[0]]} side is ${{ opp: sides[3], adj: sides[2], hyp: sides[4] }[which[0]]}.`);
    const k2 = S.step(`The ${NAME[which[1]]} is ${{ opp: sides[3], adj: sides[2], hyp: sides[4] }[which[1]]}.`);
    S.step(`$\\${f} ${a}^\\circ = \\frac{\\text{${NAME[which[0]]}}}{\\text{${NAME[which[1]]}}} = ${val}$`);
    const hl = (s) => (which[0] === s ? { h: k1, cls: "k1" } : which[1] === s ? { h: k2, cls: "k2" } : { cls: "" });
    const side = (u, v, s, lab, dx, dy) => { const o = hl(s); return Ln(u[0], u[1], v[0], v[1], k0, `ln thick5 ${o.cls ? "s" + o.cls : ""}`, { h: o.h }) + T((u[0] + v[0]) / 2 + dx, (u[1] + v[1]) / 2 + dy, lab, k0, `b ${o.cls}`, { h: o.h }); };
    let g = Poly([p0, p1, p2], k0, "f0") + side(p0, p1, "adj", sides[2], 0, 15) + side(p1, p2, "opp", sides[3], 14, 0) + side(p0, p2, "hyp", sides[4], -12, -8);
    g += rightMark(p1[0], p1[1], -1, 0, 0, -1, 10, k0) + P(arcPath(p0[0], p0[1], 26, 0, Math.atan2(p0[1] - p2[1], p2[0] - p0[0])), k0, "ln thin") + T(p0[0] + 40, p0[1] - 9, `${a}°`, k0, "b");
    return R(S, svg(320, 176, g));
  };

  B.trigratio = ({ opp, adj, h, given, want }) => {
    const S = Scene(), [p0, p1, p2] = rtTri(adj, opp, 300, 170);
    const known = given === "sin" ? "opp" : "adj", miss = known === "opp" ? "adj" : "opp";
    const V = { opp, adj, hyp: h }, NAME = { opp: "opposite", adj: "adjacent", hyp: "hypotenuse" };
    const top = want === "cos" ? "adj" : "opp", bot = want === "tan" ? "adj" : "hyp";
    const k0 = S.step(`$\\${given}\\theta = \\frac{${V[known]}}{${h}}$: the ${NAME[known]} side is ${V[known]} and the hypotenuse is ${h}.`);
    const k1 = S.step(`Pythagoras gives the ${NAME[miss]}: $\\sqrt{${h}^2 - ${V[known]}^2} = ${V[miss]}$.`);
    const k2 = S.step(`$\\${want}\\theta = \\frac{\\text{${NAME[top]}}}{\\text{${NAME[bot]}}}$.`);
    S.step(`$= \\frac{${V[top]}}{${V[bot]}}$`);
    const side = (u, v, s, dx, dy) => {
      const o = s === top ? { h: k2, c: "k1" } : s === bot ? { h: k2, c: "k2" } : { c: "" };
      const lab = s === miss ? `<g${A(k0, { x: k1 })}>${T((u[0] + v[0]) / 2 + dx, (u[1] + v[1]) / 2 + dy, "?", null, "b")}</g>` + T((u[0] + v[0]) / 2 + dx, (u[1] + v[1]) / 2 + dy, V[s], k1, `b k3`, { h: o.h }) : T((u[0] + v[0]) / 2 + dx, (u[1] + v[1]) / 2 + dy, V[s], k0, `b ${o.c}`, { h: o.h });
      return Ln(u[0], u[1], v[0], v[1], k0, `ln thick5 ${o.c ? "s" + o.c : ""}`, { h: o.h }) + lab;
    };
    let g = Poly([p0, p1, p2], k0, "f0") + side(p0, p1, "adj", 0, 15) + side(p1, p2, "opp", 14, 0) + side(p0, p2, "hyp", -12, -8);
    g += rightMark(p1[0], p1[1], -1, 0, 0, -1, 10, k0) + T(p0[0] + 34, p0[1] - 9, "θ", k0, "b i");
    return R(S, svg(320, 176, g));
  };

  B.heights = ({ th, d, exact }) => {
    const S = Scene(), tn = Math.tan((th * Math.PI) / 180), D = Math.min(190, 150 / tn), Hh = D * tn, gx = 270, gy = 180, ox = gx - D;
    const k0 = S.step(`The observer stands ${d} m from the foot of the tower and looks up at ${th}°.`);
    const k1 = S.step(`That makes a right triangle: the height $h$ is opposite the ${th}° angle, and ${d} m is adjacent to it.`);
    const k2 = S.step(`$\\tan ${th}^\\circ = \\frac{h}{${d}}$, so $h = ${d} \\times \\tan ${th}^\\circ$.`);
    S.step(`$h = ${exact}$ m`);
    let g = Ln(10, gy, 310, gy, null, "ax thick") + Rc(gx, gy - Hh, 22, Hh, null, "f5 ln") + Ci(ox, gy - 6, 6, null, "dot k4");
    g += T((ox + gx) / 2, gy + 16, `${d} m`, k0, "b") + Ln(ox, gy - 6, gx, gy - Hh, k0, "k1 dash", { draw: true });
    g += P(arcPath(ox, gy - 6, 30, 0, Math.atan(Hh / D)), k0, "k1 thick") + T(ox + 44, gy - 16, `${th}°`, k0, "k1 b", { a: "start" });
    g += Poly([[ox, gy], [gx, gy], [gx, gy - Hh]], k1, "f1");
    g += T(gx + 30, gy - Hh / 2, "h", k1, "k2 big i", { a: "start", x: S.caps.length - 1 }) + T(gx + 28, gy - Hh / 2, exact.replace(/\\sqrt3/, "√3").replace(/\\frac\{(\d+)\}\{\\sqrt3\}/, "$1/√3"), S.caps.length - 1, "k2 b", { a: "start" });
    return R(S, svg(320, 200, g));
  };

  B.solid = (o) => {
    const S = Scene(), { k, mode } = o, val = o.v;
    let g = "";
    if (k === "cube" || k === "cuboid") {
      const l = k === "cube" ? o.a : o.l, b = k === "cube" ? o.a : o.b, h = k === "cube" ? o.a : o.h;
      const s = Math.min(170 / (l + 0.6 * b), 120 / (h + 0.42 * b)), w = l * s, hh = h * s, dx = 0.6 * b * s, dy = -0.42 * b * s;
      const x0 = (320 - w - dx) / 2, y0 = 26 - dy;
      const front = [[x0, y0], [x0 + w, y0], [x0 + w, y0 + hh], [x0, y0 + hh]], top = [[x0, y0], [x0 + w, y0], [x0 + w + dx, y0 + dy], [x0 + dx, y0 + dy]], side = [[x0 + w, y0], [x0 + w + dx, y0 + dy], [x0 + w + dx, y0 + dy + hh], [x0 + w, y0 + hh]];
      const k0 = S.step(k === "cube" ? `A cube with side ${l} cm.` : `A cuboid ${l} cm long, ${b} cm wide and ${h} cm high.`);
      let kTop = null, kFront = null, kSide = null, kLay = null;
      if (mode === "vol") {
        kTop = S.step(k === "cube" ? `The base is a ${l} by ${l} square: $${l} \\times ${l} = ${l * l}$ cm².` : `The base has area $${l} \\times ${b} = ${l * b}$ cm².`);
        kLay = S.step(`Stack ${h} layers of that base to fill it: $\\times ${h}$.`);
        S.step(`$V = ${l * b} \\times ${h} = ${val}$ cm³.`);
      } else if (k === "cube") {
        kTop = S.step(`Every face is a ${l} by ${l} square: $${l * l}$ cm².`);
        kFront = kTop; kSide = kTop;
        S.step(`A cube has 6 faces (3 you can see, 3 hidden): $6 \\times ${l * l} = ${val}$ cm².`);
      } else {
        kTop = S.step(`Top and bottom: $2 \\times ${l} \\times ${b} = ${2 * l * b}$.`);
        kFront = S.step(`Front and back: $2 \\times ${l} \\times ${h} = ${2 * l * h}$.`);
        kSide = S.step(`The two ends: $2 \\times ${b} \\times ${h} = ${2 * b * h}$.`);
        S.step(`Total $= ${2 * l * b} + ${2 * l * h} + ${2 * b * h} = ${val}$ cm².`);
      }
      g += Poly(front, k0, "f0 ln thick") + Poly(top, k0, "f0 ln thick") + Poly(side, k0, "f0 ln thick");
      if (kTop != null) g += Poly(top, kTop, "f1 ln thick");
      if (kFront != null) g += Poly(front, kFront, "f2 ln thick");
      if (kSide != null) g += Poly(side, kSide, "f3 ln thick");
      if (kLay != null) { let ly = ""; for (let i = 1; i < Math.min(h, 12); i++) { const yy = y0 + (hh * i) / Math.min(h, 12); ly += Ln(x0, yy, x0 + w, yy, null, "k1 thin") + Ln(x0 + w, yy, x0 + w + dx, yy + dy, null, "k1 thin"); } g += G(ly, kLay); }
      g += T(x0 + w / 2, y0 + hh + 15, `${l}`, k0, "b") + T(x0 - 8, y0 + hh / 2, `${h}`, k0, "b", { a: "end" }) + T(x0 + w + dx / 2 + 10, y0 + hh + dy / 2 + 8, `${b}`, k0, "b", { a: "start" });
      return R(S, svg(320, y0 + hh + 26, g));
    }
    const r = o.r, cx = 150;
    if (k === "sphere") {
      const Rr = 74, cy = 100;
      const k0 = S.step(`A sphere of radius ${r} cm.`);
      g += Ci(cx, cy, Rr, mode === "sa" ? null : k0, "f1 ln thick") + P(`M${cx - Rr} ${cy}A${Rr} ${Rr * 0.28} 0 0 0 ${cx + Rr} ${cy}`, k0, "ln thin") + P(`M${cx - Rr} ${cy}A${Rr} ${Rr * 0.28} 0 0 1 ${cx + Rr} ${cy}`, k0, "ln thin dash");
      g += Ln(cx, cy, cx + Rr, cy, k0, "k2 thick") + T(cx + Rr / 2, cy - 8, `r = ${r}`, k0, "k2 b");
      if (mode === "vol") { S.step(`$V = \\frac43 \\pi r^3$, and $r^3 = ${r} \\times ${r} \\times ${r} = ${r ** 3}$.`); S.step(`$V = \\frac43 \\times \\frac{22}{7} \\times ${r ** 3} \\approx ${val}$ cm³.`); }
      else {
        const k1 = S.step(`Its surface has exactly the same area as 4 flat circles of the same radius.`);
        S.step(`$S = 4\\pi r^2 = 4 \\times \\frac{22}{7} \\times ${r} \\times ${r} = ${val}$ cm².`);
        [0, 1, 2, 3].forEach((i) => { g += Ci(252 + (i % 2) * 44, 56 + Math.floor(i / 2) * 50, 20, k1, "f2 ln", { d: i }); });
        g = g.replace(`class="f1 ln thick"`, `class="f0 ln thick"`);
      }
      return R(S, svg(320, 200, g));
    }
    const h = o.h, s = Math.min(70 / r, 130 / h), rx = r * s, ry = rx * 0.3, hh = h * s, top = 24 + ry, bot = top + hh, cxx = k === "cylinder" && mode === "sa" ? 80 : cx;
    const k0 = S.step(`A ${k} with radius ${r} cm and height ${h} cm.`);
    const base = `M${r1(cxx - rx)} ${r1(bot)}A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(cxx + rx)} ${r1(bot)}`, baseBack = `M${r1(cxx - rx)} ${r1(bot)}A${r1(rx)} ${r1(ry)} 0 0 1 ${r1(cxx + rx)} ${r1(bot)}`;
    if (k === "cylinder") {
      g += P(`M${r1(cxx - rx)} ${r1(top)}L${r1(cxx - rx)} ${r1(bot)}` + base.replace(/^M[^A]+/, "") + `L${r1(cxx + rx)} ${r1(top)}`, k0, "f0 ln thick") + `<ellipse cx="${cxx}" cy="${r1(top)}" rx="${r1(rx)}" ry="${r1(ry)}" class="f0 ln thick"${A(k0)}/>` + P(baseBack, k0, "ln thin dash");
    } else {
      g += P(`M${r1(cxx - rx)} ${r1(bot)}L${cxx} ${r1(top - ry)}L${r1(cxx + rx)} ${r1(bot)}`, k0, "f0 ln thick") + P(base, k0, "ln thick") + P(baseBack, k0, "ln thin dash");
    }
    g += Ln(cxx, bot, cxx + rx, bot, k0, "k2 thick") + T(cxx + rx / 2, bot + 14, `r = ${r}`, k0, "k2 b") + Ln(cxx - rx - 12, k === "cone" ? top - ry : top, cxx - rx - 12, bot, k0, "ln thin") + T(cxx - rx - 16, (top + bot) / 2, `h = ${h}`, k0, "b", { a: "end" });
    if (mode === "vol") {
      const k1 = S.step(`The base is a circle: area $\\pi r^2 = \\frac{22}{7} \\times ${r} \\times ${r} = ${(22 * r * r) / 7}$ cm².`);
      g += `<ellipse cx="${cxx}" cy="${r1(bot)}" rx="${r1(rx)}" ry="${r1(ry)}" class="f1 ln"${A(k1)}/>`;
      if (k === "cone") {
        const k2 = S.step(`A cylinder with the same base and height would hold $${(22 * r * r) / 7} \\times ${h}$. The cone holds exactly a third of that.`);
        g += P(`M${r1(cxx - rx)} ${r1(top - ry)}L${r1(cxx - rx)} ${r1(bot)}M${r1(cxx + rx)} ${r1(top - ry)}L${r1(cxx + rx)} ${r1(bot)}`, k2, "k4 dash") + `<ellipse cx="${cxx}" cy="${r1(top - ry)}" rx="${r1(rx)}" ry="${r1(ry)}" class="k4 dash"${A(k2)}/>`;
        S.step(`$V = \\frac13 \\times ${(22 * r * r) / 7} \\times ${h} = ${val}$ cm³.`);
      } else {
        const k2 = S.step(`Stack that base ${h} cm high: $\\times ${h}$.`);
        g += Ln(cxx + rx + 14, bot, cxx + rx + 14, top, k2, "k1 thick", { draw: true });
        S.step(`$V = ${(22 * r * r) / 7} \\times ${h} = ${val}$ cm³.`);
      }
    } else {
      const k1 = S.step(`Unroll the curved surface: it becomes a rectangle ${h} cm high and as wide as the circumference, $2\\pi r = 2 \\times \\frac{22}{7} \\times ${r} = ${(44 * r) / 7}$ cm.`);
      g += Rc(170, top - ry, 136, hh + ry, k1, "f2 ln thick") + T(238, top - ry - 8, `2πr = ${(44 * r) / 7}`, k1, "k2 b") + T(312, (top + bot) / 2, `${h}`, k1, "b", { a: "end" });
      S.step(`Curved surface area $= ${(44 * r) / 7} \\times ${h} = ${val}$ cm².`);
    }
    return R(S, svg(320, bot + 30, g));
  };

  B.gmean = ({ mids, f }) => {
    const S = Scene(), fx = mids.map((m, i) => m * f[i]), sf = f.reduce((a, b) => a + b, 0), sfx = fx.reduce((a, b) => a + b, 0);
    const k0 = S.step(`Put the data in a table.`);
    const k1 = S.step(`Class mark $x$: the middle of each class.`);
    const k2 = S.step(`Multiply each class mark by its frequency to get $fx$.`);
    const k3 = S.step(`Add the columns: $\\sum f = ${sf}$ and $\\sum fx = ${sfx}$.`);
    S.step(`Mean $= \\frac{\\sum fx}{\\sum f} = \\frac{${sfx}}{${sf}} = ${sfx / sf}$.`);
    let h = cel("Class", k0, "vh") + cel("f", k0, "vh") + cel("x", k1, "vh") + cel("fx", k2, "vh");
    mids.forEach((m, i) => { h += cel(`${m - 5}–${m + 5}`, k0, "", { d: i }) + cel(f[i], k0, "k2", { d: i, h: k3 }) + cel(m, k1, "k3", { d: i }) + cel(fx[i], k2, "k1", { d: i, h: k3 }); });
    h += cel("Total", k3, "vh") + cel(sf, k3, "k2 b") + cel("", null, "") + cel(sfx, k3, "k1 b");
    return R(S, grid("1.3fr 1fr 1fr 1fr", h, "tbl") + eq(`${sfx} ÷ ${sf} = <b>${nm(sfx / sf)}</b>`, k3 + 1, "k1"));
  };

  B.dice = ({ kind, s }) => {
    const S = Scene(), ok = (a, b) => (kind === 0 ? a + b === s : kind === 1 ? a + b >= s : a === b);
    let w = 0;
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (ok(a, b)) w++;
    const k0 = S.step(`Every way the two dice can land: 6 × 6 = 36 squares. Each square shows the total.`);
    const k1 = S.step(`Colour the squares we want: ${kind === 0 ? `sum ${s}` : kind === 1 ? `sum ${s} or more` : "a double"}. There are ${w}.`);
    S.step(`$P = \\frac{${w}}{36}${Hp().frac(w, 36) === `\\frac{${w}}{36}` ? "" : ` = ${Hp().frac(w, 36)}`}$`);
    let h = cel("+", k0, "vh");
    for (let b = 1; b <= 6; b++) h += cel(b, k0, "vh die");
    for (let a = 1; a <= 6; a++) {
      h += cel(a, k0, "vh die");
      for (let b = 1; b <= 6; b++) h += cel(a + b, k0, "dc", { d: a + b, add: ok(a, b) ? [k1, "hit"] : [k1, "dim"] });
    }
    return R(S, grid("repeat(7, 1fr)", h, "dice"));
  };

  const DECK = { red: (r, s) => s < 2, king: (r) => r === 12, face: (r) => r >= 10, heart: (r, s) => s === 0, bking: (r, s) => r === 12 && s >= 2, ace: (r) => r === 0, qs: (r, s) => r === 11 && s === 2, rface: (r, s) => r >= 10 && s < 2, num: (r) => r >= 1 && r <= 9, spadeace: (r, s) => s === 2 || r === 0 };
  B.deck = ({ ev, w, name }) => {
    const S = Scene(), ok = DECK[ev], suits = ["♥", "♦", "♠", "♣"], ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const k0 = S.step(`A deck has 4 suits of 13 cards: 52 in all. Hearts and diamonds are red.`);
    const k1 = S.step(`Pick out ${name}: ${w} card${w > 1 ? "s" : ""}.`);
    S.step(`$P = \\frac{${w}}{52}${w === 1 ? "" : ` = ${Hp().frac(w, 52)}`}$`);
    let h = "";
    suits.forEach((su, s) => ranks.forEach((rk, r) => { h += cel(`${rk}<small>${su}</small>`, k0, `card${s < 2 ? " red" : ""}`, { d: r, add: ok(r, s) ? [k1, "hit"] : [k1, "dim"] }); }));
    return R(S, grid("repeat(13, 1fr)", h, "deck"));
  };

  function termmap(rows, intro, final) {
    const S = Scene(), k0 = S.step(intro), ks = rows.map((r) => S.step(r[2]));
    let h = "";
    rows.forEach(([a, b], i) => { h += cel(tx(a), k0, "tm-a", { d: i, h: ks[i] }) + cel("→", ks[i], "tm-arw") + cel(tx(b), ks[i], "tm-b k1"); });
    const kF = S.step(final[1]);
    return R(S, grid("auto auto auto", h, "tmap") + eq(tx(final[0]), kF, "k1"));
  }

  B.decmul = ({ a, b }) => longMulViz(a, b, { dpA: 1, dpB: 1 });

  B.sdtconv = ({ s }) => chainOf([
    [`1\\text{ km/h} = \\frac{1000\\text{ m}}{3600\\text{ s}} = ${hc(0, "\\frac{5}{18}")}\\text{ m/s}`, `1 km is 1000 m and 1 hour is 3600 seconds.`],
    [`${s} \\times ${hc(0, "\\frac{5}{18}")} = \\frac{${s * 5}}{18}`, `Multiply by $\\frac{5}{18}$.`],
    [`= ${hc(2, (s * 5) / 18)}\\text{ m/s}`, `So ${s} km/h is ${(s * 5) / 18} m/s.`],
  ], [`${s}\\text{ km/h}`, `Change kilometres per hour into metres per second.`]);

  B.sets = ({ A: a, B: b, both }) => {
    const S = Scene();
    const k0 = S.step(`Draw a circle for each game. People who like both go in the overlap.`);
    const k1 = S.step(`${both} like both: they go in the middle.`);
    const k2 = S.step(`Cricket only: $${a} - ${both} = ${a - both}$.`);
    const k3 = S.step(`Football only: $${b} - ${both} = ${b - both}$.`);
    S.step(`At least one: $${a - both} + ${both} + ${b - both} = ${a + b - both}$. (Same as $${a} + ${b} - ${both}$.)`);
    let g = Ci(118, 100, 72, k0, "f1 ln thick") + Ci(202, 100, 72, k0, "f2 ln thick");
    g += T(90, 18, `Cricket (${a})`, k0, "k1 b") + T(230, 18, `Football (${b})`, k0, "k2 b");
    g += T(160, 100, both, k1, "big k4") + T(88, 100, a - both, k2, "big k1") + T(232, 100, b - both, k3, "big k2");
    return R(S, svg(320, 186, g));
  };

  B.allied = ({ a, f, v, ref, quad, val, rv }) => {
    const S = Scene(), cx = 160, cy = 112, Rr = 82, rad = (a * Math.PI) / 180;
    const k0 = S.step(`"All Students Take Coffee": in each quadrant, these are positive.`);
    const k1 = S.step(`Turn ${a}° anticlockwise from the positive $x$-axis. It lands in the ${quad} quadrant.`);
    const k2 = S.step(`The reference angle (to the nearest $x$-axis) is ${ref}°, so $\\${f} ${a}^\\circ = \\pm\\${f} ${ref}^\\circ = \\pm ${rv}$.`);
    S.step(`In the ${quad} quadrant ${f} is ${v < 0 ? "negative" : "positive"}: $\\${f} ${a}^\\circ = ${val}$.`);
    let g = Ln(cx - Rr - 16, cy, cx + Rr + 16, cy, null, "ax") + Ln(cx, cy + Rr + 10, cx, cy - Rr - 10, null, "ax") + Ci(cx, cy, Rr, null, "ln");
    [["A", 1, -1], ["S", -1, -1], ["T", -1, 1], ["C", 1, 1]].forEach(([L, sx, sy], i) => { g += T(cx + sx * 50, cy + sy * 48, L, k0, `big k${[2, 1, 3, 4][i]}`, { d: i }); });
    const px = cx + Rr * Math.cos(rad), py = cy - Rr * Math.sin(rad);
    g += P(arcPath(cx, cy, 22, 0, rad), k1, "k1 thick") + Ln(cx, cy, px, py, k1, "k1 thick5", { draw: true }) + Ci(px, py, 5, k1, "dot k1") + T(cx + 30, cy - 10, `${a}°`, k1, "k1 b", { a: "start" });
    const axisT = a < 180 ? Math.PI : a < 270 ? Math.PI : 2 * Math.PI;
    g += P(sector(cx, cy, 40, Math.min(rad, axisT), Math.max(rad, axisT)), k2, "f2 ln thin") + T(cx + 54 * Math.cos((rad + axisT) / 2), cy - 54 * Math.sin((rad + axisT) / 2), `${ref}°`, k2, "k2 b");
    return R(S, svg(320, 214, g));
  };

  B.cmul = ({ a, b, c, d }) => {
    const S = Scene(), cx = Hp().cx, re = a * c - b * d, im = a * d + b * c;
    const k0 = S.step(`Multiply every part of the first bracket by every part of the second (a grid helps).`);
    const ks = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([i, j]) => S.step(`$${i ? cx(0, b) : a} \\times ${j ? (d < 0 ? `(${cx(0, d)})` : cx(0, d)) : par(c)} = ${[[a * c, cx(0, a * d)], [cx(0, b * c), `${b * d === 1 ? "" : b * d === -1 ? "-" : b * d}i^2`]][i][j]}$`));
    const k5 = S.step(`$i^2 = -1$, so $${b * d === 1 ? "" : b * d === -1 ? "-" : b * d}i^2 = ${-b * d}$.`);
    const k6 = S.step(`Add the real parts and the imaginary parts: $${cx(re, im)}$.`);
    let h = cel("×", k0, "vh") + cel(tx(`${c}`), k0, "vh k2") + cel(tx(cx(0, d)), k0, "vh k2");
    h += cel(tx(`${a}`), k0, "vh k1") + cel(tx(`${a * c}`), ks[0], "k3", { h: k6 }) + cel(tx(cx(0, a * d)), ks[1], "k4", { h: k6 });
    h += cel(tx(cx(0, b)), k0, "vh k1") + cel(tx(cx(0, b * c)), ks[2], "k4", { h: k6 }) + `<div class="vc vst"><span${A(ks[3], { x: k5 })}>${tx(`${b * d === 1 ? "" : b * d === -1 ? "-" : b * d}i^2`)}</span><span class="k3"${A(k5, { h: k6 })}>${tx(`${-b * d}`)}</span></div>`;
    return R(S, grid("auto 1fr 1fr", h, "tbl cm") + eq(`<span class="k3">real ${nm(a * c)} + ${par(-b * d).replace(/-/g, "−")} = ${nm(re)}</span>, <span class="k4">imaginary ${nm(a * d)} + ${par(b * c).replace(/-/g, "−")} = ${nm(im)}</span>`, k6, "sm"));
  };

  B.ncr = ({ n, r }) => {
    const S = Scene(), v = E().nCr(n, r);
    const k0 = S.step(`$\\binom{${n}}{${r}} = \\frac{${n}!}{${r}!\\,${n - r}!}$. Write the factorials out.`);
    const k1 = S.step(`${n - r}! appears on the top and the bottom, so it cancels.`);
    const k2 = S.step(`What is left: $\\frac{${Array.from({ length: r }, (_, i) => n - i).join(" \\times ")}}{${Array.from({ length: r }, (_, i) => r - i).join(" \\times ")}} = \\frac{${E().fact(n) / E().fact(n - r)}}{${E().fact(r)}} = ${v}$.`);
    const top = Array.from({ length: n }, (_, i) => n - i).map((x, i) => chip(x, k0, i >= r ? "" : "k1", { d: i, add: i >= r ? [k1, "strike"] : null })).join("<i>×</i>");
    const bot = Array.from({ length: r }, (_, i) => r - i).map((x, i) => chip(x, k0, "k2", { d: i })).join("<i>×</i>") + "<b>·</b>" + Array.from({ length: n - r }, (_, i) => n - r - i).map((x, i) => chip(x, k0, "", { d: i + r, add: [k1, "strike"] })).join("<i>×</i>");
    return R(S, `<div class="frac-h"><div class="lt tight">${top}</div><hr><div class="lt tight">${bot}</div></div>${eq(`= <b>${v}</b>`, k2, "k1")}`);
  };

  B.npr = ({ n, r, word }) => {
    const S = Scene(), slots = word ? n : r, v = E().fact(n) / E().fact(n - slots);
    const k0 = S.step(word ? `${word} has ${n} different letters. Fill ${n} spaces, one letter in each.` : `Fill ${r} places in order, choosing from ${n} things.`);
    const ks = Array.from({ length: slots }, (_, i) => S.step(i === 0 ? `The first place has ${n} choices.` : `The next has ${n - i} (one fewer, because ${i === 1 ? "one is" : i + " are"} used).`));
    S.step(`Multiply: $${Array.from({ length: slots }, (_, i) => n - i).join(" \\times ")} = ${v}$.`);
    const h = Array.from({ length: slots }, (_, i) => `<div class="slot"${A(k0, { d: i })}><b${A(ks[i])}>${n - i}</b>${word ? `<small${A(ks[i])}>${word[i]}</small>` : ""}</div>`).join(`<i class="x"${A(ks[1] != null ? ks[1] : k0)}>×</i>`);
    return R(S, `<div class="slots">${h}</div>${eq(`= <b>${IN(v)}</b>`, S.caps.length - 1, "k1")}`);
  };

  function pascalRows(n, k0, step, hl) {
    let h = "";
    for (let row = 0; row <= n; row++) {
      const k = row < 2 ? k0 : step(row);
      h += `<div class="pas-r"${A(k)}>${Array.from({ length: row + 1 }, (_, j) => chip(E().nCr(row, j), k, row === n && j === hl.j ? "k1" : "", { d: j, h: row === n && j === hl.j ? hl.k : null })).join("")}</div>`;
    }
    return `<div class="pas">${h}</div>`;
  }
  B.pascal = ({ n, k, a }) => {
    const S = Scene(), C = E().nCr(n, k);
    const k0 = S.step(`Pascal's triangle gives the binomial coefficients. Start with 1, then 1 1.`);
    const rows = {};
    for (let r = 2; r <= n; r++) rows[r] = S.step(r === 2 ? `Each number is the sum of the two above it.` : `Row ${r}.`);
    const kH = S.step(`Row ${n}, position ${k} (counting from 0) is $\\binom{${n}}{${k}} = ${C}$.`);
    S.step(`The $x^{${k}}$ term is $\\binom{${n}}{${k}}(${a}x)^{${k}}$, so the coefficient is $${C} \\times ${par(a)}^{${k}} = ${C} \\times ${par(a ** k)} = ${C * a ** k}$.`);
    return R(S, pascalRows(n, k0, (r) => rows[r], { j: k, k: kH }));
  };

  B.coin = ({ n, k }) => {
    const S = Scene(), C = E().nCr(n, k), tot = 2 ** n;
    const k0 = S.step(`${n} tosses, each heads or tails: $2^{${n}} = ${tot}$ equally likely outcomes.`);
    const k1 = S.step(`Row ${n} of Pascal's triangle counts the ways to get 0, 1, 2, … heads.`);
    const k2 = S.step(`There ${C === 1 ? "is" : "are"} ${C} way${C === 1 ? "" : "s"} to get exactly ${k} head${k === 1 ? "" : "s"}.`);
    S.step(`$P = \\frac{${C}}{${tot}}${Hp().frac(C, tot) === `\\frac{${C}}{${tot}}` ? "" : ` = ${Hp().frac(C, tot)}`}$`);
    const mx = E().nCr(n, Math.floor(n / 2));
    const bars = Array.from({ length: n + 1 }, (_, j) => { const c = E().nCr(n, j); return `<div class="cb${j === k ? " me" : ""}"${A(k1, { d: j, h: j === k ? k2 : null, add: j !== k ? [k2, "dim"] : null })}><b>${c}</b><i style="height:${(c / mx) * 90}px"></i><small>${j}H</small></div>`; }).join("");
    return R(S, `<div class="cbars"${A(k0)}>${bars}</div>${eq(`${C} out of ${tot}`, k2 + 1, "k1")}`);
  };

  B.gp = ({ a, r, n }) => {
    const S = Scene(), terms = Array.from({ length: n }, (_, i) => a * r ** i), Sn = terms.reduce((x, y) => x + y, 0);
    const k0 = S.step(`Start with $a = ${a}$.`);
    const k1 = S.step(`Each term is ${r} times the one before.`);
    const k2 = S.step(`Add all ${n} terms: $${terms.join(" + ")} = ${Sn}$.`);
    S.step(`The formula gives the same: $\\frac{${a}(${r}^{${n}} - 1)}{${r} - 1} = ${Sn}$.`);
    let h = "";
    terms.forEach((t, i) => { h += `<div class="seq-b${i ? "" : " k1"}"${A(i ? k1 : k0, { d: i, h: k2 })}><b>${IN(t)}</b></div>`; if (i < n - 1) h += `<span class="seq-a"${A(k1, { d: i })}>×${r}</span>`; });
    return R(S, `<div class="seq wrap">${h}</div>${eq(`Sum = <b>${IN(Sn)}</b>`, k2, "k1")}`);
  };

  B.limit = ({ kind, a, c, n }) => {
    const S = Scene();
    let f, x0, x1, hx, hy, label;
    if (kind === 0) { f = (x) => x + a; hx = a; hy = 2 * a; x0 = a - 4; x1 = a + 4; label = `y = (x² − ${a * a}) ÷ (x ${a < 0 ? "+" : "−"} ${Math.abs(a)})`; }
    else if (kind === 1) { f = (x) => (Math.abs(x) < 1e-9 ? NaN : Math.sin(c * x) / x); hx = 0; hy = c; x0 = -Math.PI / c * 2.2; x1 = -x0; label = `y = sin ${c}x ÷ x`; }
    else { f = (x) => { let s = 0; for (let i = 0; i < n; i++) s += x ** i * a ** (n - 1 - i); return s; }; hx = a; hy = n * a ** (n - 1); x0 = a - 2; x1 = a + 2; label = `y = (xⁿ − aⁿ) ÷ (x − a)`; }
    const [y0, y1] = autoY(f, x0, x1, [hy, 0]);
    const pl = plane({ x0, x1, y0, y1, lx: "x", ly: "y" });
    const k0 = S.step(`At $x = ${hx}$ the formula gives $\\frac{0}{0}$: there is a hole in the graph.`);
    const k1 = S.step(`Walk along the graph towards $x = ${hx}$ from the left…`);
    const k2 = S.step(`…and from the right. Both sides head to the same height.`);
    S.step(`That height is the limit: ${hy}.`);
    let g = pl.fn(f, k0, "k1 thick") + `<circle cx="${r1(pl.X(hx))}" cy="${r1(pl.Y(hy))}" r="5" class="hole"${A(k0)}/>`;
    const L = (x1 - x0) / 2;
    [0.8, 0.5, 0.25, 0.1].forEach((t, i) => { g += Ci(pl.X(hx - t * L), pl.Y(f(hx - t * L)), 4, k1, "dot k2", { d: i }); g += Ci(pl.X(hx + t * L), pl.Y(f(hx + t * L)), 4, k2, "dot k3", { d: i }); });
    g += Ln(pl.X(x0), pl.Y(hy), pl.X(x1), pl.Y(hy), k2 + 1, "k4 dash") + T(pl.W - 14, pl.Y(hy) + (f(x1) > hy ? 12 : -10), `limit ${nm(hy)}`, k2 + 1, "k4 b", { a: "end" });
    return R(S, pl.svg(g) + eq(label, k0, "k1 sm"));
  };

  B.deriv = ({ a, n, b, m, c, k }) => {
    const S = Scene(), f = (x) => a * x ** n + b * x ** m + c, d = a * n * k ** (n - 1) + b * m * k ** (m - 1), fk = f(k);
    const x0 = k - 2.5, x1 = k + 2.5, [y0, y1] = autoY(f, x0, x1);
    const pl = plane({ x0, x1, y0, y1, lx: "x", ly: "y" });
    const k0 = S.step(`This is the graph of $f(x) = ${Hp().terms([[a, Hp().pw("x", n)], [b, Hp().pw("x", m)], [c, ""]])}$.`);
    const k1 = S.step(`$f'(${k})$ is the slope of the graph at $x = ${k}$.`);
    const k2 = S.step(`The tangent line just touches the curve there. Its slope is $f'(${k}) = ${d}$.`);
    let g = pl.fn(f, k0, "k1 thick") + pl.pt(k, fk, k1, "k3", `x = ${nm(k)}`, { r: 5.5 });
    g += pl.fn((x) => fk + d * (x - k), k2, "k2 thick", { a: k - 1.6, b: k + 1.6 }) + T(pl.W - 14, 20, `slope ${nm(d)}`, k2, "k2 b", { a: "end" });
    return R(S, pl.svg(g));
  };

  B.dexpr = ({ A: a, n, B: b, trig, C }) => {
    const t = Hp().terms, pw = Hp().pw, other = trig === "sin" ? "cos" : "sin", s = trig === "sin" ? 1 : -1;
    const rows = [[t([[a, pw("x", n)]]), t([[a * n, pw("x", n - 1)]]), `Power rule: bring the power ${n} down and reduce it by 1.`], [t([[b, `\\${trig} x`]]), t([[s * b, `\\${other} x`]]), trig === "sin" ? `$\\sin x$ differentiates to $\\cos x$.` : `$\\cos x$ differentiates to $-\\sin x$.`]];
    if (C) rows.push([t([[C, "e^x"]]), t([[C, "e^x"]]), `$e^x$ is its own derivative.`]);
    return termmap(rows, `Differentiate one term at a time.`, [t([[a * n, pw("x", n - 1)], [s * b, `\\${other} x`], [C, "e^x"]]), `Put the pieces back together.`]);
  };

  B.indef = ({ A: a, n, m, B: b, trig }) => {
    const t = Hp().terms, pw = Hp().pw, other = trig === "sin" ? "cos" : "sin", s = trig === "cos" ? 1 : -1;
    return termmap([
      [t([[a, pw("x", n)]]), t([[m, pw("x", n + 1)]]), `Raise the power by 1 to ${n + 1}, then divide by ${n + 1}: $${a} \\div ${n + 1} = ${m}$.`],
      [t([[b, `\\${trig} x`]]), t([[s * b, `\\${other} x`]]), trig === "sin" ? `$\\sin x$ integrates to $-\\cos x$.` : `$\\cos x$ integrates to $\\sin x$.`],
    ], `Integrate one term at a time.`, [`${t([[m, pw("x", n + 1)], [s * b, `\\${other} x`]])} + C`, `Add one constant $C$ at the end.`]);
  };

  B.partial = ({ a, b, p, q, wrt }) => {
    const t = Hp().terms, isx = wrt === "x", v = isx ? 2 * a * p * q + b * q * q : a * p * p + 2 * b * p * q;
    const rows = isx
      ? [[t([[a, "x^2y"]]), t([[2 * a, "xy"]]), `$y$ is a constant: $x^2 \\to 2x$.`], [t([[b, "xy^2"]]), t([[b, "y^2"]]), `$y^2$ is a constant: $x \\to 1$.`]]
      : [[t([[a, "x^2y"]]), t([[a, "x^2"]]), `$x^2$ is a constant: $y \\to 1$.`], [t([[b, "xy^2"]]), t([[2 * b, "xy"]]), `$x$ is a constant: $y^2 \\to 2y$.`]];
    return termmap(rows, `To find $f_${wrt}$, freeze the other letter: treat ${isx ? "$y$" : "$x$"} as a fixed number.`, [`f_${wrt}(${p}, ${q}) = ${v}`, `Now put $x = ${p}$ and $y = ${q}$: $f_${wrt} = ${v}$.`]);
  };

  B.maxmin = ({ a, h, k }) => {
    const S = Scene(), f = (x) => a * (x - h) ** 2 + k, x0 = h - 4, x1 = h + 4, [y0, y1] = autoY(f, x0, x1, [k - 1]);
    const pl = plane({ x0, x1, y0, y1, lx: "x", ly: "y" });
    const k0 = S.step(`The graph is a U shape (the $x^2$ coefficient is positive).`);
    const k1 = S.step(`At the bottom of the U the graph is flat: slope 0, so $f'(x) = 0$ there. That happens at $x = ${h}$.`);
    const k2 = S.step(`The lowest point is $(${h}, ${k})$: the minimum value is ${k}.`);
    let g = pl.fn(f, k0, "k1 thick") + pl.fn(() => k, k1, "k2 thick", { a: h - 1.5, b: h + 1.5 }) + T(pl.X(h + 1.5) + 4, pl.Y(k) - 6, "slope 0", k1, "k2 sm", { a: "start" });
    g += pl.pt(h, k, k2, "k3", `(${nm(h)}, ${nm(k)})`, { r: 6, dy: 18 });
    return R(S, pl.svg(g));
  };

  B.integral = ({ al, be, c, k }) => {
    const S = Scene(), g_ = (x) => 3 * al * x * x + 2 * be * x + c, F = (x) => al * x ** 3 + be * x * x + c * x, v = F(k);
    const x0 = -0.6, x1 = k + 0.8, [y0, y1] = autoY(g_, x0, x1, [0]);
    const pl = plane({ x0, x1, y0, y1, lx: "x", ly: "y" });
    const k0 = S.step(`The integral from 0 to ${k} is the area under the graph between those $x$ values (area below the axis counts as negative).`);
    const k1 = S.step(`Find $F(x) = ${Hp().terms([[al, "x^3"], [be, "x^2"], [c, "x"]])}$, whose derivative is the curve.`);
    const k2 = S.step(`Area $= F(${k}) - F(0) = ${v} - 0 = ${v}$.`);
    let d = `M${r1(pl.X(0))} ${r1(pl.Y(0))}`;
    for (let i = 0; i <= 60; i++) { const x = (k * i) / 60; d += `L${r1(pl.X(x))} ${r1(pl.Y(g_(x)))}`; }
    d += `L${r1(pl.X(k))} ${r1(pl.Y(0))}Z`;
    let g = P(d, k0, "f1") + pl.fn(g_, null, "k1 thick", { draw: false }) + T(pl.X(k / 2), pl.Y(0) + (g_(k / 2) > 0 ? -16 : 16), `${v}`, k2, "k3 big");
    g += Ln(pl.X(k), pl.Y(y0), pl.X(k), pl.Y(y1), k0, "k2 dash");
    return R(S, pl.svg(g) + eq(`F(x) = ${plain(Hp().terms([[al, "x^3"], [be, "x^2"], [c, "x"]]))}`, k1, "k2 sm"));
  };

  B.deorder = ({ o, p, q, tail }) => {
    const D = (k) => (k === 1 ? "\\frac{dy}{dx}" : `\\frac{d^{${k}}y}{dx^{${k}}}`);
    const Pw = (s, e, hi) => (e === 1 ? (hi ? hc(0, s) : s) : `\\left(${hi ? hc(0, s) : s}\\right)^{${hi ? hc(1, e) : e}}`);
    const eqn = (hi) => (o >= 2 ? `${Pw(D(o), p, hi)} + ${Pw(D(o - 1), q)} ${tail} = 0` : `${Pw(D(1), p, hi)} + y^{${q}} = x`);
    return chainOf([
      [eqn(true), `The highest derivative is $${D(o)}$ (shown in purple): order ${o}.`],
      [`\\text{order} = ${hc(0, o)},\\quad \\text{degree} = ${hc(1, p)}`, `It is raised to the power ${p} (orange): degree ${p}.`],
    ], [eqn(false), `Order: the highest derivative. Degree: the power of that derivative.`]);
  };

  B.det2 = ({ a, b, c, d }) => {
    const S = Scene();
    const k0 = S.step(`Write out the matrix.`);
    const k1 = S.step(`Multiply down the main diagonal: $${par(a)} \\times ${par(d)} = ${a * d}$.`);
    const k2 = S.step(`Multiply the other diagonal: $${par(b)} \\times ${par(c)} = ${b * c}$.`);
    S.step(`Determinant $= ${a * d} - ${par(b * c)} = ${a * d - b * c}$.`);
    let g = P("M110 26 L100 26 L100 124 L110 124", k0, "ln thick") + P("M210 26 L220 26 L220 124 L210 124", k0, "ln thick");
    g += T(130, 50, nm(a), k0, "big", { h: k1 }) + T(190, 50, nm(b), k0, "big", { h: k2 }) + T(130, 100, nm(c), k0, "big", { h: k2 }) + T(190, 100, nm(d), k0, "big", { h: k1 });
    g += Ln(116, 36, 204, 114, k1, "k1 thick5", { draw: true }) + Ln(204, 36, 116, 114, k2, "k2 thick5", { draw: true });
    g += T(70, 150, `${nm(a)} × ${nm(d)} = ${nm(a * d)}`, k1, "k1 b") + T(250, 150, `${nm(b)} × ${nm(c)} = ${nm(b * c)}`, k2, "k2 b");
    g += T(160, 176, `${nm(a * d)} − ${b * c < 0 ? `(${nm(b * c)})` : nm(b * c)} = ${nm(a * d - b * c)}`, k2 + 1, "k3 big");
    return R(S, svg(320, 190, g));
  };

  const mat = (M, k, idFn) => `<div class="mat">${M.map((row, i) => row.map((v, j) => { const o = idFn ? idFn(i, j) : {}; return cel(nm(v), o.k != null ? o.k : k, o.cls || "", o); }).join("")).join("")}</div>`;
  B.matmul = ({ A: Am, B: Bm }) => {
    const S = Scene(), AB = [[0, 0], [0, 0]].map((r, i) => r.map((_, j) => Am[i][0] * Bm[0][j] + Am[i][1] * Bm[1][j]));
    const k0 = S.step(`Each entry of $AB$ is a row of $A$ times a column of $B$.`);
    const ks = {}, pos = ["top-left", "top-right", "bottom-left", "bottom-right"];
    [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(([i, j], n) => { ks[`${i}${j}`] = S.step(`${cap(pos[n])}: row ${i + 1} × column ${j + 1} $= ${par(Am[i][0])} \\cdot ${par(Bm[0][j])} + ${par(Am[i][1])} \\cdot ${par(Bm[1][j])} = ${AB[i][j]}$`); });
    S.step(`So $AB$ is complete.`);
    const hA = (i) => [0, 1].map((j) => ks[`${i}${j}`]), hB = (j) => [0, 1].map((i) => ks[`${i}${j}`]);
    const h = `<div class="mm">${mat(Am, k0, (i) => ({ h: hA(i), cls: "k1s" }))}<b>×</b>${mat(Bm, k0, (i, j) => ({ h: hB(j), cls: "k2s" }))}<b>=</b>${mat(AB, k0, (i, j) => ({ k: ks[`${i}${j}`], cls: "k3" }))}</div>`;
    return R(S, h);
  };

  B.dot = ({ a, b }) => {
    const S = Scene(), pr = a.map((x, i) => x * b[i]), v = pr.reduce((x, y) => x + y, 0);
    const k0 = S.step(`Line up matching components.`);
    const ks = pr.map((p, i) => S.step(`$${par(a[i])} \\times ${par(b[i])} = ${p}$`));
    S.step(`Add them: $${pr.map(par).join(" + ")} = ${v}$.`);
    let h = cel(tx("\\vec a"), k0, "vh k1") + cel(tx("\\vec b"), k0, "vh k2") + cel("product", k0, "vh");
    a.forEach((x, i) => { h += cel(nm(x), k0, "k1", { h: ks[i] }) + cel(nm(b[i]), k0, "k2", { h: ks[i] }) + cel(nm(pr[i]), ks[i], "k3 b", { h: ks.length + 1 }); });
    return R(S, grid("1fr 1fr 1fr", h, "tbl") + eq(`sum = <b>${nm(v)}</b>`, ks.length + 1, "k1"));
  };

  B.vecmag = ({ a, b, c, m }) => {
    const S = Scene(), sq = [a, b, c].map((x) => x * x);
    const k0 = S.step(`The magnitude is the length of the arrow: $\\sqrt{a^2 + b^2 + c^2}$ (Pythagoras in 3D).`);
    const k1 = S.step(`Square each component.`);
    const k2 = S.step(`Add: $${sq.join(" + ")} = ${m * m}$.`);
    S.step(`$|\\vec v| = \\sqrt{${m * m}} = ${m}$`);
    let h = "";
    [a, b, c].forEach((x, i) => { h += cel(tx(`${["\\hat i", "\\hat j", "\\hat k"][i]}: ${x}`), k0, `k${i + 1}`) + cel(`${nm(x)}² = ${sq[i]}`, k1, "b", { d: i, h: k2 }); });
    return R(S, grid("1fr 1fr", h, "tbl") + eq(`√${m * m} = <b>${m}</b>`, k2 + 1, "k1"));
  };

  B.cond = ({ a, b }) => {
    const S = Scene();
    const k0 = S.step(`Think of all outcomes as 10 equal strips (each is 0.1).`);
    const k1 = S.step(`$B$ happens in ${b} of them ($P(B) = ${b / 10}$).`);
    const k2 = S.step(`$A$ and $B$ both happen in ${a} of those ($P(A \\cap B) = ${a / 10}$).`);
    const k3 = S.step(`We know $B$ happened, so only $B$'s ${b} strips count. $A$ is ${a} of them.`);
    S.step(`$P(A \\mid B) = \\frac{${a}}{${b}}${Hp().frac(a, b) === `\\frac{${a}}{${b}}` ? "" : ` = ${Hp().frac(a, b)}`}$`);
    const h = Array.from({ length: 10 }, (_, i) => `<i${A(k0, { d: i, add: i < b ? (i < a ? [k2, "f1x"] : [k1, "f2x"]) : [k3, "dim"] })}${i < b ? ` data-h="${k1}"` : ""}>${i < a ? `<small${A(k2)}>A∩B</small>` : i < b ? `<small${A(k1)}>B</small>` : ""}</i>`);
    return R(S, `<div class="strips">${h.join("")}</div>${eq(`${a} out of ${b}`, k3, "k1")}`);
  };

  B.lpp = ({ pts, A: a, B: b }) => {
    const S = Scene(), Z = pts.map(([x, y]) => a * x + b * y), mx = Math.max(...Z), im = Z.indexOf(mx);
    const X1 = Math.max(...pts.map((p) => p[0])) + 1.5, Y1 = Math.max(...pts.map((p) => p[1])) + 1.5;
    const pl = plane({ x0: -0.8, x1: X1, y0: -0.8, y1: Y1, lx: "x", ly: "y" });
    const k0 = S.step(`The feasible region is the shaded shape. Its corners are where the maximum must be.`);
    const ks = pts.map(([x, y], i) => S.step(`$Z(${x}, ${y}) = ${a} \\times ${x} + ${b} \\times ${y} = ${Z[i]}$`));
    S.step(`The biggest is ${mx} at $(${pts[im].join(", ")})$.`);
    let g = Poly(pts.map(([x, y]) => [pl.X(x), pl.Y(y)]), k0, "f1 ln thick");
    pts.forEach(([x, y], i) => { g += pl.pt(x, y, ks[i], i === im ? "k3" : "k2", `${Z[i]}`, { r: 5.5, dy: y > Y1 / 2 ? -12 : 16, dx: x > X1 / 2 ? 14 : -14, h: i === im ? ks.length + 1 : null }); });
    return R(S, pl.svg(g));
  };

  B.modpow = ({ a, k, p }) => {
    const S = Scene(), Q = Math.floor(k / (p - 1)), r = k % (p - 1), pows = [];
    for (let i = 1, cur = 1; i <= p - 1; i++) { cur = (cur * a) % p; pows.push(cur); }
    const k0 = S.step(`List the powers of ${a}, keeping only the remainder after dividing by ${p}.`);
    const k1 = S.step(`$${a}^{${p - 1}}$ leaves remainder 1 (Fermat's little theorem), so the pattern repeats every ${p - 1} powers.`);
    const k2 = S.step(`$${k} = ${p - 1} \\times ${Q} + ${r}$: after ${Q} full cycles, ${r} more step${r === 1 ? "" : "s"}.`);
    S.step(`So $${a}^{${k}}$ leaves the same remainder as $${a}^{${r || p - 1}}$: ${pows[(r || p - 1) - 1]}.`);
    let h = "";
    pows.forEach((v, i) => { h += cel(`${a}<sup>${i + 1}</sup>`, k0, "vh", { d: i }); });
    pows.forEach((v, i) => { h += cel(v, k0, i === p - 2 ? "k2" : "", { d: i, h: [i === p - 2 ? k1 : null, i === (r || p - 1) - 1 ? k2 + 1 : null].filter((x) => x != null) }); });
    return R(S, grid(`repeat(${p - 1}, 1fr)`, h, "tbl mp"));
  };

  B.modinv = ({ a, p }) => {
    const S = Scene(), list = Array.from({ length: p - 1 }, (_, i) => ((i + 1) * a) % p), x = list.indexOf(1) + 1;
    const k0 = S.step(`Try $x = 1, 2, 3, \\ldots$: work out $${a}x$ and its remainder when divided by ${p}.`);
    const k1 = S.step(`We want remainder 1. It happens at $x = ${x}$: $${a} \\times ${x} = ${a * x} = ${p} \\times ${(a * x - 1) / p} + 1$.`);
    let h = cel("x", k0, "vh") + list.map((_, i) => cel(i + 1, k0, "vh", { d: i, h: i + 1 === x ? k1 : null })).join("");
    h += cel(`${a}x mod ${p}`, k0, "vh") + list.map((v, i) => cel(v, k0, v === 1 ? "k3" : "", { d: i, h: v === 1 ? k1 : null, add: v !== 1 ? [k1, "dim"] : null })).join("");
    return R(S, grid(`auto repeat(${p - 1}, 1fr)`, h, "tbl mp sm"));
  };

  B.graph = ({ mode, n, degs }) => {
    const S = Scene(), cx = 160, cy = 110, Rr = 86;
    if (mode === "kn") {
      const V = Array.from({ length: n }, (_, i) => [cx + Rr * Math.sin((2 * Math.PI * i) / n), cy - Rr * Math.cos((2 * Math.PI * i) / n)]);
      const k0 = S.step(`$K_{${n}}$ has ${n} vertices, and every pair is joined.`);
      let g = "", run = 0;
      for (let i = 0; i < n - 1; i++) {
        run += n - 1 - i;
        const k = S.step(i === 0 ? `Vertex 1 joins the other ${n - 1}: ${n - 1} edges.` : `Vertex ${i + 1} joins ${n - 1 - i} new ones: ${run} so far.`);
        for (let j = i + 1; j < n; j++) g += Ln(V[i][0], V[i][1], V[j][0], V[j][1], k, `k${(i % 4) + 1} thin`);
      }
      S.step(`$${Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(" + ")} = \\frac{${n} \\times ${n - 1}}{2} = ${run}$ edges.`);
      V.forEach(([x, y], i) => { g += Ci(x, y, 7, k0, "dot k0", { d: i }); });
      return R(S, svg(320, 220, g));
    }
    const nV = degs.length, V = degs.map((_, i) => [cx + Rr * Math.sin((2 * Math.PI * i) / nV), cy - Rr * Math.cos((2 * Math.PI * i) / nV)]), sum = degs.reduce((x, y) => x + y, 0);
    const k0 = S.step(`Each vertex is labelled with its degree: how many edge ends touch it.`);
    const k1 = S.step(`Every edge has exactly two ends.`);
    const k2 = S.step(`Count all the ends: $${degs.join(" + ")} = ${sum}$.`);
    S.step(`Two ends per edge: $${sum} \\div 2 = ${sum / 2}$ edges.`);
    let g = Ln(40, 214, 90, 214, k1, "k2 thick5") + Ci(40, 214, 5, k1, "dot k3") + Ci(90, 214, 5, k1, "dot k3") + T(100, 214, "1 edge = 2 ends", k1, "k2 sm", { a: "start" });
    V.forEach(([x, y], i) => {
      const ang = Math.atan2(y - cy, x - cx);
      for (let s = 0; s < degs[i]; s++) { const t = ang + (s - (degs[i] - 1) / 2) * 0.32; g += Ln(x, y, x - 22 * Math.cos(t), y - 22 * Math.sin(t), k2, "k3 thick", { d: i }); }
      g += Ci(x, y, 12, k0, "f0 ln thick", { d: i }) + T(x, y, degs[i], k0, "b", { d: i });
    });
    return R(S, svg(320, 230, g));
  };

  B.zscore = ({ mu, sd, z, x }) => {
    const S = Scene(), X = (v) => 160 + ((v - mu) / sd) * 44, Y = (u) => 150 - 110 * Math.exp(-(u * u) / 2);
    let d = "";
    for (let i = 0; i <= 120; i++) { const u = -3.4 + (6.8 * i) / 120; d += `${i ? "L" : "M"}${r1(160 + u * 44)} ${r1(Y(u))}`; }
    const k0 = S.step(`Scores spread out around the mean ${mu}. Each step of ${sd} is one standard deviation (σ).`);
    const k1 = S.step(`Mark the score ${x}: it is $${x} - ${mu} = ${nm(x - mu)}$ from the mean.`);
    const k2 = S.step(`Count the σ steps: $${nm(x - mu)} \\div ${sd} = ${z}$.`);
    S.step(`So $z = ${z}$: ${Math.abs(z)} standard deviation${Math.abs(z) === 1 ? "" : "s"} ${z < 0 ? "below" : "above"} the mean.`);
    let g = Ln(10, 150, 310, 150, null, "ax") + P(d, null, "k1 thick") + P(d + `L${r1(160 + 3.4 * 44)} 150L${r1(160 - 3.4 * 44)} 150Z`, null, "f1");
    for (let j = -3; j <= 3; j++) g += Ln(X(mu + j * sd), 146, X(mu + j * sd), 154, k0, "ln thin") + T(X(mu + j * sd), 166, nm(mu + j * sd), k0, j ? "tk" : "b");
    g += Ln(160, 150, 160, Y(0), k0, "k2 dash");
    g += Ln(X(x), 150, X(x), Y(z), k1, "k4 thick5", { draw: true }) + T(X(x), Y(z) - 10, `${x}`, k1, "k4 b");
    const steps = Math.ceil(Math.abs(z)), dir = Math.sign(z);
    for (let i = 0; i < steps; i++) { const from = mu + dir * i * sd, to = mu + dir * Math.min(Math.abs(z), i + 1) * sd; g += Hop(X(from), X(to), 182, false, k2, "k3", null, { d: i }); }
    g += T(160, 214, `z = ${z}`, k2, "k3 big");
    return R(S, svg(320, 226, g));
  };

  B.eigen = ({ a, b }) => chainOf([
    [`\\det\\begin{bmatrix} ${a} - ${hc(0, "\\lambda")} & ${b} \\\\ ${b} & ${a} - ${hc(0, "\\lambda")} \\end{bmatrix} = 0`, `Take $\\lambda$ off the diagonal and set the determinant to 0.`],
    [`(${a} - ${hc(0, "\\lambda")})^2 - ${par(b)}^2 = 0`, `Determinant: diagonal product minus the other diagonal.`],
    [`${a} - ${hc(0, "\\lambda")} = \\pm ${Math.abs(b)}`, `So $(${a} - \\lambda)^2 = ${b * b}$, and square-rooting gives $\\pm ${Math.abs(b)}$.`],
    [`${hc(0, "\\lambda")} = ${hc(2, a - Math.abs(b))} \\text{ or } ${hc(2, a + Math.abs(b))}`, `The eigenvalues are ${a - Math.abs(b)} and ${a + Math.abs(b)}.`],
  ], [`A = \\begin{bmatrix} ${a} & ${b} \\\\ ${b} & ${a} \\end{bmatrix}`, `Eigenvalues solve $\\det(A - \\lambda I) = 0$.`]);

  B.ode2 = ({ b, c, r1: m1, r2: m2, rep }) => {
    const t = Hp().terms, ex = (r) => `e^{${r === 1 ? "" : r === -1 ? "-" : r}x}`, mm = (r) => `(m ${r < 0 ? "+" : "-"} ${Math.abs(r)})`;
    return chainOf([
      [`y = e^{${hc(0, "m")}x}\\ \\Rightarrow\\ ${t([[1, "m^2"], [b, "m"], [c, ""]])} = 0`, `Try $y = e^{mx}$: every derivative brings down an $m$, giving the auxiliary equation.`],
      [rep ? `${mm(m1)}^2 = 0` : `${mm(m1)}${mm(m2)} = 0`, `Factorise it.`],
      [rep ? `m = ${hc(1, m1)} \\text{ (twice)}` : `m = ${hc(1, m1)} \\text{ or } m = ${hc(1, m2)}`, rep ? `A repeated root.` : `Two different real roots.`],
      [rep ? `y = (C_1 + C_2x)${ex(m1)}` : `y = C_1${ex(m1)} + C_2${ex(m2)}`, rep ? `A repeated root needs the extra $x$: $y = (C_1 + C_2x)e^{mx}$.` : `Each root gives a solution; add them with constants.`],
    ], [`${t([[1, "y''"], [b, "y'"], [c, "y"]])} = 0`, `A second-order equation with constant coefficients.`]);
  };

  B.taylor = ({ kind, c, n, f, val }) => {
    const S = Scene(), fr = Hp().frac;
    let items, intro;
    if (kind === 0) { const u = c === 1 ? "x" : `(${c === -1 ? "-" : c}x)`; items = [0, 1, 2, 3, 4].map((j) => (j === 0 ? "1" : j === 1 ? u : `\\frac{${u}^{${j}}}{${j}!}`)); intro = `$e^{u} = 1 + u + \\frac{u^2}{2!} + \\frac{u^3}{3!} + \\cdots$ with $u = ${c === 1 ? "" : c === -1 ? "-" : c}x$.`; }
    else if (kind === 1) { items = f === "sin" ? ["x", "-\\frac{x^3}{3!}", "+\\frac{x^5}{5!}", "-\\frac{x^7}{7!}"] : ["1", "-\\frac{x^2}{2!}", "+\\frac{x^4}{4!}", "-\\frac{x^6}{6!}"]; intro = `The series for $\\${f} x$ has only ${f === "sin" ? "odd" : "even"} powers, with alternating signs.`; }
    else if (kind === 2) { items = [1, 2, 3, 4, 5, 6].map((j) => `${j === 1 ? "" : j % 2 ? "+" : "-"}\\frac{x^{${j}}}{${j}}`); intro = `$\\ln(1 + x)$: each power is divided by itself, and the signs alternate.`; }
    else { items = [0, 1, 2, 3, 4].map((j) => (j === 0 ? "1" : `(${c}x)^{${j}}`)); intro = `Geometric series: $\\frac{1}{1 - u} = 1 + u + u^2 + \\cdots$ with $u = ${c}x$.`; }
    const idx = kind === 1 ? (f === "sin" ? (n - 1) / 2 : n / 2) : kind === 2 ? n - 1 : n;
    const k0 = S.step(intro);
    const k1 = S.step(`Find the $x^{${n}}$ term.`);
    S.step(`Its coefficient is $${val}$.`);
    const chips = items.map((s, i) => chip(tx(s), k0, i === idx ? "k1" : "", { d: i, h: i === idx ? [k1, k1 + 1] : null, add: i !== idx ? [k1, "dim"] : null })).join(kind === 0 || kind === 3 ? "<i>+</i>" : "");
    return R(S, `<div class="lt">${chips}<i>⋯</i></div>${eq(tx(`${val}`), k1 + 1, "k1 big")}`);
  };
  /* ================= NCERT extras ================= */
  B.pattern = ({ list, next }) => {
    const S = Scene(), d = list[1] - list[0];
    const k0 = S.step(`Here is the pattern: ${list.join(", ")}, …`);
    const k1 = S.step(`Find the gap between neighbours: each term is ${d} more than the one before.`);
    const k2 = S.step(`Use the rule once more: $${list[list.length - 1]} + ${d} = ${next}$.`);
    let h = "";
    list.forEach((v, i) => {
      if (i) h += `<i${A(k1, { d: i })}>+${d}</i>`;
      h += chip(v, k0, "big", { d: i });
    });
    h += `<i${A(k2)}>+${d}</i>` + chip(next, k2, "big k1", { h: k2 });
    return R(S, `<div class="lt">${h}</div>` + eq(`next term: <b>${next}</b>`, k2, "k1"));
  };

  B.picto = ({ rows, each, i, j }) => {
    const S = Scene();
    const k0 = S.step(`In this pictograph each symbol stands for ${each}.`);
    const ki = S.step(`${rows[i][0]}: count the symbols. There are ${rows[i][1]}, so $${rows[i][1]} \\times ${each} = ${rows[i][1] * each}$.`);
    let kj = null;
    if (j != null) {
      kj = S.step(`${rows[j][0]}: ${rows[j][1]} symbols, so $${rows[j][1]} \\times ${each} = ${rows[j][1] * each}$.`);
      S.step(`Difference: $${rows[i][1] * each} - ${rows[j][1] * each} = ${(rows[i][1] - rows[j][1]) * each}$.`);
    }
    let h = "";
    rows.forEach(([name, n, sym], r) => {
      const k = r === i ? ki : r === j ? kj : null;
      h += cel(name, k0, "vh", { h: k }) + cel(`<span class="pic">${Array.from({ length: n }, () => `<i>${sym}</i>`).join("")}</span>`, k0, "pic-c", { h: k, d: r });
      h += cel(k == null ? "" : n * each, k, "big k1");
    });
    return R(S, `<p class="pic-key"${A(k0)}>Key: <b>${rows[0][2]}</b> = ${each}</p>` + grid("auto 1fr auto", h, "tbl picto"));
  };

  const ANGLE_KIND = (a) => (a < 90 ? "acute" : a === 90 ? "right" : a < 180 ? "obtuse" : a === 180 ? "straight" : a < 360 ? "reflex" : "complete");
  B.angkind = ({ a }) => {
    const S = Scene(), cx = 160, cy = 104, L = 92, rad = (a * Math.PI) / 180, kind = ANGLE_KIND(a);
    const rule = { acute: "less than 90°", right: "exactly 90°", obtuse: "between 90° and 180°", straight: "exactly 180°", reflex: "between 180° and 360°", complete: "exactly 360°" }[kind];
    const k0 = S.step(`Start with one arm pointing right. Turn the other arm through ${a}°.`);
    const k1 = S.step(`Compare with the two benchmarks: a right angle is 90° (a quarter turn) and a straight angle is 180° (a half turn).`);
    const k2 = S.step(`${a}° is ${rule}, so it is ${/^[ao]/.test(kind) ? "an" : "a"} ${kind} angle.`);
    let g = Ln(cx, cy, cx + L, cy, k0, "k0 thick");
    g += Ln(cx, cy, cx + L * Math.cos(rad), cy - L * Math.sin(rad), k0, "k1 thick", { draw: true });
    g += a === 90 ? rightMark(cx, cy, 1, 0, 0, -1, 16, k0) : a >= 360 ? Ci(cx, cy, 30, k0, "f1 ln thin") : P(sector(cx, cy, 30, 0, rad), k0, "f1 ln thin");
    const mid = rad / 2, lr = a > 200 ? 46 : 52;
    g += T(cx + lr * Math.cos(mid), cy - lr * Math.sin(mid), `${a}°`, k0, "k1 b");
    g += Ln(cx, cy, cx, cy - L * 0.8, k1, "k3 dash") + T(cx + 6, cy - L * 0.8 - 8, "90°", k1, "k3 sm b", { a: "start" });
    g += Ln(cx, cy, cx - L * 0.8, cy, k1, "k4 dash") + T(cx - L * 0.8, cy + 14, "180°", k1, "k4 sm b");
    g += Ci(cx, cy, 4, k0, "dot k0");
    return R(S, svg(320, 210, g) + eq(`${a}° is <b>${kind}</b>`, k2, "k1"));
  };

  B.geofig = ({ kind }) => {
    const S = Scene(), y = 70, x0 = 60, x1 = 260;
    const D = (x, yy, k, lab, o) => Ci(x, yy, 4.5, k, "dot k1", o) + (lab ? T(x, yy - 14, lab, k, "k1 b") : "");
    const both = (xa, ya, xb, yb, k, cls) => Ln(xa, ya, xb, yb, k, cls || "k0 thick") + G(head(xb, yb, Math.atan2(yb - ya, xb - xa), "k0") + head(xa, ya, Math.atan2(ya - yb, xa - xb), "k0"), k);
    let g = "", cap1 = "", cap2 = "", name = "";
    if (kind === "segment") {
      g = Ln(x0, y, x1, y, 0, "k0 thick", { draw: true }) + D(x0, y, 0, "A") + D(x1, y, 0, "B");
      cap1 = "It starts at A and stops at B: two end points, so you can measure its length.";
      name = "a line segment, written $\\overline{AB}$";
    } else if (kind === "ray") {
      g = Ln(x0, y, x1, y, 0, "k0 thick", { draw: true }) + G(head(x1 + 6, y, 0, "k0"), 0) + D(x0, y, 0, "A") + D(170, y, 0, "B");
      cap1 = "It starts at A and goes on forever through B: one end point only.";
      name = "a ray, written $\\overrightarrow{AB}$";
    } else if (kind === "line") {
      g = both(x0 - 20, y, x1 + 20, y, 0) + D(110, y, 0, "A") + D(210, y, 0, "B");
      cap1 = "Arrows at both ends: it goes on forever both ways, with no end points.";
      name = "a line, written $\\overleftrightarrow{AB}$";
    } else if (kind === "parallel") {
      g = both(x0, 40, x1, 40, 0) + both(x0, 100, x1, 100, 0) + T(x1 + 18, 40, "l", 0, "i b") + T(x1 + 18, 100, "m", 0, "i b");
      g += Ln(120, 40, 120, 100, 1, "k3 dash") + Ln(200, 40, 200, 100, 1, "k3 dash") + T(160, 70, "same gap", 1, "k3 sm b");
      cap1 = "The gap between them is the same everywhere, so they never meet.";
      name = "parallel lines, written $l \\parallel m$";
    } else if (kind === "perpendicular") {
      g = both(x0, 100, x1, 100, 0) + both(160, 18, 160, 132, 0) + rightMark(160, 100, 1, 0, 0, -1, 14, 1) + T(178, 84, "90°", 1, "k3 b", { a: "start" });
      cap1 = "They cross and make a right angle, 90°.";
      name = "perpendicular lines, written $l \\perp m$";
    } else {
      g = both(70, 24, 250, 116, 0) + both(70, 116, 250, 24, 0) + D(160, 70, 1, "O");
      cap1 = "They cross at exactly one point, O, the point of intersection.";
      name = "intersecting lines";
    }
    S.step(`Look at the figure.`);
    S.step(cap1);
    S.step(`So it is ${name}.`);
    return R(S, svg(320, 142, g));
  };

  B.congr = ({ rule }) => {
    const S = Scene();
    const base = rule === "RHS" ? [[22, 120], [22, 26], [132, 120]] : [[18, 120], [70, 30], [138, 120]];
    const P2 = base.map(([x, y]) => [x + 164, y]);
    const names = [["A", "B", "C"], ["P", "Q", "R"]];
    const spec = { SSS: { s: [0, 1, 2], a: [] }, SAS: { s: [0, 2], a: [0] }, ASA: { s: [0], a: [0, 1] }, RHS: { s: [1, 2], a: [], r: 0 } }[rule];
    const said = {
      SSS: "all three sides are equal in pairs",
      SAS: "two sides and the angle between them are equal",
      ASA: "two angles and the side between them are equal",
      RHS: "both have a right angle, and the hypotenuse and one other side are equal",
    }[rule];
    const k0 = S.step(`Two triangles: △ABC and △PQR.`);
    const k1 = S.step(`Matching marks show equal parts: ${said}.`);
    S.step(`That is the ${rule} rule, so △ABC ≅ △PQR (they are congruent: same shape and same size).`);
    const draw = (pts, nm) => {
      let g = Poly(pts, k0, "f0 ln thick");
      pts.forEach((p, i) => {
        const c = pts.reduce((s, q) => [s[0] + q[0] / 3, s[1] + q[1] / 3], [0, 0]);
        const dx = p[0] - c[0], dy = p[1] - c[1], m = Math.hypot(dx, dy);
        g += T(p[0] + (dx / m) * 13, p[1] + (dy / m) * 13, nm[i], k0, "b");
      });
      spec.s.forEach((si, n) => {
        const p = pts[si], q = pts[(si + 1) % 3], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
        const ux = (q[0] - p[0]) / Math.hypot(q[0] - p[0], q[1] - p[1]), uy = (q[1] - p[1]) / Math.hypot(q[0] - p[0], q[1] - p[1]);
        g += Ln(p[0], p[1], q[0], q[1], k1, `k${n + 1} thick5`);
        for (let t = 0; t <= n; t++) {
          const ox = mx + ux * (t - n / 2) * 6, oy = my + uy * (t - n / 2) * 6;
          g += Ln(ox - uy * 6, oy + ux * 6, ox + uy * 6, oy - ux * 6, k1, `k${n + 1} thick`);
        }
      });
      const ang = (u, v) => Math.atan2(-(v[1] - u[1]), v[0] - u[0]);
      spec.a.forEach((vi, n) => {
        const p = pts[vi], q = pts[(vi + 1) % 3], r = pts[(vi + 2) % 3];
        let t0 = ang(p, q), t1 = ang(p, r), d = t1 - t0;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d <= -Math.PI) d += 2 * Math.PI;
        if (d < 0) { t0 = t1; d = -d; }
        g += P(sector(p[0], p[1], 18 + n * 4, t0, t0 + d), k1, `f${n + 3} ln thin`);
      });
      if (spec.r != null) {
        const p = pts[spec.r];
        g += rightMark(p[0], p[1], 1, 0, 0, -1, 12, k1);
      }
      return g;
    };
    return R(S, svg(320, 150, draw(base, names[0]) + draw(P2, names[1])) + eq(`rule: <b>${rule}</b>`, k1 + 1, "k1"));
  };

  B.triineq = ({ a, b, c }) => {
    const S = Scene();
    const s = [a, b].concat(c == null ? [] : [c]).sort((x, y) => x - y);
    const [p, q] = c == null ? [a, b] : [s[0], s[1]], big = c == null ? null : s[2];
    const sc = 250 / Math.max(p + q, big || 0), x0 = 35;
    const k0 = S.step(`Lay the two ${c == null ? "" : "shorter "}sides end to end: $${p} + ${q} = ${p + q}$.`);
    let g = Rc(x0, 30, p * sc, 18, k0, "f1 ln") + Rc(x0 + p * sc, 30, q * sc, 18, k0, "f2 ln");
    g += T(x0 + (p * sc) / 2, 39, p, k0, "b") + T(x0 + p * sc + (q * sc) / 2, 39, q, k0, "b");
    if (c == null) {
      S.step(`The third side must be shorter than ${p + q}, or the two ends could never meet to close the triangle.`);
      S.step(`It must also be longer than the difference $${Math.max(p, q)} - ${Math.min(p, q)} = ${Math.abs(p - q)}$.`);
      g += T(x0 + ((p + q) * sc) / 2, 72, `third side < ${p + q}`, 1, "k3 b") + T(x0 + ((p + q) * sc) / 2, 96, `third side > ${Math.abs(p - q)}`, 2, "k4 b");
      return R(S, svg(320, 112, g));
    }
    const ok = p + q > big;
    const k1 = S.step(`Compare with the longest side, ${big}.`);
    S.step(ok ? `$${p + q} > ${big}$, so the short sides reach past the long one: a triangle can be made.` : `$${p + q} \\le ${big}$, so the short sides can't reach to close the shape: no triangle.`);
    g += Rc(x0, 70, big * sc, 18, k1, "f3 ln") + T(x0 + (big * sc) / 2, 79, big, k1, "b");
    return R(S, svg(320, 104, g) + eq(ok ? "triangle: <b>yes</b>" : "triangle: <b>no</b>", k1 + 1, "k1"));
  };

  B.pie = ({ parts, i }) => {
    const S = Scene(), N = parts.reduce((s, p) => s + p[1], 0), cx = 110, cy = 100, Rr = 82;
    const k0 = S.step(`Add all the parts: $${parts.map((p) => p[1]).join(" + ")} = ${N}$.`);
    const k1 = S.step(`A full circle is $360^\\circ$, shared out in the same way as the ${N}.`);
    const deg = (parts[i][1] / N) * 360;
    S.step(`${parts[i][0]}: $\\frac{${parts[i][1]}}{${N}} \\times 360^\\circ = ${nm(deg)}^\\circ$.`);
    let g = "", t = Math.PI / 2;
    parts.forEach(([name, v], j) => {
      const w = (v / N) * 2 * Math.PI, mid = t - w / 2;
      g += P(sector(cx, cy, Rr, t - w, t), k1, `f${(j % 4) + 1} ln`, { h: j === i ? k1 + 1 : null });
      if (j === i) g += T(cx + Rr * 0.6 * Math.cos(mid), cy - Rr * 0.6 * Math.sin(mid), `${nm((v / N) * 360)}°`, k1 + 1, "b");
      g += Rc(212, 30 + j * 24, 12, 12, k0, `f${(j % 4) + 1} ln`) + T(232, 36 + j * 24, `${name} ${v}`, k0, j === i ? "k1 b" : "", { a: "start" });
      t -= w;
    });
    g = Ci(cx, cy, Rr, k0, "ln thick") + g;
    return R(S, svg(320, 200, g));
  };

  B.divis = ({ n, k, yes }) => {
    const S = Scene(), ds = String(n).split(""), sum = ds.reduce((s, d) => s + +d, 0), L = ds.length;
    const rule = { 2: "the last digit is even (0, 2, 4, 6 or 8)", 3: "the digit sum is divisible by 3", 4: "the number made by the last two digits is divisible by 4", 5: "the last digit is 0 or 5", 9: "the digit sum is divisible by 9", 10: "the last digit is 0" }[k];
    const k0 = S.step(`Rule for ${k}: a number is divisible by ${k} if ${rule}.`);
    let k1, mark;
    if (k === 3 || k === 9) { k1 = S.step(`Add the digits: $${ds.join(" + ")} = ${sum}$.`); mark = () => true; }
    else if (k === 4) { k1 = S.step(`The last two digits make ${+ds.slice(-2).join("")}.`); mark = (j) => j >= L - 2; }
    else { k1 = S.step(`The last digit is ${ds[L - 1]}.`); mark = (j) => j === L - 1; }
    S.step(`${yes ? "It passes the test" : "It fails the test"}, so ${n} is ${yes ? "" : "not "}divisible by ${k}.`);
    const h = ds.map((d, j) => cel(d, k0, `big${mark(j) ? " k1" : ""}`, { h: mark(j) ? k1 : null, add: mark(j) ? null : [k1, "dim"], d: j })).join("");
    const tail = k === 3 || k === 9 ? eq(`digit sum <b>${sum}</b>`, k1, "k1") : "";
    return R(S, grid(`repeat(${L}, auto)`, h, "pv") + tail);
  };

  B.invprop = ({ w1, d1, w2, unit, who }) => chainOf([
    [`${w1} \\times ${d1} = ${hc(0, w1 * d1)}`, `Find the total work: ${who} × ${unit}.`],
    [`\\frac{${hc(0, w1 * d1)}}{${w2}} = ${hc(2, (w1 * d1) / w2)}`, `Share the same total among ${w2} ${who}.`],
  ], [`${w1}\\ \\text{${who}} \\to ${d1}\\ \\text{${unit}}`, `More ${who} means fewer ${unit}: this is inverse proportion.`]);

  B.sector = ({ r, th, mode, val }) => {
    const S = Scene(), cx = 120, cy = 104, R0 = 78, rad = (th * Math.PI) / 180;
    const k0 = S.step(`A circle of radius ${r} cm. The sector has angle ${th}°.`);
    const k1 = S.step(`The sector is $\\frac{${th}}{360}$ of the whole circle.`);
    const k2 = S.step(mode === "area" ? `Area $= \\frac{${th}}{360} \\times \\pi r^2 = \\frac{${th}}{360} \\times \\frac{22}{7} \\times ${r}^2$.` : `Arc length $= \\frac{${th}}{360} \\times 2\\pi r = \\frac{${th}}{360} \\times 2 \\times \\frac{22}{7} \\times ${r}$.`);
    S.step(`$= ${nm(val)}$ ${mode === "area" ? "cm²" : "cm"}.`);
    let g = Ci(cx, cy, R0, k0, "ln thick");
    g += mode === "area" ? P(sector(cx, cy, R0, 0, rad), k1, "f1 ln thick") : P(arcPath(cx, cy, R0, 0, rad), k1, "k3 thick5", { draw: true });
    g += Ln(cx, cy, cx + R0, cy, k0, "k1 thick") + Ln(cx, cy, cx + R0 * Math.cos(rad), cy - R0 * Math.sin(rad), k0, "k1 thick");
    g += T(cx + R0 / 2, cy + 12, `r = ${r}`, k0, "k1 b") + T(cx + 24 * Math.cos(rad / 2), cy - 24 * Math.sin(rad / 2), `${th}°`, k0, "b");
    g += Ci(cx, cy, 3, k0, "dot k0") + T(270, 104, `${nm(val)} ${mode === "area" ? "cm²" : "cm"}`, k2 + 1, "k1 big");
    return R(S, svg(320, 208, g));
  };

  const IQ = { "<": "<", ">": ">", "<=": "\\le", ">=": "\\ge" };
  const FLIP = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
  B.ineq = ({ a, b, c, op, x }) => {
    const S = Scene(), res = a < 0 ? FLIP[op] : op;
    const lhs = `${a === 1 ? "" : a === -1 ? "-" : a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
    const k0 = S.step(`Solve $${lhs} ${IQ[op]} ${c}$ like an equation, keeping the sign.`);
    const k1 = S.step(`${b > 0 ? "Subtract" : "Add"} ${Math.abs(b)} on both sides: $${a === 1 ? "" : a === -1 ? "-" : a}x ${IQ[op]} ${c - b}$.`);
    const k2 = S.step(a < 0 ? `Divide by $${a}$. Dividing by a negative number flips the sign: $x ${IQ[res]} ${x}$.` : a === 1 ? `So $x ${IQ[res]} ${x}$.` : `Divide by ${a}: $x ${IQ[res]} ${x}$.`);
    const k3 = S.step(`On the number line: ${res.includes("=") ? "a filled dot (the number is included)" : "an open dot (the number is not included)"}, then shade ${res[0] === "<" ? "to the left" : "to the right"}.`);
    const X = (v) => 160 + (v - x) * 24, y = 70;
    let g = Ln(20, y, 300, y, k0, "ax thick");
    for (let v = x - 5; v <= x + 5; v++) g += Ln(X(v), y - 5, X(v), y + 5, k0, "ln thin") + T(X(v), y + 18, v, k0, v === x ? "b" : "tk");
    const left = res[0] === "<";
    g += Ar(X(x), y, left ? 20 : 300, y, k3, "k1 thick5");
    g += Ci(X(x), y, 6, k3, res.includes("=") ? "dot k1" : "hole");
    return R(S, svg(320, 100, g) + eq(tx(`x ${IQ[res]} ${x}`), k2, "k1"));
  };

  B.invtrig = ({ f, vt, ans, range, deg }) => chainOf([
    [`\\${f}^{-1}\\left(${vt}\\right) = \\theta \\iff \\${f}\\theta = ${vt}`, `Ask: which angle has $\\${f}\\theta = ${vt}$?`],
    [`\\theta \\in ${range}`, `It must lie in the principal value range of $\\${f}^{-1}$.`],
    [`\\theta = ${hc(2, ans)}\\ (= ${deg}^\\circ)`, `The only such angle is $${ans}$.`],
  ]);

  /* ---------- Player ---------- */
  function html(it) {
    if (!it || !it.viz || !B[it.viz.t] || !U()) return "";
    let r;
    try { r = B[it.viz.t](it.viz); } catch (e) { if (window.console) console.warn("viz", it.viz.t, e); return ""; }
    if (!r || !r.caps.length) return "";
    const { rich, icon } = U(), n = r.caps.length;
    return `<div class="vz" data-n="${n}">
      <div class="vz-stage">${r.html}</div>
      <div class="vz-caps" aria-live="polite">${r.caps.map((c, i) => `<p data-c="${i}"${i ? " hidden" : ""}>${rich(c)}</p>`).join("")}</div>
      <div class="vz-ctl">
        <button type="button" class="vz-b" data-v="prev" aria-label="Previous step">${icon("left")}</button>
        <button type="button" class="vz-b vz-play" data-v="play" aria-label="Play">${icon("play")}</button>
        <button type="button" class="vz-b" data-v="next" aria-label="Next step">${icon("right")}</button>
        <div class="vz-dots">${n <= 14 ? r.caps.map((_, i) => `<button type="button" data-d="${i}" aria-label="Step ${i + 1}"></button>`).join("") : ""}</div>
        <span class="vz-n">1 / ${n}</span>
      </div>
    </div>`;
  }

  function bind(v, auto) {
    if (v.dataset.on) return;
    v.dataset.on = "1";
    const { icon } = U(), n = +v.dataset.n;
    const els = [...v.querySelectorAll(".vz-stage [data-s]")].map((el) => {
      const a = (el.dataset.a || "").split(" ");
      return { el, s: +el.dataset.s, x: el.dataset.x != null ? +el.dataset.x : Infinity, h: (el.dataset.h || "").split(" ").filter(Boolean).map(Number), ak: a[0] ? +a[0] : null, ac: a.slice(1) };
    });
    const caps = [...v.querySelectorAll("[data-c]")], dots = [...v.querySelectorAll("[data-d]")];
    const playB = v.querySelector(".vz-play"), prevB = v.querySelector('[data-v="prev"]'), nextB = v.querySelector('[data-v="next"]'), cnt = v.querySelector(".vz-n");
    let k = 0, timer = 0, playing = false;
    function go(i) {
      k = Math.max(0, Math.min(n - 1, i));
      for (const p of els) {
        const on = p.s <= k && k < p.x;
        p.el.classList.toggle("on", on);
        p.el.classList.toggle("now", on && p.h.includes(k));
        if (p.ak != null) p.ac.forEach((c) => p.el.classList.toggle(c, k >= p.ak));
      }
      caps.forEach((c, j) => { c.hidden = j !== k; });
      dots.forEach((d, j) => { d.classList.toggle("on", j <= k); if (j === k) d.setAttribute("aria-current", "step"); else d.removeAttribute("aria-current"); });
      cnt.textContent = `${k + 1} / ${n}`;
      prevB.disabled = k === 0;
      nextB.disabled = k === n - 1;
      if (!playing) paintPlay();
    }
    function paintPlay() {
      const end = k >= n - 1 && !playing;
      playB.innerHTML = icon(playing ? "pause" : end ? "refresh" : "play");
      playB.setAttribute("aria-label", playing ? "Pause" : end ? "Replay" : "Play");
    }
    const delay = () => Math.max(1700, Math.min(5200, 1300 + caps[k].textContent.length * 38));
    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!v.isConnected) return stop();
        if (k >= n - 1) return stop();
        go(k + 1);
        if (k >= n - 1) stop(); else schedule();
      }, delay());
    }
    function play() { if (k >= n - 1) go(0); playing = true; paintPlay(); schedule(); }
    function stop() { playing = false; clearTimeout(timer); paintPlay(); }
    v.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.d != null) { stop(); go(+b.dataset.d); return; }
      const a = b.dataset.v;
      if (a === "play") playing ? stop() : play();
      else if (a === "prev") { stop(); go(k - 1); }
      else if (a === "next") { stop(); go(k + 1); }
    });
    go(0);
    if (auto && n > 1) play();
  }

  function mount(root, auto) {
    (root || document).querySelectorAll(".vz").forEach((v) => {
      const d = v.closest("details");
      if (v.closest("[hidden]") || (d && !d.open)) return;
      bind(v, auto !== false);
    });
  }

  window.MZV = { B, html, bind, mount };
})();
