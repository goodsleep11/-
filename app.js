const canvas = document.getElementById("sceneCanvas");
const ctx = canvas.getContext("2d");
const canvasWrap = canvas.closest(".canvas-wrap");

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
const idealModeBtn = document.getElementById("idealModeBtn");
const realModeBtn = document.getElementById("realModeBtn");
const errorToggleBtn = document.getElementById("errorToggleBtn");
const errorPanel = document.getElementById("errorPanel");
const errorTag = document.getElementById("errorTag");
const errorCard = document.getElementById("errorCard");
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
  },
  {
    id: "spring",
    icon: "k",
    chapter: "力学",
    title: "探究弹簧弹力与伸长量的关系",
    mood: "把砝码轻轻挂上去，弹簧用等距刻度写出胡克定律。",
    accent: "#d6a744",
    controls: [
      { key: "springK", label: "弹簧劲度系数 k", min: 12, max: 60, step: 1, value: 28, unit: "N/m" },
      { key: "loadMass", label: "悬挂质量 m", min: 0.05, max: 0.35, step: 0.01, value: 0.16, unit: "kg" },
      { key: "naturalLength", label: "原长 L₀", min: 8, max: 18, step: 0.5, value: 12, unit: "cm" }
    ],
    overview: {
      title: "逐步增加砝码，读出弹簧伸长量",
      body: "在弹性限度内，弹簧受到的拉力与伸长量成正比。挂上砝码静止后，弹力大小等于砝码重力。",
      formula: "F = kx,  mg = kx"
    },
    conclusion: "在弹性限度内，弹簧弹力 F 与伸长量 x 成正比，F-x 图像是一条过原点的直线，斜率就是劲度系数 k。",
    cards: {
      spring: {
        label: "弹簧",
        title: "弹簧为什么越拉越用力？",
        body: "弹簧形变量越大，内部恢复形变的弹力越大。在弹性限度内，这个比例关系稳定成立。",
        formula: "F = kx"
      },
      load: {
        label: "砝码",
        title: "静止时弹力等于重力",
        body: "砝码静止时合力为零，弹簧向上的拉力大小等于砝码受到的重力 mg。",
        formula: "F = mg"
      },
      graph: {
        label: "F-x 图像",
        title: "斜率就是 k",
        body: "把每组伸长量和弹力画到坐标系中，近似直线的斜率越大，说明弹簧越硬。",
        formula: "k = ΔF / Δx"
      }
    }
  },
  {
    id: "energy",
    icon: "E",
    chapter: "力学",
    title: "验证机械能守恒定律",
    mood: "小球从高处滑下，势能在轨道上变成速度的光。",
    accent: "#e86f61",
    controls: [
      { key: "height", label: "释放高度 h", min: 0.40, max: 2.80, step: 0.05, value: 1.60, unit: "m" },
      { key: "mass", label: "小球质量 m", min: 0.10, max: 0.60, step: 0.01, value: 0.25, unit: "kg" },
      { key: "loss", label: "能量损耗", min: 0, max: 12, step: 1, value: 2, unit: "%" }
    ],
    overview: {
      title: "让小球沿光滑轨道下滑",
      body: "理想情况下只有重力做功，小球的重力势能减少量等于动能增加量。若有摩擦或空气阻力，机械能会略有损失。",
      formula: "mgh = 1/2 mv²"
    },
    conclusion: "忽略阻力时，重力势能和动能相互转化，机械能总量保持不变。质量会改变能量数值，但不改变同一高度下的速度。",
    cards: {
      ball: {
        label: "小球",
        title: "速度来自势能的转化",
        body: "高度降低时重力做正功，减少的重力势能转化为小球动能，所以速度越来越大。",
        formula: "ΔEp = ΔEk"
      },
      energy: {
        label: "能量柱",
        title: "总机械能看起来应当不变",
        body: "没有非保守力做功时，Ep + Ek 保持不变；加入损耗后，总机械能会缓慢下降。",
        formula: "E = Ep + Ek"
      },
      loss: {
        label: "损耗",
        title: "真实实验里误差来自哪里？",
        body: "轨道摩擦、空气阻力和测速误差都会让末速度比理想值略小。",
        formula: "1/2 mv² < mgh"
      }
    }
  },
  {
    id: "resistance",
    icon: "Ω",
    chapter: "电学",
    title: "伏安法测电阻",
    mood: "电压表和电流表像两只小眼睛，一起读出未知电阻。",
    accent: "#2f958e",
    controls: [
      { key: "voltage", label: "电源电压 U", min: 0.5, max: 6.0, step: 0.1, value: 3.0, unit: "V" },
      { key: "resistance", label: "待测电阻 R", min: 4, max: 30, step: 0.5, value: 12, unit: "Ω" },
      { key: "rheostat", label: "滑动变阻器", min: 0, max: 20, step: 0.5, value: 6, unit: "Ω" }
    ],
    overview: {
      title: "调节滑动变阻器，读取 U 和 I",
      body: "电压表并联在待测电阻两端，电流表串联在电路中。多次改变电压和电流，利用 R = U/I 求平均值。",
      formula: "R = U / I"
    },
    conclusion: "温度基本不变时，金属导体两端电压与电流成正比，U-I 图像近似为过原点直线，斜率表示电阻。",
    cards: {
      resistor: {
        label: "待测电阻",
        title: "电阻表示阻碍电流的本领",
        body: "同一电压下，电阻越大，电流越小。伏安法通过同时测 U 和 I 来反推出 R。",
        formula: "R = U/I"
      },
      meters: {
        label: "电表",
        title: "电压表并联，电流表串联",
        body: "电压表测两端电势差，要并联；电流表测流过元件的电流，要串联。",
        formula: "I = U / R"
      },
      graph: {
        label: "U-I 图像",
        title: "图像斜率给出电阻",
        body: "把多组电压、电流画成图像，直线越陡，表示相同电流需要更高电压，电阻越大。",
        formula: "R = ΔU / ΔI"
      },
      rheostat: {
        label: "滑动变阻器",
        title: "滑片用来保护和调节电路",
        body: "滑动变阻器串联在电路中。接入电阻越大，总电流越小；逐步调节滑片可以得到多组 U、I 数据。",
        formula: "I = U / (R + R滑)"
      }
    }
  },
  {
    id: "force",
    icon: "Σ",
    chapter: "力学",
    title: "探究互成角度两个力的合成",
    mood: "两个弹簧测力计轻轻拉住圆环，平行四边形把合力画出来。",
    accent: "#6f6aa8",
    controls: [
      { key: "forceA", label: "分力 F₁", min: 1.0, max: 8.0, step: 0.1, value: 4.0, unit: "N" },
      { key: "forceB", label: "分力 F₂", min: 1.0, max: 8.0, step: 0.1, value: 3.2, unit: "N" },
      { key: "forceAngle", label: "夹角 θ", min: 20, max: 160, step: 1, value: 72, unit: "°" }
    ],
    overview: {
      title: "保持圆环静止，画出两条分力",
      body: "两只弹簧测力计同时拉圆环。把两个分力按方向和大小作图，平行四边形的对角线就是等效合力。",
      formula: "F = √(F₁² + F₂² + 2F₁F₂cosθ)"
    },
    conclusion: "两个互成角度的力可以用平行四边形定则求合力。夹角越大，合力通常越小；当方向相同时合力最大，方向相反时合力最小。",
    cards: {
      vectorA: {
        label: "分力 F₁",
        title: "力是有方向的量",
        body: "合成力时不能只把数字相加，还要把方向一起带入。箭头长度表示大小，箭头方向表示力的方向。",
        formula: "力：矢量"
      },
      vectorB: {
        label: "分力 F₂",
        title: "夹角会改变合力大小",
        body: "两力夹角变大时，两个力在同一方向上的贡献减少，所以合力不再等于简单相加。",
        formula: "F² = F₁² + F₂² + 2F₁F₂cosθ"
      },
      resultant: {
        label: "合力",
        title: "对角线表示等效作用",
        body: "合力对物体产生的效果，与两个分力共同作用的效果相同。实验中常用一个力替代两个力来验证。",
        formula: "F合 = F₁ + F₂（矢量和）"
      },
      angle: {
        label: "夹角",
        title: "角度越大，合力越不容易变大",
        body: "当 F₁、F₂ 大小不变时，cosθ 随 θ 增大而减小，合力也随之减小。",
        formula: "cosθ 决定交叉项"
      }
    }
  },
  {
    id: "gas",
    icon: "pV",
    chapter: "热学",
    title: "探究气体等温变化规律",
    mood: "活塞慢慢压下，气体把 pV = 常量写在透明针筒里。",
    accent: "#e86f61",
    controls: [
      { key: "gasVolume", label: "气体体积 V", min: 20, max: 80, step: 1, value: 50, unit: "mL" },
      { key: "gasTemp", label: "温度 T", min: 280, max: 330, step: 1, value: 300, unit: "K" },
      { key: "gasAmount", label: "气体物质的量", min: 0.7, max: 1.3, step: 0.01, value: 1.0, unit: "份" }
    ],
    overview: {
      title: "缓慢移动活塞，尽量保持温度不变",
      body: "一定质量气体在温度不变时，压强与体积成反比。真实实验要缓慢操作，让气体有时间和外界交换热量。",
      formula: "pV = 常量"
    },
    conclusion: "一定质量气体在温度不变时，p 与 V 成反比，p-V 图像是双曲线，p-1/V 图像近似为过原点直线。",
    cards: {
      piston: {
        label: "活塞",
        title: "体积变小，碰撞更频繁",
        body: "温度不变时分子平均动能不变。体积减小后，单位时间撞到器壁的次数增加，压强升高。",
        formula: "p ∝ 1/V"
      },
      gauge: {
        label: "压强计",
        title: "压强和体积反向变化",
        body: "读数应满足 pV 近似不变。若温度明显升高或漏气，乘积会偏离常量。",
        formula: "p₁V₁ = p₂V₂"
      },
      graph: {
        label: "p-V 图像",
        title: "双曲线来自反比例",
        body: "横轴体积增大时，纵轴压强减小。把横轴换成 1/V，图像会更接近直线。",
        formula: "p = C / V"
      }
    }
  },
  {
    id: "resistivity",
    icon: "ρ",
    chapter: "电学",
    title: "测量金属丝电阻率",
    mood: "把细金属丝拉直，长度、直径和伏安读数共同给出材料的性格。",
    accent: "#d6a744",
    controls: [
      { key: "wireLength", label: "金属丝长度 L", min: 0.20, max: 1.20, step: 0.01, value: 0.60, unit: "m" },
      { key: "wireDiameter", label: "金属丝直径 d", min: 0.20, max: 0.80, step: 0.01, value: 0.40, unit: "mm" },
      { key: "wireVoltage", label: "两端电压 U", min: 0.5, max: 4.0, step: 0.1, value: 2.0, unit: "V" }
    ],
    overview: {
      title: "测出长度、直径、电压和电流",
      body: "先用伏安法测金属丝电阻，再用螺旋测微器测直径，算横截面积。电阻率是材料本身的重要属性。",
      formula: "ρ = RS / L,  S = πd²/4"
    },
    conclusion: "同种材料温度一定时，电阻 R 与长度 L 成正比，与横截面积 S 成反比。由 ρ = RS/L 可求金属丝电阻率。",
    cards: {
      wire: {
        label: "金属丝",
        title: "长度越长，电阻越大",
        body: "电子通过更长的导体时受到更多阻碍，因此同种材料、同一截面积下 R 与 L 成正比。",
        formula: "R ∝ L"
      },
      micrometer: {
        label: "螺旋测微器",
        title: "直径误差会被平方放大",
        body: "横截面积由 d² 决定，直径读数稍有偏差，会对电阻率结果产生更明显影响。",
        formula: "S = πd²/4"
      },
      meters: {
        label: "伏安读数",
        title: "先由 U/I 得到电阻",
        body: "电压表测金属丝两端电压，电流表测通过金属丝的电流，温度变化要尽量小。",
        formula: "R = U/I"
      },
      formula: {
        label: "电阻率",
        title: "把形状影响剥离出来",
        body: "电阻率描述材料导电性能。把长度和横截面积的影响扣除后，才能比较不同材料。",
        formula: "ρ = RS/L"
      }
    }
  },
  {
    id: "lens",
    icon: "f",
    chapter: "光学",
    title: "测定凸透镜焦距",
    mood: "烛焰、透镜和光屏在一条光轨上移动，清晰像像一小片晨光落在屏上。",
    accent: "#427aa1",
    controls: [
      { key: "objectDistance", label: "物距 u", min: 18, max: 80, step: 1, value: 36, unit: "cm" },
      { key: "focalLength", label: "透镜焦距 f", min: 8, max: 22, step: 0.5, value: 12, unit: "cm" },
      { key: "screenOffset", label: "光屏偏离", min: -18, max: 18, step: 1, value: 0, unit: "cm" }
    ],
    overview: {
      title: "移动光屏，找到最清晰的倒立实像",
      body: "当物距大于焦距时，凸透镜能在另一侧形成实像。调节光屏到像距位置，用透镜成像公式求焦距。",
      formula: "1/f = 1/u + 1/v"
    },
    conclusion: "凸透镜成实像时，物距 u、像距 v 和焦距 f 满足 1/f = 1/u + 1/v。光屏离像距越远，像越模糊。",
    cards: {
      candle: {
        label: "烛焰",
        title: "物体必须在焦点之外才能接到实像",
        body: "当 u > f 时，凸透镜另一侧可形成倒立实像；当 u ≤ f 时，光屏上无法接到实像。",
        formula: "u > f"
      },
      lens: {
        label: "凸透镜",
        title: "透镜把光线会聚",
        body: "平行主光轴的光线通过凸透镜后会经过焦点，过光心的光线传播方向近似不变。",
        formula: "会聚透镜"
      },
      screen: {
        label: "光屏",
        title: "清晰像只在像距附近出现",
        body: "光屏位置等于像距 v 时，来自同一点的光线重新会聚，屏上像最清晰。",
        formula: "v = uf/(u-f)"
      },
      graph: {
        label: "成像公式",
        title: "用 u 和 v 反推 f",
        body: "测出多组物距和像距，代入公式或作图，可以减小偶然误差。",
        formula: "f = uv/(u+v)"
      }
    }
  }
];

