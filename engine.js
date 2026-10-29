(function () {
  "use strict";

  const DEG = Math.PI / 180;

  class MathError extends Error {}

  const NAMES = [
    "asin", "acos", "atan", "sinh", "cosh", "tanh", "sin", "cos", "tan", "sec", "csc", "cot",
    "sqrt", "cbrt", "abs", "exp", "ln", "log", "floor", "ceil", "round", "sign", "ans", "pi", "e", "x", "y",
  ].sort((a, b) => b.length - a.length);

  const CONSTS = { pi: Math.PI, e: Math.E };

  function fact(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n > 170) return Infinity;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  const sinD = (a) => (a % 90 === 0 ? [0, 1, 0, -1][(((a / 90) % 4) + 4) % 4] : Math.sin(a * DEG));
  const cosD = (a) => sinD(a + 90);
  const tanD = (a) => {
    const r = ((a % 180) + 180) % 180;
    if (r === 0) return 0;
    if (r === 90) return NaN;
    return Math.tan(a * DEG);
  };

  function funcs(deg) {
    const t = deg
      ? { sin: sinD, cos: cosD, tan: tanD, asin: (x) => Math.asin(x) / DEG, acos: (x) => Math.acos(x) / DEG, atan: (x) => Math.atan(x) / DEG }
      : { sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan };
    return {
      ...t,
      sec: (x) => 1 / t.cos(x),
      csc: (x) => 1 / t.sin(x),
      cot: (x) => t.cos(x) / t.sin(x),
      sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
      sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, exp: Math.exp,
      ln: Math.log, log: Math.log10,
      floor: Math.floor, ceil: Math.ceil, round: Math.round, sign: Math.sign,
    };
  }

  function normalize(s) {
    return String(s)
      .toLowerCase()
      .replace(/[×·∙]/g, "*")
      .replace(/÷/g, "/")
      .replace(/[−–—]/g, "-")
      .replace(/π/g, "pi")
      .replace(/√/g, "sqrt")
      .replace(/²/g, "^2")
      .replace(/³/g, "^3")
      .replace(/\*\*/g, "^");
  }

  function tokenize(s) {
    const out = [];
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (/\s/.test(ch)) { i++; continue; }
      const m = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/.exec(s.slice(i));
      if (m) { out.push({ t: "num", v: parseFloat(m[0]) }); i += m[0].length; continue; }
      if (/[a-z]/.test(ch)) {
        const name = NAMES.find((n) => s.startsWith(n, i));
        if (!name) throw new MathError(`I don't recognise "${/^[a-z]+/.exec(s.slice(i))[0]}"`);
        out.push({ t: "name", v: name });
        i += name.length;
        continue;
      }
      if ("+-*/^()!%|".includes(ch)) { out.push({ t: "op", v: ch }); i++; continue; }
      throw new MathError(`Unexpected "${ch}"`);
    }
    return out;
  }

  function compile(src, opts = {}) {
    const vars = opts.vars || [];
    const F = funcs(!!opts.deg);
    const toks = tokenize(normalize(src));
    if (!toks.length) throw new MathError("Type an expression");
    let i = 0;
    const peek = () => toks[i];
    const isOp = (v) => toks[i] && toks[i].t === "op" && toks[i].v === v;
    const startsPrimary = () => {
      const t = peek();
      return t && (t.t === "num" || t.t === "name" || (t.t === "op" && t.v === "("));
    };

    function expr() {
      let l = term();
      while (isOp("+") || isOp("-")) {
        const o = toks[i++].v, r = term(), a = l;
        l = o === "+" ? (s) => a(s) + r(s) : (s) => a(s) - r(s);
      }
      return l;
    }
    function term() {
      let l = unary();
      for (;;) {
        if (isOp("*") || isOp("/")) {
          const o = toks[i++].v, r = unary(), a = l;
          l = o === "*" ? (s) => a(s) * r(s) : (s) => a(s) / r(s);
        } else if (startsPrimary()) {
          const r = power(), a = l;
          l = (s) => a(s) * r(s);
        } else break;
      }
      return l;
    }
    function unary() {
      if (isOp("-")) { i++; const a = unary(); return (s) => -a(s); }
      if (isOp("+")) { i++; return unary(); }
      return power();
    }
    function power() {
      const b = postfix();
      if (isOp("^")) { i++; const e = unary(); return (s) => Math.pow(b(s), e(s)); }
      return b;
    }
    function postfix() {
      let a = primary();
      while (isOp("!") || isOp("%")) {
        const o = toks[i++].v, b = a;
        a = o === "!" ? (s) => fact(b(s)) : (s) => b(s) / 100;
      }
      return a;
    }
    function closeParen() {
      if (!isOp(")")) throw new MathError("A bracket is missing: add )");
      i++;
    }
    function primary() {
      const t = toks[i++];
      if (!t) throw new MathError("The expression ends too early");
      if (t.t === "num") { const v = t.v; return () => v; }
      if (t.t === "op" && t.v === "(") { const a = expr(); closeParen(); return a; }
      if (t.t === "op" && t.v === "|") {
        const a = expr();
        if (!isOp("|")) throw new MathError("Close the absolute value with |");
        i++;
        return (s) => Math.abs(a(s));
      }
      if (t.t === "name") {
        if (t.v in CONSTS) { const v = CONSTS[t.v]; return () => v; }
        if (t.v === "ans") return (s) => (s && s.ans != null ? s.ans : 0);
        if (t.v === "x" || t.v === "y") {
          if (!vars.includes(t.v)) throw new MathError(`"${t.v}" can't be used here`);
          const n = t.v;
          return (s) => s[n];
        }
        const f = F[t.v];
        let arg;
        if (isOp("(")) { i++; arg = expr(); closeParen(); }
        else {
          if (!peek()) throw new MathError(`${t.v} needs a value after it`);
          arg = power();
        }
        return (s) => f(arg(s));
      }
      throw new MathError(`Unexpected "${t.v}"`);
    }

    const fn = expr();
    if (i < toks.length) throw new MathError(`Unexpected "${toks[i].v}"`);
    return fn;
  }

  function evaluate(src, scope, opts) {
    return compile(src, opts)(scope || {});
  }

  function fmt(x, sig = 12) {
    if (Number.isNaN(x)) return "undefined";
    if (!isFinite(x)) return x > 0 ? "∞" : "-∞";
    if (Number.isInteger(x) && Math.abs(x) < 1e15) return String(x);
    const a = Math.abs(x);
    if (a >= 1e15 || (a < 1e-6 && a > 0)) return x.toExponential(Math.min(sig, 10) - 1).replace(/\.?0+e/, "e");
    return String(parseFloat(x.toPrecision(sig)));
  }

  function toFrac(x, maxDen = 10000) {
    if (!isFinite(x)) return null;
    if (Number.isInteger(x)) return [x, 1];
    let h0 = 0, h1 = 1, k0 = 1, k1 = 0, b = x;
    for (let n = 0; n < 40; n++) {
      const a = Math.floor(b);
      const h2 = a * h1 + h0, k2 = a * k1 + k0;
      if (k2 > maxDen) break;
      h0 = h1; h1 = h2; k0 = k1; k1 = k2;
      if (Math.abs(x - h1 / k1) < 1e-12 * Math.max(1, Math.abs(x))) return [h1, k1];
      b = 1 / (b - a);
      if (!isFinite(b)) break;
    }
    return null;
  }

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
  }
  const lcm = (a, b) => (a && b ? Math.abs((a / gcd(a, b)) * b) : 0);

  function nCr(n, r) {
    if (r < 0 || r > n) return 0;
    r = Math.min(r, n - r);
    let v = 1;
    for (let k = 1; k <= r; k++) v = (v * (n - r + k)) / k;
    return Math.round(v);
  }

  function modpow(a, k, m) {
    let r = 1n, b = BigInt(a) % BigInt(m), e = BigInt(k);
    const M = BigInt(m);
    while (e > 0n) {
      if (e & 1n) r = (r * b) % M;
      b = (b * b) % M;
      e >>= 1n;
    }
    return Number(r);
  }

  function factorize(n) {
    const f = [];
    for (const p of [2, 3]) {
      let k = 0;
      while (n % p === 0) { n /= p; k++; }
      if (k) f.push([p, k]);
    }
    for (let p = 5; p * p <= n; p += 6) {
      for (const q of [p, p + 2]) {
        let k = 0;
        while (n % q === 0) { n /= q; k++; }
        if (k) f.push([q, k]);
      }
    }
    if (n > 1) f.push([n, 1]);
    return f;
  }

  window.MZE = { compile, evaluate, fmt, toFrac, gcd, lcm, nCr, fact, modpow, factorize, MathError };
})();
