(function () {
  "use strict";
  const E = window.MZE;

  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const nz = (a, b) => { let v; do v = ri(a, b); while (v === 0); return v; };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const sgn = () => (Math.random() < 0.5 ? -1 : 1);
  const par = (n) => (n < 0 ? `(${n})` : `${n}`);
  const inr = (n) => "₹" + n.toLocaleString("en-IN");
  const ord = (n) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };

  function frac(n, d) {
    if (d < 0) { n = -n; d = -d; }
    const g = E.gcd(n, d) || 1;
    n /= g; d /= g;
    if (d === 1) return `${n}`;
    return `${n < 0 ? "-" : ""}\\frac{${Math.abs(n)}}{${d}}`;
  }

  function terms(list) {
    let s = "";
    for (const [c, v] of list) {
      if (!c) continue;
      const a = Math.abs(c);
      const body = v ? (a === 1 ? v : a + v) : String(a);
      s += s ? (c < 0 ? " - " : " + ") + body : (c < 0 ? "-" : "") + body;
    }
    return s || "0";
  }
  const pw = (v, n) => (n === 0 ? "" : n === 1 ? v : `${v}^{${n}}`);
  const fx = (r) => (r === 0 ? "x" : `(x ${r < 0 ? "+" : "-"} ${Math.abs(r)})`);

  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  const scaledTriple = () => {
    const t = pick(TRIPLES);
    const k = t[2] <= 13 ? ri(1, 3) : 1;
    return t.map((v) => v * k);
  };

  const S = [];
  const add = (id, topic, name, gen) => S.push({ id, topic, name, gen });

  /* Foundation */
  add("add", "add-sub", "Add and subtract", () => {
    const a = ri(120, 999), b = ri(100, 899);
    if (Math.random() < 0.5) return { q: `$${a} + ${b}$`, ans: [a + b], show: `$${a + b}$`, how: "Add the ones, then the tens, then the hundreds, carrying whenever a column reaches 10." };
    const x = Math.max(a, b), y = Math.min(a, b);
    return { q: `$${x} - ${y}$`, ans: [x - y], show: `$${x - y}$`, how: `Check by adding back: $${x - y} + ${y} = ${x}$.` };
  });

  add("tables", "mult-div", "Times tables", () => {
    const a = ri(2, 12), b = ri(2, 12);
    return { q: `$${a} \\times ${b}$`, ans: [a * b], show: `$${a * b}$`, how: `$${a} \\times ${b} = ${a * b}$` };
  });

  add("divide", "mult-div", "Division", () => {
    const b = ri(2, 12), q = ri(2, 30), a = b * q;
    return { q: `$${a} \\div ${b}$`, ans: [q], show: `$${q}$`, how: `Because $${b} \\times ${q} = ${a}$.` };
  });

  add("frac-add", "fractions", "Adding fractions", () => {
    const d1 = ri(2, 9), d2 = ri(2, 9), n1 = ri(1, d1 - 1), n2 = ri(1, d2 - 1);
    const L = E.lcm(d1, d2), N = n1 * (L / d1) + n2 * (L / d2);
    const simple = frac(N, L);
    return {
      q: `$\\frac{${n1}}{${d1}} + \\frac{${n2}}{${d2}}$`,
      ans: [N / L], show: `$${simple}$`, hint: "Type a fraction such as 5/6.",
      how: `Use the common denominator $${L}$: $\\frac{${n1 * (L / d1)}}{${L}} + \\frac{${n2 * (L / d2)}}{${L}} = \\frac{${N}}{${L}}$${simple !== `\\frac{${N}}{${L}}` ? `, which simplifies to $${simple}$` : ""}.`,
    };
  });

  add("rect", "perimeter-area", "Perimeter and area", () => {
    const l = ri(4, 30), b = ri(3, l);
    if (Math.random() < 0.5) return { q: `A rectangle is ${l} cm long and ${b} cm wide. Find its area in cm².`, ans: [l * b], show: `$${l * b}$ cm²`, how: `$A = l \\times b = ${l} \\times ${b} = ${l * b}$` };
    return { q: `A rectangle is ${l} cm long and ${b} cm wide. Find its perimeter in cm.`, ans: [2 * (l + b)], show: `$${2 * (l + b)}$ cm`, how: `$P = 2(l + b) = 2(${l} + ${b}) = ${2 * (l + b)}$` };
  });

  /* Middle school */
  add("integers", "integers", "Integers", () => {
    const a = nz(-25, 25), b = nz(-25, 25), c = nz(-25, 25);
    return { q: `$${a} + ${par(b)} - ${par(c)}$`, ans: [a + b - c], show: `$${a + b - c}$`, how: `$${a} + ${par(b)} = ${a + b}$, then $${a + b} - ${par(c)} = ${a + b - c}$.` };
  });

  add("hcf", "factors-multiples", "HCF and LCM", () => {
    const g = ri(2, 12), m = ri(2, 9);
    let n; do n = ri(2, 9); while (n === m);
    const a = g * m, b = g * n, H = E.gcd(a, b), L = (a * b) / H;
    const how = `HCF $= ${H}$, and LCM $= \\frac{${a} \\times ${b}}{${H}} = ${L}$.`;
    if (Math.random() < 0.5) return { q: `Find the HCF of ${a} and ${b}.`, ans: [H], show: `$${H}$`, how };
    return { q: `Find the LCM of ${a} and ${b}.`, ans: [L], show: `$${L}$`, how };
  });

  add("proportion", "ratio-proportion", "Ratio and proportion", () => {
    const a = ri(2, 9);
    let b; do b = ri(2, 9); while (b === a);
    const k = ri(2, 9);
    return { q: `Find $x$ if $${a} : ${b} = ${a * k} : x$.`, ans: [b * k], show: `$x = ${b * k}$`, how: `Cross-multiply: $${a}x = ${b} \\times ${a * k}$, so $x = ${b * k}$.` };
  });

  add("percent", "percentages", "Percentages", () => {
    const p = pick([5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60, 75]), y = 40 * ri(1, 25), v = (p * y) / 100;
    return { q: `What is $${p}\\%$ of $${y}$?`, ans: [v], show: `$${E.fmt(v)}$`, how: `$\\frac{${p} \\times ${y}}{100} = ${E.fmt(v)}$` };
  });

  add("interest", "profit-interest", "Simple interest", () => {
    const P = 1000 * ri(2, 50), R = pick([4, 5, 6, 8, 10, 12]), Tm = ri(1, 5), SI = (P * R * Tm) / 100;
    return {
      q: `Find the simple interest on ${inr(P)} at ${R}% a year for ${Tm} year${Tm > 1 ? "s" : ""}.`,
      ans: [SI], show: inr(SI), hint: "Just the number, without ₹.",
      how: `$SI = \\frac{${P} \\times ${R} \\times ${Tm}}{100} = ${SI}$`,
    };
  });

  add("exponents", "exponents", "Laws of exponents", () => {
    const b = pick([2, 3, 5, 10]), top = b === 2 ? 6 : 3;
    let m, n;
    do { m = nz(-3, 6); n = nz(-3, 6); } while (m + n < -2 || m + n > top);
    const e = m + n, val = e >= 0 ? `${b ** e}` : frac(1, b ** -e);
    return { q: `$${b}^{${m}} \\times ${b}^{${n}}$`, ans: [b ** e], show: `$${b}^{${e}} = ${val}$`, hint: "Fractions such as 1/4 are fine.", how: `Add the exponents: $${m} + ${par(n)} = ${e}$.` };
  });

  add("identity", "algebra-identities", "Using identities", () => {
    const base = pick([20, 30, 40, 50, 60, 70, 80, 100]), k = ri(1, 9);
    return { q: `$${base + k} \\times ${base - k}$`, ans: [base * base - k * k], show: `$${base * base - k * k}$`, how: `$(${base} + ${k})(${base} - ${k}) = ${base}^2 - ${k}^2 = ${base * base} - ${k * k}$` };
  });

  add("linear", "linear-one", "Linear equations", () => {
    const x = ri(-10, 10), a = nz(-9, 9), b = nz(-20, 20), c = a * x + b;
    return {
      q: `Solve $${terms([[a, "x"], [b, ""]])} = ${c}$.`, ans: [x], show: `$x = ${x}$`,
      how: `${b > 0 ? "Subtract" : "Add"} $${Math.abs(b)}$ on both sides: $${terms([[a, "x"]])} = ${c - b}$. Then divide by $${a}$: $x = ${x}$.`,
    };
  });

  add("angles", "lines-angles", "Angles in a triangle", () => {
    const A = ri(25, 100), B = ri(20, 150 - A), C = 180 - A - B;
    return { q: `Two angles of a triangle are $${A}^\\circ$ and $${B}^\\circ$. Find the third angle in degrees.`, ans: [C], show: `$${C}^\\circ$`, how: `$180 - ${A} - ${B} = ${C}$` };
  });

  add("circle", "mensuration-2d", "Circles", () => {
    const r = 7 * ri(1, 4);
    if (Math.random() < 0.5) {
      const A = (22 / 7) * r * r;
      return { q: `Find the area of a circle of radius ${r} cm, in cm². Use $\\pi = \\frac{22}{7}$.`, ans: [A], tol: 0.002, show: `$${E.fmt(A)}$ cm²`, how: `$\\frac{22}{7} \\times ${r}^2 = ${E.fmt(A)}$` };
    }
    const C = 2 * (22 / 7) * r;
    return { q: `Find the circumference of a circle of radius ${r} cm, in cm. Use $\\pi = \\frac{22}{7}$.`, ans: [C], tol: 0.002, show: `$${E.fmt(C)}$ cm`, how: `$2 \\times \\frac{22}{7} \\times ${r} = ${E.fmt(C)}$` };
  });

  add("sqrt", "squares-roots", "Square roots", () => {
    const n = ri(11, 45);
    return { q: `$\\sqrt{${n * n}}$`, ans: [n], show: `$${n}$`, how: `$${n} \\times ${n} = ${n * n}$` };
  });

  add("mean", "data-basic", "Mean of a list", () => {
    const m = ri(12, 60);
    let vals;
    do {
      vals = [0, 1, 2, 3].map(() => ri(m - 10, m + 10));
      vals.push(5 * m - vals.reduce((s, v) => s + v, 0));
    } while (vals[4] < 1 || Math.abs(vals[4] - m) > 20);
    return { q: `Find the mean of ${vals.join(", ")}.`, ans: [m], show: `$${m}$`, how: `The total is $${5 * m}$, and $${5 * m} \\div 5 = ${m}$.` };
  });

  /* Secondary */
  add("poly-eval", "polynomials", "Remainder theorem", () => {
    const a = nz(-3, 3), b = ri(-5, 5), c = ri(-6, 6), d = ri(-9, 9), k = nz(-3, 3);
    const val = a * k ** 3 + b * k ** 2 + c * k + d;
    return {
      q: `Find the remainder when $p(x) = ${terms([[a, "x^3"], [b, "x^2"], [c, "x"], [d, ""]])}$ is divided by $${k < 0 ? `x + ${-k}` : `x - ${k}`}$.`,
      ans: [val], show: `$${val}$`, how: `By the remainder theorem, the remainder is $p(${k}) = ${val}$.`,
    };
  });

  add("system", "linear-two", "Simultaneous equations", () => {
    const x = ri(-6, 8), y = ri(-6, 8);
    let a1, b1, a2, b2;
    do { a1 = nz(-5, 5); b1 = nz(-5, 5); a2 = nz(-5, 5); b2 = nz(-5, 5); } while (a1 * b2 - a2 * b1 === 0);
    const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
    const D = a1 * b2 - a2 * b1, Dx = c1 * b2 - c2 * b1, Dy = a1 * c2 - a2 * c1;
    return {
      q: `Solve $${terms([[a1, "x"], [b1, "y"]])} = ${c1}$ and $${terms([[a2, "x"], [b2, "y"]])} = ${c2}$.`,
      ans: [x, y], ordered: true, show: `$x = ${x},\\ y = ${y}$`, hint: "Answer as x, y. For example: 3, -2",
      how: `By Cramer's rule, $D = ${D}$, $D_x = ${Dx}$ and $D_y = ${Dy}$, so $x = \\frac{${Dx}}{${D}} = ${x}$ and $y = \\frac{${Dy}}{${D}} = ${y}$.`,
    };
  });

  add("quadratic", "quadratic", "Quadratic equations", () => {
    const p = ri(-9, 9), q = ri(-9, 9);
    return {
      q: `Solve $${terms([[1, "x^2"], [-(p + q), "x"], [p * q, ""]])} = 0$.`,
      ans: p === q ? [p] : [p, q], show: p === q ? `$x = ${p}$ (repeated)` : `$x = ${Math.min(p, q)}$ or $x = ${Math.max(p, q)}$`,
      hint: "Separate two roots with a comma.",
      how: `It factorises as $${fx(p)}${fx(q)} = 0$.`,
    };
  });

  add("ap", "ap", "Arithmetic progressions", () => {
    const a = ri(-10, 20), d = nz(-6, 9), n = ri(10, 40), v = a + (n - 1) * d;
    return { q: `Find the ${ord(n)} term of $${a}, ${a + d}, ${a + 2 * d}, \\ldots$`, ans: [v], show: `$${v}$`, how: `$a = ${a}$ and $d = ${d}$, so $a_{${n}} = ${a} + ${n - 1} \\times ${par(d)} = ${v}$.` };
  });

  add("distance", "coordinate", "Distance formula", () => {
    const t = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [12, 5, 13], [8, 15, 17], [9, 12, 15]]);
    const x1 = ri(-6, 6), y1 = ri(-6, 6), x2 = x1 + sgn() * t[0], y2 = y1 + sgn() * t[1];
    return { q: `Find the distance between $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`, ans: [t[2]], show: `$${t[2]}$`, how: `$\\sqrt{${t[0]}^2 + ${t[1]}^2} = \\sqrt{${t[2] ** 2}} = ${t[2]}$` };
  });

  add("pythag", "triangles", "Pythagoras", () => {
    const [a, b, c] = scaledTriple();
    if (Math.random() < 0.5) return { q: `A right triangle has legs ${a} and ${b}. Find the hypotenuse.`, ans: [c], show: `$${c}$`, how: `$\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${c * c}} = ${c}$` };
    return { q: `A right triangle has hypotenuse ${c} and one leg ${a}. Find the other leg.`, ans: [b], show: `$${b}$`, how: `$\\sqrt{${c}^2 - ${a}^2} = \\sqrt{${b * b}} = ${b}$` };
  });

  add("tangent", "circles", "Tangent lengths", () => {
    const [r, t, d] = Math.random() < 0.5 ? scaledTriple() : (([p, q, h]) => [q, p, h])(scaledTriple());
    return { q: `A point is ${d} cm from the centre of a circle of radius ${r} cm. Find the length of the tangent from the point, in cm.`, ans: [t], show: `$${t}$ cm`, how: `$t = \\sqrt{${d}^2 - ${r}^2} = ${t}$` };
  });

  const TRIG = [
    ["sin", 0, 0, "0"], ["sin", 30, 0.5, "\\frac12"], ["sin", 45, Math.SQRT1_2, "\\frac{1}{\\sqrt2}"], ["sin", 60, Math.sqrt(3) / 2, "\\frac{\\sqrt3}{2}"], ["sin", 90, 1, "1"],
    ["cos", 0, 1, "1"], ["cos", 30, Math.sqrt(3) / 2, "\\frac{\\sqrt3}{2}"], ["cos", 45, Math.SQRT1_2, "\\frac{1}{\\sqrt2}"], ["cos", 60, 0.5, "\\frac12"], ["cos", 90, 0, "0"],
    ["tan", 0, 0, "0"], ["tan", 30, 1 / Math.sqrt(3), "\\frac{1}{\\sqrt3}"], ["tan", 45, 1, "1"], ["tan", 60, Math.sqrt(3), "\\sqrt3"],
  ];
  add("trig", "trig-basic", "Standard trig values", () => {
    const [f, a, v, t] = pick(TRIG);
    return { q: `$\\${f} ${a}^\\circ$`, ans: [v], show: `$${t}$`, hint: "Surds are fine: type sqrt(3)/2.", how: `$\\${f} ${a}^\\circ = ${t}$, one of the standard values.` };
  });

  add("heights", "heights", "Heights and distances", () => {
    const th = pick([30, 45, 60]), d = 5 * ri(2, 20), h = d * Math.tan((th * Math.PI) / 180);
    const exact = th === 45 ? `${d}` : th === 60 ? `${d}\\sqrt3` : `\\frac{${d}}{\\sqrt3}`;
    return {
      q: `From a point ${d} m from the foot of a tower, the angle of elevation of the top is $${th}^\\circ$. Find the height of the tower in metres.`,
      ans: [h], tol: 0.002, show: th === 45 ? `$${d}$ m` : `$${exact} \\approx ${E.fmt(+h.toFixed(2))}$ m`,
      hint: th === 45 ? "" : "A decimal such as 34.64 or an exact form such as 20sqrt(3).",
      how: `$h = ${d} \\tan ${th}^\\circ = ${exact}$`,
    };
  });

  add("volume", "surface-volume", "Volumes of solids", () => {
    const k = pick(["cube", "cuboid", "cylinder", "cone", "sphere"]);
    let q, v, how;
    if (k === "cube") { const a = ri(2, 15); v = a ** 3; q = `a cube of side ${a} cm`; how = `$V = a^3 = ${a}^3 = ${v}$`; }
    else if (k === "cuboid") { const l = ri(3, 15), b = ri(2, 12), h = ri(2, 10); v = l * b * h; q = `a cuboid ${l} cm × ${b} cm × ${h} cm`; how = `$V = lbh = ${l} \\times ${b} \\times ${h} = ${v}$`; }
    else if (k === "cylinder") { const r = 7 * ri(1, 2), h = ri(2, 20); v = (22 / 7) * r * r * h; q = `a cylinder with radius ${r} cm and height ${h} cm`; how = `$V = \\pi r^2 h = \\frac{22}{7} \\times ${r}^2 \\times ${h} = ${E.fmt(v)}$`; }
    else if (k === "cone") { const r = 7 * ri(1, 2), h = 3 * ri(1, 8); v = (1 / 3) * (22 / 7) * r * r * h; q = `a cone with radius ${r} cm and height ${h} cm`; how = `$V = \\tfrac13 \\pi r^2 h = \\tfrac13 \\times \\frac{22}{7} \\times ${r}^2 \\times ${h} = ${E.fmt(v)}$`; }
    else { const r = 7 * ri(1, 3); v = (4 / 3) * (22 / 7) * r ** 3; q = `a sphere of radius ${r} cm`; how = `$V = \\tfrac43 \\pi r^3 = \\tfrac43 \\times \\frac{22}{7} \\times ${r}^3 \\approx ${E.fmt(+v.toFixed(2))}$`; }
    return { q: `Find the volume of ${q}, in cm³. Use $\\pi = \\frac{22}{7}$ where needed.`, ans: [v], tol: 0.002, show: `$${E.fmt(+v.toFixed(2))}$ cm³`, how };
  });

  add("dice", "probability-basic", "Dice probability", () => {
    const count = (ok) => { let n = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (ok(a, b)) n++; return n; };
    const kind = ri(0, 2);
    let q, w;
    if (kind === 0) { const s = ri(2, 12); w = count((a, b) => a + b === s); q = `Two dice are thrown. What is the probability that the sum is ${s}?`; }
    else if (kind === 1) { const s = ri(4, 11); w = count((a, b) => a + b >= s); q = `Two dice are thrown. What is the probability that the sum is at least ${s}?`; }
    else { w = 6; q = "Two dice are thrown. What is the probability of a double (both dice the same)?"; }
    return { q, ans: [w / 36], show: `$${frac(w, 36)}$`, hint: "A fraction such as 1/6.", how: `${w} of the 36 equally likely outcomes work, so $P = \\frac{${w}}{36} = ${frac(w, 36)}$.` };
  });

  /* Senior secondary */
  add("sets", "sets", "Union of sets", () => {
    const A = ri(20, 60), B = ri(15, 50), both = ri(3, Math.min(A, B) - 2);
    return { q: `In a group, ${A} people like cricket, ${B} like football and ${both} like both. How many like at least one of the two?`, ans: [A + B - both], show: `$${A + B - both}$`, how: `$n(A \\cup B) = ${A} + ${B} - ${both} = ${A + B - both}$` };
  });

  add("complex-mod", "complex", "Modulus of a complex number", () => {
    const t = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]]);
    const [p, q] = Math.random() < 0.5 ? [t[0], t[1]] : [t[1], t[0]];
    const a = sgn() * p, b = sgn() * q;
    return { q: `Find $|z|$ for $z = ${a} ${b < 0 ? "-" : "+"} ${Math.abs(b)}i$.`, ans: [t[2]], show: `$${t[2]}$`, how: `$|z| = \\sqrt{${a}^2 + ${par(b)}^2} = \\sqrt{${t[2] ** 2}} = ${t[2]}$` };
  });

  add("ncr", "pnc", "Combinations", () => {
    const n = ri(5, 12), r = ri(2, 4), v = E.nCr(n, r);
    return { q: `Evaluate $\\binom{${n}}{${r}}$.`, ans: [v], show: `$${v}$`, how: `$\\binom{${n}}{${r}} = \\frac{${n}!}{${r}!\\,${n - r}!} = ${v}$` };
  });

  add("binom-coef", "binomial", "Binomial coefficients", () => {
    const n = ri(3, 7), k = ri(1, n - 1), a = pick([1, 2, 3, -1, -2]), C = E.nCr(n, k), v = C * a ** k;
    const inner = `1 ${a < 0 ? "-" : "+"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x`;
    return { q: `Find the coefficient of $${pw("x", k)}$ in $(${inner})^{${n}}$.`, ans: [v], show: `$${v}$`, how: `The term is $\\binom{${n}}{${k}}(${a}x)^{${k}}$, so the coefficient is $${C} \\times ${par(a ** k)} = ${v}$.` };
  });

  add("gp-sum", "sequences", "Sum of a GP", () => {
    const a = ri(1, 5), r = pick([2, 3]), n = ri(4, 7), Sn = (a * (r ** n - 1)) / (r - 1);
    return { q: `Find the sum of the first ${n} terms of $${a}, ${a * r}, ${a * r * r}, \\ldots$`, ans: [Sn], show: `$${Sn}$`, how: `$S_{${n}} = \\frac{${a}(${r}^{${n}} - 1)}{${r} - 1} = ${Sn}$` };
  });

  add("slope", "lines-conics", "Slope of a line", () => {
    const x1 = ri(-6, 6), y1 = ri(-6, 6);
    let x2; do x2 = ri(-6, 6); while (x2 === x1);
    const y2 = ri(-6, 6), m = frac(y2 - y1, x2 - x1);
    return { q: `Find the slope of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`, ans: [(y2 - y1) / (x2 - x1)], show: `$${m}$`, hint: "Fractions such as -3/4 are fine.", how: `$m = \\frac{${y2} - ${par(y1)}}{${x2} - ${par(x1)}} = \\frac{${y2 - y1}}{${x2 - x1}} = ${m}$` };
  });

  add("derivative", "limits-derivatives", "Derivatives", () => {
    const a = nz(-5, 5), n = ri(2, 4), b = nz(-6, 6), m = ri(1, n - 1), c = ri(-9, 9), k = ri(-3, 3);
    const v = a * n * k ** (n - 1) + b * m * k ** (m - 1);
    return {
      q: `If $f(x) = ${terms([[a, pw("x", n)], [b, pw("x", m)], [c, ""]])}$, find $f'(${k})$.`,
      ans: [v], show: `$${v}$`,
      how: `$f'(x) = ${terms([[a * n, pw("x", n - 1)], [b * m, pw("x", m - 1)]])}$, so $f'(${k}) = ${v}$.`,
    };
  });

  add("integral", "integrals", "Definite integrals", () => {
    const al = ri(1, 3), be = ri(-3, 3), c = ri(-5, 5), k = ri(1, 3);
    const v = al * k ** 3 + be * k ** 2 + c * k;
    return {
      q: `Evaluate $\\displaystyle\\int_0^{${k}} \\left(${terms([[3 * al, "x^2"], [2 * be, "x"], [c, ""]])}\\right) dx$.`,
      ans: [v], show: `$${v}$`,
      how: `An antiderivative is $${terms([[al, "x^3"], [be, "x^2"], [c, "x"]])}$. It equals $${v}$ at $x = ${k}$ and $0$ at $x = 0$.`,
    };
  });

  add("det2", "matrices", "2×2 determinants", () => {
    const [a, b, c, d] = [0, 0, 0, 0].map(() => ri(-9, 9));
    return { q: `Find the determinant of $\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}$.`, ans: [a * d - b * c], show: `$${a * d - b * c}$`, how: `$ad - bc = ${par(a)}${par(d)} - ${par(b)}${par(c)} = ${a * d - b * c}$` };
  });

  add("dot", "vectors", "Dot product", () => {
    const a = [0, 0, 0].map(() => ri(-5, 5)), b = [0, 0, 0].map(() => ri(-5, 5));
    const v = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    return { q: `Find $\\vec a \\cdot \\vec b$ for $\\vec a = (${a.join(", ")})$ and $\\vec b = (${b.join(", ")})$.`, ans: [v], show: `$${v}$`, how: `$${a.map((x, i) => `${par(x)}${par(b[i])}`).join(" + ")} = ${v}$` };
  });

  add("coin-prob", "probability-adv", "Binomial probability", () => {
    const n = ri(3, 6), k = ri(0, n), C = E.nCr(n, k);
    return { q: `A fair coin is tossed ${n} times. What is the probability of exactly ${k} head${k === 1 ? "" : "s"}?`, ans: [C / 2 ** n], show: `$${frac(C, 2 ** n)}$`, hint: "A fraction such as 3/8.", how: `$\\binom{${n}}{${k}} \\left(\\tfrac12\\right)^{${n}} = \\frac{${C}}{${2 ** n}} = ${frac(C, 2 ** n)}$` };
  });

  /* College */
  add("eigen", "linear-algebra", "Eigenvalues", () => {
    const a = ri(-4, 6), b = nz(-5, 5);
    return {
      q: `Find the eigenvalues of $\\begin{bmatrix} ${a} & ${b} \\\\ ${b} & ${a} \\end{bmatrix}$.`,
      ans: [a + b, a - b], show: `$\\lambda = ${Math.min(a + b, a - b)}$ and $\\lambda = ${Math.max(a + b, a - b)}$`, hint: "Separate the two values with a comma.",
      how: `$(${a} - \\lambda)^2 - ${b * b} = 0$, so $\\lambda = ${a} \\pm ${Math.abs(b)}$.`,
    };
  });

  add("partial", "multivariable", "Partial derivatives", () => {
    const a = nz(-4, 4), b = nz(-4, 4), p = nz(-3, 3), q = nz(-3, 3);
    const f = terms([[a, "x^2y"], [b, "xy^2"]]);
    if (Math.random() < 0.5) {
      const v = 2 * a * p * q + b * q * q;
      return { q: `For $f(x, y) = ${f}$, find $f_x(${p}, ${q})$.`, ans: [v], show: `$${v}$`, how: `$f_x = ${terms([[2 * a, "xy"], [b, "y^2"]])}$, which is $${v}$ at $(${p}, ${q})$.` };
    }
    const v = a * p * p + 2 * b * p * q;
    return { q: `For $f(x, y) = ${f}$, find $f_y(${p}, ${q})$.`, ans: [v], show: `$${v}$`, how: `$f_y = ${terms([[a, "x^2"], [2 * b, "xy"]])}$, which is $${v}$ at $(${p}, ${q})$.` };
  });

  add("modpow", "number-theory", "Modular powers", () => {
    const p = pick([5, 7, 11, 13]);
    let a; do a = ri(2, 12); while (a % p === 0);
    const k = ri(20, 99), r = k % (p - 1), v = E.modpow(a, k, p);
    return {
      q: `Find the remainder when $${a}^{${k}}$ is divided by $${p}$.`, ans: [v], show: `$${v}$`,
      how: `By Fermat, $${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$. Since $${k} = ${p - 1} \\times ${Math.floor(k / (p - 1))} + ${r}$, the answer is $${a}^{${r}} \\bmod ${p} = ${v}$.`,
    };
  });

  window.MZ_SKILLS = S;

  window.MZ_CHECK = function (input, item) {
    const raw = String(input).trim().toLowerCase();
    if (!raw) return { empty: true };
    const parts = raw
      .replace(/\b(or|and)\b/g, ",")
      .replace(/₹/g, "")
      .split(/[,;]/)
      .map((p) => p.replace(/^\s*[a-zλ]\s*=/, "").replace(/(cm|m)(²|³|\^2|\^3)?\s*$|°\s*$|degrees?\s*$/, "").trim())
      .filter(Boolean);
    if (!parts.length) return { empty: true };
    let vals;
    try {
      vals = parts.map((p) => {
        const v = E.evaluate(p);
        const m = /^-?\d*\.(\d{2,})$/.exec(p.replace(/\s/g, ""));
        return { v, slack: m ? 0.5 * 10 ** -m[1].length : 0 };
      });
    } catch (e) {
      return { error: e.message };
    }
    if (vals.some((x) => !isFinite(x.v))) return { error: "That doesn't give a number." };
    const tol = item.tol || 0;
    const same = (u, want) => Math.abs(u.v - want) <= Math.max(1e-9 * Math.max(1, Math.abs(want)), u.slack + 1e-9, tol * Math.abs(want));
    const uniq = (list, key) => list.filter((x, i) => list.findIndex((y) => Math.abs(key(y) - key(x)) < 1e-9) === i);
    let want = item.ans.slice();
    let got = vals;
    if (!item.ordered) {
      want = uniq(want, (x) => x).sort((a, b) => a - b);
      got = uniq(got, (x) => x.v).sort((a, b) => a.v - b.v);
    }
    if (got.length !== want.length) return { ok: false };
    return { ok: got.every((g, i) => same(g, want[i])) };
  };
})();
