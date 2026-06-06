const canvas = document.getElementById("sceneCanvas");
const ctx = canvas.getContext("2d");

const intro = document.getElementById("intro");
const labApp = document.getElementById("labApp");
const openBookBtn = document.getElementById("openBookBtn");
const resetAllBtn = document.getElementById("resetAllBtn");
const toggleShelfBtn = document.getElementById("toggleShelfBtn");
const shelf = document.getElementById("shelf");
const experimentList = document.getElementById("experimentList");
const futureList = document.getElementById("futureList");
const controlsEl = document.getElementById("controls");
const liveStrip = document.getElementById("liveStrip");
const sceneTitle = document.getElementById("sceneTitle");
const sceneChapter = document.getElementById("sceneChapter");
const experimentTitle = document.getElementById("experimentTitle");
const experimentChapter = document.getElementById("experimentChapter");
const experimentMood = document.getElementById("experimentMood");
const knowledgeCard = document.getElementById("knowledgeCard");
const knowledgeTag = document.getElementById("knowledgeTag");
const conclusionText = document.getElementById("conclusionText");
const confidencePill = document.getElementById("confidencePill");
const statusPill = document.getElementById("statusPill");
const pauseBadge = document.getElementById("pauseBadge");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const toast = document.getElementById("toast");

const TAU = Math.PI * 2;
const G = 9.8;

