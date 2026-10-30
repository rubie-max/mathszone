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
  const pf = (n) => E.factorize(n).map(([p, k]) => (k > 1 ? `${p}^{${k}}` : p)).join(" \\times ");
  const f2 = (x) => E.fmt(+x.toFixed(2));
  const PLACES = ["Ones", "Tens", "Hundreds", "Thousands"];
  function colAdd(x, y) {
    const out = [];
    let carry = 0;
    for (let i = 0; x || y; i++) {
      const dx = x % 10, dy = y % 10, t = dx + dy + carry;
      out.push(`${PLACES[i]}: $${dx} + ${dy}${carry ? " + 1" : ""} = ${t}$${t >= 10 ? `. Write ${t % 10} and carry 1.` : "."}`);
      carry = t >= 10 ? 1 : 0;
      x = Math.floor(x / 10); y = Math.floor(y / 10);
    }
    if (carry) out.push(`The carried 1 becomes the thousands digit.`);
    return out;
  }
  function colSub(x, y) {
    const out = [];
    let borrow = 0;
    for (let i = 0; x || y; i++) {
      const ox = x % 10, dy = y % 10;
      if (borrow && ox === 0) out.push(`${PLACES[i]}: this 0 lent 1 to the right, so it borrows from the next place and becomes 9. $9 - ${dy} = ${9 - dy}$.`);
      else {
        const dx = ox - borrow, lent = borrow ? ` (it lent 1, so ${ox} is now ${dx})` : "";
        if (dx < dy) { out.push(`${PLACES[i]}${lent}: ${dx} is smaller than ${dy}, so borrow 1 from the next place. $${dx + 10} - ${dy} = ${dx + 10 - dy}$.`); borrow = 1; }
        else { out.push(`${PLACES[i]}${lent}: $${dx} - ${dy} = ${dx - dy}$.`); borrow = 0; }
      }
      x = Math.floor(x / 10); y = Math.floor(y / 10);
    }
    return out;
  }

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
      how: [
        `Find where the ${d} sits in ${n.toLocaleString("en-IN")}: it is in the ${names[i]} place.`,
        `Each unit in the ${names[i]} place is worth $${p}$.`,
        `Place value $= ${d} \\times ${p} = ${val}$.`,
      ],
    };
  }, true);

  add("round", "place-value", "Rounding", () => {
    const n = ri(1000, 99999);
    const [p, nm] = pick([[10, "ten"], [100, "hundred"], [1000, "thousand"]]);
    const r = Math.round(n / p) * p, dig = Math.floor(n / (p / 10)) % 10;
    return {
      q: `Round ${n.toLocaleString("en-IN")} to the nearest ${nm}.`,
      ans: [r], show: M(r), wrong: [Math.floor(n / p) * p, Math.ceil(n / p) * p, r + p, r - p, Math.round(n / (p * 10)) * p * 10],
      how: [
        `Look at the digit just after the ${nm}s place. In ${n.toLocaleString("en-IN")} it is ${dig}.`,
        dig >= 5 ? `${dig} is 5 or more, so round up: the ${nm}s digit goes up by 1.` : `${dig} is less than 5, so round down: the ${nm}s digit stays the same.`,
        `Change every digit after the ${nm}s place to 0: the answer is $${r}$.`,
      ],
    };
  }, true);

  add("add", "add-sub", "Add and subtract", () => {
    const a = ri(120, 999), b = ri(100, 899);
    const noCarry = (x, y) => { let r = 0, p = 1; while (x || y) { r += ((x % 10) + (y % 10)) % 10 * p; x = Math.floor(x / 10); y = Math.floor(y / 10); p *= 10; } return r; };
    const noBorrow = (x, y) => { let r = 0, p = 1; while (x || y) { r += Math.abs((x % 10) - (y % 10)) * p; x = Math.floor(x / 10); y = Math.floor(y / 10); p *= 10; } return r; };
    if (Math.random() < 0.5) return { q: M(`${a} + ${b}`), ans: [a + b], show: M(a + b), wrong: [noCarry(a, b), a + b + 10, a + b - 10, a + b + 100], how: [`Write ${a} and ${b} in columns and add from the right.`, ...colAdd(a, b), `So $${a} + ${b} = ${a + b}$.`] };
    const x = Math.max(a, b), y = Math.min(a, b);
    return { q: M(`${x} - ${y}`), ans: [x - y], show: M(x - y), wrong: [noBorrow(x, y), x - y + 10, x - y - 10, x - y + 100], how: [`Write ${y} under ${x} and subtract from the right.`, ...colSub(x, y), `So $${x} - ${y} = ${x - y}$. Check: $${x - y} + ${y} = ${x}$.`] };
  }, true);

  add("missing", "add-sub", "Missing numbers", () => {
    const a = ri(12, 99), b = ri(12, 99);
    if (Math.random() < 0.5) return { q: `Find the missing number: $\\square + ${a} = ${a + b}$`, ans: [b], show: M(b), wrong: [a + b + a, a, b + 10, b - 1], how: [`To undo "$+ ${a}$", subtract ${a} from ${a + b}.`, `$\\square = ${a + b} - ${a} = ${b}$.`, `Check: $${b} + ${a} = ${a + b}$.`] };
    return { q: `Find the missing number: $${a + b} - \\square = ${a}$`, ans: [b], show: M(b), wrong: [a + b + a, a, b - 10, b + 1], how: [`The missing number is what you take away from ${a + b} to leave ${a}.`, `$\\square = ${a + b} - ${a} = ${b}$.`, `Check: $${a + b} - ${b} = ${a}$.`] };
  }, true);

  add("tables", "mult-div", "Times tables", () => {
    const a = ri(2, 12), b = ri(2, 12);
    return { q: M(`${a} \\times ${b}`), ans: [a * b], show: M(a * b), wrong: [a * (b + 1), a * (b - 1), (a + 1) * b, a + b], how: [`$${a} \\times ${b}$ means ${b} lots of ${a}.`, `Count up in ${a}s: ${Array.from({ length: b }, (_, i) => a * (i + 1)).join(", ")}.`, `The ${ord(b)} number is ${a * b}, so $${a} \\times ${b} = ${a * b}$.`] };
  }, true);

  add("divide", "mult-div", "Division", () => {
    const b = ri(2, 12), q = ri(2, 30), a = b * q;
    const T = Math.floor(q / 10) * 10, R = q - T;
    const split = q <= 12 ? `Use the ${b} times table: $${b} \\times ${q} = ${a}$.`
      : R === 0 ? `$${b} \\times ${T} = ${a}$, so ${T} lots of ${b} make ${a}.`
      : `Split ${a} into $${b * T} + ${b * R}$. Then $${b * T} \\div ${b} = ${T}$ and $${b * R} \\div ${b} = ${R}$, and $${T} + ${R} = ${q}$.`;
    return { q: M(`${a} \\div ${b}`), ans: [q], show: M(q), wrong: [q + 1, q - 1, q + 2, q + 10], how: [`$${a} \\div ${b}$ asks: how many ${b}s make ${a}?`, split, `So $${a} \\div ${b} = ${q}$. Check: $${b} \\times ${q} = ${a}$.`] };
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
      how: [
        `The denominators ${d1} and ${d2} are different. Their LCM is ${L}, so use ${L} as the common denominator.`,
        `Rewrite each fraction: ${[[n1, d1], [n2, d2]].map(([n, d]) => (d === L ? `$\\frac{${n}}{${d}}$ already has denominator ${L}` : `$\\frac{${n}}{${d}} = \\frac{${n} \\times ${L / d}}{${d} \\times ${L / d}} = \\frac{${n * (L / d)}}{${L}}$`)).join(" and ")}.`,
        `Add the numerators and keep the denominator: $\\frac{${n1 * (L / d1)} + ${n2 * (L / d2)}}{${L}} = \\frac{${N}}{${L}}$.`,
        E.gcd(N, L) > 1 ? `Simplify by dividing top and bottom by ${E.gcd(N, L)}: $\\frac{${N}}{${L}} = ${simple}$.` : `${N} and ${L} have no common factor, so $\\frac{${N}}{${L}}$ is already in simplest form.`,
      ],
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
      how: [
        `Find the HCF (highest common factor) of ${N} and ${D}: it is ${k}.`,
        `Divide the top and the bottom by ${k}: $\\frac{${N} \\div ${k}}{${D} \\div ${k}} = \\frac{${n0}}{${d0}}$.`,
        `${n0} and ${d0} share no factor other than 1, so $\\frac{${n0}}{${d0}}$ is the simplest form.`,
      ],
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
      how: [
        `Turn each fraction into a decimal by dividing the top by the bottom.`,
        list.map(([n, d]) => `$\\frac{${n}}{${d}} \\approx ${(n / d).toFixed(3)}$`).join(", "),
        `In order from ${big ? "largest to smallest" : "smallest to largest"}, the first one is $\\frac{${list[0][0]}}{${list[0][1]}}$, so it is the ${big ? "largest" : "smallest"}.`,
      ],
    };
  }, true);

  add("decimals", "decimals", "Decimals", () => {
    const k = ri(0, 2);
    if (k === 0) {
      const a = ri(11, 99) / 10, b = ri(101, 999) / 100, s = (Math.round(a * 100) + Math.round(b * 100)) / 100;
      const slip = (Math.round(a * 10) + Math.round(b * 100)) / 100;
      return { q: M(`${a} + ${b}`), ans: [s], show: M(E.fmt(s)), dec: true, wrong: [slip, s + 1, s - 0.1, s + 0.01], how: [`Give both numbers the same number of decimal places: $${a.toFixed(2)}$ and $${b.toFixed(2)}$.`, `Line up the decimal points and add as if they were whole numbers: $${Math.round(a * 100)} + ${Math.round(b * 100)} = ${Math.round(s * 100)}$.`, `Put the decimal point back, 2 places from the right: $${s.toFixed(2)}${s.toFixed(2) !== E.fmt(s) ? ` = ${E.fmt(s)}` : ""}$.`] };
    }
    if (k === 1) {
      const a = ri(101, 999) / 100, p = pick([10, 100, 1000]), v = +(a * p).toFixed(2);
      return { q: M(`${a} \\times ${p}`), ans: [v], show: M(E.fmt(v)), dec: true, wrong: [v * 10, v / 10, a + p, v / 100], how: [`${p} has ${Math.log10(p)} zero${p > 10 ? "s" : ""}, so multiplying by ${p} moves the decimal point ${Math.log10(p)} place${p > 10 ? "s" : ""} to the right.`, `$${a.toFixed(2)} \\to ${E.fmt(v)}$`, `So $${a} \\times ${p} = ${E.fmt(v)}$.`] };
    }
    let a; do a = ri(11, 99); while (a % 10 === 0);
    const b = ri(2, 9), v = +((a * b) / 100).toFixed(2);
    return { q: M(`${a / 10} \\times 0.${b}`), ans: [v], show: M(E.fmt(v)), dec: true, wrong: [v * 10, v / 10, +(a / 10 + b / 10).toFixed(2)], how: [`Ignore the decimal points and multiply the whole numbers: $${a} \\times ${b} = ${a * b}$.`, `Count the decimal places: $${a / 10}$ has 1 and $0.${b}$ has 1, so the answer needs $1 + 1 = 2$.`, `Put 2 decimal places into ${a * b}: $${(v).toFixed(2)}${(v).toFixed(2) !== E.fmt(v) ? ` = ${E.fmt(v)}` : ""}$.`] };
  }, true);

  add("measure", "measurement", "Units and time", () => {
    const k = ri(0, 3);
    if (k === 0) {
      const h = ri(1, 5), m = ri(5, 55);
      return { q: `How many minutes are there in ${h} h ${m} min?`, ans: [h * 60 + m], unit: " minutes", show: `$${h * 60 + m}$ minutes`, wrong: [h * 100 + m, h * 60, h * 60 + m + 10, h * 60 - m], how: [`1 hour = 60 minutes.`, `So ${h} hour${h > 1 ? "s" : ""} $= ${h} \\times 60 = ${h * 60}$ minutes.`, `Add the extra ${m} minutes: $${h * 60} + ${m} = ${h * 60 + m}$ minutes.`] };
    }
    if (k === 1) {
      const km = ri(101, 999) / 100, m = Math.round(km * 1000);
      return { q: `How many metres are there in ${km} km?`, ans: [m], unit: " m", show: `$${m}$ m`, wrong: [m / 10, m * 10, Math.round(km * 100)], how: [`1 km = 1000 m, so multiply by 1000.`, `Multiplying by 1000 moves the decimal point 3 places to the right.`, `$${km} \\times 1000 = ${m}$, so the answer is ${m} m.`] };
    }
    if (k === 2) {
      const kg = ri(1, 9), g = ri(15, 950), t = kg * 1000 + g;
      return { q: `Write ${kg} kg ${g} g in grams.`, ans: [t], unit: " g", show: `$${t}$ g`, wrong: [kg * 100 + g, +`${kg}${g}`, kg * 1000 - g, t + 1000], how: [`1 kg = 1000 g.`, `So ${kg} kg $= ${kg} \\times 1000 = ${kg * 1000}$ g.`, `Add the ${g} g: $${kg * 1000} + ${g} = ${t}$ g.`] };
    }
    const r = ri(2, 99), p = pick([5, 10, 25, 50, 75]), t = r * 100 + p;
    return { q: `How many paise make ₹${r}.${String(p).padStart(2, "0")}?`, ans: [t], unit: " paise", show: `$${t}$ paise`, wrong: [r * 10 + p, r + p, t * 10, r * 100], how: [`₹1 = 100 paise.`, `So ₹${r} $= ${r} \\times 100 = ${r * 100}$ paise.`, `Add the ${p} paise after the point: $${r * 100} + ${p} = ${t}$ paise.`] };
  }, true);

  add("rect", "perimeter-area", "Perimeter and area", () => {
    const l = ri(4, 30), b = ri(3, l - 1);
    if (Math.random() < 0.5) return { q: `A rectangle is ${l} cm long and ${b} cm wide. Find its area in cm².`, ans: [l * b], unit: " cm²", show: `$${l * b}$ cm²`, wrong: [2 * (l + b), l + b, l * b + l], how: [`Area of a rectangle $=$ length $\\times$ breadth.`, `$A = ${l} \\times ${b} = ${l * b}$`, `Area is in square units, so the answer is ${l * b} cm².`] };
    return { q: `A rectangle is ${l} cm long and ${b} cm wide. Find its perimeter in cm.`, ans: [2 * (l + b)], unit: " cm", show: `$${2 * (l + b)}$ cm`, wrong: [l * b, l + b, 2 * l + b], how: [`Perimeter is the distance all the way round: two lengths and two breadths, $P = 2(l + b)$.`, `Add the length and breadth: $${l} + ${b} = ${l + b}$.`, `Double it: $2 \\times ${l + b} = ${2 * (l + b)}$ cm.`] };
  });

  /* ================= Middle school ================= */
  add("integers", "integers", "Integers", () => {
    const a = nz(-25, 25), b = nz(-25, 25), c = nz(-25, 25);
    return { q: M(`${a} + ${par(b)} - ${par(c)}`), ans: [a + b - c], show: M(a + b - c), wrong: [a + b + c, a - b - c, -a + b - c, -(a + b - c)], how: [
      `Remove the brackets: adding a negative is subtracting, and subtracting a negative is adding.`,
      `$${a} + ${par(b)} - ${par(c)} = ${a} ${b < 0 ? "-" : "+"} ${Math.abs(b)} ${c < 0 ? "+" : "-"} ${Math.abs(c)}$`,
      `Work from left to right: $${a} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${a + b}$.`,
      `Then $${a + b} ${c < 0 ? "+" : "-"} ${Math.abs(c)} = ${a + b - c}$.`,
    ].filter((_, i) => b < 0 || c < 0 || i > 1) };
  }, true);

  add("bodmas", "integers", "Order of operations", () => {
    const k = ri(0, 2);
    if (k === 0) {
      const a = ri(2, 20), b = ri(2, 9), c = ri(2, 9);
      return { q: M(`${a} + ${b} \\times ${c}`), ans: [a + b * c], show: M(a + b * c), wrong: [(a + b) * c, a * b + c, a + b + c], how: [`BODMAS: multiplication comes before addition.`, `Multiply first: $${b} \\times ${c} = ${b * c}$.`, `Then add: $${a} + ${b * c} = ${a + b * c}$.`] };
    }
    if (k === 1) {
      const c = ri(2, 6), q = ri(2, 9), b = c * q, d = ri(2, 5), a = ri(b, 60);
      const w = [];
      if ((a - b) % c === 0) w.push(((a - b) / c) * d);
      if (b % (c * d) === 0) w.push(a - b / (c * d));
      w.push(a - q, a - q * d + d);
      return { q: M(`${a} - ${b} \\div ${c} \\times ${d}`), ans: [a - q * d], show: M(a - q * d), wrong: w, how: [`BODMAS: division and multiplication come before subtraction, worked from left to right.`, `Divide: $${b} \\div ${c} = ${q}$.`, `Multiply: $${q} \\times ${d} = ${q * d}$.`, `Subtract last: $${a} - ${q * d} = ${a - q * d}$.`] };
    }
    const a = ri(2, 12), b = ri(2, 12), c = ri(2, 6), d = ri(1, 20);
    return { q: M(`(${a} + ${b}) \\times ${c} - ${d}`), ans: [(a + b) * c - d], show: M((a + b) * c - d), wrong: [a + b * c - d, (a + b) * (c - d), (a + b) * c + d], how: [`Brackets first: $${a} + ${b} = ${a + b}$.`, `Multiply next: $${a + b} \\times ${c} = ${(a + b) * c}$.`, `Subtract last: $${(a + b) * c} - ${d} = ${(a + b) * c - d}$.`] };
  }, true);

  add("hcf", "factors-multiples", "HCF and LCM", () => {
    const g = ri(2, 12), m = ri(2, 9);
    let n; do n = ri(2, 9); while (n === m || E.gcd(m, n) !== 1);
    const a = g * m, b = g * n, H = E.gcd(a, b), L = (a * b) / H;
    const prime = `Write each number as a product of primes: $${a} = ${pf(a)}$ and $${b} = ${pf(b)}$.`;
    if (Math.random() < 0.5) return { q: `Find the HCF of ${a} and ${b}.`, ans: [H], show: M(H), wrong: [L, H * 2, Math.min(m, n), 1].filter((x) => x !== H), how: [prime, `The HCF uses only the primes in both numbers, each with its smaller power: $${pf(H)}$.`, `HCF $= ${H}$.`] };
    return { q: `Find the LCM of ${a} and ${b}.`, ans: [L], show: M(L), wrong: [H, a * b, L * 2, L / 2], how: [prime, `The LCM uses every prime that appears, each with its larger power: $${pf(L)}$.`, `LCM $= ${L}$.`, `Check: HCF $\\times$ LCM $= ${H} \\times ${L} = ${a * b} = ${a} \\times ${b}$.`] };
  }, true);

  add("proportion", "ratio-proportion", "Ratio and proportion", () => {
    const a = ri(2, 9);
    let b; do b = ri(2, 9); while (b === a);
    const k = ri(2, 9);
    return { q: `Find $x$ if $${a} : ${b} = ${a * k} : x$.`, ans: [b * k], show: M(`x = ${b * k}`), wrong: [a * k + b - a, b + k, a * k * b], how: [`Write the ratios as fractions: $\\frac{${a}}{${b}} = \\frac{${a * k}}{x}$.`, `Cross-multiply: $${a}x = ${b} \\times ${a * k} = ${a * b * k}$.`, `Divide by ${a}: $x = \\frac{${a * b * k}}{${a}} = ${b * k}$.`, `Shortcut: ${a * k} is ${k} times ${a}, so $x$ is ${k} times ${b}.`] };
  });

  add("share", "ratio-proportion", "Sharing in a ratio", () => {
    const a = ri(1, 7);
    let b; do b = ri(2, 9); while (b === a || E.gcd(a, b) !== 1);
    const k = 10 * ri(2, 30), N = (a + b) * k, big = Math.max(a, b) * k, small = Math.min(a, b) * k;
    return {
      q: `${inr(N)} is shared between Asha and Ravi in the ratio ${a} : ${b}. How much does ${a > b ? "Asha" : "Ravi"} get?`,
      ans: [big], money: true, show: inr(big), wrong: [small, N / 2, Math.round(N / Math.max(a, b))],
      how: [
        `Total number of parts: $${a} + ${b} = ${a + b}$.`,
        `One part is worth ${inr(N)} $\\div ${a + b} =$ ${inr(k)}.`,
        `${a > b ? "Asha" : "Ravi"} gets ${Math.max(a, b)} parts: $${Math.max(a, b)} \\times ${k} = ${big}$, so ${inr(big)}.`,
        `Check: the other share is $${Math.min(a, b)} \\times ${k} = ${small}$, and $${big} + ${small} = ${N}$.`,
      ],
    };
  });

  add("sdt", "ratio-proportion", "Speed, distance, time", () => {
    if (Math.random() < 0.5) {
      const s = 2 * ri(15, 45), t = pick([1.5, 2, 2.5, 3, 4]), d = s * t;
      return { q: `A car travels at ${s} km/h. How far does it go in ${t} hours?`, ans: [d], unit: " km", show: `$${d}$ km`, wrong: [s + t, s / t, d + s], how: [`Distance $=$ speed $\\times$ time.`, `$d = ${s} \\times ${t}$`, `$d = ${d}$ km (km/h $\\times$ hours gives km).`] };
    }
    const s = 18 * ri(1, 6), v = (s * 5) / 18;
    return { q: `Convert ${s} km/h to m/s.`, ans: [v], unit: " m/s", show: `$${v}$ m/s`, wrong: [(s * 18) / 5, s * 1000 / 60, v * 2], how: [`1 km = 1000 m and 1 h = 3600 s, so 1 km/h $= \\frac{1000}{3600}$ m/s $= \\frac{5}{18}$ m/s.`, `Multiply by $\\frac{5}{18}$: $${s} \\times \\frac{5}{18} = \\frac{${s * 5}}{18}$.`, `$\\frac{${s * 5}}{18} = ${v}$ m/s.`] };
  });

  add("percent", "percentages", "Percentages", () => {
    const p = pick([5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60, 75]), y = 40 * ri(1, 25), v = (p * y) / 100;
    return { q: `What is $${p}\\%$ of $${y}$?`, ans: [v], show: M(E.fmt(v)), dec: true, wrong: [v * 10, v / 10, y - v, v * 2], how: [`"Percent" means "out of 100", so $${p}\\% = \\frac{${p}}{100}$.`, `"Of" means multiply: $\\frac{${p}}{100} \\times ${y} = \\frac{${E.fmt(p * y)}}{100}$.`, `Divide by 100: $${E.fmt(v)}$.`] };
  }, true);

  add("profit", "profit-interest", "Profit and loss", () => {
    const CP = 100 * ri(2, 20), p = pick([5, 10, 15, 20, 25, 30, 40, 50]), gain = Math.random() < 0.6, diff = (CP * p) / 100;
    const SP = gain ? CP + diff : CP - diff;
    if (Math.random() < 0.5) {
      return {
        q: `An item bought for ${inr(CP)} is sold for ${inr(SP)}. Find the ${gain ? "profit" : "loss"} percent.`,
        ans: [p], unit: "%", show: `$${p}\\%$`, wrong: [+((diff / SP) * 100).toFixed(2), diff, p * 2, 100 - p].filter((x) => Number.isInteger(x) || x * 100 % 1 === 0),
        how: [
          `${gain ? "Profit = selling price − cost price" : "Loss = cost price − selling price"}: $${gain ? SP : CP} - ${gain ? CP : SP} = ${diff}$.`,
          `${gain ? "Profit" : "Loss"} percent is always worked out on the cost price: $\\frac{${diff}}{${CP}} \\times 100$.`,
          `$= ${p}\\%$`,
        ],
      };
    }
    return {
      q: `An item costs ${inr(CP)}. At what price must it be sold to make a ${gain ? "profit" : "loss"} of ${p}%?`,
      ans: [SP], money: true, show: inr(SP), wrong: [gain ? CP - diff : CP + diff, diff, CP + p],
      how: [
        `Find ${p}% of the cost price: $\\frac{${p}}{100} \\times ${CP} = ${diff}$.`,
        gain ? `For a profit, add it to the cost price: $${CP} + ${diff} = ${SP}$.` : `For a loss, take it away from the cost price: $${CP} - ${diff} = ${SP}$.`,
        `So it must be sold for ${inr(SP)}.`,
      ],
    };
  });

  add("interest", "profit-interest", "Simple interest", () => {
    const P = 1000 * ri(2, 50), R = pick([4, 5, 6, 8, 10, 12]), Tm = ri(2, 5), SI = (P * R * Tm) / 100;
    return {
      q: `Find the simple interest on ${inr(P)} at ${R}% a year for ${Tm} years.`,
      ans: [SI], money: true, show: inr(SI), hint: "Just the number, without ₹.", wrong: [(P * R) / 100, P + SI, SI * 2],
      how: [
        `Simple interest: $SI = \\frac{P \\times R \\times T}{100}$.`,
        `Here $P = ${P}$, $R = ${R}$ and $T = ${Tm}$.`,
        `$SI = \\frac{${P} \\times ${R} \\times ${Tm}}{100} = \\frac{${P * R * Tm}}{100} = ${SI}$`,
        `So the interest is ${inr(SI)}.`,
      ],
    };
  });

  add("ci", "profit-interest", "Compound interest", () => {
    const P = 2000 * ri(1, 10), R = pick([5, 10, 20]), A = (P * (100 + R) ** 2) / 10000, CI = A - P, SI = (P * R * 2) / 100;
    return {
      q: `Find the compound interest on ${inr(P)} at ${R}% a year for 2 years, compounded annually.`,
      ans: [CI], money: true, show: inr(CI), hint: "Just the number, without ₹.", wrong: [SI, A, (P * R) / 100],
      how: [
        `Compound interest adds each year's interest to the money before the next year starts.`,
        `Year 1: interest $= ${R}\\% \\times ${P} = ${(P * R) / 100}$, so the amount becomes $${P} + ${(P * R) / 100} = ${(P * (100 + R)) / 100}$.`,
        `Year 2: interest $= ${R}\\% \\times ${(P * (100 + R)) / 100} = ${(P * (100 + R) * R) / 10000}$, so the amount becomes $${A}$.`,
        `CI $=$ final amount $-$ principal $= ${A} - ${P} = ${CI}$. (Simple interest would only be ${SI}.)`,
      ],
    };
  });

  add("exponents", "exponents", "Laws of exponents", () => {
    const b = pick([2, 3, 5, 10]), top = b === 2 ? 6 : 3;
    let m, n;
    do { m = nz(-3, 6); n = nz(-3, 6); } while (m + n < -2 || m + n > top || m * n === m + n);
    const e = m + n, val = e >= 0 ? `${b ** e}` : frac(1, b ** -e);
    return { q: M(`${b}^{${m}} \\times ${b}^{${n}}`), ans: [b ** e], show: M(`${b}^{${e}} = ${val}`), frac: true, hint: "Fractions such as 1/4 are fine.", wrong: [b ** (m * n), b ** (m - n), b ** (n - m), b * e].filter((x) => x <= 1e6), how: [
      `Same base, multiplying: add the exponents, $a^m \\times a^n = a^{m+n}$.`,
      `$${b}^{${m}} \\times ${b}^{${n}} = ${b}^{${m} + ${par(n)}} = ${b}^{${e}}$`,
      e < 0 ? `A negative exponent means "1 over": $${b}^{${e}} = \\frac{1}{${b}^{${-e}}} = ${val}$.` : e === 0 ? `Any non-zero number to the power 0 is 1: $${b}^{0} = 1$.` : `$${b}^{${e}} = ${val}$`,
    ] };
  }, true);

  add("std-form", "exponents", "Standard form", () => {
    const m = ri(11, 99) / 10, e = pick([-6, -5, -4, -3, -2, 3, 4, 5, 6, 7, 8]);
    const num = e > 0 ? Math.round(m * 10 ** e).toLocaleString("en-US") : (m * 10 ** e).toFixed(-e + 1);
    const f = (k) => M(`${m} \\times 10^{${k}}`);
    return { q: `Write ${num} in standard form.`, opts: [f(e), f(-e), f(e + 1), f(e - 1)], how: [
      `Standard form is $a \\times 10^{n}$, where $1 \\le a < 10$.`,
      `Move the decimal point to get ${m}: it moves ${Math.abs(e)} place${Math.abs(e) > 1 ? "s" : ""} to the ${e > 0 ? "left" : "right"}.`,
      e > 0 ? `The number is large, so the power is positive: $n = ${e}$.` : `The number is less than 1, so the power is negative: $n = ${e}$.`,
      `Answer: $${m} \\times 10^{${e}}$.`,
    ] };
  });

  add("identity", "algebra-identities", "Using identities", () => {
    const base = pick([20, 30, 40, 50, 60, 70, 80, 100]), k = ri(1, 9);
    return { q: M(`${base + k} \\times ${base - k}`), ans: [base * base - k * k], show: M(base * base - k * k), wrong: [base * base + k * k, base * base - 2 * k, base * base - k], how: [
      `Notice that $${base + k} = ${base} + ${k}$ and $${base - k} = ${base} - ${k}$.`,
      `Use the identity $(a + b)(a - b) = a^2 - b^2$ with $a = ${base}$ and $b = ${k}$.`,
      `$${base}^2 - ${k}^2 = ${base * base} - ${k * k} = ${base * base - k * k}$`,
    ] };
  }, true);

  add("like-terms", "algebra-identities", "Simplifying expressions", () => {
    let a1, a2, b1, b2;
    do { a1 = ri(2, 9); a2 = ri(1, 9); b1 = nz(-6, 9); b2 = nz(-6, 9); } while (a1 === a2 || b1 + b2 === 0 || b1 - b2 === 0);
    const expr = `${terms([[a1, "x"], [b1, "y"]])} - ${a2 === 1 ? "" : a2}x ${b2 < 0 ? "-" : "+"} ${Math.abs(b2) === 1 ? "" : Math.abs(b2)}y`;
    const opts = [terms([[a1 - a2, "x"], [b1 + b2, "y"]]), terms([[a1 + a2, "x"], [b1 + b2, "y"]]), terms([[a1 - a2, "x"], [b1 - b2, "y"]]), terms([[a1 - a2 + b1 + b2, "xy"]])];
    return { q: `Simplify $${expr}$.`, opts: opts.map(M), how: [
      `Like terms have the same letter. Group the $x$ terms together and the $y$ terms together.`,
      `$x$ terms: $${terms([[a1, "x"]])} - ${terms([[a2, "x"]])} = ${terms([[a1 - a2, "x"]])}$, because $${a1} - ${a2} = ${a1 - a2}$.`,
      `$y$ terms: $${terms([[b1, "y"]])} ${b2 < 0 ? "-" : "+"} ${terms([[Math.abs(b2), "y"]])} = ${terms([[b1 + b2, "y"]])}$, because $${b1} + ${par(b2)} = ${b1 + b2}$.`,
      `Put them together: $${terms([[a1 - a2, "x"], [b1 + b2, "y"]])}$.`,
    ] };
  });

  add("linear", "linear-one", "Linear equations", () => {
    const x = ri(-10, 10), a = nz(-9, 9), b = nz(-20, 20), c = a * x + b;
    return {
      q: `Solve $${terms([[a, "x"], [b, ""]])} = ${c}$.`, ans: [x], show: M(`x = ${x}`), form: (v) => `x = ${tn(v[0])}`, frac: true,
      wrong: [(c + b) / a, -x, (c - b) * a, x + 1],
      how: [
        `Goal: get $x$ on its own, doing the same thing to both sides.`,
        `${b > 0 ? "Subtract" : "Add"} ${Math.abs(b)} on both sides: $${terms([[a, "x"]])} = ${c} ${b > 0 ? "-" : "+"} ${Math.abs(b)} = ${c - b}$.`,
        a === 1 ? `So $x = ${x}$.` : `Divide both sides by $${a}$: $x = \\frac{${c - b}}{${a}} = ${x}$.`,
        `Check: $${a} \\times ${par(x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${a * x} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${c}$ ✓`,
      ],
    };
  }, true);

  add("angles", "lines-angles", "Angles in a triangle", () => {
    const A = ri(25, 100), B = ri(20, 150 - A), C = 180 - A - B;
    return { q: `Two angles of a triangle are $${A}^\\circ$ and $${B}^\\circ$. Find the third angle.`, ans: [C], unit: "°", show: M(`${C}^\\circ`), wrong: [360 - A - B, 90 - Math.min(A, B), C + 10, C - 10], how: [`The three angles of a triangle always add up to $180^\\circ$.`, `Add the two you know: $${A}^\\circ + ${B}^\\circ = ${A + B}^\\circ$.`, `Third angle $= 180^\\circ - ${A + B}^\\circ = ${C}^\\circ$.`] };
  }, true);

  add("circle", "mensuration-2d", "Circles", () => {
    const k = ri(1, 10), r = 7 * k, diam = Math.random() < 0.35;
    const given = diam ? `diameter ${2 * r} cm` : `radius ${r} cm`;
    const half = diam ? [`The radius is half the diameter: $r = ${2 * r} \\div 2 = ${r}$ cm.`] : [];
    if (Math.random() < 0.5) {
      const A = 22 * k * r;
      return { q: `Find the area of a circle of ${given}. Use $\\pi = \\frac{22}{7}$.`, ans: [A], tol: 0.002, unit: " cm²", show: `$${A}$ cm²`, wrong: [2 * 22 * k, 22 * k * 4 * r, 22 * k], how: [
        `Area of a circle: $A = \\pi r^2$.`, ...half,
        `$A = \\frac{22}{7} \\times ${r} \\times ${r}$`,
        `Cancel the 7 into ${r}: $22 \\times ${k} \\times ${r} = ${A}$ cm².`,
      ] };
    }
    const C = 44 * k;
    return { q: `Find the circumference of a circle of ${given}. Use $\\pi = \\frac{22}{7}$.`, ans: [C], tol: 0.002, unit: " cm", show: `$${C}$ cm`, wrong: [22 * k * r, 22 * k, 88 * k], how: [
      `Circumference of a circle: $C = 2\\pi r$.`, ...half,
      `$C = 2 \\times \\frac{22}{7} \\times ${r}$`,
      `Cancel the 7 into ${r}: $2 \\times 22 \\times ${k} = ${C}$ cm.`,
    ] };
  });

  add("tri-area", "mensuration-2d", "Areas of shapes", () => {
    const k = ri(0, 2);
    if (k === 0) {
      const b = 2 * ri(2, 15), h = ri(3, 20);
      return { q: `Find the area of a triangle with base ${b} cm and height ${h} cm.`, ans: [(b * h) / 2], unit: " cm²", show: `$${(b * h) / 2}$ cm²`, wrong: [b * h, b + h, 2 * (b + h)], how: [`Area of a triangle $= \\frac12 \\times$ base $\\times$ height (half of a rectangle).`, `$A = \\frac12 \\times ${b} \\times ${h}$`, `Half of ${b} is ${b / 2}, so $A = ${b / 2} \\times ${h} = ${(b * h) / 2}$ cm².`] };
    }
    if (k === 1) {
      const b = ri(4, 20), h = ri(3, 15);
      return { q: `Find the area of a parallelogram with base ${b} cm and height ${h} cm.`, ans: [b * h], unit: " cm²", show: `$${b * h}$ cm²`, wrong: [(b * h) / 2, 2 * (b + h), b + h], how: [`Area of a parallelogram $=$ base $\\times$ perpendicular height (not the slanted side).`, `$A = ${b} \\times ${h} = ${b * h}$ cm².`] };
    }
    const a = ri(4, 15), c = a + 2 * ri(1, 6), h = ri(3, 12), A = ((a + c) * h) / 2;
    return { q: `A trapezium has parallel sides ${a} cm and ${c} cm, and height ${h} cm. Find its area.`, ans: [A], unit: " cm²", show: `$${A}$ cm²`, wrong: [(a + c) * h, a * c * h / 2, a + c + h], how: [`Area of a trapezium $= \\frac12 \\times$ (sum of the parallel sides) $\\times$ height.`, `Add the parallel sides: $${a} + ${c} = ${a + c}$.`, `$A = \\frac12 \\times ${a + c} \\times ${h} = ${(a + c) / 2} \\times ${h} = ${A}$ cm².`] };
  });

  add("sqrt", "squares-roots", "Square roots", () => {
    const n = ri(11, 45), N = n * n, t = Math.floor(n / 10) * 10, last = N % 10;
    const ends = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => (d * d) % 10 === last);
    const how = n % 10 === 0
      ? [`Look for the number that multiplies by itself to give ${N}.`, `${N} is ${N / 100} hundreds, and $${n / 10} \\times ${n / 10} = ${N / 100}$, so try ${n}.`, `$${n} \\times ${n} = ${N}$, so $\\sqrt{${N}} = ${n}$.`]
      : [
        `Estimate: $${t}^2 = ${t * t}$ and $${t + 10}^2 = ${(t + 10) ** 2}$, so the root is between ${t} and ${t + 10}.`,
        `${N} ends in ${last}. Only numbers ending in ${ends.join(" or ")} have squares ending in ${last}.`,
        `Try ${n}: $${n} \\times ${n} = ${N}$ ✓`,
        `So $\\sqrt{${N}} = ${n}$.`,
      ];
    return { q: M(`\\sqrt{${N}}`), ans: [n], show: M(n), wrong: [n + 1, n - 1, n + 2, Math.round(N / 2)], how };
  }, true);

  add("cube-root", "squares-roots", "Cube roots", () => {
    const n = ri(2, 15);
    return { q: M(`\\sqrt[3]{${n ** 3}}`), ans: [n], show: M(n), wrong: [n + 1, n - 1, n * 3, Math.round(Math.sqrt(n ** 3))], how: [
      `Look for the number that multiplied by itself three times gives ${n ** 3}.`,
      `${n ** 3} ends in ${n ** 3 % 10}, and the only digit whose cube ends in ${n ** 3 % 10} is ${n % 10}.${n > 9 ? ` Also $10^3 = 1000$ and $20^3 = 8000$, so the root is between 10 and 20.` : ""}`,
      `Try ${n}: $${n} \\times ${n} \\times ${n} = ${n * n} \\times ${n} = ${n ** 3}$ ✓`,
      `So $\\sqrt[3]{${n ** 3}} = ${n}$.`,
    ] };
  }, true);

  add("mean", "data-basic", "Mean of a list", () => {
    const m = ri(12, 60);
    let vals;
    do {
      vals = [0, 1, 2, 3].map(() => ri(m - 10, m + 10));
      vals.push(5 * m - vals.reduce((s, v) => s + v, 0));
    } while (vals[4] < 1 || Math.abs(vals[4] - m) > 20);
    const sorted = vals.slice().sort((a, b) => a - b);
    return { q: `Find the mean of ${vals.join(", ")}.`, ans: [m], show: M(m), wrong: [sorted[2], 5 * m, m + 2, m - 3], how: [`Mean $= \\frac{\\text{sum of the values}}{\\text{number of values}}$.`, `Sum: $${vals.join(" + ")} = ${5 * m}$.`, `There are 5 values: $${5 * m} \\div 5 = ${m}$.`] };
  });

  add("median", "data-basic", "Median and mode", () => {
    if (Math.random() < 0.5) {
      const n = pick([5, 7]);
      let vals;
      do vals = Array.from({ length: n }, () => ri(2, 60)); while (new Set(vals).size < n);
      const s = vals.slice().sort((a, b) => a - b), med = s[(n - 1) / 2], sum = vals.reduce((a, b) => a + b, 0);
      const w = [vals[(n - 1) / 2], s[(n - 1) / 2 + 1], s[(n - 1) / 2 - 1]];
      if (sum % n === 0) w.push(sum / n);
      return { q: `Find the median of ${vals.join(", ")}.`, ans: [med], show: M(med), wrong: w, how: [`The median is the middle value, so first put the numbers in order: ${s.join(", ")}.`, `There are ${n} numbers, so the middle one is number $\\frac{${n} + 1}{2} = ${(n + 1) / 2}$ in the list.`, `The ${ord((n + 1) / 2)} value is $${med}$.`] };
    }
    const mode = ri(2, 20), others = sample([...Array(25).keys()].map((x) => x + 1).filter((x) => x !== mode), 5);
    const vals = shuffle([mode, mode, mode, ...others.slice(0, 2), others[2], others[3], others[3]]);
    return { q: `Find the mode of ${vals.join(", ")}.`, ans: [mode], show: M(mode), wrong: [others[3], others[2], Math.max(...vals)], how: [`The mode is the value that appears most often.`, `Count each value: ${mode} appears 3 times, ${others[3]} appears 2 times, and every other value appears once.`, `So the mode is $${mode}$.`] };
  });

  /* ================= Secondary ================= */
  add("rational", "real-numbers", "Rational and irrational", () => {
    if (Math.random() < 0.5) {
      const [c, why] = pick([
        ["\\sqrt2", "2 is not a perfect square, so $\\sqrt2$ is irrational."],
        ["\\sqrt3", "3 is not a perfect square, so $\\sqrt3$ is irrational."],
        ["\\sqrt5", "5 is not a perfect square, so $\\sqrt5$ is irrational."],
        ["\\sqrt7", "7 is not a perfect square, so $\\sqrt7$ is irrational."],
        ["\\pi", "$\\pi = 3.14159\\ldots$ never ends or repeats, so it is irrational."],
        ["2 + \\sqrt3", "$\\sqrt3$ is irrational, and a rational number plus an irrational number is always irrational."],
        ["3\\sqrt2", "$\\sqrt2$ is irrational, and a non-zero rational number times an irrational number is always irrational."],
        ["\\sqrt{12}", "$\\sqrt{12} = 2\\sqrt3$, and $\\sqrt3$ is irrational, so $\\sqrt{12}$ is irrational."],
      ]);
      const RAT = {
        "\\sqrt{16}": "$\\sqrt{16} = 4$", "\\sqrt{49}": "$\\sqrt{49} = 7$", "\\frac{22}{7}": "$\\frac{22}{7}$ is already a fraction",
        "0.75": "$0.75 = \\frac34$", "0.\\overline{3}": "$0.\\overline{3} = \\frac13$ (it repeats)", "1.414": "$1.414 = \\frac{1414}{1000}$ (it stops)",
        "\\sqrt{\\tfrac{9}{4}}": "$\\sqrt{\\tfrac94} = \\frac32$", "-\\frac{5}{8}": "$-\\frac58$ is already a fraction", "3.1416": "$3.1416 = \\frac{31416}{10000}$ (it stops)",
      };
      const w = sample(Object.keys(RAT), 3);
      return { q: "Which of these numbers is irrational?", opts: [c, ...w].map(M), how: [
        `A rational number can be written as a fraction $\\frac{p}{q}$; its decimal either stops or repeats. An irrational number cannot.`,
        `Check the others, which are all rational: ${w.map((x) => RAT[x]).join("; ")}.`,
        `$${c}$: ${why}`,
      ] };
    }
    const d = pick([8, 16, 20, 25, 40, 50, 80, 125]);
    let n; do n = ri(1, d - 1); while (E.gcd(n, d) !== 1);
    const qs = sample([3, 6, 7, 9, 11, 12, 15, 21, 30], 3);
    const bad = qs.map((q) => { let m; do m = ri(1, q - 1); while (E.gcd(m, q) !== 1); return `\\frac{${m}}{${q}}`; });
    return { q: "Which fraction has a terminating decimal expansion?", opts: [`\\frac{${n}}{${d}}`, ...bad].map(M), how: [
      `A fraction in lowest terms has a terminating decimal exactly when its denominator has no prime factors other than 2 and 5.`,
      `Factorise the denominators: ${qs.map((q) => `$${q} = ${pf(q)}$`).join(", ")}. Each has a prime factor other than 2 and 5, so those decimals repeat forever.`,
      `$${d} = ${pf(d)}$ uses only 2s and 5s, so $\\frac{${n}}{${d}}$ terminates: $\\frac{${n}}{${d}} = ${String(n / d)}$.`,
    ] };
  });

  add("poly-eval", "polynomials", "Remainder theorem", () => {
    const a = nz(-3, 3), b = ri(-5, 5), c = ri(-6, 6), d = ri(-9, 9), k = nz(-3, 3);
    const p = (x) => a * x ** 3 + b * x ** 2 + c * x + d, val = p(k);
    return {
      q: `Find the remainder when $p(x) = ${terms([[a, "x^3"], [b, "x^2"], [c, "x"], [d, ""]])}$ is divided by $${k < 0 ? `x + ${-k}` : `x - ${k}`}$.`,
      ans: [val], show: M(val), wrong: [p(-k), d, val + 1], how: [
        `Remainder theorem: dividing $p(x)$ by $x - a$ leaves the remainder $p(a)$.`,
        `$${k < 0 ? `x + ${-k}` : `x - ${k}`} = 0$ when $x = ${k}$, so the remainder is $p(${k})$.`,
        `Work out each term: $${a} \\times ${par(k)}^3 = ${a * k ** 3}$, $${b} \\times ${par(k)}^2 = ${b * k * k}$, $${c} \\times ${par(k)} = ${c * k}$, and the constant is $${d}$.`,
        `Add them: $${a * k ** 3} + ${par(b * k * k)} + ${par(c * k)} + ${par(d)} = ${val}$.`,
      ],
    };
  });

  add("factorise", "polynomials", "Factorising quadratics", () => {
    let p, q;
    do { p = nz(-9, 9); q = nz(-9, 9); } while (Math.abs(p) === Math.abs(q));
    const e = terms([[1, "x^2"], [-(p + q), "x"], [p * q, ""]]);
    return { q: `Factorise $${e}$.`, opts: [fx(p) + fx(q), fx(-p) + fx(-q), fx(p) + fx(-q), fx(-p) + fx(q)].map(M), how: [
      `For $x^2 + bx + c$, find two numbers that multiply to $c = ${p * q}$ and add to $b = ${-(p + q)}$.`,
      `They are $${-p}$ and $${-q}$: $${par(-p)} \\times ${par(-q)} = ${p * q}$ and $${-p} + ${par(-q)} = ${-(p + q)}$.`,
      `So $${e} = ${fx(p)}${fx(q)}$.`,
      `Check by expanding: $${fx(p)}${fx(q)} = ${e}$ ✓`,
    ] };
  });

  add("zeros", "polynomials", "Sum and product of zeros", () => {
    const a = nz(-4, 5), b = nz(-9, 9), c = nz(-9, 9), sum = Math.random() < 0.5;
    const e = terms([[a, "x^2"], [b, "x"], [c, ""]]);
    const v = sum ? -b / a : c / a;
    return {
      q: `If $\\alpha$ and $\\beta$ are the zeros of $${e}$, find $${sum ? "\\alpha + \\beta" : "\\alpha\\beta"}$.`,
      ans: [v], show: M(frac(sum ? -b : c, a)), frac: true, hint: "Fractions such as -3/2 are fine.",
      wrong: sum ? [b / a, c / a, -c / a] : [-c / a, -b / a, b / a],
      how: [
        `For $ax^2 + bx + c$: sum of zeros $\\alpha + \\beta = -\\frac{b}{a}$, product of zeros $\\alpha\\beta = \\frac{c}{a}$.`,
        `Read off the coefficients: $a = ${a}$, $b = ${b}$, $c = ${c}$.`,
        sum ? `$\\alpha + \\beta = -\\frac{${b}}{${a}} = ${frac(-b, a)}$` : `$\\alpha\\beta = \\frac{${c}}{${a}} = ${frac(c, a)}$`,
      ],
    };
  }, true);

  add("system", "linear-two", "Simultaneous equations", () => {
    let x, y, a1, b1, a2, b2;
    do { x = ri(-6, 8); y = ri(-6, 8); a1 = nz(-5, 5); b1 = nz(-5, 5); a2 = nz(-5, 5); b2 = nz(-5, 5); } while (a1 * b2 - a2 * b1 === 0 || x === y);
    const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
    return {
      q: `Solve $${terms([[a1, "x"], [b1, "y"]])} = ${c1}$ and $${terms([[a2, "x"], [b2, "y"]])} = ${c2}$.`,
      ans: [x, y], ordered: true, show: M(`x = ${x},\\ y = ${y}`), form: (v) => `x = ${tn(v[0])},\\ y = ${tn(v[1])}`,
      hint: "Answer as x, y. For example: 3, -2", wrong: [[y, x], [-x, y], [x, -y]],
      how: (() => {
        const L = Math.sign(a1) * E.lcm(Math.abs(a1), Math.abs(a2)), m1 = L / a1, m2 = L / a2;
        const mul = [m1 !== 1 && `the first equation by $${m1}$`, m2 !== 1 && `the second by $${m2}$`].filter(Boolean).join(" and ");
        return [
          mul ? `Make both $x$ coefficients equal to ${L}: multiply ${mul}.` : `Both $x$ coefficients are already ${L}, so the $x$ terms cancel when you subtract.`,
          ...(mul ? [`This gives $${terms([[L, "x"], [b1 * m1, "y"]])} = ${c1 * m1}$ and $${terms([[L, "x"], [b2 * m2, "y"]])} = ${c2 * m2}$.`] : []),
          `Subtract the second from the first to remove $x$: $${terms([[b1 * m1 - b2 * m2, "y"]])} = ${c1 * m1 - c2 * m2}$${b1 * m1 - b2 * m2 === 1 ? "" : `, so $y = ${y}$`}.`,
          `Put $y = ${y}$ into the first equation: $${terms([[a1, "x"]])} + ${par(b1 * y)} = ${c1}$, so ${a1 === 1 ? `$x = ${c1} - ${par(b1 * y)} = ${x}$` : `$${terms([[a1, "x"]])} = ${c1 - b1 * y}$ and $x = ${x}$`}.`,
          `Check in the second equation: $${a2} \\times ${par(x)} + ${par(b2)} \\times ${par(y)} = ${c2}$ ✓`,
        ];
      })(),
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
      how: [
        `Factorise: find two numbers that multiply to $${p * q}$ and add to $${-(p + q)}$. They are $${-p}$ and $${-q}$.`,
        p === q ? `So the equation is $${fx(p)}^2 = 0$.` : `So the equation is $${fx(p)}${fx(q)} = 0$.`,
        p === q ? `$${p === 0 ? "x" : fx(p)} = 0$ gives $x = ${p}$. Both factors are the same, so it is a repeated root.` : `A product is zero only when one of the factors is zero, so $x = ${lo}$ or $x = ${hi}$.`,
      ],
    };
  });

  add("nature", "quadratic", "Nature of roots", () => {
    const kind = ri(0, 2);
    let a, b, c;
    if (kind === 1) { const k = ri(1, 3), m = nz(-4, 4); a = k * k; c = m * m; b = sgn() * 2 * k * Math.abs(m); }
    else do { a = nz(-4, 5); b = ri(-9, 9); c = nz(-9, 9); } while (kind === 0 ? b * b - 4 * a * c <= 0 : b * b - 4 * a * c >= 0);
    const D = b * b - 4 * a * c, L = ["Two distinct real roots", "Two equal real roots", "No real roots"];
    return { q: `What is the nature of the roots of $${terms([[a, "x^2"], [b, "x"], [c, ""]])} = 0$?`, opts: [L[kind], ...L.filter((_, i) => i !== kind)], how: [
      `The discriminant $D = b^2 - 4ac$ decides the nature of the roots.`,
      `Here $a = ${a}$, $b = ${b}$, $c = ${c}$.`,
      `$D = ${par(b)}^2 - 4 \\times ${par(a)} \\times ${par(c)} = ${b * b} - ${par(4 * a * c)} = ${D}$`,
      D > 0 ? `$D > 0$, so there are two distinct real roots.` : D === 0 ? `$D = 0$, so the two roots are real and equal.` : `$D < 0$, so there are no real roots.`,
    ] };
  }, true);

  add("ap", "ap", "Arithmetic progressions", () => {
    const a = ri(-10, 20), d = nz(-6, 9), n = ri(10, 40), v = a + (n - 1) * d;
    return { q: `Find the ${ord(n)} term of $${a}, ${a + d}, ${a + 2 * d}, \\ldots$`, ans: [v], show: M(v), wrong: [a + n * d, a * n + d, v - a], how: [
      `The $n$th term of an AP is $a_n = a + (n - 1)d$.`,
      `First term $a = ${a}$. Common difference $d = ${a + d} - ${par(a)} = ${d}$.`,
      `$a_{${n}} = ${a} + (${n} - 1) \\times ${par(d)} = ${a} + ${par((n - 1) * d)} = ${v}$`,
    ] };
  });

  add("ap-sum", "ap", "Sum of an AP", () => {
    const a = ri(1, 15), d = ri(1, 8), n = ri(6, 25), Sn = (n * (2 * a + (n - 1) * d)) / 2;
    return { q: `Find the sum of the first ${n} terms of $${a}, ${a + d}, ${a + 2 * d}, \\ldots$`, ans: [Sn], show: M(Sn), wrong: [n * (2 * a + (n - 1) * d), (n * (2 * a + n * d)) / 2, a + (n - 1) * d], how: [
      `Sum of the first $n$ terms: $S_n = \\frac{n}{2}\\left[2a + (n - 1)d\\right]$.`,
      `Here $a = ${a}$, $d = ${a + d} - ${a} = ${d}$, $n = ${n}$.`,
      `$S_{${n}} = \\frac{${n}}{2}\\left[2 \\times ${a} + ${n - 1} \\times ${d}\\right] = \\frac{${n}}{2}\\left[${2 * a} + ${(n - 1) * d}\\right] = \\frac{${n}}{2} \\times ${2 * a + (n - 1) * d}$`,
      `$S_{${n}} = ${Sn}$`,
    ] };
  });

  add("distance", "coordinate", "Distance formula", () => {
    const t = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [12, 5, 13], [8, 15, 17], [9, 12, 15]]);
    const x1 = ri(-6, 6), y1 = ri(-6, 6), x2 = x1 + sgn() * t[0], y2 = y1 + sgn() * t[1];
    return { q: `Find the distance between $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`, ans: [t[2]], show: M(t[2]), wrong: [t[0] + t[1], t[2] ** 2, t[2] + 1], how: [
      `Distance formula: $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.`,
      `$x_2 - x_1 = ${x2} - ${par(x1)} = ${x2 - x1}$ and $y_2 - y_1 = ${y2} - ${par(y1)} = ${y2 - y1}$.`,
      `$d = \\sqrt{${par(x2 - x1)}^2 + ${par(y2 - y1)}^2} = \\sqrt{${t[0] ** 2} + ${t[1] ** 2}} = \\sqrt{${t[2] ** 2}}$`,
      `$d = ${t[2]}$`,
    ] };
  });

  add("midpoint", "coordinate", "Midpoint", () => {
    const x1 = ri(-8, 8), y1 = ri(-8, 8), x2 = x1 + 2 * ri(-6, 6), y2 = y1 + 2 * nz(-6, 6);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return {
      q: `Find the midpoint of $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`, ans: [mx, my], ordered: true, form: (v) => `(${tn(v[0])}, ${tn(v[1])})`, show: M(`(${mx}, ${my})`),
      hint: "Answer as x, y. For example: 3, -2", wrong: [[x1 + x2, y1 + y2], [(x2 - x1) / 2, (y2 - y1) / 2], [my, mx]],
      how: [
        `Midpoint $= \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$: average the $x$s and average the $y$s.`,
        `$x$: $\\frac{${x1} + ${par(x2)}}{2} = \\frac{${x1 + x2}}{2} = ${mx}$`,
        `$y$: $\\frac{${y1} + ${par(y2)}}{2} = \\frac{${y1 + y2}}{2} = ${my}$`,
        `Midpoint: $(${mx}, ${my})$`,
      ],
    };
  });

  add("pythag", "triangles", "Pythagoras", () => {
    const [a, b, c] = scaledTriple();
    if (Math.random() < 0.5) return { q: `A right triangle has legs ${a} and ${b}. Find the hypotenuse.`, ans: [c], show: M(c), wrong: [a + b, c + 1, Math.abs(b - a) + c], how: [
      `Pythagoras: $\\text{hypotenuse}^2 = \\text{leg}^2 + \\text{leg}^2$.`,
      `$c^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}$`,
      `$c = \\sqrt{${c * c}} = ${c}$`,
    ] };
    return { q: `A right triangle has hypotenuse ${c} and one leg ${a}. Find the other leg.`, ans: [b], show: M(b), wrong: [c - a, b + 1, c + a], how: [
      `Pythagoras rearranged: $\\text{leg}^2 = \\text{hypotenuse}^2 - \\text{other leg}^2$.`,
      `$b^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b}$`,
      `$b = \\sqrt{${b * b}} = ${b}$`,
    ] };
  });

  add("tangent", "circles", "Tangent lengths", () => {
    const [r, t, d] = Math.random() < 0.5 ? scaledTriple() : (([p, q, h]) => [q, p, h])(scaledTriple());
    return { q: `A point is ${d} cm from the centre of a circle of radius ${r} cm. Find the length of the tangent from the point.`, ans: [t], unit: " cm", show: `$${t}$ cm`, wrong: [d - r, d + r, t + 1], how: [
      `A tangent meets the radius at $90^\\circ$, so the radius, the tangent and the line to the centre form a right triangle.`,
      `The line to the centre (${d} cm) is the hypotenuse, so $t^2 = ${d}^2 - ${r}^2 = ${d * d} - ${r * r} = ${t * t}$.`,
      `$t = \\sqrt{${t * t}} = ${t}$ cm`,
    ] };
  });

  const TRIG = [
    ["sin", 0], ["sin", 30], ["sin", 45], ["sin", 60], ["sin", 90],
    ["cos", 0], ["cos", 30], ["cos", 45], ["cos", 60], ["cos", 90],
    ["tan", 0], ["tan", 30], ["tan", 45], ["tan", 60],
  ];
  const trigVal = (f, a) => { const r = (a * Math.PI) / 180, v = f === "sin" ? Math.sin(r) : f === "cos" ? Math.cos(r) : Math.tan(r); return Math.abs(v) < 1e-12 ? 0 : v; };
  function trigSteps(f, a, v) {
    if (a === 0 || a === 90) {
      const [c, s] = a === 0 ? [1, 0] : [0, 1];
      return [
        `Picture a point on a circle of radius 1. At angle $\\theta$ it sits at $(\\cos\\theta, \\sin\\theta)$.`,
        `At $${a}^\\circ$ the point is $(${c}, ${s})$, so $\\cos ${a}^\\circ = ${c}$ and $\\sin ${a}^\\circ = ${s}$.`,
        f === "tan" ? `$\\tan ${a}^\\circ = \\frac{\\sin ${a}^\\circ}{\\cos ${a}^\\circ} = \\frac{${s}}{${c}} = ${surd(v)}$` : `So $\\${f} ${a}^\\circ = ${surd(v)}$.`,
      ];
    }
    const [o, ad, h, tri] = a === 45 ? ["1", "1", "\\sqrt2", "Use the right isosceles triangle with sides $1$, $1$ and $\\sqrt2$."]
      : [a === 30 ? "1" : "\\sqrt3", a === 30 ? "\\sqrt3" : "1", "2", "Use half of an equilateral triangle of side 2: its sides are $1$, $\\sqrt3$ and $2$, with angles $30^\\circ$, $60^\\circ$ and $90^\\circ$."];
    const [top, bot, tn_, bn] = f === "sin" ? [o, h, "opposite", "hypotenuse"] : f === "cos" ? [ad, h, "adjacent", "hypotenuse"] : [o, ad, "opposite", "adjacent"];
    return [
      tri,
      `Seen from the $${a}^\\circ$ angle: opposite $= ${o}$, adjacent $= ${ad}$, hypotenuse $= ${h}$.`,
      `$\\${f} ${a}^\\circ = \\frac{\\text{${tn_}}}{\\text{${bn}}} = \\frac{${top}}{${bot}}${`\\frac{${top}}{${bot}}`.replace(/\\frac\{(\d)\}\{(\d)\}/, "\\frac$1$2") === surd(v) ? "" : ` = ${surd(v)}`}$`,
    ];
  }
  add("trig", "trig-basic", "Standard trig values", () => {
    const [f, a] = pick(TRIG), v = trigVal(f, a);
    return { q: M(`\\${f} ${a}^\\circ`), ans: [v], show: M(surd(v)), opts: surdOpts(v, false), hint: "Surds are fine: type sqrt(3)/2.", how: trigSteps(f, a, v) };
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
      how: [
        `Draw a right triangle. $\\${given}\\theta = \\frac{${val[given][0]}}{${h}}$ means the ${given === "sin" ? "opposite" : "adjacent"} side is ${val[given][0]} and the hypotenuse is ${h}.`,
        `Find the ${given === "sin" ? "adjacent" : "opposite"} side with Pythagoras: $\\sqrt{${h}^2 - ${val[given][0]}^2} = \\sqrt{${h * h - val[given][0] ** 2}} = ${given === "sin" ? adj : opp}$.`,
        `So opposite $= ${opp}$, adjacent $= ${adj}$, hypotenuse $= ${h}$.`,
        `$\\${want}\\theta = \\frac{\\text{${want === "cos" ? "adjacent" : "opposite"}}}{\\text{${want === "tan" ? "adjacent" : "hypotenuse"}}} = \\frac{${n}}{${d}}$`,
      ],
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
      how: [
        `Draw a right triangle: the tower (height $h$) is opposite the $${th}^\\circ$ angle, and the ${d} m along the ground is the adjacent side.`,
        `Opposite and adjacent link through tan: $\\tan ${th}^\\circ = \\frac{h}{${d}}$.`,
        `So $h = ${d} \\times \\tan ${th}^\\circ = ${d} \\times ${{ 30: "\\frac{1}{\\sqrt3}", 45: "1", 60: "\\sqrt3" }[th]} = ${exact}${th === 45 ? "" : ` \\approx ${E.fmt(+h.toFixed(2))}`}$ m`,
      ],
    };
  });

  add("volume", "surface-volume", "Volumes of solids", () => {
    const k = pick(["cube", "cuboid", "cylinder", "cone", "sphere"]);
    let q, v, how, w;
    if (k === "cube") {
      const a = ri(2, 15); v = a ** 3; w = [6 * a * a, 3 * a, a * a]; q = `a cube of side ${a} cm`;
      how = [`Volume of a cube: $V = a^3$ (side $\\times$ side $\\times$ side).`, `$V = ${a} \\times ${a} \\times ${a} = ${a * a} \\times ${a} = ${v}$ cm³`];
    } else if (k === "cuboid") {
      const l = ri(3, 15), b = ri(2, 12), h = ri(2, 10); v = l * b * h; w = [2 * (l * b + b * h + h * l), l + b + h, l * b]; q = `a cuboid ${l} cm × ${b} cm × ${h} cm`;
      how = [`Volume of a cuboid: $V = l \\times b \\times h$.`, `$V = ${l} \\times ${b} \\times ${h}$`, `$= ${l * b} \\times ${h} = ${v}$ cm³`];
    } else if (k === "cylinder") {
      const m = ri(1, 3), r = 7 * m, h = ri(2, 20); v = (22 / 7) * r * r * h; w = [2 * (22 / 7) * r * h, (22 / 7) * r * h, v / 3]; q = `a cylinder with radius ${r} cm and height ${h} cm`;
      how = [`Volume of a cylinder: $V = \\pi r^2 h$ (area of the circular base $\\times$ height).`, `$V = \\frac{22}{7} \\times ${r} \\times ${r} \\times ${h}$`, `Cancel the 7 into ${r}: $22 \\times ${m} \\times ${r} \\times ${h} = ${f2(v)}$ cm³`];
    } else if (k === "cone") {
      const m = ri(1, 3), r = 7 * m, h = 3 * ri(1, 8); v = (1 / 3) * (22 / 7) * r * r * h; w = [v * 3, v / 2, (22 / 7) * r * h]; q = `a cone with radius ${r} cm and height ${h} cm`;
      how = [`Volume of a cone: $V = \\frac13 \\pi r^2 h$ (one third of a cylinder).`, `$V = \\frac13 \\times \\frac{22}{7} \\times ${r} \\times ${r} \\times ${h}$`, `Cancel: $\\frac{${h}}{3} = ${h / 3}$ and $\\frac{${r}}{7} = ${m}$, so $V = 22 \\times ${m} \\times ${r} \\times ${h / 3} = ${f2(v)}$ cm³`];
    } else {
      const r = 7 * ri(1, 3); v = (4 / 3) * (22 / 7) * r ** 3; w = [4 * (22 / 7) * r * r, v / 2, (22 / 7) * r ** 3]; q = `a sphere of radius ${r} cm`;
      how = [`Volume of a sphere: $V = \\frac43 \\pi r^3$.`, `$r^3 = ${r} \\times ${r} \\times ${r} = ${r ** 3}$`, `$V = \\frac43 \\times \\frac{22}{7} \\times ${r ** 3} = \\frac{88 \\times ${r ** 3 / 7}}{3} = \\frac{${88 * r ** 3 / 7}}{3}$`, `$V \\approx ${f2(v)}$ cm³`];
    }
    return { q: `Find the volume of ${q}. Use $\\pi = \\frac{22}{7}$ where needed.`, ans: [v], tol: 0.002, unit: " cm³", show: `$${E.fmt(+v.toFixed(2))}$ cm³`, wrong: w, how };
  });

  add("surface", "surface-volume", "Surface areas", () => {
    const k = pick(["cube", "cuboid", "sphere", "cylinder"]);
    let q, v, how, w;
    if (k === "cube") {
      const a = ri(2, 15); v = 6 * a * a; w = [a ** 3, 4 * a * a, 12 * a]; q = `the total surface area of a cube of side ${a} cm`;
      how = [`A cube has 6 identical square faces, each of area $a^2$, so the total is $6a^2$.`, `One face: $${a} \\times ${a} = ${a * a}$ cm²`, `All 6 faces: $6 \\times ${a * a} = ${v}$ cm²`];
    } else if (k === "cuboid") {
      const l = ri(3, 12), b = ri(2, 10), h = ri(2, 9); v = 2 * (l * b + b * h + h * l); w = [l * b * h, l * b + b * h + h * l, 2 * h * (l + b)]; q = `the total surface area of a cuboid ${l} cm × ${b} cm × ${h} cm`;
      how = [`A cuboid has 3 pairs of matching rectangular faces, so the total is $2(lb + bh + hl)$.`, `$lb = ${l} \\times ${b} = ${l * b}$, $bh = ${b} \\times ${h} = ${b * h}$, $hl = ${h} \\times ${l} = ${h * l}$`, `$2(${l * b} + ${b * h} + ${h * l}) = 2 \\times ${l * b + b * h + h * l} = ${v}$ cm²`];
    } else if (k === "sphere") {
      const m = ri(1, 3), r = 7 * m; v = 4 * (22 / 7) * r * r; w = [(4 / 3) * (22 / 7) * r ** 3, 2 * (22 / 7) * r * r, (22 / 7) * r * r]; q = `the surface area of a sphere of radius ${r} cm`;
      how = [`Surface area of a sphere: $S = 4\\pi r^2$.`, `$S = 4 \\times \\frac{22}{7} \\times ${r} \\times ${r}$`, `Cancel the 7 into ${r}: $4 \\times 22 \\times ${m} \\times ${r} = ${f2(v)}$ cm²`];
    } else {
      const m = ri(1, 2), r = 7 * m, h = ri(3, 20); v = 2 * (22 / 7) * r * h; w = [(22 / 7) * r * r * h, (22 / 7) * r * h, 2 * (22 / 7) * r * (r + h)]; q = `the curved surface area of a cylinder with radius ${r} cm and height ${h} cm`;
      how = [`The curved surface unrolls into a rectangle: width = circumference $2\\pi r$, height = $h$. So CSA $= 2\\pi rh$.`, `CSA $= 2 \\times \\frac{22}{7} \\times ${r} \\times ${h}$`, `Cancel the 7 into ${r}: $2 \\times 22 \\times ${m} \\times ${h} = ${f2(v)}$ cm²`];
    }
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
      how: [
        `Find the class mark (middle value) $x$ of each class: ${mids.map((m) => `$\\frac{${m - 5} + ${m + 5}}{2} = ${m}$`).join(", ")}.`,
        `Multiply each class mark by its frequency: ${mids.map((m, i) => `$${f[i]} \\times ${m} = ${f[i] * m}$`).join(", ")}.`,
        `Add them: $\\sum fx = ${mids.map((m, i) => f[i] * m).join(" + ")} = ${sum}$. Total frequency: $\\sum f = ${f.join(" + ")} = ${n}$.`,
        `Mean $= \\frac{\\sum fx}{\\sum f} = \\frac{${sum}}{${n}} = ${mean}$`,
      ],
    };
  });

  add("dice", "probability-basic", "Dice probability", () => {
    const count = (ok) => { let n = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (ok(a, b)) n++; return n; };
    const kind = ri(0, 2);
    const ways = (s) => count((a, b) => a + b === s);
    let q, w, list;
    if (kind === 0) {
      const s = ri(2, 12); w = ways(s); q = `Two dice are thrown. What is the probability that the sum is ${s}?`;
      const pairs = [];
      for (let a = 1; a <= 6; a++) if (s - a >= 1 && s - a <= 6) pairs.push(`(${a}, ${s - a})`);
      list = `The outcomes with sum ${s} are ${pairs.join(", ")}: that is ${w} outcome${w > 1 ? "s" : ""}.`;
    } else if (kind === 1) {
      const s = ri(4, 11); w = count((a, b) => a + b >= s); q = `Two dice are thrown. What is the probability that the sum is at least ${s}?`;
      const sums = []; for (let t = s; t <= 12; t++) sums.push(t);
      list = `Count the outcomes for each sum from ${s} to 12: ${sums.map((t) => `sum ${t}: ${ways(t)}`).join(", ")}. Total: $${sums.map(ways).join(" + ")} = ${w}$.`;
    } else {
      w = 6; q = "Two dice are thrown. What is the probability of a double (both dice the same)?";
      list = `The doubles are (1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6): that is 6 outcomes.`;
    }
    return { q, ans: [w / 36], show: M(frac(w, 36)), frac: true, max: 1, hint: "A fraction such as 1/6.", wrong: [w / 12, 1 / w, (w + 1) / 36, w / 6].filter((x) => x <= 1), how: [
      `Each die has 6 faces, so two dice give $6 \\times 6 = 36$ equally likely outcomes.`,
      list,
      `$P = \\frac{\\text{favourable}}{\\text{total}} = \\frac{${w}}{36}${frac(w, 36) === `\\frac{${w}}{36}` ? "" : ` = ${frac(w, 36)}`}$`,
    ] };
  });

  add("cards", "probability-basic", "Playing cards", () => {
    const [ev, w, why] = pick([
      ["a red card", 26, "Hearts and diamonds are red: $13 + 13 = 26$ cards."],
      ["a king", 4, "There is one king in each of the 4 suits: 4 cards."],
      ["a face card (J, Q or K)", 12, "Each suit has a jack, a queen and a king: $3 \\times 4 = 12$ cards."],
      ["a heart", 13, "Hearts is one whole suit: 13 cards."],
      ["a black king", 2, "The black suits are spades and clubs, each with one king: 2 cards."],
      ["an ace", 4, "There is one ace in each of the 4 suits: 4 cards."],
      ["the queen of spades", 1, "There is exactly one queen of spades: 1 card."],
      ["a red face card", 6, "Hearts and diamonds each have a jack, queen and king: $3 \\times 2 = 6$ cards."],
      ["a number card from 2 to 10", 36, "Each suit has the 9 number cards 2 to 10: $9 \\times 4 = 36$ cards."],
      ["a spade or an ace", 16, "13 spades, plus the 3 aces that are not spades (don't count the ace of spades twice): $13 + 3 = 16$ cards."],
    ]);
    return { q: `A card is drawn at random from a well-shuffled deck of 52. What is the probability of drawing ${ev}?`, ans: [w / 52], show: M(frac(w, 52)), frac: true, max: 1, hint: "A fraction such as 1/13.", wrong: [w / 26, 1 / w, (52 - w) / 52, w / 13].filter((x) => x <= 1), how: [
      `A deck has 52 cards: 4 suits (hearts and diamonds are red, spades and clubs are black) of 13 cards each.`,
      `Count the favourable cards. ${why}`,
      `$P = \\frac{${w}}{52}${w === 1 ? "" : ` = ${frac(w, 52)}`}$`,
    ] };
  });

  /* ================= Senior secondary ================= */
  add("sets", "sets", "Union of sets", () => {
    const A = ri(20, 60), B = ri(15, 50), both = ri(3, Math.min(A, B) - 2);
    return { q: `In a group, ${A} people like cricket, ${B} like football and ${both} like both. How many like at least one of the two?`, ans: [A + B - both], show: M(A + B - both), wrong: [A + B, A + B - 2 * both, A + B + both], how: [
      `Adding ${A} and ${B} counts the ${both} people who like both games twice, so take them away once.`,
      `$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$`,
      `$= ${A} + ${B} - ${both} = ${A + B - both}$`,
    ] };
  });

  add("allied", "trig-functions", "Trig of any angle", () => {
    const a = pick([120, 135, 150, 210, 225, 240, 300, 315, 330]), f = pick(["sin", "cos", "tan"]), v = trigVal(f, a);
    const ref = a < 180 ? 180 - a : a < 270 ? a - 180 : 360 - a;
    const base = a < 180 ? `180^\\circ - ${ref}^\\circ` : a < 270 ? `180^\\circ + ${ref}^\\circ` : `360^\\circ - ${ref}^\\circ`;
    const quad = a < 180 ? "second" : a < 270 ? "third" : "fourth";
    return {
      q: `Find $\\${f} ${a}^\\circ$.`, ans: [v], show: M(surd(v)), opts: surdOpts(v, true), hint: "Surds are fine: type -sqrt(3)/2.",
      how: [
        `Write $${a}^\\circ = ${base}$, so the reference angle is $${ref}^\\circ$.`,
        `$${a}^\\circ$ is in the ${quad} quadrant. "All Students Take Coffee": there only ${{ second: "sin", third: "tan", fourth: "cos" }[quad]} is positive, so $\\${f} ${a}^\\circ$ is ${v < 0 ? "negative" : "positive"}.`,
        `$\\${f} ${a}^\\circ = ${v < 0 ? "-" : ""}\\${f} ${ref}^\\circ$, and $\\${f} ${ref}^\\circ = ${surd(Math.abs(v))}$.`,
        `So $\\${f} ${a}^\\circ = ${surd(v)}$.`,
      ],
    };
  }, true);

  add("complex-mod", "complex", "Modulus of a complex number", () => {
    const t = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]]);
    const [p, q] = Math.random() < 0.5 ? [t[0], t[1]] : [t[1], t[0]];
    const a = sgn() * p, b = sgn() * q;
    return { q: `Find $|z|$ for $z = ${cx(a, b)}$.`, ans: [t[2]], show: M(t[2]), wrong: [p + q, t[2] ** 2, Math.abs(a + b)], how: [
      `For $z = a + bi$, the modulus is $|z| = \\sqrt{a^2 + b^2}$ (its distance from 0).`,
      `Here $a = ${a}$ and $b = ${b}$.`,
      `$|z| = \\sqrt{${par(a)}^2 + ${par(b)}^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${t[2] ** 2}} = ${t[2]}$`,
    ] };
  });

  add("complex-mul", "complex", "Multiplying complex numbers", () => {
    let a, b, c, d;
    do { a = nz(-5, 5); b = nz(-5, 5); c = nz(-5, 5); d = nz(-5, 5); } while (b * d === 0 || a * d + b * c === 0 || a * d - b * c === 0);
    const re = a * c - b * d, im = a * d + b * c;
    return {
      q: `Simplify $(${cx(a, b)})(${cx(c, d)})$.`, opts: [cx(re, im), cx(a * c + b * d, im), cx(re, a * d - b * c), cx(a * c, b * d)].map(M),
      how: [
        `Multiply out like two brackets: every part of the first times every part of the second.`,
        `$${a} \\times ${par(c)} = ${a * c}$, $${a} \\times ${d < 0 ? `(${cx(0, d)})` : cx(0, d)} = ${cx(0, a * d)}$, $${cx(0, b)} \\times ${par(c)} = ${cx(0, b * c)}$, $${cx(0, b)} \\times ${d < 0 ? `(${cx(0, d)})` : cx(0, d)} = ${b * d === 1 ? "" : b * d === -1 ? "-" : b * d}i^2$`,
        `Since $i^2 = -1$: $${b * d === 1 ? "" : b * d === -1 ? "-" : b * d}i^2 = ${-b * d}$.`,
        `Real part: $${a * c} + ${par(-b * d)} = ${re}$. Imaginary part: $${a * d} + ${par(b * c)} = ${im}$.`,
        `Answer: $${cx(re, im)}$`,
      ],
    };
  });

  add("ncr", "pnc", "Combinations", () => {
    const n = ri(5, 12), r = ri(2, 4), v = E.nCr(n, r);
    return { q: `Evaluate $\\binom{${n}}{${r}}$.`, ans: [v], show: M(v), wrong: [v * E.fact(r), E.nCr(n, r + 1), E.nCr(n, r - 1), n * r], how: [
      `$\\binom{n}{r} = \\frac{n!}{r!\\,(n - r)!}$ counts the ways to choose $r$ things from $n$ when order doesn't matter.`,
      `Cancel $${n - r}!$ from top and bottom: $\\binom{${n}}{${r}} = \\frac{${Array.from({ length: r }, (_, i) => n - i).join(" \\times ")}}{${Array.from({ length: r }, (_, i) => r - i).join(" \\times ")}}$`,
      `$= \\frac{${E.fact(n) / E.fact(n - r)}}{${E.fact(r)}} = ${v}$`,
    ] };
  }, true);

  add("npr", "pnc", "Permutations", () => {
    if (Math.random() < 0.5) {
      const word = pick(["MATHS", "LOGIC", "PRIME", "DELHI", "FRIEND", "NUMBER", "MONDAY", "EQUATION"]), n = word.length, v = E.fact(n);
      return { q: `In how many ways can the letters of the word ${word} be arranged?`, ans: [v], show: M(v), wrong: [E.fact(n - 1), v / 2, n * n, n * (n - 1)], how: [
      `${word} has ${n} letters, and they are all different.`,
      `The first position has ${n} choices, the next ${n - 1}, then ${n - 2}, and so on down to 1.`,
      `$${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(" \\times ")} = ${v}$`,
    ] };
    }
    const n = ri(5, 10), r = ri(2, 4), v = E.fact(n) / E.fact(n - r);
    return { q: `Evaluate $^{${n}}P_{${r}}$.`, ans: [v], show: M(v), wrong: [E.nCr(n, r), n ** r, E.fact(n) / E.fact(n - r + 1)], how: [
      `$^{n}P_{r} = \\frac{n!}{(n - r)!}$ counts ordered arrangements of $r$ things from $n$.`,
      `Cancelling $${n - r}!$ leaves ${r} numbers counting down from ${n}.`,
      `$^{${n}}P_{${r}} = ${Array.from({ length: r }, (_, i) => n - i).join(" \\times ")} = ${v}$`,
    ] };
  });

  add("binom-coef", "binomial", "Binomial coefficients", () => {
    const n = ri(3, 7), k = ri(1, n - 1), a = pick([2, 3, -1, -2]), C = E.nCr(n, k), v = C * a ** k;
    const inner = `1 ${a < 0 ? "-" : "+"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x`;
    return { q: `Find the coefficient of $${pw("x", k)}$ in $(${inner})^{${n}}$.`, ans: [v], show: M(v), wrong: [C, C * a, -v, E.nCr(n, k + 1) * a ** k], how: [
      `In $(1 + y)^n$ the general term is $\\binom{n}{k}y^k$. Here $y = ${a === -1 ? "-x" : `${a}x`}$ and $n = ${n}$.`,
      `For $${pw("x", k)}$ take $k = ${k}$: the term is $\\binom{${n}}{${k}}(${a === -1 ? "-x" : `${a}x`})^{${k}}$.`,
      `$\\binom{${n}}{${k}} = ${C}$ and $${par(a)}^{${k}} = ${a ** k}$.`,
      `Coefficient $= ${C} \\times ${par(a ** k)} = ${v}$`,
    ] };
  });

  add("gp-sum", "sequences", "Sum of a GP", () => {
    const a = ri(1, 5), r = pick([2, 3]), n = ri(4, 7), Sn = (a * (r ** n - 1)) / (r - 1);
    return { q: `Find the sum of the first ${n} terms of $${a}, ${a * r}, ${a * r * r}, \\ldots$`, ans: [Sn], show: M(Sn), wrong: [a * r ** (n - 1), (a * (r ** (n + 1) - 1)) / (r - 1), a * r ** n], how: [
      `Sum of a GP with $r > 1$: $S_n = \\frac{a(r^n - 1)}{r - 1}$.`,
      `First term $a = ${a}$, common ratio $r = \\frac{${a * r}}{${a}} = ${r}$, and $n = ${n}$.`,
      `$${r}^{${n}} = ${r ** n}$, so $S_{${n}} = \\frac{${a}(${r ** n} - 1)}{${r} - 1}${r === 2 ? "" : ` = \\frac{${a * (r ** n - 1)}}{${r - 1}}`}$`,
      `$S_{${n}} = ${Sn}$`,
    ] };
  });

  add("slope", "lines-conics", "Slope of a line", () => {
    const x1 = ri(-6, 6), y1 = ri(-6, 6);
    let x2, y2; do { x2 = ri(-6, 6); y2 = ri(-6, 6); } while (x2 === x1 || y2 === y1 || Math.abs(y2 - y1) === Math.abs(x2 - x1));
    const m = frac(y2 - y1, x2 - x1);
    return { q: `Find the slope of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`, ans: [(y2 - y1) / (x2 - x1)], show: M(m), frac: true, hint: "Fractions such as -3/4 are fine.", wrong: [(x2 - x1) / (y2 - y1), -(y2 - y1) / (x2 - x1), (y2 + y1) / (x2 + x1 || 1)], how: [
      `Slope $m = \\frac{y_2 - y_1}{x_2 - x_1}$ (rise over run).`,
      `Rise: $${y2} - ${par(y1)} = ${y2 - y1}$. Run: $${x2} - ${par(x1)} = ${x2 - x1}$.`,
      `$m = \\frac{${y2 - y1}}{${x2 - x1}}${m === `\\frac{${y2 - y1}}{${x2 - x1}}` ? "" : ` = ${m}`}$`,
    ] };
  });

  add("limit", "limits-derivatives", "Limits", () => {
    const k = ri(0, 2);
    if (k === 0) {
      const a = nz(-6, 6);
      return { q: M(`\\lim_{x \\to ${a}} \\frac{x^2 - ${a * a}}{x ${a < 0 ? "+" : "-"} ${Math.abs(a)}}`), ans: [2 * a], show: M(2 * a), wrong: [a, 0, a * a], how: [
        `Putting $x = ${a}$ straight in gives $\\frac{0}{0}$, so simplify first.`,
        `The top is a difference of squares: $x^2 - ${a * a} = ${fx(a)}${fx(-a)}$.`,
        `Cancel the common factor $${fx(a)}$: the expression becomes $${fx(-a).slice(1, -1)}$.`,
        `Now put $x = ${a}$: $${a} ${a < 0 ? "-" : "+"} ${Math.abs(a)} = ${2 * a}$.`,
      ] };
    }
    if (k === 1) {
      const c = ri(2, 9);
      return { q: M(`\\lim_{x \\to 0} \\frac{\\sin ${c}x}{x}`), ans: [c], show: M(c), frac: true, wrong: [1, 0, 1 / c], how: [
        `Use the standard limit $\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$.`,
        `Multiply top and bottom by ${c}: $\\frac{\\sin ${c}x}{x} = ${c} \\cdot \\frac{\\sin ${c}x}{${c}x}$.`,
        `As $x \\to 0$, $u = ${c}x \\to 0$ too, so the limit is $${c} \\times 1 = ${c}$.`,
      ] };
    }
    const n = ri(2, 4), a = ri(1, 3), v = n * a ** (n - 1);
    return { q: M(`\\lim_{x \\to ${a}} \\frac{x^{${n}} - ${a ** n}}{x - ${a}}`), ans: [v], show: M(v), wrong: [a ** (n - 1), n * a ** n, (n - 1) * a ** n, 0], how: [
      `Putting $x = ${a}$ straight in gives $\\frac{0}{0}$. Use the standard limit $\\lim_{x \\to a} \\frac{x^n - a^n}{x - a} = na^{n-1}$.`,
      `Here $n = ${n}$ and $a = ${a}$, since $${a ** n} = ${a}^{${n}}$.`,
      `$${n} \\times ${a}^{${n - 1}} = ${n} \\times ${a ** (n - 1)} = ${v}$`,
    ] };
  }, true);

  add("derivative", "limits-derivatives", "Derivatives", () => {
    const a = nz(-5, 5), n = ri(2, 4), b = nz(-6, 6), m = ri(1, n - 1), c = ri(-9, 9), k = ri(-3, 3);
    const v = a * n * k ** (n - 1) + b * m * k ** (m - 1), f = a * k ** n + b * k ** m + c;
    return {
      q: `If $f(x) = ${terms([[a, pw("x", n)], [b, pw("x", m)], [c, ""]])}$, find $f'(${k})$.`,
      ans: [v], show: M(v), wrong: [f, a * k ** (n - 1) + b * k ** (m - 1), v + c],
      how: (() => {
        const t1 = a * n * k ** (n - 1), t2 = b * m * k ** (m - 1);
        const p1 = `${a * n} \\times ${par(k)}${n - 1 > 1 ? `^{${n - 1}}` : ""} = ${t1}`;
        const p2 = m === 1 ? `the second term is just $${b}$` : `$${b * m} \\times ${par(k)}${m - 1 > 1 ? `^{${m - 1}}` : ""} = ${t2}$`;
        return [
          `Power rule: $\\frac{d}{dx}x^n = nx^{n-1}$. A constant on its own differentiates to 0.`,
          `$\\frac{d}{dx}\\left(${terms([[a, pw("x", n)]])}\\right) = ${terms([[a * n, pw("x", n - 1)]])}$ and $\\frac{d}{dx}\\left(${terms([[b, pw("x", m)]])}\\right) = ${terms([[b * m, pw("x", m - 1)]])}$${c ? `, and the constant $${c}$ disappears` : ""}.`,
          `So $f'(x) = ${terms([[a * n, pw("x", n - 1)], [b * m, pw("x", m - 1)]])}$.`,
          `Put $x = ${k}$: $${p1}$ and ${p2}.`,
          `$f'(${k}) = ${t1} + ${par(t2)} = ${v}$`,
        ];
      })(),
    };
  });

  add("d-expr", "limits-derivatives", "Differentiating functions", () => {
    const A = nz(-5, 5), n = ri(2, 5), B = nz(-4, 4), trig = pick(["sin", "cos"]), C = ri(0, 3);
    const other = trig === "sin" ? "cos" : "sin", ts = trig === "sin" ? 1 : -1;
    const f = terms([[A, pw("x", n)], [B, `\\${trig} x`], [C, "e^x"]]);
    const d = (c, p, s) => terms([[c, pw("x", p)], [s * B, `\\${other} x`], [C, "e^x"]]);
    return {
      q: `Find $\\dfrac{d}{dx}\\left(${f}\\right)$.`, opts: [d(A * n, n - 1, ts), d(A * n, n - 1, -ts), d(A, n - 1, ts), d(A * n, n, ts)].map(M),
      how: [
        `Differentiate term by term.`,
        `Power rule: $\\frac{d}{dx}\\left(${terms([[A, pw("x", n)]])}\\right) = ${A === 1 ? "" : `${A} \\times `}${n}${pw("x", n - 1)}${A === 1 ? "" : ` = ${terms([[A * n, pw("x", n - 1)]])}`}$`,
        `$\\frac{d}{dx}\\${trig} x = ${trig === "sin" ? "\\cos x" : "-\\sin x"}$, so $\\frac{d}{dx}\\left(${terms([[B, `\\${trig} x`]])}\\right) = ${terms([[ts * B, `\\${other} x`]])}$`,
        ...(C ? [`$e^x$ is its own derivative, so $${terms([[C, "e^x"]])}$ stays the same.`] : []),
        `Answer: $${d(A * n, n - 1, ts)}$`,
      ],
    };
  });

  add("maxmin", "app-derivatives", "Maxima and minima", () => {
    const a = ri(1, 3), h = nz(-5, 5), k = ri(-9, 9), b = -2 * a * h, c = a * h * h + k;
    const f = terms([[a, "x^2"], [b, "x"], [c, ""]]);
    const steps = [
      `At a minimum the slope is zero, so solve $f'(x) = 0$.`,
      `$f'(x) = ${terms([[2 * a, "x"], [b, ""]])}$. Setting it to 0: $${2 * a}x = ${-b}$, so $x = ${h}$.`,
      `$f''(x) = ${2 * a} > 0$, so the curve bends upwards and this is a minimum.`,
    ];
    if (Math.random() < 0.5) return { q: `Find the minimum value of $f(x) = ${f}$.`, ans: [k], show: M(k), wrong: [h, c, -k, k + a].filter((x) => x !== k), how: [...steps, `Minimum value: $f(${h}) = ${a === 1 ? "" : `${a} \\times `}${par(h)}^2 ${b < 0 ? "-" : "+"} ${Math.abs(b)} \\times ${par(h)} + ${par(c)} = ${a * h * h} + ${par(b * h)} + ${par(c)} = ${k}$`] };
    return { q: `At what value of $x$ is $f(x) = ${f}$ smallest?`, ans: [h], show: M(`x = ${h}`), form: (v) => `x = ${tn(v[0])}`, wrong: [-h, k, b], how: [...steps, `So $f$ is smallest at $x = ${h}$.`] };
  });

  add("integral", "integrals", "Definite integrals", () => {
    const al = ri(1, 3), be = ri(-3, 3), c = ri(-5, 5), k = ri(1, 3);
    const v = al * k ** 3 + be * k ** 2 + c * k, g = 3 * al * k * k + 2 * be * k + c;
    return {
      q: `Evaluate $\\displaystyle\\int_0^{${k}} \\left(${terms([[3 * al, "x^2"], [2 * be, "x"], [c, ""]])}\\right) dx$.`,
      ans: [v], show: M(v), wrong: [g, 6 * al * k + 2 * be, v * 2],
      how: [
        `Integrate each term with $\\int x^n\\,dx = \\frac{x^{n+1}}{n+1}$.`,
        [`$\\int ${terms([[3 * al, "x^2"]])}\\,dx = ${terms([[al, "x^3"]])}$`, be ? `$\\int ${terms([[2 * be, "x"]])}\\,dx = ${terms([[be, "x^2"]])}$` : "", c ? `$\\int ${c}\\,dx = ${terms([[c, "x"]])}$` : ""].filter(Boolean).join(", "),
        `So $F(x) = ${terms([[al, "x^3"], [be, "x^2"], [c, "x"]])}$, and the answer is $F(${k}) - F(0)$.`,
        `$F(${k}) = ${al * k ** 3} + ${par(be * k * k)} + ${par(c * k)} = ${v}$ and $F(0) = 0$, so the integral is $${v}$.`,
      ],
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
      how: [
        `Integrate term by term, then add one constant $C$.`,
        `Power rule: $\\int ${terms([[A, pw("x", n)]])}\\,dx = ${A} \\cdot \\frac{x^{${n + 1}}}{${n + 1}} = ${terms([[m, pw("x", n + 1)]])}$`,
        `$\\int \\${trig} x\\,dx = ${trig === "sin" ? "-\\cos x" : "\\sin x"}$, so $\\int ${terms([[B, `\\${trig} x`]])}\\,dx = ${terms([[s * B, `\\${other} x`]])}$`,
        `Answer: $${F(m, n + 1, s)}$`,
      ],
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
    return { q: `Find the order and degree of $${eq}$.`, opts, how: [
      `Order = the highest derivative that appears. Degree = the power of that highest derivative.`,
      `The highest derivative here is $${D(o)}$, so the order is ${o}.`,
      `$${D(o)}$ is raised to the power ${p}, so the degree is ${p}.`,
      `Answer: order ${o}, degree ${p}.`,
    ] };
  });

  add("det2", "matrices", "2×2 determinants", () => {
    const [a, b, c, d] = [0, 0, 0, 0].map(() => ri(-9, 9));
    return { q: `Find the determinant of $${bm([[a, b], [c, d]])}$.`, ans: [a * d - b * c], show: M(a * d - b * c), wrong: [a * d + b * c, a * b - c * d, b * c - a * d], how: [
      `For $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ the determinant is $ad - bc$ (main diagonal minus the other diagonal).`,
      `$ad = ${par(a)} \\times ${par(d)} = ${a * d}$ and $bc = ${par(b)} \\times ${par(c)} = ${b * c}$.`,
      `$ad - bc = ${a * d} - ${par(b * c)} = ${a * d - b * c}$`,
    ] };
  }, true);

  add("matmul", "matrices", "Matrix multiplication", () => {
    const g = () => [[ri(-3, 4), ri(-3, 4)], [ri(-3, 4), ri(-3, 4)]];
    const mul = (X, Y) => [[X[0][0] * Y[0][0] + X[0][1] * Y[1][0], X[0][0] * Y[0][1] + X[0][1] * Y[1][1]], [X[1][0] * Y[0][0] + X[1][1] * Y[1][0], X[1][0] * Y[0][1] + X[1][1] * Y[1][1]]];
    const A = g(), B = g(), AB = mul(A, B);
    const cand = [mul(B, A), [[A[0][0] * B[0][0], A[0][1] * B[0][1]], [A[1][0] * B[1][0], A[1][1] * B[1][1]]], [[AB[0][0], AB[1][0]], [AB[0][1], AB[1][1]]], [[AB[0][0], -AB[0][1]], [AB[1][0], AB[1][1]]], [[AB[0][0] + 1, AB[0][1]], [AB[1][0], AB[1][1] - 1]], [[AB[0][0], AB[0][1] + 2], [AB[1][0], AB[1][1]]], [[AB[0][0] - 1, AB[0][1]], [AB[1][0] + 1, AB[1][1]]]];
    const seen = new Set([bm(AB)]), opts = [bm(AB)];
    for (const C of cand) { const s = bm(C); if (!seen.has(s) && opts.length < 4) { seen.add(s); opts.push(s); } }
    return { q: `If $A = ${bm(A)}$ and $B = ${bm(B)}$, find $AB$.`, opts: opts.map(M), how: (() => {
      const e = (i, j) => `${par(A[i][0])} \\cdot ${par(B[0][j])} + ${par(A[i][1])} \\cdot ${par(B[1][j])} = ${AB[i][j]}`;
      return [
        `Entry (row $i$, column $j$) of $AB$ = row $i$ of $A$ times column $j$ of $B$: multiply matching pairs and add.`,
        `Top row of $A$: top-left $= ${e(0, 0)}$, top-right $= ${e(0, 1)}$.`,
        `Bottom row of $A$: bottom-left $= ${e(1, 0)}$, bottom-right $= ${e(1, 1)}$.`,
        `So $AB = ${bm(AB)}$.`,
      ];
    })() };
  });

  add("dot", "vectors", "Dot product", () => {
    const a = [0, 0, 0].map(() => ri(-5, 5)), b = [0, 0, 0].map(() => ri(-5, 5));
    const v = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    return { q: `Find $\\vec a \\cdot \\vec b$ for $\\vec a = (${a.join(", ")})$ and $\\vec b = (${b.join(", ")})$.`, ans: [v], show: M(v), wrong: [a[0] * b[0] - a[1] * b[1] + a[2] * b[2], v + 2, -v], how: [
      `Dot product: multiply matching components and add, $\\vec a \\cdot \\vec b = a_1b_1 + a_2b_2 + a_3b_3$.`,
      a.map((x, i) => `$${par(x)} \\times ${par(b[i])} = ${x * b[i]}$`).join(", "),
      `Add: $${a.map((x, i) => par(x * b[i])).join(" + ")} = ${v}$`,
    ] };
  });

  add("vec-mag", "vectors", "Magnitude of a vector", () => {
    const [p, q, r, m] = pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [4, 8, 8, 12]]);
    const [a, b, c] = shuffle([p, q, r]).map((x) => sgn() * x);
    const v = `${a}\\hat i ${b < 0 ? "-" : "+"} ${Math.abs(b)}\\hat j ${c < 0 ? "-" : "+"} ${Math.abs(c)}\\hat k`;
    return { q: `Find $|\\vec v|$ for $\\vec v = ${v}$.`, ans: [m], show: M(m), wrong: [p + q + r, m * m, Math.abs(a + b + c) || m + 2], how: [
      `For $\\vec v = a\\hat i + b\\hat j + c\\hat k$, the magnitude is $|\\vec v| = \\sqrt{a^2 + b^2 + c^2}$.`,
      `$${par(a)}^2 + ${par(b)}^2 + ${par(c)}^2 = ${a * a} + ${b * b} + ${c * c} = ${m * m}$`,
      `$|\\vec v| = \\sqrt{${m * m}} = ${m}$`,
    ] };
  });

  add("coin-prob", "probability-adv", "Binomial probability", () => {
    const n = ri(3, 6), k = ri(0, n), C = E.nCr(n, k);
    return { q: `A fair coin is tossed ${n} times. What is the probability of exactly ${k} head${k === 1 ? "" : "s"}?`, ans: [C / 2 ** n], show: M(frac(C, 2 ** n)), frac: true, max: 1, hint: "A fraction such as 3/8.", wrong: [1 / 2 ** n, k / n, C / 2 ** (n + 1), (C + 1) / 2 ** n].filter((x) => x <= 1), how: [
      `Each toss is heads or tails, so ${n} tosses give $2^{${n}} = ${2 ** n}$ equally likely outcomes.`,
      `Outcomes with exactly ${k} head${k === 1 ? "" : "s"}: choose which ${k} of the ${n} tosses are heads, $\\binom{${n}}{${k}} = ${C}$ way${C === 1 ? "" : "s"}.`,
      `$P = \\frac{${C}}{${2 ** n}}${frac(C, 2 ** n) === `\\frac{${C}}{${2 ** n}}` ? "" : ` = ${frac(C, 2 ** n)}`}$`,
    ] };
  });

  add("cond-prob", "probability-adv", "Conditional probability", () => {
    const b = pick([4, 5, 6, 8]), a = ri(1, b - 1);
    return {
      q: `If $P(B) = ${b / 10}$ and $P(A \\cap B) = ${a / 10}$, find $P(A \\mid B)$.`, ans: [a / b], show: M(frac(a, b)), frac: true, max: 1, hint: "A fraction such as 3/4.",
      wrong: [(a * b) / 100, a / 10, b ? (b - a) / b : 0, a / (10 - b)].filter((x) => x > 0 && x <= 1),
      how: [
        `$P(A \\mid B)$ means: given that $B$ has happened, how likely is $A$? Only the part of $A$ inside $B$ counts.`,
        `$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{${a / 10}}{${b / 10}}$`,
        `Multiply top and bottom by 10: $\\frac{${a}}{${b}}${frac(a, b) === `\\frac{${a}}{${b}}` ? "" : ` = ${frac(a, b)}`}$`,
      ],
    };
  });

  add("lpp", "lpp", "Corner-point method", () => {
    const p = ri(4, 10), q = ri(4, 10), r = ri(1, p - 1), s = ri(1, q - 1), A = ri(1, 9), B = ri(1, 9);
    const pts = [[0, 0], [p, 0], [r, s], [0, q]], Z = pts.map(([x, y]) => A * x + B * y), mx = Math.max(...Z);
    return {
      q: `The corner points of a feasible region are ${pts.map(([x, y]) => `$(${x}, ${y})$`).join(", ")}. Find the maximum of $Z = ${terms([[A, "x"], [B, "y"]])}$.`,
      ans: [mx], show: M(mx), wrong: Z.filter((z) => z !== mx).concat([mx + A, A + B]),
      how: [
        `Corner-point method: the maximum of $Z$ over a bounded feasible region is always at one of its corner points.`,
        `Work out $Z = ${terms([[A, "x"], [B, "y"]])}$ at each corner: ${pts.map(([x, y], i) => `$Z(${x}, ${y}) = ${A} \\times ${x} + ${B} \\times ${y} = ${Z[i]}$`).join(", ")}.`,
        `The largest value is $${mx}$, at $(${pts[Z.indexOf(mx)].join(", ")})$, so the maximum is $${mx}$.`,
      ],
    };
  });

  add("modpow", "number-theory", "Modular powers", () => {
    const p = pick([5, 7, 11, 13]);
    let a; do a = ri(2, 12); while (a % p === 0);
    const k = ri(20, 99), r = k % (p - 1), v = E.modpow(a, k, p);
    return {
      q: `Find the remainder when $${a}^{${k}}$ is divided by $${p}$.`, ans: [v], show: M(v), min: 0, max: p - 1, wrong: [a % p, E.modpow(a, k % p, p), (v + 1) % p, p - 1 - v],
      how: (() => {
        const Q = Math.floor(k / (p - 1)), pows = [];
        for (let i = 1, cur = 1; i <= r; i++) { cur = (cur * a) % p; pows.push(`$${a}^{${i}} \\equiv ${cur}$`); }
        return [
          `${p} is prime and does not divide ${a}, so Fermat's little theorem gives $${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$.`,
          `Divide the exponent by ${p - 1}: $${k} = ${p - 1} \\times ${Q} + ${r}$.`,
          `So $${a}^{${k}} = \\left(${a}^{${p - 1}}\\right)^{${Q}} \\times ${a}^{${r}} \\equiv 1 \\times ${a}^{${r}} \\pmod{${p}}$.`,
          r === 0 ? `$${a}^{0} = 1$, so the remainder is $1$.` : `Work out powers of ${a} mod ${p}, multiplying by ${a} and reducing each time: ${pows.join(", ")}.`,
          `The remainder is $${v}$.`,
        ];
      })(),
    };
  });

  /* ================= College ================= */
  add("eigen", "linear-algebra", "Eigenvalues", () => {
    let a, b; do { a = ri(-4, 6); b = nz(-5, 5); } while (a === 0 && Math.abs(b) === Math.abs(a));
    return {
      q: `Find the eigenvalues of $${bm([[a, b], [b, a]])}$.`, ans: [a + b, a - b], form: (v) => `\\lambda = ${v.map(tn).join(",\\ ")}`,
      show: `$\\lambda = ${Math.min(a + b, a - b)}$ and $\\lambda = ${Math.max(a + b, a - b)}$`, hint: "Separate the two values with a comma.",
      wrong: [[a, b], [2 * a, 0], [a * a - b * b, 2 * a], [-(a + b), -(a - b)]],
      how: [
        `Eigenvalues solve $\\det(A - \\lambda I) = 0$.`,
        `$\\det\\begin{bmatrix} ${a} - \\lambda & ${b} \\\\ ${b} & ${a} - \\lambda \\end{bmatrix} = (${a} - \\lambda)^2 - ${par(b)}^2 = 0$`,
        `So $(${a} - \\lambda)^2 = ${b * b}$, which means $${a} - \\lambda = \\pm ${Math.abs(b)}$.`,
        `$\\lambda = ${a} \\mp ${Math.abs(b)}$, so $\\lambda = ${a - Math.abs(b)}$ or $\\lambda = ${a + Math.abs(b)}$.`,
      ],
    };
  });

  add("partial", "multivariable", "Partial derivatives", () => {
    const a = nz(-4, 4), b = nz(-4, 4), p = nz(-3, 3), q = nz(-3, 3);
    const f = terms([[a, "x^2y"], [b, "xy^2"]]);
    const fx_ = 2 * a * p * q + b * q * q, fy = a * p * p + 2 * b * p * q;
    if (Math.random() < 0.5) return { q: `For $f(x, y) = ${f}$, find $f_x(${p}, ${q})$.`, ans: [fx_], show: M(fx_), wrong: [fy, a * p * q + b * q * q, fx_ + 1].filter((x) => x !== fx_), how: [
      `For $f_x$, treat $y$ as a constant and differentiate with respect to $x$.`,
      `$\\frac{\\partial}{\\partial x}\\left(${terms([[a, "x^2y"]])}\\right) = ${terms([[2 * a, "xy"]])}$ and $\\frac{\\partial}{\\partial x}\\left(${terms([[b, "xy^2"]])}\\right) = ${terms([[b, "y^2"]])}$, so $f_x = ${terms([[2 * a, "xy"], [b, "y^2"]])}$.`,
      `At $(${p}, ${q})$: $${2 * a} \\times ${par(p)} \\times ${par(q)} + ${par(b)} \\times ${par(q)}^2 = ${2 * a * p * q} + ${par(b * q * q)} = ${fx_}$`,
    ] };
    return { q: `For $f(x, y) = ${f}$, find $f_y(${p}, ${q})$.`, ans: [fy], show: M(fy), wrong: [fx_, a * p * p + b * p * q, fy - 1].filter((x) => x !== fy), how: [
      `For $f_y$, treat $x$ as a constant and differentiate with respect to $y$.`,
      `$\\frac{\\partial}{\\partial y}\\left(${terms([[a, "x^2y"]])}\\right) = ${terms([[a, "x^2"]])}$ and $\\frac{\\partial}{\\partial y}\\left(${terms([[b, "xy^2"]])}\\right) = ${terms([[2 * b, "xy"]])}$, so $f_y = ${terms([[a, "x^2"], [2 * b, "xy"]])}$.`,
      `At $(${p}, ${q})$: $${a} \\times ${par(p)}^2 + ${par(2 * b)} \\times ${par(p)} \\times ${par(q)} = ${a * p * p} + ${par(2 * b * p * q)} = ${fy}$`,
    ] };
  });

  add("taylor", "series", "Maclaurin coefficients", () => {
    const k = ri(0, 3);
    if (k === 0) {
      const c = pick([1, 2, 3, -1, -2]), n = ri(2, 4), v = c ** n / E.fact(n);
      return { q: `Find the coefficient of $x^{${n}}$ in the Maclaurin series of $e^{${c === 1 ? "" : c === -1 ? "-" : c}x}$.`, ans: [v], show: M(frac(c ** n, E.fact(n))), frac: true, wrong: [c ** n, 1 / E.fact(n), -v, c / E.fact(n)], how: [
        `$e^{u} = 1 + u + \\frac{u^2}{2!} + \\frac{u^3}{3!} + \\cdots$, so the $u^{n}$ term is $\\frac{u^n}{n!}$.`,
        `Put $u = ${c === 1 ? "" : c === -1 ? "-" : c}x$: the $x^{${n}}$ term is $\\frac{(${c === 1 ? "" : c === -1 ? "-" : c}x)^{${n}}}{${n}!} = \\frac{${par(c)}^{${n}}}{${E.fact(n)}}x^{${n}} = \\frac{${c ** n}}{${E.fact(n)}}x^{${n}}$.`,
        `Coefficient: $${frac(c ** n, E.fact(n))}$`,
      ] };
    }
    if (k === 1) {
      const f = pick(["sin", "cos"]), n = f === "sin" ? pick([3, 5]) : pick([2, 4]), sg = f === "sin" ? ((n - 1) / 2) % 2 ? -1 : 1 : (n / 2) % 2 ? -1 : 1, v = sg / E.fact(n);
      return { q: `Find the coefficient of $x^{${n}}$ in the Maclaurin series of $\\${f} x$.`, ans: [v], show: M(frac(sg, E.fact(n))), frac: true, wrong: [-v, 1 / n, sg / n], how: [
        `$\\${f} x = ${f === "sin" ? "x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots" : "1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots"}$: only ${f === "sin" ? "odd" : "even"} powers appear, and the signs alternate.`,
        `The $x^{${n}}$ term is $${sg < 0 ? "-" : "+"}\\frac{x^{${n}}}{${n}!}$.`,
        `$${n}! = ${E.fact(n)}$, so the coefficient is $${frac(sg, E.fact(n))}$.`,
      ] };
    }
    if (k === 2) {
      const n = ri(2, 6), v = (n % 2 ? 1 : -1) / n;
      return { q: `Find the coefficient of $x^{${n}}$ in the Maclaurin series of $\\ln(1 + x)$.`, ans: [v], show: M(frac(n % 2 ? 1 : -1, n)), frac: true, wrong: [-v, 1 / E.fact(n), 1 / (n + 1)], how: [
        `$\\ln(1 + x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\frac{x^4}{4} + \\cdots$: the $x^n$ term is divided by $n$ (not $n!$), and the signs alternate.`,
        `Odd powers are positive and even powers are negative. ${n} is ${n % 2 ? "odd" : "even"}, so the term is $${n % 2 ? "+" : "-"}\\frac{x^{${n}}}{${n}}$.`,
        `Coefficient: $${frac(n % 2 ? 1 : -1, n)}$`,
      ] };
    }
    const c = pick([2, 3, -2]), n = ri(2, 4), v = c ** n;
    return { q: `Find the coefficient of $x^{${n}}$ in the Maclaurin series of $\\dfrac{1}{1 ${c < 0 ? "+" : "-"} ${Math.abs(c)}x}$.`, ans: [v], show: M(v), wrong: [c * n, -v, v / E.fact(n)], how: [
      `Geometric series: $\\frac{1}{1 - u} = 1 + u + u^2 + u^3 + \\cdots$`,
      `Write $\\frac{1}{1 ${c < 0 ? "+" : "-"} ${Math.abs(c)}x} = \\frac{1}{1 - (${c}x)}$, so $u = ${c}x$.`,
      `The $x^{${n}}$ term is $(${c}x)^{${n}} = ${par(c)}^{${n}}x^{${n}} = ${v}x^{${n}}$.`,
      `Coefficient: $${v}$`,
    ] };
  });

  add("ode2", "ode2", "Second-order ODEs", () => {
    const ex = (r) => `e^{${r === 1 ? "" : r === -1 ? "-" : r}x}`;
    if (Math.random() < 0.75) {
      let r1, r2; do { r1 = nz(-5, 5); r2 = nz(-5, 5); } while (r1 >= r2 || r1 === -r2);
      const b = -(r1 + r2), c = r1 * r2;
      return {
        q: `Find the general solution of $${terms([[1, "y''"], [b, "y'"], [c, "y"]])} = 0$.`,
        opts: [`y = C_1${ex(r1)} + C_2${ex(r2)}`, `y = C_1${ex(-r1)} + C_2${ex(-r2)}`, `y = (C_1 + C_2x)${ex(r1)}`, `y = (C_1 + C_2x)${ex(r2)}`].map(M),
        how: [
          `Try $y = e^{mx}$. Substituting gives the auxiliary equation $${terms([[1, "m^2"], [b, "m"], [c, ""]])} = 0$.`,
          `Factorise: $(m ${r1 < 0 ? "+" : "-"} ${Math.abs(r1)})(m ${r2 < 0 ? "+" : "-"} ${Math.abs(r2)}) = 0$, so $m = ${r1}$ or $m = ${r2}$.`,
          `Two different real roots $m_1, m_2$ give $y = C_1e^{m_1x} + C_2e^{m_2x}$.`,
          `So $y = C_1${ex(r1)} + C_2${ex(r2)}$.`,
        ],
      };
    }
    const r = nz(-4, 4);
    return {
      q: `Find the general solution of $${terms([[1, "y''"], [-2 * r, "y'"], [r * r, "y"]])} = 0$.`,
      opts: [`y = (C_1 + C_2x)${ex(r)}`, `y = C_1${ex(r)} + C_2${ex(-r)}`, `y = (C_1 + C_2x)${ex(-r)}`, `y = C_1\\cos ${Math.abs(r) === 1 ? "" : Math.abs(r)}x + C_2\\sin ${Math.abs(r) === 1 ? "" : Math.abs(r)}x`].map(M),
      how: [
        `Try $y = e^{mx}$. Substituting gives the auxiliary equation $${terms([[1, "m^2"], [-2 * r, "m"], [r * r, ""]])} = 0$.`,
        `It is a perfect square: $(m ${r < 0 ? "+" : "-"} ${Math.abs(r)})^2 = 0$, so $m = ${r}$ twice (a repeated root).`,
        `A repeated root $m$ gives $y = (C_1 + C_2x)e^{mx}$. The extra $x$ is needed to get a second independent solution.`,
        `So $y = (C_1 + C_2x)${ex(r)}$.`,
      ],
    };
  });

  add("modinv", "number-theory", "Modular inverses", () => {
    const p = pick([7, 11, 13, 17]), a = ri(2, p - 1);
    let x = 1; while ((a * x) % p !== 1) x++;
    return { q: `Find the inverse of ${a} modulo ${p}, as a number from 1 to ${p - 1}.`, ans: [x], show: M(x), min: 1, max: p - 1, wrong: [p - x, a, (x % (p - 1)) + 1, p - a].filter((v) => v !== x && v > 0 && v < p), how: [
      `We need $x$ with $${a}x \\equiv 1 \\pmod{${p}}$: ${a} times $x$ must be 1 more than a multiple of ${p}.`,
      `List the numbers that are 1 more than a multiple of ${p}: ${Array.from({ length: (a * x - 1) / p + 1 }, (_, j) => j * p + 1).join(", ")}. The first one that ${a} divides is ${a * x}.`,
      `$${a * x} \\div ${a} = ${x}$, so $x = ${x}$.`,
      `Check: $${a} \\times ${x} = ${a * x} = ${p} \\times ${(a * x - 1) / p} + 1$, so $${a} \\times ${x} \\equiv 1 \\pmod{${p}}$ ✓`,
    ] };
  });

  add("graph-edges", "graphs", "Counting edges", () => {
    if (Math.random() < 0.5) {
      const n = ri(4, 12), v = (n * (n - 1)) / 2;
      return { q: `How many edges does the complete graph $K_{${n}}$ have?`, ans: [v], show: M(v), wrong: [n * (n - 1), n, n * (n + 1) / 2], how: [
        `In a complete graph every pair of vertices is joined by exactly one edge.`,
        `So count the pairs from ${n} vertices: $\\binom{${n}}{2} = \\frac{${n} \\times ${n - 1}}{2}$.`,
        `$= \\frac{${n * (n - 1)}}{2} = ${v}$ edges`,
      ] };
    }
    let degs; do degs = Array.from({ length: ri(5, 7) }, () => ri(1, 5)); while (degs.reduce((a, b) => a + b, 0) % 2);
    const sum = degs.reduce((a, b) => a + b, 0);
    return { q: `A graph has vertex degrees ${degs.join(", ")}. How many edges does it have?`, ans: [sum / 2], show: M(sum / 2), wrong: [sum, degs.length, sum / 2 + 1], how: [
      `Handshake lemma: every edge has two ends, so the degrees add up to twice the number of edges.`,
      `Sum of the degrees: $${degs.join(" + ")} = ${sum}$.`,
      `Edges $= ${sum} \\div 2 = ${sum / 2}$`,
    ] };
  });

  add("zscore", "stats-inference", "z-scores", () => {
    const mu = 5 * ri(8, 20), sd = pick([2, 4, 5, 8, 10]), z = pick([-2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5]), x = mu + z * sd;
    return { q: `Test scores have mean ${mu} and standard deviation ${sd}. Find the z-score of a score of ${x}.`, ans: [z], show: M(z), dec: true, wrong: [-z, (x - mu) / (sd * sd), z * 2], how: [
      `A z-score says how many standard deviations a value is from the mean: $z = \\frac{x - \\mu}{\\sigma}$.`,
      `Distance from the mean: $x - \\mu = ${x} - ${mu} = ${E.fmt(x - mu)}$.`,
      `$z = \\frac{${E.fmt(x - mu)}}{${sd}} = ${z}$`,
      z < 0 ? `The minus sign means the score is below the mean.` : `It is positive, so the score is above the mean.`,
    ] };
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