const futureExperiments = [
  ["力学", "探究向心力大小的影响因素"],
  ["电学", "测定电源电动势和内阻"],
  ["电磁学", "探究通电导线在磁场中受力"],
  ["光学", "用双缝干涉测波长"],
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
  dragMode: null,
  dragStart: null,
  hoverHotspot: null,
  mode: "ideal",
  errorPanelOpen: false,
  lastKnowledgeHotspot: null,
  pointer: { x: 0.5, y: 0.5 },
  view: { yaw: 0, pitch: 0 },
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

function smoothstep(value) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function fmt(value, digits = 2) {
  if (Math.abs(value) >= 100) return value.toFixed(0);
  if (Math.abs(value) >= 10) return value.toFixed(1);
  return value.toFixed(digits);
}

const STEP_GUIDES = {
  cart: ["释放小车前先确认轨道水平，拖动车身或拉力箭头可以改变合外力。", "看小车位置、纸带点距和 a 的实时读数是否同步变大。", "现实中轨道摩擦和纸带阻力会让测得加速度偏小。"],
  force: ["改变拉力大小时，只保留一个变量明显变化。", "F/M 的比值决定加速度，不能只看 F 的数字。", "滑轮摩擦、细线质量和轨道未调平都会带来系统偏差。"],
  graph: ["把多组数据落到图像上，先看趋势再读斜率。", "直线斜率通常就是本实验要找的物理量。", "描点过少、坐标比例不合适会放大读图误差。"],
  ball: ["拖动小球或释放点，相当于改变初始状态。", "注意分解后的速度、能量或轨迹是否仍满足公式。", "空气阻力和碰撞损耗会让实际轨迹短一些、速度小一些。"],
  vector: ["先把矢量分解到互相垂直的方向，再分别分析。", "水平分量和竖直分量常常遵循不同规律。", "箭头长度只是比例尺，读数时要回到公式。"],
  target: ["落点用于反推飞行时间和水平位移。", "高度决定落地时间，水平速度决定同一时间内飞多远。", "空气阻力会让真实落点比理想值更近。"],
  bob: ["摆球释放时不要推，只让它自然通过最低点。", "小角度时周期主要由摆长决定。", "角度偏大、支点摩擦和按表反应都会影响周期。"],
  timer: ["多测几次完整振动的总时间，再求平均周期。", "T² 与 L 的线性关系比单次读数更可靠。", "人工计时反应通常让周期读数偏大或波动。"],
  ray: ["先找法线，再量入射角和折射角。", "角度必须相对法线读，不是相对界面读。", "光斑宽度、半圆玻璃位置和量角器读数会造成偏差。"],
  normal: ["法线是所有角度测量的基准。", "折射率越大，折射光线越靠近法线。", "法线画偏会让整组角度系统性偏大或偏小。"],
  fringe: ["观察相邻明纹中心的间距，而不是只看一条纹。", "波长越大，条纹间距越大。", "屏幕距离、缝间距和条纹中心判断都会影响结果。"],
  magnet: ["磁体靠近或远离线圈时才会产生明显感应。", "速度越大，磁通量变化越快，指针偏转越大。", "磁体没有沿轴线运动会让磁通量变化不稳定。"],
  coil: ["改变线圈匝数会放大或缩小感应电动势。", "匝数越多，同样磁通变化产生的总电动势越大。", "线圈电阻和接触不良会削弱电流读数。"],
  current: ["先判断磁通量增加还是减少，再判断感应电流方向。", "楞次定律的关键词是阻碍变化。", "电表零点偏移会让小电流方向判断变困难。"],
  spring: ["读伸长量时用末长度减原长，不能直接读总长度。", "F-x 图像过原点且近似直线时，才说明在弹性限度内。", "弹簧自重、刻度估读和超出弹性限度会带来偏差。"],
  load: ["逐个增加砝码，等静止后再读数。", "静止时弹簧拉力大小等于砝码重力。", "砝码摆动或读数未稳定会让伸长量偏大。"],
  energy: ["把势能、动能和损耗同时看，判断能量去了哪里。", "理想光滑轨道上 Ep+Ek 应保持不变。", "摩擦和空气阻力会把机械能转化为内能。"],
  loss: ["拖动损耗相当于加入真实阻力。", "损耗越大，末速度越低，动能越小。", "现实损耗通常和速度、接触面状态有关，不是固定常数。"],
  resistor: ["先连好电路，再逐步改变电压电流。", "同一电阻的 U-I 图像越陡，电阻越大。", "温度升高会让金属电阻发生变化。"],
  meters: ["电流表串联，电压表并联。", "读数要和量程匹配，指针在中间区域更可靠。", "仪表内阻、零点和估读都会进入误差。"],
  rheostat: ["滑动变阻器先接入较大阻值，再逐步调节。", "它既保护电路，也提供多组 U-I 数据。", "滑片接触不良会让电流读数跳动。"],
  vectorA: ["先固定圆环，再读第一只弹簧测力计。", "分力大小由箭头长度表示，方向由箭头指向表示。", "测力计没有沿绳方向拉会造成方向误差。"],
  vectorB: ["第二个分力与第一个分力共同决定合力。", "夹角越大，合力通常越小。", "两个测力计读数不同步会让平行四边形不闭合。"],
  resultant: ["平行四边形对角线表示两个力的等效合力。", "合力不是普通加法，而是矢量和。", "作图比例尺和角度读数是主要误差来源。"],
  piston: ["缓慢移动活塞，让气体尽量保持等温。", "体积变小，压强升高，pV 应近似不变。", "快速压缩会升温，漏气会让 pV 偏离常量。"],
  gauge: ["压强计读数要等气体状态稳定后再记录。", "温度一定时，p 与 V 成反比。", "压强计零点偏移会带来系统误差。"],
  wire: ["金属丝要拉直，并准确量出参与导电的长度。", "长度越大，电阻越大。", "接线柱间的有效长度读错会直接影响电阻率。"],
  micrometer: ["用螺旋测微器多处测直径再取平均。", "直径进入 S=πd²/4，误差会被平方放大。", "零点误差和用力过大会让直径读数偏小。"],
  formula: ["把测得的 R、S、L 代入公式，比较材料属性。", "电阻率应尽量与导线形状无关。", "温度升高会改变金属材料的电阻率。"],
  candle: ["移动烛焰相当于改变物距 u。", "u>f 时光屏上才能接到倒立实像。", "烛焰不在主光轴上会让像偏移或变形。"],
  lens: ["透镜位置确定后，再分别调物距和像距。", "凸透镜把平行主轴的光线会聚到焦点。", "透镜焦距标称值和实际值可能略有差别。"],
  screen: ["左右移动光屏，找到最清晰的像。", "屏距等于像距 v 时，像最清楚。", "判断清晰位置带有主观性，是成像实验的重要误差。"]
};

const ERROR_GUIDES = {
  newton: {
    title: "牛顿第二定律的误差",
    real: "现实模式会加入轨道摩擦、纸带阻力和读数滞后，所以测得 a 往往略小于 F/M。",
    formula: "a测 ≈ (F - f) / M",
    sources: ["轨道没有完全调平", "纸带与打点计时器有阻力", "小车释放瞬间有轻微扰动"],
    reduce: ["先平衡摩擦力", "多次改变 F 或 M 作图取斜率", "释放时只松手不推车"]
  },
  projectile: {
    title: "平抛实验的误差",
    real: "现实模式会让空气阻力和落点读数参与进来，射程会比理想模型略短。",
    formula: "R测 < v₀√(2h/g)",
    sources: ["空气阻力削弱水平速度", "释放口高度读数不准", "落点中心判断有偏差"],
    reduce: ["多次描点取平均轨迹", "让初速度方向保持水平", "用铅垂线校准高度"]
  },
  pendulum: {
    title: "单摆测 g 的误差",
    real: "现实模式会加入支点摩擦、有限振幅和人工计时反应，周期常略偏大，反推 g 偏小。",
    formula: "g测 = 4π²L / T测²",
    sources: ["摆角过大", "摆长没有量到球心", "人工按表反应时间"],
    reduce: ["控制小角度", "测 20 到 30 次全振动总时间", "多次测量取平均"]
  },
  optics: {
    title: "光路实验的误差",
    real: "现实模式会加入光斑宽度、法线绘制和角度估读误差。",
    formula: "n测 = sin i / sin r",
    sources: ["法线画偏", "光线有宽度", "量角器中心未对准入射点"],
    reduce: ["先校准法线", "用细光束", "多组角度取平均"]
  },
  induction: {
    title: "电磁感应的误差",
    real: "现实模式下线圈电阻、磁体运动不沿轴线和电表阻尼会削弱指针偏转。",
    formula: "E测 < N|ΔΦ/Δt|",
    sources: ["磁体速度不均匀", "线圈接触电阻", "电表零点偏移"],
    reduce: ["沿线圈轴线运动磁体", "检查接线", "先校零再读数"]
  },
  spring: {
    title: "胡克定律实验的误差",
    real: "现实模式会加入刻度估读、弹簧自重和砝码摆动，让 F-x 图像不再完美过原点。",
    formula: "F = kx + b",
    sources: ["零刻度未对齐", "弹簧自重", "砝码未完全静止"],
    reduce: ["读数前等弹簧稳定", "从同一视线读刻度", "用多组数据拟合直线"]
  },
  energy: {
    title: "机械能守恒的误差",
    real: "现实模式会把摩擦、空气阻力和测速误差加入进来，总机械能会轻微下降。",
    formula: "Ep减少 = Ek增加 + E损",
    sources: ["轨道摩擦", "空气阻力", "速度测量点不准"],
    reduce: ["减小接触摩擦", "多点测速", "比较能量差而不是只看瞬时值"]
  },
  resistance: {
    title: "伏安法的误差",
    real: "现实模式会加入电表内阻、温升和读数估计，测得 R 与真实值略有差异。",
    formula: "R测 = U测 / I测",
    sources: ["电压表分流或电流表分压", "电阻发热", "滑片接触不稳"],
    reduce: ["选择合适量程", "快速读数避免升温", "多组 U-I 作图求斜率"]
  },
  force: {
    title: "力的合成误差",
    real: "现实模式会加入弹簧测力计估读、夹角读数和作图比例尺误差。",
    formula: "F合² = F₁² + F₂² + 2F₁F₂cosθ",
    sources: ["测力计未沿绳方向", "角度尺读数偏差", "平行四边形作图比例不准"],
    reduce: ["让圆环回到同一位置", "统一比例尺", "多次作图比较合力"]
  },
  gas: {
    title: "气体等温变化误差",
    real: "现实模式会加入漏气、快速压缩升温和压强计零点误差，pV 会轻微漂移。",
    formula: "pV ≈ 常量（等温、定量）",
    sources: ["压缩太快导致温度上升", "针筒密封不严", "压强计零点偏移"],
    reduce: ["缓慢推动活塞", "保持温度稳定", "检查密封并校零"]
  },
  resistivity: {
    title: "电阻率测量误差",
    real: "现实模式会突出直径读数的影响，因为 d 的误差会通过面积平方放大。",
    formula: "ρ测 = R测πd测² / 4L测",
    sources: ["螺旋测微器零点误差", "金属丝发热", "有效长度读错"],
    reduce: ["多处测直径取平均", "小电流快速读数", "明确接线柱间有效长度"]
  },
  lens: {
    title: "凸透镜焦距误差",
    real: "现实模式会加入光屏清晰位置判断和刻度读数误差，像距不再完美等于理论值。",
    formula: "1/f测 = 1/u测 + 1/v测",
    sources: ["最清晰位置判断主观", "烛焰和透镜未共轴", "刻度起点读数不准"],
    reduce: ["左右移动光屏找最清晰区间中点", "保持三者共轴", "多组 u、v 反推 f"]
  }
};

function stableNoise(key) {
  let hash = 0;
  const text = `${S.current.id}:${key}`;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) % 100000;
  const raw = Math.sin(hash * 12.9898) * 43758.5453;
  return (raw - Math.floor(raw)) * 2 - 1;
}

function realityRule(label) {
  const rules = [
    ["加速度", -0.035, 0],
    ["速度", -0.02, 0],
    ["位移", -0.012, 0],
    ["飞行时间", 0.006, 0],
    ["水平位移", -0.028, 0],
    ["周期", 0.018, 0],
    ["反推 g", -0.034, 0],
    ["角", 0, 0.6],
    ["条纹间距", 0.018, 0],
    ["感应电动势", -0.05, 0],
    ["伸长量", 0.018, 0],
    ["总长度", 0.008, 0],
    ["动能", -0.035, 0],
    ["势能", 0.004, 0],
    ["电流", 0.012, 0],
    ["电压", -0.01, 0],
    ["测得 R", 0.018, 0],
    ["电阻 R", 0.018, 0],
    ["合力", -0.015, 0],
    ["压强", 0.022, 0],
    ["pV", -0.012, 0],
    ["截面积", -0.024, 0],
    ["电阻率", 0.032, 0],
    ["像距", 0, 0.7],
    ["焦距", 0.012, 0],
    ["清晰度", -0.12, 0]
  ];
  const found = rules.find(([needle]) => label.includes(needle));
  return found ? { rel: found[1], abs: found[2] } : { rel: 0.008, abs: 0 };
}

function applyRealityToLive(rows) {
  if (S.mode !== "real") return rows;
  return rows.map(([label, value]) => {
    const match = String(value).match(/^(-?\d+(?:\.\d+)?)(.*)$/);
    if (!match) return [label, value];
    const number = Number(match[1]);
    if (!Number.isFinite(number)) return [label, value];
    const decimals = match[1].includes(".") ? Math.min(match[1].split(".")[1].length, 2) : 0;
    const rule = realityRule(label);
    const noisy = number * (1 + rule.rel + stableNoise(label) * 0.006) + rule.abs * stableNoise(`${label}:abs`);
    const safe = label.includes("清晰度") ? clamp(noisy, 0, 100) : noisy;
    const shown = Math.abs(safe) >= 100 ? safe.toFixed(0) : safe.toFixed(decimals);
    const measuredLabel = label.startsWith("测得")
      ? label.replace("测得", "实测")
      : `实测${/^[A-Za-z]/.test(label) ? " " : ""}${label}`;
    return [measuredLabel, `${shown}${match[2]}`];
  });
}

function getStepGuide(hot) {
  return STEP_GUIDES[`${S.current.id}.${hot}`] || STEP_GUIDES[hot] || null;
}

