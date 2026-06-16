const firstNames = [
  "Ana Carolina", "Marcos Vinicius", "Beatriz", "Joao Pedro", "Camila", "Rafael",
  "Juliana", "Felipe", "Patricia", "Lucas", "Fernanda", "Bruno", "Aline", "Gustavo",
  "Larissa", "Thiago", "Mariana", "Eduardo", "Isabela", "Rodrigo", "Leticia", "Caio",
  "Priscila", "Daniel", "Renata", "Andre", "Sabrina", "Vinicius", "Carla", "Matheus",
  "Bianca", "Leandro", "Natalia", "Henrique", "Tatiane", "Diego", "Vanessa", "Samuel",
  "Luana", "Cesar", "Helena", "Miguel", "Claudia", "Paulo", "Debora", "Igor",
  "Mirela", "Otavio", "Yasmin", "Wesley"
];

const lastNames = [
  "Souza", "Lima", "Andrade", "Martins", "Nogueira", "Teixeira", "Batista", "Azevedo",
  "Gomes", "Ferreira", "Rocha", "Cavalcante", "Oliveira", "Santos", "Pereira", "Costa",
  "Almeida", "Barbosa", "Cardoso", "Ribeiro", "Moura", "Correia", "Dantas", "Freitas",
  "Vieira", "Mendes", "Moreira", "Araujo", "Campos", "Monteiro", "Rezende", "Macedo",
  "Farias", "Assis", "Tavares", "Moraes", "Pinto", "Carvalho", "Borges", "Sales"
];

const jobs = [
  ["enfermeira", 0.48], ["médico", 0.86], ["caixa de supermercado", 0.24],
  ["professora", 0.42], ["advogado", 0.74], ["empreendedora", 0.66],
  ["motorista de aplicativo", 0.32], ["servidora publica", 0.52],
  ["engenheiro", 0.78], ["comerciante", 0.58], ["designer", 0.55],
  ["programador", 0.72], ["analista financeiro", 0.68], ["contador", 0.62],
  ["vendedor", 0.38], ["gerente comercial", 0.7], ["corretor de imóveis", 0.64],
  ["psicóloga", 0.6], ["dentista", 0.8], ["fisioterapeuta", 0.58],
  ["farmacêutica", 0.57], ["nutricionista", 0.56], ["personal trainer", 0.5],
  ["barbeiro", 0.42], ["cabeleireira", 0.4], ["manicure", 0.34],
  ["cozinheira", 0.33], ["chef de cozinha", 0.62], ["garcom", 0.28],
  ["recepcionista", 0.32], ["secretaria", 0.36], ["assistente administrativo", 0.4],
  ["mecanico", 0.44], ["eletricista", 0.46], ["pedreiro", 0.35],
  ["arquiteta", 0.76], ["veterinária", 0.7], ["policial", 0.52],
  ["bombeiro", 0.5], ["militar", 0.54], ["produtora de conteudo", 0.58],
  ["influ?nciador local", 0.66], ["fotografa", 0.52], ["jornalista", 0.55],
  ["publicitária", 0.6], ["consultor", 0.72], ["produtor rural", 0.5],
  ["agricultora", 0.42], ["caminhoneiro", 0.48], ["estudante", 0.22],
  ["aposentada", 0.38], ["dona de casa", 0.3], ["empresario", 0.82]
];

const regions = [
  ["Nordeste", -0.18], ["Sul", 0.18], ["Sudeste", 0.04],
  ["Norte", -0.08], ["Centro-Oeste", 0.12]
];

const religions = [
  ["evangélica", 0.32], ["católica", 0.08], ["sem religião", -0.22],
  ["espírita", -0.02], ["umbandista", -0.04], ["candomblecista", -0.05],
  ["judaica", 0.02], ["islâmica", 0.01], ["budista", -0.08],
  ["hinduísta", -0.06], ["ateia", -0.25], ["agnóstica", -0.18],
  ["testemunha de jeova", 0.18], ["adventista", 0.22], ["mormon", 0.2],
  ["outra", 0.0]
];

const interests = [
  "família", "futebol", "basquete", "animes", "livros", "carros esportivos",
  "golf", "igreja", "viagens", "politica local", "saúde", "educação",
  "corrida", "ciclismo", "musculação", "crossfit", "natação", "volei",
  "tenis", "skate", "surf", "jiu-jitsu", "boxe", "mma", "handebol",
  "xadrez", "games", "cinema", "series", "teatro", "musica", "violao",
  "piano", "fotografia", "culinária", "jardinagem", "moda", "maquiagem",
  "tecnologia", "podcasts", "investimentos", "empreendedorismo",
  "carros antigos", "motos", "pesca", "trilhas", "camping", "praia",
  "vinhos", "cafes especiais", "artesanato", "decoração", "voluntariado"
];

const state = {
  agents: [],
  graph: [],
  positions: [],
  lastRun: null,
  running: false,
  visualActive: new Set(),
  visualAttempts: [],
  liveStep: 0,
  liveFailed: 0,
  aiAnalysis: null,
  calibrationRows: [],
  history: [],
  actualComparison: null
};

const $ = (id) => document.getElementById(id);

function rand(min = 0, max = 1) {
  return min + Math.random() * (max - min);
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function normalish() {
  return (Math.random() + Math.random() + Math.random()) / 3;
}

function makeName(id) {
  const firstName = firstNames[id % firstNames.length];
  const firstLast = lastNames[Math.floor(id / firstNames.length) % lastNames.length];
  const secondLast = lastNames[(id * 7 + 11) % lastNames.length];
  return secondLast === firstLast
    ? `${firstName} ${firstLast}`
    : `${firstName} ${firstLast} ${secondLast}`;
}

function makeAgent(id) {
  const [job, incomeBase] = pick(jobs);
  const [region, regionBias] = pick(regions);
  const [religion, religionBias] = pick(religions);
  const age = Math.round(rand(16, 74));
  const income = clamp(incomeBase + rand(-0.18, 0.18));
  const education = clamp(income * 0.72 + normalish() * 0.28 + rand(-0.12, 0.12));
  const politicalInterest = clamp(normalish() + rand(-0.2, 0.25));
  const mediaTrust = clamp(normalish() + rand(-0.25, 0.25));
  const conflictTolerance = clamp(normalish() + rand(-0.2, 0.2));
  const adFatigue = clamp(normalish() + rand(-0.18, 0.22));
  const economicAxis = clamp(0.5 + regionBias + (income - 0.5) * 0.38 + rand(-0.34, 0.34));
  const customsAxis = clamp(0.5 + religionBias + (age - 38) / 150 + rand(-0.28, 0.28));
  const sponsorSensitivity = clamp(income * 0.35 + politicalInterest * 0.3 + rand(0, 0.35));
  const familySize = Math.round(rand(0, 10));
  const personInterests = [...new Set([pick(interests), pick(interests), pick(interests)])];

  return {
    id,
    name: makeName(id),
    age,
    job,
    region,
    religion,
    familySize,
    income,
    education,
    politicalInterest,
    mediaTrust,
    conflictTolerance,
    adFatigue,
    economicAxis,
    customsAxis,
    sponsorSensitivity,
    interests: personInterests,
    influence: 0,
    reaction: "none"
  };
}

function generateAgents(size) {
  return Array.from({ length: size }, (_, id) => makeAgent(id));
}

function addEdge(graph, a, b) {
  if (a === b || graph[a].has(b)) return;
  graph[a].add(b);
  graph[b].add(a);
}

function generateBarabasiAlbert(size, m) {
  const graph = Array.from({ length: size }, () => new Set());
  const initial = Math.max(m + 1, 3);

  for (let i = 0; i < initial; i += 1) {
    for (let j = i + 1; j < initial; j += 1) addEdge(graph, i, j);
  }

  const targets = [];
  for (let i = 0; i < initial; i += 1) {
    for (let d = 0; d < graph[i].size; d += 1) targets.push(i);
  }

  for (let node = initial; node < size; node += 1) {
    const chosen = new Set();
    while (chosen.size < Math.min(m, node)) {
      chosen.add(targets[Math.floor(Math.random() * targets.length)] ?? Math.floor(rand(0, node)));
    }
    chosen.forEach((target) => {
      addEdge(graph, node, target);
      targets.push(target, node);
    });
  }

  return graph.map((set) => [...set]);
}

function assignInfluence(agents, graph) {
  const maxDegree = Math.max(...graph.map((n) => n.length), 1);
  agents.forEach((agent) => {
    const degreeScore = graph[agent.id].length / maxDegree;
    agent.influence = clamp(degreeScore * 0.65 + agent.politicalInterest * 0.25 + agent.income * 0.1);
  });
}

function layoutGraph(graph) {
  const size = graph.length;
  const positions = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < size; i += 1) {
    const radius = Math.sqrt((i + 0.5) / size);
    const theta = i * golden;
    positions.push({
      x: 0.5 + Math.cos(theta) * radius * 0.46,
      y: 0.5 + Math.sin(theta) * radius * 0.46
    });
  }
  return positions;
}

function articleFromControls() {
  return {
    title: $("articleTitle").value,
    rightPraise: Number($("rightPraise").value),
    contextQuality: Number($("contextQuality").value),
    provocation: Number($("provocation").value),
    localRelevance: Number($("localRelevance").value),
    offerStrength: Number($("rightPraise").value),
    messageClarity: Number($("contextQuality").value),
    friction: Number($("provocation").value),
    audienceFit: Number($("localRelevance").value)
  };
}

function creativeInput() {
  return {
    campaign: $("articleTitle").value.trim(),
    niche: $("briefNiche").value.trim(),
    channel: $("briefChannel").value.trim(),
    objective: $("briefObjective").value.trim(),
    ticket: $("briefTicket").value.trim(),
    product: $("briefProduct").value.trim(),
    audience: $("briefAudience").value.trim(),
    stage: $("briefStage").value.trim(),
    plannedBudget: $("briefBudget").value.trim(),
    objection: $("briefObjection").value.trim(),
    proof: $("briefProof").value.trim(),
    guarantee: $("briefGuarantee").value.trim(),
    headline: $("creativeHeadline").value.trim(),
    body: $("creativeBody").value.trim(),
    offer: $("creativeOffer").value.trim(),
    cta: $("creativeCta").value.trim()
  };
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function meaningfulness(value) {
  const text = String(value || "").toLowerCase().trim();
  if (!text) return 0;
  const letters = (text.match(/[a-zà-ú]/gi) || []).length;
  const vowels = (text.match(/[aeiouáéíóúãõâêô]/gi) || []).length;
  const words = text.split(/\s+/).filter(Boolean);
  const uniqueChars = new Set(text.replace(/\s/g, "").split("")).size;
  const repeatedChunk = /([a-z]{2,5})\1{2,}/i.test(text);
  const keyboardNoise = /(asd|sada|dsad|qwe|zxc|teste teste)/i.test(text);
  let score = 0;
  if (letters >= 8) score += 25;
  if (words.length >= 3) score += 25;
  if (vowels / Math.max(letters, 1) > 0.22) score += 20;
  if (uniqueChars >= 7) score += 15;
  if (/[0-9%$r]/i.test(text)) score += 5;
  if (repeatedChunk) score -= 35;
  if (keyboardNoise) score -= 35;
  if (words.length <= 1 && letters > 12) score -= 20;
  return clampScore(score);
}

function inputQuality(input) {
  const fields = [
    ["nicho", input.niche],
    ["produto/serviço", input.product],
    ["público-alvo", input.audience],
    ["headline", input.headline],
    ["texto do anúncio", input.body],
    ["oferta", input.offer],
    ["CTA", input.cta]
  ];
  const details = fields.map(([label, value]) => ({ label, score: meaningfulness(value) }));
  const valid = details.filter((item) => item.score >= 35).map((item) => item.label);
  const invalid = details.filter((item) => item.score < 35).map((item) => item.label);
  const average = Math.round(details.reduce((sum, item) => sum + item.score, 0) / details.length);
  return { average, valid, invalid, isNoise: average < 32 || valid.length < 3 };
}

function parseNumber(value) {
  if (value === undefined || value === null) return 0;
  const match = String(value).replace("R$", "").replace("%", "").match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return 0;
  const raw = match[0];
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function splitCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function parseCalibrationCsv(csv) {
  const lines = csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((header) => header.toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] || "";
    });
    return normalizeCalibrationRow(row);
  }).filter(Boolean);
}

