const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");
const stageWrap = document.getElementById("stageWrap");

const coverScene = document.getElementById("coverScene");
const lab = document.getElementById("lab");
const openBookBtn = document.getElementById("openBookBtn");
const homeBtn = document.getElementById("homeBtn");
const catalogBtn = document.getElementById("catalogBtn");
const catalog = document.getElementById("catalog");
const universityBtn = document.getElementById("universityBtn");
const universityPanel = document.getElementById("universityPanel");
const closeUniversityBtn = document.getElementById("closeUniversityBtn");
const universityContent = document.getElementById("universityContent");

const flagshipList = document.getElementById("flagshipList");
const fullCatalogList = document.getElementById("fullCatalogList");
const controlsEl = document.getElementById("controls");
const metricRibbon = document.getElementById("metricRibbon");
const layerName = document.getElementById("layerName");
const sceneTitle = document.getElementById("sceneTitle");
const experimentLayer = document.getElementById("experimentLayer");
const experimentTitle = document.getElementById("experimentTitle");
const experimentBrief = document.getElementById("experimentBrief");
const knowledgeCard = document.getElementById("knowledgeCard");
const knowledgeTag = document.getElementById("knowledgeTag");
const conclusionText = document.getElementById("conclusionText");
const conclusionPill = document.getElementById("conclusionPill");
const statePill = document.getElementById("statePill");
const pauseOverlay = document.getElementById("pauseOverlay");
const viewReadout = document.getElementById("viewReadout");
const resetViewBtn = document.getElementById("resetViewBtn");
const hoverTip = document.getElementById("hoverTip");
const diagnosticsPill = document.getElementById("diagnosticsPill");
const diagnosticsList = document.getElementById("diagnosticsList");
const manualCard = document.getElementById("manualCard");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const toast = document.getElementById("toast");

const TAU = Math.PI * 2;

const experiments = [
  {
    id: "stack",
    icon: "L",
    layer: "分层模型",
    title: "协议栈封装与解封装",
    brief: "把应用数据一路加上 TCP、IP、以太网头部，再在接收端逐层拆开的过程立体化。",
    accent: "#2f9c9a",
    duration: 8,
    controls: [
      { key: "payload", label: "应用数据大小", min: 128, max: 4096, step: 64, value: 1024, unit: "B" },
      { key: "mtu", label: "链路 MTU", min: 576, max: 1500, step: 4, value: 1500, unit: "B" },
      { key: "headerDepth", label: "协议层数", min: 3, max: 5, step: 1, value: 5, unit: "层" }
    ],
    overview: {
      title: "先看数据怎么穿上协议外衣",
      body: "应用层只关心消息内容，传输层加端口，网络层加 IP，链路层加 MAC。每一层只处理自己负责的头部，这就是分层的力量。",
      formula: "以太网帧 ≈ Payload + TCP(20B) + IP(20B) + Ethernet(18B)"
    },
    conclusion: "封装不是把数据改掉，而是在不同层增加控制信息。MTU 限制单个链路层帧的最大负载，数据过大时必须分片或让上层控制报文大小。",
    cards: {
      app: {
        label: "应用数据",
        title: "应用层只描述要交换什么",
        body: "浏览器、聊天软件或文件传输程序产生的是应用数据。它不直接知道网卡地址，也不关心中间经过多少路由器。",
        formula: "应用数据 -> 交给传输层"
      },
      headers: {
        label: "协议头部",
        title: "头部是协议之间的便签",
        body: "TCP 头部包含端口和序号，IP 头部包含源/目的 IP，以太网头部包含源/目的 MAC。每一层读自己的字段。",
        formula: "Header(layer n) + PDU(layer n+1)"
      },
      mtu: {
        label: "MTU",
        title: "链路一次能背多少数据",
        body: "MTU 是链路层能承载的最大帧负载。超过时会触发 IP 分片，或由路径 MTU 发现让发送端减小报文。",
        formula: "fragments = ceil((payload + headers) / MTU)"
      },
      packet: {
        label: "数据包",
        title: "同一份数据在不同层有不同名字",
        body: "传输层常称 segment，网络层称 packet/datagram，链路层称 frame。名字变了，是因为观察角度变了。",
        formula: "Segment -> Packet -> Frame"
      }
    },
    university: {
      fields: ["TCP: src port, dst port, seq, ack, flags, window", "IPv4: version, IHL, total length, TTL, protocol, checksum", "Ethernet II: dst MAC, src MAC, EtherType, FCS"],
      formulas: ["封装开销率 = headers / (payload + headers)", "IPv4 最大总长度 65535B，链路 MTU 通常更小", "MSS 通常约等于 MTU - IP头 - TCP头"],
      notes: ["真实网络中更常见的是 TCP 通过 MSS 避免 IP 分片。", "路由器转发 IP 包时会重写二层头部，但三层目的地址不变。"]
    }
  },
  {
    id: "ethernet",
    icon: "S",
    layer: "数据链路层",
    title: "以太网交换、MAC 学习与 ARP",
    brief: "观察交换机怎样从源 MAC 学习端口，ARP 请求为什么先广播，回应之后怎样变成单播。",
    accent: "#3f78b5",
    duration: 9,
    controls: [
      { key: "hosts", label: "主机数量", min: 3, max: 8, step: 1, value: 5, unit: "台" },
      { key: "arpRate", label: "ARP 请求频率", min: 1, max: 6, step: 1, value: 3, unit: "次/轮" },
      { key: "tableSize", label: "MAC 表容量", min: 4, max: 64, step: 4, value: 24, unit: "项" }
    ],
    overview: {
      title: "广播先问路，单播再直达",
      body: "主机只知道目标 IP 时，需要用 ARP 查询目标 MAC。交换机初期不知道 MAC 在哪个端口，会泛洪；学习后就只转发到正确端口。",
      formula: "ARP: Who has IP? Tell sender."
    },
    conclusion: "交换机根据源 MAC 学习端口，根据目的 MAC 查表转发。ARP 请求是广播，ARP 应答通常是单播；MAC 表命中后，普通数据帧不再向所有端口泛洪。",
    cards: {
      switch: {
        label: "交换机",
        title: "交换机从源地址学习",
        body: "收到帧时，交换机把源 MAC 和入端口写入表。下一次看见目的 MAC，就能把帧只送到对应端口。",
        formula: "MAC -> port"
      },
      arp: {
        label: "ARP 广播",
        title: "不知道 MAC 时只能广播提问",
        body: "ARP 请求的二层目的地址是 FF:FF:FF:FF:FF:FF，同一广播域内所有主机会收到，但只有目标 IP 主机会回应。",
        formula: "dst MAC = ff:ff:ff:ff:ff:ff"
      },
      frame: {
        label: "以太网帧",
        title: "帧不会越过路由器保留原样",
        body: "同一链路内使用 MAC 地址转发。跨网段时，路由器会拆掉旧二层帧，再为下一跳封装新的二层帧。",
        formula: "same LAN: MAC forwarding"
      },
      table: {
        label: "MAC 表",
        title: "表项会老化，也可能被打满",
        body: "MAC 表不是永久的。长期不出现的地址会老化删除，容量不足会导致更多未知单播泛洪。",
        formula: "aging timer -> remove entry"
      }
    },
    university: {
      fields: ["Ethernet dst/src MAC", "ARP opcode/request/reply", "Sender MAC/IP, Target MAC/IP"],
      formulas: ["广播域大小影响 ARP 噪声", "未知单播泛洪范围 = VLAN 内全部端口", "MAC 表学习：source MAC -> ingress port"],
      notes: ["交换机不是按 IP 转发，三层交换是另外的路由功能。", "ARP 欺骗利用的是 ARP 缺少强认证的事实。"]
    }
  },
  {
    id: "subnet",
    icon: "IP",
    layer: "网络层",
    title: "IP 子网划分与最长前缀匹配",
    brief: "拖动前缀长度，观察地址空间怎样被切成网络号、主机号，以及路由器怎样选最长匹配项。",
    accent: "#5a9b61",
    duration: 7,
    controls: [
      { key: "prefix", label: "CIDR 前缀", min: 16, max: 30, step: 1, value: 24, unit: "位" },
      { key: "routes", label: "路由表项数量", min: 2, max: 8, step: 1, value: 5, unit: "条" },
      { key: "target", label: "目标主机编号", min: 1, max: 254, step: 1, value: 42, unit: "号" }
    ],
    overview: {
      title: "网络号越长，子网越小",
      body: "CIDR 用前缀长度表示网络位数。路由器查表时，如果多条路由都匹配，会选择前缀最长的一条，因为它描述得最具体。",
      formula: "可用主机数 = 2^(32-prefix) - 2"
    },
    conclusion: "前缀越长，单个子网能容纳的主机越少，但划分更精细。最长前缀匹配保证更具体的路由优先于默认路由或大网段路由。",
    cards: {
      mask: {
        label: "子网掩码",
        title: "掩码把地址切成两段",
        body: "掩码为 1 的部分是网络号，为 0 的部分是主机号。同一子网内主机的网络号相同。",
        formula: "IP & mask = network"
      },
      router: {
        label: "路由器",
        title: "路由器找最具体的匹配",
        body: "多个前缀同时匹配时，路由器选择前缀长度最大的条目，而不是最先出现或代价最低的任意条目。",
        formula: "Longest Prefix Match"
      },
      block: {
        label: "地址块",
        title: "地址块大小按 2 的幂变化",
        body: "前缀每增加 1 位，主机位减少 1 位，地址块大小减半。这就是 CIDR 划分看起来一格一格收缩的原因。",
        formula: "block size = 2^(32-prefix)"
      },
      default: {
        label: "默认路由",
        title: "0.0.0.0/0 是最后兜底",
        body: "默认路由前缀长度为 0，任何目的地址都匹配，但它最不具体，只有没有更长匹配时才使用。",
        formula: "0.0.0.0/0"
      }
    },
    university: {
      fields: ["CIDR prefix", "netmask", "network address", "broadcast address", "routing table prefix/next hop"],
      formulas: ["mask = leading(prefix, 1) + trailing(32-prefix, 0)", "usable hosts = max(2^h - 2, 0)", "LPM: argmax(prefix length) among matched routes"],
      notes: ["点到点链路和 IPv6 场景下，主机数规则会有例外。", "聚合路由减少表项，细粒度前缀提高控制能力。"]
    }
  },
  {
    id: "routing",
    icon: "R",
    layer: "网络层",
    title: "路由选择与链路代价",
    brief: "改变链路代价或制造故障，看最短路径怎样重新选择，理解 Dijkstra 和动态路由收敛。",
    accent: "#d8a944",
    duration: 9,
    controls: [
      { key: "cost", label: "中间链路代价", min: 1, max: 10, step: 1, value: 3, unit: "" },
      { key: "failure", label: "故障强度", min: 0, max: 1, step: 1, value: 0, unit: "" },
      { key: "traffic", label: "业务流量", min: 1, max: 10, step: 1, value: 5, unit: "流" }
    ],
    overview: {
      title: "路由不是走直线，而是走低代价路径",
      body: "路由协议会把链路带宽、延迟或配置权重抽象成代价。最短路径算法找的是总代价最小的下一跳序列。",
      formula: "path cost = sum(link cost)"
    },
    conclusion: "链路代价变化会改变最优路径。链路故障后，路由需要一段收敛时间；收敛前可能出现丢包、环路或次优路径。",
    cards: {
      router: {
        label: "路由器",
        title: "路由器只决定下一跳",
        body: "每台路由器不需要知道完整旅程的每个细节，只要根据路由表把包交给下一跳即可。",
        formula: "destination prefix -> next hop"
      },
      cost: {
        label: "链路代价",
        title: "低代价不等于物理距离短",
        body: "代价可能由带宽、延迟、人工配置或策略决定。图上短的线，如果代价高，也可能被绕开。",
        formula: "metric can be policy"
      },
      path: {
        label: "最短路径",
        title: "最短指的是总代价最小",
        body: "一条路径经过更多跳，但每段代价都低，总代价可能小于一条跳数少但拥塞严重的路径。",
        formula: "min Σ cost"
      },
      failure: {
        label: "故障收敛",
        title: "网络不会瞬间全知",
        body: "路由器需要检测故障、通告变化、重新计算表项。这个过程叫收敛，收敛期间服务质量可能下降。",
        formula: "detect -> advertise -> recompute"
      }
    },
    university: {
      fields: ["LSA/距离向量更新", "next hop", "administrative distance", "metric"],
      formulas: ["Dijkstra: repeatedly settle node with smallest tentative distance", "Bellman-Ford: D_x(y)=min_v(c(x,v)+D_v(y))", "convergence delay ≈ detection + propagation + computation"],
      notes: ["OSPF 是链路状态协议，RIP 是距离向量协议。", "真实网络还会受策略路由、ECMP、BGP 属性影响。"]
    }
  },
  {
    id: "tcp",
    icon: "T",
    layer: "传输层",
    title: "TCP 握手、滑动窗口与拥塞控制",
    brief: "看 SYN、SYN-ACK、ACK 建立连接，再观察丢包怎样让拥塞窗口回落并慢慢恢复。",
    accent: "#e56758",
    duration: 10,
    controls: [
      { key: "rtt", label: "往返时延 RTT", min: 20, max: 240, step: 10, value: 80, unit: "ms" },
      { key: "loss", label: "丢包率", min: 0, max: 10, step: 1, value: 2, unit: "%" },
      { key: "bandwidth", label: "瓶颈带宽", min: 2, max: 100, step: 2, value: 30, unit: "Mbps" }
    ],
    overview: {
      title: "TCP 既要可靠，又要照顾网络",
      body: "三次握手同步双方序号。传输时，发送窗口限制未确认数据量；拥塞窗口根据 ACK 和丢包调整发送速度。",
      formula: "throughput ≈ min(cwnd/RTT, bandwidth)"
    },
    conclusion: "RTT 越大，等待 ACK 的时间越长；丢包会被 TCP 视为拥塞信号，使拥塞窗口下降。带宽高但 RTT 大时，也需要足够大的窗口才能跑满链路。",
    cards: {
      handshake: {
        label: "三次握手",
        title: "三次是为了双方都确认收发能力",
        body: "SYN 表示请求同步序号，SYN-ACK 表示服务器确认并给出自己的序号，ACK 表示客户端确认服务器序号。",
        formula: "SYN -> SYN/ACK -> ACK"
      },
      cwnd: {
        label: "拥塞窗口",
        title: "cwnd 是 TCP 对网络承载力的猜测",
        body: "收到 ACK 时逐步增大，发生丢包时减小。它不是接收端窗口，而是发送端为了避免压垮网络设置的限制。",
        formula: "send window = min(cwnd, rwnd)"
      },
      loss: {
        label: "丢包",
        title: "丢包会让 TCP 收敛得更保守",
        body: "简化 Reno 模型中，检测到丢包后 ssthresh 约为当前窗口一半，cwnd 回落后再增长。",
        formula: "on loss: cwnd -> cwnd/2"
      },
      graph: {
        label: "窗口图",
        title: "锯齿形是拥塞控制的指纹",
        body: "窗口持续增加直到遇到拥塞信号，然后下降，再继续试探可用容量。真实算法有 Reno、CUBIC、BBR 等差异。",
        formula: "AIMD: additive increase, multiplicative decrease"
      }
    },
    university: {
      fields: ["TCP flags: SYN, ACK, FIN, RST", "sequence number", "ack number", "rwnd", "MSS"],
      formulas: ["BDP = bandwidth * RTT", "ideal window bytes ≈ BDP", "RTO is estimated from smoothed RTT and variance"],
      notes: ["现代系统常用 CUBIC 或 BBR，不一定是经典 Reno。", "丢包不总是拥塞，也可能来自无线误码或设备策略。"]
    }
  },
  {
    id: "dns",
    icon: "D",
    layer: "应用层",
    title: "DNS 递归解析与 HTTP 请求链路",
    brief: "从输入域名到拿到网页，观察缓存、递归解析、TLS 开关和对象数量怎样影响总延迟。",
    accent: "#7664a8",
    duration: 9,
    controls: [
      { key: "cache", label: "DNS 缓存命中", min: 0, max: 1, step: 1, value: 0, unit: "" },
      { key: "tls", label: "TLS 开关", min: 0, max: 1, step: 1, value: 1, unit: "" },
      { key: "objects", label: "页面对象数量", min: 1, max: 24, step: 1, value: 8, unit: "个" }
    ],
    overview: {
      title: "一次网页加载由很多小旅程组成",
      body: "浏览器先把域名解析成 IP，再建立连接并请求对象。DNS 缓存命中会省掉递归查询，TLS 会增加握手但提供安全性。",
      formula: "总延迟 ≈ DNS + TCP + TLS + HTTP objects"
    },
    conclusion: "缓存能显著减少 DNS 查询时延；TLS 提供认证和加密，但会增加握手成本；页面对象越多，请求调度和传输时间越容易成为瓶颈。",
    cards: {
      browser: {
        label: "浏览器",
        title: "浏览器先要把名字变成地址",
        body: "用户输入的是域名，IP 层需要的是 IP 地址。DNS 是把人类友好的名字映射到网络地址的系统。",
        formula: "name -> IP"
      },
      resolver: {
        label: "递归解析器",
        title: "递归解析器替客户端一路问下去",
        body: "没有缓存时，递归解析器会向根、顶级域、权威服务器逐级查询，最后把结果返回给客户端并缓存。",
        formula: "root -> TLD -> authoritative"
      },
      server: {
        label: "Web 服务器",
        title: "HTTP 请求真正发生在地址解析之后",
        body: "拿到 IP 后，浏览器才能建立传输层连接，随后发送 HTTP 请求并接收响应对象。",
        formula: "GET /index.html"
      },
      tls: {
        label: "TLS",
        title: "加密握手换来身份认证和保密性",
        body: "TLS 握手会协商密钥并验证证书。现代 TLS 1.3 已减少往返，但不是零成本。",
        formula: "HTTPS = HTTP over TLS"
      }
    },
    university: {
      fields: ["DNS QNAME/QTYPE", "A/AAAA/CNAME/NS records", "HTTP method/status/header/body", "TLS certificate and key exchange"],
      formulas: ["cache hit: DNS delay ≈ local lookup", "cache miss: DNS delay ≈ several RTTs", "HTTP/2 multiplexing reduces head-of-line at application layer"],
      notes: ["DNS 使用 UDP/53 为主，响应过大或区域传输会使用 TCP。", "HTTPS 不隐藏域名的所有信息，SNI/ECH 是相关议题。"]
    }
  },
  {
    id: "csma",
    icon: "C",
    layer: "介质访问控制",
    title: "CSMA/CD 共享介质碰撞与退避",
    brief: "让多台主机争用一条总线，观察同时发送时的碰撞、监听、冲突检测和指数退避。",
    accent: "#c97840",
    duration: 8,
    controls: [
      { key: "stations", label: "争用主机数", min: 2, max: 8, step: 1, value: 5, unit: "台" },
      { key: "load", label: "发送负载", min: 1, max: 10, step: 1, value: 6, unit: "" },
      { key: "length", label: "电缆长度", min: 10, max: 200, step: 10, value: 90, unit: "m" }
    ],
    overview: {
      title: "先听后说，说话撞车就退后",
      body: "CSMA/CD 用在经典共享以太网。站点发送前监听信道，发送中检测碰撞，碰撞后等待随机退避时间再尝试。",
      formula: "backoff slots in [0, 2^k - 1]"
    },
    conclusion: "负载越高、争用主机越多，碰撞概率越大；传播时延越长，站点越晚发现对方也在发送，因此最小帧长和冲突窗口很重要。",
    cards: {
      bus: {
        label: "共享总线",
        title: "共享介质一次只适合一个人说话",
        body: "总线型网络里所有站点共享同一信道。两个站点同时发送，电信号会叠加造成碰撞。",
        formula: "shared medium"
      },
      collision: {
        label: "碰撞",
        title: "碰撞不是随机坏掉，而是同时占用信道",
        body: "碰撞发生后，站点发送干扰信号并停止当前帧，随后根据退避算法等待再发。",
        formula: "collision -> jam -> backoff"
      },
      backoff: {
        label: "退避",
        title: "指数退避让网络从拥挤中缓下来",
        body: "连续碰撞次数越多，随机等待窗口越大，所有站点再次同时发送的概率降低。",
        formula: "CW doubles after collision"
      },
      delay: {
        label: "传播时延",
        title: "线越长，发现碰撞越慢",
        body: "信号在电缆中传播需要时间。传播时延越大，冲突检测窗口越长，对最小帧长要求越高。",
        formula: "propagation delay = distance / signal speed"
      }
    },
    university: {
      fields: ["slot time", "jam signal", "binary exponential backoff", "minimum Ethernet frame size"],
      formulas: ["a = propagation delay / transmission time", "collision probability rises with offered load", "10Mbps Ethernet slot time = 512 bit times"],
      notes: ["现代交换式全双工以太网基本不再使用 CSMA/CD。", "无线网络使用 CSMA/CA，因为无线站点难以边发边检测碰撞。"]
    }
  },
  {
    id: "wireless",
    icon: "W",
    layer: "无线与性能",
    title: "无线信道、带宽、时延和丢包",
    brief: "拖动距离、干扰和带宽，观察信噪比、吞吐、丢包和排队时延如何一起变化。",
    accent: "#6b8fce",
    duration: 8,
    controls: [
      { key: "distance", label: "终端距离", min: 2, max: 80, step: 1, value: 24, unit: "m" },
      { key: "interference", label: "干扰强度", min: 0, max: 100, step: 5, value: 25, unit: "%" },
      { key: "bandwidth", label: "信道带宽", min: 20, max: 160, step: 20, value: 80, unit: "MHz" }
    ],
    overview: {
      title: "无线不是只有带宽这一个旋钮",
      body: "距离变远会让接收功率下降，干扰会降低信噪比。带宽变大能提高理论容量，但如果信噪比太差，实际吞吐仍会下降。",
      formula: "C = B log2(1 + SNR)"
    },
    conclusion: "带宽、距离、干扰共同决定无线体验。提高带宽并不能自动解决弱信号问题；信噪比不足时，调制阶数下降、重传增加，时延和丢包都会变差。",
    cards: {
      ap: {
        label: "接入点",
        title: "AP 是无线终端进入网络的桥",
        body: "终端通过 AP 接入有线网络。AP 负责信道管理、关联认证和帧转发。",
        formula: "STA <-> AP <-> LAN"
      },
      signal: {
        label: "信号",
        title: "距离越远，接收功率越弱",
        body: "自由空间里信号随距离衰减。室内还会有墙体、多径和遮挡，让链路质量进一步变化。",
        formula: "path loss grows with distance"
      },
      interference: {
        label: "干扰",
        title: "噪声和同频竞争都会吃掉容量",
        body: "干扰提升噪声底，降低 SNR。多个设备争用同一信道时，空口时间也会被分走。",
        formula: "SNR = signal / noise"
      },
      capacity: {
        label: "容量",
        title: "香农公式给出理想上限",
        body: "C = B log2(1 + SNR) 说明带宽和信噪比都重要。实际 Wi-Fi 还受协议开销、重传和速率自适应影响。",
        formula: "C = B log2(1 + SNR)"
      }
    },
    university: {
      fields: ["RSSI", "SNR", "MCS", "channel width", "CSMA/CA contention"],
      formulas: ["free-space path loss grows with 20log10(d)", "Shannon capacity: C=B log2(1+SNR)", "queue delay rises quickly as utilization approaches 1"],
      notes: ["更宽信道更容易受到重叠干扰，也会减少可复用信道数量。", "吞吐低不一定是带宽小，可能是信号质量、竞争或上游瓶颈。"]
    }
  }
];