const experiments = [
  {
    id: "newton",
    icon: "F",
    chapter: "力学",
    title: "探究加速度与力、质量的关系",
    mood: "纸带、轨迹和图像一起写下牛顿第二定律。",
    accent: "#2f958e",
    controls: [
      { key: "mass", label: "小车质量 M", min: 0.30, max: 1.50, step: 0.01, value: 0.70, unit: "kg" },
      { key: "force", label: "合外力 F", min: 0.30, max: 4.00, step: 0.05, value: 1.40, unit: "N" }
    ],
    overview: {
      title: "先让小车从静止释放",
      body: "调节合外力和小车质量，观察纸带点距、速度图像和加速度数值。理想模型中合外力恒定时，小车做匀加速直线运动。",
      formula: "a = F / M"
    },
    conclusion: "在质量一定时，加速度与合外力成正比；在合外力一定时，加速度与质量成反比。图像斜率越大，说明加速度越大。",
    cards: {
      cart: {
        label: "小车",
        title: "为什么小车越来越快？",
        body: "合外力不为零时，速度每秒增加相同的量。这个“每秒速度的变化量”就是加速度。",
        formula: "v = at,  x = 1/2 at^2"
      },
      graph: {
        label: "v-t 图像",
        title: "斜率就是加速度",
        body: "匀加速直线运动的 v-t 图像是一条直线。直线越陡，单位时间内速度增加越多。",
        formula: "a = Δv / Δt"
      },
      force: {
        label: "合外力",
        title: "控制变量才看得清规律",
        body: "研究 F 和 a 的关系时保持质量不变；研究 M 和 a 的关系时保持合外力不变。",
        formula: "F = Ma"
      }
    }
  },
  {
    id: "projectile",
    icon: "↘",
    chapter: "力学",
    title: "探究平抛运动的特点",
    mood: "把一个弯曲轨迹拆成水平方向和竖直方向的两首歌。",
    accent: "#e86f61",
    controls: [
      { key: "speed", label: "初速度 v₀", min: 2.0, max: 9.0, step: 0.1, value: 5.2, unit: "m/s" },
      { key: "height", label: "抛出高度 h", min: 0.8, max: 4.0, step: 0.1, value: 2.2, unit: "m" }
    ],
    overview: {
      title: "暂停时看两个方向",
      body: "平抛运动可以分解为水平匀速直线运动和竖直自由落体运动。拖动初速度，会看到水平位移改变；高度改变会影响飞行时间。",
      formula: "x = v₀t,  y = 1/2gt²"
    },
    conclusion: "平抛运动水平方向不受力，速度保持不变；竖直方向只受重力，做自由落体运动。落地时间由高度决定，水平射程由 v₀ 和时间共同决定。",
    cards: {
      ball: {
        label: "小球",
        title: "弯曲轨迹不是一种新运动",
        body: "小球的真实轨迹是抛物线，但它可以拆成两个互不影响的方向来分析。",
        formula: "x = v₀t,  y = 1/2gt²"
      },
      vector: {
        label: "速度分解",
        title: "水平速度不变，竖直速度变大",
        body: "水平方向没有加速度；竖直方向加速度恒为 g，所以竖直速度随时间线性增加。",
        formula: "vₓ = v₀,  vᵧ = gt"
      },
      target: {
        label: "落地点",
        title: "射程由时间和水平速度共同决定",
        body: "高度越高，飞行时间越长；初速度越大，同样时间内飞得越远。",
        formula: "R = v₀√(2h/g)"
      }
    }
  },
  {
    id: "pendulum",
    icon: "◷",
    chapter: "力学",
    title: "用单摆测量重力加速度",
    mood: "摆球在黄昏里来回，周期把重力加速度轻轻量出来。",
    accent: "#d6a744",
    controls: [
      { key: "length", label: "摆长 L", min: 0.30, max: 1.80, step: 0.01, value: 0.90, unit: "m" },
      { key: "angle", label: "初始角 θ", min: 3, max: 28, step: 1, value: 12, unit: "°" }
    ],
    overview: {
      title: "让摆球完整摆动几次",
      body: "小角度条件下，单摆周期只与摆长和当地重力加速度有关。角度太大时，课本公式只是近似。",
      formula: "T = 2π√(L/g)"
    },
    conclusion: "小角度单摆周期与摆球质量无关，与振幅近似无关；摆长越长，周期越大。由 T² = 4π²L/g 可测量 g。",
    cards: {
      bob: {
        label: "摆球",
        title: "摆球质量不会改变小角度周期",
        body: "质量变大时重力和惯性同时变大，二者影响抵消，所以小角度周期与质量无关。",
        formula: "T = 2π√(L/g)"
      },
      angle: {
        label: "小角度近似",
        title: "角度别太大",
        body: "当 θ 较小时，sinθ 可以近似看成 θ。角度过大，周期会比公式预测略大。",
        formula: "sinθ ≈ θ"
      },
      timer: {
        label: "测周期",
        title: "多次测量更可靠",
        body: "实际实验常测 20 次或 30 次全振动总时间，再求平均周期，以减小按表反应误差。",
        formula: "g = 4π²L / T²"
      }
    }
  },
  {
    id: "optics",
    icon: "λ",
    chapter: "光学",
    title: "探究折射与干涉条纹",
    mood: "让光路、色散和条纹在书页上亮起来。",
    accent: "#6f6aa8",
    controls: [
      { key: "angle", label: "入射角 i", min: 8, max: 68, step: 1, value: 38, unit: "°" },
      { key: "refractive", label: "玻璃折射率 n", min: 1.20, max: 1.80, step: 0.01, value: 1.50, unit: "" },
      { key: "wavelength", label: "波长 λ", min: 420, max: 680, step: 5, value: 560, unit: "nm" }
    ],
    overview: {
      title: "看光在界面处怎样转弯",
      body: "折射遵循 n₁sin i = n₂sin r。右侧条纹用双缝近似展示，波长越长，条纹间距越大。",
      formula: "n₁sin i = n₂sin r,  Δx = λL/d"
    },
    conclusion: "光从空气进入玻璃时向法线偏折；折射率越大，折射角越小。双缝干涉中，波长越长或屏距越大，条纹间距越大。",
    cards: {
      ray: {
        label: "折射光线",
        title: "光为什么会偏折？",
        body: "光进入不同介质时传播速度改变，波前方向随之改变，于是光线看起来发生偏折。",
        formula: "n₁sin i = n₂sin r"
      },
      normal: {
        label: "法线",
        title: "角度都要相对法线测量",
        body: "入射角和折射角不是相对界面测量，而是相对垂直界面的法线测量。",
        formula: "i = ∠(入射光, 法线)"
      },
      fringe: {
        label: "干涉条纹",
        title: "明暗条纹来自路程差",
        body: "两束相干光到达屏幕时，路程差为整数倍波长处加强，为半整数倍波长处减弱。",
        formula: "Δx = λL / d"
      }
    }
  },
  {
    id: "induction",
    icon: "B",
    chapter: "电磁学",
    title: "探究感应电流方向",
    mood: "把看不见的磁通量变化画成能被看懂的风。",
    accent: "#427aa1",
    controls: [
      { key: "magnetSpeed", label: "磁体速度", min: -2.0, max: 2.0, step: 0.1, value: 1.0, unit: "m/s" },
      { key: "field", label: "磁场强度", min: 0.5, max: 2.5, step: 0.1, value: 1.2, unit: "T" },
      { key: "turns", label: "线圈匝数", min: 8, max: 48, step: 1, value: 24, unit: "匝" }
    ],
    overview: {
      title: "让磁体靠近或远离线圈",
      body: "只有磁通量发生变化，线圈中才会出现感应电流。速度、磁场强度和匝数都会影响感应电动势大小。",
      formula: "E = -N ΔΦ/Δt"
    },
    conclusion: "感应电流的磁场总要阻碍原磁通量的变化。磁体靠近和远离时，电流方向相反；变化越快，感应电动势越大。",
    cards: {
      magnet: {
        label: "磁体",
        title: "运动才带来磁通量变化",
        body: "磁体静止时，穿过线圈的磁通量不变，电流表指针回到零附近。",
        formula: "Φ = BS cosθ"
      },
      coil: {
        label: "线圈",
        title: "匝数越多，感应更明显",
        body: "每一匝都贡献感应电动势，理想情况下总电动势与匝数 N 成正比。",
        formula: "E = -N ΔΦ/Δt"
      },
      current: {
        label: "电流方向",
        title: "楞次定律是一句“反抗变化”",
        body: "感应电流产生的磁场方向，总是阻碍引起它的磁通量变化，而不是简单阻碍运动本身。",
        formula: "方向：阻碍 ΔΦ"
      }
    }
  }
];

const futureExperiments = [
  ["力学", "互成角度两个力的合成"],
  ["力学", "探究弹簧形变量与弹力的关系"],
  ["力学", "验证机械能守恒定律"],
  ["热学", "气体等温变化与压强体积关系"],
  ["电学", "测量金属丝电阻率"],
  ["电学", "测定电源电动势和内阻"],
  ["电磁学", "探究通电导线在磁场中受力"],
  ["光学", "测定凸透镜焦距"],
  ["近代物理", "光电效应与临界频率"]
];