function normalizeCalibrationRow(row) {
  const ctr = parseNumber(row.ctr);
  const cpc = parseNumber(row.cpc);
  const cpa = parseNumber(row.cpa);
  const conversions = parseNumber(row.conversions);
  const spend = parseNumber(row.spend);
  const result = String(row.result || row.performance || "").toLowerCase();
  const positiveResult = /(bom|good|winner|ganhou|escala|lucro|aprovado)/i.test(result);
  const negativeResult = /(ruim|bad|loser|perdeu|reprovado|baixo)/i.test(result);
  const performanceScore = clampScore(
    (ctr ? Math.min(ctr, 8) * 8 : 0) +
      (cpc ? Math.max(0, 25 - Math.min(cpc, 25)) : 0) +
      (cpa ? Math.max(0, 35 - Math.min(cpa, 35)) : 0) +
      (conversions ? Math.min(conversions, 20) * 1.4 : 0) +
      (positiveResult ? 18 : 0) -
      (negativeResult ? 22 : 0)
  );
  return {
    niche: String(row.niche || row.nicho || "").toLowerCase(),
    channel: String(row.channel || row.canal || "").toLowerCase(),
    objective: String(row.objective || row.objetivo || "").toLowerCase(),
    ctr,
    cpc,
    cpa,
    conversions,
    spend,
    result,
    performanceScore
  };
}

function saveCalibrationRows(rows) {
  state.calibrationRows = rows;
  try {
    localStorage.setItem("hydraCalibrationRows", JSON.stringify(rows));
  } catch {
    // Storage can be unavailable in restricted previews; calibration still works for this session.
  }
  renderCalibration();
  if (state.aiAnalysis) {
    state.aiAnalysis = applyCalibrationToAnalysis(state.aiAnalysis, creativeInput());
    renderAiAnalysis(state.aiAnalysis);
    $("reportOutput").innerHTML = generateReportHtml();
  }
}

async function fetchCalibrationRows() {
  $("calibrationOutput").innerHTML = "Carregando histórico versionado do Git...";
  try {
    const response = await fetch("/api/calibration");
    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();
    state.calibrationRows = Array.isArray(data.rows) ? data.rows : [];
    renderCalibration(data);
    if (state.aiAnalysis) {
      state.aiAnalysis = applyCalibrationToAnalysis(state.aiAnalysis, creativeInput());
      renderAiAnalysis(state.aiAnalysis);
      $("reportOutput").innerHTML = generateReportHtml();
    }
  } catch (error) {
    state.calibrationRows = [];
    $("calibrationOutput").innerHTML = `Não consegui carregar /api/calibration: ${escapeHtml(error.message)}. O Hydra vai usar apenas IA e simulação.`;
  }
}

function loadCalibrationRows() {
  try {
    state.calibrationRows = JSON.parse(localStorage.getItem("hydraCalibrationRows") || "[]");
  } catch {
    state.calibrationRows = [];
  }
  renderCalibration();
}

function matchCalibrationRows(input) {
  const niche = input.niche.toLowerCase();
  const channel = input.channel.toLowerCase();
  const objective = input.objective.toLowerCase();
  return state.calibrationRows.filter((row) => {
    const nicheMatch = !row.niche || !niche || row.niche === niche;
    const channelMatch = !row.channel || !channel || row.channel === channel;
    const objectiveMatch = !row.objective || !objective || row.objective === objective;
    return nicheMatch && channelMatch && objectiveMatch;
  });
}

function getCalibrationInsight(input) {
  const matched = matchCalibrationRows(input);
  if (matched.length === 0) {
    return {
      sampleSize: 0,
      confidence: "baixa",
      benchmarkScore: null,
      message: "Sem histórico compativel. Recomendação baseada em IA, regras e simulação sintética."
    };
  }
  const avgPerformance = matched.reduce((sum, row) => sum + row.performanceScore, 0) / matched.length;
  const confidence = matched.length >= 30 ? "alta" : matched.length >= 10 ? "media" : "baixa";
  return {
    sampleSize: matched.length,
    confidence,
    benchmarkScore: clampScore(avgPerformance),
    message: `Comparado com ${matched.length} campanha(s) historica(s) compativeis. Benchmark médio: ${clampScore(avgPerformance)}/100.`
  };
}

function applyCalibrationToAnalysis(analysis, input) {
  const calibration = getCalibrationInsight(input);
  if (!calibration.benchmarkScore && calibration.benchmarkScore !== 0) {
    return { ...analysis, calibration };
  }
  const calibratedScore = clampScore(analysis.hydraScore * 0.72 + calibration.benchmarkScore * 0.28);
  return {
    ...analysis,
    hydraScore: calibratedScore,
    wasteRisk: clampScore(analysis.wasteRisk * 0.72 + (100 - calibration.benchmarkScore) * 0.28),
    verdict: calibratedScore >= 78 ? "escalar" : calibratedScore >= 58 ? "testar" : "revisar",
    calibration
  };
}

function renderCalibration(apiData = null) {
  const count = state.calibrationRows.length;
  if (!count) {
    const error = apiData?.error ? ` Erro: ${apiData.error}` : "";
    $("calibrationOutput").innerHTML = `Sem histórico carregado do Git.${escapeHtml(error)} O Hydra usa apenas diagnóstico estrategico e simulação sintética.`;
    return;
  }
  const avg = state.calibrationRows.reduce((sum, row) => sum + row.performanceScore, 0) / count;
  $("calibrationOutput").innerHTML = `
    <h3>Histórico do Git carregado</h3>
    <div class="aiScoreGrid">
      <div><span>Campanhas</span><strong>${count}</strong></div>
      <div><span>Benchmark</span><strong>${clampScore(avg)}</strong></div>
      <div><span>Fonte</span><strong>${apiData?.source || "git"}</strong></div>
    </div>
    <p>Arquivo: <strong>data/campaign-history.csv</strong>. O Hydra compara novos criativos contra esse histórico por nicho, canal e objetivo quando houver compatibilidade.</p>
  `;
}

function heuristicCreativeAnalysis(input, fallbackReason = "Análise local do navegador acionada.") {
  const quality = inputQuality(input);
  if (quality.isNoise) {
    return {
      source: "heuristic",
      hydraScore: 8,
      attention: 5,
      clarity: 4,
      offer: 3,
      cta: 3,
      trust: 2,
      friction: 92,
      audienceFit: 5,
      wasteRisk: 96,
      verdict: "revisar",
      suggestedBudget: "Não investir. O briefing não contem informação suficiente para validar tráfego pago.",
      mainBottleneck: "entrada invalida",
      fallbackReason,
      diagnosis: `Entrada sem sentido comercial suficiente. Campos sem informação util: ${quality.invalid.join(", ")}. O Hydra precisa de produto, público, promessa, oferta e CTA reais para anteceder tráfego pago.`,
      improvements: [
        "Informe qual produto ou serviço sera anunciado.",
        "Descreva o público-alvo com contexto real.",
        "Escreva uma headline compreens?vel.",
        "Explique a oferta e o CTA sem texto aleatorio."
      ],
      actionPlan: [
        "Substituir textos aleatorios por briefing real.",
        "Preencher produto, público, oferta e CTA.",
        "Rodar Analisar com IA novamente.",
        "Só depois usar a simulação de propagação."
      ],
      improvedHeadline: "Preencha uma headline real antes de gerar versão sugerida.",
      improvedBody: "O texto enviado não tem conteudo suficiente para reescrita confiavel.",
      improvedCta: "Informe uma ação real, como chamar no WhatsApp ou solicitar avaliação."
    };
  }

  const all = `${input.headline} ${input.body} ${input.offer} ${input.cta} ${input.product} ${input.audience} ${input.objection} ${input.proof} ${input.guarantee}`.toLowerCase();
  const hasNumber = /\d/.test(all);
  const hasUrgency = /(hoje|agora|limitad|ultim|grátis|gratuita|bônus|desconto)/i.test(all);
  const hasPain = /(dor|problema|dificuldade|perder|cansad|sem tempo|caro|risco)/i.test(all);
  const hasProof = Boolean(input.proof) || /(depoimento|case|clientes|antes|depois|resultado|anos|garantia)/i.test(all);
  const hasAudience = Boolean(input.audience) || Boolean(input.niche);
  const hasRiskReducer = Boolean(input.guarantee) || /(garantia|grátis|sem compromisso|avaliação|teste)/i.test(all);
  const hasAction = /(clique|chame|agende|compre|solicite|fale|baixe|acesse)/i.test(input.cta);
  const textLength = all.length;
  const clarity = clampScore(40 + (input.headline.length > 18 ? 12 : 0) + (input.cta.length > 8 ? 12 : 0) + (hasAudience ? 10 : 0) - (textLength > 900 ? 18 : 0));
  const offer = clampScore(34 + (hasNumber ? 14 : 0) + (hasUrgency ? 14 : 0) + (input.offer.length > 18 ? 12 : 0) + (hasRiskReducer ? 10 : 0));
  const attention = clampScore(38 + (hasPain ? 16 : 0) + (hasUrgency ? 10 : 0) + (input.headline.length > 45 ? 8 : 0) + (hasAudience ? 8 : 0));
  const cta = clampScore(35 + (hasAction ? 30 : 0) + (input.cta.length > 12 ? 14 : 0));
  const trust = clampScore(35 + (hasProof ? 22 : 0) + (hasRiskReducer ? 16 : 0) + (input.ticket ? 6 : 0));
  const friction = clampScore(100 - ((clarity + offer + cta + trust) / 4));
  const audienceFit = clampScore((attention + clarity + offer + (hasAudience ? 80 : 45)) / 4);
  const hydraScore = clampScore(attention * 0.16 + clarity * 0.18 + offer * 0.18 + cta * 0.13 + trust * 0.15 + audienceFit * 0.14 + (100 - friction) * 0.06);
  const bottlenecks = [
    ["clareza", clarity],
    ["oferta", offer],
    ["CTA", cta],
    ["confiança", trust],
    ["aderência", audienceFit]
  ].sort((a, b) => a[1] - b[1]);

  return {
    source: "heuristic",
    hydraScore,
    attention,
    clarity,
    offer,
    cta,
    trust,
    friction,
    audienceFit,
    wasteRisk: clampScore(100 - hydraScore + friction * 0.25),
    verdict: hydraScore >= 78 ? "escalar" : hydraScore >= 58 ? "testar" : "revisar",
    suggestedBudget: hydraScore >= 78 ? "Teste controlado com 20% a 35% da verba planejada." : hydraScore >= 58 ? "Teste pequeno com 5% a 15% da verba planejada." : "Não investir ainda. Revisar antes de comprar mídia.",
    mainBottleneck: bottlenecks[0][0],
    fallbackReason,
    diagnosis: `Análise local: ${fallbackReason}`,
    improvements: [
      "Deixe a promessa mais especifica e mensuravel.",
      "Inclua um benefício concreto no início da headline.",
      "Troque CTA genérico por uma ação simples e direta.",
      "Responda a objeção principal antes do clique.",
      "Inclua prova social ou garantia se o público ainda estiver frio."
    ],
    actionPlan: [
      "Reescrever headline com promessa direta.",
      "Fortalecer oferta ou reduzir risco percebido.",
      "Ajustar CTA ao objetivo da campanha.",
      "Rodar simulação ap?s aplicar a versão sugerida."
    ],
    improvedHeadline: input.headline || "Resolva seu problema com uma oferta clara hoje",
    improvedBody: input.body || "Apresente a dor, mostre o benefício principal, reduza risco e convide para uma ação simples.",
    improvedCta: hasAction ? input.cta : "Clique e solicite sua avaliação"
  };
}