function listMarkup(items) {
  return `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(S.toastTimer);
  S.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function setKnowledge(card, tag = "知识点", details = {}) {
  const steps = details.steps || [];
  const stepTitle = details.stepTitle || "操作步骤";
  const modeTip = details.modeTip ? `<p>${details.modeTip}</p>` : "";
  const stepBlock = steps.length ? `
    <strong class="knowledge-subtitle">${stepTitle}</strong>
    ${listMarkup(steps)}
  ` : "";
  knowledgeTag.textContent = tag;
  knowledgeCard.innerHTML = `
    <h4>${card.title}</h4>
    <p>${card.body}</p>
    <span class="formula">${card.formula}</span>
    ${modeTip}
    ${stepBlock}
  `;
}

function setKnowledgeForHotspot(hot, announce = false) {
  if (!hot || (!announce && hot === S.lastKnowledgeHotspot)) return;
  const card = S.current.cards[hot];
  const guide = getStepGuide(hot);
  if (!card && !guide) return;
  S.lastKnowledgeHotspot = hot;
  const fallback = {
    label: "实验步骤",
    title: "把这一步和公式连起来",
    body: "这个热点对应当前实验中的一个操作步骤。先观察现象，再回到公式判断变量之间的关系。",
    formula: S.current.overview.formula
  };
  const target = card || fallback;
  setKnowledge(target, target.label, {
    steps: guide || [],
    modeTip: S.mode === "real" ? "现实模式下，这一步还会受到误差面板里列出的仪器读数、环境条件或人为判断影响。" : ""
  });
  if (announce) showToast(`已打开：${target.label}`);
}

function getErrorGuide() {
  return ERROR_GUIDES[S.current.id] || {
    title: "当前实验的误差",
    real: "现实模式会加入可解释的小偏差，帮助你比较理想模型和真实测量之间的差别。",
    formula: "测量值 = 理论值 + 系统误差 + 随机误差",
    sources: ["仪器精度有限", "读数存在估计", "环境条件不完全理想"],
    reduce: ["多次测量取平均", "保持单一变量", "先校准仪器"]
  };
}

function renderErrorPanel() {
  const guide = getErrorGuide();
  errorTag.textContent = S.mode === "real" ? "现实模式" : "理想模式";
  errorCard.innerHTML = `
    <h4>${guide.title}</h4>
    <p>${S.mode === "real" ? guide.real : "理想模式暂时忽略主要误差，用来先看清物理结论的骨架。切到现实模式后，读数会出现可解释的偏差。"}</p>
    <span class="formula error-formula">${guide.formula}</span>
    <strong class="knowledge-subtitle">主要来源</strong>
    ${listMarkup(guide.sources)}
    <strong class="knowledge-subtitle">减小方法</strong>
    ${listMarkup(guide.reduce)}
  `;
}

function renderModeControls() {
  idealModeBtn.classList.toggle("active", S.mode === "ideal");
  realModeBtn.classList.toggle("active", S.mode === "real");
  idealModeBtn.setAttribute("aria-pressed", String(S.mode === "ideal"));
  realModeBtn.setAttribute("aria-pressed", String(S.mode === "real"));
  errorPanel.hidden = !S.errorPanelOpen;
  errorToggleBtn.setAttribute("aria-expanded", String(S.errorPanelOpen));
  renderErrorPanel();
}

function setMode(mode) {
  if (S.mode === mode) return;
  S.mode = mode;
  S.lastKnowledgeHotspot = null;
  renderModeControls();
  updateLiveStrip();
  draw();
  showToast(mode === "real" ? "已切到现实模式：读数会带有可解释误差。" : "已切回理想模式：先看清物理结论。");
}

function defaultValues(exp) {
  return Object.fromEntries(exp.controls.map(control => [control.key, control.value]));
}

function selectExperiment(id) {
  const exp = experiments.find(item => item.id === id) || experiments[0];
  S.current = exp;
  S.values = defaultValues(exp);
  S.lastKnowledgeHotspot = null;
  resetSimulation(false);
  renderExperimentTabs();
  renderControls();
  renderStaticText();
  if (window.matchMedia("(max-width: 1120px)").matches) {
    shelf.classList.remove("open");
    requestAnimationFrame(() => labApp.scrollIntoView({ block: "start", behavior: "smooth" }));
  }
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
  S.lastKnowledgeHotspot = null;
  statusPill.textContent = "待开始";
  pauseBadge.classList.remove("active");
  confidencePill.textContent = "观察中";
  confidencePill.classList.add("subtle");
  if (showMessage) showToast("实验已重置。");
  setKnowledge(S.current.overview, "概览");
  renderModeControls();
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
  showToast("画面已定格：悬停、点击或长按器材都可以查看步骤解析。");
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
  if (id === "spring") updateSpring(dt);
  if (id === "energy") updateEnergy(dt);
  if (id === "resistance") updateResistance(dt);
  if (id === "force") updateForce(dt);
  if (id === "gas") updateGas(dt);
  if (id === "resistivity") updateResistivity(dt);
  if (id === "lens") updateLens(dt);
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

function updateSpring() {
  if (S.t >= 4.6) markDone();
}

function updateEnergy() {
  if (S.t >= 4.2) markDone();
}

function updateResistance() {
  if (S.t >= 4.8) markDone();
}

function updateForce() {
  if (S.t >= 4.8) markDone();
}

function updateGas() {
  if (S.t >= 5.0) markDone();
}

function updateResistivity() {
  if (S.t >= 5.0) markDone();
}

function updateLens() {
  if (S.t >= 5.0) markDone();
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
  renderModeControls();
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
  if (id === "induction") {
    const emf = inducedEmf();
    return [
      ["磁体速度", `${fmt(S.values.magnetSpeed)} m/s`],
      ["磁场强度", `${fmt(S.values.field)} T`],
      ["线圈匝数", `${fmt(S.values.turns, 0)} 匝`],
      ["感应电动势", `${fmt(emf)} V`]
    ];
  }
  if (id === "spring") {
    const force = S.values.loadMass * G;
    const extension = force / S.values.springK;
    const totalLength = S.values.naturalLength / 100 + extension;
    return [
      ["弹力 F", `${fmt(force)} N`],
      ["伸长量 x", `${fmt(extension * 100)} cm`],
      ["劲度系数 k", `${fmt(S.values.springK, 0)} N/m`],
      ["总长度 L", `${fmt(totalLength * 100)} cm`]
    ];
  }
  if (id === "energy") {
    const e = energyState();
    return [
      ["高度 h", `${fmt(e.heightNow)} m`],
      ["速度 v", `${fmt(e.v)} m/s`],
      ["势能 Ep", `${fmt(e.ep)} J`],
      ["动能 Ek", `${fmt(e.ek)} J`]
    ];
  }
  if (id === "resistance") {
    const r = resistanceState();
    return [
      ["电流 I", `${fmt(r.current)} A`],
      ["电阻电压 U", `${fmt(r.resistorVoltage)} V`],
      ["测得 R", `${fmt(r.measured)} Ω`],
      ["总电阻", `${fmt(r.totalResistance)} Ω`]
    ];
  }
  if (id === "force") {
    const f = forceState();
    return [
      ["分力 F₁", `${fmt(f.f1)} N`],
      ["分力 F₂", `${fmt(f.f2)} N`],
      ["夹角 θ", `${fmt(f.thetaDeg, 1)} °`],
      ["合力 F", `${fmt(f.resultant)} N`]
    ];
  }
  if (id === "gas") {
    const g = gasState();
    return [
      ["体积 V", `${fmt(g.volume, 0)} mL`],
      ["压强 p", `${fmt(g.pressure)} kPa`],
      ["温度 T", `${fmt(g.temp, 0)} K`],
      ["pV", `${fmt(g.pv, 0)} kPa·mL`]
    ];
  }
  if (id === "resistivity") {
    const r = resistivityState();
    return [
      ["电阻 R", `${fmt(r.resistance)} Ω`],
      ["电流 I", `${fmt(r.current)} A`],
      ["截面积 S", `${fmt(r.area * 1e6)} mm²`],
      ["电阻率 ρ", `${fmt(r.rhoMeasured * 1e8)}×10⁻⁸ Ω·m`]
    ];
  }
  if (id === "lens") {
    const l = lensState();
    return [
      ["物距 u", `${fmt(l.u, 0)} cm`],
      ["像距 v", l.realImage ? `${fmt(l.v, 1)} cm` : "无实像"],
      ["焦距 f", `${fmt(l.f, 1)} cm`],
      ["清晰度", l.realImage ? `${fmt(l.sharpness, 0)}%` : "0%"]
    ];
  }
  return [];
}

function updateLiveStrip() {
  liveStrip.innerHTML = applyRealityToLive(getLiveData()).map(([label, value]) => `
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
  resetCanvasTilt();
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
  const y = H * 0.76;
  const grad = ctx.createLinearGradient(0, y, 0, H);
  grad.addColorStop(0, "rgba(202, 158, 111, .74)");
  grad.addColorStop(0.22, "rgba(176, 127, 82, .70)");
  grad.addColorStop(1, "rgba(128, 87, 58, .78)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, y, W, H - y);

  ctx.fillStyle = "rgba(255,255,255,.24)";
  ctx.fillRect(0, y, W, 3);
  ctx.fillStyle = "rgba(86, 58, 36, .16)";
  for (let i = 0; i < 5; i++) {
    const yy = y + 22 + i * 18;
    ctx.fillRect(0, yy, W, 1);
  }
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
  if (id === "spring") drawSpring();
  if (id === "energy") drawEnergy();
  if (id === "resistance") drawResistance();
  if (id === "force") drawForce();
  if (id === "gas") drawGas();
  if (id === "resistivity") drawResistivity();
  if (id === "lens") drawLens();
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

function drawOvalShadow(x, y, w, h, alpha = 0.24) {
  ctx.save();
  const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) / 2);
  grad.addColorStop(0, `rgba(30, 32, 34, ${alpha})`);
  grad.addColorStop(0.72, `rgba(30, 32, 34, ${alpha * 0.38})`);
  grad.addColorStop(1, "rgba(30, 32, 34, 0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(x, y, w / 2, h / 2, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawChunkRect(x, y, w, h, r, topColor, sideColor, strokeColor = "rgba(36,50,64,.34)", depth = 8) {
  ctx.save();
  drawOvalShadow(x + w / 2, y + h + depth + 8, w * 0.92, h * 0.36, 0.18);

  roundRect(x, y + depth, w, h, r);
  ctx.fillStyle = sideColor;
  ctx.fill();

  roundRect(x, y, w, h, r);
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, "rgba(255,255,255,.36)");
  grad.addColorStop(0.12, topColor);
  grad.addColorStop(1, shadeColor(topColor, -12));
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,.52)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + r + 4, y + 6);
  ctx.lineTo(x + w - r - 4, y + 6);
  ctx.stroke();
  ctx.restore();
}

function drawBeveledCircle(x, y, r, color, sideColor, strokeColor = "rgba(36,50,64,.34)") {
  ctx.save();
  drawOvalShadow(x, y + r * 0.68, r * 2.05, r * 0.72, 0.22);
  ctx.fillStyle = sideColor;
  ctx.beginPath();
  ctx.ellipse(x, y + 5, r, r * 0.95, 0, 0, TAU);
  ctx.fill();
  const grad = ctx.createRadialGradient(x - r * .35, y - r * .45, r * .08, x, y, r * 1.18);
  grad.addColorStop(0, "rgba(255,255,255,.82)");
  grad.addColorStop(0.22, color);
  grad.addColorStop(1, shadeColor(color, -20));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();
}

function drawPill3D(x, y, w, h, color, sideColor) {
  drawChunkRect(x, y, w, h, h / 2, color, sideColor, "rgba(36,50,64,.28)", Math.max(5, h * .14));
}

function drawToyBase(x, y, w, h, accent = "#2f958e") {
  ctx.save();
  drawOvalShadow(x + w / 2, y + h + 22, w * 1.02, h * 1.1, 0.20);
  drawChunkRect(x, y, w, h, 12, "#f4e7d0", "#b99768", "rgba(101,76,45,.26)", 14);

  ctx.globalAlpha = 0.72;
  ctx.fillStyle = accent;
  roundRect(x + 18, y + h - 13, w - 36, 5, 3);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "rgba(255,255,255,.46)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 20, y + 9);
  ctx.lineTo(x + w - 20, y + 9);
  ctx.stroke();
  ctx.restore();
}