const S = {
  current: experiments[0],
  values: {},
  t: 0,
  running: false,
  paused: false,
  done: false,
  lastTs: 0,
  trail: [],
  samples: [],
  longPressTimer: null,
  activeHotspot: null,
  dragTarget: null,
  toastTimer: null,
  dpr: 1,
  cssW: 980,
  cssH: 620
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function map(value, inMin, inMax, outMin, outMax) {
  const p = (value - inMin) / (inMax - inMin);
  return outMin + p * (outMax - outMin);
}

function fmt(value, digits = 2) {
  if (Math.abs(value) >= 100) return value.toFixed(0);
  if (Math.abs(value) >= 10) return value.toFixed(1);
  return value.toFixed(digits);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(S.toastTimer);
  S.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function setKnowledge(card, tag = "知识点") {
  knowledgeTag.textContent = tag;
  knowledgeCard.innerHTML = `
    <h4>${card.title}</h4>
    <p>${card.body}</p>
    <span class="formula">${card.formula}</span>
  `;
}

function defaultValues(exp) {
  return Object.fromEntries(exp.controls.map(control => [control.key, control.value]));
}

function selectExperiment(id) {
  const exp = experiments.find(item => item.id === id) || experiments[0];
  S.current = exp;
  S.values = defaultValues(exp);
  resetSimulation(false);
  renderExperimentTabs();
  renderControls();
  renderStaticText();
  draw();
}

function resetSimulation(showMessage = true) {
  S.t = 0;
  S.running = false;
  S.paused = false;
  S.done = false;
  S.lastTs = 0;
  S.trail = [];
  S.samples = [];
  S.activeHotspot = null;
  statusPill.textContent = "待开始";
  pauseBadge.classList.remove("active");
  confidencePill.textContent = "观察中";
  confidencePill.classList.add("subtle");
  if (showMessage) showToast("实验已重置。");
  setKnowledge(S.current.overview, "概览");
  draw();
  updateLiveStrip();
}

function play() {
  if (S.done) resetSimulation(false);
  S.running = true;
  S.paused = false;
  S.lastTs = 0;
  statusPill.textContent = "运行中";
  pauseBadge.classList.remove("active");
  requestAnimationFrame(loop);
}

function pause() {
  S.running = false;
  S.paused = true;
  S.lastTs = 0;
  statusPill.textContent = "已暂停";
  pauseBadge.classList.add("active");
  showToast("画面已定格：长按器材或轨迹可以查看解析。");
  draw();
}

function markDone() {
  S.done = true;
  S.running = false;
  S.paused = false;
  statusPill.textContent = "已完成";
  confidencePill.textContent = "结论可读";
  confidencePill.classList.remove("subtle");
}

function loop(ts) {
  if (!S.running) return;
  if (!S.lastTs) S.lastTs = ts;
  const dt = Math.min((ts - S.lastTs) / 1000, 1 / 30);
  S.lastTs = ts;
  updatePhysics(dt);
  draw();
  updateLiveStrip();
  if (S.running) requestAnimationFrame(loop);
}

function updatePhysics(dt) {
  const id = S.current.id;
  S.t += dt;
  if (id === "newton") updateNewton(dt);
  if (id === "projectile") updateProjectile(dt);
  if (id === "pendulum") updatePendulum(dt);
  if (id === "optics") updateOptics(dt);
  if (id === "induction") updateInduction(dt);
}

function updateNewton() {
  const a = S.values.force / S.values.mass;
  const x = 0.5 * a * S.t * S.t;
  const v = a * S.t;
  S.trail.push({ t: S.t, x: Math.min(x, 2.2), v });
  if (S.trail.length > 260) S.trail.shift();
  if (x >= 2.2 || S.t > 4.8) markDone();
}

function updateProjectile() {
  const h = S.values.height;
  const flight = Math.sqrt(2 * h / G);
  const x = S.values.speed * S.t;
  const y = 0.5 * G * S.t * S.t;
  S.trail.push({ t: S.t, x, y });
  if (S.trail.length > 260) S.trail.shift();
  if (S.t >= flight) {
    S.t = flight;
    markDone();
  }
}

function updatePendulum() {
  const period = TAU * Math.sqrt(S.values.length / G);
  if (S.t >= period * 3) markDone();
}

function updateOptics() {
  if (S.t >= 4.5) markDone();
}

function updateInduction() {
  if (S.t >= 5.8) markDone();
}

function renderExperimentTabs() {
  experimentList.innerHTML = experiments.map(exp => `
    <button class="experiment-tab ${exp.id === S.current.id ? "active" : ""}" type="button" data-exp="${exp.id}">
      <span class="tab-icon">${exp.icon}</span>
      <span>
        <span class="tab-title">${exp.title}</span>
        <span class="tab-meta">${exp.chapter}</span>
      </span>
    </button>
  `).join("");
}

function renderFutureList() {
  futureList.innerHTML = futureExperiments.map(([chapter, title]) => `
    <div class="future-item"><span>${title}</span><span>${chapter}</span></div>
  `).join("");
}

function renderControls() {
  controlsEl.innerHTML = S.current.controls.map(control => `
    <div class="control">
      <label for="control-${control.key}">
        <span>${control.label}</span>
        <output id="output-${control.key}">${formatControl(control, S.values[control.key])}</output>
      </label>
      <input
        id="control-${control.key}"
        type="range"
        min="${control.min}"
        max="${control.max}"
        step="${control.step}"
        value="${S.values[control.key]}"
        data-key="${control.key}">
    </div>
  `).join("");
}

function formatControl(control, value) {
  const decimals = String(control.step).includes(".") ? String(control.step).split(".")[1].length : 0;
  return `${Number(value).toFixed(decimals)} ${control.unit}`.trim();
}

function renderStaticText() {
  const exp = S.current;
  sceneTitle.textContent = exp.title;
  sceneChapter.textContent = exp.chapter;
  experimentTitle.textContent = exp.title;
  experimentChapter.textContent = exp.chapter;
  experimentMood.textContent = exp.mood;
  conclusionText.textContent = exp.conclusion;
  setKnowledge(exp.overview, "概览");
}

function updateControlOutputs() {
  S.current.controls.forEach(control => {
    const output = document.getElementById(`output-${control.key}`);
    const input = document.getElementById(`control-${control.key}`);
    if (output) output.textContent = formatControl(control, S.values[control.key]);
    if (input) input.value = S.values[control.key];
  });
}

function getLiveData() {
  const id = S.current.id;
  if (id === "newton") {
    const a = S.values.force / S.values.mass;
    const x = clamp(0.5 * a * S.t * S.t, 0, 2.2);
    const v = a * S.t;
    return [
      ["时间 t", `${fmt(S.t)} s`],
      ["位移 x", `${fmt(x)} m`],
      ["速度 v", `${fmt(v)} m/s`],
      ["加速度 a", `${fmt(a)} m/s²`]
    ];
  }
  if (id === "projectile") {
    const h = S.values.height;
    const t = clamp(S.t, 0, Math.sqrt(2 * h / G));
    const x = S.values.speed * t;
    const vy = G * t;
    return [
      ["飞行时间", `${fmt(t)} s`],
      ["水平位移", `${fmt(x)} m`],
      ["水平速度", `${fmt(S.values.speed)} m/s`],
      ["竖直速度", `${fmt(vy)} m/s`]
    ];
  }
  if (id === "pendulum") {
    const period = TAU * Math.sqrt(S.values.length / G);
    const theta = pendulumTheta();
    const gMeasured = 4 * Math.PI * Math.PI * S.values.length / (period * period);
    return [
      ["周期 T", `${fmt(period)} s`],
      ["摆角 θ", `${fmt(theta * 180 / Math.PI)} °`],
      ["摆长 L", `${fmt(S.values.length)} m`],
      ["反推 g", `${fmt(gMeasured)} m/s²`]
    ];
  }
  if (id === "optics") {
    const i = S.values.angle * Math.PI / 180;
    const r = Math.asin(Math.sin(i) / S.values.refractive);
    const spacing = S.values.wavelength * 1.2 / 0.24 / 1000;
    return [
      ["入射角 i", `${fmt(S.values.angle, 1)} °`],
      ["折射角 r", `${fmt(r * 180 / Math.PI, 1)} °`],
      ["折射率 n", `${fmt(S.values.refractive)} `],
      ["条纹间距", `${fmt(spacing, 2)} mm`]
    ];
  }
  const emf = inducedEmf();
  return [
    ["磁体速度", `${fmt(S.values.magnetSpeed)} m/s`],
    ["磁场强度", `${fmt(S.values.field)} T`],
    ["线圈匝数", `${fmt(S.values.turns, 0)} 匝`],
    ["感应电动势", `${fmt(emf)} V`]
  ];
}

function updateLiveStrip() {
  liveStrip.innerHTML = getLiveData().map(([label, value]) => `
    <div class="live-item"><span>${label}</span><strong>${value}</strong></div>
  `).join("");
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  S.cssW = Math.max(320, rect.width);
  S.cssH = Math.max(220, rect.height);
  S.dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(S.cssW * S.dpr);
  canvas.height = Math.round(S.cssH * S.dpr);
  ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
  draw();
}

function clearScene() {
  const W = S.cssW;
  const H = S.cssH;
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#bce8fa");
  grad.addColorStop(0.45, "#fff0d6");
  grad.addColorStop(1, "#dce8ee");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  drawWindowLight(W, H);
  drawDesk(W, H);
}

function drawWindowLight(W, H) {
  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = "rgba(255,255,255,.55)";
  ctx.beginPath();
  ctx.moveTo(W * 0.08, H * 0.02);
  ctx.lineTo(W * 0.76, H * 0.28);
  ctx.lineTo(W * 0.68, H * 0.42);
  ctx.lineTo(W * 0.02, H * 0.18);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = "rgba(255,255,255,.38)";
  for (let i = 0; i < 18; i++) {
    const x = (i * 97 + S.t * 18) % W;
    const y = (i * 53 + Math.sin(S.t + i) * 16) % (H * 0.62);
    ctx.beginPath();
    ctx.arc(x, y, 1.4, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDesk(W, H) {
  ctx.fillStyle = "rgba(166, 120, 78, .62)";
  ctx.fillRect(0, H * 0.76, W, H * 0.24);
  ctx.fillStyle = "rgba(255,255,255,.18)";
  ctx.fillRect(0, H * 0.76, W, 2);
}

function draw() {
  if (!ctx) return;
  clearScene();
  const id = S.current.id;
  if (id === "newton") drawNewton();
  if (id === "projectile") drawProjectile();
  if (id === "pendulum") drawPendulum();
  if (id === "optics") drawOptics();
  if (id === "induction") drawInduction();
}

function roundRect(x, y, w, h, r = 8) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawArrow(x1, y1, x2, y2, color = "#243240", width = 2) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - Math.cos(angle - .45) * 12, y2 - Math.sin(angle - .45) * 12);
  ctx.lineTo(x2 - Math.cos(angle + .45) * 12, y2 - Math.sin(angle + .45) * 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawLabel(text, x, y, color = "#243240") {
  ctx.save();
  ctx.font = "13px Microsoft YaHei, sans-serif";
  const metrics = ctx.measureText(text);
  roundRect(x - 8, y - 18, metrics.width + 16, 25, 6);
  ctx.fillStyle = "rgba(255,255,255,.78)";
  ctx.fill();
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawNewton() {
  const W = S.cssW, H = S.cssH;
  const left = W * 0.11, right = W * 0.76;
  const trackY = H * 0.61;
  const a = S.values.force / S.values.mass;
  const xWorld = clamp(0.5 * a * S.t * S.t, 0, 2.2);
  const cartX = map(xWorld, 0, 2.2, left, right);
  const cartW = 78, cartH = 44;

  ctx.strokeStyle = "#65717e";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(left - 40, trackY);
  ctx.lineTo(right + 66, trackY);
  ctx.stroke();

  ctx.fillStyle = "rgba(60,70,80,.16)";
  for (let x = left - 25; x <= right + 45; x += 30) {
    ctx.fillRect(x, trackY + 10, 16, 6);
  }

  S.trail.forEach((p, i) => {
    if (i % 9 !== 0) return;
    const px = map(Math.min(p.x, 2.2), 0, 2.2, left, right);
    ctx.fillStyle = `rgba(36,50,64,${0.18 + i / S.trail.length * .45})`;
    ctx.beginPath();
    ctx.arc(px, trackY + 28, 3, 0, TAU);
    ctx.fill();
  });

  ctx.fillStyle = "#e86f61";
  roundRect(cartX - cartW / 2, trackY - cartH - 4, cartW, cartH, 8);
  ctx.fill();
  ctx.strokeStyle = "#7d3e38";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#243240";
  for (const dx of [-24, 24]) {
    ctx.beginPath();
    ctx.arc(cartX + dx, trackY + 2, 11, 0, TAU);
    ctx.fill();
  }

  drawArrow(cartX + cartW / 2 + 8, trackY - 28, cartX + cartW / 2 + 78, trackY - 28, "#2f958e", 3);
  drawLabel(`F = ${fmt(S.values.force)} N`, cartX + cartW / 2 + 18, trackY - 42, "#236e69");
  drawLabel(`a = ${fmt(a)} m/s²`, left, H * 0.18, "#236e69");

  drawNewtonGraph(W * 0.70, H * 0.14, W * 0.22, H * 0.24, a);
  drawHotspotHints([
    { key: "cart", x: cartX, y: trackY - 38, text: "长按小车" },
    { key: "graph", x: W * 0.81, y: H * 0.23, text: "长按图像" }
  ]);
}

function drawNewtonGraph(x, y, w, h, a) {
  ctx.save();
  roundRect(x, y, w, h, 8);
  ctx.fillStyle = "rgba(255,255,255,.72)";
  ctx.fill();
  ctx.strokeStyle = "rgba(84,96,109,.25)";
  ctx.stroke();
  ctx.strokeStyle = "#536170";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 28, y + h - 28);
  ctx.lineTo(x + 28, y + 18);
  ctx.moveTo(x + 28, y + h - 28);
  ctx.lineTo(x + w - 18, y + h - 28);
  ctx.stroke();
  ctx.strokeStyle = "#2f958e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 28, y + h - 28);
  const endY = clamp(y + h - 28 - a * 16, y + 24, y + h - 34);
  ctx.lineTo(x + w - 24, endY);
  ctx.stroke();
  ctx.fillStyle = "#536170";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText("v-t", x + w - 46, y + 20);
  ctx.restore();
}

function drawProjectile() {
  const W = S.cssW, H = S.cssH;
  const ground = H * 0.76;
  const startX = W * 0.15;
  const h = S.values.height;
  const scale = (H * 0.48) / 4.2;
  const startY = ground - h * scale;
  const flight = Math.sqrt(2 * h / G);
  const t = clamp(S.t, 0, flight);
  const x = S.values.speed * t;
  const y = 0.5 * G * t * t;
  const px = startX + x * W * 0.075;
  const py = startY + y * scale;

  ctx.strokeStyle = "rgba(83,97,112,.35)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX, ground);
  ctx.lineTo(W * 0.88, ground);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "#e86f61";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const tt = flight * i / 80;
    const tx = startX + S.values.speed * tt * W * 0.075;
    const ty = startY + 0.5 * G * tt * tt * scale;
    if (i === 0) ctx.moveTo(tx, ty);
    else ctx.lineTo(tx, ty);
  }
  ctx.stroke();

  ctx.fillStyle = "#f5f1e8";
  roundRect(startX - 54, startY - 18, 54, 36, 8);
  ctx.fill();
  ctx.strokeStyle = "#7b8790";
  ctx.stroke();
  drawArrow(startX, startY, startX + 76, startY, "#2f958e", 3);
  drawArrow(px, py, px, py + 62, "#d6a744", 3);
  drawArrow(px, py, px + 58, py, "#427aa1", 3);

  ctx.fillStyle = "#e86f61";
  ctx.beginPath();
  ctx.arc(px, py, 14, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#7d3e38";
  ctx.lineWidth = 3;
  ctx.stroke();

  const targetX = startX + S.values.speed * flight * W * 0.075;
  drawLabel(`R = ${fmt(S.values.speed * flight)} m`, targetX - 42, ground - 14, "#7d3e38");
  drawLabel("vₓ 不变", startX + 56, startY - 16, "#236e69");
  drawLabel("vᵧ = gt", px + 18, py + 54, "#8a6826");
  drawHotspotHints([
    { key: "ball", x: px, y: py, text: "长按小球" },
    { key: "vector", x: px + 40, y: py + 28, text: "长按速度" },
    { key: "target", x: targetX, y: ground, text: "长按落点" }
  ]);
}

function pendulumTheta() {
  const theta0 = S.values.angle * Math.PI / 180;
  const omega = Math.sqrt(G / S.values.length);
  return theta0 * Math.cos(omega * S.t);
}

function drawPendulum() {
  const W = S.cssW, H = S.cssH;
  const pivotX = W * 0.50;
  const pivotY = H * 0.18;
  const lenPx = map(S.values.length, 0.3, 1.8, H * 0.22, H * 0.58);
  const theta = pendulumTheta();
  const bobX = pivotX + Math.sin(theta) * lenPx;
  const bobY = pivotY + Math.cos(theta) * lenPx;
  const period = TAU * Math.sqrt(S.values.length / G);

  ctx.strokeStyle = "rgba(83,97,112,.28)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, lenPx, Math.PI / 2 - S.values.angle * Math.PI / 180, Math.PI / 2 + S.values.angle * Math.PI / 180);
  ctx.stroke();

  ctx.strokeStyle = "#536170";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  ctx.fillStyle = "#d6a744";
  ctx.beginPath();
  ctx.arc(bobX, bobY, 21, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#735d2e";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#243240";
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 7, 0, TAU);
  ctx.fill();

  drawArrow(pivotX, pivotY + 36, pivotX, pivotY + 110, "#e86f61", 3);
  drawLabel("mg", pivotX + 10, pivotY + 86, "#7d3e38");
  drawLabel(`T = ${fmt(period)} s`, W * 0.10, H * 0.20, "#8a6826");
  if (S.values.angle > 18) drawLabel("角度偏大：小角度近似会变差", W * 0.10, H * 0.27, "#7d3e38");

  drawHotspotHints([
    { key: "bob", x: bobX, y: bobY, text: "长按摆球" },
    { key: "angle", x: pivotX + 74, y: pivotY + 36, text: "长按摆角" },
    { key: "timer", x: W * 0.18, y: H * 0.20, text: "长按周期" }
  ]);
}

function drawOptics() {
  const W = S.cssW, H = S.cssH;
  const cx = W * 0.42, cy = H * 0.44;
  const normalTop = H * 0.18, normalBottom = H * 0.72;
  const i = S.values.angle * Math.PI / 180;
  const r = Math.asin(Math.sin(i) / S.values.refractive);
  const lambdaColor = wavelengthToColor(S.values.wavelength);

  ctx.fillStyle = "rgba(255,255,255,.36)";
  ctx.fillRect(0, cy, W * 0.62, H * 0.32);
  ctx.fillStyle = "rgba(124,190,220,.22)";
  ctx.fillRect(W * 0.14, cy, W * 0.48, H * 0.30);
  ctx.strokeStyle = "#536170";
  ctx.lineWidth = 2;
  ctx.strokeRect(W * 0.14, cy, W * 0.48, H * 0.30);

  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "rgba(36,50,64,.42)";
  ctx.beginPath();
  ctx.moveTo(cx, normalTop);
  ctx.lineTo(cx, normalBottom);
  ctx.stroke();
  ctx.setLineDash([]);

  const inLen = W * 0.25;
  const outLen = W * 0.25;
  const ix = cx - Math.sin(i) * inLen;
  const iy = cy - Math.cos(i) * inLen;
  const rx = cx + Math.sin(r) * outLen;
  const ry = cy + Math.cos(r) * outLen;
  drawArrow(ix, iy, cx, cy, lambdaColor, 4);
  drawArrow(cx, cy, rx, ry, lambdaColor, 4);

  ctx.strokeStyle = "rgba(232,111,97,.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 62, -Math.PI / 2 - i, -Math.PI / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 48, Math.PI / 2 - r, Math.PI / 2);
  ctx.stroke();

  drawLabel(`i = ${fmt(S.values.angle, 1)}°`, cx - 95, cy - 58, "#7d3e38");
  drawLabel(`r = ${fmt(r * 180 / Math.PI, 1)}°`, cx + 18, cy + 68, "#236e69");
  drawLabel("法线", cx + 10, normalTop + 22, "#536170");

  drawFringes(W * 0.70, H * 0.18, W * 0.18, H * 0.58, lambdaColor);
  drawHotspotHints([
    { key: "ray", x: cx + 38, y: cy + 42, text: "长按光线" },
    { key: "normal", x: cx, y: cy - 86, text: "长按法线" },
    { key: "fringe", x: W * 0.80, y: H * 0.44, text: "长按条纹" }
  ]);
}

function drawFringes(x, y, w, h, color) {
  roundRect(x, y, w, h, 8);
  ctx.fillStyle = "rgba(35,40,54,.86)";
  ctx.fill();
  const spacing = map(S.values.wavelength, 420, 680, 18, 32);
  for (let yy = y + h / 2; yy < y + h - 10; yy += spacing) drawFringeLine(x, yy, w, color);
  for (let yy = y + h / 2 - spacing; yy > y + 10; yy -= spacing) drawFringeLine(x, yy, w, color);
  drawLabel("双缝干涉屏", x - 4, y - 10, "#243240");
}

function drawFringeLine(x, y, w, color) {
  const grad = ctx.createLinearGradient(x, y, x + w, y);
  grad.addColorStop(0, "rgba(255,255,255,0)");
  grad.addColorStop(.5, color);
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 14, y);
  ctx.lineTo(x + w - 14, y);
  ctx.stroke();
}

function wavelengthToColor(nm) {
  if (nm < 470) return "rgba(90,130,255,.92)";
  if (nm < 530) return "rgba(70,210,190,.92)";
  if (nm < 590) return "rgba(245,210,80,.92)";
  if (nm < 630) return "rgba(245,145,70,.92)";
  return "rgba(235,80,85,.92)";
}

function inducedEmf() {
  const speed = Math.abs(S.values.magnetSpeed);
  return 0.18 * S.values.turns * S.values.field * speed;
}

function drawInduction() {
  const W = S.cssW, H = S.cssH;
  const coilX = W * 0.58, coilY = H * 0.47;
  const speed = S.values.magnetSpeed;
  const phase = Math.sin(S.t * 1.4) * 0.5 + 0.5;
  const magnetBase = W * 0.25;
  const magnetX = magnetBase + speed * phase * W * 0.12;
  const magnetY = coilY;
  const emf = inducedEmf();
  const dir = speed >= 0 ? 1 : -1;

  drawFieldLines(magnetX, magnetY, coilX, coilY, dir);
  drawMagnet(magnetX, magnetY);
  drawCoil(coilX, coilY);
  drawGalvanometer(W * 0.75, H * 0.23, emf, dir);

  const arrowColor = speed >= 0 ? "#e86f61" : "#427aa1";
  drawArrow(magnetX + (speed >= 0 ? 58 : -58), magnetY + 82, magnetX + (speed >= 0 ? 112 : -112), magnetY + 82, arrowColor, 3);
  drawLabel(speed >= 0 ? "靠近线圈" : "远离线圈", magnetX - 40, magnetY + 118, arrowColor);
  drawLabel(`E ≈ ${fmt(emf)} V`, W * 0.10, H * 0.20, "#236e69");
  drawLabel(speed === 0 ? "磁通量不变，指针回零" : "磁通量正在变化", W * 0.10, H * 0.27, "#236e69");

  drawHotspotHints([
    { key: "magnet", x: magnetX, y: magnetY, text: "长按磁体" },
    { key: "coil", x: coilX, y: coilY, text: "长按线圈" },
    { key: "current", x: W * 0.75, y: H * 0.23, text: "长按电流" }
  ]);
}

function drawFieldLines(mx, my, cx, cy, dir) {
  ctx.save();
  ctx.strokeStyle = "rgba(66,122,161,.32)";
  ctx.lineWidth = 2;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(mx + 48, my + i * 18);
    ctx.bezierCurveTo(lerp(mx, cx, .35), my - 110 + i * 20, lerp(mx, cx, .72), cy + 110 - i * 20, cx - 60, cy + i * 14);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMagnet(x, y) {
  ctx.save();
  roundRect(x - 62, y - 34, 124, 68, 8);
  const grad = ctx.createLinearGradient(x - 62, y, x + 62, y);
  grad.addColorStop(0, "#e86f61");
  grad.addColorStop(.5, "#f6f1e8");
  grad.addColorStop(1, "#427aa1");
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = "rgba(36,50,64,.45)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 17px Microsoft YaHei";
  ctx.fillText("N", x - 42, y + 6);
  ctx.fillText("S", x + 32, y + 6);
  ctx.restore();
}

function drawCoil(x, y) {
  ctx.save();
  ctx.strokeStyle = "#d6a744";
  ctx.lineWidth = 4;
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    ctx.ellipse(x + i * 9 - 36, y, 18, 58, 0, 0, TAU);
    ctx.stroke();
  }
  ctx.strokeStyle = "#536170";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 54, y - 28);
  ctx.lineTo(x + 120, y - 80);
  ctx.lineTo(x + 180, y - 80);
  ctx.moveTo(x + 54, y + 28);
  ctx.lineTo(x + 120, y + 80);
  ctx.lineTo(x + 180, y + 80);
  ctx.stroke();
  ctx.restore();
}

function drawGalvanometer(x, y, emf, dir) {
  ctx.save();
  roundRect(x - 64, y - 52, 128, 104, 10);
  ctx.fillStyle = "rgba(255,255,255,.76)";
  ctx.fill();
  ctx.strokeStyle = "rgba(84,96,109,.28)";
  ctx.stroke();
  ctx.strokeStyle = "#536170";
  ctx.beginPath();
  ctx.arc(x, y + 14, 42, Math.PI, TAU);
  ctx.stroke();
  const needle = clamp(emf / 12, 0, 1) * dir;
  const angle = -Math.PI / 2 + needle * 0.85;
  drawArrow(x, y + 16, x + Math.cos(angle) * 38, y + 16 + Math.sin(angle) * 38, "#e86f61", 3);
  ctx.fillStyle = "#536170";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText("G", x - 5, y + 42);
  ctx.restore();
}

function drawHotspotHints(items) {
  ctx.save();
  ctx.font = "12px Microsoft YaHei";
  items.forEach(item => {
    const pulse = 0.5 + Math.sin(S.t * 3) * 0.18;
    ctx.fillStyle = `rgba(255,255,255,${0.62 + pulse * .2})`;
    ctx.beginPath();
    ctx.arc(item.x, item.y, 19, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = `rgba(47,149,142,${0.32 + pulse * .28})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "rgba(36,50,64,.62)";
    ctx.fillText(item.text, item.x + 22, item.y + 4);
  });
  ctx.restore();
}

function getHotspotAt(x, y) {
  const W = S.cssW, H = S.cssH;
  const id = S.current.id;
  const spots = [];
  if (id === "newton") {
    const a = S.values.force / S.values.mass;
    const xWorld = clamp(0.5 * a * S.t * S.t, 0, 2.2);
    const cartX = map(xWorld, 0, 2.2, W * 0.11, W * 0.76);
    spots.push(["cart", cartX, H * 0.61 - 38, 80], ["graph", W * 0.81, H * 0.23, 86], ["force", cartX + 95, H * 0.61 - 30, 72]);
  }
  if (id === "projectile") {
    const ground = H * 0.76;
    const startX = W * 0.15;
    const scale = (H * 0.48) / 4.2;
    const h = S.values.height;
    const startY = ground - h * scale;
    const flight = Math.sqrt(2 * h / G);
    const t = clamp(S.t, 0, flight);
    const px = startX + S.values.speed * t * W * 0.075;
    const py = startY + 0.5 * G * t * t * scale;
    const targetX = startX + S.values.speed * flight * W * 0.075;
    spots.push(["ball", px, py, 62], ["vector", px + 42, py + 28, 70], ["target", targetX, ground, 70]);
  }
  if (id === "pendulum") {
    const pivotX = W * 0.50;
    const pivotY = H * 0.18;
    const lenPx = map(S.values.length, 0.3, 1.8, H * 0.22, H * 0.58);
    const theta = pendulumTheta();
    spots.push(["bob", pivotX + Math.sin(theta) * lenPx, pivotY + Math.cos(theta) * lenPx, 72], ["angle", pivotX + 74, pivotY + 36, 80], ["timer", W * 0.18, H * 0.20, 92]);
  }
  if (id === "optics") {
    spots.push(["ray", W * 0.46, H * 0.50, 90], ["normal", W * 0.42, H * 0.31, 78], ["fringe", W * 0.80, H * 0.44, 92]);
  }
  if (id === "induction") {
    const coilY = H * 0.47;
    const phase = Math.sin(S.t * 1.4) * 0.5 + 0.5;
    const magnetX = W * 0.25 + S.values.magnetSpeed * phase * W * 0.12;
    spots.push(["magnet", magnetX, coilY, 92], ["coil", W * 0.58, coilY, 96], ["current", W * 0.75, H * 0.23, 90]);
  }
  return spots.find(([key, sx, sy, r]) => Math.hypot(x - sx, y - sy) <= r)?.[0] || null;
}

function canvasPoint(evt) {
  const rect = canvas.getBoundingClientRect();
  const source = evt.touches ? evt.touches[0] : evt;
  return {
    x: (source.clientX - rect.left) * (S.cssW / rect.width),
    y: (source.clientY - rect.top) * (S.cssH / rect.height)
  };
}

function beginPointer(evt) {
  const p = canvasPoint(evt);
  const hot = getHotspotAt(p.x, p.y);
  if (hot) {
    clearTimeout(S.longPressTimer);
    S.longPressTimer = setTimeout(() => {
      const card = S.current.cards[hot];
      if (card) {
        setKnowledge(card, card.label);
        showToast(`已打开：${card.label}`);
      }
    }, 450);
  }
  S.dragTarget = inferDragTarget(p.x, p.y);
  canvas.classList.toggle("dragging", Boolean(S.dragTarget));
}

function movePointer(evt) {
  if (!S.dragTarget) return;
  const p = canvasPoint(evt);
  applyDrag(S.dragTarget, p.x, p.y);
  updateControlOutputs();
  resetSoft();
  draw();
  updateLiveStrip();
}

function endPointer() {
  clearTimeout(S.longPressTimer);
  S.longPressTimer = null;
  S.dragTarget = null;
  canvas.classList.remove("dragging");
}

function inferDragTarget(x, y) {
  const id = S.current.id;
  if (id === "newton") return "force";
  if (id === "projectile") return y < S.cssH * 0.55 ? "speed" : "height";
  if (id === "pendulum") return x > S.cssW * 0.5 ? "angle" : "length";
  if (id === "optics") return x < S.cssW * 0.55 ? "angle" : "wavelength";
  if (id === "induction") return x < S.cssW * 0.5 ? "magnetSpeed" : "field";
  return null;
}

function applyDrag(key, x, y) {
  const control = S.current.controls.find(item => item.key === key);
  if (!control) return;
  let ratio = clamp(x / S.cssW, 0, 1);
  if (key === "height" || key === "length" || key === "field") ratio = clamp(1 - y / S.cssH, 0, 1);
  if (key === "angle") ratio = clamp(x / S.cssW, 0, 1);
  let value = control.min + ratio * (control.max - control.min);
  value = Math.round(value / control.step) * control.step;
  S.values[key] = clamp(value, control.min, control.max);
}

function resetSoft() {
  S.t = 0;
  S.trail = [];
  S.samples = [];
  S.done = false;
  confidencePill.textContent = "观察中";
  confidencePill.classList.add("subtle");
  if (!S.running) statusPill.textContent = "已调整";
}

function bindEvents() {
  openBookBtn.addEventListener("click", () => {
    intro.classList.add("hidden");
    labApp.classList.add("active");
    setTimeout(resizeCanvas, 80);
    showToast("书页已打开。拖动参数，暂停后长按器材查看解析。");
  });

  resetAllBtn.addEventListener("click", () => {
    labApp.classList.remove("active");
    intro.classList.remove("hidden");
    resetSimulation(false);
  });

  toggleShelfBtn.addEventListener("click", () => {
    shelf.classList.toggle("open");
  });

  experimentList.addEventListener("click", event => {
    const btn = event.target.closest("[data-exp]");
    if (!btn) return;
    selectExperiment(btn.dataset.exp);
  });

  controlsEl.addEventListener("input", event => {
    const input = event.target.closest("input[type='range']");
    if (!input) return;
    S.values[input.dataset.key] = Number(input.value);
    updateControlOutputs();
    resetSoft();
    draw();
    updateLiveStrip();
  });

  playBtn.addEventListener("click", play);
  pauseBtn.addEventListener("click", pause);
  resetBtn.addEventListener("click", () => resetSimulation(true));

  canvas.addEventListener("mousedown", beginPointer);
  canvas.addEventListener("mousemove", movePointer);
  window.addEventListener("mouseup", endPointer);
  canvas.addEventListener("touchstart", event => { beginPointer(event); }, { passive: true });
  canvas.addEventListener("touchmove", event => { movePointer(event); }, { passive: true });
  window.addEventListener("touchend", endPointer);

  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("keydown", event => {
    if (event.key === " ") {
      event.preventDefault();
      if (labApp.classList.contains("active")) S.running ? pause() : play();
      else openBookBtn.click();
    }
    if (event.key.toLowerCase() === "r" && labApp.classList.contains("active")) resetSimulation(true);
  });
}

function init() {
  S.values = defaultValues(S.current);
  renderExperimentTabs();
  renderFutureList();
  renderControls();
  renderStaticText();
  updateLiveStrip();
  bindEvents();
  requestAnimationFrame(resizeCanvas);
}

init();