function parseAiContent(content) {
  const cleaned = content.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

async function analyzeCreativeWithHF() {
  const input = creativeInput();

  if (!input.headline && !input.body && !input.offer && !input.cta) {
    $("aiStatus").textContent = "Preencha o criativo antes de analisar.";
    $("aiOutput").innerHTML = `<h3>Nenhum criativo informado</h3><p>Cole pelo menos headline, texto, oferta ou CTA para o Hydra diagnósticar.</p>`;
    return;
  }

  $("aiStatus").textContent = "Analisando criativo...";
  $("analyzeCreativeButton").disabled = true;
  $("aiOutput").innerHTML = `<h3>Análise em andamento</h3><p>O Hydra est? consultando o backend e preparando scores, melhorias e veredito.</p>`;

  try {
    let analysis;
    const response = await fetch("/api/analyze-creative", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ creative: input })
    });

    if (!response.ok) throw new Error(`API ${response.status}`);
    analysis = await response.json();
    $("aiStatus").textContent = analysis.source === "heuristic"
      ? "Análise local do servidor gerada. Verifique HF_TOKEN na Vercel se esperava IA."
      : "Análise de IA conclu?da pelo backend.";

    applyCreativeAnalysis(analysis);
  } catch (error) {
    const fallback = heuristicCreativeAnalysis(input, `O navegador não conseguiu chamar /api/analyze-creative: ${error.message}`);
    $("aiStatus").textContent = `Backend indisponivel (${error.message}). Usei análise local no navegador.`;
    applyCreativeAnalysis(fallback);
  } finally {
    $("analyzeCreativeButton").disabled = false;
  }
}

function applyCreativeAnalysis(raw) {
  const analysis = {
    source: raw.source || "huggingface",
    hydraScore: clampScore(raw.hydraScore),
    attention: clampScore(raw.attention),
    clarity: clampScore(raw.clarity),
    offer: clampScore(raw.offer),
    cta: clampScore(raw.cta),
    trust: clampScore(raw.trust),
    friction: clampScore(raw.friction),
    audienceFit: clampScore(raw.audienceFit),
    wasteRisk: clampScore(raw.wasteRisk),
    verdict: ["escalar", "testar", "revisar"].includes(raw.verdict) ? raw.verdict : "testar",
    suggestedBudget: raw.suggestedBudget || "",
    mainBottleneck: raw.mainBottleneck || "",
    fallbackReason: raw.fallbackReason || "",
    diagnosis: raw.diagnosis || "Diagnóstico indisponivel.",
    improvements: Array.isArray(raw.improvements) ? raw.improvements.slice(0, 6) : [],
    actionPlan: Array.isArray(raw.actionPlan) ? raw.actionPlan.slice(0, 6) : [],
    improvedHeadline: raw.improvedHeadline || "",
    improvedBody: raw.improvedBody || "",
    improvedCta: raw.improvedCta || ""
  };

  state.aiAnalysis = applyCalibrationToAnalysis(analysis, creativeInput());
  $("rightPraise").value = analysis.offer / 100;
  $("contextQuality").value = analysis.clarity / 100;
  $("provocation").value = analysis.friction / 100;
  $("localRelevance").value = analysis.audienceFit / 100;
  renderAiAnalysis(state.aiAnalysis);
  renderCommercialPanels();
  saveAnalysisSnapshot();
  $("reportOutput").innerHTML = generateReportHtml();
}

function budgetAmount(value) {
  const parsed = parseNumber(value);
  return parsed > 0 ? parsed : 300;
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  });
}

function commercialDecision(analysis = state.aiAnalysis, run = state.lastRun) {
  if (!analysis) return null;
  const input = creativeInput();
  const planned = budgetAmount(input.plannedBudget);
  const runWaste = run ? run.financialRisk * 100 : analysis.wasteRisk;
  const rejectionRisk = run ? (run.negative / Math.max(run.positive + run.negative + run.neutral, 1)) * 100 : analysis.friction;
  const financialScore = clampScore(
    analysis.hydraScore * 0.42 +
      (100 - analysis.wasteRisk) * 0.25 +
      analysis.trust * 0.12 +
      analysis.cta * 0.1 +
      (100 - runWaste) * 0.11
  );
  const verdict = financialScore >= 78 ? "escalar" : financialScore >= 58 ? "testar" : "revisar";
  const minPct = verdict === "escalar" ? 0.2 : verdict === "testar" ? 0.05 : 0;
  const maxPct = verdict === "escalar" ? 0.35 : verdict === "testar" ? 0.15 : 0;
  const predictedCtr = clamp(0.35 + analysis.attention * 0.025 + analysis.clarity * 0.012 + analysis.offer * 0.01 - analysis.friction * 0.012, 0.2, 5.8);
  const predictedCpc = clamp(4.2 - analysis.clarity * 0.018 - analysis.cta * 0.012 + analysis.friction * 0.018, 0.45, 5.5);
  const predictedCpa = clamp(predictedCpc * (18 - analysis.offer * 0.08 - analysis.trust * 0.05), 8, 180);

  return {
    financialScore,
    verdict,
    verdictView: verdictDisplay(verdict),
    planned,
    budgetMin: planned * minPct,
    budgetMax: planned * maxPct,
    days: verdict === "escalar" ? 5 : verdict === "testar" ? 3 : 0,
    predictedCtr,
    predictedCpc,
    predictedCpa,
    rejectionRisk: clampScore(rejectionRisk),
    negativeCommentsRisk: clampScore(rejectionRisk * 0.72 + analysis.friction * 0.28),
    saturationRisk: clampScore(analysis.attention * 0.22 + analysis.friction * 0.42 + (100 - analysis.offer) * 0.36),
    wasteRisk: clampScore(runWaste),
    killRule: verdict === "revisar"
      ? "Não comprar mídia antes de corrigir oferta, clareza ou CTA."
      : `Pausar se CTR ficar abaixo de ${Math.max(0.4, predictedCtr * 0.55).toFixed(2)}% ou CPC passar de R$ ${(predictedCpc * 1.55).toFixed(2)}.`,
    scaleRule: verdict === "escalar"
      ? `Escalar se CTR passar de ${Math.max(1, predictedCtr * 1.12).toFixed(2)}% e CPA ficar abaixo de R$ ${(predictedCpa * 0.9).toFixed(2)}.`
      : "Só escalar depois de uma versão A/B superar o criativo original por CTR, CPC e qualidade dos leads."
  };
}

function creativeVariants(input = creativeInput(), analysis = state.aiAnalysis) {
  const product = input.product || input.niche || "sua oferta";
  const audience = input.audience || "público certo";
  const proof = input.proof || "prova social";
  const guarantee = input.guarantee || "baixo risco";
  return [
    {
      name: "A - Promessa direta",
      angle: "clareza",
      headline: analysis?.improvedHeadline || `${product}: resultado claro para ${audience}`,
      body: analysis?.improvedBody || `Mostre o principal benefício, explique para quem e e reduza a dúvida antes do clique.`,
      cta: analysis?.improvedCta || input.cta || "Chame no WhatsApp"
    },
    {
      name: "B - Prova social",
      angle: "confiança",
      headline: `${proof}: veja por que ${product} funciona`,
      body: `Use evidência real, números ou depoimento. Conecte a prova com a objeção principal do público.`,
      cta: input.cta || "Quero ver os resultados"
    },
    {
      name: "C - Dor urgente",
      angle: "aten??o",
      headline: `Ainda enfrentando esse problema? ${product} pode encurtar o caminho`,
      body: `Comece pela dor, mostre consequência de adiar e apresente a solução com uma ação simples.`,
      cta: input.cta || "Resolver agora"
    },
    {
      name: "D - Redutor de risco",
      angle: "risco",
      headline: `${product} com ${guarantee}`,
      body: `Tire o medo da primeira ação. Explique como funciona, o que a pessoa recebe e por que o teste e seguro.`,
      cta: input.cta || "Solicitar avaliação"
    }
  ];
}

function testMatrix(input = creativeInput(), analysis = state.aiAnalysis) {
  const decision = commercialDecision(analysis);
  return creativeVariants(input, analysis).map((variant, index) => ({
    ...variant,
    audience: index === 0 ? input.stage || "Público frio" : index === 1 ? "Público morno / remarketing" : index === 2 ? "Público frio com dor ativa" : "Público inseguro",
    budget: decision ? money(Math.max(decision.budgetMin / 4, decision.planned * 0.02)) : "-",
    metric: index === 1 ? "CPC + comentários qualificados" : index === 2 ? "CTR + taxa de conversa" : "CTR + CPA",
    decision: "Manter apenas se superar o original ou reduzir risco de verba."
  }));
}

function renderCommercialPanels() {
  const decision = commercialDecision();
  if (!decision) return;
  $("commercialOutput").innerHTML = `
    <div class="aiScoreGrid">
      <div class="${decision.verdictView.boxClass}"><span>Status</span><strong class="${decision.verdictView.textClass}">${decision.verdictView.label}</strong></div>
      <div><span>Score financeiro</span><strong>${decision.financialScore}</strong></div>
      <div><span>Verba teste</span><strong>${decision.budgetMax ? `${money(decision.budgetMin)}-${money(decision.budgetMax)}` : "R$ 0"}</strong></div>
      <div><span>Dias</span><strong>${decision.days || "-"}</strong></div>
      <div><span>CTR previsto</span><strong>${decision.predictedCtr.toFixed(2)}%</strong></div>
      <div><span>CPC previsto</span><strong>R$ ${decision.predictedCpc.toFixed(2)}</strong></div>
      <div><span>CPA risco</span><strong>R$ ${decision.predictedCpa.toFixed(0)}</strong></div>
      <div><span>Saturação</span><strong>${decision.saturationRisk}/100</strong></div>
    </div>
    <p><strong>Corte:</strong> ${escapeHtml(decision.killRule)}</p>
    <p><strong>Escala:</strong> ${escapeHtml(decision.scaleRule)}</p>
  `;

  $("testMatrixOutput").innerHTML = `
    <table class="reportTable">
      <thead><tr><th>Teste</th><th>Ângulo</th><th>Público</th><th>Verba</th><th>Métrica</th></tr></thead>
      <tbody>${testMatrix().map((row) => `
        <tr>
          <td>${escapeHtml(row.name)}</td>
          <td>${escapeHtml(row.angle)}</td>
          <td>${escapeHtml(row.audience)}</td>
          <td>${escapeHtml(row.budget)}</td>
          <td>${escapeHtml(row.metric)}</td>
        </tr>
      `).join("")}</tbody>
    </table>
    <h3>Versoes sugeridas</h3>
    <ul>${creativeVariants().map((variant) => `<li><strong>${escapeHtml(variant.name)}:</strong> ${escapeHtml(variant.headline)} | CTA: ${escapeHtml(variant.cta)}</li>`).join("")}</ul>
  `;
}

function saveAnalysisSnapshot() {
  if (!state.aiAnalysis) return;
  const decision = commercialDecision();
  const input = creativeInput();
  const item = {
    id: Date.now(),
    date: new Date().toLocaleString("pt-BR"),
    campaign: input.campaign || input.headline || "Criativo sem nome",
    niche: input.niche || "-",
    score: state.aiAnalysis.hydraScore,
    financialScore: decision?.financialScore ?? "-",
    status: decision?.verdictView.label ?? verdictDisplay(state.aiAnalysis.verdict).label,
    risk: state.aiAnalysis.wasteRisk
  };
  state.history = [item, ...state.history.filter((old) => old.campaign !== item.campaign)].slice(0, 20);
  try {
    localStorage.setItem("hydraHistory", JSON.stringify(state.history));
  } catch {
    // Histórico local e opcional.
  }
  renderHistory();
}

function loadHistory() {
  try {
    state.history = JSON.parse(localStorage.getItem("hydraHistory") || "[]");
  } catch {
    state.history = [];
  }
  renderHistory();
}

