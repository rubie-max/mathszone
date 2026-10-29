(function () {
  "use strict";
  const R = String.raw;

  window.MZ_LEVELS = [
    { id: "foundation", name: "Foundation", range: "Class 1–5", color: "#f59e0b", icon: "blocks", blurb: "Place value, the four operations, fractions, decimals, measurement and first shapes." },
    { id: "middle", name: "Middle school", range: "Class 6–8", color: "#10b981", icon: "ruler", blurb: "Integers, HCF and LCM, ratios, percentages, exponents, algebra and mensuration." },
    { id: "secondary", name: "Secondary", range: "Class 9–10", color: "#3b82f6", icon: "axes", blurb: "Polynomials, quadratics, progressions, coordinate geometry, trigonometry and probability." },
    { id: "senior", name: "Senior secondary", range: "Class 11–12", color: "#8b5cf6", icon: "integral", blurb: "Functions, complex numbers, counting, calculus, matrices, vectors and distributions." },
    { id: "college", name: "College and beyond", range: "Undergraduate", color: "#ec4899", icon: "cap", blurb: "Linear algebra, multivariable calculus, series, ODEs, number theory, graphs and statistics." },
  ];

  const T = (id, level, branch, title, summary, ideas, formulas, example, more) => ({
    id, level, branch, title, summary, ideas,
    formulas: formulas.map(([name, tex]) => ({ name, tex })),
    example, skills: [], ...(more || {}),
  });

  window.MZ_TOPICS = [
    /* ---------- Foundation ---------- */
    T("place-value", "foundation", "Arithmetic", "Numbers and place value",
      "Every digit's value depends on its position: ones, tens, hundreds, thousands and beyond.",
      [
        "Each place is worth 10 times the place to its right.",
        "The Indian system groups digits as thousands, lakhs and crores: 1,00,00,000 is one crore.",
        "The international system groups digits in threes: 10,000,000 is ten million.",
        "To compare two numbers, count the digits first, then compare digit by digit from the left.",
      ],
      [
        ["Expanded form", R`4372 = 4\times1000 + 3\times100 + 7\times10 + 2`],
        ["Indian and international", R`1\ \text{lakh} = 100{,}000,\qquad 1\ \text{crore} = 10\ \text{million}`],
      ],
      {
        q: "Write 5,08,346 in expanded form and in words.",
        steps: [R`$508346 = 5\times100000 + 0\times10000 + 8\times1000 + 3\times100 + 4\times10 + 6$`, "Read the lakhs, then the thousands, then the rest."],
        ans: "Five lakh eight thousand three hundred forty-six",
      }),

    T("add-sub", "foundation", "Arithmetic", "Addition and subtraction",
      "Adding combines amounts; subtracting finds what is left or how far apart two numbers are.",
      [
        "Line the digits up by place value and work from the ones column leftwards.",
        "Carry when a column adds to 10 or more; borrow when the top digit is smaller than the bottom one.",
        R`Order doesn't matter for addition, but it does for subtraction: $7 - 3 \ne 3 - 7$.`,
        R`Check a subtraction by adding back: if $a - b = c$ then $c + b = a$.`,
      ],
      [
        ["Commutative", R`a + b = b + a`],
        ["Associative", R`(a + b) + c = a + (b + c)`],
        ["Identity", R`a + 0 = a`],
        ["Checking subtraction", R`a - b = c \iff c + b = a`],
      ],
      {
        q: R`Work out $4726 + 1898$ and $5003 - 1478$.`,
        steps: [
          R`Ones: $6 + 8 = 14$, write 4 carry 1. Tens: $2 + 9 + 1 = 12$, write 2 carry 1. Hundreds: $7 + 8 + 1 = 16$, write 6 carry 1. Thousands: $4 + 1 + 1 = 6$.`,
          R`So $4726 + 1898 = 6624$.`,
          R`For $5003 - 1478$, borrow across the zeros: think of $5003$ as $4000 + 990 + 13$. Then $13 - 8 = 5$, $990 - 470 = 520$ and $4000 - 1000 = 3000$.`,
          R`Check: $3525 + 1478 = 5003$.`,
        ],
        ans: R`$6624$ and $3525$`,
      }, { skills: ["add"] }),

    T("mult-div", "foundation", "Arithmetic", "Multiplication and division",
      "Multiplication is repeated addition; division shares into equal groups or asks how many groups fit.",
      [
        R`Know the tables up to $12 \times 12$: they speed up everything that follows.`,
        "To multiply by 10, 100 or 1000, shift the digits one, two or three places left.",
        "In division the remainder is always smaller than the divisor.",
        R`Multiplication spreads over addition: $7 \times 23 = 7 \times 20 + 7 \times 3 = 161$.`,
      ],
      [
        ["Commutative", R`a \times b = b \times a`],
        ["Distributive", R`a(b + c) = ab + ac`],
        ["Division check", R`\text{dividend} = \text{divisor} \times \text{quotient} + \text{remainder}`],
        ["One and zero", R`a \times 1 = a,\qquad a \times 0 = 0`],
      ],
      {
        q: R`Find $157 \div 6$ and check the answer.`,
        steps: [R`$6 \times 20 = 120$, leaving $37$.`, R`$6 \times 6 = 36$, leaving $1$.`, "The quotient is 26 and the remainder is 1.", R`Check: $6 \times 26 + 1 = 157$.`],
        ans: "26 remainder 1",
      }, { skills: ["tables", "divide"] }),

    T("fractions", "foundation", "Arithmetic", "Fractions",
      R`A fraction $\frac{a}{b}$ means $a$ parts out of $b$ equal parts.`,
      [
        "The denominator (bottom) says how many equal parts the whole is cut into; the numerator (top) says how many you take.",
        "Multiply or divide the top and bottom by the same number to get an equivalent fraction.",
        "To add or subtract, first rewrite both fractions with a common denominator.",
        "Simplify by dividing the top and bottom by their HCF.",
      ],
      [
        ["Equivalent fractions", R`\frac{a}{b} = \frac{a \times k}{b \times k}`],
        ["Adding", R`\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}`],
        ["Multiplying", R`\frac{a}{b} \times \frac{c}{d} = \frac{ac}{bd}`],
        ["Dividing", R`\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \times \frac{d}{c}`],
      ],
      {
        q: R`Add $\frac{2}{3} + \frac{1}{6}$.`,
        steps: [R`The LCM of 3 and 6 is 6, so $\frac{2}{3} = \frac{4}{6}$.`, R`$\frac{4}{6} + \frac{1}{6} = \frac{5}{6}$.`, "5 and 6 share no common factor, so this is already in simplest form."],
        ans: R`$\frac{5}{6}$`,
      }, { skills: ["frac-add"], tool: "fractions" }),

    T("decimals", "foundation", "Arithmetic", "Decimals",
      "Decimals extend place value to the right of the point: tenths, hundredths, thousandths.",
      [
        R`$0.1 = \frac{1}{10}$, $0.01 = \frac{1}{100}$ and $0.001 = \frac{1}{1000}$.`,
        "Line up the decimal points before adding or subtracting.",
        "When multiplying, the answer has as many decimal places as both numbers together.",
        R`Some fractions give repeating decimals, like $\frac{1}{3} = 0.333\ldots$`,
      ],
      [
        ["Decimal to fraction", R`0.75 = \frac{75}{100} = \frac{3}{4}`],
        ["Multiplying by powers of 10", R`3.47 \times 100 = 347`],
        ["Recurring decimal", R`0.\overline{3} = \frac{1}{3}`],
      ],
      {
        q: R`Work out $2.5 \times 1.24$.`,
        steps: [R`Ignore the points: $25 \times 124 = 3100$.`, R`There are $1 + 2 = 3$ decimal places in total.`, R`So the answer is $3.100 = 3.1$.`],
        ans: R`$3.1$`,
      }),

    T("measurement", "foundation", "Arithmetic", "Measurement, time and money",
      "Converting between units of length, mass, capacity, time and money.",
      [
        R`Metric units step in powers of 10: kilo means 1000, centi means $\frac{1}{100}$ and milli means $\frac{1}{1000}$.`,
        "Going from a bigger unit to a smaller one, multiply; going from smaller to bigger, divide.",
        "Time isn't decimal: an hour has 60 minutes, not 100.",
        "₹1 = 100 paise.",
      ],
      [
        ["Length", R`1\,\text{km} = 1000\,\text{m},\quad 1\,\text{m} = 100\,\text{cm},\quad 1\,\text{cm} = 10\,\text{mm}`],
        ["Mass", R`1\,\text{kg} = 1000\,\text{g}`],
        ["Capacity", R`1\,\text{L} = 1000\,\text{mL}`],
        ["Time", R`1\,\text{h} = 60\,\text{min} = 3600\,\text{s}`],
      ],
      {
        q: "A film starts at 2:45 pm and lasts 2 h 35 min. When does it end?",
        steps: ["Add the hours: 2:45 pm + 2 h = 4:45 pm.", "Add the minutes: 45 + 35 = 80 minutes, which is 1 h 20 min.", "4:45 pm + 35 min = 5:20 pm."],
        ans: "5:20 pm",
      }),

    T("perimeter-area", "foundation", "Mensuration", "Perimeter and area",
      "Perimeter is the distance around a shape; area is the amount of surface it covers.",
      [
        "Perimeter is measured in units such as cm; area in square units such as cm².",
        "Split an L-shape into rectangles, find each area and add them.",
        "Two shapes can have the same area but different perimeters.",
        "A right triangle is exactly half of the rectangle drawn around it.",
      ],
      [
        ["Rectangle", R`P = 2(l + b),\qquad A = l \times b`],
        ["Square", R`P = 4a,\qquad A = a^2`],
        ["Triangle", R`A = \tfrac{1}{2} \times b \times h`],
      ],
      {
        q: "A rectangular garden is 18 m long and 12 m wide. Find its perimeter and area.",
        steps: [R`$P = 2(18 + 12) = 60$ m.`, R`$A = 18 \times 12 = 216$ m².`],
        ans: "60 m and 216 m²",
      }, { skills: ["rect"] }),

    /* ---------- Middle school ---------- */
    T("integers", "middle", "Arithmetic", "Integers",
      R`Whole numbers and their negatives: $\ldots, -2, -1, 0, 1, 2, \ldots$`,
      [
        "On a number line, numbers increase to the right.",
        R`Subtracting a negative is the same as adding: $a - (-b) = a + b$.`,
        "Same signs multiply to give a positive; different signs give a negative.",
        R`The absolute value $|a|$ is the distance of $a$ from zero.`,
      ],
      [
        ["Sign rules", R`(+)(+) = +,\quad (-)(-) = +,\quad (+)(-) = -`],
        ["Subtracting a negative", R`a - (-b) = a + b`],
        ["Absolute value", R`|a| = \begin{cases} a & a \ge 0 \\ -a & a < 0 \end{cases}`],
      ],
      {
        q: R`Work out $(-7) + 12 - (-5)$.`,
        steps: [R`$(-7) + 12 = 5$.`, R`$5 - (-5) = 5 + 5 = 10$.`],
        ans: R`$10$`,
      }, { skills: ["integers"] }),

    T("factors-multiples", "middle", "Number theory", "Factors, multiples, HCF and LCM",
      "Breaking numbers into prime factors to see what they share.",
      [
        "A prime has exactly two factors: 1 and itself. 1 is not prime.",
        "Every whole number above 1 has exactly one prime factorisation.",
        "HCF: take each common prime with its lowest power. LCM: take every prime with its highest power.",
        "Divisible by 3 or 9 when the digit sum is; by 4 when the last two digits are; by 8 when the last three are.",
      ],
      [
        ["HCF and LCM of two numbers", R`\text{HCF}(a,b) \times \text{LCM}(a,b) = a \times b`],
        ["Prime factorisation", R`360 = 2^3 \times 3^2 \times 5`],
      ],
      {
        q: "Find the HCF and LCM of 12 and 18.",
        steps: [R`$12 = 2^2 \times 3$ and $18 = 2 \times 3^2$.`, R`HCF $= 2 \times 3 = 6$.`, R`LCM $= 2^2 \times 3^2 = 36$.`, R`Check: $6 \times 36 = 216 = 12 \times 18$.`],
        ans: "HCF 6, LCM 36",
      }, { skills: ["hcf"], tool: "numbers" }),

    T("ratio-proportion", "middle", "Arithmetic", "Ratio and proportion",
      "A ratio compares two quantities; a proportion says two ratios are equal.",
      [
        R`Simplify a ratio like a fraction: $12 : 18 = 2 : 3$.`,
        "Put both quantities in the same units before comparing them.",
        "In direct proportion both grow together; in inverse proportion one grows as the other shrinks.",
        "The unitary method finds the value of one unit first, then scales up.",
      ],
      [
        ["Proportion", R`a : b = c : d \iff ad = bc`],
        ["Direct proportion", R`\frac{x_1}{y_1} = \frac{x_2}{y_2}`],
        ["Inverse proportion", R`x_1 y_1 = x_2 y_2`],
      ],
      {
        q: "6 workers build a wall in 10 days. How long would 15 workers take?",
        steps: ["More workers means fewer days, so this is inverse proportion.", R`$6 \times 10 = 15 \times d$.`, R`$d = 60 \div 15 = 4$.`],
        ans: "4 days",
      }, { skills: ["proportion"] }),

    T("percentages", "middle", "Arithmetic", "Percentages",
      R`Per cent means per hundred: $25\% = \frac{25}{100}$.`,
      [
        R`To find $x\%$ of a number, multiply it by $\frac{x}{100}$.`,
        "Percentage change is always measured against the original value.",
        R`An increase of $r\%$ means multiplying by $1 + \frac{r}{100}$.`,
        "A 10% rise followed by a 10% fall does not bring you back to the start: you end at 99%.",
      ],
      [
        ["Percentage of", R`x\%\ \text{of}\ y = \frac{x \times y}{100}`],
        ["Percentage change", R`\%\ \text{change} = \frac{\text{new} - \text{old}}{\text{old}} \times 100`],
        ["Multiplier", R`\text{new} = \text{old} \times \left(1 \pm \frac{r}{100}\right)`],
      ],
      {
        q: "A price rises from ₹480 to ₹540. What is the percentage increase?",
        steps: [R`Increase $= 540 - 480 = 60$.`, R`$\frac{60}{480} \times 100 = 12.5\%$.`],
        ans: R`$12.5\%$`,
      }, { skills: ["percent"], tool: "percent" }),

    T("profit-interest", "middle", "Arithmetic", "Profit, loss and interest",
      "Money maths: buying, selling, borrowing and saving.",
      [
        "Profit and loss percentages are worked out on the cost price.",
        "Simple interest is charged on the original principal only.",
        "Compound interest adds each period's interest to the principal, so it grows faster.",
        "Discount is worked out on the marked price.",
      ],
      [
        ["Profit per cent", R`\text{Profit}\% = \frac{SP - CP}{CP} \times 100`],
        ["Simple interest", R`SI = \frac{P \times R \times T}{100}`],
        ["Compound amount", R`A = P\left(1 + \frac{R}{100}\right)^{n}`],
        ["Compound interest", R`CI = A - P`],
      ],
      {
        q: "Find the compound interest on ₹10,000 at 10% a year for 2 years.",
        steps: [R`$A = 10000 \times 1.1^2 = 10000 \times 1.21 = 12100$.`, R`$CI = 12100 - 10000 = 2100$.`],
        ans: "₹2,100",
      }, { skills: ["interest"] }),

    T("exponents", "middle", "Algebra", "Exponents and powers",
      R`$a^n$ means $a$ multiplied by itself $n$ times.`,
      [
        "Multiply powers of the same base by adding the exponents.",
        "Any non-zero number to the power 0 is 1.",
        R`A negative exponent means a reciprocal: $2^{-3} = \frac{1}{8}$.`,
        R`Standard form writes a number as $m \times 10^n$ with $1 \le m < 10$.`,
      ],
      [
        ["Product", R`a^m \times a^n = a^{m+n}`],
        ["Quotient", R`\frac{a^m}{a^n} = a^{m-n}`],
        ["Power of a power", R`(a^m)^n = a^{mn}`],
        ["Zero and negative powers", R`a^0 = 1,\qquad a^{-n} = \frac{1}{a^n}`],
        ["Power of a product", R`(ab)^n = a^n b^n`],
      ],
      {
        q: R`Simplify $2^5 \times 2^{-3}$.`,
        steps: [R`Same base, so add the exponents: $5 + (-3) = 2$.`, R`$2^2 = 4$.`],
        ans: R`$4$`,
      }, { skills: ["exponents"] }),

    T("algebra-identities", "middle", "Algebra", "Algebraic expressions and identities",
      "Using letters for numbers, and the identities that make expanding and factorising quick.",
      [
        "Like terms have the same letters to the same powers; only like terms can be added.",
        "An identity is true for every value of the variables.",
        "Factorising is expanding in reverse.",
        R`Identities make mental arithmetic easy: $103^2 = (100 + 3)^2$.`,
      ],
      [
        ["Square of a sum", R`(a + b)^2 = a^2 + 2ab + b^2`],
        ["Square of a difference", R`(a - b)^2 = a^2 - 2ab + b^2`],
        ["Difference of squares", R`a^2 - b^2 = (a + b)(a - b)`],
        ["Product of binomials", R`(x + a)(x + b) = x^2 + (a + b)x + ab`],
        ["Cube of a sum", R`(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3`],
      ],
      {
        q: R`Find $103^2$ without a calculator.`,
        steps: [R`$103^2 = (100 + 3)^2$.`, R`$= 100^2 + 2(100)(3) + 3^2 = 10000 + 600 + 9$.`],
        ans: R`$10609$`,
      }, { skills: ["identity"] }),

    T("linear-one", "middle", "Algebra", "Linear equations in one variable",
      R`Finding the value of $x$ that makes both sides equal.`,
      [
        "Whatever you do to one side, do to the other.",
        R`Collect the $x$ terms on one side and the numbers on the other.`,
        "Clear fractions first by multiplying through by the LCM of the denominators.",
        "Always check by putting the answer back into the original equation.",
      ],
      [["Standard form", R`ax + b = c \implies x = \frac{c - b}{a}`]],
      {
        q: R`Solve $3x + 7 = 22$.`,
        steps: [R`Subtract 7: $3x = 15$.`, R`Divide by 3: $x = 5$.`, R`Check: $3(5) + 7 = 22$.`],
        ans: R`$x = 5$`,
      }, { skills: ["linear"], tool: "solver" }),

    T("lines-angles", "middle", "Geometry", "Lines, angles and triangles",
      "The angle facts behind most geometry problems.",
      [
        R`Angles on a straight line add to $180^\circ$; angles around a point add to $360^\circ$.`,
        "Vertically opposite angles are equal.",
        R`With parallel lines, alternate angles are equal and co-interior angles add to $180^\circ$.`,
        "Triangles are congruent by SSS, SAS, ASA, AAS or RHS.",
      ],
      [
        ["Angle sum of a triangle", R`\angle A + \angle B + \angle C = 180^\circ`],
        ["Exterior angle", R`\text{exterior angle} = \text{sum of the two opposite interior angles}`],
        ["Angle sum of a polygon", R`(n - 2) \times 180^\circ`],
        ["Exterior angle of a regular polygon", R`\frac{360^\circ}{n}`],
      ],
      {
        q: R`Two angles of a triangle are $48^\circ$ and $67^\circ$. Find the third.`,
        steps: [R`$48 + 67 = 115$.`, R`$180 - 115 = 65$.`],
        ans: R`$65^\circ$`,
      }, { skills: ["angles"] }),

    T("mensuration-2d", "middle", "Mensuration", "Circles and plane figures",
      "Areas and perimeters of circles, triangles and quadrilaterals.",
      [
        R`$\pi \approx 3.14159$; NCERT problems often use $\frac{22}{7}$.`,
        "The diameter is twice the radius.",
        "The height of a triangle or parallelogram is always measured at right angles to the base.",
        "Heron's formula finds a triangle's area from its three sides alone.",
      ],
      [
        ["Circle", R`C = 2\pi r,\qquad A = \pi r^2`],
        ["Parallelogram", R`A = b \times h`],
        ["Trapezium", R`A = \tfrac{1}{2}(a + b)h`],
        ["Rhombus", R`A = \tfrac{1}{2} d_1 d_2`],
        ["Heron's formula", R`A = \sqrt{s(s-a)(s-b)(s-c)},\quad s = \frac{a + b + c}{2}`],
      ],
      {
        q: R`Find the circumference and area of a circle of radius 7 cm. Use $\pi = \frac{22}{7}$.`,
        steps: [R`$C = 2 \times \frac{22}{7} \times 7 = 44$ cm.`, R`$A = \frac{22}{7} \times 7^2 = 154$ cm².`],
        ans: "44 cm and 154 cm²",
      }, { skills: ["circle"] }),

    T("squares-roots", "middle", "Arithmetic", "Squares, cubes and roots",
      "Perfect squares and cubes, and how to find their roots.",
      [
        "In a perfect square, every prime factor appears an even number of times.",
        "Square numbers never end in 2, 3, 7 or 8.",
        "Pair up prime factors to find a square root; group them in threes for a cube root.",
        R`$\sqrt{2}$, $\sqrt{3}$ and $\sqrt{5}$ are irrational: their decimals never end or repeat.`,
      ],
      [
        ["Root of a product", R`\sqrt{ab} = \sqrt{a}\,\sqrt{b}`],
        ["Root of a quotient", R`\sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}`],
        ["Sum of odd numbers", R`1 + 3 + 5 + \cdots + (2n - 1) = n^2`],
      ],
      {
        q: R`Find $\sqrt{1764}$.`,
        steps: [R`$1764 = 2^2 \times 3^2 \times 7^2$.`, R`Take one from each pair: $2 \times 3 \times 7 = 42$.`],
        ans: R`$42$`,
      }, { skills: ["sqrt"] }),

    T("data-basic", "middle", "Statistics", "Mean, median and mode",
      "Summarising a list of numbers with one typical value.",
      [
        "The mean is the total divided by how many values there are.",
        "The median is the middle value once sorted; with an even count, average the middle two.",
        "The mode is the most frequent value, and there can be more than one.",
        "The range, largest minus smallest, measures how spread out the data is.",
      ],
      [
        ["Mean", R`\bar{x} = \frac{x_1 + x_2 + \cdots + x_n}{n}`],
        ["Position of the median", R`\left(\frac{n + 1}{2}\right)^{\text{th}}\ \text{value}`],
        ["Range", R`\text{range} = x_{\max} - x_{\min}`],
      ],
      {
        q: "Find the mean and median of 4, 8, 6, 5, 7.",
        steps: ["The total is 30 and there are 5 values, so the mean is 6.", "Sorted: 4, 5, 6, 7, 8. The middle value is 6."],
        ans: "Mean 6, median 6",
      }, { skills: ["mean"], tool: "stats" }),

    /* ---------- Secondary ---------- */
    T("real-numbers", "secondary", "Number theory", "Real numbers",
      "The fundamental theorem of arithmetic, Euclid's algorithm and irrational numbers.",
      [
        "Every composite number is a product of primes in exactly one way, ignoring order.",
        "Euclid's algorithm finds an HCF by repeated division.",
        R`$\sqrt{p}$ is irrational for every prime $p$.`,
        R`A fraction $\frac{p}{q}$ in lowest terms has a terminating decimal exactly when $q$ has no prime factors other than 2 and 5.`,
      ],
      [
        ["Division lemma", R`a = bq + r,\qquad 0 \le r < b`],
        ["HCF and LCM", R`\text{HCF}(a,b) \cdot \text{LCM}(a,b) = ab`],
      ],
      {
        q: "Use Euclid's algorithm to find HCF(455, 42).",
        steps: [R`$455 = 42 \times 10 + 35$.`, R`$42 = 35 \times 1 + 7$.`, R`$35 = 7 \times 5 + 0$, so the last non-zero remainder is 7.`],
        ans: R`$7$`,
      }, { skills: ["hcf"], tool: "numbers" }),

    T("polynomials", "secondary", "Algebra", "Polynomials",
      R`Expressions like $ax^2 + bx + c$: their zeros, and how they divide.`,
      [
        R`The degree is the highest power of $x$.`,
        R`A zero of $p(x)$ is a value where $p(x) = 0$: where its graph meets the x-axis.`,
        R`Remainder theorem: dividing $p(x)$ by $x - a$ leaves the remainder $p(a)$.`,
        R`Factor theorem: $x - a$ is a factor exactly when $p(a) = 0$.`,
      ],
      [
        ["Zeros of a quadratic", R`\alpha + \beta = -\frac{b}{a},\qquad \alpha\beta = \frac{c}{a}`],
        ["Zeros of a cubic", R`\alpha+\beta+\gamma = -\tfrac{b}{a},\quad \alpha\beta+\beta\gamma+\gamma\alpha = \tfrac{c}{a},\quad \alpha\beta\gamma = -\tfrac{d}{a}`],
        ["Division algorithm", R`p(x) = g(x)\,q(x) + r(x)`],
      ],
      {
        q: R`Find the zeros of $x^2 - 5x + 6$ and check their sum and product.`,
        steps: [R`$x^2 - 5x + 6 = (x - 2)(x - 3)$, so the zeros are 2 and 3.`, R`Sum $= 5 = -\frac{-5}{1}$ and product $= 6 = \frac{6}{1}$, as the formulas say.`],
        ans: R`$2$ and $3$`,
      }, { skills: ["poly-eval"] }),

    T("linear-two", "secondary", "Algebra", "Pairs of linear equations",
      "Two straight lines, and the point where they meet.",
      [
        "Each equation is a straight line; the solution is where the two lines cross.",
        "Solve by substitution, elimination or cross-multiplication.",
        "Parallel lines give no solution; the same line twice gives infinitely many.",
        "Compare the ratios of the coefficients to know which case you have before solving.",
      ],
      [
        ["Unique solution", R`\frac{a_1}{a_2} \ne \frac{b_1}{b_2}`],
        ["No solution", R`\frac{a_1}{a_2} = \frac{b_1}{b_2} \ne \frac{c_1}{c_2}`],
        ["Cramer's rule", R`x = \frac{c_1 b_2 - c_2 b_1}{a_1 b_2 - a_2 b_1},\qquad y = \frac{a_1 c_2 - a_2 c_1}{a_1 b_2 - a_2 b_1}`],
      ],
      {
        q: R`Solve $x + y = 10$ and $x - y = 2$.`,
        steps: [R`Add the equations: $2x = 12$, so $x = 6$.`, R`Substitute: $6 + y = 10$, so $y = 4$.`],
        ans: R`$x = 6,\ y = 4$`,
      }, { skills: ["system"], tool: "solver" }),

    T("quadratic", "secondary", "Algebra", "Quadratic equations",
      R`Solving $ax^2 + bx + c = 0$ by factorising, completing the square or the formula.`,
      [
        "A quadratic has at most two roots.",
        R`The discriminant $D = b^2 - 4ac$ tells you what kind of roots to expect before you solve.`,
        R`$D > 0$: two real roots. $D = 0$: one repeated root. $D < 0$: no real roots.`,
        R`The graph is a parabola with its vertex at $x = -\frac{b}{2a}$.`,
      ],
      [
        ["Quadratic formula", R`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`],
        ["Discriminant", R`D = b^2 - 4ac`],
        ["Vertex form", R`a(x - h)^2 + k,\qquad h = -\frac{b}{2a}`],
      ],
      {
        q: R`Solve $2x^2 - 7x + 3 = 0$.`,
        steps: [R`$D = (-7)^2 - 4(2)(3) = 49 - 24 = 25$.`, R`$x = \frac{7 \pm 5}{4}$.`, R`$x = 3$ or $x = \frac{1}{2}$.`],
        ans: R`$3$ and $\frac{1}{2}$`,
      }, { skills: ["quadratic"], tool: "solver" }),

    T("ap", "secondary", "Algebra", "Arithmetic progressions",
      "Sequences that go up or down by the same amount at every step.",
      [
        R`The common difference $d$ is any term minus the term before it.`,
        R`$d$ can be negative, zero or a fraction.`,
        "The sum formula comes from pairing the first term with the last.",
        R`If $a$, $b$, $c$ are in AP then $2b = a + c$.`,
      ],
      [
        ["n-th term", R`a_n = a + (n - 1)d`],
        ["Sum of n terms", R`S_n = \frac{n}{2}\left[2a + (n - 1)d\right] = \frac{n}{2}(a + l)`],
        ["Sum of the first n natural numbers", R`1 + 2 + \cdots + n = \frac{n(n + 1)}{2}`],
      ],
      {
        q: "For 3, 7, 11, …, find the 20th term and the sum of the first 20 terms.",
        steps: [R`$a = 3$ and $d = 4$.`, R`$a_{20} = 3 + 19 \times 4 = 79$.`, R`$S_{20} = \frac{20}{2}(3 + 79) = 820$.`],
        ans: R`$79$ and $820$`,
      }, { skills: ["ap"] }),

    T("coordinate", "secondary", "Coordinate geometry", "Coordinate geometry",
      "Points on a grid: distances, midpoints and areas straight from coordinates.",
      [
        R`The point $(x, y)$ is $x$ units across and $y$ units up from the origin.`,
        "The distance formula is Pythagoras on the grid.",
        "The section formula finds the point that divides a segment in a given ratio.",
        "Three points are collinear when the triangle they form has zero area.",
      ],
      [
        ["Distance", R`d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`],
        ["Midpoint", R`\left(\frac{x_1 + x_2}{2},\ \frac{y_1 + y_2}{2}\right)`],
        ["Section formula", R`\left(\frac{m x_2 + n x_1}{m + n},\ \frac{m y_2 + n y_1}{m + n}\right)`],
        ["Area of a triangle", R`\tfrac{1}{2}\left|x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)\right|`],
      ],
      {
        q: R`Find the distance between $(1, 2)$ and $(4, 6)$.`,
        steps: [R`$\Delta x = 3$ and $\Delta y = 4$.`, R`$d = \sqrt{9 + 16} = \sqrt{25} = 5$.`],
        ans: R`$5$`,
      }, { skills: ["distance"], tool: "graph" }),

    T("triangles", "secondary", "Geometry", "Similar triangles and Pythagoras",
      "When shapes are scaled copies of each other, and the most famous theorem in maths.",
      [
        "Similar triangles have equal angles and proportional sides (AA, SSS or SAS similarity).",
        "Basic proportionality theorem: a line parallel to one side divides the other two sides in the same ratio.",
        "Pythagoras works only in right triangles; the hypotenuse is the side opposite the right angle.",
        "Common triples: (3, 4, 5), (5, 12, 13), (8, 15, 17) and (7, 24, 25).",
      ],
      [
        ["Pythagoras' theorem", R`a^2 + b^2 = c^2`],
        ["Areas of similar triangles", R`\frac{\text{area}_1}{\text{area}_2} = \left(\frac{\text{side}_1}{\text{side}_2}\right)^2`],
      ],
      {
        q: "A 13 m ladder reaches a window 12 m up a wall. How far is its foot from the wall?",
        steps: [R`$13^2 = 12^2 + d^2$.`, R`$d^2 = 169 - 144 = 25$, so $d = 5$.`],
        ans: "5 m",
      }, { skills: ["pythag"] }),

    T("circles", "secondary", "Geometry", "Circles and tangents",
      "Chords, tangents and the angles they make.",
      [
        "A tangent touches a circle at exactly one point and is perpendicular to the radius there.",
        "The two tangents from an outside point are equal in length.",
        "The angle at the centre is twice the angle at the circumference standing on the same arc.",
        R`Angles in the same segment are equal, and the angle in a semicircle is $90^\circ$.`,
      ],
      [
        ["Tangent length", R`t = \sqrt{d^2 - r^2}`],
        ["Arc length", R`l = \frac{\theta}{360^\circ} \times 2\pi r`],
        ["Area of a sector", R`A = \frac{\theta}{360^\circ} \times \pi r^2`],
      ],
      {
        q: "A point is 13 cm from the centre of a circle of radius 5 cm. Find the length of the tangent from it.",
        steps: [R`The radius meets the tangent at $90^\circ$.`, R`$t = \sqrt{13^2 - 5^2} = \sqrt{144} = 12$.`],
        ans: "12 cm",
      }, { skills: ["tangent"] }),

    T("trig-basic", "secondary", "Trigonometry", "Introduction to trigonometry",
      "Ratios of the sides of a right triangle: sine, cosine and tangent.",
      [
        R`SOH CAH TOA: $\sin = \frac{\text{opp}}{\text{hyp}}$, $\cos = \frac{\text{adj}}{\text{hyp}}$, $\tan = \frac{\text{opp}}{\text{adj}}$.`,
        "Their reciprocals are cosec, sec and cot.",
        R`$\sin(90^\circ - \theta) = \cos\theta$ and $\cos(90^\circ - \theta) = \sin\theta$.`,
        R`Learn the values at $0^\circ, 30^\circ, 45^\circ, 60^\circ$ and $90^\circ$ by heart.`,
      ],
      [
        ["Ratios", R`\sin\theta = \frac{\text{opp}}{\text{hyp}},\quad \cos\theta = \frac{\text{adj}}{\text{hyp}},\quad \tan\theta = \frac{\sin\theta}{\cos\theta}`],
        ["Pythagorean identity", R`\sin^2\theta + \cos^2\theta = 1`],
        ["Other identities", R`1 + \tan^2\theta = \sec^2\theta,\qquad 1 + \cot^2\theta = \csc^2\theta`],
        ["Standard values", R`\sin 30^\circ = \tfrac12,\quad \sin 45^\circ = \tfrac{1}{\sqrt2},\quad \sin 60^\circ = \tfrac{\sqrt3}{2}`],
      ],
      {
        q: R`If $\sin\theta = \frac{3}{5}$ and $\theta$ is acute, find $\cos\theta$ and $\tan\theta$.`,
        steps: [R`Opposite 3 and hypotenuse 5, so adjacent $= \sqrt{25 - 9} = 4$.`, R`$\cos\theta = \frac{4}{5}$ and $\tan\theta = \frac{3}{4}$.`],
        ans: R`$\frac{4}{5}$ and $\frac{3}{4}$`,
      }, { skills: ["trig"] }),

    T("heights", "secondary", "Trigonometry", "Heights and distances",
      "Using angles of elevation and depression to measure what you can't reach.",
      [
        "The angle of elevation is measured up from the horizontal; the angle of depression is measured down.",
        "Draw the right triangle first, then choose the ratio that links what you know to what you want.",
        R`$\tan$ links height and horizontal distance, which is the most common case.`,
        "The angle of elevation from A to B equals the angle of depression from B to A.",
      ],
      [
        ["Height from distance", R`h = d \tan\theta`],
        ["Useful values", R`\tan 30^\circ = \tfrac{1}{\sqrt3},\quad \tan 45^\circ = 1,\quad \tan 60^\circ = \sqrt3`],
      ],
      {
        q: R`From 20 m away, the top of a tower is at an angle of elevation of $60^\circ$. How tall is the tower?`,
        steps: [R`$h = 20 \tan 60^\circ = 20\sqrt{3}$.`, R`$20\sqrt3 \approx 34.64$.`],
        ans: R`$20\sqrt3 \approx 34.64$ m`,
      }, { skills: ["heights"] }),

    T("surface-volume", "secondary", "Mensuration", "Surface areas and volumes",
      "How much material covers a solid, and how much it holds.",
      [
        "Curved surface area (CSA) leaves out flat ends; total surface area (TSA) includes them.",
        R`The slant height of a cone is $l = \sqrt{r^2 + h^2}$.`,
        "A cone holds one third of the cylinder with the same base and height.",
        "1 m³ = 1000 litres.",
      ],
      [
        ["Cuboid", R`V = lbh,\qquad TSA = 2(lb + bh + hl)`],
        ["Cube", R`V = a^3,\qquad TSA = 6a^2`],
        ["Cylinder", R`V = \pi r^2 h,\qquad CSA = 2\pi r h`],
        ["Cone", R`V = \tfrac13 \pi r^2 h,\qquad CSA = \pi r l`],
        ["Sphere", R`V = \tfrac43 \pi r^3,\qquad SA = 4\pi r^2`],
        ["Hemisphere", R`V = \tfrac23 \pi r^3,\qquad TSA = 3\pi r^2`],
      ],
      {
        q: R`Find the volume of a cylinder with radius 7 cm and height 10 cm. Use $\pi = \frac{22}{7}$.`,
        steps: [R`$V = \frac{22}{7} \times 7^2 \times 10$.`, R`$= 22 \times 7 \times 10 = 1540$.`],
        ans: "1540 cm³",
      }, { skills: ["volume"] }),

    T("statistics-grouped", "secondary", "Statistics", "Statistics for grouped data",
      "Mean, median and mode when data comes in class intervals.",
      [
        "Use class marks (midpoints) to stand for each class.",
        R`For the median, find the class where the cumulative frequency first passes $\frac{n}{2}$.`,
        "The modal class is the one with the highest frequency.",
        R`Empirical relation: $3\,\text{median} = \text{mode} + 2\,\text{mean}$.`,
      ],
      [
        ["Mean", R`\bar{x} = \frac{\sum f_i x_i}{\sum f_i}`],
        ["Median", R`l + \left(\frac{\frac{n}{2} - cf}{f}\right) h`],
        ["Mode", R`l + \left(\frac{f_1 - f_0}{2f_1 - f_0 - f_2}\right) h`],
      ],
      {
        q: "Classes 0–10, 10–20 and 20–30 have frequencies 5, 8 and 7. Find the mean.",
        steps: ["The class marks are 5, 15 and 25.", R`$\sum f x = 25 + 120 + 175 = 320$ and $\sum f = 20$.`, R`$\bar{x} = 320 \div 20 = 16$.`],
        ans: R`$16$`,
      }, { tool: "stats" }),

    T("probability-basic", "secondary", "Probability", "Probability",
      "How likely something is, as a number from 0 to 1.",
      [
        "Probability 0 means impossible; 1 means certain.",
        "For equally likely outcomes, divide the favourable outcomes by the total.",
        R`Two dice have $6 \times 6 = 36$ outcomes; a deck has 52 cards in 4 suits.`,
        R`$P(E) + P(\text{not } E) = 1$.`,
      ],
      [
        ["Classical probability", R`P(E) = \frac{\text{favourable outcomes}}{\text{total outcomes}}`],
        ["Complement", R`P(\bar{E}) = 1 - P(E)`],
      ],
      {
        q: "Two dice are thrown. What is the probability that the sum is 7?",
        steps: ["Favourable outcomes: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1), which is 6 of them.", R`$P = \frac{6}{36} = \frac{1}{6}$.`],
        ans: R`$\frac{1}{6}$`,
      }, { skills: ["dice"] }),

    /* ---------- Senior secondary ---------- */
    T("sets", "senior", "Algebra", "Sets, relations and functions",
      "The language of collections, and of rules that turn inputs into outputs.",
      [
        "A set is a well-defined collection; order and repetition don't matter.",
        "A function gives exactly one output for each input.",
        "The domain is the set of allowed inputs; the range is the set of outputs produced.",
        R`A set with $n$ elements has $2^n$ subsets.`,
      ],
      [
        ["Union", R`n(A \cup B) = n(A) + n(B) - n(A \cap B)`],
        ["De Morgan's laws", R`(A \cup B)' = A' \cap B',\qquad (A \cap B)' = A' \cup B'`],
        ["Number of subsets", R`|\mathcal{P}(A)| = 2^{n}`],
      ],
      {
        q: "In a class, 40 students like tea, 30 like coffee and 10 like both. How many like at least one?",
        steps: [R`$n(T \cup C) = n(T) + n(C) - n(T \cap C) = 40 + 30 - 10$.`],
        ans: R`$60$`,
      }, { skills: ["sets"] }),

    T("trig-functions", "senior", "Trigonometry", "Trigonometric functions and identities",
      "Trigonometry beyond triangles: radians, any angle and compound-angle formulas.",
      [
        R`$\pi$ radians $= 180^\circ$, so 1 radian is about $57.3^\circ$.`,
        "ASTC: in quadrants I, II, III and IV the positive ratios are All, Sin, Tan and Cos.",
        R`$\sin$ and $\cos$ repeat every $2\pi$; $\tan$ repeats every $\pi$.`,
        R`The general solution of $\sin x = \sin\alpha$ is $x = n\pi + (-1)^n\alpha$.`,
      ],
      [
        ["Degrees to radians", R`\theta_{\text{rad}} = \theta_{\text{deg}} \times \frac{\pi}{180}`],
        ["Sine of a sum", R`\sin(A \pm B) = \sin A\cos B \pm \cos A \sin B`],
        ["Cosine of a sum", R`\cos(A \pm B) = \cos A \cos B \mp \sin A \sin B`],
        ["Double angle", R`\sin 2A = 2\sin A\cos A,\qquad \cos 2A = \cos^2 A - \sin^2 A`],
        ["Tangent of a sum", R`\tan(A + B) = \frac{\tan A + \tan B}{1 - \tan A\tan B}`],
      ],
      {
        q: R`Find $\sin 75^\circ$ exactly.`,
        steps: [R`$\sin 75^\circ = \sin(45^\circ + 30^\circ)$.`, R`$= \frac{\sqrt2}{2}\cdot\frac{\sqrt3}{2} + \frac{\sqrt2}{2}\cdot\frac12$.`, R`$= \frac{\sqrt6 + \sqrt2}{4}$.`],
        ans: R`$\frac{\sqrt6 + \sqrt2}{4} \approx 0.9659$`,
      }, { tool: "graph" }),

    T("complex", "senior", "Algebra", "Complex numbers",
      R`Numbers of the form $a + bi$, where $i^2 = -1$.`,
      [
        R`$a$ is the real part and $b$ is the imaginary part.`,
        R`Plot $a + bi$ as the point $(a, b)$ on the Argand plane.`,
        R`The conjugate of $z = a + bi$ is $\bar{z} = a - bi$, and $z\bar{z} = a^2 + b^2$.`,
        "Every quadratic has two roots once complex numbers are allowed.",
      ],
      [
        ["Modulus", R`|z| = \sqrt{a^2 + b^2}`],
        ["Polar form", R`z = r(\cos\theta + i\sin\theta)`],
        ["Product", R`(a + bi)(c + di) = (ac - bd) + (ad + bc)i`],
        ["Powers of i", R`i^2 = -1,\quad i^3 = -i,\quad i^4 = 1`],
        ["Euler's formula", R`e^{i\theta} = \cos\theta + i\sin\theta`],
      ],
      {
        q: R`Simplify $(2 + 3i)(1 - i)$.`,
        steps: [R`$= 2 - 2i + 3i - 3i^2$.`, R`$= 2 + i + 3$, because $i^2 = -1$.`],
        ans: R`$5 + i$`,
      }, { skills: ["complex-mod"] }),

    T("pnc", "senior", "Algebra", "Permutations and combinations",
      "Counting arrangements and selections without listing them all.",
      [
        R`Fundamental principle: if one task can be done in $m$ ways and the next in $n$, together there are $mn$ ways.`,
        "Permutations care about order; combinations don't.",
        R`$0! = 1$.`,
        R`Choosing $r$ items is the same as leaving out $n - r$: $\binom{n}{r} = \binom{n}{n - r}$.`,
      ],
      [
        ["Factorial", R`n! = n(n - 1)(n - 2)\cdots 1`],
        ["Permutations", R`{}^{n}P_{r} = \frac{n!}{(n - r)!}`],
        ["Combinations", R`\binom{n}{r} = \frac{n!}{r!\,(n - r)!}`],
        ["Pascal's rule", R`\binom{n}{r} + \binom{n}{r - 1} = \binom{n + 1}{r}`],
      ],
      {
        q: "In how many ways can a committee of 3 be chosen from 8 people?",
        steps: ["Order doesn't matter, so count combinations.", R`$\binom{8}{3} = \frac{8 \times 7 \times 6}{3 \times 2 \times 1} = 56$.`],
        ans: R`$56$`,
      }, { skills: ["ncr"] }),

    T("binomial", "senior", "Algebra", "Binomial theorem",
      R`Expanding $(a + b)^n$ for any whole number $n$.`,
      [
        "The coefficients are the rows of Pascal's triangle.",
        R`There are $n + 1$ terms; the powers of $a$ fall as the powers of $b$ rise.`,
        R`When $n$ is even, the middle term is term number $\frac{n}{2} + 1$.`,
        R`Putting $a = b = 1$ shows that the coefficients add up to $2^n$.`,
      ],
      [
        ["Binomial theorem", R`(a + b)^n = \sum_{r=0}^{n} \binom{n}{r} a^{n-r} b^{r}`],
        ["General term", R`T_{r+1} = \binom{n}{r} a^{n-r} b^{r}`],
      ],
      {
        q: R`Find the coefficient of $x^3$ in $(1 + x)^5$.`,
        steps: [R`$T_{r+1} = \binom{5}{r} x^r$, so take $r = 3$.`, R`$\binom{5}{3} = 10$.`],
        ans: R`$10$`,
      }, { skills: ["binom-coef"] }),

    T("sequences", "senior", "Algebra", "Sequences and series",
      "Geometric progressions and the standard sums.",
      [
        R`In a GP, each term is the one before it multiplied by the common ratio $r$.`,
        R`An infinite GP has a finite sum only when $|r| < 1$.`,
        R`AM–GM: for positive $a$ and $b$, $\frac{a + b}{2} \ge \sqrt{ab}$.`,
        R`Sigma notation $\sum$ is shorthand for adding up a pattern of terms.`,
      ],
      [
        ["n-th term of a GP", R`a_n = a r^{n-1}`],
        ["Sum of a GP", R`S_n = \frac{a(r^n - 1)}{r - 1},\quad r \ne 1`],
        ["Infinite GP", R`S_\infty = \frac{a}{1 - r},\quad |r| < 1`],
        ["Sum of squares", R`\sum_{k=1}^{n} k^2 = \frac{n(n + 1)(2n + 1)}{6}`],
        ["Sum of cubes", R`\sum_{k=1}^{n} k^3 = \left(\frac{n(n + 1)}{2}\right)^2`],
      ],
      {
        q: R`Find $1 + \frac12 + \frac14 + \frac18 + \cdots$`,
        steps: [R`$a = 1$ and $r = \frac12$, and $|r| < 1$.`, R`$S_\infty = \frac{1}{1 - \frac12} = 2$.`],
        ans: R`$2$`,
      }, { skills: ["gp-sum"] }),

    T("lines-conics", "senior", "Coordinate geometry", "Straight lines and conic sections",
      "Equations of lines, circles, parabolas, ellipses and hyperbolas.",
      [
        R`The slope is $m = \tan\theta$, where $\theta$ is the angle the line makes with the positive x-axis.`,
        R`Parallel lines have equal slopes; perpendicular slopes multiply to $-1$.`,
        "Conic sections are the curves you get by slicing a cone at different angles.",
        R`Eccentricity: $e = 0$ for a circle, $e < 1$ for an ellipse, $e = 1$ for a parabola, $e > 1$ for a hyperbola.`,
      ],
      [
        ["Slope", R`m = \frac{y_2 - y_1}{x_2 - x_1}`],
        ["Point–slope form", R`y - y_1 = m(x - x_1)`],
        ["Distance from a point to a line", R`\frac{|a x_1 + b y_1 + c|}{\sqrt{a^2 + b^2}}`],
        ["Circle", R`(x - h)^2 + (y - k)^2 = r^2`],
        ["Parabola", R`y^2 = 4ax`],
        ["Ellipse", R`\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1`],
        ["Hyperbola", R`\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1`],
      ],
      {
        q: R`Find the equation of the line through $(1, 2)$ and $(3, 8)$.`,
        steps: [R`$m = \frac{8 - 2}{3 - 1} = 3$.`, R`$y - 2 = 3(x - 1)$, so $y = 3x - 1$.`],
        ans: R`$y = 3x - 1$`,
      }, { skills: ["slope"], tool: "graph" }),

    T("limits-derivatives", "senior", "Calculus", "Limits and derivatives",
      "How fast a function changes, defined through limits.",
      [
        R`$\lim_{x \to a} f(x)$ is the value $f(x)$ approaches as $x$ gets close to $a$.`,
        R`The derivative $f'(x)$ is the slope of the tangent to the curve at $x$.`,
        R`Use the product rule for $uv$, the quotient rule for $\frac{u}{v}$ and the chain rule for $f(g(x))$.`,
        "A function has to be continuous to be differentiable, but continuity alone isn't enough.",
      ],
      [
        ["Definition", R`f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}`],
        ["Power rule", R`\frac{d}{dx} x^n = n x^{n-1}`],
        ["Standard limit", R`\lim_{x \to 0} \frac{\sin x}{x} = 1`],
        ["Product rule", R`(uv)' = u'v + uv'`],
        ["Quotient rule", R`\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}`],
        ["Chain rule", R`\frac{d}{dx} f(g(x)) = f'(g(x))\,g'(x)`],
        ["Common derivatives", R`(\sin x)' = \cos x,\ \ (\cos x)' = -\sin x,\ \ (e^x)' = e^x,\ \ (\ln x)' = \tfrac{1}{x}`],
      ],
      {
        q: R`Differentiate $x^2 \sin x$.`,
        steps: [R`Use the product rule with $u = x^2$ and $v = \sin x$.`, R`$u' = 2x$ and $v' = \cos x$, so $(uv)' = 2x\sin x + x^2\cos x$.`],
        ans: R`$2x\sin x + x^2\cos x$`,
      }, { skills: ["derivative"], tool: "graph" }),

    T("app-derivatives", "senior", "Calculus", "Applications of derivatives",
      R`Using $f'$ and $f''$ to find maxima, minima and rates of change.`,
      [
        R`$f'(x) > 0$ means $f$ is increasing; $f'(x) < 0$ means it is decreasing.`,
        R`Critical points are where $f'(x) = 0$ or where $f'$ doesn't exist.`,
        R`Second derivative test: $f'' > 0$ gives a local minimum, $f'' < 0$ a local maximum.`,
        R`The tangent at $(x_0, y_0)$ has slope $f'(x_0)$; the normal has slope $-\frac{1}{f'(x_0)}$.`,
      ],
      [
        ["Tangent line", R`y - y_0 = f'(x_0)(x - x_0)`],
        ["Linear approximation", R`f(x + \Delta x) \approx f(x) + f'(x)\,\Delta x`],
      ],
      {
        q: R`Find the local maximum and minimum of $f(x) = x^3 - 3x$.`,
        steps: [R`$f'(x) = 3x^2 - 3 = 0$, so $x = \pm 1$.`, R`$f''(x) = 6x$: $f''(1) = 6 > 0$ (minimum) and $f''(-1) = -6 < 0$ (maximum).`, R`$f(1) = -2$ and $f(-1) = 2$.`],
        ans: R`Maximum $2$ at $x = -1$; minimum $-2$ at $x = 1$`,
      }, { skills: ["derivative"], tool: "graph" }),

    T("integrals", "senior", "Calculus", "Integrals",
      "Antiderivatives, and the area under a curve.",
      [
        R`Integration reverses differentiation, so always add a constant $C$ to an indefinite integral.`,
        R`A definite integral $\int_a^b f(x)\,dx$ gives the signed area between the curve and the x-axis.`,
        "Substitution undoes the chain rule; integration by parts undoes the product rule.",
        R`Pick $u$ for integration by parts with ILATE: inverse trig, log, algebraic, trig, exponential.`,
      ],
      [
        ["Power rule", R`\int x^n\,dx = \frac{x^{n+1}}{n + 1} + C,\quad n \ne -1`],
        ["Logs and exponentials", R`\int \frac{1}{x}\,dx = \ln|x| + C,\qquad \int e^x\,dx = e^x + C`],
        ["Trigonometric", R`\int \sin x\,dx = -\cos x + C,\qquad \int \cos x\,dx = \sin x + C`],
        ["Integration by parts", R`\int u\,dv = uv - \int v\,du`],
        ["Fundamental theorem", R`\int_a^b f(x)\,dx = F(b) - F(a)`],
      ],
      {
        q: R`Evaluate $\int_0^2 (3x^2 + 1)\,dx$.`,
        steps: [R`An antiderivative is $x^3 + x$.`, R`$\left[x^3 + x\right]_0^2 = (8 + 2) - 0$.`],
        ans: R`$10$`,
      }, { skills: ["integral"], tool: "graph" }),

    T("diff-eq", "senior", "Calculus", "Differential equations",
      "Equations that involve derivatives, and how to solve the common first-order types.",
      [
        "The order is the highest derivative that appears.",
        "A general solution has as many arbitrary constants as the order.",
        R`Separable equations: get every $y$ on one side and every $x$ on the other, then integrate.`,
        R`Exponential growth and decay both come from $\frac{dy}{dx} = ky$.`,
      ],
      [
        ["Separable", R`\frac{dy}{dx} = g(x)h(y) \implies \int \frac{dy}{h(y)} = \int g(x)\,dx`],
        ["Linear first order", R`\frac{dy}{dx} + P y = Q,\qquad \text{IF} = e^{\int P\,dx}`],
        ["Solution of the linear form", R`y \cdot \text{IF} = \int Q \cdot \text{IF}\,dx + C`],
      ],
      {
        q: R`Solve $\frac{dy}{dx} = ky$.`,
        steps: [R`Separate: $\frac{dy}{y} = k\,dx$.`, R`Integrate: $\ln|y| = kx + c$.`, R`So $y = Ce^{kx}$.`],
        ans: R`$y = Ce^{kx}$`,
      }),

    T("matrices", "senior", "Linear algebra", "Matrices and determinants",
      "Rectangular arrays of numbers, and the single number that says whether one can be inverted.",
      [
        R`$AB$ exists only when the columns of $A$ match the rows of $B$, and usually $AB \ne BA$.`,
        "A square matrix has an inverse exactly when its determinant is not zero.",
        "Swapping two rows changes the sign of the determinant.",
        R`The system $AX = B$ has the unique solution $X = A^{-1}B$ when $|A| \ne 0$.`,
      ],
      [
        ["2×2 determinant", R`\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc`],
        ["2×2 inverse", R`\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1} = \frac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}`],
        ["Inverse", R`A^{-1} = \frac{1}{|A|}\,\operatorname{adj} A`],
        ["Product rules", R`(AB)^{-1} = B^{-1}A^{-1},\qquad |AB| = |A|\,|B|`],
      ],
      {
        q: R`Find the inverse of $\begin{bmatrix} 2 & 1 \\ 5 & 3 \end{bmatrix}$.`,
        steps: [R`$|A| = 2(3) - 1(5) = 1$.`, "Swap the diagonal entries, change the signs of the other two and divide by the determinant, 1."],
        ans: R`$\begin{bmatrix} 3 & -1 \\ -5 & 2 \end{bmatrix}$`,
      }, { skills: ["det2"], tool: "matrix" }),

    T("vectors", "senior", "Linear algebra", "Vectors and 3D geometry",
      "Quantities with size and direction, and lines and planes in space.",
      [
        R`$\vec a = a_1\hat{i} + a_2\hat{j} + a_3\hat{k}$ has magnitude $\sqrt{a_1^2 + a_2^2 + a_3^2}$.`,
        "The dot product is zero exactly when two vectors are perpendicular.",
        "The cross product is perpendicular to both vectors, and its size is the area of their parallelogram.",
        R`Direction cosines satisfy $l^2 + m^2 + n^2 = 1$.`,
      ],
      [
        ["Dot product", R`\vec a \cdot \vec b = |\vec a||\vec b|\cos\theta = a_1b_1 + a_2b_2 + a_3b_3`],
        ["Size of the cross product", R`|\vec a \times \vec b| = |\vec a||\vec b|\sin\theta`],
        ["Distance in 3D", R`\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}`],
        ["Line", R`\vec r = \vec a + \lambda \vec b`],
        ["Plane", R`\vec r \cdot \hat n = d`],
      ],
      {
        q: R`Find the angle between $\vec a = (1, 2, 2)$ and $\vec b = (2, -1, 2)$.`,
        steps: [R`$\vec a \cdot \vec b = 2 - 2 + 4 = 4$.`, R`$|\vec a| = 3$ and $|\vec b| = 3$.`, R`$\cos\theta = \frac{4}{9}$, so $\theta \approx 63.6^\circ$.`],
        ans: R`$\theta = \cos^{-1}\frac{4}{9} \approx 63.6^\circ$`,
      }, { skills: ["dot"] }),

    T("probability-adv", "senior", "Probability", "Conditional probability and distributions",
      "Probability when you already know something, and the binomial distribution.",
      [
        R`$P(A \mid B)$ is the probability of $A$ given that $B$ has happened.`,
        R`$A$ and $B$ are independent when $P(A \cap B) = P(A)\,P(B)$.`,
        "Bayes' theorem turns a conditional probability around.",
        R`A binomial setting has $n$ independent trials, each with the same chance of success $p$.`,
      ],
      [
        ["Addition rule", R`P(A \cup B) = P(A) + P(B) - P(A \cap B)`],
        ["Conditional probability", R`P(A \mid B) = \frac{P(A \cap B)}{P(B)}`],
        ["Bayes' theorem", R`P(E_i \mid A) = \frac{P(E_i)\,P(A \mid E_i)}{\sum_j P(E_j)\,P(A \mid E_j)}`],
        ["Binomial distribution", R`P(X = r) = \binom{n}{r} p^r q^{n-r},\quad q = 1 - p`],
        ["Mean and variance", R`\mu = np,\qquad \sigma^2 = npq`],
      ],
      {
        q: "A fair coin is tossed 3 times. What is the probability of exactly 2 heads?",
        steps: [R`$n = 3$, $r = 2$ and $p = q = \frac12$.`, R`$\binom{3}{2}\left(\frac12\right)^3 = \frac{3}{8}$.`],
        ans: R`$\frac{3}{8}$`,
      }, { skills: ["coin-prob"] }),

    T("lpp", "senior", "Algebra", "Linear programming",
      "Finding the best value of a linear objective under linear constraints.",
      [
        "Each constraint is a half-plane; together they form the feasible region.",
        "If an optimum exists, it occurs at a corner point of the feasible region.",
        "Work out the objective at every corner and pick the largest or smallest.",
        "An unbounded region may have no maximum.",
      ],
      [["Standard form", R`\text{maximise } Z = ax + by \text{ subject to the constraints},\ x, y \ge 0`]],
      {
        q: R`Maximise $Z = 3x + 2y$ subject to $x + y \le 4$, $x + 3y \le 6$ and $x, y \ge 0$.`,
        steps: [R`The corners are $(0, 0)$, $(4, 0)$, $(3, 1)$ and $(0, 2)$.`, R`$Z$ at the corners: $0$, $12$, $11$ and $4$.`],
        ans: R`Maximum $Z = 12$ at $(4, 0)$`,
      }, { tool: "graph" }),

    /* ---------- College ---------- */
    T("linear-algebra", "college", "Linear algebra", "Linear algebra",
      "Vector spaces, linear maps and the eigenvalues that describe them.",
      [
        "Vectors are linearly independent when none of them is a combination of the others.",
        "The rank is the number of independent rows, which equals the number of independent columns.",
        R`Rank–nullity: $\operatorname{rank}(A) + \operatorname{nullity}(A) = n$ for an $m \times n$ matrix.`,
        R`An eigenvector keeps its direction under $A$; it is only stretched by the eigenvalue $\lambda$.`,
      ],
      [
        ["Eigen equation", R`A\vec v = \lambda \vec v`],
        ["Characteristic equation", R`\det(A - \lambda I) = 0`],
        ["Trace and determinant", R`\operatorname{tr} A = \sum \lambda_i,\qquad \det A = \prod \lambda_i`],
        ["Diagonalisation", R`A = PDP^{-1}`],
      ],
      {
        q: R`Find the eigenvalues of $\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$.`,
        steps: [R`$\det\begin{bmatrix} 2 - \lambda & 1 \\ 1 & 2 - \lambda \end{bmatrix} = (2 - \lambda)^2 - 1 = 0$.`, R`$\lambda^2 - 4\lambda + 3 = 0$, so $(\lambda - 1)(\lambda - 3) = 0$.`],
        ans: R`$\lambda = 1$ and $\lambda = 3$`,
      }, { skills: ["eigen"], tool: "matrix" }),

    T("multivariable", "college", "Calculus", "Multivariable calculus",
      "Calculus for functions of several variables.",
      [
        "A partial derivative treats every other variable as a constant.",
        R`The gradient $\nabla f$ points in the direction of steepest increase.`,
        "A double integral adds up a function over a region of the plane.",
        R`Critical points of $f(x, y)$ are where $\nabla f = \vec 0$; classify them with $f_{xx}f_{yy} - f_{xy}^2$.`,
      ],
      [
        ["Gradient", R`\nabla f = \left(\frac{\partial f}{\partial x},\ \frac{\partial f}{\partial y},\ \frac{\partial f}{\partial z}\right)`],
        ["Directional derivative", R`D_{\hat u} f = \nabla f \cdot \hat u`],
        ["Chain rule", R`\frac{dz}{dt} = \frac{\partial z}{\partial x}\frac{dx}{dt} + \frac{\partial z}{\partial y}\frac{dy}{dt}`],
        ["Double integral", R`\iint_R f\,dA = \int_a^b\!\int_c^d f(x, y)\,dy\,dx`],
      ],
      {
        q: R`Find the partial derivatives of $f(x, y) = x^2 y + y^3$.`,
        steps: [R`Treat $y$ as a constant: $f_x = 2xy$.`, R`Treat $x$ as a constant: $f_y = x^2 + 3y^2$.`],
        ans: R`$f_x = 2xy,\ f_y = x^2 + 3y^2$`,
      }, { skills: ["partial"] }),

    T("series", "college", "Calculus", "Taylor series",
      "Writing functions as infinite polynomials.",
      [
        R`A Taylor series matches every derivative of $f$ at one point.`,
        "A Maclaurin series is a Taylor series centred at 0.",
        "Cutting the series off gives a polynomial approximation; more terms give more accuracy near the centre.",
        "A series may only converge inside a radius of convergence.",
      ],
      [
        ["Taylor series", R`f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x - a)^n`],
        ["Exponential", R`e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots`],
        ["Sine and cosine", R`\sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots,\qquad \cos x = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots`],
        ["Logarithm", R`\ln(1 + x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \cdots,\quad -1 < x \le 1`],
      ],
      {
        q: R`Estimate $e^{0.1}$ using the first four terms.`,
        steps: [R`$1 + 0.1 + \frac{0.01}{2} + \frac{0.001}{6}$.`, R`$= 1 + 0.1 + 0.005 + 0.000167 = 1.105167$.`, R`The true value is $1.105171\ldots$, so four terms are already very close.`],
        ans: R`$\approx 1.10517$`,
      }, { tool: "graph" }),

    T("ode2", "college", "Calculus", "Second-order linear ODEs",
      R`Equations like $ay'' + by' + cy = 0$, which model springs and circuits.`,
      [
        R`Try $y = e^{rx}$: it turns the ODE into an ordinary quadratic in $r$.`,
        "Two different real roots give two exponentials.",
        R`A repeated root $r$ gives $(C_1 + C_2x)e^{rx}$.`,
        R`Complex roots $\alpha \pm \beta i$ give oscillation: $e^{\alpha x}(C_1\cos\beta x + C_2\sin\beta x)$.`,
      ],
      [
        ["Characteristic equation", R`ar^2 + br + c = 0`],
        ["Distinct real roots", R`y = C_1 e^{r_1 x} + C_2 e^{r_2 x}`],
        ["Repeated root", R`y = (C_1 + C_2 x)e^{r x}`],
        ["Complex roots", R`y = e^{\alpha x}(C_1 \cos\beta x + C_2 \sin\beta x)`],
      ],
      {
        q: R`Solve $y'' - 3y' + 2y = 0$.`,
        steps: [R`The characteristic equation is $r^2 - 3r + 2 = 0$.`, R`$(r - 1)(r - 2) = 0$, so $r = 1$ or $r = 2$.`],
        ans: R`$y = C_1e^{x} + C_2e^{2x}$`,
      }),

    T("number-theory", "college", "Number theory", "Number theory",
      "Divisibility, primes and arithmetic with remainders.",
      [
        R`$a \equiv b \pmod{n}$ means $n$ divides $a - b$.`,
        "You can add, subtract and multiply congruences, but you can't divide freely.",
        "There are infinitely many primes, as Euclid proved.",
        R`Euler's totient $\varphi(n)$ counts the numbers up to $n$ that share no factor with $n$.`,
      ],
      [
        ["Fermat's little theorem", R`a^{p-1} \equiv 1 \pmod{p},\quad p \nmid a`],
        ["Euler's theorem", R`a^{\varphi(n)} \equiv 1 \pmod{n},\quad \gcd(a, n) = 1`],
        ["Totient", R`\varphi(n) = n\prod_{p \mid n}\left(1 - \frac{1}{p}\right)`],
        ["Bézout's identity", R`\gcd(a, b) = ax + by\ \text{ for some integers } x, y`],
      ],
      {
        q: R`Find the remainder when $3^{100}$ is divided by 7.`,
        steps: [R`By Fermat, $3^6 \equiv 1 \pmod 7$.`, R`$100 = 6 \times 16 + 4$, so $3^{100} \equiv 3^4 = 81 \pmod 7$.`, R`$81 = 7 \times 11 + 4$.`],
        ans: R`$4$`,
      }, { skills: ["modpow"], tool: "numbers" }),

    T("graphs", "college", "Discrete maths", "Discrete maths and graph theory",
      "Logic, counting and networks of points and lines.",
      [
        "A graph is a set of vertices joined by edges.",
        "A tree is a connected graph with no cycles.",
        "An Euler path uses every edge exactly once; it exists only when 0 or 2 vertices have odd degree.",
        R`Pigeonhole principle: put $n + 1$ items into $n$ boxes and some box holds at least two.`,
      ],
      [
        ["Handshake lemma", R`\sum_{v} \deg(v) = 2|E|`],
        ["Trees", R`|E| = |V| - 1`],
        ["Euler's formula for planar graphs", R`V - E + F = 2`],
        ["Inclusion–exclusion", R`|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |B \cap C| - |C \cap A| + |A \cap B \cap C|`],
      ],
      {
        q: "Check Euler's formula for a cube.",
        steps: ["A cube has 8 vertices, 12 edges and 6 faces.", R`$8 - 12 + 6 = 2$.`],
        ans: R`$V - E + F = 2$ holds`,
      }),

    T("stats-inference", "college", "Statistics", "Statistics and the normal distribution",
      "Spread, standardising and the bell curve.",
      [
        "Variance is the average squared distance from the mean; the standard deviation is its square root.",
        R`Divide by $n - 1$ for a sample and by $N$ for a whole population.`,
        "A z-score says how many standard deviations a value lies from the mean.",
        "In a normal distribution about 68%, 95% and 99.7% of values lie within 1, 2 and 3 standard deviations.",
      ],
      [
        ["Population variance", R`\sigma^2 = \frac{1}{N}\sum (x_i - \mu)^2`],
        ["Sample variance", R`s^2 = \frac{1}{n - 1}\sum (x_i - \bar{x})^2`],
        ["z-score", R`z = \frac{x - \mu}{\sigma}`],
        ["Normal density", R`f(x) = \frac{1}{\sigma\sqrt{2\pi}}\,e^{-\frac{(x - \mu)^2}{2\sigma^2}}`],
        ["Regression line", R`y - \bar y = b(x - \bar x),\qquad b = \frac{\sum (x - \bar x)(y - \bar y)}{\sum (x - \bar x)^2}`],
      ],
      {
        q: "Find the population standard deviation of 2, 4, 4, 4, 5, 5, 7, 9.",
        steps: [R`Mean $= 40 \div 8 = 5$.`, "Squared deviations: 9, 1, 1, 1, 0, 0, 4 and 16, which total 32.", R`$\sigma^2 = 32 \div 8 = 4$, so $\sigma = 2$.`],
        ans: R`$2$`,
      }, { tool: "stats" }),
  ];
})();