experiments.push(
  {
    id: "crc",
    icon: "CRC",
    layer: "数据链路层",
    title: "CRC 差错检测与误码定位",
    brief: "把比特流穿过有噪声的物理链路，观察生成多项式、余数、误码和漏检风险之间的关系。",
    accent: "#b65a8d",
    duration: 8,
    controls: [
      { key: "frameBits", label: "帧长度", min: 256, max: 4096, step: 128, value: 1024, unit: "bit" },
      { key: "bitError", label: "误码率", min: 0, max: 5, step: 0.1, value: 0.8, unit: "%" },
      { key: "poly", label: "生成多项式", min: 1, max: 3, step: 1, value: 2, unit: "" }
    ],
    overview: {
      title: "CRC 像给比特流盖一个校验章",
      body: "发送端按生成多项式做模 2 除法，把余数附在帧尾；接收端再除一次，如果余数不为 0，就说明链路中大概率发生了差错。",
      formula: "codeword = data · x^r + remainder"
    },
    conclusion: "CRC 能高概率发现突发差错，但不是纠错码，也不是绝对不会漏检。生成多项式越强，开销越大，漏检概率通常越低。",
    cards: {
      data: {
        label: "比特流",
        title: "真实链路里比特可能会翻转",
        body: "电磁干扰、接触不良、无线衰落或采样时钟偏移都可能让 0/1 被接收成相反值。实验中误码率升高会让红色翻转位增加。",
        formula: "bit error: 0 ↔ 1"
      },
      crc: {
        label: "CRC 余数",
        title: "余数不是加密，只是差错检测特征",
        body: "CRC 通过模 2 除法得到余数。接收端拿整个码字再除，余数为 0 才通过校验。",
        formula: "received mod G(x) = 0"
      },
      noise: {
        label: "噪声",
        title: "误码常常成簇出现",
        body: "现实中的误码不一定独立均匀，突发噪声会让连续多个比特翻转，所以 CRC 常强调对突发差错的检测能力。",
        formula: "burst error length ≤ r"
      },
      syndrome: {
        label: "综合症",
        title: "余数能提示有错，但不能准确告诉哪一位错",
        body: "CRC 的非零余数表示检测到差错；若要定位并纠正，需要海明码、RS 码或更复杂的前向纠错。",
        formula: "syndrome ≠ 0 -> error detected"
      }
    },
    university: {
      fields: ["generator polynomial G(x)", "FCS/CRC field", "received codeword", "syndrome"],
      formulas: ["CRC uses modulo-2 polynomial division", "undetected error when E(x) is divisible by G(x)", "CRC-r adds r check bits"],
      notes: ["CRC 是检错，不是纠错。", "抓包里看到的 FCS 可能被网卡硬件剥离，Wireshark 不一定显示。"]
    }
  },
  {
    id: "arq",
    icon: "ARQ",
    layer: "可靠链路传输",
    title: "停止等待、GBN 与 SR 滑动窗口 ARQ",
    brief: "比较停止等待、回退 N 帧和选择重传在窗口、ACK、丢包和吞吐上的差异。",
    accent: "#c98b2f",
    duration: 9,
    controls: [
      { key: "arqMode", label: "ARQ 模式", min: 0, max: 2, step: 1, value: 1, unit: "" },
      { key: "windowSize", label: "发送窗口", min: 1, max: 8, step: 1, value: 4, unit: "帧" },
      { key: "lossRate", label: "帧丢失率", min: 0, max: 20, step: 1, value: 6, unit: "%" }
    ],
    overview: {
      title: "可靠传输靠确认和重传闭环",
      body: "发送端维护窗口，接收端返回 ACK。停止等待最简单但效率低；GBN 丢一帧会回退重传；SR 只重传缺失帧但缓存和编号要求更高。",
      formula: "utilization ≈ window / (1 + 2a)"
    },
    conclusion: "窗口越大，链路利用率越高，但在丢包时重传策略会决定浪费多少带宽。SR 更精细，GBN 更简单，停止等待适合低复杂度场景。",
    cards: {
      window: {
        label: "发送窗口",
        title: "窗口限制未确认帧数量",
        body: "窗口内帧可以连续发送，不必每发一帧就停下等待 ACK。窗口越大，长时延链路越容易被填满。",
        formula: "in-flight frames ≤ W"
      },
      ack: {
        label: "ACK",
        title: "ACK 是接收端给出的进度条",
        body: "累计 ACK 表示此前帧都已收到；选择确认可以指出具体缺失和已收帧。",
        formula: "ACK n: received up to n-1"
      },
      retransmit: {
        label: "重传",
        title: "超时和重复 ACK 会触发重传",
        body: "现实中超时值设置过短会误判，过长会恢复慢。链路抖动越大，重传策略越容易影响吞吐。",
        formula: "timeout -> retransmit"
      },
      mode: {
        label: "ARQ 模式",
        title: "GBN 简单，SR 更节省",
        body: "GBN 在丢包后回退重传后续帧；SR 只重传丢失帧，但接收端需要缓存乱序帧。",
        formula: "GBN vs SR"
      }
    },
    university: {
      fields: ["sequence number", "ACK number", "send window", "receive window", "timeout"],
      formulas: ["Stop-and-wait utilization ≈ 1/(1+2a)", "GBN receiver window = 1", "SR requires sequence space at least 2W"],
      notes: ["TCP 不是简单的 GBN 或 SR，但吸收了滑动窗口、累计确认和选择确认等思想。", "实验误差常来自 RTT 抖动和超时估计不合理。"]
    }
  },
  {
    id: "dhcpnat",
    icon: "NAT",
    layer: "网络层与边界网关",
    title: "DHCP 地址租约与 NAT 端口映射",
    brief: "从 DISCOVER 到 ACK 分配内网地址，再观察 NAT 怎样把多个内网连接复用到同一个公网地址。",
    accent: "#4a9f73",
    duration: 9,
    controls: [
      { key: "clients", label: "内网主机数", min: 1, max: 12, step: 1, value: 5, unit: "台" },
      { key: "poolSize", label: "地址池大小", min: 2, max: 16, step: 1, value: 8, unit: "个" },
      { key: "portPressure", label: "并发连接压力", min: 1, max: 100, step: 1, value: 36, unit: "%" }
    ],
    overview: {
      title: "先拿地址，再借公网出口",
      body: "DHCP 给主机分配可用内网地址、网关和 DNS；NAT 在出口路由器上维护内网地址端口到公网地址端口的映射。",
      formula: "inside local:port -> public:port"
    },
    conclusion: "DHCP 地址池不足会导致主机拿不到租约；NAT 能节省公网地址，但端口映射表可能老化、耗尽或影响端到端可达性。",
    cards: {
      dhcp: {
        label: "DHCP 流程",
        title: "DORA 四步完成地址租约",
        body: "客户端广播 Discover，服务器 Offer，客户端 Request，服务器 ACK，随后客户端才正式使用租约。",
        formula: "Discover -> Offer -> Request -> ACK"
      },
      lease: {
        label: "租约",
        title: "地址不是永久送给主机的",
        body: "DHCP 地址有租期。租期过半通常尝试续租，服务器不可达时可能进入重新绑定或地址失效。",
        formula: "T1 ≈ 0.5 lease, T2 ≈ 0.875 lease"
      },
      nat: {
        label: "NAT 网关",
        title: "NAT 改写地址和端口",
        body: "出站包被替换为公网地址和临时端口，回包根据映射表还原到内网主机。",
        formula: "192.168.x.y:p -> 203.0.113.8:q"
      },
      port: {
        label: "端口映射",
        title: "端口也是有限资源",
        body: "大量并发连接会增加映射表压力。超时过短会断连接，过长会占用端口和内存。",
        formula: "mapping timeout matters"
      }
    },
    university: {
      fields: ["DHCP message type", "yiaddr", "lease time", "router option", "DNS option", "NAT translation table"],
      formulas: ["available leases = pool size - active leases", "PAT maps many private sockets to one public IP", "state timeout controls NAT table lifetime"],
      notes: ["NAT 会破坏纯端到端模型，P2P、VoIP、游戏常需 STUN/TURN/UPnP。", "DHCP 冲突可能来自静态地址占用或重复服务器。"]
    }
  },
  {
    id: "trace",
    icon: "TTL",
    layer: "网络诊断",
    title: "ICMP Ping 与 Traceroute 路径诊断",
    brief: "用 TTL 逐跳探测路径，观察 ICMP Time Exceeded、RTT 抖动、丢包和路径变化。",
    accent: "#4f7fc8",
    duration: 9,
    controls: [
      { key: "maxTtl", label: "最大 TTL", min: 3, max: 12, step: 1, value: 7, unit: "跳" },
      { key: "jitter", label: "RTT 抖动", min: 0, max: 80, step: 5, value: 20, unit: "ms" },
      { key: "icmpLoss", label: "ICMP 丢包", min: 0, max: 30, step: 1, value: 5, unit: "%" }
    ],
    overview: {
      title: "让 TTL 一跳一跳地问路",
      body: "Ping 测端到端可达性和 RTT；Traceroute 逐步增加 TTL，让沿途路由器返回 ICMP 超时，从而推断路径。",
      formula: "TTL-- each hop; TTL=0 -> ICMP Time Exceeded"
    },
    conclusion: "Traceroute 显示的是探测报文看到的路径，不一定等于所有业务流的路径。星号可能是丢包、限速、防火墙或路由器不回复 ICMP。",
    cards: {
      ttl: {
        label: "TTL",
        title: "TTL 防止包在网络里无限循环",
        body: "每过一个路由器 TTL 减 1，减到 0 时路由器丢弃该包并可能返回 ICMP Time Exceeded。",
        formula: "TTL = TTL - 1"
      },
      icmp: {
        label: "ICMP",
        title: "ICMP 是网络诊断的回声和告警",
        body: "Ping 使用 Echo Request/Reply；Traceroute 常依赖 Time Exceeded 或端口不可达响应。",
        formula: "Echo / Time Exceeded"
      },
      rtt: {
        label: "RTT",
        title: "RTT 包含传播、排队、处理和返回时间",
        body: "RTT 抖动不一定是链路坏了，可能来自队列变化、无线重传、路由策略或 ICMP 限速。",
        formula: "RTT = t_reply - t_send"
      },
      path: {
        label: "路径",
        title: "路径可能不对称也可能变化",
        body: "去程和回程不一定相同，负载均衡也可能让连续探测走不同链路。",
        formula: "ECMP can change probes"
      }
    },
    university: {
      fields: ["ICMP type/code", "TTL/Hop Limit", "probe sequence", "RTT samples", "destination unreachable"],
      formulas: ["hop i discovered by probe TTL=i", "jitter ≈ variation of RTT samples", "loss estimate = missing replies / probes"],
      notes: ["Windows tracert 默认 ICMP，Unix traceroute 常用 UDP，也可用 ICMP/TCP 模式。", "运营商和云网络可能对 ICMP 限速，星号不等于该跳一定故障。"]
    }
  }
);