function renderHistory() {
  if (!state.history.length) {
    $("historyOutput").innerHTML = "Nenhuma análise salva ainda.";
    return;
  }
  $("historyOutput").innerHTML = `
    <table class="reportTable">
      <thead><tr><th>Data</th><th>Campanha</th><th>Nicho</th><th>Score</th><th>Financeiro</th><th>Status</th></tr></thead>
      <tbody>${state.history.map((item) => `<tr><td>${escapeHtml(item.date)}</td><td>${escapeHtml(item.campaign)}</td><td>${escapeHtml(item.niche)}</td><td>${item.score}</td><td>${item.financialScore}</td><td>${escapeHtml(item.status)}</td></tr>`).join("")}</tbody>
    </table>
  `;
}

function compareActualResult() {
  const decision = commercialDecision();
  if (!decision) {
    $("actualOutput").innerHTML = "Análise um criativo antes de comparar resultado real.";
    return;
  }
  const actual = {
    ctr: parseNumber($("actualCtr").value),
    cpc: parseNumber($("actualCpc").value),
    cpa: parseNumber($("actualCpa").value),
    conversions: parseNumber($("actualConversions").value),
    spend: parseNumber($("actualSpend").value),
    negativeComments: parseNumber($("actualNegativeComments").value)
  };
  const ctrDelta = actual.ctr - decision.predictedCtr;
  const cpcDelta = actual.cpc - decision.predictedCpc;
  const cpaDelta = actual.cpa - decision.predictedCpa;
  const quality = clampScore(
    50 +
      ctrDelta * 10 -
      cpcDelta * 8 -
      cpaDelta * 0.5 +
      Math.min(actual.conversions, 20) * 1.5 -
      actual.negativeComments * 2
  );
  state.actualComparison = { actual, quality, ctrDelta, cpcDelta, cpaDelta };
  $("actualOutput").innerHTML = `
    <div class="aiScoreGrid">
      <div><span>Aderência real</span><strong>${quality}</strong></div>
      <div><span>CTR delta</span><strong>${ctrDelta.toFixed(2)}%</strong></div>
      <div><span>CPC delta</span><strong>R$ ${cpcDelta.toFixed(2)}</strong></div>
      <div><span>CPA delta</span><strong>R$ ${cpaDelta.toFixed(0)}</strong></div>
    </div>
    <p>${quality >= 70 ? "Resultado real acima do previsto: pode virar benchmark positivo no CSV." : quality >= 45 ? "Resultado misto: manter como dado de calibração e revisar ângulo vencedor." : "Resultado abaixo do previsto: registrar como campanha ruim e revisar promessa/oferta antes de novo teste."}</p>
  `;
  $("reportOutput").innerHTML = generateReportHtml();
}

function renderAiAnalysis(analysis) {
  const verdict = verdictDisplay(analysis.verdict);
  $("aiOutput").innerHTML = `
    <h3>Diagnóstico Hydra</h3>
    <div class="aiScoreGrid">
      <div><span>Hydra Score</span><strong>${analysis.hydraScore}</strong></div>
      <div><span>Atenção</span><strong>${analysis.attention}</strong></div>
      <div><span>Clareza</span><strong>${analysis.clarity}</strong></div>
      <div><span>Oferta</span><strong>${analysis.offer}</strong></div>
      <div><span>CTA</span><strong>${analysis.cta}</strong></div>
      <div><span>Confiança</span><strong>${analysis.trust}</strong></div>
      <div><span>Atrito</span><strong>${analysis.friction}</strong></div>
      <div><span>Aderência</span><strong>${analysis.audienceFit}</strong></div>
      <div><span>Risco verba</span><strong>${analysis.wasteRisk}</strong></div>
      <div class="${verdict.boxClass}"><span>Status</span><strong class="${verdict.textClass}">${verdict.label}</strong></div>
    </div>
    <p>${escapeHtml(analysis.diagnosis)}</p>
    ${analysis.source === "heuristic" && analysis.fallbackReason ? `<p><strong>Motivo do fallback:</strong> ${escapeHtml(analysis.fallbackReason)}</p>` : ""}
    <p><strong>Gargalo principal:</strong> ${escapeHtml(analysis.mainBottleneck || "-")}</p>
    <p><strong>Verba sugerida:</strong> ${escapeHtml(analysis.suggestedBudget || "-")}</p>
    ${analysis.calibration ? `<p><strong>Calibração:</strong> ${escapeHtml(analysis.calibration.message)} Confiança: ${escapeHtml(analysis.calibration.confidence)}.</p>` : ""}
    <h3>${analysis.mainBottleneck === "entrada invalida" ? "Motivos da reprova" : "Melhorias sugeridas"}</h3>
    <ul>${analysis.improvements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    <h3>Plano de ação</h3>
    <ul>${analysis.actionPlan.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    <h3>Versão sugerida</h3>
    <p><strong>Headline:</strong> ${escapeHtml(analysis.improvedHeadline)}</p>
    <p><strong>Texto:</strong> ${escapeHtml(analysis.improvedBody)}</p>
    <p><strong>CTA:</strong> ${escapeHtml(analysis.improvedCta)}</p>
  `;
}

function reactionFor(agent, article) {
  const affordabilityFit = 1 - Math.abs(agent.income - article.offerStrength * 0.72);
  const lifestyleFit = 1 - Math.abs(agent.customsAxis - article.audienceFit);
  const clarityTrust = agent.mediaTrust * article.messageClarity;
  const purchaseCuriosity = agent.politicalInterest * 0.1 + agent.education * 0.05;
  const adResistance = agent.adFatigue * 0.22 + (1 - agent.mediaTrust) * 0.08;
  const irritation = clamp(
    article.friction * 0.42 +
      (1 - article.messageClarity) * 0.24 +
      (1 - article.audienceFit) * 0.2 +
      (1 - affordabilityFit) * 0.14 +
      adResistance -
      clarityTrust * 0.12
  );
  const approval = clamp(
    article.offerStrength * 0.16 +
      article.messageClarity * 0.18 +
      article.audienceFit * 0.18 +
      affordabilityFit * 0.13 +
      lifestyleFit * 0.08 +
      purchaseCuriosity -
      article.friction * 0.18 -
      agent.adFatigue * 0.14
  );

  if (approval - irritation > 0.26) return "positive";
  if (irritation - approval > 0.1) return "negative";
  return "neutral";
}

function transmissionProbability(source, target, article, graph) {
  const tieStrength = 0.01 + Math.min(graph[source.id].length, graph[target.id].length) / 1800;
  const sourceBoost = source.influence * 0.1;
  const interest = target.politicalInterest * 0.08 + article.audienceFit * 0.07;
  const creativePull = article.offerStrength * 0.045 + article.messageClarity * 0.04;
  const emotion = source.reaction === "negative" ? article.friction * 0.055 : creativePull;
  const trust = target.mediaTrust * article.messageClarity * 0.04;
  const resistance = target.adFatigue * 0.11 + article.friction * 0.05;
  const reactionMultiplier = source.reaction === "positive" ? 1 : source.reaction === "negative" ? 0.72 : 0.48;
  const raw = (tieStrength + sourceBoost + interest + emotion + trust - resistance) * reactionMultiplier;
  return clamp(raw, 0.002, 0.28);
}

function selectSeeds(agents, count) {
  return [...agents]
    .sort((a, b) => b.influence + b.politicalInterest * 0.25 - (a.influence + a.politicalInterest * 0.25))
    .slice(0, count)
    .map((agent) => agent.id);
}

function simulateOnce(agents, graph, article, seedCount) {
  const reactions = new Map();

  agents.forEach((agent) => {
    agent.reaction = "none";
  });

  const active = new Set(selectSeeds(agents, seedCount));
  let frontier = [...active];
  const counts = { positive: 0, negative: 0, neutral: 0 };

  frontier.forEach((id) => {
    agents[id].reaction = reactionFor(agents[id], article);
    reactions.set(id, agents[id].reaction);
  });

  while (frontier.length > 0) {
    const next = [];
    frontier.forEach((sourceId) => {
      const source = agents[sourceId];
      graph[sourceId].forEach((targetId) => {
        if (active.has(targetId)) return;
        const target = agents[targetId];
        if (Math.random() < transmissionProbability(source, target, article, graph)) {
          active.add(targetId);
          target.reaction = reactionFor(target, article);
          reactions.set(targetId, target.reaction);
          next.push(targetId);
        }
      });
    });
    frontier = next;
  }

  active.forEach((id) => {
    counts[agents[id].reaction] += 1;
  });

  const exposedSponsors = agents.filter((agent) => active.has(agent.id) && agent.sponsorSensitivity > 0.72).length;
  const negativeRate = counts.negative / Math.max(active.size, 1);
  const neutralRate = counts.neutral / Math.max(active.size, 1);
  const reachRate = active.size / agents.length;
  const crisis = negativeRate > 0.34 || (neutralRate > 0.52 && reachRate < 0.28);
  const financialRisk = clamp(
    negativeRate * 0.38 +
      neutralRate * 0.24 +
      (1 - reachRate) * 0.18 +
      article.friction * 0.14 +
      (1 - article.messageClarity) * 0.1 +
      exposedSponsors / agents.length * 0.35
  );

  return {
    reached: active.size,
    counts,
    negativeRate,
    crisis,
    financialRisk,
    active,
    reactions
  };
}

function setRunning(isRunning) {
  state.running = isRunning;
  $("runButton").disabled = isRunning;
  $("rerollButton").disabled = isRunning;
  $("runButton").textContent = isRunning ? "Rodando" : "Rodar";
}

function updateProgress(done, total) {
  const progress = total > 0 ? done / total : 0;
  $("runProgress").style.width = `${Math.round(progress * 100)}%`;
  $("runProgressLabel").textContent = pct(progress);
  $("runStatus").textContent = done >= total
    ? "Simulação conclu?da"
    : `Executando ${done.toLocaleString("pt-BR")} de ${total.toLocaleString("pt-BR")} rodadas`;
}

function nextFrame() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateLiveStats(newCount = 0, failedCount = 0) {
  $("liveStep").textContent = state.liveStep.toLocaleString("pt-BR");
  $("liveActive").textContent = state.visualActive.size.toLocaleString("pt-BR");
  $("liveNew").textContent = newCount.toLocaleString("pt-BR");
  $("liveFailed").textContent = failedCount.toLocaleString("pt-BR");
}

async function playLiveCascade(article, seedCount) {
  state.visualActive = new Set(selectSeeds(state.agents, seedCount));
  state.visualAttempts = [];
  state.liveStep = 0;
  state.liveFailed = 0;

  let frontier = [...state.visualActive];
  frontier.forEach((id) => {
    state.agents[id].reaction = reactionFor(state.agents[id], article);
  });

  updateLiveStats(frontier.length, 0);
  drawNetwork();
  await sleep(420);

  while (frontier.length > 0 && state.liveStep < 28) {
    const next = [];
    const attempts = [];
    let failed = 0;

    frontier.forEach((sourceId) => {
      const source = state.agents[sourceId];
      state.graph[sourceId].forEach((targetId) => {
        if (state.visualActive.has(targetId)) return;
        const target = state.agents[targetId];
        const success = Math.random() < transmissionProbability(source, target, article, state.graph);
        attempts.push({ from: sourceId, to: targetId, success });
        if (success) {
          state.visualActive.add(targetId);
          target.reaction = reactionFor(target, article);
          next.push(targetId);
        } else {
          failed += 1;
        }
      });
    });

    state.liveStep += 1;
    state.liveFailed += failed;
    state.visualAttempts = attempts.slice(0, 420);
    frontier = next;
    updateLiveStats(next.length, failed);
    drawNetwork();
    await sleep(Math.max(90, 430 - state.agents.length * 0.22));
  }

  state.visualAttempts = [];
  drawNetwork();
}

