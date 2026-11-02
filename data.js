(function () {
  "use strict";
  const R = String.raw;

  window.MZ_LEVELS = [
    { id: "foundation", name: "Foundation", range: "Class 1–5", color: "#f59e0b", icon: "blocks", blurb: "Place value, the four operations, fractions, decimals, Roman numerals, shapes, angles and turns, time, money, directions, measurement, symmetry and data." },
    { id: "middle", name: "Middle school", range: "Class 6–8", color: "#10b981", icon: "ruler", blurb: "Integers, primes, HCF and LCM, ratios, percentages, exponents, algebra, lines and angles, congruence, constructions, solids, mensuration and graphs." },
    { id: "secondary", name: "Secondary", range: "Class 9–10", color: "#3b82f6", icon: "axes", blurb: "Polynomials, quadratics, Euclid, proofs and algorithms, coordinate geometry, trigonometry, circles, statistics and probability." },
    { id: "senior", name: "Senior secondary", range: "Class 11–12", color: "#8b5cf6", icon: "integral", blurb: "Functions, inverse trig, complex numbers, inequalities, counting, conics, continuity, calculus, matrices, vectors, statistics and distributions." },
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
        "Class 4–6 also use [[roman|Roman numerals]]: I, V, X, L, C, D and M.",
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

    T("roman", "foundation", "Arithmetic", "Roman numerals",
      "The Roman system uses letters for values: I, V, X, L, C, D and M.",
      [
        "I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000.",
        "A smaller letter before a larger one means subtract: IV is 4, IX is 9, XL is 40.",
        "A smaller letter after a larger one means add: VI is 6, XI is 11, LX is 60.",
        "Never repeat V, L or D. I, X, C and M can be written up to three times.",
      ],
      [
        ["Letters", R`I=1,\ V=5,\ X=10,\ L=50,\ C=100`],
        ["Subtractive pairs", R`IV=4,\ IX=9,\ XL=40,\ XC=90,\ CD=400,\ CM=900`],
      ],
      {
        q: "Write 24 and 49 in Roman numerals.",
        steps: ["24 = 20 + 4 = XX + IV = XXIV.", "49 = 40 + 9 = XL + IX = XLIX."],
        ans: "XXIV and XLIX",
      }, { skills: ["roman"] }),

    T("shapes", "foundation", "Geometry", "Shapes and solids",
      "Count sides, vertices and faces to name a shape.",
      [
        "A side is a straight edge; a vertex is a corner where two sides meet.",
        "A triangle has 3 sides, a quadrilateral 4, a pentagon 5 and a hexagon 6.",
        "A cube has 6 square faces, 12 edges and 8 vertices.",
        "Closed shapes that don't cross themselves are polygons if every side is straight.",
      ],
      [
        ["Polygon names", R`3\ \text{triangle},\ 4\ \text{quadrilateral},\ 5\ \text{pentagon},\ 6\ \text{hexagon}`],
        ["Cube", R`F = 6,\ E = 12,\ V = 8`],
      ],
      {
        q: "A shape has 5 straight sides. What is it called, and how many vertices does it have?",
        steps: ["Five straight sides: a pentagon.", "A simple polygon has as many vertices as sides, so 5 vertices."],
        ans: "Pentagon, 5 vertices",
      }, { skills: ["shapes"] }),

    T("symmetry", "foundation", "Geometry", "Symmetry and patterns",
      "A line of symmetry folds a shape onto itself; a pattern follows a rule.",
      [
        "If you can fold a shape so both halves match, the fold is a line of symmetry.",
        "A square has 4 lines of symmetry; a rectangle that is not a square has 2; a scalene triangle has none.",
        "A number pattern adds or multiplies by the same amount each time.",
        "Look at the gap between terms to find the rule, then use it to find the next term.",
      ],
      [
        ["Lines of symmetry", R`\text{square } 4,\ \text{rectangle } 2,\ \text{equilateral triangle } 3`],
        ["Arithmetic pattern", R`a,\ a+d,\ a+2d,\ a+3d,\ \ldots`],
      ],
      {
        q: "How many lines of symmetry does a rectangle that is not a square have?",
        steps: ["The two midlines — one across and one down — fold it onto itself.", "The diagonals do not: the long sides would not land on the short sides.", "So there are 2 lines of symmetry."],
        ans: "2",
      }, { skills: ["symmetry"] }),

    T("patterns", "foundation", "Arithmetic", "Patterns",
      "A pattern follows a rule. Find the rule, then the next term.",
      [
        "Look at the gap between neighbouring terms: adding the same number each time is an arithmetic pattern.",
        "Some patterns multiply by the same number each time.",
        "Shape patterns grow by adding the same number of sides or dots.",
        "Write the rule in words first, then use it to find the missing term.",
      ],
      [
        ["Add-on pattern", R`a,\ a+d,\ a+2d,\ a+3d,\ \ldots`],
        ["Times pattern", R`a,\ ar,\ ar^2,\ ar^3,\ \ldots`],
      ],
      {
        q: "The pattern is 4, 7, 10, 13, … What is the next term?",
        steps: ["Each term is 3 more than the one before.", "13 + 3 = 16."],
        ans: "16",
      }, { skills: ["patterns"] }),

    T("data-handling", "foundation", "Statistics", "Data handling and pictographs",
      "Collect information, sort it with tally marks, and show it as a pictograph or bar graph.",
      [
        "Tally marks are drawn in groups of five: four lines with a fifth across them.",
        "A pictograph uses a symbol for a fixed number of things. Always read the key first.",
        "If one symbol stands for 5, then 4 symbols stand for $4 \\times 5 = 20$; half a symbol stands for 2 or 3.",
        "A bar graph uses bars of equal width; the height of each bar shows the number.",
        "To compare two rows, work out both values, then subtract.",
      ],
      [
        ["Reading a pictograph", R`\text{value} = \text{number of symbols} \times \text{key}`],
        ["Tally", R`\cancel{\text{IIII}} = 5`],
      ],
      {
        q: "In a pictograph each 🍎 = 10 apples. Monday has 6 symbols and Tuesday has 4. How many more apples were sold on Monday?",
        steps: ["Monday: 6 × 10 = 60.", "Tuesday: 4 × 10 = 40.", "60 − 40 = 20."],
        ans: "20 more apples",
      }, { skills: ["pictograph"] }),

    T("angles-turns", "foundation", "Geometry", "Angles and turns",
      R`An angle measures an amount of turn. A full turn is $360^\circ$.`,
      [
        R`A quarter turn is a right angle, $90^\circ$. A half turn is a straight angle, $180^\circ$.`,
        R`Acute angles are less than $90^\circ$; obtuse angles are between $90^\circ$ and $180^\circ$.`,
        R`A reflex angle is more than $180^\circ$ but less than $360^\circ$.`,
        "Measure angles with a protractor: put its centre on the vertex and its zero line on one arm.",
        "Clock hands and compass directions (N, E, S, W) are everyday angles: N to E is a quarter turn.",
      ],
      [
        ["Turns", R`\tfrac14\ \text{turn} = 90^\circ,\ \tfrac12\ \text{turn} = 180^\circ,\ 1\ \text{turn} = 360^\circ`],
        ["Types", R`\text{acute} < 90^\circ < \text{obtuse} < 180^\circ < \text{reflex} < 360^\circ`],
      ],
      {
        q: R`What kind of angle is $135^\circ$, and how far is it from a straight angle?`,
        steps: [R`$135^\circ$ is between $90^\circ$ and $180^\circ$, so it is obtuse.`, R`$180^\circ - 135^\circ = 45^\circ$.`],
        ans: R`Obtuse, $45^\circ$ short of a straight angle`,
      }, { skills: ["angle-kind"] }),

    T("time-calendar", "foundation", "Arithmetic", "Time and the calendar",
      "Read clocks, work out how long things take, and count days on a calendar.",
      [
        "On a clock face the short hand shows the hour and the long hand shows the minutes.",
        "The long hand moves 5 minutes for every number: pointing at 4 means 20 minutes past.",
        "60 minutes make 1 hour and 24 hours make 1 day. Add hours first, then minutes; carry 60 minutes as 1 hour.",
        "a.m. is from midnight to noon; p.m. is from noon to midnight. 24-hour time adds 12 to p.m. hours: 3 p.m. is 15:00.",
        "A week has 7 days, so the same date 7, 14 or 21 days later falls on the same weekday.",
        "Months have 30 or 31 days, except February with 28 (29 in a leap year).",
      ],
      [
        ["Units of time", R`1\text{ h} = 60\text{ min},\ 1\text{ day} = 24\text{ h},\ 1\text{ week} = 7\text{ days}`],
        ["Weekday shift", R`n \text{ days later} \Rightarrow \text{move on } (n \bmod 7) \text{ days}`],
      ],
      {
        q: "A film starts at 4:40 and lasts 1 hour 35 minutes. When does it end?",
        steps: ["Add the hour: 4:40 + 1 hour = 5:40.", "Add 35 minutes: 40 + 35 = 75 minutes = 1 hour 15 minutes.", "So the film ends at 6:15."],
        ans: "6:15",
      }),

    T("money", "foundation", "Arithmetic", "Money",
      "Add prices, find the total bill and work out the change.",
      [
        "₹1 = 100 paise, so ₹12.50 means 12 rupees and 50 paise.",
        "Line up the decimal points when you add or subtract amounts of money.",
        "Change = money paid − total cost.",
        "To find the cost of many of the same item, multiply the price of one by how many.",
      ],
      [
        ["Rupees and paise", R`₹1 = 100 \text{ paise}`],
        ["Change", R`\text{change} = \text{paid} - \text{cost}`],
      ],
      {
        q: "Riya buys a pen for ₹15.50 and a notebook for ₹42. She pays with a ₹100 note. What change does she get?",
        steps: ["Total: ₹15.50 + ₹42.00 = ₹57.50.", "Change: ₹100.00 − ₹57.50 = ₹42.50."],
        ans: "₹42.50",
      }),

    T("maps-directions", "foundation", "Geometry", "Maps and directions",
      "North, south, east and west, turning left and right, and reading simple maps.",
      [
        "The four main directions are North, East, South and West, going clockwise. Between them are North-East, South-East, South-West and North-West.",
        "A right turn is clockwise and a left turn is anticlockwise.",
        R`A quarter turn is $90^\circ$, a half turn is $180^\circ$ and a full turn is $360^\circ$.`,
        "On most maps North is at the top. A scale such as 1 cm : 1 km tells you the real distance.",
        "A grid map names squares by a letter and a number, like B3.",
      ],
      [
        ["Turns", R`\tfrac14 \text{ turn} = 90^\circ,\ \tfrac12 \text{ turn} = 180^\circ,\ 1 \text{ turn} = 360^\circ`],
        ["Map scale", R`\text{real distance} = \text{map distance} \times \text{scale}`],
      ],
      {
        q: "You face North and turn right through 90°, then right again through 90°. Which way do you face?",
        steps: ["North, turn right a quarter turn: East.", "Another quarter turn right: South."],
        ans: "South",
      }),

    /* ---------- Middle school ---------- */
    T("integers", "middle", "Arithmetic", "Integers",
      R`Whole numbers and their negatives: $\ldots, -2, -1, 0, 1, 2, \ldots$`,
      [
        "On a number line, numbers increase to the right.",
        R`Subtracting a negative is the same as adding: $a - (-b) = a + b$.`,
        "Same signs multiply to give a positive; different signs give a negative.",
        R`The absolute value $|a|$ is the distance of $a$ from zero.`,
        "When + and × share a line, follow [[/rules|BODMAS]]: multiply first.",
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

    T("primes", "middle", "Number theory", "Prime numbers",
      "A prime has exactly two factors: 1 and itself. Composite numbers have more.",
      [
        "2 is the only even prime. 1 is neither prime nor composite.",
        "To test a number, try dividing by primes up to its square root.",
        "Every whole number greater than 1 is a prime or a product of primes.",
        "When a division ladder stops, the leftover numbers share no common prime — they are often primes themselves.",
      ],
      [
        ["First primes", R`2, 3, 5, 7, 11, 13, 17, 19, 23, 29`],
        ["Divisibility by 2, 5, 10", R`\text{last digit even};\ \text{last digit }0\ \text{or }5;\ \text{last digit }0`],
        ["Divisibility by 3 or 9", R`\text{digit sum divisible by }3\ \text{or }9`],
      ],
      {
        q: "Which of 1, 9, 11 and 15 are prime?",
        steps: ["1 has only one factor, so it is not prime.", "9 = 3 × 3, composite. 15 = 3 × 5, composite.", "11 has factors 1 and 11 only, so 11 is prime."],
        ans: "Only 11",
      }, { skills: ["primes", "divis"], tool: "numbers" }),

    T("factors-multiples", "middle", "Number theory", "Factors, multiples, HCF and LCM",
      "Breaking numbers into prime factors to see what they share.",
      [
        "A [[primes|prime]] has exactly two factors: 1 and itself. 1 is not prime.",
        "Every whole number above 1 has exactly one prime factorisation.",
        "HCF: take each common prime with its lowest power. LCM: take every prime with its highest power.",
        "When the ladder leftover is two primes, tap them to open the [[primes|prime numbers]] topic.",
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
      }, { skills: ["proportion", "invprop"] }),

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

    T("geometry-basics", "middle", "Geometry", "Basic geometrical ideas",
      "Points, line segments, rays, lines, curves and polygons: the words all geometry is built from.",
      [
        "A point marks an exact position. It has no size and is named with a capital letter.",
        R`A line segment $\overline{AB}$ has two end points; a ray $\overrightarrow{AB}$ has one; a line $\overleftrightarrow{AB}$ has none.`,
        "Two lines that meet are intersecting lines; lines in a plane that never meet are parallel.",
        "Perpendicular lines meet at a right angle.",
        "A polygon is a closed figure made only of line segments. A circle is a closed curve.",
      ],
      [
        ["Notation", R`\overline{AB}\ \text{segment},\quad \overrightarrow{AB}\ \text{ray},\quad \overleftrightarrow{AB}\ \text{line}`],
        ["Parallel and perpendicular", R`l \parallel m,\qquad l \perp m`],
      ],
      {
        q: "How many line segments can you name using three points A, B and C that are not in a line?",
        steps: ["Pick any two of the three points: AB, BC and CA.", "That is 3 segments — the three sides of triangle ABC."],
        ans: "3 line segments",
      }, { skills: ["geo-terms"] }),

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
      }, { skills: ["angles", "angle-kind"] }),

    T("congruence", "middle", "Geometry", "Congruence of triangles",
      "Congruent figures have the same shape and the same size: one fits exactly on top of the other.",
      [
        R`We write $\triangle ABC \cong \triangle PQR$; the order of letters shows which parts match.`,
        "SSS: three sides of one triangle equal three sides of the other.",
        "SAS: two sides and the angle between them are equal.",
        "ASA (or AAS): two angles and a side are equal.",
        "RHS: right angle, hypotenuse and one side are equal. AAA is not a congruence rule — it only gives similar triangles.",
      ],
      [
        ["Rules", R`\text{SSS},\ \text{SAS},\ \text{ASA},\ \text{AAS},\ \text{RHS}`],
        ["CPCT", R`\text{corresponding parts of congruent triangles are equal}`],
      ],
      {
        q: R`In $\triangle ABC$ and $\triangle PQR$: $AB = PQ$, $\angle A = \angle P$ and $AC = PR$. Are they congruent?`,
        steps: ["Two sides are equal: AB = PQ and AC = PR.", R`The angle between them is equal too: $\angle A = \angle P$.`, "That is SAS, so the triangles are congruent."],
        ans: R`Yes, $\triangle ABC \cong \triangle PQR$ by SAS`,
      }, { skills: ["congruence"] }),

    T("constructions", "middle", "Geometry", "Practical geometry and constructions",
      "Using only a ruler and compasses to draw exact lines, angles and triangles.",
      [
        "A perpendicular bisector cuts a segment in half at right angles: draw equal arcs from both ends and join where they cross.",
        "To bisect an angle, draw an arc from the vertex, then equal arcs from where it cuts the arms.",
        R`A $60^\circ$ angle comes from an equilateral triangle: keep the compass width the same.`,
        "Triangles can be constructed from SSS, SAS, ASA or RHS measurements.",
        "Triangle inequality: any two sides added together must be longer than the third side.",
      ],
      [
        ["Triangle inequality", R`a + b > c,\quad b + c > a,\quad c + a > b`],
        ["Third side range", R`|a - b| < c < a + b`],
      ],
      {
        q: "Can you construct a triangle with sides 4 cm, 5 cm and 10 cm?",
        steps: ["Add the two shorter sides: 4 + 5 = 9.", "9 is less than 10, so the two short sides cannot meet.", "No triangle is possible."],
        ans: "No",
      }, { skills: ["tri-ineq"] }),

    T("quads", "middle", "Geometry", "Quadrilaterals",
      "Four-sided polygons: parallelograms, rectangles, rhombuses, squares and trapeziums.",
      [
        R`The four interior angles of any quadrilateral add to $360^\circ$.`,
        "A parallelogram has both pairs of opposite sides parallel and equal; opposite angles are equal.",
        "A rectangle is a parallelogram with four right angles; a rhombus has four equal sides.",
        "A square is both a rectangle and a rhombus. A trapezium has exactly one pair of parallel sides.",
      ],
      [
        ["Angle sum", R`\angle A + \angle B + \angle C + \angle D = 360^\circ`],
        ["Parallelogram", R`AB = CD,\ AD = BC,\ \angle A = \angle C`],
        ["Rectangle", R`\text{all angles }90^\circ,\ \text{diagonals equal}`],
      ],
      {
        q: R`Three angles of a quadrilateral are $80^\circ$, $95^\circ$ and $110^\circ$. Find the fourth.`,
        steps: [R`$80 + 95 + 110 = 285$.`, R`Fourth angle $= 360 - 285 = 75$.`],
        ans: R`$75^\circ$`,
      }, { skills: ["quads"] }),

    T("solids", "middle", "Geometry", "Solid shapes",
      "Cubes, cuboids, prisms and pyramids: faces, edges and vertices.",
      [
        "A face is a flat surface, an edge is where two faces meet, a vertex is a corner.",
        R`Euler's formula for these solids: $F + V - E = 2$.`,
        "A cube has 6 faces, 12 edges and 8 vertices. A triangular prism has 5 faces, 9 edges and 6 vertices.",
        "Nets fold up to make a solid: a cube's net is 6 squares joined edge to edge.",
      ],
      [
        ["Euler", R`F + V - E = 2`],
        ["Cube", R`F=6,\ E=12,\ V=8`],
        ["Triangular prism", R`F=5,\ E=9,\ V=6`],
      ],
      {
        q: "A cuboid has 6 faces and 8 vertices. How many edges does it have?",
        steps: [R`Euler: $F + V - E = 2$.`, R`$6 + 8 - E = 2$, so $E = 12$.`],
        ans: "12 edges",
      }, { skills: ["solids"] }),

    T("rationals", "middle", "Arithmetic", "Rational numbers",
      R`A rational number is any number that can be written $\frac{p}{q}$ with $q \ne 0$.`,
      [
        "Integers, fractions and terminating or repeating decimals are all rational.",
        "To add or subtract, first write both with a common denominator.",
        "The number line goes on forever in both directions: there is a rational between any two rationals.",
        R`A negative times a negative is positive: $\left(-\frac{2}{3}\right)\left(-\frac{3}{4}\right) = \frac{1}{2}$.`,
      ],
      [
        ["On the line", R`\ldots,\ -2,\ -1,\ -\tfrac12,\ 0,\ \tfrac12,\ 1,\ 2,\ \ldots`],
        ["Adding", R`\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}`],
      ],
      {
        q: R`Work out $\frac{2}{3} + \left(-\frac{5}{6}\right)$.`,
        steps: [R`LCM of 3 and 6 is 6: $\frac{2}{3} = \frac{4}{6}$.`, R`$\frac{4}{6} - \frac{5}{6} = -\frac{1}{6}$.`],
        ans: R`$-\frac{1}{6}$`,
      }, { skills: ["rationals"] }),

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

    T("number-systems", "middle", "Arithmetic", "A story of numbers: other bases",
      "Our numbers use base 10, but any whole number can be written in base 2, 5, 8 or others.",
      [
        "In base 10 the places are worth 1, 10, 100, 1000, … Each place is 10 times the one to its right.",
        "In base $b$ the places are worth $1, b, b^2, b^3, …$ and the digits go from 0 to $b - 1$.",
        "Base 2 (binary) uses only 0 and 1. Computers store everything in binary.",
        "To convert to base 10, multiply each digit by its place value and add.",
        "To convert from base 10, keep dividing by the base and read the remainders from bottom to top.",
        "People have counted in many ways: tally marks, Egyptian symbols, [[roman|Roman numerals]], and the Indian place-value system with zero that we use today.",
      ],
      [
        ["Place values in base b", R`d_2 d_1 d_0\ (\text{base } b) = d_2 b^2 + d_1 b + d_0`],
        ["Binary example", R`1011_2 = 8 + 0 + 2 + 1 = 11`],
      ],
      {
        q: R`Write $213_5$ in base 10.`,
        steps: [R`The places are worth $25, 5, 1$.`, R`$2 \times 25 + 1 \times 5 + 3 \times 1 = 50 + 5 + 3 = 58$.`],
        ans: R`$58$`,
      }),

    /* ---------- Secondary ---------- */
    T("graphs-pie", "middle", "Statistics", "Bar graphs, pie charts and line graphs",
      "Different graphs for different data: compare with bars, show parts of a whole with a pie, show change with a line.",
      [
        "A double bar graph puts two bars side by side to compare two sets of data.",
        R`In a pie chart the whole circle, $360^\circ$, stands for the total.`,
        R`Each sector's angle is $\frac{\text{value}}{\text{total}} \times 360^\circ$.`,
        "A line graph joins points plotted against time; a rising line means increase.",
        "A histogram shows grouped data with bars that touch, one bar for each class interval.",
      ],
      [
        ["Pie chart angle", R`\theta = \frac{\text{value}}{\text{total}} \times 360^\circ`],
        ["Percent to angle", R`p\% \text{ of } 360^\circ = 3.6p^\circ`],
      ],
      {
        q: "Out of 36 students, 9 walk to school. What angle shows walking in a pie chart?",
        steps: [R`$\frac{9}{36} = \frac{1}{4}$.`, R`$\frac14 \times 360^\circ = 90^\circ$.`],
        ans: R`$90^\circ$`,
      }, { skills: ["pie"] }),

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

    T("euclid", "secondary", "Geometry", "Euclid's geometry",
      "A short list of agreed rules from which the rest of school geometry is built.",
      [
        "A point has position but no size. A line has length but no breadth.",
        "Through two distinct points there is exactly one straight line.",
        "A line segment has two endpoints; a ray has one and goes on forever the other way.",
        "Euclid's postulates let you draw a unique line, extend a segment, and draw a circle of any radius.",
        "Things which are equal to the same thing are equal to one another.",
      ],
      [
        ["Two points", R`\text{exactly one line}`],
        ["Line segment", R`\text{2 endpoints}`],
        ["Ray", R`\text{1 endpoint}`],
        ["Right angles", R`\text{all right angles are equal}`],
      ],
      {
        q: "How many distinct straight lines pass through two given points?",
        steps: ["Euclid's first postulate: a unique straight line can be drawn joining any two points.", "So the number is 1."],
        ans: "1",
      }, { skills: ["euclid"] }),

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

    T("circle-areas", "secondary", "Mensuration", "Areas related to circles",
      "Sectors, arcs and segments: parts of a circle cut off by radii or a chord.",
      [
        "A sector is the slice between two radii, like a slice of pizza.",
        R`A sector with angle $\theta$ is $\frac{\theta}{360}$ of the whole circle.`,
        "The arc is the curved edge of the sector.",
        "A segment is the region between a chord and its arc: sector area minus the triangle.",
        R`NCERT usually takes $\pi = \frac{22}{7}$ when the radius is a multiple of 7, otherwise $3.14$.`,
      ],
      [
        ["Arc length", R`l = \frac{\theta}{360} \times 2\pi r`],
        ["Area of sector", R`A = \frac{\theta}{360} \times \pi r^2`],
        ["Area of segment", R`\text{sector} - \text{triangle}`],
      ],
      {
        q: R`Find the area of a sector of radius 21 cm and angle $60^\circ$. Use $\pi = \frac{22}{7}$.`,
        steps: [R`$\frac{60}{360} = \frac16$ of the circle.`, R`$\pi r^2 = \frac{22}{7} \times 21^2 = 1386$ cm².`, R`$\frac16 \times 1386 = 231$ cm².`],
        ans: "231 cm²",
      }, { skills: ["sector"] }),

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

    T("propositions", "secondary", "Discrete maths", "Proofs, statements and converses",
      "How mathematicians make statements, test them and prove them.",
      [
        "A statement is a sentence that is either true or false, such as \"7 is a prime number\".",
        R`Many theorems have the form "if $P$, then $Q$". $P$ is the hypothesis and $Q$ is the conclusion.`,
        R`The converse swaps the parts: "if $Q$, then $P$". A true statement can have a false converse.`,
        "One counter-example is enough to show a statement is false.",
        "A proof starts from axioms and statements already proved, and reaches the result step by step.",
        R`Proof by contradiction: assume the opposite and show it leads to something impossible (as in proving $\sqrt2$ is [[real-numbers|irrational]]).`,
      ],
      [
        ["Statement", R`P \Rightarrow Q`],
        ["Converse", R`Q \Rightarrow P`],
        ["Contrapositive (always equivalent)", R`\neg Q \Rightarrow \neg P`],
      ],
      {
        q: "Statement: \"If a number is divisible by 4, then it is even.\" Is the converse true?",
        steps: ["The converse is: \"If a number is even, then it is divisible by 4.\"", "6 is even but not divisible by 4: a counter-example.", "So the converse is false."],
        ans: "No — 6 is a counter-example",
      }),

    T("algorithms", "secondary", "Number theory", "Algorithms",
      "Step-by-step methods that always finish with the answer.",
      [
        "An algorithm is a list of exact steps; following them always gives the result.",
        R`Euclid's division lemma: for whole numbers $a$ and $b > 0$ there are unique $q$ and $r$ with $a = bq + r$ and $0 \le r < b$.`,
        R`Euclid's algorithm for the [[factors-multiples|HCF]]: divide, then divide the divisor by the remainder, until the remainder is 0. The last divisor is the HCF.`,
        "The Collatz rule: halve an even number, or multiply an odd number by 3 and add 1. Every number tried so far reaches 1, but nobody has proved it always does.",
      ],
      [
        ["Division lemma", R`a = bq + r,\quad 0 \le r < b`],
        ["Key fact", R`\text{HCF}(a, b) = \text{HCF}(b, r)`],
        ["Collatz step", R`n \to \begin{cases} n/2 & n \text{ even} \\ 3n + 1 & n \text{ odd} \end{cases}`],
      ],
      {
        q: "Use Euclid's algorithm to find the HCF of 455 and 42.",
        steps: [R`$455 = 42 \times 10 + 35$.`, R`$42 = 35 \times 1 + 7$.`, R`$35 = 7 \times 5 + 0$.`, "The remainder is 0, so the HCF is 7."],
        ans: R`$7$`,
      }),

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

    T("inverse-trig", "senior", "Trigonometry", "Inverse trigonometric functions",
      R`$\sin^{-1} x$ asks "which angle has sine $x$?" — the answer is taken from a fixed principal range.`,
      [
        R`$\sin^{-1}$ gives an angle in $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$.`,
        R`$\cos^{-1}$ gives an angle in $[0, \pi]$.`,
        R`$\tan^{-1}$ gives an angle in $\left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$.`,
        R`$\sin^{-1}(-x) = -\sin^{-1} x$, but $\cos^{-1}(-x) = \pi - \cos^{-1} x$.`,
        R`$\sin^{-1} x$ is not $\frac{1}{\sin x}$; that is $\operatorname{cosec} x$.`,
      ],
      [
        ["Principal ranges", R`\sin^{-1}: \left[-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right],\ \cos^{-1}: [0, \pi],\ \tan^{-1}: \left(-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right)`],
        ["Negative inputs", R`\sin^{-1}(-x) = -\sin^{-1}x,\quad \cos^{-1}(-x) = \pi - \cos^{-1}x`],
        ["Sum", R`\sin^{-1}x + \cos^{-1}x = \frac{\pi}{2}`],
      ],
      {
        q: R`Find $\cos^{-1}\left(-\frac12\right)$.`,
        steps: [R`$\cos^{-1}\frac12 = \frac{\pi}{3}$.`, R`$\cos^{-1}(-x) = \pi - \cos^{-1}x$.`, R`$\pi - \frac{\pi}{3} = \frac{2\pi}{3}$, which is in $[0, \pi]$.`],
        ans: R`$\frac{2\pi}{3}$`,
      }, { skills: ["inv-trig"] }),

    T("inequalities", "senior", "Algebra", "Linear inequalities",
      R`Like equations, but with $<$, $>$, $\le$ or $\ge$: the answer is a range of numbers.`,
      [
        "You may add or subtract the same number on both sides.",
        "Multiplying or dividing by a positive number keeps the sign.",
        "Multiplying or dividing by a negative number flips the sign: < becomes >.",
        "On a number line, an open dot means the end number is not included; a filled dot means it is.",
        R`Interval notation: $x < 3$ is $(-\infty, 3)$; $x \ge 3$ is $[3, \infty)$.`,
      ],
      [
        ["Flip rule", R`-2x < 6 \implies x > -3`],
        ["Interval form", R`x \le a \iff x \in (-\infty, a]`],
      ],
      {
        q: R`Solve $5 - 2x \ge 11$.`,
        steps: [R`Subtract 5: $-2x \ge 6$.`, R`Divide by $-2$ and flip the sign: $x \le -3$.`],
        ans: R`$x \le -3$, i.e. $(-\infty, -3]$`,
      }, { skills: ["inequality"] }),

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

    T("dispersion", "senior", "Statistics", "Statistics: variance and standard deviation",
      "Measures of how spread out data is around its mean.",
      [
        "The range is the largest value minus the smallest; it uses only two values.",
        "Mean deviation is the average distance of the values from the mean (or median).",
        R`Variance $\sigma^2$ is the average of the squared deviations from the mean.`,
        R`Standard deviation $\sigma$ is the square root of the variance, in the same units as the data.`,
        "A smaller standard deviation means the data is more tightly bunched around the mean.",
        R`The coefficient of variation $\frac{\sigma}{\bar x} \times 100$ compares the spread of two data sets.`,
      ],
      [
        ["Variance", R`\sigma^2 = \frac{1}{n}\sum (x_i - \bar x)^2 = \frac{1}{n}\sum x_i^2 - \bar x^2`],
        ["Standard deviation", R`\sigma = \sqrt{\sigma^2}`],
        ["Coefficient of variation", R`\text{CV} = \frac{\sigma}{\bar x} \times 100`],
      ],
      {
        q: "Find the variance and standard deviation of 3, 5, 7, 9.",
        steps: [R`Mean $= 24 \div 4 = 6$.`, "Deviations: −3, −1, 1, 3. Squares: 9, 1, 1, 9, total 20.", R`$\sigma^2 = 20 \div 4 = 5$ and $\sigma = \sqrt5 \approx 2.24$.`],
        ans: R`$\sigma^2 = 5$, $\sigma = \sqrt5$`,
      }),

    T("continuity", "senior", "Calculus", "Continuity and differentiability",
      "A function is continuous where its graph has no breaks; the chain rule differentiates functions inside functions.",
      [
        R`$f$ is continuous at $x = a$ if $\lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x) = f(a)$.`,
        "For a piecewise function, make the two pieces give the same value at the join.",
        R`Every differentiable function is continuous, but not the other way round: $|x|$ is continuous at 0 but has a corner there.`,
        R`Chain rule: if $y = f(u)$ and $u = g(x)$, then $\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}$.`,
        R`Work from outside in: differentiate the outer function, keep the inside, then multiply by the derivative of the inside.`,
      ],
      [
        ["Continuity at a", R`\lim_{x \to a} f(x) = f(a)`],
        ["Chain rule", R`\frac{d}{dx} f(g(x)) = f'(g(x))\,g'(x)`],
        ["Power of a function", R`\frac{d}{dx}(ax + b)^n = na(ax + b)^{n-1}`],
        ["Logarithmic derivative", R`\frac{d}{dx}\ln f(x) = \frac{f'(x)}{f(x)}`],
      ],
      {
        q: R`Differentiate $y = (3x + 1)^5$.`,
        steps: [R`Let $u = 3x + 1$, so $y = u^5$.`, R`$\frac{dy}{du} = 5u^4$ and $\frac{du}{dx} = 3$.`, R`$\frac{dy}{dx} = 5u^4 \times 3 = 15(3x + 1)^4$.`],
        ans: R`$15(3x + 1)^4$`,
      }),

    T("app-integrals", "senior", "Calculus", "Application of integrals",
      "Use definite integrals to find the area of a region under a curve or between two curves.",
      [
        R`The area between $y = f(x) \ge 0$, the $x$-axis and the lines $x = a$, $x = b$ is $\int_a^b f(x)\,dx$.`,
        "If the curve is below the axis the integral is negative; take its absolute value for the area.",
        R`The area between two curves is $\int_a^b (\text{top} - \text{bottom})\,dx$.`,
        "Sketch the region first to find which curve is on top and where the curves meet.",
      ],
      [
        ["Area under a curve", R`A = \int_a^b f(x)\,dx`],
        ["Area between curves", R`A = \int_a^b \big(f(x) - g(x)\big)\,dx`],
        ["Area of a circle (check)", R`4\int_0^r \sqrt{r^2 - x^2}\,dx = \pi r^2`],
      ],
      {
        q: R`Find the area under $y = 3x^2$ from $x = 0$ to $x = 2$.`,
        steps: [R`$A = \int_0^2 3x^2\,dx$.`, R`An antiderivative is $x^3$.`, R`$A = 2^3 - 0^3 = 8$ square units.`],
        ans: "8 square units",
      }),

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

  /* Individual classes shown in the UI. Each one belongs to a stage (above),
     which stays the backbone for colours, difficulty and progression. */
  window.MZ_CLASSES = [
    { id: "c1", num: 1, stage: "foundation" },
    { id: "c2", num: 2, stage: "foundation" },
    { id: "c3", num: 3, stage: "foundation" },
    { id: "c4", num: 4, stage: "foundation" },
    { id: "c5", num: 5, stage: "foundation" },
    { id: "c6", num: 6, stage: "middle" },
    { id: "c7", num: 7, stage: "middle" },
    { id: "c8", num: 8, stage: "middle" },
    { id: "c9", num: 9, stage: "secondary" },
    { id: "c10", num: 10, stage: "secondary" },
    { id: "c11", num: 11, stage: "senior" },
    { id: "c12", num: 12, stage: "senior" },
    { id: "ug", num: null, name: "Undergraduate", range: "College and beyond", stage: "college" },
  ];

  /* Which class each topic sits in (standard NCERT/CBSE sequence). Every
     college topic falls under "ug". Edit a number to move a chapter. */
  const CLS = {
    // Foundation — Class 1 to 5
    shapes: 1, patterns: 1,
    "place-value": 2, "add-sub": 2, money: 2,
    "mult-div": 3, "time-calendar": 3, "data-handling": 3,
    measurement: 4, "maps-directions": 4, roman: 4, "angles-turns": 4,
    fractions: 5, decimals: 5, "perimeter-area": 5, symmetry: 5,
    // Middle — Class 6 to 8
    integers: 6, primes: 6, "factors-multiples": 6, "geometry-basics": 6, "ratio-proportion": 6, "number-systems": 6, "data-basic": 6,
    rationals: 7, exponents: 7, "lines-angles": 7, congruence: 7, percentages: 7, "profit-interest": 7, "linear-one": 7,
    "squares-roots": 8, "algebra-identities": 8, quads: 8, constructions: 8, solids: 8, "mensuration-2d": 8, "graphs-pie": 8,
    // Secondary — Class 9 to 10
    euclid: 9, propositions: 9, algorithms: 9, "surface-volume": 9, "statistics-grouped": 9, "probability-basic": 9, coordinate: 9, polynomials: 9,
    "real-numbers": 10, "linear-two": 10, quadratic: 10, ap: 10, triangles: 10, circles: 10, "circle-areas": 10, "trig-basic": 10, heights: 10,
    // Senior — Class 11 to 12
    sets: 11, "trig-functions": 11, complex: 11, inequalities: 11, pnc: 11, binomial: 11, sequences: 11, "lines-conics": 11, "limits-derivatives": 11, dispersion: 11,
    "inverse-trig": 12, matrices: 12, continuity: 12, "app-derivatives": 12, integrals: 12, "app-integrals": 12, "diff-eq": 12, vectors: 12, "probability-adv": 12, lpp: 12,
  };
  window.MZ_TOPICS.forEach((t) => {
    t.cls = t.level === "college" ? "ug" : "c" + (CLS[t.id] || 1);
    if (t.level !== "college" && !CLS[t.id]) console.warn("No class mapped for topic:", t.id);
  });

  /* [word, meaning, topic id] — the topic id is where "Learn more" goes. */
  window.MZ_GLOSSARY = [
    ["Acute angle", R`An angle less than $90^\circ$.`, "angles-turns"],
    ["Algebraic expression", R`Numbers and letters joined by operations, such as $3x + 2y$.`, "algebra-identities"],
    ["Alternate angles", "Angles on opposite sides of a transversal, between two lines. They are equal when the lines are parallel.", "lines-angles"],
    ["Arc", "Part of the curved edge of a circle.", "circle-areas"],
    ["Area", "The amount of flat surface a shape covers, measured in square units.", "perimeter-area"],
    ["Arithmetic progression", R`A list where each term is the previous one plus a fixed difference $d$.`, "ap"],
    ["Average (mean)", "Add all the values and divide by how many there are.", "data-basic"],
    ["Bar graph", "A chart where the height of each bar shows a number.", "data-handling"],
    ["BODMAS", "The order to work out a calculation: Brackets, Orders, Division and Multiplication, then Addition and Subtraction.", "/rules"],
    ["Chord", "A line segment joining two points on a circle.", "circles"],
    ["Circumference", R`The distance around a circle: $2\pi r$.`, "mensuration-2d"],
    ["Co-prime", "Two numbers whose HCF is 1, such as 7 and 5.", "factors-multiples"],
    ["Composite number", "A whole number with more than two factors, such as 4, 6 or 9.", "primes"],
    ["Congruent", "Exactly the same shape and size.", "congruence"],
    ["Coordinates", R`A pair $(x, y)$ giving a point's position on a grid.`, "coordinate"],
    ["Decimal", "A number with a decimal point; places after it are tenths, hundredths and so on.", "decimals"],
    ["Denominator", "The bottom number of a fraction: how many equal parts make a whole.", "fractions"],
    ["Derivative", "The rate of change of a function; the slope of its graph.", "limits-derivatives"],
    ["Diameter", "A chord through the centre of a circle; twice the radius.", "mensuration-2d"],
    ["Divisible", "A number is divisible by another if it divides with no remainder.", "primes"],
    ["Edge", "A line where two faces of a solid meet.", "solids"],
    ["Equation", "A statement that two expressions are equal, such as 2x + 3 = 11.", "linear-one"],
    ["Exponent (power)", R`The small number that says how many times to multiply: $2^3 = 2 \times 2 \times 2$.`, "exponents"],
    ["Face", "A flat surface of a solid.", "solids"],
    ["Factor", "A number that divides another exactly. The factors of 6 are 1, 2, 3 and 6.", "factors-multiples"],
    ["Fraction", "Part of a whole, written as numerator over denominator.", "fractions"],
    ["HCF", "Highest common factor: the biggest number that divides two numbers exactly.", "factors-multiples"],
    ["Hypotenuse", "The longest side of a right-angled triangle, opposite the right angle.", "triangles"],
    ["Inequality", "A statement using <, >, ≤ or ≥ instead of =.", "inequalities"],
    ["Integer", "A whole number or its negative: …, −2, −1, 0, 1, 2, …", "integers"],
    ["Integral", "The reverse of a derivative; also the area under a curve.", "integrals"],
    ["Irrational number", R`A number that can't be written as a fraction, such as $\sqrt2$ or $\pi$.`, "real-numbers"],
    ["LCM", "Lowest common multiple: the smallest number that two numbers both divide.", "factors-multiples"],
    ["Line", "A straight path that goes on forever in both directions.", "geometry-basics"],
    ["Line segment", "Part of a line with two end points.", "geometry-basics"],
    ["Line of symmetry", "A fold line that makes both halves of a shape match exactly.", "symmetry"],
    ["Matrix", "A rectangular grid of numbers in rows and columns.", "matrices"],
    ["Median", "The middle value when the data is in order.", "data-basic"],
    ["Mode", "The value that appears most often.", "data-basic"],
    ["Multiple", "The result of multiplying a number by a whole number. Multiples of 4: 4, 8, 12, …", "factors-multiples"],
    ["Numerator", "The top number of a fraction: how many parts are taken.", "fractions"],
    ["Obtuse angle", R`An angle between $90^\circ$ and $180^\circ$.`, "angles-turns"],
    ["Parallel lines", "Lines in the same plane that never meet.", "geometry-basics"],
    ["Percentage", "A number out of 100. 25% means 25 out of every 100.", "percentages"],
    ["Perimeter", "The total distance around the edge of a shape.", "perimeter-area"],
    ["Perpendicular", "Meeting at a right angle.", "geometry-basics"],
    ["Pictograph", "A chart that uses pictures; the key says what each picture stands for.", "data-handling"],
    ["Pie chart", R`A circle split into sectors; the whole $360^\circ$ is the total.`, "graphs-pie"],
    ["Place value", "The value of a digit from its position: ones, tens, hundreds…", "place-value"],
    ["Polygon", "A closed shape made only of straight sides.", "shapes"],
    ["Polynomial", R`A sum of terms like $ax^n$ with whole-number powers.`, "polynomials"],
    ["Prime factorisation", R`Writing a number as a product of primes: $12 = 2 \times 2 \times 3$.`, "factors-multiples"],
    ["Prime number", "A number with exactly two factors, 1 and itself: 2, 3, 5, 7, 11, …", "primes"],
    ["Probability", "How likely something is, from 0 (impossible) to 1 (certain).", "probability-basic"],
    ["Quadratic equation", R`An equation of the form $ax^2 + bx + c = 0$.`, "quadratic"],
    ["Quadrilateral", "A polygon with four sides.", "quads"],
    ["Radius", "The distance from the centre of a circle to its edge.", "mensuration-2d"],
    ["Ratio", "A comparison of two amounts, written a : b.", "ratio-proportion"],
    ["Rational number", R`Any number $\frac{p}{q}$ with integers $p, q$ and $q \ne 0$.`, "rationals"],
    ["Ray", "Part of a line with one end point, going on forever in one direction.", "geometry-basics"],
    ["Reflex angle", R`An angle between $180^\circ$ and $360^\circ$.`, "angles-turns"],
    ["Right angle", R`An angle of exactly $90^\circ$ — a quarter turn.`, "angles-turns"],
    ["Roman numerals", "Letters used as numbers: I, V, X, L, C, D, M.", "roman"],
    ["Sector", "The slice of a circle between two radii.", "circle-areas"],
    ["Set", "A well-defined collection of objects.", "sets"],
    ["Similar", "The same shape but not necessarily the same size.", "triangles"],
    ["Square root", R`The number that multiplies by itself to give the original: $\sqrt{49} = 7$.`, "squares-roots"],
    ["Tangent", "A line that touches a circle at exactly one point.", "circles"],
    ["Term", R`One part of an expression, separated by + or −, such as $3x$.`, "algebra-identities"],
    ["Variable", "A letter that stands for an unknown number.", "linear-one"],
    ["Vector", "A quantity with both size and direction.", "vectors"],
    ["Vertex", "A corner where sides or edges meet. Plural: vertices.", "shapes"],
    ["Volume", "The amount of space a solid takes up, in cubic units.", "surface-volume"],
    ["Algorithm", "A list of exact steps that always ends with the answer, such as Euclid's method for the HCF.", "algorithms"],
    ["Axiom", "A basic truth accepted without proof, used all through maths. Euclid called them common notions.", "euclid"],
    ["Postulate", "A basic assumption about geometry accepted without proof, such as \"a line can be drawn through any two points\".", "euclid"],
    ["Converse", "The statement made by swapping the \"if\" and \"then\" parts. It may be false even when the original is true.", "propositions"],
    ["Counter-example", "One example that shows a statement is false.", "propositions"],
    ["Binary", "Base 2: numbers written with only the digits 0 and 1.", "number-systems"],
    ["Tally marks", "Lines used for counting, grouped in fives: four lines and one across.", "data-handling"],
    ["Transversal", "A line that crosses two or more other lines.", "lines-angles"],
    ["Corresponding angles", "Angles in the same position at each crossing of a transversal. They are equal when the lines are parallel.", "lines-angles"],
    ["Co-interior angles", R`Angles between two lines on the same side of a transversal. They add to $180^\circ$ when the lines are parallel.`, "lines-angles"],
    ["Rotational symmetry", "A shape has it if it looks the same after a turn of less than a full turn about its centre.", "symmetry"],
    ["Bisect", "Cut into two equal parts.", "constructions"],
    ["Semi-perimeter", R`Half the perimeter of a triangle, $s = \frac{a + b + c}{2}$, used in Heron's formula.`, "mensuration-2d"],
    ["Cumulative frequency", "A running total of the frequencies, used to find the median of grouped data.", "statistics-grouped"],
    ["Focus", R`The fixed point of a parabola. For $y^2 = 4ax$ it is $(a, 0)$.`, "lines-conics"],
    ["Directrix", R`The fixed line of a parabola. For $y^2 = 4ax$ it is $x = -a$.`, "lines-conics"],
    ["Variance", "The average of the squared distances from the mean.", "dispersion"],
    ["Standard deviation", "The square root of the variance; a measure of spread in the same units as the data.", "dispersion"],
    ["Continuous function", "A function whose graph has no breaks or jumps.", "continuity"],
    ["Chain rule", R`To differentiate a function of a function: $\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}$.`, "continuity"],
    ["Determinant", "A single number worked out from a square matrix; it is 0 exactly when the matrix has no inverse.", "matrices"],
    ["Geometric mean", R`For two positive numbers, $\sqrt{ab}$. It is never more than the arithmetic mean.`, "sequences"],
    ["Bayes' theorem", R`Turns $P(B \mid A)$ around into $P(A \mid B) = \frac{P(A)P(B \mid A)}{P(B)}$.`, "probability-adv"],
  ].sort((a, b) => a[0].localeCompare(b[0]));
})();