function drawSlotMarks(x, y, w, count = 8) {
  ctx.save();
  ctx.strokeStyle = "rgba(82,69,52,.20)";
  ctx.lineWidth = 2;
  for (let i = 1; i < count; i++) {
    const xx = x + w * i / count;
    ctx.beginPath();
    ctx.moveTo(xx, y);
    ctx.lineTo(xx + 8, y + 15);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTrack3D(x1, y, x2) {
  ctx.save();
  drawOvalShadow((x1 + x2) / 2, y + 20, x2 - x1 + 80, 28, 0.16);
  drawPill3D(x1, y - 7, x2 - x1, 12, "#71808d", "#4e5a65");
  ctx.fillStyle = "rgba(255,255,255,.28)";
  ctx.fillRect(x1 + 12, y - 4, x2 - x1 - 24, 2);
  ctx.fillStyle = "rgba(67,72,78,.18)";
  for (let x = x1 + 16; x <= x2 - 18; x += 30) {
    roundRect(x, y + 13, 15, 7, 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawWheel3D(x, y, r = 12) {
  drawBeveledCircle(x, y, r, "#263241", "#111922", "rgba(255,255,255,.18)");
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.34)";
  ctx.beginPath();
  ctx.arc(x - r * .25, y - r * .28, r * .24, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawCart3D(x, y, w, h) {
  const bodyX = x - w / 2;
  const bodyY = y - h - 8;
  drawChunkRect(bodyX, bodyY, w, h, 10, "#e86f61", "#a94843", "#783d3b", 10);
  drawChunkRect(bodyX + 18, bodyY - 15, w * .48, 24, 12, "#f7efe5", "#c9bba5", "rgba(70,70,72,.32)", 5);
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.42)";
  roundRect(bodyX + 12, bodyY + 8, w * .42, 8, 4);
  ctx.fill();
  ctx.restore();
  drawWheel3D(x - 25, y + 2, 12);
  drawWheel3D(x + 25, y + 2, 12);
}

function drawLauncher3D(x, y) {
  drawChunkRect(x - 62, y - 24, 62, 42, 9, "#f7f1e8", "#b7aa95", "#7b8790", 8);
  drawChunkRect(x - 54, y - 8, 68, 18, 9, "#5f6f7b", "#3f4c55", "#536170", 5);
  drawBeveledCircle(x - 46, y + 17, 8, "#2f3a45", "#121820", "rgba(255,255,255,.18)");
}

function drawGlassBlock3D(x, y, w, h) {
  ctx.save();
  drawOvalShadow(x + w / 2, y + h + 18, w * 1.05, 36, 0.17);
  ctx.fillStyle = "rgba(72, 132, 164, .18)";
  ctx.beginPath();
  ctx.moveTo(x + 18, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w - 18, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(74, 103, 122, .42)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.30)";
  ctx.beginPath();
  ctx.moveTo(x + 18, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w - 8, y + 18);
  ctx.lineTo(x + 8, y + 18);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.42)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 28, y + 12);
  ctx.lineTo(x + w - 34, y + 12);
  ctx.stroke();
  ctx.restore();
}

function shadeColor(hex, percent) {
  if (!hex.startsWith("#")) return hex;
  const n = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const r = clamp((n >> 16) + amt, 0, 255);
  const g = clamp(((n >> 8) & 255) + amt, 0, 255);
  const b = clamp((n & 255) + amt, 0, 255);
  return `rgb(${r}, ${g}, ${b})`;
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

function drawGlowLine(x1, y1, x2, y2, color, width = 4) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.strokeStyle = color;
  ctx.lineWidth = width + 4;
  ctx.globalAlpha = 0.26;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawLabel(text, x, y, color = "#243240") {
  ctx.save();
  ctx.font = "13px Microsoft YaHei, sans-serif";
  const metrics = ctx.measureText(text);
  roundRect(x - 8, y - 18, metrics.width + 16, 25, 6);
  ctx.fillStyle = "rgba(255,255,255,.88)";
  ctx.fill();
  ctx.strokeStyle = "rgba(84,96,109,.12)";
  ctx.stroke();
  ctx.shadowColor = "rgba(50,45,38,.12)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2;
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
  const cartW = map(S.values.mass, 0.3, 1.5, 72, 100);
  const cartH = map(S.values.mass, 0.3, 1.5, 40, 50);

  drawToyBase(left - 72, trackY + 23, right - left + 168, 44, "#2f958e");
  drawSlotMarks(left - 40, trackY + 48, right - left + 106, 10);
  drawTrack3D(left - 40, trackY, right + 66);

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

  drawCart3D(cartX, trackY, cartW, cartH);

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
  drawChunkRect(x, y, w, h, 10, "#f7fbff", "#d5dde2", "rgba(84,96,109,.22)", 7);
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
  const targetX = startX + S.values.speed * flight * W * 0.075;

  drawToyBase(startX - 94, ground + 8, Math.min(W * 0.80, targetX - startX + 190), 42, "#e86f61");
  drawSlotMarks(startX - 54, ground + 34, Math.min(W * 0.72, targetX - startX + 110), 9);

  ctx.strokeStyle = "rgba(83,97,112,.35)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX, ground);
  ctx.lineTo(W * 0.88, ground);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(232,111,97,.42)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const tt = flight * i / 80;
    const tx = startX + S.values.speed * tt * W * 0.075;
    const ty = startY + 0.5 * G * tt * tt * scale;
    if (i === 0) ctx.moveTo(tx, ty);
    else ctx.lineTo(tx, ty);
  }
  ctx.stroke();
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

  drawLauncher3D(startX, startY);
  drawArrow(startX, startY, startX + 76, startY, "#2f958e", 3);
  drawArrow(px, py, px, py + 62, "#d6a744", 3);
  drawArrow(px, py, px + 58, py, "#427aa1", 3);

  const shadowAlpha = clamp((ground - py) / (H * 0.45), 0.08, 0.24);
  drawOvalShadow(px, ground + 8, 34 + shadowAlpha * 70, 9, shadowAlpha);
  drawBeveledCircle(px, py, 15, "#e86f61", "#9f3f3c", "#7d3e38");

  drawChunkRect(targetX - 36, ground + 5, 72, 15, 8, "#f4e7d0", "#bba17a", "rgba(117,93,54,.28)", 5);
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

  drawToyBase(pivotX - 166, H * 0.74, 332, 44, "#d6a744");
  drawSlotMarks(pivotX - 128, H * 0.765, 256, 8);
  drawChunkRect(pivotX - 118, pivotY - 34, 236, 18, 9, "#6b7e8e", "#41505c", "rgba(36,50,64,.32)", 6);
  drawChunkRect(pivotX - 126, H * 0.73, 252, 22, 11, "#7b8b97", "#4b5963", "rgba(36,50,64,.28)", 7);
  drawChunkRect(pivotX - 112, pivotY - 22, 20, H * 0.56, 10, "#758795", "#46545e", "rgba(36,50,64,.26)", 6);
  drawChunkRect(pivotX + 92, pivotY - 22, 20, H * 0.56, 10, "#758795", "#46545e", "rgba(36,50,64,.26)", 6);

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

  drawOvalShadow(bobX, H * 0.755, 46, 10, 0.12);
  drawBeveledCircle(bobX, bobY, 22, "#d6a744", "#8f6725", "#735d2e");

  drawBeveledCircle(pivotX, pivotY, 8, "#263241", "#111922", "rgba(255,255,255,.18)");

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

  drawToyBase(W * 0.09, H * 0.735, W * 0.82, 42, "#6f6aa8");
  drawSlotMarks(W * 0.13, H * 0.76, W * 0.72, 10);
  ctx.fillStyle = "rgba(255,255,255,.28)";
  ctx.fillRect(0, cy + H * 0.03, W * 0.62, H * 0.29);
  drawGlassBlock3D(W * 0.14, cy, W * 0.48, H * 0.30);

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
  drawGlowLine(ix, iy, cx, cy, lambdaColor, 4);
  drawGlowLine(cx, cy, rx, ry, lambdaColor, 4);
  drawArrow(ix, iy, cx, cy, lambdaColor, 3);
  drawArrow(cx, cy, rx, ry, lambdaColor, 3);

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
  drawChunkRect(x, y, w, h, 10, "#30384f", "#1c2230", "rgba(255,255,255,.18)", 9);
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

  drawToyBase(W * 0.12, H * 0.66, W * 0.76, 44, "#427aa1");
  drawSlotMarks(W * 0.17, H * 0.688, W * 0.66, 9);
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
  for (let i = -2; i <= 2; i++) {
    const startY = my + i * 18;
    const endY = cy + i * 14;
    const controlA = { x: lerp(mx, cx, .35), y: my - 110 + i * 20 };
    const controlB = { x: lerp(mx, cx, .72), y: cy + 110 - i * 20 };
    ctx.save();
    ctx.shadowColor = "rgba(66,122,161,.7)";
    ctx.shadowBlur = 12;
    ctx.strokeStyle = "rgba(66,122,161,.18)";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(mx + 48, startY);
    ctx.bezierCurveTo(controlA.x, controlA.y, controlB.x, controlB.y, cx - 60, endY);
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = "rgba(66,122,161,.42)";
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    ctx.moveTo(mx + 48, startY);
    ctx.bezierCurveTo(controlA.x, controlA.y, controlB.x, controlB.y, cx - 60, endY);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMagnet(x, y) {
  ctx.save();
  drawOvalShadow(x, y + 48, 150, 34, 0.22);

  roundRect(x - 62, y - 24, 124, 68, 10);
  ctx.fillStyle = "#5a6570";
  ctx.fill();

  roundRect(x - 62, y - 34, 124, 68, 10);
  ctx.save();
  ctx.clip();

  let grad = ctx.createLinearGradient(x - 62, y - 34, x, y + 34);
  grad.addColorStop(0, "#e86f61");
  grad.addColorStop(.55, "#d9534e");
  grad.addColorStop(1, "#9d3e3c");
  ctx.fillStyle = grad;
  ctx.fillRect(x - 62, y - 34, 62, 68);

  grad = ctx.createLinearGradient(x, y - 34, x + 62, y + 34);
  grad.addColorStop(0, "#5da0c8");
  grad.addColorStop(.55, "#427aa1");
  grad.addColorStop(1, "#2e536e");
  ctx.fillStyle = grad;
  ctx.fillRect(x, y - 34, 62, 68);

  const center = ctx.createLinearGradient(x - 9, y, x + 9, y);
  center.addColorStop(0, "rgba(255,255,255,.08)");
  center.addColorStop(.5, "rgba(255,255,255,.88)");
  center.addColorStop(1, "rgba(255,255,255,.08)");
  ctx.fillStyle = center;
  ctx.fillRect(x - 9, y - 34, 18, 68);
  ctx.restore();

  ctx.strokeStyle = "rgba(36,50,64,.45)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 47, y - 23);
  ctx.lineTo(x + 47, y - 23);
  ctx.stroke();

  ctx.fillStyle = "#fff";
  ctx.font = "bold 18px Microsoft YaHei";
  ctx.fillText("N", x - 44, y + 7);
  ctx.fillText("S", x + 32, y + 7);
  ctx.restore();
}

function drawCoil(x, y) {
  ctx.save();
  drawOvalShadow(x + 16, y + 70, 170, 34, 0.18);
  drawChunkRect(x - 72, y + 58, 176, 18, 9, "#758795", "#46545e", "rgba(36,50,64,.24)", 5);

  ctx.strokeStyle = "rgba(139, 91, 28, .62)";
  ctx.lineWidth = 8;
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    ctx.ellipse(x + i * 9 - 36, y + 5, 19, 58, 0, 0, TAU);
    ctx.stroke();
  }

  ctx.strokeStyle = "#d6a744";
  ctx.lineWidth = 5;
  for (let i = 0; i < 9; i++) {
    const grad = ctx.createLinearGradient(x - 50, y - 52, x + 50, y + 52);
    grad.addColorStop(0, "#f5d983");
    grad.addColorStop(.55, "#d6a744");
    grad.addColorStop(1, "#9c6d22");
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x + i * 9 - 36, y, 18, 58, 0, 0, TAU);
    ctx.stroke();
  }

  ctx.strokeStyle = "#536170";
  ctx.lineWidth = 4;
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
  drawChunkRect(x - 64, y - 52, 128, 104, 12, "#f7fbff", "#cbd5dc", "rgba(84,96,109,.28)", 8);
  ctx.fillStyle = "rgba(255,255,255,.72)";
  ctx.beginPath();
  ctx.arc(x, y + 14, 45, Math.PI, TAU);
  ctx.lineTo(x + 45, y + 14);
  ctx.lineTo(x - 45, y + 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#536170";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y + 14, 42, Math.PI, TAU);
  ctx.stroke();

  for (let i = -2; i <= 2; i++) {
    const a = -Math.PI / 2 + i * 0.34;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * 32, y + 14 + Math.sin(a) * 32);
    ctx.lineTo(x + Math.cos(a) * 39, y + 14 + Math.sin(a) * 39);
    ctx.stroke();
  }

  const needle = clamp(emf / 12, 0, 1) * dir;
  const angle = -Math.PI / 2 + needle * 0.85;
  drawArrow(x, y + 16, x + Math.cos(angle) * 38, y + 16 + Math.sin(angle) * 38, "#e86f61", 3);
  drawBeveledCircle(x, y + 16, 5, "#263241", "#111922", "rgba(255,255,255,.18)");
  ctx.fillStyle = "#536170";
  ctx.font = "bold 12px Microsoft YaHei";
  ctx.fillText("G", x - 5, y + 42);
  ctx.restore();
}

function springState() {
  const force = S.values.loadMass * G;
  const extension = force / S.values.springK;
  return {
    force,
    extension,
    totalLength: S.values.naturalLength / 100 + extension
  };
}

function drawSpring() {
  const W = S.cssW, H = S.cssH;
  const state = springState();
  const standX = W * 0.31;
  const topY = H * 0.17;
  const baseY = H * 0.73;
  const springTop = topY + 46;
  const naturalPx = map(S.values.naturalLength, 8, 18, H * 0.13, H * 0.22);
  const extensionPx = clamp(state.extension * H * 0.82, 12, H * 0.31);
  const springBottom = springTop + naturalPx + extensionPx;
  const loadW = map(S.values.loadMass, 0.05, 0.35, 66, 104);
  const loadH = map(S.values.loadMass, 0.05, 0.35, 42, 64);
  const loadY = springBottom + 18;

  drawToyBase(W * 0.13, baseY, W * 0.43, 46, "#d6a744");
  drawSlotMarks(W * 0.17, baseY + 27, W * 0.35, 8);
  drawChunkRect(standX - 138, topY, 252, 20, 10, "#728391", "#45525d", "rgba(36,50,64,.28)", 7);
  drawChunkRect(standX - 126, topY + 8, 24, baseY - topY + 12, 12, "#7d8d98", "#4c5962", "rgba(36,50,64,.25)", 7);
  drawChunkRect(standX + 90, topY + 8, 24, baseY - topY + 12, 12, "#7d8d98", "#4c5962", "rgba(36,50,64,.25)", 7);
  drawChunkRect(standX - 22, topY + 17, 44, 16, 8, "#f4e7d0", "#b99768", "rgba(101,76,45,.25)", 5);

  drawRuler3D(standX + 98, springTop - 8, H * 0.42, state);
  drawSpringCoil(standX, springTop, springBottom, 25, 12);
  drawArrow(standX - 72, loadY + loadH * 0.2, standX - 72, loadY + loadH * 0.2 + 54, "#e86f61", 3);
  drawLabel("mg", standX - 110, loadY + loadH * 0.2 + 52, "#7d3e38");
  drawArrow(standX + 72, springBottom + 20, standX + 72, springBottom - 42, "#2f958e", 3);
  drawLabel("F弹", standX + 84, springBottom - 18, "#236e69");

  drawOvalShadow(standX, loadY + loadH + 18, loadW * 1.08, 24, 0.2);
  drawChunkRect(standX - loadW / 2, loadY, loadW, loadH, 12, "#d6a744", "#8f6725", "rgba(101,76,45,.38)", 12);
  drawChunkRect(standX - loadW * 0.28, loadY - 17, loadW * 0.56, 22, 10, "#f4e7d0", "#b99768", "rgba(101,76,45,.25)", 5);
  drawLabel(`${fmt(S.values.loadMass, 2)} kg`, standX - 36, loadY + loadH / 2 + 5, "#6b541e");
  drawLabel(`x = ${fmt(state.extension * 100)} cm`, W * 0.10, H * 0.20, "#8a6826");
  drawLabel(`F = kx = ${fmt(state.force)} N`, W * 0.10, H * 0.27, "#236e69");

  drawSpringGraph(W * 0.64, H * 0.16, W * 0.24, H * 0.36, state);
  drawHotspotHints([
    { key: "spring", x: standX, y: lerp(springTop, springBottom, .45), text: "长按弹簧" },
    { key: "load", x: standX, y: loadY + loadH / 2, text: "拖动砝码" },
    { key: "graph", x: W * 0.76, y: H * 0.34, text: "长按图像" }
  ]);
}

function drawSpringCoil(x, y1, y2, amp, turns) {
  const steps = 150;
  const drawPath = () => {
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y1 + 12);
    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      const y = lerp(y1 + 12, y2 - 12, p);
      const xx = x + Math.sin(p * turns * TAU) * amp;
      ctx.lineTo(xx, y);
    }
    ctx.lineTo(x, y2);
  };
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(124,82,22,.38)";
  ctx.lineWidth = 10;
  drawPath();
  ctx.stroke();
  const grad = ctx.createLinearGradient(x - amp, y1, x + amp, y2);
  grad.addColorStop(0, "#fff3b0");
  grad.addColorStop(.5, "#d6a744");
  grad.addColorStop(1, "#8f6725");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 5;
  drawPath();
  ctx.stroke();
  drawBeveledCircle(x, y1, 8, "#263241", "#111922", "rgba(255,255,255,.18)");
  drawBeveledCircle(x, y2, 6, "#263241", "#111922", "rgba(255,255,255,.18)");
  ctx.restore();
}

function drawRuler3D(x, y, h, state) {
  ctx.save();
  drawChunkRect(x, y, 38, h, 7, "#fbf4df", "#c8ad7a", "rgba(101,76,45,.25)", 6);
  ctx.strokeStyle = "rgba(82,69,52,.42)";
  ctx.fillStyle = "rgba(36,50,64,.66)";
  ctx.font = "11px Microsoft YaHei";
  for (let i = 0; i <= 10; i++) {
    const yy = y + 14 + (h - 30) * i / 10;
    const long = i % 2 === 0;
    ctx.beginPath();
    ctx.moveTo(x + 7, yy);
    ctx.lineTo(x + (long ? 28 : 20), yy);
    ctx.stroke();
    if (long) ctx.fillText(`${Math.round(i * 5)}`, x + 8, yy - 3);
  }
  drawLabel(`L=${fmt(state.totalLength * 100)} cm`, x - 16, y + h + 27, "#6b541e");
  ctx.restore();
}

function drawSpringGraph(x, y, w, h, state) {
  const xMax = 0.30;
  const yMax = 6;
  const originX = x + 30;
  const originY = y + h - 30;
  const plotW = w - 50;
  const plotH = h - 56;
  const lineEndX = Math.min(xMax, yMax / S.values.springK);
  const lineEndY = S.values.springK * lineEndX;
  const pointX = clamp(state.extension, 0, xMax);
  const pointY = clamp(state.force, 0, yMax);

  drawChunkRect(x, y, w, h, 10, "#f7fbff", "#d5dde2", "rgba(84,96,109,.22)", 7);
  ctx.save();
  ctx.strokeStyle = "#536170";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX, y + 18);
  ctx.moveTo(originX, originY);
  ctx.lineTo(x + w - 18, originY);
  ctx.stroke();
  ctx.strokeStyle = "#d6a744";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + lineEndX / xMax * plotW, originY - lineEndY / yMax * plotH);
  ctx.stroke();
  drawBeveledCircle(originX + pointX / xMax * plotW, originY - pointY / yMax * plotH, 6, "#e86f61", "#9f3f3c", "#7d3e38");
  ctx.fillStyle = "#536170";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText("F-x", x + w - 46, y + 20);
  ctx.fillText("斜率 k", x + 38, y + 30);
  ctx.restore();
}