async function runMonteCarlo() {
  if (state.running) return;

  const input = creativeInput();
  if (!state.aiAnalysis && !input.headline && !input.body && !input.offer && !input.cta) {
    $("runStatus").textContent = "Preencha o criativo ou clique em Analisar com IA antes de rodar.";
    $("reportOutput").innerHTML = "Preencha o criativo, clique em Analisar com IA e depois rode a simulação.";
    return;
  }

  setRunning(true);

  const size = Number($("populationSize").value);
  const m = Number($("baEdges").value);
  const runs = Number($("runs").value);
  const seedCount = Number($("seedCount").value);
  const article = articleFromControls();

  updateProgress(0, runs);

  state.agents = generateAgents(size);
  state.graph = generateBarabasiAlbert(size, m);
  assignInfluence(state.agents, state.graph);
  state.positions = layoutGraph(state.graph);
  state.lastRun = null;
  state.visualActive = new Set();
  state.visualAttempts = [];
  state.liveStep = 0;
  state.liveFailed = 0;

  $("networkSummary").textContent = `${state.agents.length} pessoas, ${edgeCount(state.graph).toLocaleString("pt-BR")} conexões`;
  renderProfiles();
  updateLiveStats(0, 0);
  drawNetwork();
  $("runStatus").textContent = "Animando cascata observavel";
  await playLiveCascade(article, seedCount);
  $("runStatus").textContent = "Consolidando Monte Carlo";
  updateProgress(0, runs);

  const aggregate = {
    reach: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    crisis: 0,
    financialRisk: 0,
    snapshot: null
  };

  const chunkSize = Math.max(10, Math.floor(runs / 40));

  for (let i = 0; i < runs; i += 1) {
    const result = simulateOnce(state.agents, state.graph, article, seedCount);
    aggregate.reach += result.reached;
    aggregate.positive += result.counts.positive;
    aggregate.negative += result.counts.negative;
    aggregate.neutral += result.counts.neutral;
    aggregate.crisis += result.crisis ? 1 : 0;
    aggregate.financialRisk += result.financialRisk;
    if (!aggregate.snapshot || result.reached > aggregate.snapshot.reached) aggregate.snapshot = result;

    if ((i + 1) % chunkSize === 0 || i + 1 === runs) {
      updateProgress(i + 1, runs);
      await nextFrame();
    }
  }

  if (aggregate.snapshot) {
    state.visualActive = aggregate.snapshot.active;
    state.visualAttempts = [];
    state.agents.forEach((agent) => {
      agent.reaction = aggregate.snapshot.reactions.get(agent.id) ?? "none";
    });
  }

  state.lastRun = {
    article,
    runs,
    avgReach: aggregate.reach / runs,
    positive: aggregate.positive / runs,
    negative: aggregate.negative / runs,
    neutral: aggregate.neutral / runs,
    crisisChance: aggregate.crisis / runs,
    financialRisk: aggregate.financialRisk / runs,
    snapshot: aggregate.snapshot
  };

  renderResults();
  renderCommercialPanels();
  saveAnalysisSnapshot();
  setRunning(false);
}

function pct(value) {
  return `${Math.round(value * 100)}%`;
}

function riskLabel(value) {
  if (value >= 0.56) return "revisar";
  if (value >= 0.36) return "testar";
  return "escalar";
}

function verdictDisplay(verdict) {
  if (verdict === "escalar") {
    return {
      label: "APROVADO",
      textClass: "statusApproved",
      boxClass: "statusBoxApproved"
    };
  }

  if (verdict === "testar") {
    return {
      label: "REVISAO",
      textClass: "statusReview",
      boxClass: "statusBoxReview"
    };
  }

  return {
    label: "REPROVADO",
    textClass: "statusRejected",
    boxClass: "statusBoxRejected"
  };
}

function renderResults() {
  const run = state.lastRun;
  const total = Math.max(run.positive + run.negative + run.neutral, 1);
  const financialVerdict = verdictDisplay(riskLabel(run.financialRisk));
  $("avgReach").textContent = Math.round(run.avgReach).toLocaleString("pt-BR");
  $("negativeRate").textContent = pct(run.negative / total);
  $("crisisChance").textContent = pct(run.crisisChance);
  $("financialRisk").textContent = financialVerdict.label;
  $("financialRisk").className = financialVerdict.textClass;
  $("networkSummary").textContent = `${state.agents.length} pessoas, ${edgeCount(state.graph).toLocaleString("pt-BR")} conexões`;

  renderBars([
    ["Engajou", run.positive / total, "var(--good)"],
    ["Rejeitou", run.negative / total, "var(--accent-2)"],
    ["Ignorou", run.neutral / total, "var(--warn)"],
    ["Desperdicio", run.crisisChance, "#5c6470"]
  ]);
  renderProfiles();
  drawNetwork();
  $("reportOutput").innerHTML = generateReportHtml();
}

function renderBars(rows) {
  $("bars").innerHTML = rows
    .map(([label, value, color]) => `
      <div class="barRow">
        <span>${label}</span>
        <div class="barTrack"><div class="barFill" style="width:${value * 100}%;background:${color}"></div></div>
        <strong>${pct(value)}</strong>
      </div>
    `)
    .join("");
}

function ideologyLabel(agent) {
  const fit = agent.income * 0.28 + agent.mediaTrust * 0.26 + agent.politicalInterest * 0.24 + agent.education * 0.22;
  if (fit > 0.64) return ["alto fit", "var(--good)"];
  if (fit < 0.38) return ["baixo fit", "var(--accent-2)"];
  return ["médio fit", "var(--warn)"];
}

function renderProfiles() {
  const topLimit = Math.min(Math.max(20, Math.ceil(state.agents.length * 0.06)), 60);
  const influentialAgents = [...state.agents]
    .sort((a, b) => {
      const scoreA = a.influence + (state.graph[a.id]?.length ?? 0) / Math.max(state.agents.length, 1);
      const scoreB = b.influence + (state.graph[b.id]?.length ?? 0) / Math.max(state.agents.length, 1);
      return scoreB - scoreA;
    })
    .slice(0, topLimit);

  $("profiles").innerHTML = influentialAgents
    .map((agent) => {
      const [label, color] = ideologyLabel(agent);
      return `
        <article class="profile">
          <strong>#${agent.id + 1} ${agent.name}</strong>
          <p>${agent.age} anos, ${agent.job}, ${agent.religion}, região ${agent.region}, ${agent.familySize} filho(s).</p>
          <p>Grau ${state.graph[agent.id]?.length ?? 0}, influ?ncia ${fmt(agent.influence)}. Interesses: ${agent.interests.join(", ")}.</p>
          <span class="tag" style="background:${color}">${label}</span>
        </article>
      `;
    })
    .join("");
}

function edgeCount(graph) {
  return graph.reduce((sum, neighbors) => sum + neighbors.length, 0) / 2;
}

function fmt(value, digits = 2) {
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function getNetworkStats(graph) {
  const degrees = graph.map((neighbors) => neighbors.length);
  const sorted = [...degrees].sort((a, b) => a - b);
  const sum = degrees.reduce((acc, degree) => acc + degree, 0);
  const hubs = [...state.agents]
    .sort((a, b) => graph[b.id].length - graph[a.id].length)
    .slice(0, 5)
    .map((agent) => ({
      name: agent.name,
      degree: graph[agent.id].length,
      influence: agent.influence
    }));

  return {
    nodes: graph.length,
    edges: edgeCount(graph),
    avgDegree: sum / Math.max(graph.length, 1),
    minDegree: sorted[0] ?? 0,
    medianDegree: sorted[Math.floor(sorted.length / 2)] ?? 0,
    maxDegree: sorted[sorted.length - 1] ?? 0,
    hubs
  };
}

function getPopulationStats(agents) {
  const avg = (field) => agents.reduce((sum, agent) => sum + agent[field], 0) / Math.max(agents.length, 1);
  const ideology = agents.reduce((acc, agent) => {
    const [label] = ideologyLabel(agent);
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});
  const regionsCount = agents.reduce((acc, agent) => {
    acc[agent.region] = (acc[agent.region] ?? 0) + 1;
    return acc;
  }, {});
  const religionsCount = agents.reduce((acc, agent) => {
    acc[agent.religion] = (acc[agent.religion] ?? 0) + 1;
    return acc;
  }, {});

  return {
    avgIncome: avg("income"),
    avgEducation: avg("education"),
    avgPoliticalInterest: avg("politicalInterest"),
    avgMédiaTrust: avg("mediaTrust"),
    avgSponsorSensitivity: avg("sponsorSensitivity"),
    ideology,
    regionsCount,
    religionsCount
  };
}

function formatDistribution(distribution, total) {
  return Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => `- ${label}: ${count} (${pct(count / Math.max(total, 1))})`)
    .join("\n");
}

function generateReport() {
  const run = state.lastRun;
  if (!run) return "Rode uma simulação para gerar o relatório.";

  const network = getNetworkStats(state.graph);
  const population = getPopulationStats(state.agents);
  const totalReactions = Math.max(run.positive + run.negative + run.neutral, 1);
  const negativeRate = run.negative / totalReactions;
  const positiveRate = run.positive / totalReactions;
  const neutralRate = run.neutral / totalReactions;
  const reachedShare = run.avgReach / Math.max(state.agents.length, 1);
  const timestamp = new Date().toLocaleString("pt-BR");

  return `# Relatório Tecnico - Hydra | Strategy

Gerado em: ${timestamp}
Materia analisada: ${run.article.title}

## 1. Objetivo da simulação

Avaliar, em ambiente sintético controlado, a propagação de uma mat?ria jornalistica e o risco associado a reacoes negativas, crise publica e exposicao financeira de patrocinadores. O sistema não prevê comportamento real individual; ele estima cenarios possíveis por meio de população artificial, rede complexa e repeticao Monte Carlo.

## 2. Configuração experimental

- Tamanho da população: ${state.agents.length.toLocaleString("pt-BR")} agentes sintéticos
- Modelo de rede: Barabasi-Albert com ligação preferencial
- Conexões totais: ${network.edges.toLocaleString("pt-BR")}
- Grau médio: ${fmt(network.avgDegree)}
- Grau mediano: ${network.medianDegree}
- Grau minimo / maximo: ${network.minDegree} / ${network.maxDegree}
- Rodadas Monte Carlo: ${run.runs.toLocaleString("pt-BR")}
- Sementes iniciais: ${Number($("seedCount").value)}

## 3. Parâmetros editoriais da mat?ria

- Elogio percebido a direita: ${fmt(run.article.rightPraise)}
- Contextualização jornalistica: ${fmt(run.article.contextQuality)}
- Tom provocativo: ${fmt(run.article.provocation)}
- Relevancia local: ${fmt(run.article.localRelevance)}

## 4. Modelo de agentes

Cada agente possui atributos demograficos, sociais e comportamentais gerados probabilisticamente: profissão, renda sintética, escolaridade, religião, região, família, interesses, confiança no jornal, interesse pol?tico e sensibilidade a patrocinadores.

Médias da população:

- Renda sintética media: ${fmt(population.avgIncome)}
- Escolaridade sintética media: ${fmt(population.avgEducation)}
- Interesse politico médio: ${fmt(population.avgPoliticalInterest)}
- Confiança media no jornal: ${fmt(population.avgMédiaTrust)}
- Sensibilidade media a patrocinadores: ${fmt(population.avgSponsorSensitivity)}

Distribuição ideologica aproximada:

${formatDistribution(population.ideology, state.agents.length)}

Distribuição regional sintética:

${formatDistribution(population.regionsCount, state.agents.length)}

Distribuição religiosa sintética:

${formatDistribution(population.religionsCount, state.agents.length)}

## 5. Modelo de propagação

A rede foi criada com Barabasi-Albert, produzindo poucos n?s muito conectados e muitos n?s pouco conectados. A propagação usa uma versão adaptada do Independent Cascade: cada nó ativado tenta influ?nciar seus vizinhos uma vez, com probabilidade dependente de força da conexão, influ?ncia do emissor, interesse pol?tico do receptor, relev?ncia local, confiança no jornal e intensidade emocional.

Tipos de reação:

- Positiva: o agente tende a aceitar ou compartilhar favoravelmente.
- Negativa: o agente tende a criticar, amplificar controv?rsia ou pressionar reputacionalmente.
- Neutra: o agente foi exposto, mas não apresenta alinhamento forte.

## 6. Resultados agregados

- Alcance médio: ${Math.round(run.avgReach).toLocaleString("pt-BR")} agentes (${pct(reachedShare)} da população)
- Reação positiva media: ${pct(positiveRate)}
- Reação negativa media: ${pct(negativeRate)}
- Reação neutra media: ${pct(neutralRate)}
- Chance estimada de crise: ${pct(run.crisisChance)}
- ?ndice de risco financeiro: ${fmt(run.financialRisk)}
- Classificação de risco financeiro: ${riskLabel(run.financialRisk).toUpperCase()}

## 7. Hubs mais relevantes

${network.hubs.map((hub, index) => `${index + 1}. ${hub.name}: grau ${hub.degree}, influ?ncia ${fmt(hub.influence)}`).join("\n")}

## 8. Interpretação tecnica

O risco aumenta quando a mat?ria combina alta provocação, baixa contextualização e grande alcance em hubs politicamente ativos. A contextualização funciona como amortecedor: aumenta a probabilidade de leitura tolerante, especialmente entre agentes com confiança pr?via no jornal. O tom provocativo aumenta alcance emocional, mas tamb?m eleva a taxa de reação negativa e a chance de crise.

## 9. Limitacoes

- Os agentes sao sintéticos e não representam pessoas reais.
- Região, religião e renda influ?nciam probabilidades, mas não determinam ideologia.
- O modelo ainda não esta calibrado com dados históricos reais do jornal.
- O risco financeiro e um indice heuristico, não uma estimativa monetaria validada.

## 10. Recomendacoes para proxima iteração

- Calibrar probabilidades com dados reais de audiência, redes sociais e histórico de publicações.
- Separar patrocinadores em perfis de sensibilidade por setor econômico.
- Adicionar comparação A/B entre versoes de titulo e enquadramento editorial.
- Exportar s?ries por rodada para análise estatística externa.
- Incluir intervalos de confiança e percentis de pior caso.`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function rowsFromDistribution(distribution, total) {
  return Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => `
      <tr>
        <td>${escapeHtml(label)}</td>
        <td>${count.toLocaleString("pt-BR")}</td>
        <td>${pct(count / Math.max(total, 1))}</td>
      </tr>
    `)
    .join("");
}