const fullCatalog = [
  ["实验工具", "Wireshark 抓包与协议字段识别", "入门"],
  ["物理层", "传输时延、传播时延与带宽时延积", "性能"],
  ["物理层", "曼彻斯特编码、NRZ 与采样恢复", "信号"],
  ["物理层", "无线信道容量与信噪比", "旗舰"],
  ["链路层", "成帧、差错检测与 CRC", "基础"],
  ["链路层", "停止等待、滑动窗口 ARQ", "可靠传输"],
  ["链路层", "CSMA/CD 碰撞检测与退避", "旗舰"],
  ["链路层", "交换机 MAC 学习与 ARP", "旗舰"],
  ["链路层", "VLAN 划分与广播域隔离", "扩展"],
  ["网络层", "IP 地址、子网划分与 CIDR", "旗舰"],
  ["网络层", "ICMP Ping 与 Traceroute", "诊断"],
  ["网络层", "静态路由、默认路由和最长前缀匹配", "基础"],
  ["网络层", "Dijkstra 路由选择与收敛", "旗舰"],
  ["网络层", "NAT 地址转换与端口复用", "扩展"],
  ["网络层", "DHCP 地址分配流程", "扩展"],
  ["传输层", "UDP 校验和与无连接传输", "基础"],
  ["传输层", "TCP 三次握手与四次挥手", "旗舰"],
  ["传输层", "TCP 流量控制、拥塞控制与重传", "旗舰"],
  ["应用层", "DNS 递归解析与缓存", "旗舰"],
  ["应用层", "HTTP 请求、状态码和对象加载", "旗舰"],
  ["应用层", "TLS 证书、握手和 HTTPS", "扩展"],
  ["综合", "端到端一次网页访问全链路复盘", "综合"],
  ["安全", "ARP 欺骗、DNS 污染与基本防护", "专题"],
  ["工程", "网络性能测试、队列和丢包定位", "专题"]
];

