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
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const sample = (arr, n) => shuffle(arr.slice()).slice(0, n);

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
  const bm = (m) => `\\begin{bmatrix} ${m[0][0]} & ${m[0][1]} \\\\ ${m[1][0]} & ${m[1][1]} \\end{bmatrix}`;
  const cx = (re, im) => {
    if (!im) return `${re}`;
    const ip = Math.abs(im) === 1 ? "i" : `${Math.abs(im)}i`;
    if (!re) return `${im < 0 ? "-" : ""}${ip}`;
    return `${re} ${im < 0 ? "-" : "+"} ${ip}`;
  };
  const M = (s) => `$${s}$`;

  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  const scaledTriple = () => {
    const t = pick(TRIPLES);
    const k = t[2] <= 13 ? ri(1, 3) : 1;
    return t.map((v) => v * k);
  };

  const SURD = [[0, "0"], [0.5, "\\frac12"], [Math.SQRT1_2, "\\frac{1}{\\sqrt2}"], [Math.sqrt(3) / 2, "\\frac{\\sqrt3}{2}"], [1, "1"], [Math.sqrt(3), "\\sqrt3"], [1 / Math.sqrt(3), "\\frac{1}{\\sqrt3}"]];
  const surd = (v) => {
    const e = SURD.find(([x]) => Math.abs(Math.abs(v) - x) < 1e-9);
    return e ? (v < -1e-9 ? "-" : "") + e[1] : E.fmt(v);
  };
  function surdOpts(v, signed) {
    const pool = [];
    for (const [x] of SURD) {
      if (Math.abs(x - Math.abs(v)) < 1e-9) continue;
      pool.push(x);
      if (signed && x) pool.push(-x);
    }
    const out = [surd(v)];
    if (signed && v) out.push(surd(-v));
    return [...out, ...sample(pool, 4 - out.length).map(surd)].map(M);
  }

  const S = [];
  const add = (id, topic, name, gen, quick) => S.push({ id, topic, name, gen, quick: !!quick });

  /* ================= Foundation ================= */
  add("place", "place-value", "Place value", () => {
    let n, s, i;
    do { n = ri(10000, 99999); s = String(n); i = ri(0, 4); } while (s[i] === "0" || s.indexOf(s[i]) !== s.lastIndexOf(s[i]));
    const d = +s[i], p = 10 ** (4 - i), val = d * p;
    const names = ["ten-thousands", "thousands", "hundreds", "tens", "ones"];
    return {
      q: `What is the place value of the digit ${d} in ${n.toLocaleString("en-IN")}?`,
      ans: [val], show: M(val), wrong: [1, 10, 100, 1000, 10000].filter((x) => x !== p).map((x) => d * x),
      how: `The ${d} is in the ${names[i]} place, so its value is $${d} \\times ${p} = ${val}$.`,
    };
  }, true);

  add("round", "place-value", "Rounding", () => {
    const n = ri(1000, 99999);
    const [p, nm] = pick([[10, "ten"], [100, "hundred"], [1000, "thousand"]]);
    const r = Math.round(n / p) * p, dig = Math.floor(n / (p / 10)) % 10;
    return {
      q: `Round ${n.toLocaleString("en-IN")} to the nearest ${nm}.`,
      ans: [r], show: M(r), wrong: [Math.floor(n / p) * p, Math.ceil(n / p) * p, r + p, r - p, Math.round(n / (p * 10)) * p * 10],
      how: `The digit after the ${nm}s place is ${dig}, so round ${dig >= 5 ? "up" : "down"} to $${r}$.`,
    };
  }, true);

  add("add", "add-sub", "Add and subtract", () => {
    const a = ri(120, 999), b = ri(100, 899);
    const noCarry = (x, y) => { let r = 0, p = 1; while (x || y) { r += ((x % 10) + (y % 10)) % 10 * p; x = Math.floor(x / 10); y = Math.floor(y / 10); p *= 10; } return r; };
    const noBorrow = (x, y) => { let r = 0, p = 1; while (x || y) { r += Math.abs((x % 10) - (y % 10)) * p; x = Math.floor(x / 10); y = Math.floor(y / 10); p *= 10; } return r; };
    if (Math.random() < 0.5) return { q: M(`${a} + ${b}`), ans: [a + b], show: M(a + b), wrong: [noCarry(a, b), a + b + 10, a + b - 10, a + b + 100], how: "Add the ones, then the tens, then the hundreds, carrying whenever a column reaches 10." };
    const x = Math.max(a, b), y = Math.min(a, b);
    return { q: M(`${x} - ${y}`), ans: [x - y], show: M(x - y), wrong: [noBorrow(x, y), x - y + 10, x - y - 10, x - y + 100], how: `Check by adding back: $${x - y} + ${y} = ${x}$.` };
  }, true);

  add("missing", "add-sub", "Missing numbers", () => {
    const a = ri(12, 99), b = ri(12, 99);
    if (Math.random() < 0.5) return { q: `Find the missing number: $\\square + ${a} = ${a + b}$`, ans: [b], show: M(b), wrong: [a + b + a, a, b + 10, b - 1], how: `$${a + b} - ${a} = ${b}$` };
    return { q: `Find the missing number: $${a + b} - \\square = ${a}$`, ans: [b], show: M(b), wrong: [a + b + a, a, b - 10, b + 1], how: `$${a + b} - ${a} = ${b}$, and check: $${a + b} - ${b} = ${a}$.` };
  }, true);

  add("tables", "mult-div", "Times tables", () => {
    const a = ri(2, 12), b = ri(2, 12);
    return { q: M(`${a} \\times ${b}`), ans: [a * b], show: M(a * b), wrong: [a * (b + 1), a * (b - 1), (a + 1) * b, a + b], how: `$${a} \\times ${b} = ${a * b}$` };
  }, true);

  add("divide", "mult-div", "Division", () => {
    const b = ri(2, 12), q = ri(2, 30), a = b * q;
    return { q: M(`${a} \\div ${b}`), ans: [q], show: M(q), wrong: [q + 1, q - 1, q + 2, q + 10], how: `Because $${b} \\times ${q} = ${a}$.` };
  }, true);

  add("frac-add", "fractions", "Adding fractions", () => {
    let d1, d2;
    do { d1 = ri(2, 9); d2 = ri(2, 9); } while (d1 === d2);
    const n1 = ri(1, d1 - 1), n2 = ri(1, d2 - 1);
    const L = E.lcm(d1, d2), N = n1 * (L / d1) + n2 * (L / d2);
    const simple = frac(N, L);
    return {
      q: M(`\\frac{${n1}}{${d1}} + \\frac{${n2}}{${d2}}`),
      ans: [N / L], show: M(simple), hint: "Type a fraction such as 5/6.", frac: true,
      wrong: [(n1 + n2) / (d1 + d2), (n1 + n2) / L, (n1 * n2) / (d1 * d2), (N + 1) / L],
      how: `Use the common denominator $${L}$: $\\frac{${n1 * (L / d1)}}{${L}} + \\frac{${n2 * (L / d2)}}{${L}} = \\frac{${N}}{${L}}$${simple !== `\\frac{${N}}{${L}}` ? `, which simplifies to $${simple}$` : ""}.`,
    };
  });

  add("simplify", "fractions", "Simplest form", () => {
    let n0, d0;
    do { d0 = ri(3, 12); n0 = ri(1, d0 - 1); } while (E.gcd(n0, d0) !== 1);
    const k = pick([4, 6, 8, 9, 10, 12, 3, 5, 7]), N = n0 * k, D = d0 * k;
    const f = [2, 3, 5].find((p) => k % p === 0 && k !== p);
    const opts = [`\\frac{${n0}}{${d0}}`];
    if (f) opts.push(`\\frac{${N / f}}{${D / f}}`);
    else opts.push(`\\frac{${n0 * 2}}{${d0 * 2}}`);
    opts.push(`\\frac{${d0}}{${n0}}`, `\\frac{${n0 + 1}}{${d0}}`, `\\frac{${n0}}{${d0 + 1}}`);
    return {
      q: `Write $\\frac{${N}}{${D}}$ in its simplest form.`, opts: opts.map(M),
      how: `The HCF of ${N} and ${D} is ${k}. Divide both by ${k}: $\\frac{${N} \\div ${k}}{${D} \\div ${k}} = \\frac{${n0}}{${d0}}$.`,
    };
  }, true);

  add("compare-frac", "fractions", "Comparing fractions", () => {
    const list = [];
    while (list.length < 4) {
      const d = ri(3, 12), n = ri(1, d - 1), g = E.gcd(n, d);
      const f = [n / g, d / g];
      if (!list.some((x) => Math.abs(x[0] / x[1] - f[0] / f[1]) < 0.02)) list.push(f);
    }
    const big = Math.random() < 0.6;
    list.sort((a, b) => (big ? b[0] / b[1] - a[0] / a[1] : a[0] / a[1] - b[0] / b[1]));
    return {
      q: `Which fraction is the ${big ? "largest" : "smallest"}?`, opts: list.map(([n, d]) => M(`\\frac{${n}}{${d}}`)),
      how: `As decimals: ${list.map(([n, d]) => `$\\frac{${n}}{${d}} \\approx ${(n / d).toFixed(3)}$`).join(", ")}.`,
    };
  }, true);

  add("decimals", "decimals", "Decimals", () => {
    const k = ri(0, 2);
    if (k === 0) {
      const a = ri(11, 99) / 10, b = ri(101, 999) / 100, s = (Math.round(a * 100) + Math.round(b * 100)) / 100;
      const slip = (Math.round(a * 10) + Math.round(b * 100)) / 100;
      return { q: M(`${a} + ${b}`), ans: [s], show: M(E.fmt(s)), dec: true, wrong: [slip, s + 1, s - 0.1, s + 0.01], how: `Line up the decimal points: $${a.toFixed(2)} + ${b.toFixed(2)} = ${E.fmt(s)}$.` };
    }
    if (k === 1) {
      const a = ri(101, 999) / 100, p = pick([10, 100, 1000]), v = +(a * p).toFixed(2);
      return { q: M(`${a} \\times ${p}`), ans: [v], show: M(E.fmt(v)), dec: true, wrong: [v * 10, v / 10, a + p, v / 100], how: `Multiplying by ${p} moves the decimal point ${Math.log10(p)} place${p > 10 ? "s" : ""} to the right.` };
    }
    const a = ri(11, 99), b = ri(2, 9), v = +((a * b) / 100).toFixed(2);
    return { q: M(`${a / 10} \\times 0.${b}`), ans: [v], show: M(E.fmt(v)), dec: true, wrong: [v * 10, v / 10, +(a / 10 + b / 10).toFixed(2)], how: `$${a} \\times ${b} = ${a * b}$, and there are 2 decimal places in total, so the answer is $${E.fmt(v)}$.` };
  }, true);

  add("measure", "measurement", "Units and time", () => {
    const k = ri(0, 3);
    if (k === 0) {
      const h = ri(1, 5), m = ri(5, 55);
      return { q: `How many minutes are there in ${h} h ${m} min?`, ans: [h * 60 + m], unit: " minutes", show: `$${h * 60 + m}$ minutes`, wrong: [h * 100 + m, h * 60, h * 60 + m + 10, h * 60 - m], how: `$${h} \\times 60 + ${m} = ${h * 60 + m}$` };
    }
    if (k === 1) {
      const km = ri(101, 999) / 100, m = Math.round(km * 1000);
      return { q: `How many metres are there in ${km} km?`, ans: [m], unit: " m", show: `$${m}$ m`, wrong: [m / 10, m * 10, Math.round(km * 100)], how: `$1$ km $= 1000$ m, so $${km} \\times 1000 = ${m}$.` };
    }
    if (k === 2) {
      const kg = ri(1, 9), g = ri(15, 950), t = kg * 1000 + g;
      return { q: `Write ${kg} kg ${g} g in grams.`, ans: [t], unit: " g", show: `$${t}$ g`, wrong: [kg * 100 + g, +`${kg}${g}`, kg * 1000 - g, t + 1000], how: `$${kg} \\times 1000 + ${g} = ${t}$` };
    }
    const r = ri(2, 99), p = pick([5, 10, 25, 50, 75]), t = r * 100 + p;
    return { q: `How many paise make ₹${r}.${String(p).padStart(2, "0")}?`, ans: [t], unit: " paise", show: `$${t}$ paise`, wrong: [r * 10 + p, r + p, t * 10, r * 100], how: `₹1 = 100 paise, so $${r} \\times 100 + ${p} = ${t}$.` };
  }, true);

  add("rect", "perimeter-area", "Perimeter and area", () => {
    const l = ri(4, 30), b = ri(3, l - 1);
    if (Math.random() < 0.5) return { q: `A rectangle is ${l} cm long and ${b} cm wide. Find its area in cm².`, ans: [l * b], unit: " cm²", show: `$${l * b}$ cm²`, wrong: [2 * (l + b), l + b, l * b + l], how: `$A = l \\times b = ${l} \\times ${b} = ${l * b}$` };
    return { q: `A rectangle is ${l} cm long and ${b} cm wide. Find its perimeter in cm.`, ans: [2 * (l + b)], unit: " cm", show: `$${2 * (l + b)}$ cm`, wrong: [l * b, l + b, 2 * l + b], how: `$P = 2(l + b) = 2(${l} + ${b}) = ${2 * (l + b)}$` };
  });

  /* ================= Middle school ================= */
  add("integers", "integers", "Integers", () => {
    const a = nz(-25, 25), b = nz(-25, 25), c = nz(-25, 25);
    return { q: M(`${a} + ${par(b)} - ${par(c)}`), ans: [a + b - c], show: M(a + b - c), wrong: [a + b + c, a - b - c, -a + b - c, -(a + b - c)], how: `$${a} + ${par(b)} = ${a + b}$, then $${a + b} - ${par(c)} = ${a + b - c}$.` };
  }, true);

  add("bodmas", "integers", "Order of operations", () => {
    const k = ri(0, 2);
    if (k === 0) {
      const a = ri(2, 20), b = ri(2, 9), c = ri(2, 9);
      return { q: M(`${a} + ${b} \\times ${c}`), ans: [a + b * c], show: M(a + b * c), wrong: [(a + b) * c, a * b + c, a + b + c], how: `Multiply first: $${b} \\times ${c} = ${b * c}$, then $${a} + ${b * c} = ${a + b * c}$.` };
    }
    if (k === 1) {
      const c = ri(2, 6), q = ri(2, 9), b = c * q, d = ri(2, 5), a = ri(b, 60);
      const w = [];
      if ((a - b) % c === 0) w.push(((a - b) / c) * d);
      if (b % (c * d) === 0) w.push(a - b / (c * d));
      w.push(a - q, a - q * d + d);
      return { q: M(`${a} - ${b} \\div ${c} \\times ${d}`), ans: [a - q * d], show: M(a - q * d), wrong: w, how: `Divide and multiply from left to right first: $${b} \\div ${c} = ${q}$ and $${q} \\times ${d} = ${q * d}$. Then $${a} - ${q * d} = ${a - q * d}$.` };
    }
    const a = ri(2, 12), b = ri(2, 12), c = ri(2, 6), d = ri(1, 20);
    return { q: M(`(${a} + ${b}) \\times ${c} - ${d}`), ans: [(a + b) * c - d], show: M((a + b) * c - d), wrong: [a + b * c - d, (a + b) * (c - d), (a + b) * c + d], how: `Brackets first: $${a} + ${b} = ${a + b}$. Then $${a + b} \\times ${c} = ${(a + b) * c}$, and subtract ${d}.` };
  }, true);

  add("hcf", "factors-multiples", "HCF and LCM", () => {
    const g = ri(2, 12), m = ri(2, 9);
    let n; do n = ri(2, 9); while (n === m || E.gcd(m, n) !== 1);
    const a = g * m, b = g * n, H = E.gcd(a, b), L = (a * b) / H;
    const how = `HCF $= ${H}$, and LCM $= \\frac{${a} \\times ${b}}{${H}} = ${L}$.`;
    if (Math.random() < 0.5) return { q: `Find the HCF of ${a} and ${b}.`, ans: [H], show: M(H), wrong: [L, H * 2, Math.min(m, n), 1].filter((x) => x !== H), how };
    return { q: `Find the LCM of ${a} and ${b}.`, ans: [L], show: M(L), wrong: [H, a * b, L * 2, L / 2], how };
  }, true);

  add("proportion", "ratio-proportion", "Ratio and proportion", () => {
    const a = ri(2, 9);
    let b; do b = ri(2, 9); while (b === a);
    const k = ri(2, 9);
    return { q: `Find $x$ if $${a} : ${b} = ${a * k} : x$.`, ans: [b * k], show: M(`x = ${b * k}`), wrong: [a * k + b - a, b + k, a * k * b], how: `Cross-multiply: $${a}x = ${b} \\times ${a * k}$, so $x = ${b * k}$.` };
  });

  add("share", "ratio-proportion", "Sharing in a ratio", () => {
    const a = ri(1, 7);
    let b; do b = ri(2, 9); while (b === a || E.gcd(a, b) !== 1);
    const k = 10 * ri(2, 30), N = (a + b) * k, big = Math.max(a, b) * k, small = Math.min(a, b) * k;
    return {
      q: `${inr(N)} is shared between Asha and Ravi in the ratio ${a} : ${b}. How much does ${a > b ? "Asha" : "Ravi"} get?`,
      ans: [big], money: true, show: inr(big), wrong: [small, N / 2, Math.round(N / Math.max(a, b))],
      how: `There are $${a} + ${b} = ${a + b}$ parts, each worth $${N} \\div ${a + b} = ${k}$. The larger share is $${Math.max(a, b)} \\times ${k} = ${big}$.`,
    };
  });

  add("sdt", "ratio-proportion", "Speed, distance, time", () => {
    if (Math.random() < 0.5) {
      const s = 2 * ri(15, 45), t = pick([1.5, 2, 2.5, 3, 4]), d = s * t;
      return { q: `A car travels at ${s} km/h. How far does it go in ${t} hours?`, ans: [d], unit: " km", show: `$${d}$ km`, wrong: [s + t, s / t, d + s], how: `Distance $=$ speed $\\times$ time $= ${s} \\times ${t} = ${d}$ km.` };
    }
    const s = 18 * ri(1, 6), v = (s * 5) / 18;
    return { q: `Convert ${s} km/h to m/s.`, ans: [v], unit: " m/s", show: `$${v}$ m/s`, wrong: [(s * 18) / 5, s * 1000 / 60, v * 2], how: `Multiply by $\\frac{5}{18}$: $${s} \\times \\frac{5}{18} = ${v}$.` };
  });

  add("percent", "percentages", "Percentages", () => {
    const p = pick([5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60, 75]), y = 40 * ri(1, 25), v = (p * y) / 100;
    return { q: `What is $${p}\\%$ of $${y}$?`, ans: [v], show: M(E.fmt(v)), dec: true, wrong: [v * 10, v / 10, y - v, v * 2], how: `$\\frac{${p} \\times ${y}}{100} = ${E.fmt(v)}$` };
  }, true);

  add("profit", "profit-interest", "Profit and loss", () => {
    const CP = 100 * ri(2, 20), p = pick([5, 10, 15, 20, 25, 30, 40, 50]), gain = Math.random() < 0.6, diff = (CP * p) / 100;
    const SP = gain ? CP + diff : CP - diff;
    if (Math.random() < 0.5) {
      return {
        q: `An item bought for ${inr(CP)} is sold for ${inr(SP)}. Find the ${gain ? "profit" : "loss"} percent.`,
        ans: [p], unit: "%", show: `$${p}\\%$`, wrong: [+((diff / SP) * 100).toFixed(2), diff, p * 2, 100 - p].filter((x) => Number.isInteger(x) || x * 100 % 1 === 0),
        how: `${gain ? "Profit" : "Loss"} $= ${diff}$, and $\\frac{${diff}}{${CP}} \\times 100 = ${p}\\%$. Percentages are always taken on the cost price.`,
      };
    }
    return {
      q: `An item costs ${inr(CP)}. At what price must it be sold to make a ${gain ? "profit" : "loss"} of ${p}%?`,
      ans: [SP], money: true, show: inr(SP), wrong: [gain ? CP - diff : CP + diff, diff, CP + p],
      how: `$${CP} ${gain ? "+" : "-"} ${p}\\% \\text{ of } ${CP} = ${CP} ${gain ? "+" : "-"} ${diff} = ${SP}$`,
    };
  });

  add("interest", "profit-interest", "Simple interest", () => {
    const P = 1000 * ri(2, 50), R = pick([4, 5, 6, 8, 10, 12]), Tm = ri(2, 5), SI = (P * R * Tm) / 100;
    return {
      q: `Find the simple interest on ${inr(P)} at ${R}% a year for ${Tm} years.`,
      ans: [SI], money: true, show: inr(SI), hint: "Just the number, without ₹.", wrong: [(P * R) / 100, P + SI, SI * 2],
      how: `$SI = \\frac{${P} \\times ${R} \\times ${Tm}}{100} = ${SI}$`,
    };
  });

  add("ci", "profit-interest", "Compound interest", () => {
    const P = 2000 * ri(1, 10), R = pick([5, 10, 20]), A = (P * (100 + R) ** 2) / 10000, CI = A - P, SI = (P * R * 2) / 100;
    return {
      q: `Find the compound interest on ${inr(P)} at ${R}% a year for 2 years, compounded annually.`,
      ans: [CI], money: true, show: inr(CI), hint: "Just the number, without ₹.", wrong: [SI, A, (P * R) / 100],
      how: `$A = ${P}\\left(1 + \\frac{${R}}{100}\\right)^2 = ${A}$, so $CI = ${A} - ${P} = ${CI}$. (Simple interest would only be ${SI}.)`,
    };
  });

  add("exponents", "exponents", "Laws of exponents", () => {
    const b = pick([2, 3, 5, 10]), top = b === 2 ? 6 : 3;
    let m, n;
    do { m = nz(-3, 6); n = nz(-3, 6); } while (m + n < -2 || m + n > top || m * n === m + n);
    const e = m + n, val = e >= 0 ? `${b ** e}` : frac(1, b ** -e);
    return { q: M(`${b}^{${m}} \\times ${b}^{${n}}`), ans: [b ** e], show: M(`${b}^{${e}} = ${val}`), frac: true, hint: "Fractions such as 1/4 are fine.", wrong: [b ** (m * n), b ** (m - n), b ** (n - m), b * e].filter((x) => x <= 1e6), how: `Add the exponents: $${m} + ${par(n)} = ${e}$.` };
  }, true);

  add("std-form", "exponents", "Standard form", () => {
    const m = ri(11, 99) / 10, e = pick([-6, -5, -4, -3, -2, 3, 4, 5, 6, 7, 8]);
    const num = e > 0 ? Math.round(m * 10 ** e).toLocaleString("en-US") : (m * 10 ** e).toFixed(-e + 1);
    const f = (k) => M(`${m} \\times 10^{${k}}`);
    return { q: `Write ${num} in standard form.`, opts: [f(e), f(-e), f(e + 1), f(e - 1)], how: `Move the decimal point ${Math.abs(e)} place${Math.abs(e) > 1 ? "s" : ""} to get ${m}, a number between 1 and 10. ${e > 0 ? "The number is large, so the power is positive" : "The number is less than 1, so the power is negative"}: $${m} \\times 10^{${e}}$.` };
  });

  add("identity", "algebra-identities", "Using identities", () => {
    const base = pick([20, 30, 40, 50, 60, 70, 80, 100]), k = ri(1, 9);
    return { q: M(`${base + k} \\times ${base - k}`), ans: [base * base - k * k], show: M(base * base - k * k), wrong: [base * base + k * k, base * base - 2 * k, base * base - k], how: `$(${base} + ${k})(${base} - ${k}) = ${base}^2 - ${k}^2 = ${base * base} - ${k * k}$` };
  }, true);

  add("like-terms", "algebra-identities", "Simplifying expressions", () => {
    let a1, a2, b1, b2;
    do { a1 = ri(2, 9); a2 = ri(1, 9); b1 = nz(-6, 9); b2 = nz(-6, 9); } while (a1 === a2 || b1 + b2 === 0 || b1 - b2 === 0);
    const expr = `${terms([[a1, "x"], [b1, "y"]])} - ${a2 === 1 ? "" : a2}x ${b2 < 0 ? "-" : "+"} ${Math.abs(b2) === 1 ? "" : Math.abs(b2)}y`;
    const opts = [terms([[a1 - a2, "x"], [b1 + b2, "y"]]), terms([[a1 + a2, "x"], [b1 + b2, "y"]]), terms([[a1 - a2, "x"], [b1 - b2, "y"]]), terms([[a1 - a2 + b1 + b2, "xy"]])];
    return { q: `Simplify $${expr}$.`, opts: opts.map(M), how: `Collect like terms: $x$ terms give $${a1} - ${a2} = ${a1 - a2}$, and $y$ terms give $${b1} + ${par(b2)} = ${b1 + b2}$.` };
  });

  add("linear", "linear-one", "Linear equations", () => {
    const x = ri(-10, 10), a = nz(-9, 9), b = nz(-20, 20), c = a * x + b;
    return {
      q: `Solve $${terms([[a, "x"], [b, ""]])} = ${c}$.`, ans: [x], show: M(`x = ${x}`), form: (v) => `x = ${tn(v[0])}`, frac: true,
      wrong: [(c + b) / a, -x, (c - b) * a, x + 1],
      how: `${b > 0 ? "Subtract" : "Add"} $${Math.abs(b)}$ on both sides: $${terms([[a, "x"]])} = ${c - b}$. Then divide by $${a}$: $x = ${x}$.`,
    };
  }, true);

  add("angles", "lines-angles", "Angles in a triangle", () => {
    const A = ri(25, 100), B = ri(20, 150 - A), C = 180 - A - B;
    return { q: `Two angles of a triangle are $${A}^\\circ$ and $${B}^\\circ$. Find the third angle.`, ans: [C], unit: "°", show: M(`${C}^\\circ`), wrong: [360 - A - B, 90 - Math.min(A, B), C + 10, C - 10], how: `The angles add up to $180^\\circ$: $180 - ${A} - ${B} = ${C}$.` };
  }, true);

  add("circle", "mensuration-2d", "Circles", () => {
    const r = 7 * ri(1, 4);
    if (Math.random() < 0.5) {
      const A = (22 / 7) * r * r;
      return { q: `Find the area of a circle of radius ${r} cm. Use $\\pi = \\frac{22}{7}$.`, ans: [A], tol: 0.002, unit: " cm²", show: `$${E.fmt(A)}$ cm²`, wrong: [2 * (22 / 7) * r, (22 / 7) * 4 * r * r, (22 / 7) * r], how: `$A = \\pi r^2 = \\frac{22}{7} \\times ${r}^2 = ${E.fmt(A)}$` };
    }
    const C = 2 * (22 / 7) * r;
    return { q: `Find the circumference of a circle of radius ${r} cm. Use $\\pi = \\frac{22}{7}$.`, ans: [C], tol: 0.002, unit: " cm", show: `$${E.fmt(C)}$ cm`, wrong: [(22 / 7) * r * r, (22 / 7) * r, 4 * (22 / 7) * r], how: `$C = 2\\pi r = 2 \\times \\frac{22}{7} \\times ${r} = ${E.fmt(C)}$` };
  });

  add("tri-area", "mensuration-2d", "Areas of shapes", () => {
    const k = ri(0, 2);
    if (k === 0) {
      const b = 2 * ri(2, 15), h = ri(3, 20);
      return { q: `Find the area of a triangle with base ${b} cm and height ${h} cm.`, ans: [(b * h) / 2], unit: " cm²", show: `$${(b * h) / 2}$ cm²`, wrong: [b * h, b + h, 2 * (b + h)], how: `$A = \\tfrac12 \\times ${b} \\times ${h} = ${(b * h) / 2}$` };
    }
    if (k === 1) {
      const b = ri(4, 20), h = ri(3, 15);
      return { q: `Find the area of a parallelogram with base ${b} cm and height ${h} cm.`, ans: [b * h], unit: " cm²", show: `$${b * h}$ cm²`, wrong: [(b * h) / 2, 2 * (b + h), b + h], how: `$A = b \\times h = ${b} \\times ${h} = ${b * h}$` };
    }
    const a = ri(4, 15), c = a + 2 * ri(1, 6), h = ri(3, 12), A = ((a + c) * h) / 2;
    return { q: `A trapezium has parallel sides ${a} cm and ${c} cm, and height ${h} cm. Find its area.`, ans: [A], unit: " cm²", show: `$${A}$ cm²`, wrong: [(a + c) * h, a * c * h / 2, a + c + h], how: `$A = \\tfrac12 (a + b) h = \\tfrac12 (${a} + ${c}) \\times ${h} = ${A}$` };
  });

  add("sqrt", "squares-roots", "Square roots", () => {
    const n = ri(11, 45);
    return { q: M(`\\sqrt{${n * n}}`), ans: [n], show: M(n), wrong: [n + 1, n - 1, n + 2, Math.round((n * n) / 2)], how: `$${n} \\times ${n} = ${n * n}$` };
  }, true);

  add("cube-root", "squares-roots", "Cube roots", () => {
    const n = ri(2, 15);
    return { q: M(`\\sqrt[3]{${n ** 3}}`), ans: [n], show: M(n), wrong: [n + 1, n - 1, n * 3, Math.round(Math.sqrt(n ** 3))], how: `$${n} \\times ${n} \\times ${n} = ${n ** 3}$` };
  }, true);

  add("mean", "data-basic", "Mean of a list", () => {
    const m = ri(12, 60);
    let vals;
    do {
      vals = [0, 1, 2, 3].map(() => ri(m - 10, m + 10));
      vals.push(5 * m - vals.reduce((s, v) => s + v, 0));
    } while (vals[4] < 1 || Math.abs(vals[4] - m) > 20);
    const sorted = vals.slice().sort((a, b) => a - b);
    return { q: `Find the mean of ${vals.join(", ")}.`, ans: [m], show: M(m), wrong: [sorted[2], 5 * m, m + 2, m - 3], how: `The total is $${5 * m}$, and $${5 * m} \\div 5 = ${m}$.` };
  });

  add("median", "data-basic", "Median and mode", () => {
    if (Math.random() < 0.5) {
      const n = pick([5, 7]);
      let vals;
      do vals = Array.from({ length: n }, () => ri(2, 60)); while (new Set(vals).size < n);
      const s = vals.slice().sort((a, b) => a - b), med = s[(n - 1) / 2], sum = vals.reduce((a, b) => a + b, 0);
      const w = [vals[(n - 1) / 2], s[(n - 1) / 2 + 1], s[(n - 1) / 2 - 1]];
      if (sum % n === 0) w.push(sum / n);
      return { q: `Find the median of ${vals.join(", ")}.`, ans: [med], show: M(med), wrong: w, how: `Sort first: ${s.join(", ")}. The middle value is $${med}$.` };
    }
    const mode = ri(2, 20), others = sample([...Array(25).keys()].map((x) => x + 1).filter((x) => x !== mode), 5);
    const vals = shuffle([mode, mode, mode, ...others.slice(0, 2), others[2], others[3], others[3]]);
    return { q: `Find the mode of ${vals.join(", ")}.`, ans: [mode], show: M(mode), wrong: [others[3], others[2], Math.max(...vals)], how: `$${mode}$ appears 3 times, more than any other value.` };
  });

  /* ================= Secondary ================= */
  add("rational", "real-numbers", "Rational and irrational", () => {
    if (Math.random() < 0.5) {
      const c = pick(["\\sqrt2", "\\sqrt3", "\\sqrt5", "\\sqrt7", "\\pi", "2 + \\sqrt3", "3\\sqrt2", "\\sqrt{12}"]);
      const w = sample(["\\sqrt{16}", "\\sqrt{49}", "\\frac{22}{7}", "0.75", "0.\\overline{3}", "1.414", "\\sqrt{\\tfrac{9}{4}}", "-\\frac{5}{8}", "3.1416"], 3);
      return { q: "Which of these numbers is irrational?", opts: [c, ...w].map(M), how: `$${c}$ cannot be written as $\\frac{p}{q}$ and its decimal never ends or repeats. The others are rational: for example $\\sqrt{16} = 4$, $0.\\overline{3} = \\frac13$, and $\\frac{22}{7}$ is only an approximation of $\\pi$.` };
    }
    const d = pick([8, 16, 20, 25, 40, 50, 80, 125]);
    let n; do n = ri(1, d - 1); while (E.gcd(n, d) !== 1);
    const bad = sample([3, 6, 7, 9, 11, 12, 15, 21, 30], 3).map((q) => { let m; do m = ri(1, q - 1); while (E.gcd(m, q) !== 1); return `\\frac{${m}}{${q}}`; });
    return { q: "Which fraction has a terminating decimal expansion?", opts: [`\\frac{${n}}{${d}}`, ...bad].map(M), how: `A fraction in lowest terms terminates exactly when its denominator has no prime factors except 2 and 5. Here $${d} = ${E.factorize(d).map(([p, k]) => (k > 1 ? `${p}^{${k}}` : p)).join(" \\times ")}$.` };
  });

  add("poly-eval", "polynomials", "Remainder theorem", () => {
    const a = nz(-3, 3), b = ri(-5, 5), c = ri(-6, 6), d = ri(-9, 9), k = nz(-3, 3);
    const p = (x) => a * x ** 3 + b * x ** 2 + c * x + d, val = p(k);
    return {
      q: `Find the remainder when $p(x) = ${terms([[a, "x^3"], [b, "x^2"], [c, "x"], [d, ""]])}$ is divided by $${k < 0 ? `x + ${-k}` : `x - ${k}`}$.`,
      ans: [val], show: M(val), wrong: [p(-k), d, val + 1], how: `By the remainder theorem, the remainder is $p(${k}) = ${val}$.`,
    };
  });

  add("factorise", "polynomials", "Factorising quadratics", () => {
    let p, q;
    do { p = nz(-9, 9); q = nz(-9, 9); } while (Math.abs(p) === Math.abs(q));
    const e = terms([[1, "x^2"], [-(p + q), "x"], [p * q, ""]]);
    return { q: `Factorise $${e}$.`, opts: [fx(p) + fx(q), fx(-p) + fx(-q), fx(p) + fx(-q), fx(-p) + fx(q)].map(M), how: `Find two numbers that multiply to $${p * q}$ and add to $${-(p + q)}$: they are $${-p}$ and $${-q}$. So $${e} = ${fx(p)}${fx(q)}$.` };
  });

  add("zeros", "polynomials", "Sum and product of zeros", () => {
    const a = nz(-4, 5), b = nz(-9, 9), c = nz(-9, 9), sum = Math.random() < 0.5;
    const e = terms([[a, "x^2"], [b, "x"], [c, ""]]);
    const v = sum ? -b / a : c / a;
    return {
      q: `If $\\alpha$ and $\\beta$ are the zeros of $${e}$, find $${sum ? "\\alpha + \\beta" : "\\alpha\\beta"}$.`,
      ans: [v], show: M(frac(sum ? -b : c, a)), frac: true, hint: "Fractions such as -3/2 are fine.",
      wrong: sum ? [b / a, c / a, -c / a] : [-c / a, -b / a, b / a],
      how: sum ? `$\\alpha + \\beta = -\\frac{b}{a} = -\\frac{${b}}{${a}} = ${frac(-b, a)}$` : `$\\alpha\\beta = \\frac{c}{a} = \\frac{${c}}{${a}} = ${frac(c, a)}$`,
    };
  }, true);

  add("system", "linear-two", "Simultaneous equations", () => {
    let x, y, a1, b1, a2, b2;
    do { x = ri(-6, 8); y = ri(-6, 8); a1 = nz(-5, 5); b1 = nz(-5, 5); a2 = nz(-5, 5); b2 = nz(-5, 5); } while (a1 * b2 - a2 * b1 === 0 || x === y);
    const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
    const D = a1 * b2 - a2 * b1, Dx = c1 * b2 - c2 * b1, Dy = a1 * c2 - a2 * c1;
    return {
      q: `Solve $${terms([[a1, "x"], [b1, "y"]])} = ${c1}$ and $${terms([[a2, "x"], [b2, "y"]])} = ${c2}$.`,
      ans: [x, y], ordered: true, show: M(`x = ${x},\\ y = ${y}`), form: (v) => `x = ${tn(v[0])},\\ y = ${tn(v[1])}`,
      hint: "Answer as x, y. For example: 3, -2", wrong: [[y, x], [-x, y], [x, -y]],
      how: `By Cramer's rule, $D = ${D}$, $D_x = ${Dx}$ and $D_y = ${Dy}$, so $x = \\frac{${Dx}}{${D}} = ${x}$ and $y = \\frac{${Dy}}{${D}} = ${y}$.`,
    };
  });

  add("quadratic", "quadratic", "Quadratic equations", () => {
    let p, q;
    do { p = ri(-9, 9); q = ri(-9, 9); } while (p === -q && p !== 0);
    const lo = Math.min(p, q), hi = Math.max(p, q);
    return {
      q: `Solve $${terms([[1, "x^2"], [-(p + q), "x"], [p * q, ""]])} = 0$.`,
      ans: p === q ? [p] : [p, q], show: p === q ? `$x = ${p}$ (repeated)` : `$x = ${lo}$ or $x = ${hi}$`,
      form: (v) => (v.length === 1 ? `x = ${tn(v[0])}` : `x = ${tn(Math.min(...v))}\\ \\text{or}\\ ${tn(Math.max(...v))}`),
      hint: "Separate two roots with a comma.", wrong: p === q ? [[-p], [p, -p]] : [[-p, -q], [p, -q], [-p, q], [p * q, p + q]],
      how: `It factorises as $${fx(p)}${fx(q)} = 0$.`,
    };
  });

  add("nature", "quadratic", "Nature of roots", () => {
    const kind = ri(0, 2);
    let a, b, c;
    if (kind === 1) { const k = ri(1, 3), m = nz(-4, 4); a = k * k; c = m * m; b = sgn() * 2 * k * Math.abs(m); }
    else do { a = nz(-4, 5); b = ri(-9, 9); c = nz(-9, 9); } while (kind === 0 ? b * b - 4 * a * c <= 0 : b * b - 4 * a * c >= 0);
    const D = b * b - 4 * a * c, L = ["Two distinct real roots", "Two equal real roots", "No real roots"];
    return { q: `What is the nature of the roots of $${terms([[a, "x^2"], [b, "x"], [c, ""]])} = 0$?`, opts: [L[kind], ...L.filter((_, i) => i !== kind)], how: `$D = b^2 - 4ac = ${par(b)}^2 - 4(${a})(${c}) = ${D}$, which is ${D > 0 ? "positive" : D === 0 ? "zero" : "negative"}.` };
  }, true);

  add("ap", "ap", "Arithmetic progressions", () => {
    const a = ri(-10, 20), d = nz(-6, 9), n = ri(10, 40), v = a + (n - 1) * d;
    return { q: `Find the ${ord(n)} term of $${a}, ${a + d}, ${a + 2 * d}, \\ldots$`, ans: [v], show: M(v), wrong: [a + n * d, a * n + d, v - a], how: `$a = ${a}$ and $d = ${d}$, so $a_{${n}} = ${a} + ${n - 1} \\times ${par(d)} = ${v}$.` };
  });

  add("ap-sum", "ap", "Sum of an AP", () => {
    const a = ri(1, 15), d = ri(1, 8), n = ri(6, 25), Sn = (n * (2 * a + (n - 1) * d)) / 2;
    return { q: `Find the sum of the first ${n} terms of $${a}, ${a + d}, ${a + 2 * d}, \\ldots$`, ans: [Sn], show: M(Sn), wrong: [n * (2 * a + (n - 1) * d), (n * (2 * a + n * d)) / 2, a + (n - 1) * d], how: `$S_{${n}} = \\frac{${n}}{2}\\left[2(${a}) + ${n - 1}(${d})\\right] = ${Sn}$` };
  });

  add("distance", "coordinate", "Distance formula", () => {
    const t = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [12, 5, 13], [8, 15, 17], [9, 12, 15]]);
    const x1 = ri(-6, 6), y1 = ri(-6, 6), x2 = x1 + sgn() * t[0], y2 = y1 + sgn() * t[1];
    return { q: `Find the distance between $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`, ans: [t[2]], show: M(t[2]), wrong: [t[0] + t[1], t[2] ** 2, t[2] + 1], how: `$\\sqrt{${t[0]}^2 + ${t[1]}^2} = \\sqrt{${t[2] ** 2}} = ${t[2]}$` };
  });

  add("midpoint", "coordinate", "Midpoint", () => {
    const x1 = ri(-8, 8), y1 = ri(-8, 8), x2 = x1 + 2 * ri(-6, 6), y2 = y1 + 2 * nz(-6, 6);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return {
      q: `Find the midpoint of $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`, ans: [mx, my], ordered: true, form: (v) => `(${tn(v[0])}, ${tn(v[1])})`, show: M(`(${mx}, ${my})`),
      hint: "Answer as x, y. For example: 3, -2", wrong: [[x1 + x2, y1 + y2], [(x2 - x1) / 2, (y2 - y1) / 2], [my, mx]],
      how: `$\\left(\\frac{${x1} + ${par(x2)}}{2}, \\frac{${y1} + ${par(y2)}}{2}\\right) = (${mx}, ${my})$`,
    };
  });

  add("pythag", "triangles", "Pythagoras", () => {
    const [a, b, c] = scaledTriple();
    if (Math.random() < 0.5) return { q: `A right triangle has legs ${a} and ${b}. Find the hypotenuse.`, ans: [c], show: M(c), wrong: [a + b, c + 1, Math.abs(b - a) + c], how: `$\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${c * c}} = ${c}$` };
    return { q: `A right triangle has hypotenuse ${c} and one leg ${a}. Find the other leg.`, ans: [b], show: M(b), wrong: [c - a, b + 1, c + a], how: `$\\sqrt{${c}^2 - ${a}^2} = \\sqrt{${b * b}} = ${b}$` };
  });

  add("tangent", "circles", "Tangent lengths", () => {
    const [r, t, d] = Math.random() < 0.5 ? scaledTriple() : (([p, q, h]) => [q, p, h])(scaledTriple());
    return { q: `A point is ${d} cm from the centre of a circle of radius ${r} cm. Find the length of the tangent from the point.`, ans: [t], unit: " cm", show: `$${t}$ cm`, wrong: [d - r, d + r, t + 1], how: `The tangent is perpendicular to the radius, so $t = \\sqrt{${d}^2 - ${r}^2} = ${t}$.` };
  });

  const TRIG = [
    ["sin", 0], ["sin", 30], ["sin", 45], ["sin", 60], ["sin", 90],
    ["cos", 0], ["cos", 30], ["cos", 45], ["cos", 60], ["cos", 90],
    ["tan", 0], ["tan", 30], ["tan", 45], ["tan", 60],
  ];
  const trigVal = (f, a) => { const r = (a * Math.PI) / 180, v = f === "sin" ? Math.sin(r) : f === "cos" ? Math.cos(r) : Math.tan(r); return Math.abs(v) < 1e-12 ? 0 : v; };
  add("trig", "trig-basic", "Standard trig values", () => {
    const [f, a] = pick(TRIG), v = trigVal(f, a);
    return { q: M(`\\${f} ${a}^\\circ`), ans: [v], show: M(surd(v)), opts: surdOpts(v, false), hint: "Surds are fine: type sqrt(3)/2.", how: `$\\${f} ${a}^\\circ = ${surd(v)}$, one of the standard values.` };
  }, true);

  add("trig-ratio", "trig-basic", "Trig ratios", () => {
    const [p, b, h] = pick(TRIPLES.slice(0, 5));
    const given = pick(["sin", "cos"]), want = pick(given === "sin" ? ["cos", "tan"] : ["sin", "tan"]);
    const opp = given === "sin" ? p : b, adj = given === "sin" ? b : p;
    const val = { sin: [opp, h], cos: [adj, h], tan: [opp, adj] };
    const [n, d] = val[want];
    return {
      q: `If $\\${given}\\theta = \\frac{${val[given][0]}}{${h}}$ and $\\theta$ is acute, find $\\${want}\\theta$.`,
      ans: [n / d], show: M(`\\frac{${n}}{${d}}`), frac: true, hint: "A fraction such as 5/13.",
      wrong: [d / n, val[given][0] / d, (h - n) / d, n / h].filter((x) => Math.abs(x - n / d) > 1e-9),
      how: `Draw a right triangle with hypotenuse ${h} and the side ${given === "sin" ? "opposite" : "next to"} $\\theta$ equal to ${val[given][0]}. The third side is $\\sqrt{${h}^2 - ${val[given][0]}^2} = ${given === "sin" ? adj : opp}$, so $\\${want}\\theta = \\frac{${n}}{${d}}$.`,
    };
  });

  add("heights", "heights", "Heights and distances", () => {
    const th = pick([30, 45, 60]), d = 5 * ri(2, 20), h = d * Math.tan((th * Math.PI) / 180);
    const forms = { 45: `${d}`, 60: `${d}\\sqrt3`, 30: `\\frac{${d}}{\\sqrt3}` };
    const exact = forms[th];
    const others = [forms[30], forms[45], forms[60], `${2 * d}`, `\\frac{${d}}{2}`].filter((f) => f !== exact);
    return {
      q: `From a point ${d} m from the foot of a tower, the angle of elevation of the top is $${th}^\\circ$. Find the height of the tower.`,
      ans: [h], tol: 0.002, show: th === 45 ? `$${d}$ m` : `$${exact} \\approx ${E.fmt(+h.toFixed(2))}$ m`,
      opts: [exact, ...sample(others, 3)].map((s) => `$${s}$ m`),
      hint: th === 45 ? "" : "A decimal such as 34.64 or an exact form such as 20sqrt(3).",
      how: `$\\tan ${th}^\\circ = \\frac{h}{${d}}$, so $h = ${d} \\tan ${th}^\\circ = ${exact}$.`,
    };
  });

  add("volume", "surface-volume", "Volumes of solids", () => {
    const k = pick(["cube", "cuboid", "cylinder", "cone", "sphere"]);
    let q, v, how, w;
    if (k === "cube") { const a = ri(2, 15); v = a ** 3; w = [6 * a * a, 3 * a, a * a]; q = `a cube of side ${a} cm`; how = `$V = a^3 = ${a}^3 = ${v}$`; }
    else if (k === "cuboid") { const l = ri(3, 15), b = ri(2, 12), h = ri(2, 10); v = l * b * h; w = [2 * (l * b + b * h + h * l), l + b + h, l * b]; q = `a cuboid ${l} cm × ${b} cm × ${h} cm`; how = `$V = lbh = ${l} \\times ${b} \\times ${h} = ${v}$`; }
    else if (k === "cylinder") { const r = 7 * ri(1, 2), h = ri(2, 20); v = (22 / 7) * r * r * h; w = [2 * (22 / 7) * r * h, (22 / 7) * r * h, v / 3]; q = `a cylinder with radius ${r} cm and height ${h} cm`; how = `$V = \\pi r^2 h = \\frac{22}{7} \\times ${r}^2 \\times ${h} = ${E.fmt(v)}$`; }
    else if (k === "cone") { const r = 7 * ri(1, 2), h = 3 * ri(1, 8); v = (1 / 3) * (22 / 7) * r * r * h; w = [v * 3, v / 2, (22 / 7) * r * h]; q = `a cone with radius ${r} cm and height ${h} cm`; how = `$V = \\tfrac13 \\pi r^2 h = \\tfrac13 \\times \\frac{22}{7} \\times ${r}^2 \\times ${h} = ${E.fmt(v)}$`; }
    else { const r = 7 * ri(1, 3); v = (4 / 3) * (22 / 7) * r ** 3; w = [4 * (22 / 7) * r * r, v / 2, (22 / 7) * r ** 3]; q = `a sphere of radius ${r} cm`; how = `$V = \\tfrac43 \\pi r^3 = \\tfrac43 \\times \\frac{22}{7} \\times ${r}^3 \\approx ${E.fmt(+v.toFixed(2))}$`; }
    return { q: `Find the volume of ${q}. Use $\\pi = \\frac{22}{7}$ where needed.`, ans: [v], tol: 0.002, unit: " cm³", show: `$${E.fmt(+v.toFixed(2))}$ cm³`, wrong: w, how };
  });

  add("surface", "surface-volume", "Surface areas", () => {
    const k = pick(["cube", "cuboid", "sphere", "cylinder"]);
    let q, v, how, w;
    if (k === "cube") { const a = ri(2, 15); v = 6 * a * a; w = [a ** 3, 4 * a * a, 12 * a]; q = `the total surface area of a cube of side ${a} cm`; how = `$6a^2 = 6 \\times ${a}^2 = ${v}$`; }
    else if (k === "cuboid") { const l = ri(3, 12), b = ri(2, 10), h = ri(2, 9); v = 2 * (l * b + b * h + h * l); w = [l * b * h, l * b + b * h + h * l, 2 * h * (l + b)]; q = `the total surface area of a cuboid ${l} cm × ${b} cm × ${h} cm`; how = `$2(lb + bh + hl) = 2(${l * b} + ${b * h} + ${h * l}) = ${v}$`; }
    else if (k === "sphere") { const r = 7 * ri(1, 3); v = 4 * (22 / 7) * r * r; w = [(4 / 3) * (22 / 7) * r ** 3, 2 * (22 / 7) * r * r, (22 / 7) * r * r]; q = `the surface area of a sphere of radius ${r} cm`; how = `$4\\pi r^2 = 4 \\times \\frac{22}{7} \\times ${r}^2 = ${v}$`; }
    else { const r = 7 * ri(1, 2), h = ri(3, 20); v = 2 * (22 / 7) * r * h; w = [(22 / 7) * r * r * h, (22 / 7) * r * h, 2 * (22 / 7) * r * (r + h)]; q = `the curved surface area of a cylinder with radius ${r} cm and height ${h} cm`; how = `$2\\pi rh = 2 \\times \\frac{22}{7} \\times ${r} \\times ${h} = ${v}$`; }
    return { q: `Find ${q}. Use $\\pi = \\frac{22}{7}$ where needed.`, ans: [v], tol: 0.002, unit: " cm²", show: `$${E.fmt(+v.toFixed(2))}$ cm²`, wrong: w, how };
  });

  add("grouped-mean", "statistics-grouped", "Mean of grouped data", () => {
    const start = pick([0, 10, 20]);
    let f, mids, sum, n;
    do {
      f = [0, 1, 2, 3].map(() => ri(2, 9));
      mids = [0, 1, 2, 3].map((i) => start + 5 + 10 * i);
      sum = f.reduce((s, x, i) => s + x * mids[i], 0);
      n = f.reduce((s, x) => s + x, 0);
    } while (sum % n !== 0);
    const mean = sum / n;
    const head = mids.map((m) => `${m - 5}\\text{–}${m + 5}`).join(" & ");
    const w = [mids.reduce((a, b) => a + b, 0) / 4, sum / 4, mean + 5].filter((x) => Math.abs(x - mean) > 1e-9);
    return {
      q: `Find the mean of this grouped data: $\\begin{array}{c|cccc} \\text{Class} & ${head} \\\\ \\hline f & ${f.join(" & ")} \\end{array}$`,
      ans: [mean], show: M(mean), wrong: w,
      how: `Use the class marks ${mids.join(", ")}. $\\sum f x = ${sum}$ and $\\sum f = ${n}$, so the mean is $\\frac{${sum}}{${n}} = ${mean}$.`,
    };
  });

  add("dice", "probability-basic", "Dice probability", () => {
    const count = (ok) => { let n = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (ok(a, b)) n++; return n; };
    const kind = ri(0, 2);
    let q, w;
    if (kind === 0) { const s = ri(2, 12); w = count((a, b) => a + b === s); q = `Two dice are thrown. What is the probability that the sum is ${s}?`; }
    else if (kind === 1) { const s = ri(4, 11); w = count((a, b) => a + b >= s); q = `Two dice are thrown. What is the probability that the sum is at least ${s}?`; }
    else { w = 6; q = "Two dice are thrown. What is the probability of a double (both dice the same)?"; }
    return { q, ans: [w / 36], show: M(frac(w, 36)), frac: true, max: 1, hint: "A fraction such as 1/6.", wrong: [w / 12, 1 / w, (w + 1) / 36, w / 6].filter((x) => x <= 1), how: `${w} of the 36 equally likely outcomes work, so $P = \\frac{${w}}{36} = ${frac(w, 36)}$.` };
  });

  add("cards", "probability-basic", "Playing cards", () => {
    const [ev, w] = pick([["a red card", 26], ["a king", 4], ["a face card (J, Q or K)", 12], ["a heart", 13], ["a black king", 2], ["an ace", 4], ["the queen of spades", 1], ["a red face card", 6], ["a number card from 2 to 10", 36], ["a spade or an ace", 16]]);
    return { q: `A card is drawn at random from a well-shuffled deck of 52. What is the probability of drawing ${ev}?`, ans: [w / 52], show: M(frac(w, 52)), frac: true, max: 1, hint: "A fraction such as 1/13.", wrong: [w / 26, 1 / w, (52 - w) / 52, w / 13].filter((x) => x <= 1), how: `There are ${w} favourable cards out of 52, so $P = \\frac{${w}}{52} = ${frac(w, 52)}$.` };
  });

  /* ================= Senior secondary ================= */
  add("sets", "sets", "Union of sets", () => {
    const A = ri(20, 60), B = ri(15, 50), both = ri(3, Math.min(A, B) - 2);
    return { q: `In a group, ${A} people like cricket, ${B} like football and ${both} like both. How many like at least one of the two?`, ans: [A + B - both], show: M(A + B - both), wrong: [A + B, A + B - 2 * both, A + B + both], how: `$n(A \\cup B) = ${A} + ${B} - ${both} = ${A + B - both}$` };
  });

  add("allied", "trig-functions", "Trig of any angle", () => {
    const a = pick([120, 135, 150, 210, 225, 240, 300, 315, 330]), f = pick(["sin", "cos", "tan"]), v = trigVal(f, a);
    const ref = a < 180 ? 180 - a : a < 270 ? a - 180 : 360 - a;
    const base = a < 180 ? `180^\\circ - ${ref}^\\circ` : a < 270 ? `180^\\circ + ${ref}^\\circ` : `360^\\circ - ${ref}^\\circ`;
    const quad = a < 180 ? "second" : a < 270 ? "third" : "fourth";
    return {
      q: `Find $\\${f} ${a}^\\circ$.`, ans: [v], show: M(surd(v)), opts: surdOpts(v, true), hint: "Surds are fine: type -sqrt(3)/2.",
      how: `$${a}^\\circ = ${base}$ is in the ${quad} quadrant, where $\\${f}$ is ${v < 0 ? "negative" : "positive"}. So $\\${f} ${a}^\\circ = ${v < 0 ? "-" : ""}\\${f} ${ref}^\\circ = ${surd(v)}$.`,
    };
  }, true);

  add("complex-mod", "complex", "Modulus of a complex number", () => {
    const t = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]]);
    const [p, q] = Math.random() < 0.5 ? [t[0], t[1]] : [t[1], t[0]];
    const a = sgn() * p, b = sgn() * q;
    return { q: `Find $|z|$ for $z = ${cx(a, b)}$.`, ans: [t[2]], show: M(t[2]), wrong: [p + q, t[2] ** 2, Math.abs(a + b)], how: `$|z| = \\sqrt{${a}^2 + ${par(b)}^2} = \\sqrt{${t[2] ** 2}} = ${t[2]}$` };
  });

  add("complex-mul", "complex", "Multiplying complex numbers", () => {
    let a, b, c, d;
    do { a = nz(-5, 5); b = nz(-5, 5); c = nz(-5, 5); d = nz(-5, 5); } while (b * d === 0 || a * d + b * c === 0 || a * d - b * c === 0);
    const re = a * c - b * d, im = a * d + b * c;
    return {
      q: `Simplify $(${cx(a, b)})(${cx(c, d)})$.`, opts: [cx(re, im), cx(a * c + b * d, im), cx(re, a * d - b * c), cx(a * c, b * d)].map(M),
      how: `Expand: $${a * c} + ${par(a * d)}i + ${par(b * c)}i + ${par(b * d)}i^2$. Since $i^2 = -1$, this is $${cx(re, im)}$.`,
    };
  });

  add("ncr", "pnc", "Combinations", () => {
    const n = ri(5, 12), r = ri(2, 4), v = E.nCr(n, r);
    return { q: `Evaluate $\\binom{${n}}{${r}}$.`, ans: [v], show: M(v), wrong: [v * E.fact(r), E.nCr(n, r + 1), E.nCr(n, r - 1), n * r], how: `$\\binom{${n}}{${r}} = \\frac{${n}!}{${r}!\\,${n - r}!} = ${v}$` };
  }, true);

  add("npr", "pnc", "Permutations", () => {
    if (Math.random() < 0.5) {
      const word = pick(["MATHS", "LOGIC", "PRIME", "DELHI", "FRIEND", "NUMBER", "MONDAY", "EQUATION"]), n = word.length, v = E.fact(n);
      return { q: `In how many ways can the letters of the word ${word} be arranged?`, ans: [v], show: M(v), wrong: [E.fact(n - 1), v / 2, n * n, n * (n - 1)], how: `All ${n} letters are different, so there are $${n}! = ${v}$ arrangements.` };
    }
    const n = ri(5, 10), r = ri(2, 4), v = E.fact(n) / E.fact(n - r);
    return { q: `Evaluate $^{${n}}P_{${r}}$.`, ans: [v], show: M(v), wrong: [E.nCr(n, r), n ** r, E.fact(n) / E.fact(n - r + 1)], how: `$^{${n}}P_{${r}} = \\frac{${n}!}{${n - r}!} = ${v}$` };
  });

  add("binom-coef", "binomial", "Binomial coefficients", () => {
    const n = ri(3, 7), k = ri(1, n - 1), a = pick([2, 3, -1, -2]), C = E.nCr(n, k), v = C * a ** k;
    const inner = `1 ${a < 0 ? "-" : "+"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x`;
    return { q: `Find the coefficient of $${pw("x", k)}$ in $(${inner})^{${n}}$.`, ans: [v], show: M(v), wrong: [C, C * a, -v, E.nCr(n, k + 1) * a ** k], how: `The term is $\\binom{${n}}{${k}}(${a}x)^{${k}}$, so the coefficient is $${C} \\times ${par(a ** k)} = ${v}$.` };
  });

  add("gp-sum", "sequences", "Sum of a GP", () => {
    const a = ri(1, 5), r = pick([2, 3]), n = ri(4, 7), Sn = (a * (r ** n - 1)) / (r - 1);
    return { q: `Find the sum of the first ${n} terms of $${a}, ${a * r}, ${a * r * r}, \\ldots$`, ans: [Sn], show: M(Sn), wrong: [a * r ** (n - 1), (a * (r ** (n + 1) - 1)) / (r - 1), a * r ** n], how: `$S_{${n}} = \\frac{${a}(${r}^{${n}} - 1)}{${r} - 1} = ${Sn}$` };
  });

  add("slope", "lines-conics", "Slope of a line", () => {
    const x1 = ri(-6, 6), y1 = ri(-6, 6);
    let x2, y2; do { x2 = ri(-6, 6); y2 = ri(-6, 6); } while (x2 === x1 || y2 === y1 || Math.abs(y2 - y1) === Math.abs(x2 - x1));
    const m = frac(y2 - y1, x2 - x1);
    return { q: `Find the slope of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`, ans: [(y2 - y1) / (x2 - x1)], show: M(m), frac: true, hint: "Fractions such as -3/4 are fine.", wrong: [(x2 - x1) / (y2 - y1), -(y2 - y1) / (x2 - x1), (y2 + y1) / (x2 + x1 || 1)], how: `$m = \\frac{${y2} - ${par(y1)}}{${x2} - ${par(x1)}} = \\frac{${y2 - y1}}{${x2 - x1}} = ${m}$` };
  });

  add("limit", "limits-derivatives", "Limits", () => {
    const k = ri(0, 2);
    if (k === 0) {
      const a = nz(-6, 6);
      return { q: M(`\\lim_{x \\to ${a}} \\frac{x^2 - ${a * a}}{x ${a < 0 ? "+" : "-"} ${Math.abs(a)}}`), ans: [2 * a], show: M(2 * a), wrong: [a, 0, a * a], how: `Factorise: $\\frac{(x - ${par(a)})(x + ${par(a)})}{x - ${par(a)}} = x + ${par(a)}$, which tends to $${2 * a}$.` };
    }
    if (k === 1) {
      const c = ri(2, 9);
      return { q: M(`\\lim_{x \\to 0} \\frac{\\sin ${c}x}{x}`), ans: [c], show: M(c), frac: true, wrong: [1, 0, 1 / c], how: `$\\frac{\\sin ${c}x}{x} = ${c} \\cdot \\frac{\\sin ${c}x}{${c}x} \\to ${c} \\times 1 = ${c}$` };
    }
    const n = ri(2, 4), a = ri(1, 3), v = n * a ** (n - 1);
    return { q: M(`\\lim_{x \\to ${a}} \\frac{x^{${n}} - ${a ** n}}{x - ${a}}`), ans: [v], show: M(v), wrong: [a ** (n - 1), n * a ** n, (n - 1) * a ** n, 0], how: `This is $\\lim \\frac{x^n - a^n}{x - a} = na^{n-1} = ${n} \\times ${a}^{${n - 1}} = ${v}$.` };
  }, true);

  add("derivative", "limits-derivatives", "Derivatives", () => {
    const a = nz(-5, 5), n = ri(2, 4), b = nz(-6, 6), m = ri(1, n - 1), c = ri(-9, 9), k = ri(-3, 3);
    const v = a * n * k ** (n - 1) + b * m * k ** (m - 1), f = a * k ** n + b * k ** m + c;
    return {
      q: `If $f(x) = ${terms([[a, pw("x", n)], [b, pw("x", m)], [c, ""]])}$, find $f'(${k})$.`,
      ans: [v], show: M(v), wrong: [f, a * k ** (n - 1) + b * k ** (m - 1), v + c],
      how: `$f'(x) = ${terms([[a * n, pw("x", n - 1)], [b * m, pw("x", m - 1)]])}$, so $f'(${k}) = ${v}$.`,
    };
  });

  add("d-expr", "limits-derivatives", "Differentiating functions", () => {
    const A = nz(-5, 5), n = ri(2, 5), B = nz(-4, 4), trig = pick(["sin", "cos"]), C = ri(0, 3);
    const other = trig === "sin" ? "cos" : "sin", ts = trig === "sin" ? 1 : -1;
    const f = terms([[A, pw("x", n)], [B, `\\${trig} x`], [C, "e^x"]]);
    const d = (c, p, s) => terms([[c, pw("x", p)], [s * B, `\\${other} x`], [C, "e^x"]]);
    return {
      q: `Find $\\dfrac{d}{dx}\\left(${f}\\right)$.`, opts: [d(A * n, n - 1, ts), d(A * n, n - 1, -ts), d(A, n - 1, ts), d(A * n, n, ts)].map(M),
      how: `Term by term: $\\frac{d}{dx}x^{${n}} = ${n}x^{${n - 1}}$, $\\frac{d}{dx}\\${trig} x = ${trig === "sin" ? "\\cos x" : "-\\sin x"}$${C ? " and $\\frac{d}{dx}e^x = e^x$" : ""}.`,
    };
  });

  add("maxmin", "app-derivatives", "Maxima and minima", () => {
    const a = ri(1, 3), h = nz(-5, 5), k = ri(-9, 9), b = -2 * a * h, c = a * h * h + k;
    const f = terms([[a, "x^2"], [b, "x"], [c, ""]]);
    if (Math.random() < 0.5) return { q: `Find the minimum value of $f(x) = ${f}$.`, ans: [k], show: M(k), wrong: [h, c, -k, k + a].filter((x) => x !== k), how: `$f'(x) = ${terms([[2 * a, "x"], [b, ""]])} = 0$ gives $x = ${h}$, and $f(${h}) = ${k}$. Since $f''(x) = ${2 * a} > 0$, this is a minimum.` };
    return { q: `At what value of $x$ is $f(x) = ${f}$ smallest?`, ans: [h], show: M(`x = ${h}`), form: (v) => `x = ${tn(v[0])}`, wrong: [-h, k, b], how: `$f'(x) = ${terms([[2 * a, "x"], [b, ""]])} = 0$ gives $x = ${h}$, and $f''(x) = ${2 * a} > 0$, so it is a minimum.` };
  });

  add("integral", "integrals", "Definite integrals", () => {
    const al = ri(1, 3), be = ri(-3, 3), c = ri(-5, 5), k = ri(1, 3);
    const v = al * k ** 3 + be * k ** 2 + c * k, g = 3 * al * k * k + 2 * be * k + c;
    return {
      q: `Evaluate $\\displaystyle\\int_0^{${k}} \\left(${terms([[3 * al, "x^2"], [2 * be, "x"], [c, ""]])}\\right) dx$.`,
      ans: [v], show: M(v), wrong: [g, 6 * al * k + 2 * be, v * 2],
      how: `An antiderivative is $${terms([[al, "x^3"], [be, "x^2"], [c, "x"]])}$. It equals $${v}$ at $x = ${k}$ and $0$ at $x = 0$.`,
    };
  });

  add("indef", "integrals", "Indefinite integrals", () => {
    const n = ri(1, 4), m = nz(-4, 4), A = m * (n + 1), B = nz(-5, 5), trig = pick(["sin", "cos"]);
    const other = trig === "sin" ? "cos" : "sin", s = trig === "cos" ? 1 : -1;
    const intg = terms([[A, pw("x", n)], [B, `\\${trig} x`]]);
    const F = (c, p, sg) => `${terms([[c, pw("x", p)], [sg * B, `\\${other} x`]])} + C`;
    return {
      q: `Find $\\displaystyle\\int \\left(${intg}\\right) dx$.`,
      opts: [F(m, n + 1, s), F(m, n + 1, -s), F(A, n + 1, s), `${terms([[A * n, pw("x", n - 1)], [-s * B, `\\${other} x`]])} + C`].map(M),
      how: `$\\int x^{${n}}\\,dx = \\frac{x^{${n + 1}}}{${n + 1}}$, so $\\int ${A}x^{${n}}\\,dx = ${terms([[m, pw("x", n + 1)]])}$. Also $\\int \\${trig} x\\,dx = ${trig === "sin" ? "-\\cos x" : "\\sin x"}$.`,
    };
  });

  add("de-order", "diff-eq", "Order and degree", () => {
    const D = (k) => (k === 1 ? "\\frac{dy}{dx}" : `\\frac{d^{${k}}y}{dx^{${k}}}`);
    const P = (s, e) => (e === 1 ? s : `\\left(${s}\\right)^{${e}}`);
    const o = ri(1, 3), p = ri(1, 3), q = ri(2, 4);
    const eq = o >= 2 ? `${P(D(o), p)} + ${P(D(o - 1), q)} ${pick(["+ y", "- 3y", "+ 2y"])} = 0` : `${P(D(1), p)} + y^{${q}} = x`;
    const L = (a, b) => `Order ${a}, degree ${b}`;
    const seen = new Set([L(o, p)]), opts = [L(o, p)];
    for (const [a, b] of [[p, o], [o, q], [o + 1, p], [o, p + 1], [Math.max(1, o - 1), q], [o + 1, q]]) {
      const s = L(a, b);
      if (!seen.has(s) && opts.length < 4) { seen.add(s); opts.push(s); }
    }
    return { q: `Find the order and degree of $${eq}$.`, opts, how: `The highest derivative is $${D(o)}$, so the order is ${o}. It is raised to the power ${p}, so the degree is ${p}.` };
  });

  add("det2", "matrices", "2×2 determinants", () => {
    const [a, b, c, d] = [0, 0, 0, 0].map(() => ri(-9, 9));
    return { q: `Find the determinant of $${bm([[a, b], [c, d]])}$.`, ans: [a * d - b * c], show: M(a * d - b * c), wrong: [a * d + b * c, a * b - c * d, b * c - a * d], how: `$ad - bc = ${par(a)}${par(d)} - ${par(b)}${par(c)} = ${a * d - b * c}$` };
  }, true);

  add("matmul", "matrices", "Matrix multiplication", () => {
    const g = () => [[ri(-3, 4), ri(-3, 4)], [ri(-3, 4), ri(-3, 4)]];
    const mul = (X, Y) => [[X[0][0] * Y[0][0] + X[0][1] * Y[1][0], X[0][0] * Y[0][1] + X[0][1] * Y[1][1]], [X[1][0] * Y[0][0] + X[1][1] * Y[1][0], X[1][0] * Y[0][1] + X[1][1] * Y[1][1]]];
    const A = g(), B = g(), AB = mul(A, B);
    const cand = [mul(B, A), [[A[0][0] * B[0][0], A[0][1] * B[0][1]], [A[1][0] * B[1][0], A[1][1] * B[1][1]]], [[AB[0][0], AB[1][0]], [AB[0][1], AB[1][1]]], [[AB[0][0], -AB[0][1]], [AB[1][0], AB[1][1]]], [[AB[0][0] + 1, AB[0][1]], [AB[1][0], AB[1][1] - 1]], [[AB[0][0], AB[0][1] + 2], [AB[1][0], AB[1][1]]], [[AB[0][0] - 1, AB[0][1]], [AB[1][0] + 1, AB[1][1]]]];
    const seen = new Set([bm(AB)]), opts = [bm(AB)];
    for (const C of cand) { const s = bm(C); if (!seen.has(s) && opts.length < 4) { seen.add(s); opts.push(s); } }
    return { q: `If $A = ${bm(A)}$ and $B = ${bm(B)}$, find $AB$.`, opts: opts.map(M), how: `Each entry is a row of $A$ times a column of $B$. For example, the top-left entry is $${par(A[0][0])}${par(B[0][0])} + ${par(A[0][1])}${par(B[1][0])} = ${AB[0][0]}$.` };
  });

  add("dot", "vectors", "Dot product", () => {
    const a = [0, 0, 0].map(() => ri(-5, 5)), b = [0, 0, 0].map(() => ri(-5, 5));
    const v = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    return { q: `Find $\\vec a \\cdot \\vec b$ for $\\vec a = (${a.join(", ")})$ and $\\vec b = (${b.join(", ")})$.`, ans: [v], show: M(v), wrong: [a[0] * b[0] - a[1] * b[1] + a[2] * b[2], v + 2, -v], how: `$${a.map((x, i) => `${par(x)}${par(b[i])}`).join(" + ")} = ${v}$` };
  });

  add("vec-mag", "vectors", "Magnitude of a vector", () => {
    const [p, q, r, m] = pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [4, 8, 8, 12]]);
    const [a, b, c] = shuffle([p, q, r]).map((x) => sgn() * x);
    const v = `${a}\\hat i ${b < 0 ? "-" : "+"} ${Math.abs(b)}\\hat j ${c < 0 ? "-" : "+"} ${Math.abs(c)}\\hat k`;
    return { q: `Find $|\\vec v|$ for $\\vec v = ${v}$.`, ans: [m], show: M(m), wrong: [p + q + r, m * m, Math.abs(a + b + c) || m + 2], how: `$|\\vec v| = \\sqrt{${a}^2 + ${par(b)}^2 + ${par(c)}^2} = \\sqrt{${m * m}} = ${m}$` };
  });

  add("coin-prob", "probability-adv", "Binomial probability", () => {
    const n = ri(3, 6), k = ri(0, n), C = E.nCr(n, k);
    return { q: `A fair coin is tossed ${n} times. What is the probability of exactly ${k} head${k === 1 ? "" : "s"}?`, ans: [C / 2 ** n], show: M(frac(C, 2 ** n)), frac: true, max: 1, hint: "A fraction such as 3/8.", wrong: [1 / 2 ** n, k / n, C / 2 ** (n + 1), (C + 1) / 2 ** n].filter((x) => x <= 1), how: `$\\binom{${n}}{${k}} \\left(\\tfrac12\\right)^{${n}} = \\frac{${C}}{${2 ** n}} = ${frac(C, 2 ** n)}$` };
  });

  add("cond-prob", "probability-adv", "Conditional probability", () => {
    const b = pick([4, 5, 6, 8]), a = ri(1, b - 1);
    return {
      q: `If $P(B) = ${b / 10}$ and $P(A \\cap B) = ${a / 10}$, find $P(A \\mid B)$.`, ans: [a / b], show: M(frac(a, b)), frac: true, max: 1, hint: "A fraction such as 3/4.",
      wrong: [(a * b) / 100, a / 10, b ? (b - a) / b : 0, a / (10 - b)].filter((x) => x > 0 && x <= 1),
      how: `$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{${a / 10}}{${b / 10}} = ${frac(a, b)}$`,
    };
  });

  add("lpp", "lpp", "Corner-point method", () => {
    const p = ri(4, 10), q = ri(4, 10), r = ri(1, p - 1), s = ri(1, q - 1), A = ri(1, 9), B = ri(1, 9);
    const pts = [[0, 0], [p, 0], [r, s], [0, q]], Z = pts.map(([x, y]) => A * x + B * y), mx = Math.max(...Z);
    return {
      q: `The corner points of a feasible region are ${pts.map(([x, y]) => `$(${x}, ${y})$`).join(", ")}. Find the maximum of $Z = ${A}x + ${B}y$.`,
      ans: [mx], show: M(mx), wrong: Z.filter((z) => z !== mx).concat([mx + A, A + B]),
      how: `Evaluate $Z$ at each corner: ${pts.map(([x, y], i) => `$Z(${x}, ${y}) = ${Z[i]}$`).join(", ")}. The largest is $${mx}$.`,
    };
  });

  add("modpow", "number-theory", "Modular powers", () => {
    const p = pick([5, 7, 11, 13]);
    let a; do a = ri(2, 12); while (a % p === 0);
    const k = ri(20, 99), r = k % (p - 1), v = E.modpow(a, k, p);
    return {
      q: `Find the remainder when $${a}^{${k}}$ is divided by $${p}$.`, ans: [v], show: M(v), min: 0, max: p - 1, wrong: [a % p, E.modpow(a, k % p, p), (v + 1) % p, p - 1 - v],
      how: `By Fermat, $${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$. Since $${k} = ${p - 1} \\times ${Math.floor(k / (p - 1))} + ${r}$, the answer is $${a}^{${r}} \\bmod ${p} = ${v}$.`,
    };
  });

  /* ================= College ================= */
  add("eigen", "linear-algebra", "Eigenvalues", () => {
    let a, b; do { a = ri(-4, 6); b = nz(-5, 5); } while (a === 0 && Math.abs(b) === Math.abs(a));
    return {
      q: `Find the eigenvalues of $${bm([[a, b], [b, a]])}$.`, ans: [a + b, a - b], form: (v) => `\\lambda = ${v.map(tn).join(",\\ ")}`,
      show: `$\\lambda = ${Math.min(a + b, a - b)}$ and $\\lambda = ${Math.max(a + b, a - b)}$`, hint: "Separate the two values with a comma.",
      wrong: [[a, b], [2 * a, 0], [a * a - b * b, 2 * a], [-(a + b), -(a - b)]],
      how: `$(${a} - \\lambda)^2 - ${b * b} = 0$, so $\\lambda = ${a} \\pm ${Math.abs(b)}$.`,
    };
  });

  add("partial", "multivariable", "Partial derivatives", () => {
    const a = nz(-4, 4), b = nz(-4, 4), p = nz(-3, 3), q = nz(-3, 3);
    const f = terms([[a, "x^2y"], [b, "xy^2"]]);
    const fx_ = 2 * a * p * q + b * q * q, fy = a * p * p + 2 * b * p * q;
    if (Math.random() < 0.5) return { q: `For $f(x, y) = ${f}$, find $f_x(${p}, ${q})$.`, ans: [fx_], show: M(fx_), wrong: [fy, a * p * q + b * q * q, fx_ + 1].filter((x) => x !== fx_), how: `$f_x = ${terms([[2 * a, "xy"], [b, "y^2"]])}$, which is $${fx_}$ at $(${p}, ${q})$.` };
    return { q: `For $f(x, y) = ${f}$, find $f_y(${p}, ${q})$.`, ans: [fy], show: M(fy), wrong: [fx_, a * p * p + b * p * q, fy - 1].filter((x) => x !== fy), how: `$f_y = ${terms([[a, "x^2"], [2 * b, "xy"]])}$, which is $${fy}$ at $(${p}, ${q})$.` };
  });

  add("taylor", "series", "Maclaurin coefficients", () => {
    const k = ri(0, 3);
    if (k === 0) {
      const c = pick([1, 2, 3, -1, -2]), n = ri(2, 4), v = c ** n / E.fact(n);
      return { q: `Find the coefficient of $x^{${n}}$ in the Maclaurin series of $e^{${c === 1 ? "" : c === -1 ? "-" : c}x}$.`, ans: [v], show: M(frac(c ** n, E.fact(n))), frac: true, wrong: [c ** n, 1 / E.fact(n), -v, c / E.fact(n)], how: `$e^{u} = \\sum \\frac{u^n}{n!}$ with $u = ${c === 1 ? "" : c === -1 ? "-" : c}x$, so the coefficient is $\\frac{${par(c)}^{${n}}}{${n}!} = ${frac(c ** n, E.fact(n))}$.` };
    }
    if (k === 1) {
      const f = pick(["sin", "cos"]), n = f === "sin" ? pick([3, 5]) : pick([2, 4]), sg = f === "sin" ? ((n - 1) / 2) % 2 ? -1 : 1 : (n / 2) % 2 ? -1 : 1, v = sg / E.fact(n);
      return { q: `Find the coefficient of $x^{${n}}$ in the Maclaurin series of $\\${f} x$.`, ans: [v], show: M(frac(sg, E.fact(n))), frac: true, wrong: [-v, 1 / n, sg / n], how: `$\\${f} x = ${f === "sin" ? "x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots" : "1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots"}$, so the coefficient is $${frac(sg, E.fact(n))}$.` };
    }
    if (k === 2) {
      const n = ri(2, 6), v = (n % 2 ? 1 : -1) / n;
      return { q: `Find the coefficient of $x^{${n}}$ in the Maclaurin series of $\\ln(1 + x)$.`, ans: [v], show: M(frac(n % 2 ? 1 : -1, n)), frac: true, wrong: [-v, 1 / E.fact(n), 1 / (n + 1)], how: `$\\ln(1 + x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\cdots$, so the coefficient of $x^{${n}}$ is $${frac(n % 2 ? 1 : -1, n)}$.` };
    }
    const c = pick([2, 3, -2]), n = ri(2, 4), v = c ** n;
    return { q: `Find the coefficient of $x^{${n}}$ in the Maclaurin series of $\\dfrac{1}{1 ${c < 0 ? "+" : "-"} ${Math.abs(c)}x}$.`, ans: [v], show: M(v), wrong: [c * n, -v, v / E.fact(n)], how: `$\\frac{1}{1 - u} = 1 + u + u^2 + \\cdots$ with $u = ${c}x$, so the coefficient is $${par(c)}^{${n}} = ${v}$.` };
  });

  add("ode2", "ode2", "Second-order ODEs", () => {
    const ex = (r) => `e^{${r === 1 ? "" : r === -1 ? "-" : r}x}`;
    if (Math.random() < 0.75) {
      let r1, r2; do { r1 = nz(-5, 5); r2 = nz(-5, 5); } while (r1 >= r2 || r1 === -r2);
      const b = -(r1 + r2), c = r1 * r2;
      return {
        q: `Find the general solution of $${terms([[1, "y''"], [b, "y'"], [c, "y"]])} = 0$.`,
        opts: [`y = C_1${ex(r1)} + C_2${ex(r2)}`, `y = C_1${ex(-r1)} + C_2${ex(-r2)}`, `y = (C_1 + C_2x)${ex(r1)}`, `y = (C_1 + C_2x)${ex(r2)}`].map(M),
        how: `The auxiliary equation $${terms([[1, "m^2"], [b, "m"], [c, ""]])} = 0$ has distinct real roots $m = ${r1}$ and $m = ${r2}$.`,
      };
    }
    const r = nz(-4, 4);
    return {
      q: `Find the general solution of $${terms([[1, "y''"], [-2 * r, "y'"], [r * r, "y"]])} = 0$.`,
      opts: [`y = (C_1 + C_2x)${ex(r)}`, `y = C_1${ex(r)} + C_2${ex(-r)}`, `y = (C_1 + C_2x)${ex(-r)}`, `y = C_1\\cos ${Math.abs(r) === 1 ? "" : Math.abs(r)}x + C_2\\sin ${Math.abs(r) === 1 ? "" : Math.abs(r)}x`].map(M),
      how: `The auxiliary equation $${terms([[1, "m^2"], [-2 * r, "m"], [r * r, ""]])} = (m - ${par(r)})^2 = 0$ has a repeated root $m = ${r}$, which gives $(C_1 + C_2x)e^{mx}$.`,
    };
  });

  add("modinv", "number-theory", "Modular inverses", () => {
    const p = pick([7, 11, 13, 17]), a = ri(2, p - 1);
    let x = 1; while ((a * x) % p !== 1) x++;
    return { q: `Find the inverse of ${a} modulo ${p}, as a number from 1 to ${p - 1}.`, ans: [x], show: M(x), min: 1, max: p - 1, wrong: [p - x, a, (x % (p - 1)) + 1, p - a].filter((v) => v !== x && v > 0 && v < p), how: `$${a} \\times ${x} = ${a * x} = ${p} \\times ${Math.floor((a * x) / p)} + 1$, so $${a} \\times ${x} \\equiv 1 \\pmod{${p}}$.` };
  });

  add("graph-edges", "graphs", "Counting edges", () => {
    if (Math.random() < 0.5) {
      const n = ri(4, 12), v = (n * (n - 1)) / 2;
      return { q: `How many edges does the complete graph $K_{${n}}$ have?`, ans: [v], show: M(v), wrong: [n * (n - 1), n, n * (n + 1) / 2], how: `Every pair of the ${n} vertices is joined, so there are $\\binom{${n}}{2} = ${v}$ edges.` };
    }
    let degs; do degs = Array.from({ length: ri(5, 7) }, () => ri(1, 5)); while (degs.reduce((a, b) => a + b, 0) % 2);
    const sum = degs.reduce((a, b) => a + b, 0);
    return { q: `A graph has vertex degrees ${degs.join(", ")}. How many edges does it have?`, ans: [sum / 2], show: M(sum / 2), wrong: [sum, degs.length, sum / 2 + 1], how: `By the handshake lemma, the degrees add up to twice the number of edges: $${sum} \\div 2 = ${sum / 2}$.` };
  });

  add("zscore", "stats-inference", "z-scores", () => {
    const mu = 5 * ri(8, 20), sd = pick([2, 4, 5, 8, 10]), z = pick([-2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5]), x = mu + z * sd;
    return { q: `Test scores have mean ${mu} and standard deviation ${sd}. Find the z-score of a score of ${x}.`, ans: [z], show: M(z), dec: true, wrong: [-z, (x - mu) / (sd * sd), z * 2], how: `$z = \\frac{x - \\mu}{\\sigma} = \\frac{${x} - ${mu}}{${sd}} = ${z}$` };
  });

  /* ================= Multiple-choice builder ================= */
  function tn(x) {
    if (!isFinite(x)) return "\\text{undefined}";
    if (Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x));
    const f = E.toFrac(x, 1000);
    if (f && Math.abs(f[0] / f[1] - x) < 1e-9) return `${f[0] < 0 ? "-" : ""}\\frac{${Math.abs(f[0])}}{${f[1]}}`;
    return E.fmt(+x.toFixed(3));
  }
  const tdec = (x, dp) => E.fmt(+x.toFixed(dp));
  const nice = (x) => {
    if (!isFinite(x)) return false;
    if (Math.abs(x - Math.round(x)) < 1e-9) return true;
    const f = E.toFrac(x, 100);
    return !!(f && Math.abs(f[0] / f[1] - x) < 1e-9);
  };

  function perturb(v, item) {
    if (item.tol) return [0.9, 1.1, 0.8, 1.25, 0.5, 2, 0.75, 1.5].map((f) => v * f);
    if (item.dec && !Number.isInteger(v)) return [0.1, -0.1, 1, -1, 0.01, -0.01, 0.5, -0.5].map((k) => +(v + k).toFixed(3)).concat([v * 10, v / 10]);
    if (Number.isInteger(v)) {
      const a = Math.abs(v);
      const s = a >= 2000 ? 10 ** (Math.floor(Math.log10(a)) - 1) : a >= 30 ? 10 : 1;
      const out = [1, -1, 2, -2, 3, -3].map((k) => v + k * s);
      if (s > 1) out.push(v + 1, v - 1, v + s / 2, v - s / 2);
      out.push(-v, 2 * v);
      return out;
    }
    const f = E.toFrac(v, 1000);
    if (f && Math.abs(f[0] / f[1] - v) < 1e-9) {
      const [n, d] = f;
      return [(n + 1) / d, (n - 1) / d, n / (d + 1), d > 2 ? n / (d - 1) : (n + 2) / d, d / n, -n / d, (2 * n) / d, n / (2 * d)];
    }
    return [v + 0.5, v - 0.5, v + 1, v - 1, v * 2, v / 2];
  }

  function mcq(item) {
    if (item.opts) {
      const seen = new Set(), list = [];
      for (const o of item.opts) if (!seen.has(o)) { seen.add(o); list.push(o); }
      const right = list[0];
      const choices = shuffle([right, ...shuffle(list.slice(1)).slice(0, 3)]);
      return { choices, ci: choices.indexOf(right) };
    }
    const dp = item.tol ? 2 : 3;
    const num = item.tol || item.dec ? (x) => tdec(x, dp) : tn;
    const form = item.form || ((v) => v.map(num).join(",\\ "));
    const out = item.money ? (v) => inr(Math.round(v[0] * 100) / 100) : (v) => `$${form(v)}$${item.unit || ""}`;
    const norm = (v) => (item.ordered ? v : v.slice().sort((a, b) => a - b));
    const right = out(norm(item.ans));
    const seen = new Set([right]), wrongs = [];
    const allPos = item.ans.every((x) => x >= 0);
    const lo = item.min != null ? item.min : allPos ? 0 : -Infinity, hi = item.max != null ? item.max : Infinity;
    const ok = (x) => isFinite(x) && x >= lo && x <= hi && (item.tol || item.dec || item.frac || nice(x)) && (item.tol || item.dec || Math.abs(x) < 1e7);
    const intOnly = item.ans.every(Number.isInteger) && !item.frac && !item.dec && !item.tol;
    const tryAdd = (v) => {
      if (wrongs.length >= 3) return;
      if (!v.every(ok)) return;
      if (intOnly && !v.every(Number.isInteger)) return;
      const s = out(norm(v));
      if (seen.has(s)) return;
      seen.add(s);
      wrongs.push(s);
    };
    shuffle((item.wrong || []).map((w) => (Array.isArray(w) ? w : [w]))).forEach(tryAdd);
    const base = item.ans;
    const cands = [];
    if (base.length === 1) perturb(base[0], item).forEach((x) => cands.push([x]));
    else {
      base.forEach((v, i) => perturb(v, item).slice(0, 6).forEach((x) => { const w = base.slice(); w[i] = x; cands.push(w); }));
      cands.push(base.map((x) => -x));
    }
    shuffle(cands).forEach(tryAdd);
    for (let k = 1; wrongs.length < 3 && k < 60; k++) tryAdd(base.map((x, i) => (i === 0 ? x + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (Number.isInteger(x) ? 1 : 0.5) : x)));
    const choices = shuffle([right, ...wrongs]);
    return { choices, ci: choices.indexOf(right) };
  }

  function make(skill) {
    const item = skill.gen();
    item.skill = skill.id;
    if (!item.ans) item.mcqOnly = true;
    const m = mcq(item);
    item.choices = m.choices;
    item.ci = m.ci;
    if (!item.show) item.show = m.choices[m.ci];
    delete item.form;
    delete item.opts;
    delete item.wrong;
    return item;
  }

  function seeded(seed, fn) {
    const orig = Math.random;
    let a = seed >>> 0;
    Math.random = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    try { return fn(); } finally { Math.random = orig; }
  }

  window.MZ_SKILLS = S;
  window.MZ_MAKE = make;
  window.MZ_SEEDED = seeded;
  window.MZ_SHUFFLE = shuffle;

  window.MZ_CHECK = function (input, item) {
    let raw = String(input).trim().toLowerCase().replace(/π/g, "pi").replace(/√/g, "sqrt").replace(/−/g, "-");
    if (!raw) return { empty: true };
    if (/^\(.*\)$/.test(raw) && raw.includes(",")) raw = raw.slice(1, -1);
    const parts = raw
      .replace(/\b(or|and)\b/g, ",")
      .replace(/₹|rs\.?/g, "")
      .split(/[,;]/)
      .map((p) => p.replace(/^\s*[a-zλ]\s*=/, "").replace(/\s*(cm|mm|km|m|kg|g|minutes?|mins?|paise|m\/s|km\/h)(²|³|\^2|\^3)?\s*$|\s*(°|%|degrees?)\s*$/, "").trim())
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