function personaAppendixHtml() {
  return state.agents
    .map((agent) => {
      const [label] = ideologyLabel(agent);
      return `
        <article>
          <strong>#${agent.id + 1} ${escapeHtml(agent.name)}</strong>
          <span>${agent.age} anos | ${escapeHtml(agent.job)} | ${escapeHtml(agent.religion)} | ${escapeHtml(agent.region)} | ${agent.familySize} filho(s)</span>
          <span>${escapeHtml(agent.interests.join(", "))} | ${label}</span>
        </article>
      `;
    })
    .join("");
}

function generateReportHtml() {
  const run = state.lastRun;
  if (!run) return "Rode uma simulação para gerar o relatório.";

  const network = getNetworkStats(state.graph);
  const population = getPopulationStats(state.agents);
  const totalReactions = Math.max(run.positive + run.negative + run.neutral, 1);
  const negativeRate = run.negative / totalReactions;
  const positiveRate = run.positive / totalReactions;
  const neutralRate = run.neutral / totalReactions;
  const reachedShare = run.avgReach / Math.max(state.agents.length, 1);
  const timestamp = new Date().toLocaleString("pt-BR");

  return `
    <section class="reportCover">
      <div>
        <h1>Relatório Técnico Hydra | Strategy</h1>
        <p><strong>Matéria analisada:</strong> ${escapeHtml(run.article.title)}</p>
        <p><strong>Gerado em:</strong> ${timestamp}</p>
      </div>
      <p>Simulação baseada em agentes sintéticos, rede Barabási-Albert, Cascata Independente adaptada e repetição Monte Carlo.</p>
    </section>

    <section class="reportKpis">
      <div><span>Alcance médio</span><strong>${Math.round(run.avgReach).toLocaleString("pt-BR")}</strong></div>
      <div><span>Reação negativa</span><strong>${pct(negativeRate)}</strong></div>
      <div><span>Chance de crise</span><strong>${pct(run.crisisChance)}</strong></div>
      <div><span>Risco financeiro</span><strong>${riskLabel(run.financialRisk).toUpperCase()}</strong></div>
    </section>

    <h2>1. Objetivo da Simulação</h2>
    <p>Avaliar, em ambiente sintético controlado, a propagação de uma matéria jornalística e o risco associado a reações negativas, crise pública e exposição financeira de patrocinadores. O sistema não prevê comportamento real individual; ele estima cenários possíveis por meio de população artificial, rede complexa e amostragem probabilística.</p>

    <h2>2. Configuração Experimental</h2>
    <table class="reportTable">
      <tbody>
        <tr><th>População</th><td>${state.agents.length.toLocaleString("pt-BR")} agentes sintéticos</td></tr>
        <tr><th>Modelo de rede</th><td>Barabási-Albert com ligação preferencial</td></tr>
        <tr><th>Conexões totais</th><td>${network.edges.toLocaleString("pt-BR")}</td></tr>
        <tr><th>Grau médio</th><td>${fmt(network.avgDegree)}</td></tr>
        <tr><th>Grau mediano</th><td>${network.medianDegree}</td></tr>
        <tr><th>Grau mínimo / máximo</th><td>${network.minDegree} / ${network.maxDegree}</td></tr>
        <tr><th>Rodadas Monte Carlo</th><td>${run.runs.toLocaleString("pt-BR")}</td></tr>
        <tr><th>Sementes iniciais</th><td>${Number($("seedCount").value)}</td></tr>
      </tbody>
    </table>

    <h2>3. Parâmetros Editoriais</h2>
    <table class="reportTable">
      <tbody>
        <tr><th>Elogio percebido à direita</th><td>${fmt(run.article.rightPraise)}</td></tr>
        <tr><th>Contextualização jornalística</th><td>${fmt(run.article.contextQuality)}</td></tr>
        <tr><th>Tom provocativo</th><td>${fmt(run.article.provocation)}</td></tr>
        <tr><th>Relevância local</th><td>${fmt(run.article.localRelevance)}</td></tr>
      </tbody>
    </table>

    <h2>4. Modelo de Agentes</h2>
    <p>Cada agente possui atributos demográficos, sociais e comportamentais gerados probabilisticamente: profissão, renda sintética, escolaridade, religião, região, família, interesses, confiança no jornal, interesse político e sensibilidade a patrocinadores.</p>
    <table class="reportTable">
      <tbody>
        <tr><th>Renda sintética média</th><td>${fmt(population.avgIncome)}</td></tr>
        <tr><th>Escolaridade sintética média</th><td>${fmt(population.avgEducation)}</td></tr>
        <tr><th>Interesse político médio</th><td>${fmt(population.avgPoliticalInterest)}</td></tr>
        <tr><th>Confiança média no jornal</th><td>${fmt(population.avgMédiaTrust)}</td></tr>
        <tr><th>Sensibilidade média a patrocinadores</th><td>${fmt(population.avgSponsorSensitivity)}</td></tr>
      </tbody>
    </table>

    <h2>5. Distribuições Sintéticas</h2>
    <table class="reportTable">
      <thead><tr><th>Ideologia aproximada</th><th>Agentes</th><th>Participação</th></tr></thead>
      <tbody>${rowsFromDistribution(population.ideology, state.agents.length)}</tbody>
    </table>
    <table class="reportTable">
      <thead><tr><th>Região</th><th>Agentes</th><th>Participação</th></tr></thead>
      <tbody>${rowsFromDistribution(population.regionsCount, state.agents.length)}</tbody>
    </table>
    <table class="reportTable">
      <thead><tr><th>Religião</th><th>Agentes</th><th>Participação</th></tr></thead>
      <tbody>${rowsFromDistribution(population.religionsCount, state.agents.length)}</tbody>
    </table>

    <h2>6. Modelo de Propagação</h2>
    <p>A propagação usa uma versão adaptada do Independent Cascade: cada nó ativado tenta influ?nciar seus vizinhos uma vez, com probabilidade dependente de força da conexão, influência do emissor, interesse político do receptor, relevância local, confiança no jornal e intensidade emocional. A animação do painel representa uma cascata observável; os resultados agregados vêm das rodadas Monte Carlo.</p>

    <h2>7. Resultados Agregados</h2>
    <table class="reportTable">
      <tbody>
        <tr><th>Alcance médio</th><td>${Math.round(run.avgReach).toLocaleString("pt-BR")} agentes (${pct(reachedShare)} da população)</td></tr>
        <tr><th>Reação positiva média</th><td>${pct(positiveRate)}</td></tr>
        <tr><th>Reação negativa média</th><td>${pct(negativeRate)}</td></tr>
        <tr><th>Reação neutra média</th><td>${pct(neutralRate)}</td></tr>
        <tr><th>Chance estimada de crise</th><td>${pct(run.crisisChance)}</td></tr>
        <tr><th>Índice de risco financeiro</th><td>${fmt(run.financialRisk)}</td></tr>
      </tbody>
    </table>

    <h2>8. Hubs Mais Relevantes</h2>
    <ol>
      ${network.hubs.map((hub) => `<li>${escapeHtml(hub.name)}: grau ${hub.degree}, influência ${fmt(hub.influence)}</li>`).join("")}
    </ol>

    <h2>9. Interpretação Técnica</h2>
    <p>O risco aumenta quando a matéria combina alta provocação, baixa contextualização e grande alcance em hubs politicamente ativos. A contextualização funciona como amortecedor: aumenta a probabilidade de leitura tolerante, especialmente entre agentes com confiança prévia no jornal. O tom provocativo aumenta alcance emocional, mas também eleva a taxa de reação negativa e a chance de crise.</p>

    <h2>10. Limitações e Próximas Iterações</h2>
    <ul>
      <li>Os agentes são sintéticos e não representam pessoas reais.</li>
      <li>Região, religião e renda influ?nciam probabilidades, mas não determinam ideologia.</li>
      <li>O modelo ainda precisa ser calibrado com dados históricos reais do jornal.</li>
      <li>O risco financeiro é um índice heurístico, não uma estimativa monetária validada.</li>
      <li>Próxima etapa recomendada: comparação A/B entre títulos, intervalo de confiança e segmentação de patrocinadores.</li>
    </ul>
  `;
}