const S = {
  current: experiments[0],
  values: {},
  t: 0,
  running: false,
  paused: false,
  observed: false,
  lastTs: 0,
  dpr: 1,
  cssW: 1100,
  cssH: 680,
  longPressTimer: null,
  dragTarget: null,
  viewDrag: null,
  hoverHotspot: null,
  toastTimer: null,
  pointer: { x: .5, y: .5 },
  view: { angle: 0, pitch: 0, zoom: 1, panX: 0, panY: 0 }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function map(value, inMin, inMax, outMin, outMax) {
  const t = (value - inMin) / (inMax - inMin);
  return outMin + clamp(t, 0, 1) * (outMax - outMin);
}

function fmt(value, digits = 2) {
  if (!Number.isFinite(value)) return "--";
  if (Math.abs(value) >= 1000) return value.toFixed(0);
  if (Math.abs(value) >= 100) return value.toFixed(1);
  if (Math.abs(value) >= 10) return value.toFixed(1);
  return value.toFixed(digits);
}

function defaultValues(exp) {
  return Object.fromEntries(exp.controls.map(control => [control.key, control.value]));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(S.toastTimer);
  S.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function setKnowledge(card, tag = "概览") {
  knowledgeTag.textContent = tag;
  knowledgeCard.innerHTML = `
    <h4>${card.title}</h4>
    <p>${card.body}</p>
    <span class="formula">${card.formula}</span>
  `;
}

function renderUniversity() {
  const u = S.current.university;
  universityContent.innerHTML = `
    <h3>${S.current.title}</h3>
    <p>${S.current.brief}</p>
    <h3>协议字段</h3>
    <ul>${u.fields.map(item => `<li>${item}</li>`).join("")}</ul>
    <h3>模型与公式</h3>
    <ul>${u.formulas.map(item => `<li><code>${item}</code></li>`).join("")}</ul>
    <h3>严谨提醒</h3>
    <ul>${u.notes.map(item => `<li>${item}</li>`).join("")}</ul>
  `;
}

function renderTabs() {
  flagshipList.innerHTML = experiments.map((exp, index) => `
    <button class="experiment-tab ${exp.id === S.current.id ? "active" : ""}" type="button" data-exp="${exp.id}">
      <span class="tab-icon" style="background-color:${exp.accent}">${exp.icon}</span>
      <span>
        <span class="tab-title">${index + 1}. ${exp.title}</span>
        <span class="tab-meta">${exp.layer}</span>
      </span>
    </button>
  `).join("");
}

function renderFullCatalog() {
  fullCatalogList.innerHTML = fullCatalog.map(([chapter, title, tag]) => `
    <div class="catalog-item">
      <b>${title}</b>
      <span>${chapter} · ${tag}</span>
    </div>
  `).join("");
}

function renderControls() {
  controlsEl.innerHTML = S.current.controls.map(control => `
    <div class="control">
      <label for="control-${control.key}">
        <span>${control.label}</span>
        <output id="output-${control.key}">${formatControl(control, S.values[control.key])}</output>
      </label>
      <input id="control-${control.key}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${S.values[control.key]}" data-key="${control.key}">
    </div>
  `).join("");
}

function formatControl(control, value) {
  if (control.key === "cache") return value ? "命中" : "未命中";
  if (control.key === "tls") return value ? "开启" : "关闭";
  if (control.key === "failure") return value ? "链路故障" : "正常";
  if (control.key === "poly") return ["CRC-8", "CRC-16", "CRC-32"][Number(value) - 1] || "CRC";
  if (control.key === "arqMode") return ["停止等待", "GBN", "SR"][Number(value)] || "ARQ";
  const step = String(control.step);
  const digits = step.includes(".") ? step.split(".")[1].length : 0;
  return `${Number(value).toFixed(digits)} ${control.unit}`.trim();
}

function updateControlOutputs() {
  S.current.controls.forEach(control => {
    const output = document.getElementById(`output-${control.key}`);
    const input = document.getElementById(`control-${control.key}`);
    if (output) output.textContent = formatControl(control, S.values[control.key]);
    if (input) input.value = S.values[control.key];
  });
}

function renderStaticText() {
  const exp = S.current;
  layerName.textContent = exp.layer;
  sceneTitle.textContent = exp.title;
  experimentLayer.textContent = exp.layer;
  experimentTitle.textContent = exp.title;
  experimentBrief.textContent = exp.brief;
  conclusionText.textContent = exp.conclusion;
  setKnowledge(exp.overview, "概览");
  renderManual();
  renderUniversity();
  updateDiagnostics();
}

function selectExperiment(id) {
  const exp = experiments.find(item => item.id === id) || experiments[0];
  S.current = exp;
  S.values = defaultValues(exp);
  resetSimulation(false);
  renderTabs();
  renderControls();
  renderStaticText();
  draw();
  updateMetrics();
}

function resetSimulation(showMessage = true) {
  S.t = 0;
  S.running = false;
  S.paused = false;
  S.observed = false;
  S.lastTs = 0;
  statePill.textContent = "待开始";
  conclusionPill.textContent = "观察中";
  conclusionPill.classList.add("subtle");
  pauseOverlay.classList.remove("active");
  setKnowledge(S.current.overview, "概览");
  if (showMessage) showToast("实验已重置。");
  draw();
  updateMetrics();
}

function softReset() {
  S.t = 0;
  S.observed = false;
  S.lastTs = 0;
  conclusionPill.textContent = "观察中";
  conclusionPill.classList.add("subtle");
  if (!S.running) statePill.textContent = "已调整";
}

function play() {
  S.running = true;
  S.paused = false;
  S.lastTs = 0;
  statePill.textContent = "运行中";
  pauseOverlay.classList.remove("active");
  requestAnimationFrame(loop);
}

function pause() {
  S.running = false;
  S.paused = true;
  S.lastTs = 0;
  statePill.textContent = "已暂停";
  pauseOverlay.classList.add("active");
  showToast("已定格。长按画布里的设备、链路、数据包或图表查看解析。");
  draw();
}

function markObserved() {
  if (S.observed) return;
  S.observed = true;
  conclusionPill.textContent = "结论可复盘";
  conclusionPill.classList.remove("subtle");
}

function loop(ts) {
  if (!S.running) return;
  if (!S.lastTs) S.lastTs = ts;
  const dt = Math.min((ts - S.lastTs) / 1000, 1 / 24);
  S.lastTs = ts;
  S.t += dt;
  if (S.t > S.current.duration) markObserved();
  draw();
  updateMetrics();
  requestAnimationFrame(loop);
}

function metricData() {
  const id = S.current.id;
  if (id === "stack") {
    const headers = headerBytes();
    const total = S.values.payload + headers;
    return [
      ["总帧负载", `${total} B`],
      ["协议开销率", `${fmt(headers / total * 100, 1)}%`],
      ["分片数量", `${Math.ceil(total / S.values.mtu)} 个`],
      ["有效载荷", `${fmt(S.values.payload / total * 100, 1)}%`]
    ];
  }
  if (id === "ethernet") {
    const learned = Math.min(S.values.hosts, Math.floor(S.t / 1.2) + 1, S.values.tableSize);
    const broadcast = S.values.arpRate * (1 - clamp(S.t / S.current.duration, 0, 1));
    return [
      ["MAC 表项", `${learned}/${S.values.hosts}`],
      ["ARP 广播", `${fmt(Math.max(0, broadcast), 1)} 次/轮`],
      ["单播命中", `${fmt(learned / S.values.hosts * 100, 0)}%`],
      ["广播域", "同一 VLAN"]
    ];
  }
  if (id === "subnet") {
    const bits = 32 - S.values.prefix;
    const usable = bits <= 1 ? 0 : Math.pow(2, bits) - 2;
    return [
      ["掩码", prefixToMask(S.values.prefix)],
      ["主机位", `${bits} bit`],
      ["可用主机", `${usable}`],
      ["匹配前缀", `/${Math.min(30, S.values.prefix + Math.floor(S.values.routes / 2))}`]
    ];
  }
  if (id === "routing") {
    const result = routingResult();
    return [
      ["最优路径", result.path.join(" → ")],
      ["总代价", `${result.cost}`],
      ["跳数", `${result.path.length - 1}`],
      ["收敛估计", `${S.values.failure ? 3 + S.values.traffic : 1}s`]
    ];
  }
  if (id === "tcp") {
    const cwnd = tcpCwnd();
    const throughput = Math.min(S.values.bandwidth, cwnd * 1460 * 8 / (S.values.rtt / 1000) / 1e6);
    return [
      ["连接状态", tcpPhase()],
      ["cwnd", `${fmt(cwnd, 1)} MSS`],
      ["估计吞吐", `${fmt(throughput, 1)} Mbps`],
      ["BDP", `${fmt(S.values.bandwidth * 1e6 * (S.values.rtt / 1000) / 8 / 1024, 1)} KB`]
    ];
  }
  if (id === "dns") {
    const dnsDelay = S.values.cache ? 6 : 90;
    const tlsDelay = S.values.tls ? 60 : 0;
    const objectDelay = Math.ceil(S.values.objects / 6) * 30;
    return [
      ["DNS 查询", S.values.cache ? "缓存命中" : "递归查询"],
      ["DNS 时延", `${dnsDelay} ms`],
      ["TLS 成本", `${tlsDelay} ms`],
      ["总估计", `${dnsDelay + tlsDelay + objectDelay + 60} ms`]
    ];
  }
  if (id === "csma") {
    const p = collisionProbability();
    return [
      ["碰撞概率", `${fmt(p * 100, 1)}%`],
      ["退避窗口", `${Math.pow(2, Math.min(6, Math.ceil(p * 8)))} slots`],
      ["传播时延", `${fmt(S.values.length / 200000000 * 1e6, 2)} μs`],
      ["有效吞吐", `${fmt((1 - p) * 100, 1)}%`]
    ];
  }
  if (id === "crc") {
    const s = crcStats();
    return [
      ["校验位", `${s.checkBits} bit`],
      ["期望误码", `${fmt(s.expectedErrors, 1)} bit`],
      ["检出概率", `${fmt(s.detectRate * 100, 3)}%`],
      ["综合症", s.syndrome]
    ];
  }
  if (id === "arq") {
    const s = arqStats();
    return [
      ["ARQ 模式", s.modeName],
      ["窗口利用", `${fmt(s.utilization * 100, 1)}%`],
      ["重传浪费", `${fmt(s.waste * 100, 1)}%`],
      ["超时估计", `${fmt(s.timeout, 0)} ms`]
    ];
  }
  if (id === "dhcpnat") {
    const s = dhcpNatStats();
    return [
      ["已分配租约", `${s.leases}/${S.values.poolSize}`],
      ["未获地址", `${s.starved} 台`],
      ["NAT 映射", `${s.mappings} 条`],
      ["端口压力", `${fmt(s.portLoad * 100, 1)}%`]
    ];
  }
  if (id === "trace") {
    const s = traceStats();
    return [
      ["探测跳数", `${S.values.maxTtl} hop`],
      ["平均 RTT", `${fmt(s.avgRtt, 1)} ms`],
      ["星号估计", `${s.stars} 个`],
      ["路径状态", s.status]
    ];
  }
  const w = wirelessStats();
  return [
    ["SNR", `${fmt(w.snrDb, 1)} dB`],
    ["香农上限", `${fmt(w.capacity, 1)} Mbps`],
    ["丢包估计", `${fmt(w.loss, 1)}%`],
    ["排队时延", `${fmt(w.delay, 1)} ms`]
  ];
}

function updateMetrics() {
  metricRibbon.innerHTML = metricData().map(([label, value]) => `
    <div class="metric"><span>${label}</span><strong>${value}</strong></div>
  `).join("");
  updateDiagnostics();
}

function manualData() {
  const shared = {
    stack: [
      "先记录应用数据大小和 MTU，再点击播放观察数据从应用层向下封装。",
      "暂停在数据包过链路处，长按 MTU 或数据包，确认头部开销和分片数量。",
      "调整 MTU 和协议层数，比较总帧负载、有效载荷比例和分片变化。"
    ],
    ethernet: [
      "先让 MAC 表为空，播放一次 ARP 查询，观察广播泛洪范围。",
      "暂停后长按交换机和 MAC 表，确认源 MAC 学习发生在入端口。",
      "提高主机数或降低表容量，观察未知单播泛洪和表项压力。"
    ],
    subnet: [
      "设置 CIDR 前缀，记录掩码、主机位和可用主机数。",
      "改变目标主机编号，观察路由器如何选择更具体的前缀。",
      "把前缀调到 /30 附近，检查广播地址和可用地址减少的后果。"
    ],
    routing: [
      "先在无故障条件下记录最优路径和总代价。",
      "逐步提高中间链路代价，观察最短路径何时切换。",
      "打开故障并暂停，复盘检测、通告、重算导致的收敛延迟。"
    ],
    tcp: [
      "播放并观察 SYN、SYN-ACK、ACK 三步完成连接建立。",
      "调整 RTT 和瓶颈带宽，比较 BDP 与估计吞吐。",
      "提高丢包率，暂停窗口图，观察拥塞窗口回落和重传。"
    ],
    dns: [
      "先关闭缓存，播放完整递归解析链路。",
      "打开 DNS 缓存命中，对比总估计时延变化。",
      "切换 TLS 和页面对象数量，观察安全握手和对象加载成本。"
    ],
    csma: [
      "设置较低负载，观察共享总线上的载波监听。",
      "提高主机数和发送负载，记录碰撞概率和退避窗口。",
      "增加电缆长度，理解传播时延为何影响最小帧长。"
    ],
    wireless: [
      "先固定带宽，逐步拉远终端，观察 SNR 和丢包估计。",
      "提高干扰强度，比较香农上限与实际体验下降。",
      "改变信道带宽，判断带宽、信噪比、重传之间的取舍。"
    ],
    crc: [
      "先设置帧长度和生成多项式，记录 CRC 校验位开销。",
      "逐步提高误码率，观察红色翻转位和综合症变化。",
      "对比 CRC-8、CRC-16、CRC-32，判断检错能力和开销。"
    ],
    arq: [
      "从停止等待开始，记录窗口为 1 时的链路利用率。",
      "切换到 GBN 和 SR，保持同样丢包率比较重传浪费。",
      "增大发送窗口，观察吞吐提升和乱序缓存压力。"
    ],
    dhcpnat: [
      "先让主机数小于地址池，观察 DORA 完整租约流程。",
      "让主机数超过地址池，检查哪些主机无法获得租约。",
      "提高并发连接压力，观察 NAT 端口映射表和超时风险。"
    ],
    trace: [
      "先用低丢包率播放 traceroute，记录每一跳 RTT。",
      "提高最大 TTL，观察探测包如何逐跳发现路径。",
      "提高抖动或 ICMP 丢包，判断星号、限速和真实故障的区别。"
    ]
  };
  return shared[S.current.id] || [
    "先观察默认参数下的现象和指标。",
    "再每次只改变一个参数，避免多个变量混在一起。",
    "暂停后长按关键对象，复盘公式、协议字段和现实误差来源。"
  ];
}

function renderManual() {
  const steps = manualData();
  manualCard.innerHTML = `
    <ol>${steps.map(step => `<li>${step}</li>`).join("")}</ol>
    <p class="manual-note">记录建议：保存参数、指标、异常提示和你的解释。现实实验里，异常往往比理想结果更值得分析。</p>
  `;
}

function diagnostic(severity, title, body) {
  return { severity, title, body };
}

function diagnosticsData() {
  const id = S.current.id;
  const v = S.values;
  const items = [];
  if (id === "stack") {
    const total = v.payload + headerBytes();
    if (total > v.mtu) items.push(diagnostic("warn", "出现分片风险", `总负载 ${total}B 已超过 MTU ${v.mtu}B。现实中可能触发 IP 分片或 PMTUD 黑洞。`));
    if (headerBytes() / total > .18) items.push(diagnostic("warn", "协议开销偏高", "小载荷叠加多层头部时，有效载荷比例下降，抓包时会看到很多控制字段。"));
  }
  if (id === "ethernet") {
    if (v.hosts > v.tableSize) items.push(diagnostic("danger", "MAC 表容量不足", "主机数超过表容量，现实交换机可能产生未知单播泛洪，表现为异常广播噪声。"));
    if (v.arpRate >= 5) items.push(diagnostic("warn", "ARP 噪声偏高", "频繁 ARP 可能来自缓存过短、地址冲突或扫描行为。"));
  }
  if (id === "subnet") {
    const usable = Math.pow(2, 32 - v.prefix) - 2;
    if (usable < 2) items.push(diagnostic("danger", "子网几乎无可用主机", `/${v.prefix} 对普通 LAN 不合适，容易把广播地址或网络地址误配给主机。`));
    if (v.target === 0 || v.target === 255) items.push(diagnostic("danger", "目标可能是保留地址", "主机号全 0 或全 1 在传统 IPv4 子网里通常不是普通主机地址。"));
  }
  if (id === "routing") {
    if (v.failure) items.push(diagnostic("danger", "链路故障收敛中", "现实网络会经历检测、通告和重算，期间可能有短时丢包或路径绕行。"));
    if (v.traffic > 8) items.push(diagnostic("warn", "业务压力较高", "路由最短不代表不拥塞。真实网络还要观察队列、接口丢弃和策略路由。"));
  }
  if (id === "tcp") {
    const bdpKb = v.bandwidth * 1e6 * (v.rtt / 1000) / 8 / 1024;
    if (v.loss >= 6) items.push(diagnostic("danger", "丢包会显著压低 TCP", "TCP 可能把丢包解释为拥塞，窗口回落，吞吐呈锯齿下降。"));
    if (bdpKb > 512) items.push(diagnostic("warn", "BDP 较大", `BDP 约 ${fmt(bdpKb, 1)}KB，窗口太小会跑不满链路。`));
  }
  if (id === "dns") {
    if (!v.cache) items.push(diagnostic("warn", "DNS 递归时延存在", "首次访问没有缓存时，会经历根、TLD、权威服务器等多次查询。"));
    if (v.objects > 18) items.push(diagnostic("warn", "页面对象偏多", "真实浏览器会受并发、HTTP/2 复用、队头阻塞和缓存策略影响。"));
  }
  if (id === "csma") {
    if (collisionProbability() > .55) items.push(diagnostic("danger", "碰撞概率过高", "共享介质在高负载下效率会明显下降。现代全双工交换以太网已基本避免这个问题。"));
    if (v.length > 150) items.push(diagnostic("warn", "传播时延偏大", "距离越长，越晚发现碰撞，最小帧长与冲突窗口更关键。"));
  }
  if (id === "wireless") {
    const w = wirelessStats();
    if (w.snrDb < 15) items.push(diagnostic("danger", "SNR 偏低", "现实中会降调制阶数、增加重传，表现为吞吐低、时延抖动和掉线。"));
    if (v.bandwidth >= 160 && v.interference > 40) items.push(diagnostic("warn", "宽信道更容易吃干扰", "更宽信道不一定更快，周边拥挤时反而增加重叠干扰。"));
  }
  if (id === "crc") {
    const s = crcStats();
    if (s.expectedErrors > 8) items.push(diagnostic("danger", "误码过多", "此时不该只依赖重传，现实中要检查线缆、无线信号、接地或端口硬件。"));
    if (v.poly === 1 && v.frameBits > 2048) items.push(diagnostic("warn", "CRC 强度偏低", "长帧配弱多项式会提高漏检风险，工程上常用 CRC-32 等成熟多项式。"));
  }
  if (id === "arq") {
    const s = arqStats();
    if (v.lossRate > 12 && v.arqMode === 1) items.push(diagnostic("warn", "GBN 重传浪费偏高", `丢失一帧后可能回退多个帧，估计重传浪费 ${fmt(s.waste * 100, 1)}%。`));
    if (v.arqMode === 2 && v.windowSize > 6) items.push(diagnostic("warn", "SR 缓存压力增加", "选择重传更省带宽，但接收端必须缓存乱序帧并维护更大的序号空间。"));
  }
  if (id === "dhcpnat") {
    const s = dhcpNatStats();
    if (s.starved > 0) items.push(diagnostic("danger", "地址池不足", `${s.starved} 台主机可能拿不到租约。现实中会看到 APIPA、重复地址或无法上网。`));
    if (s.portLoad > .75) items.push(diagnostic("warn", "NAT 表压力偏高", "大量短连接会占用端口映射，可能出现连接失败或回包找不到映射。"));
  }
  if (id === "trace") {
    if (v.icmpLoss > 18) items.push(diagnostic("warn", "ICMP 丢包偏高", "星号可能是限速或防火墙，不一定代表该跳路由器真的不可达。"));
    if (v.jitter > 55) items.push(diagnostic("warn", "RTT 抖动明显", "现实中需要区分排队拥塞、无线重传和回程路径变化。"));
  }
  if (!items.length) items.push(diagnostic("ok", "参数状态正常", "当前条件适合观察理想模型。继续改变单一变量，更容易定位因果关系。"));
  return items;
}

function updateDiagnostics() {
  if (!diagnosticsList) return;
  const items = diagnosticsData();
  diagnosticsPill.textContent = items.some(item => item.severity === "danger") ? "异常" : items.some(item => item.severity === "warn") ? "注意" : "正常";
  diagnosticsPill.classList.toggle("subtle", !items.some(item => item.severity === "danger"));
  diagnosticsList.innerHTML = items.map(item => `
    <div class="diagnostic-item ${item.severity}">
      <strong>${item.title}</strong>
      <p>${item.body}</p>
    </div>
  `).join("");
}

function headerBytes() {
  const depth = S.values.headerDepth;
  const tcp = depth >= 3 ? 20 : 0;
  const ip = depth >= 4 ? 20 : 0;
  const eth = depth >= 5 ? 18 : 0;
  return tcp + ip + eth;
}

function prefixToMask(prefix) {
  const parts = [];
  for (let i = 0; i < 4; i++) {
    const bits = clamp(prefix - i * 8, 0, 8);
    parts.push(bits === 0 ? 0 : 256 - Math.pow(2, 8 - bits));
  }
  return parts.join(".");
}

function routingResult() {
  const cost = Number(S.values.cost);
  const failed = Boolean(S.values.failure);
  const top = 2 + cost + 3;
  const middle = failed ? 99 : 2 + cost + 2;
  const bottom = 4 + 2 + 2;
  if (middle <= top && middle <= bottom) return { path: ["A", "B", "D", "F"], cost: middle };
  if (bottom < top) return { path: ["A", "C", "E", "F"], cost: bottom };
  return { path: ["A", "B", "E", "F"], cost: top };
}

function tcpPhase() {
  const p = (S.t % S.current.duration) / S.current.duration;
  if (p < .12) return "SYN";
  if (p < .24) return "SYN-ACK";
  if (p < .34) return "ESTABLISHED";
  return S.values.loss > 0 && Math.sin(S.t * 1.5) > .78 ? "重传" : "传输中";
}

function tcpCwnd() {
  const cycle = (S.t % 5) / 5;
  const peak = Math.max(4, S.values.bandwidth / 4);
  const base = 1 + cycle * peak;
  const lossFactor = 1 - S.values.loss / 18;
  return Math.max(1, base * lossFactor + 1.5 * Math.sin(S.t * 1.2));
}

function collisionProbability() {
  const load = S.values.load / 10;
  const stations = S.values.stations;
  const distance = S.values.length / 200;
  return clamp(1 - Math.exp(-load * stations * .18) + distance * .08, 0, .92);
}

function wirelessStats() {
  const distanceLoss = 20 * Math.log10(Math.max(1, S.values.distance));
  const interferenceLoss = S.values.interference * .18;
  const snrDb = clamp(38 - distanceLoss - interferenceLoss + 12, 1, 42);
  const snrLinear = Math.pow(10, snrDb / 10);
  const capacity = S.values.bandwidth * Math.log2(1 + snrLinear) * .72;
  const loss = clamp((18 - snrDb) * 1.8 + S.values.interference * .08, 0, 35);
  const delay = 8 + loss * 1.6 + Math.max(0, 35 - capacity) * .6;
  return { snrDb, capacity, loss, delay };
}

function crcStats() {
  const checkBits = [8, 16, 32][S.values.poly - 1] || 16;
  const expectedErrors = S.values.frameBits * (S.values.bitError / 100);
  const detected = expectedErrors > 0.08;
  const undetected = Math.pow(2, -checkBits);
  const burstCoverage = checkBits;
  return {
    checkBits,
    expectedErrors,
    detectRate: 1 - undetected,
    syndrome: detected ? "非零" : "0",
    burstCoverage
  };
}

function arqStats() {
  const modeName = ["停止等待", "GBN", "SR"][S.values.arqMode] || "ARQ";
  const a = 3.2;
  const window = S.values.arqMode === 0 ? 1 : S.values.windowSize;
  const loss = S.values.lossRate / 100;
  const baseUtil = Math.min(1, window / (1 + 2 * a));
  const modePenalty = S.values.arqMode === 1 ? loss * Math.max(1, window / 2) : S.values.arqMode === 2 ? loss * 1.2 : loss * 2.4;
  const utilization = clamp(baseUtil * (1 - modePenalty), 0.02, 1);
  const waste = clamp(S.values.arqMode === 1 ? loss * window * .55 : S.values.arqMode === 2 ? loss * .8 : loss * 1.4, 0, .95);
  return {
    modeName,
    utilization,
    waste,
    timeout: 180 + loss * 900 + a * 15
  };
}

function dhcpNatStats() {
  const leases = Math.min(S.values.clients, S.values.poolSize);
  const starved = Math.max(0, S.values.clients - S.values.poolSize);
  const mappings = Math.round(leases * (3 + S.values.portPressure / 12));
  const portLoad = clamp((S.values.portPressure / 100) * (S.values.clients / Math.max(1, S.values.poolSize)) * .92, 0, .98);
  return { leases, starved, mappings, portLoad };
}

function traceStats() {
  const avgRtt = 18 + S.values.maxTtl * 7 + S.values.jitter * .42;
  const stars = Math.round(S.values.maxTtl * S.values.icmpLoss / 100);
  const status = S.values.icmpLoss > 20 ? "需复测" : S.values.jitter > 50 ? "抖动大" : "可达";
  return { avgRtt, stars, status };
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  S.cssW = Math.max(320, rect.width);
  S.cssH = Math.max(220, rect.height);
  S.dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
  canvas.width = Math.round(S.cssW * S.dpr);
  canvas.height = Math.round(S.cssH * S.dpr);
  ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
  draw();
  updateMetrics();
}

function viewParams() {
  const z = S.view.zoom;
  return {
    cx: S.cssW / 2,
    cy: S.cssH / 2,
    sx: z * (1 - Math.abs(S.view.angle) * .018),
    sy: z * (1 - Math.abs(S.view.pitch) * .028),
    ox: Math.sin(S.view.angle) * S.cssW * .045 + S.view.panX,
    oy: Math.sin(S.view.pitch) * S.cssH * .035 + S.view.panY
  };
}

function applySceneView() {
  const p = viewParams();
  ctx.translate(p.cx + p.ox, p.cy + p.oy);
  ctx.scale(p.sx, p.sy);
  ctx.translate(-p.cx, -p.cy);
}

function toScenePoint(point) {
  const p = viewParams();
  return {
    x: (point.x - p.cx - p.ox) / p.sx + p.cx,
    y: (point.y - p.cy - p.oy) / p.sy + p.cy
  };
}

function updateViewHud() {
  if (!viewReadout) return;
  const yaw = Math.round(S.view.angle * 22);
  const pitch = Math.round(S.view.pitch * 16);
  viewReadout.textContent = `视角 ${yaw}°/${pitch}° · 缩放 ${Math.round(S.view.zoom * 100)}%`;
}

function applyView() {
  const lx = clamp(50 + Math.sin(S.view.angle) * 16, 18, 82);
  const ly = clamp(32 + Math.sin(S.view.pitch) * 11, 18, 68);
  stageWrap.style.setProperty("--light-x", `${lx.toFixed(1)}%`);
  stageWrap.style.setProperty("--light-y", `${ly.toFixed(1)}%`);
  updateViewHud();
}

function resetView() {
  S.view = { angle: 0, pitch: 0, zoom: 1, panX: 0, panY: 0 };
  applyView();
  draw();
}

function draw() {
  ctx.clearRect(0, 0, S.cssW, S.cssH);
  drawBackdrop();
  ctx.save();
  applySceneView();
  if (S.current.id === "stack") drawStack();
  if (S.current.id === "ethernet") drawEthernet();
  if (S.current.id === "subnet") drawSubnet();
  if (S.current.id === "routing") drawRouting();
  if (S.current.id === "tcp") drawTcp();
  if (S.current.id === "dns") drawDns();
  if (S.current.id === "csma") drawCsma();
  if (S.current.id === "wireless") drawWireless();
  if (S.current.id === "crc") drawCrc();
  if (S.current.id === "arq") drawArq();
  if (S.current.id === "dhcpnat") drawDhcpNat();
  if (S.current.id === "trace") drawTrace();
  ctx.restore();
  updateViewHud();
}

function drawBackdrop() {
  const W = S.cssW, H = S.cssH;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#dff5ff");
  g.addColorStop(.52, "#fff0d5");
  g.addColorStop(1, "#d8e5ea");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(255,255,255,.38)";
  for (let i = 0; i < 8; i++) {
    const x = (i * 173 + S.t * 12) % (W + 140) - 70;
    const y = 40 + (i % 3) * 42;
    roundRect(x, y, 92, 24, 999);
    ctx.fill();
  }

  drawDesk(0, H * .72, W, H * .28);
}

function drawDesk(x, y, w, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "rgba(245,214,166,.76)");
  g.addColorStop(1, "rgba(186,145,94,.78)");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(122,88,50,.18)";
  ctx.lineWidth = 1;
  for (let yy = y + 20; yy < y + h; yy += 24) {
    ctx.beginPath();
    ctx.moveTo(0, yy);
    ctx.lineTo(w, yy + Math.sin(yy * .03) * 4);
    ctx.stroke();
  }
}

function roundRect(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
}

function drawLabel(text, x, y, color = "#23313d", align = "left") {
  ctx.save();
  ctx.font = "bold 12px Microsoft YaHei, sans-serif";
  ctx.textAlign = align;
  ctx.fillStyle = "rgba(255,255,255,.82)";
  const w = ctx.measureText(text).width + 16;
  const bx = align === "center" ? x - w / 2 : x - 8;
  roundRect(bx, y - 17, w, 24, 8);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawDevice(x, y, w, h, color, label, kind = "pc") {
  ctx.save();
  ctx.fillStyle = "rgba(31,45,58,.18)";
  ctx.beginPath();
  ctx.ellipse(x, y + h * .62, w * .54, h * .16, 0, 0, TAU);
  ctx.fill();

  const baseY = y + h * .16;
  const g = ctx.createLinearGradient(x - w / 2, baseY, x + w / 2, baseY + h);
  g.addColorStop(0, lighten(color, .28));
  g.addColorStop(.58, color);
  g.addColorStop(1, darken(color, .22));
  ctx.fillStyle = "rgba(31,45,58,.22)";
  roundRect(x - w / 2 + 6, baseY + 10, w, h * .58, 10);
  ctx.fill();
  ctx.fillStyle = g;
  roundRect(x - w / 2, baseY, w, h * .58, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(35,49,61,.28)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,.75)";
  roundRect(x - w * .34, baseY + h * .13, w * .68, h * .16, 5);
  ctx.fill();

  if (kind === "router") {
    ctx.strokeStyle = "rgba(255,255,255,.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, baseY + h * .26, w * .22, 0, TAU);
    ctx.stroke();
    drawTinyArrow(x - 8, baseY + h * .26, x + 8, baseY + h * .26, "#fff");
  } else if (kind === "switch") {
    for (let i = -2; i <= 2; i++) {
      ctx.fillStyle = i % 2 ? "#ffd873" : "#9cf5dc";
      roundRect(x + i * 13 - 4, baseY + h * .35, 8, 8, 2);
      ctx.fill();
    }
  } else if (kind === "ap") {
    ctx.strokeStyle = "rgba(255,255,255,.85)";
    ctx.lineWidth = 2;
    for (let r = 14; r <= 34; r += 10) {
      ctx.beginPath();
      ctx.arc(x, baseY + 14, r, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    }
  }

  ctx.fillStyle = "#fff";
  ctx.font = "bold 13px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(label, x, baseY + h * .76);
  ctx.restore();
}

function lighten(hex, amount) {
  return shade(hex, amount);
}

function darken(hex, amount) {
  return shade(hex, -amount);
}

function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const r = clamp(((n >> 16) & 255) + amount * 255, 0, 255);
  const g = clamp(((n >> 8) & 255) + amount * 255, 0, 255);
  const b = clamp((n & 255) + amount * 255, 0, 255);
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

function drawLink(a, b, color = "rgba(63,120,181,.58)", width = 4, dashed = false) {
  ctx.save();
  ctx.strokeStyle = "rgba(35,49,61,.16)";
  ctx.lineWidth = width + 5;
  ctx.lineCap = "round";
  if (dashed) ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.restore();
}

function pointOnLine(a, b, t) {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

function drawPacketOnLine(a, b, t, label, color = "#2f9c9a") {
  const p = pointOnLine(a, b, t);
  drawPacket(p.x, p.y, label, color);
}

function drawPacket(x, y, label, color = "#2f9c9a") {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(31,45,58,.18)";
  ctx.beginPath();
  ctx.ellipse(6, 13, 28, 7, 0, 0, TAU);
  ctx.fill();
  const g = ctx.createLinearGradient(-24, -16, 24, 18);
  g.addColorStop(0, lighten(color, .38));
  g.addColorStop(.65, color);
  g.addColorStop(1, darken(color, .18));
  ctx.fillStyle = g;
  roundRect(-26, -18, 52, 32, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(35,49,61,.24)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 10px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(label, 0, 2);
  ctx.restore();
}

function drawTinyArrow(x1, y1, x2, y2, color = "#2f9c9a") {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - Math.cos(angle - .55) * 8, y2 - Math.sin(angle - .55) * 8);
  ctx.lineTo(x2 - Math.cos(angle + .55) * 8, y2 - Math.sin(angle + .55) * 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHotspotHints(items) {
  ctx.save();
  ctx.font = "12px Microsoft YaHei";
  items.forEach(item => {
    const active = S.hoverHotspot === item.key;
    const pulse = .56 + Math.sin(S.t * 3 + item.x * .01) * .14;
    ctx.fillStyle = active ? "rgba(255,255,255,.92)" : `rgba(255,255,255,${.55 + pulse * .2})`;
    ctx.beginPath();
    ctx.arc(item.x, item.y, (item.r || 18) + (active ? 7 : 0), 0, TAU);
    ctx.fill();
    ctx.strokeStyle = active ? "rgba(229,103,88,.82)" : `rgba(47,156,154,${.28 + pulse * .32})`;
    ctx.lineWidth = active ? 3 : 2;
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(138,60,54,.92)" : "rgba(36,50,64,.62)";
    ctx.fillText(item.text, item.x + 22, item.y + 4);
  });
  ctx.restore();
}

function drawStack() {
  const W = S.cssW, H = S.cssH;
  const left = { x: W * .18, y: H * .48 };
  const right = { x: W * .78, y: H * .48 };
  const midA = { x: W * .38, y: H * .52 };
  const midB = { x: W * .60, y: H * .52 };
  drawDevice(left.x, left.y, 108, 88, "#3f78b5", "Client");
  drawDevice(right.x, right.y, 108, 88, "#5a9b61", "Server");
  drawLink({ x: left.x + 72, y: left.y + 34 }, { x: right.x - 72, y: right.y + 34 }, "rgba(63,120,181,.55)", 5);

  const names = ["应用", "TCP", "IP", "以太网", "物理"];
  const active = S.values.headerDepth;
  const blockW = Math.min(112, Math.max(74, W * .20));
  const leftX = W * .08;
  const rightX = W - W * .08 - blockW;
  for (let i = 0; i < names.length; i++) {
    const y = H * .16 + i * 46;
    const color = i < active ? S.current.accent : "#b7c3ca";
    drawLayerBlock(leftX, y, names[i], color, blockW);
    drawLayerBlock(rightX, y, names[i], color, blockW);
  }

  const p = (S.t % S.current.duration) / S.current.duration;
  const total = S.values.payload + headerBytes();
  const fragments = Math.ceil(total / S.values.mtu);
  if (p < .22) {
    drawPacket(W * .18, lerp(H * .17, H * .34, p / .22), "DATA", "#d8a944");
  } else if (p < .72) {
    const tt = (p - .22) / .50;
    drawPacketOnLine(midA, midB, tt, fragments > 1 ? `F${Math.ceil(tt * fragments)}` : "FRAME", S.current.accent);
  } else {
    drawPacket(W * .78, lerp(H * .34, H * .17, (p - .72) / .28), "DATA", "#d8a944");
  }

  drawLabel(`MTU ${S.values.mtu}B，分片 ${fragments} 个`, W * .50, H * .30, "#236e69", "center");
  drawHotspotHints([
    { key: "app", x: W * .12, y: H * .16, text: "长按应用数据" },
    { key: "headers", x: W * .10, y: H * .29, text: "长按协议头" },
    { key: "packet", x: W * .50, y: H * .52, text: "长按数据包" },
    { key: "mtu", x: W * .50, y: H * .30, text: "长按 MTU" }
  ]);
}

function drawLayerBlock(x, y, text, color, width = 112) {
  ctx.save();
  ctx.fillStyle = "rgba(31,45,58,.14)";
  roundRect(x + 6, y + 7, width, 34, 8);
  ctx.fill();
  ctx.fillStyle = color;
  roundRect(x, y, width, 34, 8);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = `${width < 84 ? "bold 12px" : "bold 13px"} Microsoft YaHei`;
  ctx.textAlign = "center";
  ctx.fillText(text, x + width / 2, y + 22);
  ctx.restore();
}

function ethernetPositions() {
  const W = S.cssW, H = S.cssH;
  const center = { x: W * .50, y: H * .45 };
  const hosts = [];
  const count = S.values.hosts;
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI * .88 + i * (Math.PI * 1.76 / Math.max(1, count - 1));
    hosts.push({ x: center.x + Math.cos(angle) * W * .32, y: center.y + Math.sin(angle) * H * .34, label: `H${i + 1}` });
  }
  return { center, hosts };
}

function drawEthernet() {
  const { center, hosts } = ethernetPositions();
  hosts.forEach(host => drawLink(host, center, "rgba(63,120,181,.46)", 4));
  drawDevice(center.x, center.y, 130, 92, "#3f78b5", "Switch", "switch");
  hosts.forEach((host, i) => drawDevice(host.x, host.y, 82, 68, ["#2f9c9a", "#d8a944", "#e56758", "#5a9b61"][i % 4], host.label));

  const p = (S.t % S.current.duration) / S.current.duration;
  const src = hosts[0];
  const dst = hosts[Math.min(hosts.length - 1, 3)];
  if (p < .32) {
    hosts.slice(1).forEach((host, i) => {
      drawPacketOnLine(center, host, (p / .32 + i * .08) % 1, "ARP", "#e56758");
    });
    drawPacketOnLine(src, center, p / .32, "ARP", "#e56758");
  } else if (p < .55) {
    drawPacketOnLine(dst, center, (p - .32) / .23, "REPLY", "#5a9b61");
  } else {
    drawPacketOnLine(src, center, (p - .55) / .45, "DATA", "#2f9c9a");
    drawPacketOnLine(center, dst, clamp((p - .65) / .35, 0, 1), "DATA", "#2f9c9a");
  }
  drawMacTable(center.x + 96, center.y - 120);
  drawHotspotHints([
    { key: "switch", x: center.x, y: center.y, text: "长按交换机" },
    { key: "arp", x: center.x, y: center.y - 110, text: "长按 ARP" },
    { key: "frame", x: center.x - 120, y: center.y + 10, text: "长按帧" },
    { key: "table", x: center.x + 160, y: center.y - 80, text: "长按 MAC 表" }
  ]);
}

function drawMacTable(x, y) {
  const learned = Math.min(S.values.hosts, Math.floor(S.t / 1.2) + 1, S.values.tableSize);
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.82)";
  roundRect(x, y, 152, 104, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(63,120,181,.3)";
  ctx.stroke();
  ctx.fillStyle = "#23313d";
  ctx.font = "bold 12px Microsoft YaHei";
  ctx.fillText("MAC Table", x + 12, y + 20);
  ctx.font = "11px Consolas";
  for (let i = 0; i < Math.min(learned, 4); i++) {
    ctx.fillText(`H${i + 1}: 端口 ${i + 1}`, x + 12, y + 40 + i * 16);
  }
  ctx.restore();
}

function drawSubnet() {
  const W = S.cssW, H = S.cssH;
  const prefix = S.values.prefix;
  const bits = 32 - prefix;
  const usable = bits <= 1 ? 0 : Math.pow(2, bits) - 2;
  const x = W * .13, y = H * .21, w = W * .74, h = 92;
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.72)";
  roundRect(x, y, w, h, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(90,155,97,.34)";
  ctx.stroke();
  const networkW = w * (prefix / 32);
  ctx.fillStyle = "rgba(90,155,97,.84)";
  roundRect(x + 10, y + 22, networkW - 12, 42, 8);
  ctx.fill();
  ctx.fillStyle = "rgba(216,169,68,.84)";
  roundRect(x + networkW, y + 22, w - networkW - 10, 42, 8);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(`网络位 ${prefix}`, x + networkW / 2, y + 49);
  ctx.fillText(`主机位 ${bits}`, x + networkW + (w - networkW) / 2, y + 49);
  ctx.restore();

  const router = { x: W * .48, y: H * .55 };
  drawDevice(router.x, router.y, 126, 90, "#5a9b61", "Router", "router");
  const blocks = [
    { x: W * .20, y: H * .52, p: `192.168.0.0/${prefix}` },
    { x: W * .74, y: H * .36, p: `10.0.0.0/${Math.max(8, prefix - 4)}` },
    { x: W * .76, y: H * .62, p: "0.0.0.0/0" }
  ];
  blocks.forEach((b, i) => {
    drawLink(router, b, i === 0 ? "rgba(90,155,97,.62)" : "rgba(63,120,181,.36)", 4, i === 2);
    drawDevice(b.x, b.y, 106, 72, i === 0 ? "#5a9b61" : "#3f78b5", b.p);
  });
  drawLabel(`目标: 192.168.0.${S.values.target}`, W * .50, H * .38, "#236e69", "center");
  drawLabel(`可用主机 ${usable}`, W * .50, H * .18, "#7d6730", "center");
  drawPacketOnLine(blocks[0], router, (S.t % 2) / 2, "IP", "#5a9b61");
  drawHotspotHints([
    { key: "mask", x: x + networkW, y: y + 44, text: "长按掩码" },
    { key: "block", x: W * .50, y: y + 95, text: "长按地址块" },
    { key: "router", x: router.x, y: router.y, text: "长按路由器" },
    { key: "default", x: blocks[2].x, y: blocks[2].y, text: "长按默认路由" }
  ]);
}

function drawRouting() {
  const W = S.cssW, H = S.cssH;
  const nodes = {
    A: { x: W * .13, y: H * .46 },
    B: { x: W * .33, y: H * .28 },
    C: { x: W * .33, y: H * .64 },
    D: { x: W * .58, y: H * .32 },
    E: { x: W * .58, y: H * .62 },
    F: { x: W * .82, y: H * .46 }
  };
  const edges = [
    ["A", "B", 2], ["A", "C", 4], ["B", "D", S.values.cost], ["B", "E", 3],
    ["C", "E", 2], ["D", "F", 2], ["E", "F", 2], ["D", "E", S.values.failure ? 99 : 1]
  ];
  const result = routingResult();
  const pathEdges = new Set(result.path.slice(1).map((n, i) => `${result.path[i]}-${n}`));
  edges.forEach(([a, b, c]) => {
    const failed = c >= 99;
    const active = pathEdges.has(`${a}-${b}`) || pathEdges.has(`${b}-${a}`);
    drawLink(nodes[a], nodes[b], failed ? "rgba(229,103,88,.45)" : active ? "rgba(216,169,68,.82)" : "rgba(63,120,181,.34)", active ? 6 : 4, failed);
    const m = pointOnLine(nodes[a], nodes[b], .5);
    drawLabel(failed ? "故障" : String(c), m.x, m.y - 8, failed ? "#8a3c36" : "#526271", "center");
  });
  Object.entries(nodes).forEach(([name, p]) => drawDevice(p.x, p.y, 76, 64, name === "A" || name === "F" ? "#2f9c9a" : "#3f78b5", name, "router"));
  const routePoints = result.path.map(n => nodes[n]);
  const p = (S.t % S.current.duration) / S.current.duration;
  const seg = Math.min(routePoints.length - 2, Math.floor(p * (routePoints.length - 1)));
  const local = p * (routePoints.length - 1) - seg;
  drawPacketOnLine(routePoints[seg], routePoints[seg + 1], local, "IP", "#d8a944");
  drawHotspotHints([
    { key: "router", x: nodes.B.x, y: nodes.B.y, text: "长按路由器" },
    { key: "cost", x: W * .46, y: H * .30, text: "长按代价" },
    { key: "path", x: W * .50, y: H * .48, text: "长按路径" },
    { key: "failure", x: W * .68, y: H * .48, text: "长按收敛" }
  ]);
}

function drawTcp() {
  const W = S.cssW, H = S.cssH;
  const client = { x: W * .20, y: H * .42 };
  const server = { x: W * .78, y: H * .42 };
  drawDevice(client.x, client.y, 116, 86, "#3f78b5", "Client");
  drawDevice(server.x, server.y, 116, 86, "#e56758", "Server");
  drawLink({ x: client.x + 78, y: client.y + 28 }, { x: server.x - 78, y: server.y + 28 }, "rgba(229,103,88,.45)", 5);
  const p = (S.t % S.current.duration) / S.current.duration;
  if (p < .14) drawPacketOnLine(client, server, p / .14, "SYN", "#e56758");
  else if (p < .28) drawPacketOnLine(server, client, (p - .14) / .14, "SYN ACK", "#d8a944");
  else if (p < .40) drawPacketOnLine(client, server, (p - .28) / .12, "ACK", "#5a9b61");
  else {
    for (let i = 0; i < 4; i++) {
      const tt = ((p - .40) / .60 + i * .17) % 1;
      drawPacketOnLine(client, server, tt, `SEQ${i + 1}`, i === 2 && S.values.loss > 5 ? "#e56758" : "#2f9c9a");
    }
  }
  drawCwndGraph(W * .20, H * .62, W * .58, H * .22);
  drawLabel(`RTT ${S.values.rtt}ms`, W * .50, H * .31, "#7d3e38", "center");
  drawHotspotHints([
    { key: "handshake", x: W * .50, y: H * .37, text: "长按握手" },
    { key: "cwnd", x: W * .50, y: H * .64, text: "长按窗口" },
    { key: "loss", x: W * .62, y: H * .43, text: "长按丢包" },
    { key: "graph", x: W * .45, y: H * .74, text: "长按图像" }
  ]);
}

function drawCwndGraph(x, y, w, h) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.76)";
  roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(82,98,113,.24)";
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i < 80; i++) {
    const t = i / 79;
    const wave = (t * 5) % 1;
    const lossDrop = S.values.loss / 14;
    const value = clamp(wave * (1 - lossDrop) + .12, .05, .95);
    const px = x + t * w;
    const py = y + h - value * h;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = "#e56758";
  ctx.lineWidth = 3;
  ctx.stroke();
  drawLabel("cwnd", x + 40, y + 24, "#8a3c36");
  ctx.restore();
}

function drawDns() {
  const W = S.cssW, H = S.cssH;
  const nodes = {
    browser: { x: W * .12, y: H * .50, label: "Browser", color: "#3f78b5" },
    resolver: { x: W * .34, y: H * .34, label: "Resolver", color: "#7664a8" },
    root: { x: W * .54, y: H * .23, label: "Root", color: "#d8a944" },
    tld: { x: W * .70, y: H * .34, label: "TLD", color: "#5a9b61" },
    auth: { x: W * .83, y: H * .50, label: "Auth", color: "#2f9c9a" },
    web: { x: W * .58, y: H * .66, label: "Web", color: "#e56758" }
  };
  const seq = S.values.cache ? ["browser", "resolver", "browser", "web"] : ["browser", "resolver", "root", "resolver", "tld", "resolver", "auth", "resolver", "browser", "web"];
  Object.values(nodes).forEach(n => drawDevice(n.x, n.y, 92, 70, n.color, n.label, n.label === "Web" ? "switch" : "router"));
  for (let i = 0; i < seq.length - 1; i++) drawLink(nodes[seq[i]], nodes[seq[i + 1]], "rgba(118,100,168,.34)", 4);
  const p = (S.t % S.current.duration) / S.current.duration;
  const seg = Math.min(seq.length - 2, Math.floor(p * (seq.length - 1)));
  const local = p * (seq.length - 1) - seg;
  drawPacketOnLine(nodes[seq[seg]], nodes[seq[seg + 1]], local, seg < seq.length - 2 ? "DNS" : "HTTP", seg < seq.length - 2 ? "#7664a8" : "#e56758");
  if (S.values.tls) drawLabel("TLS handshake enabled", W * .58, H * .55, "#705fbc", "center");
  drawLabel(`对象 ${S.values.objects} 个`, W * .72, H * .74, "#8a3c36", "center");
  drawHotspotHints([
    { key: "browser", x: nodes.browser.x, y: nodes.browser.y, text: "长按浏览器" },
    { key: "resolver", x: nodes.resolver.x, y: nodes.resolver.y, text: "长按解析器" },
    { key: "server", x: nodes.web.x, y: nodes.web.y, text: "长按服务器" },
    { key: "tls", x: W * .58, y: H * .55, text: "长按 TLS" }
  ]);
}

function drawCsma() {
  const W = S.cssW, H = S.cssH;
  const y = H * .48;
  const x1 = W * .12, x2 = W * .88;
  drawLink({ x: x1, y }, { x: x2, y }, "rgba(199,120,64,.65)", 8);
  const n = S.values.stations;
  const hosts = [];
  for (let i = 0; i < n; i++) {
    const x = lerp(x1 + 30, x2 - 30, i / Math.max(1, n - 1));
    hosts.push({ x, y: y - 120 + (i % 2) * 240, label: `S${i + 1}` });
    drawLink({ x, y }, hosts[i], "rgba(199,120,64,.28)", 3);
    drawDevice(hosts[i].x, hosts[i].y, 78, 62, i % 2 ? "#d8a944" : "#c97840", hosts[i].label);
  }
  const p = (S.t % S.current.duration) / S.current.duration;
  const collision = collisionProbability() > .35 && Math.sin(S.t * 2.2) > .42;
  drawPacketOnLine(hosts[0], { x: W * .50, y }, p, "FRAME", "#c97840");
  drawPacketOnLine(hosts[n - 1], { x: W * .50, y }, 1 - p, "FRAME", "#d8a944");
  if (collision) {
    drawBurst(W * .50, y, "#e56758");
    drawLabel("Collision", W * .50, y - 28, "#8a3c36", "center");
  } else {
    drawLabel("Carrier Sense", W * .50, y - 28, "#7d6730", "center");
  }
  drawHotspotHints([
    { key: "bus", x: W * .50, y, text: "长按总线" },
    { key: "collision", x: W * .50, y: y - 54, text: "长按碰撞" },
    { key: "backoff", x: hosts[1]?.x || W * .35, y: hosts[1]?.y || H * .30, text: "长按退避" },
    { key: "delay", x: W * .72, y, text: "长按时延" }
  ]);
}

function drawBurst(x, y, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * 18, y + Math.sin(a) * 18);
    ctx.lineTo(x + Math.cos(a) * 42, y + Math.sin(a) * 42);
    ctx.stroke();
  }
  ctx.restore();
}

function drawWireless() {
  const W = S.cssW, H = S.cssH;
  const ap = { x: W * .32, y: H * .50 };
  const client = { x: map(S.values.distance, 2, 80, W * .43, W * .82), y: H * .50 + Math.sin(S.t) * 14 };
  const stats = wirelessStats();
  drawDevice(ap.x, ap.y, 118, 90, "#6b8fce", "AP", "ap");
  drawDevice(client.x, client.y, 92, 70, stats.snrDb > 18 ? "#2f9c9a" : "#e56758", "STA");
  drawWirelessRings(ap.x, ap.y, S.values.distance, stats.snrDb);
  drawLink(ap, client, stats.snrDb > 18 ? "rgba(47,156,154,.55)" : "rgba(229,103,88,.52)", 5, stats.snrDb < 14);
  for (let i = 0; i < 3; i++) {
    const tt = ((S.t * .18) + i * .28) % 1;
    drawPacketOnLine(ap, client, tt, "Wi-Fi", stats.snrDb > 18 ? "#2f9c9a" : "#e56758");
  }
  if (S.values.interference > 40) {
    drawBurst(W * .62, H * .34, "#e56758");
    drawLabel("Interference", W * .62, H * .30, "#8a3c36", "center");
  }
  drawLabel(`${S.values.bandwidth}MHz · ${fmt(stats.capacity, 1)}Mbps`, W * .50, H * .70, "#255f79", "center");
  drawHotspotHints([
    { key: "ap", x: ap.x, y: ap.y, text: "长按 AP" },
    { key: "signal", x: W * .46, y: H * .40, text: "长按信号" },
    { key: "interference", x: W * .62, y: H * .34, text: "长按干扰" },
    { key: "capacity", x: W * .50, y: H * .70, text: "长按容量" }
  ]);
}

function drawWirelessRings(x, y, distance, snr) {
  ctx.save();
  for (let i = 1; i <= 4; i++) {
    ctx.strokeStyle = snr > 18 ? `rgba(47,156,154,${.24 / i})` : `rgba(229,103,88,${.26 / i})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y + 10, i * map(distance, 2, 80, 38, 84), 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCrc() {
  const W = S.cssW, H = S.cssH;
  const sender = { x: W * .15, y: H * .54 };
  const receiver = { x: W * .83, y: H * .54 };
  const mid = { x: W * .50, y: H * .54 };
  const stats = crcStats();
  const p = (S.t % S.current.duration) / S.current.duration;

  drawDevice(sender.x, sender.y, 104, 80, "#b65a8d", "TX");
  drawDevice(receiver.x, receiver.y, 104, 80, stats.expectedErrors > .08 ? "#e56758" : "#5a9b61", "RX");
  drawLink({ x: sender.x + 70, y: sender.y + 28 }, { x: receiver.x - 70, y: receiver.y + 28 }, stats.expectedErrors > 5 ? "rgba(229,103,88,.56)" : "rgba(182,90,141,.55)", 5, stats.expectedErrors > 6);

  const barX = W * .20, barY = H * .22, bitW = Math.min(22, W * .56 / 30);
  const bitCount = 28;
  const checkCount = S.values.poly === 3 ? 5 : S.values.poly === 2 ? 4 : 3;
  const errorCount = clamp(Math.round(stats.expectedErrors / 1.8), 0, 9);
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.78)";
  roundRect(barX - 14, barY - 20, bitW * (bitCount + checkCount) + 34, 86, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(182,90,141,.22)";
  ctx.stroke();
  ctx.font = "bold 11px Consolas, Microsoft YaHei";
  ctx.textAlign = "center";
  for (let i = 0; i < bitCount + checkCount; i++) {
    const isCrc = i >= bitCount;
    const flipped = !isCrc && i < bitCount && i % 7 < errorCount / 2;
    const x = barX + i * bitW;
    ctx.fillStyle = flipped ? "#e56758" : isCrc ? "#7664a8" : i % 2 ? "#3f78b5" : "#2f9c9a";
    roundRect(x, barY, bitW - 3, 34, 5);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(flipped ? "!" : String(i % 2), x + bitW / 2 - 1, barY + 22);
  }
  ctx.fillStyle = "#526271";
  ctx.textAlign = "left";
  ctx.fillText("data bits", barX, barY + 57);
  ctx.fillText(`${stats.checkBits} bit FCS`, barX + bitW * bitCount, barY + 57);
  ctx.restore();

  for (let i = 0; i < 3; i++) {
    const tt = (p + i * .22) % 1;
    drawPacketOnLine(sender, receiver, tt, tt < .55 ? "FRAME" : "FCS", tt < .55 ? "#b65a8d" : "#7664a8");
  }
  if (errorCount > 0) {
    drawBurst(mid.x, mid.y - 8, "#e56758");
    drawLabel(`bit error ≈ ${fmt(stats.expectedErrors, 1)}`, mid.x, mid.y - 58, "#8a3c36", "center");
  }

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.80)";
  roundRect(W * .36, H * .66, W * .30, 68, 10);
  ctx.fill();
  ctx.strokeStyle = stats.syndrome === "0" ? "rgba(90,155,97,.35)" : "rgba(229,103,88,.35)";
  ctx.stroke();
  ctx.fillStyle = "#23313d";
  ctx.font = "bold 13px Microsoft YaHei";
  ctx.fillText(`G(x): ${["CRC-8", "CRC-16", "CRC-32"][S.values.poly - 1]}`, W * .38, H * .70);
  ctx.fillText(`syndrome: ${stats.syndrome}`, W * .38, H * .75);
  ctx.restore();

  drawHotspotHints([
    { key: "data", x: W * .30, y: H * .25, text: "长按比特流" },
    { key: "crc", x: W * .64, y: H * .25, text: "长按 CRC" },
    { key: "noise", x: mid.x, y: mid.y - 18, text: "长按噪声" },
    { key: "syndrome", x: W * .52, y: H * .70, text: "长按综合症" }
  ]);
}

function drawArq() {
  const W = S.cssW, H = S.cssH;
  const left = { x: W * .16, y: H * .45 };
  const right = { x: W * .82, y: H * .45 };
  const stats = arqStats();
  const mode = S.values.arqMode;
  const windowSize = mode === 0 ? 1 : S.values.windowSize;
  const loss = S.values.lossRate;
  const p = (S.t % S.current.duration) / S.current.duration;
  const lostIndex = loss > 3 ? Math.min(windowSize - 1, 2) : -1;

  drawDevice(left.x, left.y, 112, 84, "#c98b2f", "Sender");
  drawDevice(right.x, right.y, 112, 84, "#3f78b5", "Receiver");
  drawLink({ x: left.x + 76, y: left.y + 25 }, { x: right.x - 76, y: right.y + 25 }, "rgba(201,139,47,.45)", 5);
  drawLink({ x: right.x - 76, y: right.y + 60 }, { x: left.x + 76, y: left.y + 60 }, "rgba(63,120,181,.34)", 4, true);

  const startX = W * .28, y = H * .23, frameW = Math.min(58, W * .40 / 8);
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.78)";
  roundRect(startX - 18, y - 26, frameW * 8 + 36, 116, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(201,139,47,.22)";
  ctx.stroke();
  ctx.font = "bold 11px Microsoft YaHei";
  ctx.textAlign = "center";
  for (let i = 0; i < 8; i++) {
    const inWindow = i < windowSize;
    const lost = i === lostIndex;
    ctx.fillStyle = lost ? "#e56758" : inWindow ? "#c98b2f" : "rgba(82,98,113,.22)";
    roundRect(startX + i * frameW, y, frameW - 6, 42, 7);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(lost ? "loss" : `F${i}`, startX + i * frameW + frameW / 2 - 3, y + 26);
  }
  ctx.strokeStyle = "#e56758";
  ctx.lineWidth = 2;
  if (lostIndex >= 0) {
    const lx = startX + lostIndex * frameW + frameW / 2;
    ctx.beginPath();
    ctx.arc(lx, y + 21, 30, 0, TAU);
    ctx.stroke();
  }
  ctx.fillStyle = "#526271";
  ctx.textAlign = "left";
  ctx.fillText(`mode: ${stats.modeName}`, startX, y + 70);
  ctx.fillText(`window=${windowSize}, timeout≈${fmt(stats.timeout, 0)}ms`, startX + frameW * 3.2, y + 70);
  ctx.restore();

  for (let i = 0; i < windowSize; i++) {
    const tt = (p * 1.25 + i * .10) % 1;
    if (i !== lostIndex || Math.sin(S.t * 2) < .5) {
      drawPacketOnLine(left, right, tt, `F${i}`, i === lostIndex ? "#e56758" : "#c98b2f");
    }
  }
  for (let i = 0; i < Math.min(windowSize, 4); i++) {
    const tt = (p * 1.1 + i * .16 + .35) % 1;
    drawPacketOnLine({ x: right.x, y: right.y + 52 }, { x: left.x, y: left.y + 52 }, tt, `ACK${i + 1}`, "#3f78b5");
  }
  if (lostIndex >= 0 && mode !== 2) {
    drawLabel("GBN 可能回退重传后续帧", W * .50, H * .63, "#8a3c36", "center");
  } else if (lostIndex >= 0) {
    drawLabel("SR 只重传缺失帧，但需要缓存乱序帧", W * .50, H * .63, "#8a3c36", "center");
  } else {
    drawLabel(`利用率 ${fmt(stats.utilization * 100, 1)}%`, W * .50, H * .63, "#7d6730", "center");
  }

  drawHotspotHints([
    { key: "window", x: W * .41, y: H * .26, text: "长按窗口" },
    { key: "ack", x: W * .60, y: H * .53, text: "长按 ACK" },
    { key: "retransmit", x: W * .50, y: H * .63, text: "长按重传" },
    { key: "mode", x: W * .48, y: H * .33, text: "长按模式" }
  ]);
}

function drawDhcpNat() {
  const W = S.cssW, H = S.cssH;
  const stats = dhcpNatStats();
  const gateway = { x: W * .58, y: H * .47 };
  const dhcp = { x: W * .38, y: H * .28 };
  const internet = { x: W * .84, y: H * .48 };
  const p = (S.t % S.current.duration) / S.current.duration;
  const clients = [];
  const count = S.values.clients;

  for (let i = 0; i < count; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    clients.push({ x: W * .12 + col * W * .065, y: H * .30 + row * H * .17, label: `C${i + 1}` });
  }
  clients.forEach((client, i) => {
    const leased = i < stats.leases;
    drawLink(client, gateway, leased ? "rgba(74,159,115,.32)" : "rgba(229,103,88,.28)", 3, !leased);
    drawDevice(client.x, client.y, 70, 58, leased ? "#4a9f73" : "#e56758", client.label);
  });
  drawDevice(dhcp.x, dhcp.y, 108, 76, "#7664a8", "DHCP", "switch");
  drawDevice(gateway.x, gateway.y, 126, 88, stats.portLoad > .75 ? "#e56758" : "#4a9f73", "NAT GW", "router");
  drawDevice(internet.x, internet.y, 112, 82, "#3f78b5", "Internet", "router");
  drawLink(dhcp, clients[0] || gateway, "rgba(118,100,168,.38)", 4, true);
  drawLink(gateway, internet, stats.portLoad > .75 ? "rgba(229,103,88,.50)" : "rgba(63,120,181,.48)", 5);

  const dora = ["DISC", "OFFER", "REQ", "ACK"];
  const seq = p < .5 ? Math.floor(p / .5 * 4) : 3;
  const routeA = clients[0] || { x: W * .18, y: H * .45 };
  const from = seq % 2 === 0 ? routeA : dhcp;
  const to = seq % 2 === 0 ? dhcp : routeA;
  drawPacketOnLine(from, to, (p * 4) % 1, dora[seq], "#7664a8");
  if (p > .48) {
    for (let i = 0; i < 3; i++) {
      drawPacketOnLine(gateway, internet, (p + i * .25) % 1, "NAT", stats.portLoad > .75 ? "#e56758" : "#4a9f73");
    }
  }

  ctx.save();
  const tx = W * .66, ty = H * .18;
  ctx.fillStyle = "rgba(255,255,255,.80)";
  roundRect(tx, ty, W * .23, 122, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(74,159,115,.25)";
  ctx.stroke();
  ctx.fillStyle = "#23313d";
  ctx.font = "bold 12px Microsoft YaHei";
  ctx.fillText("NAT translation table", tx + 14, ty + 24);
  ctx.font = "11px Consolas, Microsoft YaHei";
  for (let i = 0; i < Math.min(4, stats.mappings); i++) {
    ctx.fillText(`192.168.1.${20 + i}:${5100 + i} -> 203.0.113.8:${40000 + i}`, tx + 14, ty + 46 + i * 18);
  }
  ctx.restore();

  if (stats.starved > 0) drawLabel(`${stats.starved} clients no lease`, W * .26, H * .72, "#8a3c36", "center");
  drawLabel(`leases ${stats.leases}/${S.values.poolSize}`, dhcp.x, dhcp.y - 60, "#705fbc", "center");
  drawHotspotHints([
    { key: "dhcp", x: dhcp.x, y: dhcp.y, text: "长按 DHCP" },
    { key: "lease", x: W * .24, y: H * .30, text: "长按租约" },
    { key: "nat", x: gateway.x, y: gateway.y, text: "长按 NAT" },
    { key: "port", x: W * .76, y: H * .23, text: "长按端口表" }
  ]);
}

function drawTrace() {
  const W = S.cssW, H = S.cssH;
  const hops = S.values.maxTtl;
  const stats = traceStats();
  const p = (S.t % S.current.duration) / S.current.duration;
  const nodes = [];
  for (let i = 0; i <= hops; i++) {
    nodes.push({
      x: lerp(W * .10, W * .86, i / hops),
      y: H * (.47 + Math.sin(i * 1.15) * .12),
      label: i === 0 ? "SRC" : i === hops ? "DST" : `R${i}`
    });
  }
  for (let i = 0; i < nodes.length - 1; i++) {
    const noisy = S.values.icmpLoss > 18 && i % 4 === 2;
    drawLink(nodes[i], nodes[i + 1], noisy ? "rgba(229,103,88,.38)" : "rgba(79,127,200,.40)", noisy ? 4 : 5, noisy);
  }
  nodes.forEach((node, i) => drawDevice(node.x, node.y, i === 0 || i === hops ? 78 : 62, i === 0 || i === hops ? 64 : 54, i === 0 ? "#2f9c9a" : i === hops ? "#5a9b61" : "#4f7fc8", node.label, "router"));

  const ttl = Math.max(1, Math.min(hops, Math.floor(p * hops) + 1));
  const route = nodes.slice(0, ttl + 1);
  const seg = Math.min(route.length - 2, Math.floor((p * hops - (ttl - 1)) * Math.max(1, route.length - 1)));
  const from = route[Math.max(0, seg)] || nodes[0];
  const to = route[Math.min(route.length - 1, Math.max(1, seg + 1))] || nodes[ttl];
  drawPacketOnLine(from, to, (p * hops) % 1, `TTL ${ttl}`, "#4f7fc8");
  if (ttl < hops) drawPacketOnLine(nodes[ttl], nodes[0], (p * 1.4) % 1, "ICMP", "#e56758");

  ctx.save();
  const tx = W * .16, ty = H * .68, tw = W * .68;
  ctx.fillStyle = "rgba(255,255,255,.80)";
  roundRect(tx, ty, tw, 74, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(79,127,200,.24)";
  ctx.stroke();
  ctx.font = "bold 11px Consolas, Microsoft YaHei";
  ctx.fillStyle = "#23313d";
  for (let i = 1; i <= Math.min(hops, 8); i++) {
    const x = tx + 18 + (i - 1) * (tw - 36) / 8;
    const lost = S.values.icmpLoss > 10 && i % Math.max(2, Math.round(32 / S.values.icmpLoss)) === 0;
    ctx.fillStyle = lost ? "#e56758" : "#4f7fc8";
    ctx.fillText(lost ? `${i}: *` : `${i}: ${Math.round(15 + i * 7 + Math.sin(i + S.t) * S.values.jitter * .15)}ms`, x, ty + 32);
  }
  ctx.fillStyle = "#526271";
  ctx.fillText(`avg RTT ${fmt(stats.avgRtt, 1)}ms · ${stats.status}`, tx + 18, ty + 58);
  ctx.restore();

  if (S.values.jitter > 50) drawBurst(W * .68, H * .30, "#e56758");
  drawHotspotHints([
    { key: "ttl", x: nodes[ttl].x, y: nodes[ttl].y - 42, text: "长按 TTL" },
    { key: "icmp", x: W * .40, y: H * .34, text: "长按 ICMP" },
    { key: "rtt", x: W * .50, y: H * .72, text: "长按 RTT" },
    { key: "path", x: W * .58, y: H * .46, text: "长按路径" }
  ]);
}

function getHotspots() {
  const W = S.cssW, H = S.cssH;
  const id = S.current.id;
  if (id === "stack") return [
    ["app", W * .12, H * .16, 70], ["headers", W * .10, H * .29, 80], ["packet", W * .50, H * .52, 100], ["mtu", W * .50, H * .30, 90]
  ];
  if (id === "ethernet") {
    const { center } = ethernetPositions();
    return [["switch", center.x, center.y, 90], ["arp", center.x, center.y - 110, 90], ["frame", center.x - 120, center.y + 10, 90], ["table", center.x + 160, center.y - 80, 100]];
  }
  if (id === "subnet") return [["mask", W * .52, H * .27, 90], ["block", W * .50, H * .35, 90], ["router", W * .48, H * .55, 95], ["default", W * .76, H * .62, 90]];
  if (id === "routing") return [["router", W * .33, H * .28, 80], ["cost", W * .46, H * .30, 90], ["path", W * .50, H * .48, 100], ["failure", W * .68, H * .48, 90]];
  if (id === "tcp") return [["handshake", W * .50, H * .37, 100], ["cwnd", W * .50, H * .64, 100], ["loss", W * .62, H * .43, 90], ["graph", W * .45, H * .74, 120]];
  if (id === "dns") return [["browser", W * .12, H * .50, 80], ["resolver", W * .34, H * .34, 90], ["server", W * .58, H * .66, 90], ["tls", W * .58, H * .55, 80]];
  if (id === "csma") return [["bus", W * .50, H * .48, 100], ["collision", W * .50, H * .40, 90], ["backoff", W * .34, H * .32, 100], ["delay", W * .72, H * .48, 90]];
  if (id === "crc") return [["data", W * .30, H * .25, 95], ["crc", W * .64, H * .25, 90], ["noise", W * .50, H * .51, 105], ["syndrome", W * .52, H * .70, 105]];
  if (id === "arq") return [["window", W * .41, H * .26, 105], ["ack", W * .60, H * .53, 95], ["retransmit", W * .50, H * .63, 120], ["mode", W * .48, H * .33, 105]];
  if (id === "dhcpnat") return [["dhcp", W * .38, H * .28, 90], ["lease", W * .24, H * .30, 115], ["nat", W * .58, H * .47, 100], ["port", W * .76, H * .23, 120]];
  if (id === "trace") return [["ttl", W * .44, H * .33, 120], ["icmp", W * .40, H * .34, 105], ["rtt", W * .50, H * .72, 130], ["path", W * .58, H * .46, 125]];
  return [["ap", W * .32, H * .50, 90], ["signal", W * .46, H * .40, 100], ["interference", W * .62, H * .34, 100], ["capacity", W * .50, H * .70, 100]];
}

function getHotspotAt(x, y) {
  return getHotspots().find(([key, hx, hy, r]) => Math.hypot(x - hx, y - hy) <= r)?.[0] || null;
}

function canvasPoint(evt) {
  const rect = canvas.getBoundingClientRect();
  const source = evt.touches ? evt.touches[0] : evt;
  return {
    x: (source.clientX - rect.left) * (S.cssW / rect.width),
    y: (source.clientY - rect.top) * (S.cssH / rect.height)
  };
}

function showHoverTip(hot, point) {
  if (!hoverTip) return;
  const card = hot ? S.current.cards[hot] : null;
  if (!card) {
    hoverTip.classList.remove("show");
    hoverTip.style.display = "none";
    return;
  }
  hoverTip.innerHTML = `<b>${card.label}</b><span> 长按查看详细解析</span>`;
  hoverTip.style.display = "block";
  hoverTip.classList.add("show");
  const x = clamp(point.x + 14, 10, S.cssW - 270);
  const y = clamp(point.y + 16, 10, S.cssH - 70);
  hoverTip.style.left = `${x}px`;
  hoverTip.style.top = `${y}px`;
}

function updateTilt(x, y) {
  S.pointer.x = clamp(x / S.cssW, 0, 1);
  S.pointer.y = clamp(y / S.cssH, 0, 1);
  const tiltX = (0.5 - S.pointer.y) * 2.2;
  const tiltY = (S.pointer.x - 0.5) * 2.8;
  stageWrap.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
  stageWrap.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
  stageWrap.style.setProperty("--light-x", `${(S.pointer.x * 100).toFixed(1)}%`);
  stageWrap.style.setProperty("--light-y", `${(S.pointer.y * 100).toFixed(1)}%`);
}

function resetTilt() {
  updateTilt(S.cssW / 2, S.cssH / 2);
}

function inferDragTarget(x, y) {
  const controls = S.current.controls;
  if (controls.length === 1) return controls[0].key;
  if (S.current.id === "stack") return y < S.cssH * .36 ? "payload" : x < S.cssW * .5 ? "mtu" : "headerDepth";
  if (S.current.id === "ethernet") return x < S.cssW * .4 ? "hosts" : y < S.cssH * .5 ? "arpRate" : "tableSize";
  if (S.current.id === "subnet") return y < S.cssH * .4 ? "prefix" : x < S.cssW * .55 ? "target" : "routes";
  if (S.current.id === "routing") return x < S.cssW * .46 ? "cost" : y < S.cssH * .5 ? "failure" : "traffic";
  if (S.current.id === "tcp") return x < S.cssW * .42 ? "rtt" : y < S.cssH * .55 ? "loss" : "bandwidth";
  if (S.current.id === "dns") return x < S.cssW * .35 ? "cache" : y < S.cssH * .55 ? "tls" : "objects";
  if (S.current.id === "csma") return x < S.cssW * .36 ? "stations" : y < S.cssH * .55 ? "load" : "length";
  return x < S.cssW * .45 ? "distance" : y < S.cssH * .5 ? "interference" : "bandwidth";
}

function applyDrag(key, x, y) {
  const control = S.current.controls.find(item => item.key === key);
  if (!control) return;
  let ratio = clamp(x / S.cssW, 0, 1);
  if (key === "loss" || key === "interference" || key === "load" || key === "traffic") ratio = clamp(1 - y / S.cssH, 0, 1);
  if (key === "failure" || key === "cache" || key === "tls") ratio = x > S.cssW * .5 ? 1 : 0;
  let value = control.min + ratio * (control.max - control.min);
  value = Math.round(value / control.step) * control.step;
  S.values[key] = clamp(value, control.min, control.max);
}

function beginPointer(evt) {
  const p = canvasPoint(evt);
  const scene = toScenePoint(p);
  updateTilt(p.x, p.y);
  const hot = getHotspotAt(scene.x, scene.y);
  S.hoverHotspot = hot;
  showHoverTip(hot, p);
  if (hot) {
    clearTimeout(S.longPressTimer);
    S.longPressTimer = setTimeout(() => {
      const card = S.current.cards[hot];
      if (card) {
        setKnowledge(card, card.label);
        showToast(`已打开知识点：${card.label}`);
      }
    }, 450);
  }
  S.viewDrag = {
    startX: p.x,
    startY: p.y,
    angle: S.view.angle,
    pitch: S.view.pitch,
    panX: S.view.panX,
    panY: S.view.panY
  };
  canvas.classList.add("dragging");
  draw();
}

function movePointer(evt) {
  const p = canvasPoint(evt);
  const scene = toScenePoint(p);
  updateTilt(p.x, p.y);
  const hot = getHotspotAt(scene.x, scene.y);
  if (hot !== S.hoverHotspot) {
    S.hoverHotspot = hot;
    draw();
  }
  showHoverTip(hot, p);
  if (!S.viewDrag) return;
  const dx = p.x - S.viewDrag.startX;
  const dy = p.y - S.viewDrag.startY;
  if (Math.hypot(dx, dy) > 10) {
    clearTimeout(S.longPressTimer);
    S.longPressTimer = null;
  }
  S.view.angle = clamp(S.viewDrag.angle + dx / Math.max(260, S.cssW * .42), -1.35, 1.35);
  S.view.pitch = clamp(S.viewDrag.pitch + dy / Math.max(240, S.cssH * .42), -1.05, 1.05);
  S.view.panX = clamp(S.viewDrag.panX + dx * .10, -S.cssW * .06, S.cssW * .06);
  S.view.panY = clamp(S.viewDrag.panY + dy * .08, -S.cssH * .05, S.cssH * .05);
  applyView();
  draw();
}

function endPointer() {
  clearTimeout(S.longPressTimer);
  S.longPressTimer = null;
  S.dragTarget = null;
  S.viewDrag = null;
  canvas.classList.remove("dragging");
  applyView();
}

function leavePointer() {
  clearTimeout(S.longPressTimer);
  S.longPressTimer = null;
  S.hoverHotspot = null;
  S.viewDrag = null;
  canvas.classList.remove("dragging");
  showHoverTip(null, { x: 0, y: 0 });
  applyView();
  draw();
}

function handleWheel(evt) {
  evt.preventDefault();
  const next = clamp(S.view.zoom * (evt.deltaY > 0 ? .94 : 1.06), .82, 1.22);
  S.view.zoom = next;
  applyView();
  draw();
}

function bindEvents() {
  openBookBtn.addEventListener("click", () => {
    coverScene.classList.add("hidden");
    lab.classList.add("active");
    setTimeout(resizeCanvas, 80);
    showToast("实验书已打开。播放观察，暂停后长按热点可看解析。");
  });

  homeBtn.addEventListener("click", () => {
    lab.classList.remove("active");
    coverScene.classList.remove("hidden");
    resetSimulation(false);
  });

  catalogBtn.addEventListener("click", () => catalog.classList.toggle("open"));

  universityBtn.addEventListener("click", () => {
    universityPanel.classList.toggle("open");
    universityBtn.classList.toggle("active", universityPanel.classList.contains("open"));
  });

  closeUniversityBtn.addEventListener("click", () => {
    universityPanel.classList.remove("open");
    universityBtn.classList.remove("active");
  });

  flagshipList.addEventListener("click", event => {
    const btn = event.target.closest("[data-exp]");
    if (btn) selectExperiment(btn.dataset.exp);
  });

  controlsEl.addEventListener("input", event => {
    const input = event.target.closest("input[type='range']");
    if (!input) return;
    S.values[input.dataset.key] = Number(input.value);
    updateControlOutputs();
    softReset();
    draw();
    updateMetrics();
    renderUniversity();
  });

  playBtn.addEventListener("click", play);
  pauseBtn.addEventListener("click", pause);
  resetBtn.addEventListener("click", () => resetSimulation(true));
  resetViewBtn.addEventListener("click", resetView);

  canvas.addEventListener("mousedown", beginPointer);
  canvas.addEventListener("mousemove", movePointer);
  canvas.addEventListener("mouseleave", leavePointer);
  canvas.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("mouseup", endPointer);
  canvas.addEventListener("touchstart", beginPointer, { passive: true });
  canvas.addEventListener("touchmove", movePointer, { passive: true });
  window.addEventListener("touchend", endPointer);

  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("keydown", event => {
    if (event.key === " ") {
      event.preventDefault();
      if (lab.classList.contains("active")) S.running ? pause() : play();
      else openBookBtn.click();
    }
    if (event.key.toLowerCase() === "u" && lab.classList.contains("active")) universityBtn.click();
    if (event.key.toLowerCase() === "r" && lab.classList.contains("active")) resetSimulation(true);
  });
}

function init() {
  S.values = defaultValues(S.current);
  renderTabs();
  renderFullCatalog();
  renderControls();
  renderStaticText();
  updateMetrics();
  bindEvents();
  requestAnimationFrame(resizeCanvas);
}

init();