function energyState() {
  const progress = smoothstep(S.t / 3.6);
  const drop = S.values.height * progress;
  const lossRatio = S.values.loss / 100;
  const heightNow = Math.max(0, S.values.height - drop);
  const idealV = Math.sqrt(Math.max(0, 2 * G * drop));
  const v = idealV * Math.sqrt(Math.max(0, 1 - lossRatio));
  const initial = S.values.mass * G * S.values.height;
  const ep = S.values.mass * G * heightNow;
  const ek = 0.5 * S.values.mass * v * v;
  const lost = S.values.mass * G * drop * lossRatio;
  return {
    progress,
    drop,
    heightNow,
    idealV,
    v,
    initial,
    ep,
    ek,
    lost,
    total: ep + ek
  };
}

function cubicPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return {
    x: u ** 3 * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t ** 3 * p3.x,
    y: u ** 3 * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t ** 3 * p3.y
  };
}

function energyTrackPoints() {
  const W = S.cssW, H = S.cssH;
  return {
    p0: { x: W * 0.16, y: H * 0.25 },
    p1: { x: W * 0.28, y: H * 0.16 },
    p2: { x: W * 0.42, y: H * 0.64 },
    p3: { x: W * 0.61, y: H * 0.61 }
  };
}

function drawEnergy() {
  const W = S.cssW, H = S.cssH;
  const e = energyState();
  const track = energyTrackPoints();
  const ball = cubicPoint(track.p0, track.p1, track.p2, track.p3, e.progress);
  const ballR = map(S.values.mass, 0.10, 0.60, 16, 27);

  drawToyBase(W * 0.10, H * 0.69, W * 0.58, 46, "#e86f61");
  drawSlotMarks(W * 0.15, H * 0.718, W * 0.48, 8);
  drawChunkRect(track.p0.x - 44, track.p0.y + 20, 34, H * 0.43, 10, "#758795", "#46545e", "rgba(36,50,64,.25)", 7);
  drawChunkRect(track.p3.x - 34, track.p3.y + 20, 58, 30, 10, "#758795", "#46545e", "rgba(36,50,64,.25)", 7);
  drawEnergyTrack(track);

  ctx.strokeStyle = "rgba(232,111,97,.24)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  for (let i = 0; i <= 60; i++) {
    const p = i / 60 * e.progress;
    const q = cubicPoint(track.p0, track.p1, track.p2, track.p3, p);
    if (i === 0) ctx.moveTo(q.x, q.y);
    else ctx.lineTo(q.x, q.y);
  }
  ctx.stroke();

  drawOvalShadow(ball.x, H * 0.705, ballR * 2.2, 12, 0.13 + e.progress * .08);
  drawBeveledCircle(ball.x, ball.y - ballR * .2, ballR, "#e86f61", "#9f3f3c", "#7d3e38");
  drawArrow(ball.x + ballR + 8, ball.y - 4, ball.x + ballR + 58 + e.v * 3, ball.y + 8, "#2f958e", 3);
  drawLabel(`v=${fmt(e.v)} m/s`, ball.x + ballR + 24, ball.y - 18, "#236e69");

  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "rgba(36,50,64,.28)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(track.p0.x - 18, track.p0.y);
  ctx.lineTo(track.p0.x - 18, track.p3.y);
  ctx.stroke();
  ctx.setLineDash([]);
  drawLabel(`h=${fmt(e.heightNow)} m`, track.p0.x - 70, lerp(track.p0.y, track.p3.y, .48), "#7d3e38");
  drawLabel(`E=${fmt(e.total)} J`, W * 0.10, H * 0.20, "#236e69");
  if (S.values.loss > 0) drawLabel(`损耗 ${fmt(e.lost)} J`, W * 0.10, H * 0.27, "#8a6826");

  drawEnergyBars(W * 0.70, H * 0.16, W * 0.20, H * 0.42, e);
  drawHotspotHints([
    { key: "ball", x: ball.x, y: ball.y, text: "拖动小球" },
    { key: "energy", x: W * 0.80, y: H * 0.36, text: "长按能量柱" },
    { key: "loss", x: W * 0.79, y: H * 0.58, text: "拖动损耗" }
  ]);
}

function drawEnergyTrack(track) {
  const drawPath = () => {
    ctx.beginPath();
    ctx.moveTo(track.p0.x, track.p0.y);
    ctx.bezierCurveTo(track.p1.x, track.p1.y, track.p2.x, track.p2.y, track.p3.x, track.p3.y);
  };
  ctx.save();
  drawOvalShadow(lerp(track.p0.x, track.p3.x, .52), track.p3.y + 42, Math.abs(track.p3.x - track.p0.x) + 100, 38, 0.18);
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(80,62,48,.26)";
  ctx.lineWidth = 24;
  drawPath();
  ctx.stroke();
  ctx.strokeStyle = "#536170";
  ctx.lineWidth = 17;
  drawPath();
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.45)";
  ctx.lineWidth = 4;
  drawPath();
  ctx.stroke();
  ctx.restore();
}

function drawEnergyBars(x, y, w, h, e) {
  drawChunkRect(x, y, w, h, 10, "#f7fbff", "#d5dde2", "rgba(84,96,109,.22)", 7);
  const labels = [
    ["Ep", e.ep, "#427aa1"],
    ["Ek", e.ek, "#e86f61"],
    ["损", e.lost, "#d6a744"]
  ];
  const maxEnergy = Math.max(e.initial, 0.01);
  const base = y + h - 34;
  const maxH = h - 78;
  const barW = Math.max(18, (w - 64) / 3);
  ctx.save();
  labels.forEach(([label, value, color], i) => {
    const bx = x + 24 + i * (barW + 12);
    const bh = clamp(value / maxEnergy, 0, 1) * maxH;
    roundRect(bx, y + 34, barW, maxH, 6);
    ctx.fillStyle = "rgba(83,97,112,.12)";
    ctx.fill();
    roundRect(bx, base - bh, barW, bh, 6);
    const grad = ctx.createLinearGradient(bx, base - bh, bx, base);
    grad.addColorStop(0, "rgba(255,255,255,.55)");
    grad.addColorStop(.2, color);
    grad.addColorStop(1, shadeColor(color, -18));
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.fillStyle = "#536170";
    ctx.font = "12px Microsoft YaHei";
    ctx.fillText(label, bx + 1, base + 18);
  });
  ctx.fillStyle = "#536170";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText("机械能", x + w - 62, y + 20);
  ctx.restore();
}

function resistanceState() {
  const totalResistance = S.values.resistance + S.values.rheostat;
  const current = S.values.voltage / Math.max(totalResistance, 0.001);
  const resistorVoltage = current * S.values.resistance;
  const rheostatVoltage = current * S.values.rheostat;
  const measured = current > 0.0001 ? resistorVoltage / current : 0;
  return {
    totalResistance,
    current,
    resistorVoltage,
    rheostatVoltage,
    measured
  };
}

function drawResistance() {
  const W = S.cssW, H = S.cssH;
  const r = resistanceState();
  const left = W * 0.17;
  const right = W * 0.64;
  const top = H * 0.28;
  const bottom = H * 0.62;
  const resistorX = W * 0.50;
  const resistorY = top;
  const graphX = W * 0.70;
  const graphY = H * 0.16;

  drawToyBase(W * 0.10, H * 0.69, W * 0.58, 46, "#2f958e");
  drawSlotMarks(W * 0.15, H * 0.718, W * 0.48, 8);
  drawCircuitWire([
    [left, bottom], [left, top], [W * 0.29, top], [W * 0.41, top],
    [right, top], [right, bottom], [W * 0.43, bottom], [W * 0.28, bottom], [left, bottom]
  ], r.current);

  drawBattery(left, bottom, S.values.voltage);
  drawAmmeter(W * 0.34, top, r.current);
  drawResistor(resistorX, resistorY, S.values.resistance);
  drawVoltmeter(W * 0.58, H * 0.43, r.resistorVoltage);
  drawRheostat(W * 0.43, bottom, W * 0.20, S.values.rheostat);
  drawCurrentDots(left, right, top, bottom, r.current);
  drawUIGraph(graphX, graphY, W * 0.20, H * 0.34, r);

  drawLabel(`I = ${fmt(r.current)} A`, W * 0.10, H * 0.19, "#236e69");
  drawLabel(`U_R = ${fmt(r.resistorVoltage)} V`, W * 0.10, H * 0.26, "#236e69");
  drawLabel(`R = ${fmt(r.measured)} Ω`, W * 0.10, H * 0.33, "#7d3e38");
  drawHotspotHints([
    { key: "resistor", x: resistorX, y: resistorY, text: "拖动电阻" },
    { key: "meters", x: W * 0.47, y: H * 0.36, text: "长按电表" },
    { key: "rheostat", x: W * 0.53, y: bottom, text: "拖动滑片" },
    { key: "graph", x: graphX + W * 0.10, y: graphY + H * 0.18, text: "长按图像" }
  ]);
}

function drawCircuitWire(points, current) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(67,72,78,.22)";
  ctx.lineWidth = 15;
  ctx.beginPath();
  points.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
  ctx.stroke();
  ctx.strokeStyle = current > 0.01 ? "rgba(47,149,142,.68)" : "rgba(83,97,112,.45)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  points.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
  ctx.stroke();
  ctx.restore();
}

function drawBattery(x, y, voltage) {
  drawChunkRect(x - 44, y - 36, 88, 70, 10, "#f4e7d0", "#b99768", "rgba(101,76,45,.28)", 8);
  drawChunkRect(x - 24, y - 50, 17, 22, 5, "#e86f61", "#9f3f3c", "rgba(101,76,45,.28)", 4);
  drawChunkRect(x + 8, y - 43, 17, 15, 5, "#427aa1", "#2e536e", "rgba(101,76,45,.28)", 4);
  ctx.save();
  ctx.fillStyle = "#536170";
  ctx.font = "bold 13px Microsoft YaHei";
  ctx.fillText(`${fmt(voltage, 1)} V`, x - 24, y + 6);
  ctx.restore();
}

function drawAmmeter(x, y, current) {
  drawRoundMeter(x, y, "A", current, "A", 0.9, "#2f958e");
}

function drawVoltmeter(x, y, voltage) {
  drawRoundMeter(x, y, "V", voltage, "V", 6, "#427aa1");
}