function generateReportHtml() {
  const run = state.lastRun;
  if (!run && state.aiAnalysis) return generateAiOnlyReportHtml();
  if (!run) return "Preencha o criativo, clique em Analisar com IA e depois rode a simulação.";

  const network = getNetworkStats(state.graph);
  const population = getPopulationStats(state.agents);
  const totalReactions = Math.max(run.positive + run.negative + run.neutral, 1);
  const engagementRate = run.positive / totalReactions;
  const rejectionRate = run.negative / totalReactions;
  const ignoredRate = run.neutral / totalReactions;
  const reachedShare = run.avgReach / Math.max(state.agents.length, 1);
  const verdict = riskLabel(run.financialRisk);
  const verdictView = verdictDisplay(verdict);
  const decision = commercialDecision(state.aiAnalysis, run);
  const timestamp = new Date().toLocaleString("pt-BR");
  const mediaGuidance = verdict === "escalar"
    ? "Criativo aprovado para teste com verba maior. Recomenda-se iniciar com campanha controlada e acompanhar CTR, CPC e comentários negativos nas primeiras horas."
    : verdict === "testar"
      ? "Criativo deve entrar apenas em teste pequeno. Recomenda-se limitar verba inicial, rodar variações A/B e pausar se o custo por engajamento subir rapidamente."
      : "Criativo não recomendado para tráfego pago agora. Recomenda-se revisar oferta, promessa, clareza ou nivel de atrito antes de investir verba.";

  return `
    <section class="reportCover">
      <div>
        <h1>Hydra | Strategy Report</h1>
        <p><strong>Criativo analisado:</strong> ${escapeHtml(run.article.title)}</p>
        <p><strong>Gerado em:</strong> ${timestamp}</p>
      </div>
      <p>Simulação de propagação org?nica e resposta social antes de investir em tráfego pago. O objetivo ? reduzir desperd?cio de verba, antecipar rejeição e classificar o criativo como aprovado, em revis?o ou reprovado.</p>
    </section>

    <section class="reportKpis">
      <div><span>Alcance orgânico médio</span><strong>${Math.round(run.avgReach).toLocaleString("pt-BR")}</strong></div>
      <div><span>Engajamento positivo</span><strong>${pct(engagementRate)}</strong></div>
      <div><span>Rejeição</span><strong>${pct(rejectionRate)}</strong></div>
      <div class="${verdictView.boxClass}"><span>Status</span><strong class="${verdictView.textClass}">${verdictView.label}</strong></div>
    </section>

    ${state.aiAnalysis ? `
      <h2>Diagnóstico de IA</h2>
      <section class="reportSignal">
        <div><strong>Hydra Score</strong><span>${state.aiAnalysis.hydraScore}/100</span></div>
        <div><strong>Atenção</strong><span>${state.aiAnalysis.attention}/100</span></div>
        <div><strong>Clareza</strong><span>${state.aiAnalysis.clarity}/100</span></div>
        <div><strong>Oferta</strong><span>${state.aiAnalysis.offer}/100</span></div>
        <div><strong>Confiança</strong><span>${state.aiAnalysis.trust}/100</span></div>
        <div><strong>Risco verba</strong><span>${state.aiAnalysis.wasteRisk}/100</span></div>
      </section>
      <p>${escapeHtml(state.aiAnalysis.diagnosis)}</p>
      <p><strong>Gargalo principal:</strong> ${escapeHtml(state.aiAnalysis.mainBottleneck || "-")}</p>
      <p><strong>Verba sugerida:</strong> ${escapeHtml(state.aiAnalysis.suggestedBudget || "-")}</p>
      ${state.aiAnalysis.calibration ? `<p><strong>Calibração:</strong> ${escapeHtml(state.aiAnalysis.calibration.message)} Confiança: ${escapeHtml(state.aiAnalysis.calibration.confidence)}.</p>` : ""}
      <ul>${state.aiAnalysis.improvements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <h2>Plano de Ação</h2>
      <ul>${state.aiAnalysis.actionPlan.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    ` : ""}

    <section class="reportSignal">
      <div><strong>Sinal de oferta</strong><span>${run.article.offerStrength >= 0.7 ? "Oferta forte: boa chance de capturar aten??o." : "Oferta ainda fraca: promessa pode precisar de refor?o."}</span></div>
      <div><strong>Sinal de clareza</strong><span>${run.article.messageClarity >= 0.7 ? "Mensagem clara: menor fric??o cognitiva." : "Mensagem nebulosa: risco de indiferen?a e baixo CTR."}</span></div>
      <div><strong>Sinal de atrito</strong><span>${run.article.friction >= 0.55 ? "Atrito alto: pode gerar rejeição e comentários negativos." : "Atrito controlado: menor chance de queimar verba."}</span></div>
    </section>

    <h2>1. Objetivo do Pre-Teste</h2>
    <p>Este relatório avalia um criativo de rede social antes da compra de mídia. A simulação estima como uma população sintética pode reagir ao anúncio, quais grupos tendem a engajar ou ignorar a mensagem e qual o risco de gastar verba em uma peça com baixa aderência.</p>

    <h2>2. Configuração Experimental</h2>
    <table class="reportTable">
      <tbody>
        <tr><th>População sintética</th><td>${state.agents.length.toLocaleString("pt-BR")} agentes</td></tr>
        <tr><th>Modelo de rede</th><td>Barabasi-Albert com hubs de influ?ncia</td></tr>
        <tr><th>Conexões totais</th><td>${network.edges.toLocaleString("pt-BR")}</td></tr>
        <tr><th>Grau médio</th><td>${fmt(network.avgDegree)}</td></tr>
        <tr><th>Rodadas Monte Carlo</th><td>${run.runs.toLocaleString("pt-BR")}</td></tr>
        <tr><th>Sementes iniciais</th><td>${Number($("seedCount").value)}</td></tr>
      </tbody>
    </table>

    <h2>3. Parâmetros do Criativo</h2>
    <table class="reportTable">
      <tbody>
        <tr><th>Força da oferta</th><td>${fmt(run.article.offerStrength)}</td></tr>
        <tr><th>Clareza da mensagem</th><td>${fmt(run.article.messageClarity)}</td></tr>
        <tr><th>Atrito / pol?mica</th><td>${fmt(run.article.friction)}</td></tr>
        <tr><th>Aderência ao público</th><td>${fmt(run.article.audienceFit)}</td></tr>
      </tbody>
    </table>

    <h2>4. Leitura da População</h2>
    <p>Os agentes sintéticos combinam renda, escolaridade, religião, região, interesses, confiança media em comunicação e propensao social a compartilhar. Para uso de marketing, os perfis sao agrupados por fit comercial, não por ideologia.</p>
    <table class="reportTable">
      <tbody>
        <tr><th>Renda sintética media</th><td>${fmt(population.avgIncome)}</td></tr>
        <tr><th>Escolaridade sintética media</th><td>${fmt(population.avgEducation)}</td></tr>
        <tr><th>Propensao social media</th><td>${fmt(population.avgPoliticalInterest)}</td></tr>
        <tr><th>Confiança media em comunicação</th><td>${fmt(population.avgMédiaTrust)}</td></tr>
        <tr><th>Sensibilidade a risco de marca</th><td>${fmt(population.avgSponsorSensitivity)}</td></tr>
      </tbody>
    </table>

    <h2>5. Distribuições Sinteticas</h2>
    <table class="reportTable">
      <thead><tr><th>Fit comercial</th><th>Agentes</th><th>Participação</th></tr></thead>
      <tbody>${rowsFromDistribution(population.ideology, state.agents.length)}</tbody>
    </table>
    <table class="reportTable">
      <thead><tr><th>Região</th><th>Agentes</th><th>Participação</th></tr></thead>
      <tbody>${rowsFromDistribution(population.regionsCount, state.agents.length)}</tbody>
    </table>

    <h2>6. Modelo de Propagação</h2>
    <p>A animação mostra uma cascata observavel: cada nó engajado tenta transmitir o criativo para seus vizinhos. Conexões verdes representam engajamentos que propagaram; conexões vermelhas representam impressões frias ou tentativas sem resposta. Os resultados finais sao consolidados por Monte Carlo.</p>

    <h2>7. Resultados Agregados</h2>
    <table class="reportTable">
      <tbody>
        <tr><th>Alcance orgânico médio</th><td>${Math.round(run.avgReach).toLocaleString("pt-BR")} agentes (${pct(reachedShare)} da população)</td></tr>
        <tr><th>Engajamento positivo médio</th><td>${pct(engagementRate)}</td></tr>
        <tr><th>Rejeição media</th><td>${pct(rejectionRate)}</td></tr>
        <tr><th>Indiferen?a media</th><td>${pct(ignoredRate)}</td></tr>
        <tr><th>Risco de desperd?cio</th><td>${pct(run.crisisChance)}</td></tr>
        <tr><th>?ndice de desperd?cio de verba</th><td>${fmt(run.financialRisk)}</td></tr>
      </tbody>
    </table>

    <h2>8. Hubs Mais Relevantes</h2>
    <ol>
      ${network.hubs.map((hub) => `<li>${escapeHtml(hub.name)}: grau ${hub.degree}, influ?ncia ${fmt(hub.influence)}</li>`).join("")}
    </ol>

    ${decision ? `
      <h2>9. Plano de Teste Pago</h2>
      <section class="reportSignal">
        <div><strong>Score financeiro</strong><span>${decision.financialScore}/100</span></div>
        <div><strong>Verba inicial</strong><span>${decision.budgetMax ? `${money(decision.budgetMin)} a ${money(decision.budgetMax)}` : "Não investir"}</span></div>
        <div><strong>Duração</strong><span>${decision.days || 0} dia(s)</span></div>
        <div><strong>CTR previsto</strong><span>${decision.predictedCtr.toFixed(2)}%</span></div>
        <div><strong>CPC previsto</strong><span>R$ ${decision.predictedCpc.toFixed(2)}</span></div>
        <div><strong>CPA risco</strong><span>R$ ${decision.predictedCpa.toFixed(0)}</span></div>
      </section>
      <p><strong>Regra de corte:</strong> ${escapeHtml(decision.killRule)}</p>
      <p><strong>Regra de escala:</strong> ${escapeHtml(decision.scaleRule)}</p>

      <h2>10. Matriz de Testes A/B</h2>
      <table class="reportTable">
        <thead><tr><th>Teste</th><th>Ângulo</th><th>Público</th><th>Verba</th><th>Métrica principal</th></tr></thead>
        <tbody>${testMatrix().map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.angle)}</td><td>${escapeHtml(row.audience)}</td><td>${escapeHtml(row.budget)}</td><td>${escapeHtml(row.metric)}</td></tr>`).join("")}</tbody>
      </table>

      <h2>11. Versoes Criativas Sugeridas</h2>
      <table class="reportTable">
        <thead><tr><th>Versão</th><th>Headline</th><th>CTA</th></tr></thead>
        <tbody>${creativeVariants().map((variant) => `<tr><td>${escapeHtml(variant.name)}</td><td>${escapeHtml(variant.headline)}</td><td>${escapeHtml(variant.cta)}</td></tr>`).join("")}</tbody>
      </table>
    ` : ""}

    ${state.actualComparison ? `
      <h2>12. Comparação Previsto vs Real</h2>
      <section class="reportSignal">
        <div><strong>Aderência real</strong><span>${state.actualComparison.quality}/100</span></div>
        <div><strong>CTR delta</strong><span>${state.actualComparison.ctrDelta.toFixed(2)}%</span></div>
        <div><strong>CPC delta</strong><span>R$ ${state.actualComparison.cpcDelta.toFixed(2)}</span></div>
      </section>
    ` : ""}

    <h2>13. Banco Sintético de Personas</h2>
    <p>Total listado: ${state.agents.length.toLocaleString("pt-BR")} personas. Cada item representa um no da rede usado na simulação.</p>
    <section class="personaAppendix">
      ${personaAppendixHtml()}
    </section>

    <h2>14. Recomendação de Midia</h2>
    <section class="reportVerdict ${verdictView.boxClass}">
      <p><strong>Status:</strong> <span class="${verdictView.textClass}">${verdictView.label}</span>.</p>
      <p>${mediaGuidance}</p>
    </section>

    <h2>15. Interpretação Tecnica</h2>
    <p>Um criativo tende a performar melhor quando combina oferta forte, mensagem clara e aderência ao público. Atrito alto pode aumentar propagação por curiosidade ou controv?rsia, mas tamb?m eleva rejeição e risco de comentários negativos. Se a indiferen?a for alta, o problema prov?vel não e rejeição, mas falta de apelo ou promessa pouco compreens?vel.</p>

    <h2>16. Aviso Legal e Uso Correto</h2>
    <p>O Hydra ? um sistema de pré-teste e apoio a decisão. Ele não garante resultado de mídia paga, não substitui validação real e deve ser usado para reduzir desperd?cio, organizar hip?teses e definir critérios antes da compra de tráfego.</p>

    <h2>17. Próximas Iterações Recomendadas</h2>
    <ul>
      <li>Criar 3 variações A/B: uma com oferta mais direta, uma com headline mais clara e uma com menor atrito.</li>
      <li>Calibrar o modelo com CTR, CPC, CPM, comentários negativos e taxa de conversão de campanhas reais.</li>
      <li>Adicionar persona-alvo por nicho: e-commerce, cl?nica, infoproduto, restaurante, serviço local ou B2B.</li>
      <li>Incluir estimativa de verba inicial recomendada para teste controlado.</li>
    </ul>
  `;
}

function generateAiOnlyReportHtml() {
  const analysis = state.aiAnalysis;
  const input = creativeInput();
  const timestamp = new Date().toLocaleString("pt-BR");
  const verdictView = verdictDisplay(analysis.verdict);
  const decision = commercialDecision(analysis);
  const mediaGuidance = analysis.verdict === "escalar"
    ? "O criativo tem bons sinais antes da compra de mídia. Ainda assim, a recomendação ? validar com verba controlada e acompanhar os primeiros indicadores reais."
    : analysis.verdict === "testar"
      ? "O criativo tem potencial, mas não deve receber verba alta ainda. Rode teste pequeno ou revise os pontos fracos antes de escalar."
      : "O criativo ainda não deveria receber verba. Ajuste promessa, oferta, clareza ou CTA antes de abrir campanha.";

  return `
    <section class="reportCover">
      <div>
        <h1>Hydra | Strategy Report</h1>
        <p><strong>Criativo analisado:</strong> ${escapeHtml(input.campaign || "Sem nome de campanha")}</p>
        <p><strong>Gerado em:</strong> ${timestamp}</p>
      </div>
      <p>Diagnóstico pre-tráfego gerado antes da simulação. Esta etapa avalia se a estrategia criativa merece entrar em teste pago ou se precisa ser revisada primeiro.</p>
    </section>

    <section class="reportKpis">
      <div><span>Hydra Score</span><strong>${analysis.hydraScore}</strong></div>
      <div><span>Atenção</span><strong>${analysis.attention}</strong></div>
      <div><span>Clareza</span><strong>${analysis.clarity}</strong></div>
      <div class="${verdictView.boxClass}"><span>Status</span><strong class="${verdictView.textClass}">${verdictView.label}</strong></div>
    </section>

    <section class="reportSignal">
      <div><strong>Oferta</strong><span>${analysis.offer}/100</span></div>
      <div><strong>CTA</strong><span>${analysis.cta}/100</span></div>
      <div><strong>Confiança</strong><span>${analysis.trust}/100</span></div>
      <div><strong>Atrito</strong><span>${analysis.friction}/100</span></div>
      <div><strong>Aderência</strong><span>${analysis.audienceFit}/100</span></div>
      <div><strong>Risco de verba</strong><span>${analysis.wasteRisk}/100</span></div>
    </section>

    <h2>1. Briefing Comercial</h2>
    <table class="reportTable">
      <tbody>
        <tr><th>Nicho</th><td>${escapeHtml(input.niche || "-")}</td></tr>
        <tr><th>Canal</th><td>${escapeHtml(input.channel || "-")}</td></tr>
        <tr><th>Objetivo</th><td>${escapeHtml(input.objective || "-")}</td></tr>
        <tr><th>Produto/serviço</th><td>${escapeHtml(input.product || "-")}</td></tr>
        <tr><th>Ticket médio</th><td>${escapeHtml(input.ticket || "-")}</td></tr>
        <tr><th>Público-alvo</th><td>${escapeHtml(input.audience || "-")}</td></tr>
        <tr><th>Estágio do público</th><td>${escapeHtml(input.stage || "-")}</td></tr>
        <tr><th>Verba planejada</th><td>${escapeHtml(input.plannedBudget || "-")}</td></tr>
        <tr><th>Objeção principal</th><td>${escapeHtml(input.objection || "-")}</td></tr>
        <tr><th>Prova social</th><td>${escapeHtml(input.proof || "-")}</td></tr>
        <tr><th>Garantia</th><td>${escapeHtml(input.guarantee || "-")}</td></tr>
      </tbody>
    </table>

    <h2>2. Criativo Enviado</h2>
    <table class="reportTable">
      <tbody>
        <tr><th>Headline</th><td>${escapeHtml(input.headline || "-")}</td></tr>
        <tr><th>Texto</th><td>${escapeHtml(input.body || "-")}</td></tr>
        <tr><th>Oferta</th><td>${escapeHtml(input.offer || "-")}</td></tr>
        <tr><th>CTA</th><td>${escapeHtml(input.cta || "-")}</td></tr>
      </tbody>
    </table>

    <h2>3. Diagnóstico</h2>
    <p>${escapeHtml(analysis.diagnosis)}</p>
    ${analysis.source === "heuristic" && analysis.fallbackReason ? `<p><strong>Motivo do fallback:</strong> ${escapeHtml(analysis.fallbackReason)}</p>` : ""}
    <p><strong>Gargalo principal:</strong> ${escapeHtml(analysis.mainBottleneck || "-")}</p>
    <p><strong>Verba sugerida:</strong> ${escapeHtml(analysis.suggestedBudget || "-")}</p>
    ${analysis.calibration ? `<p><strong>Calibração:</strong> ${escapeHtml(analysis.calibration.message)} Confiança: ${escapeHtml(analysis.calibration.confidence)}.</p>` : ""}

    <h2>4. Melhorias Sugeridas</h2>
    <ul>${analysis.improvements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

    <h2>5. Plano de Ação</h2>
    <ul>${analysis.actionPlan.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

    <h2>6. Versão Sugerida</h2>
    <table class="reportTable">
      <tbody>
        <tr><th>Headline sugerida</th><td>${escapeHtml(analysis.improvedHeadline || "-")}</td></tr>
        <tr><th>Texto sugerido</th><td>${escapeHtml(analysis.improvedBody || "-")}</td></tr>
        <tr><th>CTA sugerido</th><td>${escapeHtml(analysis.improvedCta || "-")}</td></tr>
      </tbody>
    </table>

    <h2>7. Recomendação Antes da Verba</h2>
    <section class="reportVerdict ${verdictView.boxClass}">
      <p><strong>Status:</strong> <span class="${verdictView.textClass}">${verdictView.label}</span>.</p>
      <p>${mediaGuidance}</p>
    </section>

    ${decision ? `
      <h2>8. Plano de Teste Pago</h2>
      <section class="reportSignal">
        <div><strong>Score financeiro</strong><span>${decision.financialScore}/100</span></div>
        <div><strong>Verba inicial</strong><span>${decision.budgetMax ? `${money(decision.budgetMin)} a ${money(decision.budgetMax)}` : "Não investir"}</span></div>
        <div><strong>Duração</strong><span>${decision.days || 0} dia(s)</span></div>
        <div><strong>CTR previsto</strong><span>${decision.predictedCtr.toFixed(2)}%</span></div>
        <div><strong>CPC previsto</strong><span>R$ ${decision.predictedCpc.toFixed(2)}</span></div>
        <div><strong>CPA risco</strong><span>R$ ${decision.predictedCpa.toFixed(0)}</span></div>
      </section>
      <p><strong>Regra de corte:</strong> ${escapeHtml(decision.killRule)}</p>
      <p><strong>Regra de escala:</strong> ${escapeHtml(decision.scaleRule)}</p>

      <h2>9. Matriz de Testes A/B</h2>
      <table class="reportTable">
        <thead><tr><th>Teste</th><th>Ângulo</th><th>Público</th><th>Verba</th><th>Métrica principal</th></tr></thead>
        <tbody>${testMatrix(input, analysis).map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.angle)}</td><td>${escapeHtml(row.audience)}</td><td>${escapeHtml(row.budget)}</td><td>${escapeHtml(row.metric)}</td></tr>`).join("")}</tbody>
      </table>

      <h2>10. Versoes Criativas Sugeridas</h2>
      <table class="reportTable">
        <thead><tr><th>Versão</th><th>Headline</th><th>CTA</th></tr></thead>
        <tbody>${creativeVariants(input, analysis).map((variant) => `<tr><td>${escapeHtml(variant.name)}</td><td>${escapeHtml(variant.headline)}</td><td>${escapeHtml(variant.cta)}</td></tr>`).join("")}</tbody>
      </table>
    ` : ""}

    ${state.actualComparison ? `
      <h2>11. Comparação Previsto vs Real</h2>
      <section class="reportSignal">
        <div><strong>Aderência real</strong><span>${state.actualComparison.quality}/100</span></div>
        <div><strong>CTR delta</strong><span>${state.actualComparison.ctrDelta.toFixed(2)}%</span></div>
        <div><strong>CPC delta</strong><span>R$ ${state.actualComparison.cpcDelta.toFixed(2)}</span></div>
      </section>
    ` : ""}

    <h2>12. Aviso Legal e Uso Correto</h2>
    <p>O Hydra ? um sistema de pré-teste e apoio a decisão. Ele não garante resultado de mídia paga, não substitui validação real e deve ser usado para reduzir desperd?cio, organizar hip?teses e definir critérios antes da compra de tráfego.</p>

    <h2>13. Proxima Ação</h2>
    <p>Depois de ajustar o criativo, clique em Rodar para simular a propagação sintética e complementar este relatório com alcance orgânico, rejeição, indiferen?a e risco de desperd?cio.</p>
  `;
}

function drawNetwork() {
  const canvas = $("networkCanvas");
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  const active = state.visualActive.size > 0 ? state.visualActive : (state.lastRun?.snapshot?.active ?? new Set());
  const limit = Math.min(state.agents.length, 650);

  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "rgba(57, 198, 255, 0.13)";
  for (let i = 0; i < limit; i += 1) {
    const a = state.positions[i];
    state.graph[i].forEach((j) => {
      if (j >= limit || j < i) return;
      const b = state.positions[j];
      ctx.beginPath();
      ctx.moveTo(a.x * width, a.y * height);
      ctx.lineTo(b.x * width, b.y * height);
      ctx.stroke();
    });
  }

  state.visualAttempts.forEach((attempt) => {
    if (attempt.from >= limit || attempt.to >= limit) return;
    const a = state.positions[attempt.from];
    const b = state.positions[attempt.to];
    ctx.beginPath();
    ctx.moveTo(a.x * width, a.y * height);
    ctx.lineTo(b.x * width, b.y * height);
    ctx.lineWidth = attempt.success ? 1.6 : 0.9;
    ctx.strokeStyle = attempt.success ? "rgba(40, 122, 67, 0.78)" : "rgba(184, 63, 75, 0.34)";
    ctx.stroke();
  });

  for (let i = 0; i < limit; i += 1) {
    const agent = state.agents[i];
    const pos = state.positions[i];
    const activeNode = active.has(i);
    const radius = 2.2 + agent.influence * 5.5;
    ctx.beginPath();
    ctx.arc(pos.x * width, pos.y * height, radius, 0, Math.PI * 2);
    if (!activeNode) {
      ctx.fillStyle = "rgba(143, 182, 176, 0.35)";
    } else if (agent.reaction === "negative") {
      ctx.fillStyle = "#b83f4b";
    } else if (agent.reaction === "positive") {
      ctx.fillStyle = "#24ff72";
    } else {
      ctx.fillStyle = "#ffd166";
    }
    ctx.shadowBlur = activeNode ? 12 : 0;
    ctx.shadowColor = ctx.fillStyle;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

$("runButton").addEventListener("click", runMonteCarlo);
$("rerollButton").addEventListener("click", runMonteCarlo);
$("analyzeCreativeButton").addEventListener("click", analyzeCreativeWithHF);
$("refreshCalibrationButton").addEventListener("click", fetchCalibrationRows);
$("compareActualButton").addEventListener("click", compareActualResult);
$("copyReportButton").addEventListener("click", async () => {
  const report = $("reportOutput").innerText || generateReport();
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(report);
  }
});
$("downloadReportButton").addEventListener("click", () => {
  window.print();
});
window.addEventListener("resize", drawNetwork);
updateProgress(0, Number($("runs").value));
updateLiveStats(0, 0);
loadHistory();
fetchCalibrationRows();
drawNetwork();