function drawRoundMeter(x, y, label, value, unit, max, color) {
  ctx.save();
  drawChunkRect(x - 52, y - 48, 104, 92, 12, "#f7fbff", "#cbd5dc", "rgba(84,96,109,.28)", 8);
  ctx.fillStyle = "rgba(255,255,255,.76)";
  ctx.beginPath();
  ctx.arc(x, y + 4, 37, Math.PI, TAU);
  ctx.lineTo(x + 37, y + 4);
  ctx.lineTo(x - 37, y + 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#536170";
  ctx.lineWidth = 2;
  ctx.stroke();
  const needle = clamp(value / max, 0, 1);
  const angle = Math.PI * 1.05 + needle * Math.PI * .9;
  drawArrow(x, y + 5, x + Math.cos(angle) * 33, y + 5 + Math.sin(angle) * 33, color, 3);
  drawBeveledCircle(x, y + 5, 5, "#263241", "#111922", "rgba(255,255,255,.18)");
  ctx.fillStyle = "#536170";
  ctx.font = "bold 12px Microsoft YaHei";
  ctx.fillText(label, x - 4, y + 30);
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${fmt(value)} ${unit}`, x - 26, y - 23);
  ctx.restore();
}

function drawResistor(x, y, resistance) {
  drawChunkRect(x - 74, y - 24, 148, 48, 12, "#f4e7d0", "#b99768", "rgba(101,76,45,.30)", 9);
  ctx.save();
  ctx.strokeStyle = "#e86f61";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 54, y);
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(x - 42 + i * 16, y + (i % 2 === 0 ? -13 : 13));
  }
  ctx.lineTo(x + 56, y);
  ctx.stroke();
  ctx.fillStyle = "#536170";
  ctx.font = "bold 12px Microsoft YaHei";
  ctx.fillText(`${fmt(resistance)} Ω`, x - 20, y + 6);
  ctx.restore();
}

function drawRheostat(x, y, w, value) {
  drawChunkRect(x - 18, y - 26, w + 36, 52, 12, "#758795", "#46545e", "rgba(36,50,64,.25)", 8);
  ctx.save();
  ctx.strokeStyle = "#d6a744";
  ctx.lineWidth = 4;
  for (let i = 0; i < 9; i++) {
    const xx = x + 10 + i * (w - 20) / 8;
    ctx.beginPath();
    ctx.moveTo(xx - 8, y - 8);
    ctx.lineTo(xx + 8, y + 8);
    ctx.stroke();
  }
  const knobX = x + map(value, 0, 20, 8, w - 8);
  drawChunkRect(knobX - 14, y - 42, 28, 30, 8, "#e86f61", "#9f3f3c", "rgba(101,76,45,.34)", 6);
  drawLabel(`${fmt(value)} Ω`, knobX - 22, y - 55, "#7d3e38");
  ctx.restore();
}

function drawCurrentDots(left, right, top, bottom, current) {
  if (current < 0.01) return;
  ctx.save();
  const speed = S.t * (0.35 + current);
  const points = [
    [left, bottom], [left, top], [right, top], [right, bottom], [left, bottom]
  ];
  const segments = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segments.push({ a, b, len, start: total });
    total += len;
  }
  for (let i = 0; i < 12; i++) {
    const d = ((speed * 150 + i * total / 12) % total + total) % total;
    const seg = segments.find(item => d >= item.start && d <= item.start + item.len) || segments[0];
    const p = (d - seg.start) / seg.len;
    const x = lerp(seg.a[0], seg.b[0], p);
    const y = lerp(seg.a[1], seg.b[1], p);
    ctx.fillStyle = "rgba(255,255,255,.78)";
    ctx.beginPath();
    ctx.arc(x, y, 3.2, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawUIGraph(x, y, w, h, state) {
  const originX = x + 30;
  const originY = y + h - 30;
  const plotW = w - 52;
  const plotH = h - 58;
  const maxU = 6;
  const maxI = 1.2;
  const endI = Math.min(maxI, maxU / S.values.resistance);
  const endU = endI * S.values.resistance;
  const pointI = clamp(state.current, 0, maxI);
  const pointU = clamp(state.resistorVoltage, 0, maxU);

  drawChunkRect(x, y, w, h, 10, "#f7fbff", "#d5dde2", "rgba(84,96,109,.22)", 7);
  ctx.save();
  ctx.strokeStyle = "#536170";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX, y + 18);
  ctx.moveTo(originX, originY);
  ctx.lineTo(x + w - 18, originY);
  ctx.stroke();
  ctx.strokeStyle = "#2f958e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + endI / maxI * plotW, originY - endU / maxU * plotH);
  ctx.stroke();
  drawBeveledCircle(originX + pointI / maxI * plotW, originY - pointU / maxU * plotH, 6, "#e86f61", "#9f3f3c", "#7d3e38");
  ctx.fillStyle = "#536170";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText("U-I", x + w - 46, y + 20);
  ctx.fillText("斜率 R", x + 38, y + 30);
  ctx.restore();
}

function forceState() {
  const f1 = S.values.forceA;
  const f2 = S.values.forceB;
  const thetaDeg = S.values.forceAngle;
  const half = thetaDeg * Math.PI / 360;
  const a1 = -half;
  const a2 = half;
  const v1 = { x: f1 * Math.cos(a1), y: f1 * Math.sin(a1) };
  const v2 = { x: f2 * Math.cos(a2), y: f2 * Math.sin(a2) };
  const sx = v1.x + v2.x;
  const sy = v1.y + v2.y;
  return {
    f1,
    f2,
    thetaDeg,
    theta: thetaDeg * Math.PI / 180,
    a1,
    a2,
    v1,
    v2,
    sum: { x: sx, y: sy },
    resultant: Math.hypot(sx, sy),
    direction: Math.atan2(sy, sx)
  };
}

function forceGeometry() {
  const W = S.cssW, H = S.cssH;
  const f = forceState();
  const origin = { x: W * 0.38, y: H * 0.46 };
  const scale = clamp(Math.min(W, H) * 0.052, 20, 34);
  const p1 = { x: origin.x + f.v1.x * scale, y: origin.y + f.v1.y * scale };
  const p2 = { x: origin.x + f.v2.x * scale, y: origin.y + f.v2.y * scale };
  const sum = { x: origin.x + f.sum.x * scale, y: origin.y + f.sum.y * scale };
  return { ...f, origin, p1, p2, sum, scale };
}

function drawForce() {
  const W = S.cssW, H = S.cssH;
  const g = forceGeometry();

  drawToyBase(W * 0.10, H * 0.68, W * 0.58, 46, "#6f6aa8");
  drawSlotMarks(W * 0.15, H * 0.708, W * 0.48, 9);
  drawChunkRect(W * 0.16, H * 0.23, W * 0.45, H * 0.34, 14, "#f7f1e8", "#bba17a", "rgba(101,76,45,.24)", 10);

  ctx.save();
  ctx.strokeStyle = "rgba(83,97,112,.16)";
  ctx.lineWidth = 2;
  for (let x = W * 0.18; x <= W * 0.59; x += 26) {
    ctx.beginPath();
    ctx.moveTo(x, H * 0.25);
    ctx.lineTo(x, H * 0.55);
    ctx.stroke();
  }
  for (let y = H * 0.26; y <= H * 0.55; y += 24) {
    ctx.beginPath();
    ctx.moveTo(W * 0.17, y);
    ctx.lineTo(W * 0.60, y);
    ctx.stroke();
  }

  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = "rgba(111,106,168,.42)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(g.p1.x, g.p1.y);
  ctx.lineTo(g.sum.x, g.sum.y);
  ctx.moveTo(g.p2.x, g.p2.y);
  ctx.lineTo(g.sum.x, g.sum.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  drawVectorScale(g.origin, g.p1, `F₁=${fmt(g.f1)}N`, "#6f6aa8");
  drawVectorScale(g.origin, g.p2, `F₂=${fmt(g.f2)}N`, "#d6a744");
  drawArrow(g.origin.x, g.origin.y, g.p1.x, g.p1.y, "#6f6aa8", 4);
  drawArrow(g.origin.x, g.origin.y, g.p2.x, g.p2.y, "#d6a744", 4);
  drawGlowLine(g.origin.x, g.origin.y, g.sum.x, g.sum.y, "rgba(232,111,97,.78)", 5);
  drawArrow(g.origin.x, g.origin.y, g.sum.x, g.sum.y, "#e86f61", 4);
  drawBeveledCircle(g.origin.x, g.origin.y, 17, "#f7efe5", "#b99768", "rgba(101,76,45,.34)");
  drawBeveledCircle(g.origin.x, g.origin.y, 8, "#6f6aa8", "#403d73", "rgba(255,255,255,.22)");

  ctx.save();
  ctx.strokeStyle = "rgba(232,111,97,.38)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(g.origin.x, g.origin.y, 54, g.a1, g.a2);
  ctx.stroke();
  ctx.restore();
  drawLabel(`θ=${fmt(g.thetaDeg, 0)}°`, g.origin.x + 38, g.origin.y - 56, "#7d3e38");
  drawLabel(`F合=${fmt(g.resultant)} N`, g.sum.x + 12, g.sum.y - 14, "#7d3e38");

  drawForcePanel(W * 0.70, H * 0.16, W * 0.21, H * 0.33, g);
  drawHotspotHints([
    { key: "vectorA", x: g.p1.x, y: g.p1.y, text: "拖动 F₁" },
    { key: "vectorB", x: g.p2.x, y: g.p2.y, text: "拖动 F₂" },
    { key: "angle", x: g.origin.x + 52, y: g.origin.y - 48, text: "拖动夹角" },
    { key: "resultant", x: g.sum.x, y: g.sum.y, text: "长按合力" }
  ]);
}

function drawVectorScale(origin, end, label, color) {
  const angle = Math.atan2(end.y - origin.y, end.x - origin.x);
  const len = Math.hypot(end.x - origin.x, end.y - origin.y);
  const x = origin.x + Math.cos(angle) * (len + 54);
  const y = origin.y + Math.sin(angle) * (len + 54);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  drawChunkRect(-52, -14, 104, 28, 14, "#f7fbff", "#cbd5dc", "rgba(84,96,109,.25)", 5);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 12, -7);
    ctx.lineTo(i * 12, 7);
    ctx.stroke();
  }
  drawBeveledCircle(-60, 0, 7, color, shadeColor(color, -22), "rgba(255,255,255,.18)");
  drawBeveledCircle(60, 0, 7, color, shadeColor(color, -22), "rgba(255,255,255,.18)");
  ctx.fillStyle = "#536170";
  ctx.font = "bold 11px Microsoft YaHei";
  ctx.fillText(label, -30, 4);
  ctx.restore();
}

function drawForcePanel(x, y, w, h, g) {
  drawChunkRect(x, y, w, h, 10, "#f7fbff", "#d5dde2", "rgba(84,96,109,.22)", 7);
  ctx.save();
  ctx.fillStyle = "#536170";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText("平行四边形定则", x + 18, y + 26);
  ctx.fillText("F² = F₁² + F₂²", x + 18, y + 56);
  ctx.fillText("+ 2F₁F₂cosθ", x + 38, y + 78);
  const barY = y + h - 62;
  const max = 16;
  [["F₁", g.f1, "#6f6aa8"], ["F₂", g.f2, "#d6a744"], ["F", g.resultant, "#e86f61"]].forEach(([label, value, color], i) => {
    const bx = x + 20 + i * ((w - 52) / 3);
    const bh = clamp(value / max, 0, 1) * 54;
    roundRect(bx, barY - bh, 20, bh, 5);
    const grad = ctx.createLinearGradient(bx, barY - bh, bx, barY);
    grad.addColorStop(0, "rgba(255,255,255,.62)");
    grad.addColorStop(.24, color);
    grad.addColorStop(1, shadeColor(color, -18));
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.fillStyle = "#536170";
    ctx.fillText(label, bx + 1, barY + 18);
  });
  ctx.restore();
}

function gasState() {
  const volume = S.values.gasVolume;
  const temp = S.values.gasTemp;
  const amount = S.values.gasAmount;
  const pressure = 100 * amount * (temp / 300) * (50 / volume);
  return {
    volume,
    temp,
    amount,
    pressure,
    pv: pressure * volume,
    constant: 5000 * amount * (temp / 300)
  };
}

function gasGeometry() {
  const W = S.cssW, H = S.cssH;
  const chamberX = W * 0.15;
  const chamberY = H * 0.38;
  const chamberW = W * 0.45;
  const chamberH = H * 0.15;
  const gasW = map(S.values.gasVolume, 20, 80, chamberW * 0.28, chamberW * 0.86);
  const pistonX = chamberX + gasW;
  return { chamberX, chamberY, chamberW, chamberH, gasW, pistonX };
}

function drawGas() {
  const W = S.cssW, H = S.cssH;
  const state = gasState();
  const g = gasGeometry();

  drawToyBase(W * 0.10, H * 0.68, W * 0.58, 46, "#e86f61");
  drawSlotMarks(W * 0.15, H * 0.708, W * 0.48, 9);
  drawGasParticles(g.chamberX + 12, g.chamberY + 10, g.gasW - 24, g.chamberH - 20, state);
  drawSyringe(g, state);

  ctx.save();
  ctx.strokeStyle = "rgba(83,97,112,.34)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(g.chamberX + g.chamberW * 0.18, g.chamberY + g.chamberH);
  ctx.bezierCurveTo(W * 0.44, H * 0.64, W * 0.62, H * 0.46, W * 0.73, H * 0.34);
  ctx.stroke();
  ctx.restore();

  drawRoundMeter(W * 0.76, H * 0.28, "p", state.pressure, "kPa", 260, "#e86f61");
  drawGasGraph(W * 0.70, H * 0.46, W * 0.21, H * 0.25, state);
  drawLabel(`pV ≈ ${fmt(state.pv, 0)} kPa·mL`, W * 0.10, H * 0.22, "#7d3e38");
  drawLabel(`T = ${fmt(state.temp, 0)} K`, W * 0.10, H * 0.29, "#236e69");
  drawHotspotHints([
    { key: "piston", x: g.pistonX, y: g.chamberY + g.chamberH / 2, text: "拖动活塞" },
    { key: "gauge", x: W * 0.76, y: H * 0.28, text: "拖动温度" },
    { key: "graph", x: W * 0.80, y: H * 0.58, text: "长按图像" }
  ]);
}

function drawSyringe(g, state) {
  ctx.save();
  drawOvalShadow(g.chamberX + g.chamberW / 2, g.chamberY + g.chamberH + 32, g.chamberW * 1.05, 28, 0.17);
  roundRect(g.chamberX, g.chamberY, g.chamberW, g.chamberH, 14);
  ctx.fillStyle = "rgba(126, 195, 220, .19)";
  ctx.fill();
  ctx.strokeStyle = "rgba(74,103,122,.42)";
  ctx.lineWidth = 3;
  ctx.stroke();

  const gasGrad = ctx.createLinearGradient(g.chamberX, g.chamberY, g.chamberX + g.gasW, g.chamberY + g.chamberH);
  gasGrad.addColorStop(0, "rgba(232,111,97,.20)");
  gasGrad.addColorStop(.6, "rgba(255,222,146,.34)");
  gasGrad.addColorStop(1, "rgba(232,111,97,.12)");
  roundRect(g.chamberX + 8, g.chamberY + 8, g.gasW - 16, g.chamberH - 16, 10);
  ctx.fillStyle = gasGrad;
  ctx.fill();

  ctx.strokeStyle = "rgba(83,97,112,.35)";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 8; i++) {
    const x = g.chamberX + 16 + i * (g.chamberW - 32) / 8;
    ctx.beginPath();
    ctx.moveTo(x, g.chamberY - 10);
    ctx.lineTo(x, g.chamberY + 6);
    ctx.stroke();
  }

  drawChunkRect(g.pistonX - 10, g.chamberY - 10, 20, g.chamberH + 20, 8, "#f7fbff", "#cbd5dc", "rgba(84,96,109,.28)", 6);
  drawPill3D(g.pistonX + 8, g.chamberY + g.chamberH / 2 - 7, g.chamberW - g.gasW + 58, 14, "#758795", "#46545e");
  drawChunkRect(g.chamberX + g.chamberW + 42, g.chamberY + g.chamberH / 2 - 28, 22, 56, 8, "#758795", "#46545e", "rgba(36,50,64,.24)", 6);
  ctx.restore();
  drawLabel(`${fmt(state.volume, 0)} mL`, g.chamberX + g.gasW / 2 - 24, g.chamberY - 20, "#7d3e38");
}

function drawGasParticles(x, y, w, h, state) {
  if (w <= 12 || h <= 12) return;
  const count = Math.round(map(state.amount, 0.7, 1.3, 15, 26));
  ctx.save();
  for (let i = 0; i < count; i++) {
    const px = x + ((i * 37 + Math.sin(S.t * 1.7 + i) * 9 + w * 4) % w);
    const py = y + ((i * 23 + Math.cos(S.t * 1.3 + i) * 7 + h * 4) % h);
    ctx.fillStyle = i % 3 === 0 ? "rgba(232,111,97,.76)" : "rgba(255,255,255,.82)";
    ctx.beginPath();
    ctx.arc(px, py, 3.1, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawGasGraph(x, y, w, h, state) {
  const originX = x + 30;
  const originY = y + h - 28;
  const plotW = w - 52;
  const plotH = h - 56;
  drawChunkRect(x, y, w, h, 10, "#f7fbff", "#d5dde2", "rgba(84,96,109,.22)", 7);
  ctx.save();
  ctx.strokeStyle = "#536170";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX, y + 18);
  ctx.moveTo(originX, originY);
  ctx.lineTo(x + w - 18, originY);
  ctx.stroke();

  ctx.strokeStyle = "#e86f61";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 60; i++) {
    const volume = lerp(20, 80, i / 60);
    const pressure = state.constant / volume;
    const px = originX + (volume - 20) / 60 * plotW;
    const py = originY - clamp(pressure / 260, 0, 1) * plotH;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  const pointX = originX + (state.volume - 20) / 60 * plotW;
  const pointY = originY - clamp(state.pressure / 260, 0, 1) * plotH;
  drawBeveledCircle(pointX, pointY, 6, "#e86f61", "#9f3f3c", "#7d3e38");
  ctx.fillStyle = "#536170";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText("p-V", x + w - 46, y + 20);
  ctx.fillText("pV=常量", x + 36, y + 32);
  ctx.restore();
}

function resistivityState() {
  const rho = 4.8e-7;
  const length = S.values.wireLength;
  const diameterM = S.values.wireDiameter / 1000;
  const area = Math.PI * diameterM * diameterM / 4;
  const resistance = rho * length / area;
  const current = S.values.wireVoltage / Math.max(resistance, 0.0001);
  return {
    rho,
    length,
    diameterM,
    area,
    resistance,
    current,
    rhoMeasured: resistance * area / length
  };
}

function resistivityGeometry() {
  const W = S.cssW, H = S.cssH;
  const wireX = W * 0.15;
  const wireY = H * 0.42;
  const wireW = map(S.values.wireLength, 0.2, 1.2, W * 0.18, W * 0.48);
  return { wireX, wireY, wireW };
}

function drawResistivity() {
  const W = S.cssW, H = S.cssH;
  const state = resistivityState();
  const g = resistivityGeometry();

  drawToyBase(W * 0.10, H * 0.68, W * 0.58, 46, "#d6a744");
  drawSlotMarks(W * 0.15, H * 0.708, W * 0.48, 9);
  drawWireBench(g, state);
  drawMicrometer(W * 0.70, H * 0.23, state);
  drawRoundMeter(W * 0.23, H * 0.23, "A", state.current, "A", 1.2, "#2f958e");
  drawRoundMeter(W * 0.40, H * 0.23, "V", S.values.wireVoltage, "V", 4.0, "#427aa1");
  drawResistivityPanel(W * 0.70, H * 0.49, W * 0.22, H * 0.23, state);
  drawLabel(`R = ${fmt(state.resistance)} Ω`, W * 0.10, H * 0.18, "#8a6826");
  drawLabel(`ρ = ${fmt(state.rhoMeasured * 1e8)}×10⁻⁸ Ω·m`, W * 0.10, H * 0.31, "#7d3e38");
  drawHotspotHints([
    { key: "wire", x: g.wireX + g.wireW / 2, y: g.wireY, text: "拖动金属丝" },
    { key: "micrometer", x: W * 0.78, y: H * 0.30, text: "拖动测直径" },
    { key: "meters", x: W * 0.32, y: H * 0.23, text: "拖动电压" },
    { key: "formula", x: W * 0.81, y: H * 0.60, text: "长按公式" }
  ]);
}

function drawWireBench(g, state) {
  const wireThickness = map(S.values.wireDiameter, 0.2, 0.8, 3, 9);
  drawChunkRect(g.wireX - 20, g.wireY + 56, g.wireW + 40, 26, 9, "#758795", "#46545e", "rgba(36,50,64,.25)", 7);
  drawChunkRect(g.wireX - 8, g.wireY - 28, 16, 86, 7, "#f4e7d0", "#b99768", "rgba(101,76,45,.25)", 5);
  drawChunkRect(g.wireX + g.wireW - 8, g.wireY - 28, 16, 86, 7, "#f4e7d0", "#b99768", "rgba(101,76,45,.25)", 5);
  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(117,79,17,.35)";
  ctx.lineWidth = wireThickness + 8;
  ctx.beginPath();
  ctx.moveTo(g.wireX, g.wireY);
  ctx.lineTo(g.wireX + g.wireW, g.wireY);
  ctx.stroke();
  const grad = ctx.createLinearGradient(g.wireX, g.wireY, g.wireX + g.wireW, g.wireY);
  grad.addColorStop(0, "#fff3b0");
  grad.addColorStop(.25, "#d6a744");
  grad.addColorStop(.74, "#9d7a2d");
  grad.addColorStop(1, "#fff2aa");
  ctx.strokeStyle = grad;
  ctx.lineWidth = wireThickness;
  ctx.beginPath();
  ctx.moveTo(g.wireX, g.wireY);
  ctx.lineTo(g.wireX + g.wireW, g.wireY);
  ctx.stroke();
  ctx.strokeStyle = "rgba(83,97,112,.35)";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 10; i++) {
    const x = g.wireX + i * g.wireW / 10;
    ctx.beginPath();
    ctx.moveTo(x, g.wireY + 38);
    ctx.lineTo(x, g.wireY + (i % 5 === 0 ? 56 : 49));
    ctx.stroke();
  }
  ctx.restore();
  drawLabel(`L = ${fmt(state.length)} m`, g.wireX + g.wireW / 2 - 34, g.wireY + 98, "#8a6826");
}

function drawMicrometer(x, y, state) {
  ctx.save();
  drawChunkRect(x - 78, y + 18, 156, 34, 12, "#758795", "#46545e", "rgba(36,50,64,.25)", 7);
  drawChunkRect(x - 76, y - 22, 40, 82, 12, "#f7fbff", "#cbd5dc", "rgba(84,96,109,.28)", 7);
  drawPill3D(x - 16, y + 2, 92, 18, "#f4e7d0", "#b99768");
  drawChunkRect(x + 48, y - 14, 60, 48, 12, "#d6a744", "#8f6725", "rgba(101,76,45,.32)", 7);
  ctx.strokeStyle = "rgba(83,97,112,.42)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.moveTo(x + 54 + i * 7, y - 8);
    ctx.lineTo(x + 54 + i * 7, y + 28);
    ctx.stroke();
  }
  drawBeveledCircle(x - 14, y + 11, map(S.values.wireDiameter, 0.2, 0.8, 5, 12), "#d6a744", "#8f6725", "rgba(101,76,45,.3)");
  ctx.restore();
  drawLabel(`d = ${fmt(S.values.wireDiameter)} mm`, x - 44, y - 34, "#8a6826");
  drawLabel(`S = ${fmt(state.area * 1e6)} mm²`, x - 44, y + 82, "#236e69");
}

function drawResistivityPanel(x, y, w, h, state) {
  drawChunkRect(x, y, w, h, 10, "#f7fbff", "#d5dde2", "rgba(84,96,109,.22)", 7);
  ctx.save();
  ctx.fillStyle = "#536170";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText("ρ = RS / L", x + 18, y + 28);
  ctx.fillText("S = πd² / 4", x + 18, y + 54);
  const originX = x + 34;
  const originY = y + h - 28;
  const plotW = w - 58;
  const plotH = h - 90;
  ctx.strokeStyle = "#536170";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX, y + 76);
  ctx.moveTo(originX, originY);
  ctx.lineTo(x + w - 18, originY);
  ctx.stroke();
  ctx.strokeStyle = "#d6a744";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + plotW, originY - plotH);
  ctx.stroke();
  const px = originX + clamp((state.length - 0.2) / 1.0, 0, 1) * plotW;
  const py = originY - clamp(state.resistance / 8, 0, 1) * plotH;
  drawBeveledCircle(px, py, 5, "#e86f61", "#9f3f3c", "#7d3e38");
  ctx.restore();
}

function lensState() {
  const u = S.values.objectDistance;
  const f = S.values.focalLength;
  const realImage = u > f + 0.01;
  const v = realImage ? (u * f) / (u - f) : null;
  const screenDistance = realImage ? v + S.values.screenOffset : 52 + S.values.screenOffset;
  const blur = realImage ? Math.abs(S.values.screenOffset) : 18;
  return {
    u,
    f,
    realImage,
    v,
    screenDistance,
    blur,
    sharpness: clamp(100 - blur * 6, 0, 100),
    magnification: realImage ? v / u : 0
  };
}

function lensGeometry() {
  const W = S.cssW, H = S.cssH;
  const state = lensState();
  const axisY = H * 0.45;
  const lensX = W * 0.47;
  const scale = clamp(Math.min(W * 0.0061, H * 0.010), 2.1, 5.9);
  const candleX = clamp(lensX - state.u * scale, W * 0.08, W * 0.40);
  const idealImageX = state.realImage ? lensX + state.v * scale : lensX + W * 0.20;
  const screenX = clamp(lensX + state.screenDistance * scale, W * 0.58, W * 0.88);
  return { ...state, axisY, lensX, scale, candleX, idealImageX, screenX };
}

function drawLens() {
  const W = S.cssW, H = S.cssH;
  const g = lensGeometry();

  drawToyBase(W * 0.08, H * 0.68, W * 0.84, 46, "#427aa1");
  drawSlotMarks(W * 0.12, H * 0.708, W * 0.76, 12);
  drawTrack3D(W * 0.12, g.axisY + 98, W * 0.88);
  ctx.save();
  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = "rgba(83,97,112,.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W * 0.10, g.axisY);
  ctx.lineTo(W * 0.90, g.axisY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  const objH = H * 0.16;
  const objTop = { x: g.candleX, y: g.axisY - objH };
  const imageH = g.realImage ? clamp(objH * g.magnification, H * 0.05, H * 0.23) : 0;
  const imageTop = { x: g.idealImageX, y: g.axisY + imageH };

  drawCandle(g.candleX, g.axisY + 88, objH);
  drawLensElement(g.lensX, g.axisY, H * 0.30, g.f);
  drawScreen(g.screenX, g.axisY, H * 0.32);
  drawLensRays(g, objTop, imageTop);
  drawScreenImage(g, imageH);
  drawLensPanel(W * 0.70, H * 0.16, W * 0.21, H * 0.23, g);

  drawLabel(`u=${fmt(g.u, 0)} cm`, g.candleX - 36, g.axisY + 130, "#7d3e38");
  drawLabel(`f=${fmt(g.f, 1)} cm`, g.lensX - 28, g.axisY - H * 0.20, "#236e69");
  drawLabel(g.realImage ? `v=${fmt(g.v, 1)} cm` : "u≤f：无实像", g.lensX + 30, g.axisY + 130, g.realImage ? "#236e69" : "#7d3e38");
  drawHotspotHints([
    { key: "candle", x: g.candleX, y: g.axisY - objH * 0.55, text: "拖动物距" },
    { key: "lens", x: g.lensX, y: g.axisY, text: "拖动焦距" },
    { key: "screen", x: g.screenX, y: g.axisY, text: "拖动光屏" },
    { key: "graph", x: W * 0.81, y: H * 0.26, text: "长按公式" }
  ]);
}

function drawCandle(x, baseY, h) {
  drawOvalShadow(x, baseY + 10, 70, 18, 0.18);
  drawChunkRect(x - 16, baseY - h, 32, h, 8, "#f4e7d0", "#b99768", "rgba(101,76,45,.28)", 7);
  const flameY = baseY - h - 16;
  ctx.save();
  const grad = ctx.createRadialGradient(x, flameY, 2, x, flameY, 26);
  grad.addColorStop(0, "rgba(255,255,255,.95)");
  grad.addColorStop(.28, "rgba(255,224,92,.86)");
  grad.addColorStop(1, "rgba(232,111,97,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(x, flameY, 18, 30, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#e86f61";
  ctx.beginPath();
  ctx.moveTo(x, flameY - 24);
  ctx.bezierCurveTo(x + 18, flameY - 6, x + 8, flameY + 16, x, flameY + 20);
  ctx.bezierCurveTo(x - 11, flameY + 8, x - 14, flameY - 9, x, flameY - 24);
  ctx.fill();
  ctx.restore();
}

function drawLensElement(x, axisY, h, focalLength) {
  ctx.save();
  drawOvalShadow(x, axisY + h / 2 + 42, 86, 20, 0.15);
  drawChunkRect(x - 10, axisY + h / 2, 20, 110, 8, "#758795", "#46545e", "rgba(36,50,64,.25)", 6);
  const w = map(focalLength, 8, 22, 54, 36);
  const grad = ctx.createLinearGradient(x - w / 2, axisY - h / 2, x + w / 2, axisY + h / 2);
  grad.addColorStop(0, "rgba(255,255,255,.18)");
  grad.addColorStop(.48, "rgba(126,195,220,.42)");
  grad.addColorStop(1, "rgba(66,122,161,.22)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(x, axisY - h / 2);
  ctx.bezierCurveTo(x + w / 2, axisY - h * .28, x + w / 2, axisY + h * .28, x, axisY + h / 2);
  ctx.bezierCurveTo(x - w / 2, axisY + h * .28, x - w / 2, axisY - h * .28, x, axisY - h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(66,122,161,.55)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function drawScreen(x, axisY, h) {
  drawChunkRect(x - 11, axisY - h / 2, 22, h, 7, "#f7fbff", "#cbd5dc", "rgba(84,96,109,.28)", 7);
  drawChunkRect(x - 38, axisY + h / 2, 76, 22, 9, "#758795", "#46545e", "rgba(36,50,64,.25)", 6);
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.76)";
  roundRect(x - 7, axisY - h / 2 + 12, 14, h - 24, 5);
  ctx.fill();
  ctx.restore();
}

function drawLensRays(g, objTop, imageTop) {
  ctx.save();
  ctx.globalAlpha = g.realImage ? 1 : 0.68;
  const color = "rgba(245,210,80,.86)";
  if (g.realImage) {
    drawGlowLine(objTop.x, objTop.y, g.lensX, objTop.y, color, 3);
    drawGlowLine(g.lensX, objTop.y, imageTop.x, imageTop.y, color, 3);
    drawGlowLine(objTop.x, objTop.y, g.lensX, g.axisY, "rgba(232,111,97,.78)", 3);
    drawGlowLine(g.lensX, g.axisY, imageTop.x, imageTop.y, "rgba(232,111,97,.78)", 3);
    drawGlowLine(objTop.x, objTop.y, g.lensX, g.axisY - (g.axisY - objTop.y) * 0.42, "rgba(66,122,161,.78)", 3);
    drawGlowLine(g.lensX, g.axisY - (g.axisY - objTop.y) * 0.42, imageTop.x, imageTop.y, "rgba(66,122,161,.78)", 3);
  } else {
    drawGlowLine(objTop.x, objTop.y, g.lensX, objTop.y, color, 3);
    drawGlowLine(g.lensX, objTop.y, g.lensX + 170, objTop.y - 38, color, 3);
    drawGlowLine(objTop.x, objTop.y, g.lensX, g.axisY, "rgba(232,111,97,.78)", 3);
    drawGlowLine(g.lensX, g.axisY, g.lensX + 160, g.axisY + 28, "rgba(232,111,97,.78)", 3);
  }
  ctx.restore();
}

function drawScreenImage(g, imageH) {
  if (!g.realImage) {
    drawLabel("光屏接不到实像", g.screenX - 64, g.axisY - 44, "#7d3e38");
    return;
  }
  const offsetPx = (g.screenX - g.idealImageX) * 0.18;
  const alpha = 0.35 + g.sharpness / 180;
  const spread = map(g.blur, 0, 18, 0, 18);
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let i = 0; i < 5; i++) {
    const dx = (i - 2) * spread * 0.42 + offsetPx;
    const dy = Math.sin(i) * spread * 0.18;
    ctx.fillStyle = i === 2 ? "#e86f61" : "rgba(232,111,97,.38)";
    ctx.beginPath();
    ctx.moveTo(g.screenX + dx, g.axisY + imageH * 0.72 + dy);
    ctx.bezierCurveTo(g.screenX + 12 + dx, g.axisY + imageH * 0.30 + dy, g.screenX + 6 + dx, g.axisY - 6 + dy, g.screenX + dx, g.axisY - imageH * 0.12 + dy);
    ctx.bezierCurveTo(g.screenX - 8 + dx, g.axisY + imageH * 0.28 + dy, g.screenX - 11 + dx, g.axisY + imageH * 0.56 + dy, g.screenX + dx, g.axisY + imageH * 0.72 + dy);
    ctx.fill();
  }
  ctx.restore();
  drawLabel(`清晰度 ${fmt(g.sharpness, 0)}%`, g.screenX - 50, g.axisY - imageH - 22, g.sharpness > 70 ? "#236e69" : "#7d3e38");
}

function drawLensPanel(x, y, w, h, g) {
  drawChunkRect(x, y, w, h, 10, "#f7fbff", "#d5dde2", "rgba(84,96,109,.22)", 7);
  ctx.save();
  ctx.fillStyle = "#536170";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText("1/f = 1/u + 1/v", x + 16, y + 28);
  ctx.fillText(g.realImage ? `v = ${fmt(g.v, 1)} cm` : "u≤f 时成虚像", x + 16, y + 56);
  ctx.strokeStyle = "#427aa1";
  ctx.lineWidth = 3;
  const axisY = y + h - 38;
  ctx.beginPath();
  ctx.moveTo(x + 18, axisY);
  ctx.lineTo(x + w - 18, axisY);
  ctx.stroke();
  const ux = x + 42;
  const vx = x + w - 42;
  drawArrow(ux, axisY - 38, ux, axisY + 1, "#e86f61", 2);
  drawArrow((ux + vx) / 2, axisY - 48, vx, axisY + 1, "#d6a744", 2);
  drawBeveledCircle((ux + vx) / 2, axisY, 7, "#427aa1", "#2e536e", "rgba(255,255,255,.18)");
  ctx.restore();
}

function drawHotspotHints(items) {
  ctx.save();
  ctx.font = "12px Microsoft YaHei";
  const compact = S.cssW < 520;
  items.forEach(item => {
    const hover = item.key === S.hoverHotspot || item.key === S.activeHotspot;
    const pulse = 0.5 + Math.sin(S.t * 3) * 0.18;
    const radius = hover ? 25 : 19;
    const accent = S.current.accent || "#2f958e";
    ctx.fillStyle = `rgba(255,255,255,${hover ? 0.92 : 0.62 + pulse * .2})`;
    ctx.beginPath();
    ctx.arc(item.x, item.y, radius, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = hover ? accent : `rgba(47,149,142,${0.32 + pulse * .28})`;
    ctx.lineWidth = hover ? 3 : 2;
    ctx.stroke();
    if (hover) {
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = "rgba(255,255,255,.82)";
      ctx.beginPath();
      ctx.arc(item.x, item.y, radius + 7, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (compact && !hover) return;
    const text = hover ? "拖动调节 / 步骤解析" : item.text;
    const metrics = ctx.measureText(text);
    let tx = item.x + radius + 10;
    if (tx + metrics.width + 16 > S.cssW - 10) tx = item.x - radius - metrics.width - 26;
    const ty = clamp(item.y + 4, 24, S.cssH - 14);
    roundRect(tx - 8, ty - 18, metrics.width + 16, 24, 6);
    ctx.fillStyle = hover ? "rgba(255,255,255,.94)" : "rgba(255,255,255,.72)";
    ctx.fill();
    ctx.fillStyle = hover ? "rgba(36,50,64,.86)" : "rgba(36,50,64,.62)";
    ctx.fillText(text, tx, ty);
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
  if (id === "spring") {
    const state = springState();
    const standX = W * 0.31;
    const springTop = H * 0.17 + 46;
    const naturalPx = map(S.values.naturalLength, 8, 18, H * 0.13, H * 0.22);
    const extensionPx = clamp(state.extension * H * 0.82, 12, H * 0.31);
    const springBottom = springTop + naturalPx + extensionPx;
    const loadH = map(S.values.loadMass, 0.05, 0.35, 42, 64);
    const loadY = springBottom + 18;
    spots.push(
      ["spring", standX, lerp(springTop, springBottom, .45), 82],
      ["load", standX, loadY + loadH / 2, 86],
      ["graph", W * 0.76, H * 0.34, 96]
    );
  }
  if (id === "energy") {
    const e = energyState();
    const track = energyTrackPoints();
    const ball = cubicPoint(track.p0, track.p1, track.p2, track.p3, e.progress);
    spots.push(
      ["ball", ball.x, ball.y, 76],
      ["energy", W * 0.80, H * 0.36, 96],
      ["loss", W * 0.79, H * 0.58, 88]
    );
  }
  if (id === "resistance") {
    spots.push(
      ["rheostat", W * 0.53, H * 0.62, 82],
      ["graph", W * 0.80, H * 0.34, 86],
      ["resistor", W * 0.50, H * 0.28, 94],
      ["meters", W * 0.47, H * 0.36, 82]
    );
  }
  if (id === "force") {
    const g = forceGeometry();
    spots.push(
      ["vectorA", g.p1.x, g.p1.y, 78],
      ["vectorB", g.p2.x, g.p2.y, 78],
      ["angle", g.origin.x + 52, g.origin.y - 48, 76],
      ["resultant", g.sum.x, g.sum.y, 82]
    );
  }
  if (id === "gas") {
    const g = gasGeometry();
    spots.push(
      ["piston", g.pistonX, g.chamberY + g.chamberH / 2, 88],
      ["gauge", W * 0.76, H * 0.28, 86],
      ["graph", W * 0.80, H * 0.58, 92]
    );
  }
  if (id === "resistivity") {
    const g = resistivityGeometry();
    spots.push(
      ["wire", g.wireX + g.wireW / 2, g.wireY, 88],
      ["micrometer", W * 0.78, H * 0.30, 92],
      ["meters", W * 0.32, H * 0.23, 92],
      ["formula", W * 0.81, H * 0.60, 86]
    );
  }
  if (id === "lens") {
    const g = lensGeometry();
    spots.push(
      ["candle", g.candleX, g.axisY - H * 0.08, 86],
      ["lens", g.lensX, g.axisY, 92],
      ["screen", g.screenX, g.axisY, 92],
      ["graph", W * 0.81, H * 0.26, 82]
    );
  }
  const hit = spots
    .map(([key, sx, sy, r]) => ({ key, distance: Math.hypot(x - sx, y - sy), r }))
    .filter(item => item.distance <= item.r)
    .sort((a, b) => (a.distance / a.r) - (b.distance / b.r))[0];
  return hit?.key || null;
}

function canvasPoint(evt) {
  const rect = canvas.getBoundingClientRect();
  const source = evt.touches ? evt.touches[0] : evt;
  return {
    x: (source.clientX - rect.left) * (S.cssW / rect.width),
    y: (source.clientY - rect.top) * (S.cssH / rect.height)
  };
}

function updateCanvasTilt(x, y) {
  S.pointer.x = clamp(x / S.cssW, 0, 1);
  S.pointer.y = clamp(y / S.cssH, 0, 1);
  if (!canvasWrap) return;
  const tiltX = S.view.pitch + (0.5 - S.pointer.y) * 1.4;
  const tiltY = S.view.yaw + (S.pointer.x - 0.5) * 1.8;
  canvasWrap.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
  canvasWrap.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
  canvasWrap.style.setProperty("--light-x", `${(S.pointer.x * 100).toFixed(1)}%`);
  canvasWrap.style.setProperty("--light-y", `${(S.pointer.y * 100).toFixed(1)}%`);
}

function resetCanvasTilt() {
  updateCanvasTilt(S.cssW / 2, S.cssH / 2);
}

function setHoverHotspot(hot) {
  if (hot === S.hoverHotspot) return;
  S.hoverHotspot = hot;
  canvas.classList.toggle("hotspot", Boolean(hot));
  if (hot) setKnowledgeForHotspot(hot);
  draw();
}

function beginPointer(evt) {
  const p = canvasPoint(evt);
  updateCanvasTilt(p.x, p.y);
  const hot = getHotspotAt(p.x, p.y);
  setHoverHotspot(hot);
  S.activeHotspot = hot;
  if (hot) {
    setKnowledgeForHotspot(hot, true);
    clearTimeout(S.longPressTimer);
    S.longPressTimer = setTimeout(() => {
      setKnowledgeForHotspot(hot, true);
    }, 450);
  }
  S.dragTarget = inferDragTarget(p.x, p.y, hot);
  S.dragMode = S.dragTarget ? "control" : "view";
  S.dragStart = { x: p.x, y: p.y, yaw: S.view.yaw, pitch: S.view.pitch };
  canvas.classList.add("dragging");
  canvas.classList.toggle("orbiting", S.dragMode === "view");
  if (canvasWrap) canvasWrap.classList.toggle("orbiting", S.dragMode === "view");
}

function movePointer(evt) {
  const p = canvasPoint(evt);
  updateCanvasTilt(p.x, p.y);
  const hot = getHotspotAt(p.x, p.y);
  setHoverHotspot(hot);
  if (S.longPressTimer && S.dragStart && Math.hypot(p.x - S.dragStart.x, p.y - S.dragStart.y) > 12) {
    clearTimeout(S.longPressTimer);
    S.longPressTimer = null;
  }
  if (!S.dragMode) return;
  if (S.dragMode === "view" && S.dragStart) {
    const dx = (p.x - S.dragStart.x) / S.cssW;
    const dy = (p.y - S.dragStart.y) / S.cssH;
    S.view.yaw = clamp(S.dragStart.yaw + dx * 14, -8, 8);
    S.view.pitch = clamp(S.dragStart.pitch - dy * 10, -5, 5);
    updateCanvasTilt(p.x, p.y);
    return;
  }
  if (!S.dragTarget) return;
  applyDrag(S.dragTarget, p.x, p.y);
  updateControlOutputs();
  resetSoft();
  renderErrorPanel();
  draw();
  updateLiveStrip();
}

function endPointer() {
  clearTimeout(S.longPressTimer);
  S.longPressTimer = null;
  S.dragMode = null;
  S.dragTarget = null;
  S.dragStart = null;
  S.activeHotspot = null;
  canvas.classList.remove("dragging");
  canvas.classList.remove("orbiting");
  if (canvasWrap) canvasWrap.classList.remove("orbiting");
  if (!canvas.matches(":hover")) S.hoverHotspot = null;
  canvas.classList.toggle("hotspot", Boolean(S.hoverHotspot));
  resetCanvasTilt();
  draw();
}

function leaveCanvas() {
  if (!S.dragMode) {
    setHoverHotspot(null);
    resetCanvasTilt();
  }
}

function inferDragTarget(x, y, hot = getHotspotAt(x, y)) {
  const id = S.current.id;
  if (id === "newton") return hot === "cart" || hot === "force" ? "force" : null;
  if (id === "projectile") {
    if (hot === "ball" || hot === "vector") return "speed";
    if (hot === "target") return "height";
    return null;
  }
  if (id === "pendulum") {
    if (hot === "angle" || hot === "bob") return "angle";
    if (hot === "timer") return "length";
    return null;
  }
  if (id === "optics") {
    if (hot === "ray" || hot === "normal") return "angle";
    if (hot === "fringe") return "wavelength";
    return null;
  }
  if (id === "induction") {
    if (hot === "magnet") return "magnetSpeed";
    if (hot === "coil") return "turns";
    if (hot === "current") return "field";
    return null;
  }
  if (id === "spring") {
    if (hot === "load") return "loadMass";
    if (hot === "spring") return "springK";
    if (hot === "graph") return "naturalLength";
    return null;
  }
  if (id === "energy") {
    if (hot === "ball") return "height";
    if (hot === "energy") return "mass";
    if (hot === "loss") return "loss";
    return null;
  }
  if (id === "resistance") {
    if (hot === "resistor") return "resistance";
    if (hot === "meters") return "voltage";
    if (hot === "rheostat") return "rheostat";
    return null;
  }
  if (id === "force") {
    if (hot === "vectorA") return "forceA";
    if (hot === "vectorB") return "forceB";
    if (hot === "angle" || hot === "resultant") return "forceAngle";
    return null;
  }
  if (id === "gas") {
    if (hot === "piston") return "gasVolume";
    if (hot === "gauge") return "gasTemp";
    if (hot === "graph") return "gasAmount";
    return null;
  }
  if (id === "resistivity") {
    if (hot === "wire") return "wireLength";
    if (hot === "micrometer") return "wireDiameter";
    if (hot === "meters") return "wireVoltage";
    return null;
  }
  if (id === "lens") {
    if (hot === "candle") return "objectDistance";
    if (hot === "lens") return "focalLength";
    if (hot === "screen") return "screenOffset";
    return null;
  }
  return null;
}

function applyDrag(key, x, y) {
  const control = S.current.controls.find(item => item.key === key);
  if (!control) return;
  let ratio = clamp(x / S.cssW, 0, 1);
  if (["height", "length", "field", "springK", "loadMass", "mass", "voltage", "gasTemp", "wireDiameter", "wireVoltage", "focalLength"].includes(key)) ratio = clamp(1 - y / S.cssH, 0, 1);
  if (["angle", "wavelength", "magnetSpeed", "turns", "naturalLength", "loss", "resistance", "rheostat", "force", "speed", "forceA", "forceB", "forceAngle", "gasVolume", "gasAmount", "wireLength", "objectDistance", "screenOffset"].includes(key)) ratio = clamp(x / S.cssW, 0, 1);
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
    showToast("书页已打开。悬停或点击器材会切换步骤知识点。");
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
    renderErrorPanel();
    draw();
    updateLiveStrip();
  });

  idealModeBtn.addEventListener("click", () => setMode("ideal"));
  realModeBtn.addEventListener("click", () => setMode("real"));
  errorToggleBtn.addEventListener("click", () => {
    S.errorPanelOpen = !S.errorPanelOpen;
    renderModeControls();
    showToast(S.errorPanelOpen ? "误差分析已展开。" : "误差分析已收起。");
  });

  playBtn.addEventListener("click", play);
  pauseBtn.addEventListener("click", pause);
  resetBtn.addEventListener("click", () => resetSimulation(true));

  canvas.addEventListener("mousedown", beginPointer);
  canvas.addEventListener("mousemove", movePointer);
  canvas.addEventListener("mouseleave", leaveCanvas);
  window.addEventListener("mouseup", endPointer);
  canvas.addEventListener("touchstart", event => { event.preventDefault(); beginPointer(event); }, { passive: false });
  canvas.addEventListener("touchmove", event => { event.preventDefault(); movePointer(event); }, { passive: false });
  window.addEventListener("touchend", endPointer);
  window.addEventListener("touchcancel", endPointer);

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
  renderModeControls();
  updateLiveStrip();
  bindEvents();
  requestAnimationFrame(resizeCanvas);
}

init();
