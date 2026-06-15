const names = [
  "Ana Carolina Souza", "Marcos Vinicius Lima", "Beatriz Andrade", "Joao Pedro Martins",
  "Camila Nogueira", "Rafael Teixeira", "Juliana Batista", "Felipe Azevedo",
  "Patricia Gomes", "Lucas Ferreira", "Fernanda Rocha", "Bruno Cavalcante"
];

const jobs = [
  ["enfermeira", 0.48], ["medico", 0.86], ["caixa de supermercado", 0.24],
  ["professora", 0.42], ["advogado", 0.74], ["empreendedora", 0.66],
  ["motorista de aplicativo", 0.32], ["servidora publica", 0.52],
  ["engenheiro", 0.78], ["comerciante", 0.58]
];

const regions = [
  ["Nordeste", -0.18], ["Sul", 0.18], ["Sudeste", 0.04],
  ["Norte", -0.08], ["Centro-Oeste", 0.12]
];

const religions = [
  ["evangelica", 0.32], ["catolica", 0.08], ["sem religiao", -0.22],
  ["espirita", -0.02], ["outra", 0.0]
];

const interests = [
  "familia", "futebol", "basquete", "animes", "livros", "carros esportivos",
  "golf", "igreja", "viagens", "politica local", "saude", "educacao"
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
  liveFailed: 0
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
  const economicAxis = clamp(0.5 + regionBias + (income - 0.5) * 0.38 + rand(-0.34, 0.34));
  const customsAxis = clamp(0.5 + religionBias + (age - 38) / 150 + rand(-0.28, 0.28));
  const sponsorSensitivity = clamp(income * 0.35 + politicalInterest * 0.3 + rand(0, 0.35));
  const familySize = Math.max(0, Math.round(rand(-0.2, 4.8)));
  const personInterests = [...new Set([pick(interests), pick(interests), pick(interests)])];

  return {
    id,
    name: pick(names),
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
    headline: $("creativeHeadline").value.trim(),
    body: $("creativeBody").value.trim(),
    offer: $("creativeOffer").value.trim(),
    cta: $("creativeCta").value.trim()
  };
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function heuristicCreativeAnalysis(input) {
  const all = `${input.headline} ${input.body} ${input.offer} ${input.cta}`.toLowerCase();
  const hasNumber = /\d/.test(all);
  const hasUrgency = /(hoje|agora|limitad|ultim|gratis|gratuita|bonus|desconto)/i.test(all);
  const hasPain = /(dor|problema|dificuldade|perder|cansad|sem tempo|caro|risco)/i.test(all);
  const hasAction = /(clique|chame|agende|compre|solicite|fale|baixe|acesse)/i.test(input.cta);
  const textLength = all.length;
  const clarity = clampScore(45 + (input.headline.length > 18 ? 14 : 0) + (input.cta.length > 8 ? 16 : 0) - (textLength > 720 ? 18 : 0));
  const offer = clampScore(38 + (hasNumber ? 16 : 0) + (hasUrgency ? 18 : 0) + (input.offer.length > 18 ? 14 : 0));
  const attention = clampScore(42 + (hasPain ? 18 : 0) + (hasUrgency ? 12 : 0) + (input.headline.length > 45 ? 8 : 0));
  const cta = clampScore(35 + (hasAction ? 30 : 0) + (input.cta.length > 12 ? 14 : 0));
  const friction = clampScore(100 - ((clarity + offer + cta) / 3));
  const audienceFit = clampScore((attention + clarity + offer) / 3);

  return {
    attention,
    clarity,
    offer,
    cta,
    friction,
    audienceFit,
    verdict: (clarity + offer + cta + attention) / 4 >= 72 ? "escalar" : (clarity + offer + cta + attention) / 4 >= 52 ? "testar" : "revisar",
    diagnosis: "Analise local: usada quando a IA nao respondeu. O criativo foi pontuado por clareza, promessa, urgencia, dor e CTA.",
    improvements: [
      "Deixe a promessa mais especifica e mensuravel.",
      "Inclua um beneficio concreto no inicio da headline.",
      "Troque CTA generico por uma acao simples e direta.",
      "Reduza palavras vagas e explique o ganho principal em uma frase."
    ],
    improvedHeadline: input.headline || "Resolva seu problema com uma oferta clara hoje",
    improvedBody: input.body || "Apresente a dor, mostre o beneficio principal, reduza risco e convide para uma acao simples.",
    improvedCta: hasAction ? input.cta : "Clique e solicite sua avaliacao"
  };
}

function parseAiContent(content) {
  const cleaned = content.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

async function analyzeCreativeWithHF() {
  const model = $("hfModel").value.trim() || "openai/gpt-oss-120b:cerebras";
  const input = creativeInput();

  $("aiStatus").textContent = "Analisando criativo...";
  $("analyzeCreativeButton").disabled = true;

  try {
    let analysis;
    const response = await fetch("/api/analyze-creative", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model, creative: input })
    });

    if (!response.ok) throw new Error(`API ${response.status}`);
    analysis = await response.json();
    $("aiStatus").textContent = analysis.source === "heuristic"
      ? "API sem HF_TOKEN: analise local do servidor gerada."
      : "Analise de IA concluida pelo backend.";

    applyCreativeAnalysis(analysis);
  } catch (error) {
    const fallback = heuristicCreativeAnalysis(input);
    $("aiStatus").textContent = `Backend indisponivel (${error.message}). Usei analise local no navegador.`;
    applyCreativeAnalysis(fallback);
  } finally {
    $("analyzeCreativeButton").disabled = false;
  }
}

function applyCreativeAnalysis(raw) {
  const analysis = {
    attention: clampScore(raw.attention),
    clarity: clampScore(raw.clarity),
    offer: clampScore(raw.offer),
    cta: clampScore(raw.cta),
    friction: clampScore(raw.friction),
    audienceFit: clampScore(raw.audienceFit),
    verdict: ["escalar", "testar", "revisar"].includes(raw.verdict) ? raw.verdict : "testar",
    diagnosis: raw.diagnosis || "Diagnostico indisponivel.",
    improvements: Array.isArray(raw.improvements) ? raw.improvements.slice(0, 6) : [],
    improvedHeadline: raw.improvedHeadline || "",
    improvedBody: raw.improvedBody || "",
    improvedCta: raw.improvedCta || ""
  };

  $("rightPraise").value = analysis.offer / 100;
  $("contextQuality").value = analysis.clarity / 100;
  $("provocation").value = analysis.friction / 100;
  $("localRelevance").value = analysis.audienceFit / 100;
  renderAiAnalysis(analysis);
}

function renderAiAnalysis(analysis) {
  $("aiOutput").innerHTML = `
    <h3>Diagnostico Hydra</h3>
    <div class="aiScoreGrid">
      <div><span>Atencao</span><strong>${analysis.attention}</strong></div>
      <div><span>Clareza</span><strong>${analysis.clarity}</strong></div>
      <div><span>Oferta</span><strong>${analysis.offer}</strong></div>
      <div><span>CTA</span><strong>${analysis.cta}</strong></div>
      <div><span>Atrito</span><strong>${analysis.friction}</strong></div>
      <div><span>Aderencia</span><strong>${analysis.audienceFit}</strong></div>
      <div><span>Veredito</span><strong>${analysis.verdict.toUpperCase()}</strong></div>
    </div>
    <p>${escapeHtml(analysis.diagnosis)}</p>
    <h3>Melhorias sugeridas</h3>
    <ul>${analysis.improvements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    <h3>Versao sugerida</h3>
    <p><strong>Headline:</strong> ${escapeHtml(analysis.improvedHeadline)}</p>
    <p><strong>Texto:</strong> ${escapeHtml(analysis.improvedBody)}</p>
    <p><strong>CTA:</strong> ${escapeHtml(analysis.improvedCta)}</p>
  `;
}

function reactionFor(agent, article) {
  const affordabilityFit = 1 - Math.abs(agent.income - article.offerStrength * 0.72);
  const lifestyleFit = 1 - Math.abs(agent.customsAxis - article.audienceFit);
  const clarityTrust = agent.mediaTrust * article.messageClarity;
  const purchaseCuriosity = agent.politicalInterest * 0.18 + agent.education * 0.08;
  const irritation = clamp(
    article.friction * 0.38 +
      (1 - article.messageClarity) * 0.22 +
      (1 - article.audienceFit) * 0.18 +
      (1 - affordabilityFit) * 0.12 -
      clarityTrust * 0.18
  );
  const approval = clamp(
    article.offerStrength * 0.24 +
      article.messageClarity * 0.22 +
      article.audienceFit * 0.22 +
      affordabilityFit * 0.16 +
      lifestyleFit * 0.1 +
      purchaseCuriosity -
      article.friction * 0.14
  );

  if (approval - irritation > 0.18) return "positive";
  if (irritation - approval > 0.12) return "negative";
  return "neutral";
}

function transmissionProbability(source, target, article, graph) {
  const tieStrength = 0.025 + Math.min(graph[source.id].length, graph[target.id].length) / 900;
  const sourceBoost = 0.05 + source.influence * 0.22;
  const interest = 0.05 + target.politicalInterest * 0.16 + article.audienceFit * 0.14;
  const emotion = source.reaction === "negative" ? article.friction * 0.11 : article.offerStrength * 0.08;
  const trust = target.mediaTrust * article.messageClarity * 0.08;
  return clamp(tieStrength + sourceBoost + interest + emotion + trust, 0.01, 0.62);
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
    ? "Simulacao concluida"
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

  $("networkSummary").textContent = `${state.agents.length} pessoas, ${edgeCount(state.graph).toLocaleString("pt-BR")} conexoes`;
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

function renderResults() {
  const run = state.lastRun;
  const total = Math.max(run.positive + run.negative + run.neutral, 1);
  $("avgReach").textContent = Math.round(run.avgReach).toLocaleString("pt-BR");
  $("negativeRate").textContent = pct(run.negative / total);
  $("crisisChance").textContent = pct(run.crisisChance);
  $("financialRisk").textContent = riskLabel(run.financialRisk);
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
  return ["medio fit", "var(--warn)"];
}

function renderProfiles() {
  const sample = [...state.agents]
    .sort((a, b) => b.influence - a.influence)
    .slice(0, 8);

  $("profiles").innerHTML = sample
    .map((agent) => {
      const [label, color] = ideologyLabel(agent);
      return `
        <article class="profile">
          <strong>${agent.name}</strong>
          <p>${agent.age} anos, ${agent.job}, ${agent.religion}, região ${agent.region}, ${agent.familySize} filho(s).</p>
          <p>Interesses: ${agent.interests.join(", ")}.</p>
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
    avgMediaTrust: avg("mediaTrust"),
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
  if (!run) return "Rode uma simulacao para gerar o relatorio.";

  const network = getNetworkStats(state.graph);
  const population = getPopulationStats(state.agents);
  const totalReactions = Math.max(run.positive + run.negative + run.neutral, 1);
  const negativeRate = run.negative / totalReactions;
  const positiveRate = run.positive / totalReactions;
  const neutralRate = run.neutral / totalReactions;
  const reachedShare = run.avgReach / Math.max(state.agents.length, 1);
  const timestamp = new Date().toLocaleString("pt-BR");

  return `# Relatorio Tecnico - Hydra | Strategy

Gerado em: ${timestamp}
Materia analisada: ${run.article.title}

## 1. Objetivo da simulacao

Avaliar, em ambiente sintetico controlado, a propagacao de uma materia jornalistica e o risco associado a reacoes negativas, crise publica e exposicao financeira de patrocinadores. O sistema nao preve comportamento real individual; ele estima cenarios possiveis por meio de populacao artificial, rede complexa e repeticao Monte Carlo.

## 2. Configuracao experimental

- Tamanho da populacao: ${state.agents.length.toLocaleString("pt-BR")} agentes sinteticos
- Modelo de rede: Barabasi-Albert com ligacao preferencial
- Conexoes totais: ${network.edges.toLocaleString("pt-BR")}
- Grau medio: ${fmt(network.avgDegree)}
- Grau mediano: ${network.medianDegree}
- Grau minimo / maximo: ${network.minDegree} / ${network.maxDegree}
- Rodadas Monte Carlo: ${run.runs.toLocaleString("pt-BR")}
- Sementes iniciais: ${Number($("seedCount").value)}

## 3. Parametros editoriais da materia

- Elogio percebido a direita: ${fmt(run.article.rightPraise)}
- Contextualizacao jornalistica: ${fmt(run.article.contextQuality)}
- Tom provocativo: ${fmt(run.article.provocation)}
- Relevancia local: ${fmt(run.article.localRelevance)}

## 4. Modelo de agentes

Cada agente possui atributos demograficos, sociais e comportamentais gerados probabilisticamente: profissao, renda sintetica, escolaridade, religiao, regiao, familia, interesses, confianca no jornal, interesse politico e sensibilidade a patrocinadores.

Medias da populacao:

- Renda sintetica media: ${fmt(population.avgIncome)}
- Escolaridade sintetica media: ${fmt(population.avgEducation)}
- Interesse politico medio: ${fmt(population.avgPoliticalInterest)}
- Confianca media no jornal: ${fmt(population.avgMediaTrust)}
- Sensibilidade media a patrocinadores: ${fmt(population.avgSponsorSensitivity)}

Distribuicao ideologica aproximada:

${formatDistribution(population.ideology, state.agents.length)}

Distribuicao regional sintetica:

${formatDistribution(population.regionsCount, state.agents.length)}

Distribuicao religiosa sintetica:

${formatDistribution(population.religionsCount, state.agents.length)}

## 5. Modelo de propagacao

A rede foi criada com Barabasi-Albert, produzindo poucos nos muito conectados e muitos nos pouco conectados. A propagacao usa uma versao adaptada do Independent Cascade: cada no ativado tenta influenciar seus vizinhos uma vez, com probabilidade dependente de forca da conexao, influencia do emissor, interesse politico do receptor, relevancia local, confianca no jornal e intensidade emocional.

Tipos de reacao:

- Positiva: o agente tende a aceitar ou compartilhar favoravelmente.
- Negativa: o agente tende a criticar, amplificar controversia ou pressionar reputacionalmente.
- Neutra: o agente foi exposto, mas nao apresenta alinhamento forte.

## 6. Resultados agregados

- Alcance medio: ${Math.round(run.avgReach).toLocaleString("pt-BR")} agentes (${pct(reachedShare)} da populacao)
- Reacao positiva media: ${pct(positiveRate)}
- Reacao negativa media: ${pct(negativeRate)}
- Reacao neutra media: ${pct(neutralRate)}
- Chance estimada de crise: ${pct(run.crisisChance)}
- Indice de risco financeiro: ${fmt(run.financialRisk)}
- Classificacao de risco financeiro: ${riskLabel(run.financialRisk).toUpperCase()}

## 7. Hubs mais relevantes

${network.hubs.map((hub, index) => `${index + 1}. ${hub.name}: grau ${hub.degree}, influencia ${fmt(hub.influence)}`).join("\n")}

## 8. Interpretacao tecnica

O risco aumenta quando a materia combina alta provocacao, baixa contextualizacao e grande alcance em hubs politicamente ativos. A contextualizacao funciona como amortecedor: aumenta a probabilidade de leitura tolerante, especialmente entre agentes com confianca previa no jornal. O tom provocativo aumenta alcance emocional, mas tambem eleva a taxa de reacao negativa e a chance de crise.

## 9. Limitacoes

- Os agentes sao sinteticos e nao representam pessoas reais.
- Regiao, religiao e renda influenciam probabilidades, mas nao determinam ideologia.
- O modelo ainda nao esta calibrado com dados historicos reais do jornal.
- O risco financeiro e um indice heuristico, nao uma estimativa monetaria validada.

## 10. Recomendacoes para proxima iteracao

- Calibrar probabilidades com dados reais de audiencia, redes sociais e historico de publicacoes.
- Separar patrocinadores em perfis de sensibilidade por setor economico.
- Adicionar comparacao A/B entre versoes de titulo e enquadramento editorial.
- Exportar series por rodada para analise estatistica externa.
- Incluir intervalos de confianca e percentis de pior caso.`;
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
        <tr><th>Confiança média no jornal</th><td>${fmt(population.avgMediaTrust)}</td></tr>
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
    <p>A propagação usa uma versão adaptada do Independent Cascade: cada nó ativado tenta influenciar seus vizinhos uma vez, com probabilidade dependente de força da conexão, influência do emissor, interesse político do receptor, relevância local, confiança no jornal e intensidade emocional. A animação do painel representa uma cascata observável; os resultados agregados vêm das rodadas Monte Carlo.</p>

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
      <li>Região, religião e renda influenciam probabilidades, mas não determinam ideologia.</li>
      <li>O modelo ainda precisa ser calibrado com dados históricos reais do jornal.</li>
      <li>O risco financeiro é um índice heurístico, não uma estimativa monetária validada.</li>
      <li>Próxima etapa recomendada: comparação A/B entre títulos, intervalo de confiança e segmentação de patrocinadores.</li>
    </ul>
  `;
}

function generateReportHtml() {
  const run = state.lastRun;
  if (!run) return "Rode uma simulacao para gerar o relatorio.";

  const network = getNetworkStats(state.graph);
  const population = getPopulationStats(state.agents);
  const totalReactions = Math.max(run.positive + run.negative + run.neutral, 1);
  const engagementRate = run.positive / totalReactions;
  const rejectionRate = run.negative / totalReactions;
  const ignoredRate = run.neutral / totalReactions;
  const reachedShare = run.avgReach / Math.max(state.agents.length, 1);
  const verdict = riskLabel(run.financialRisk);
  const timestamp = new Date().toLocaleString("pt-BR");
  const mediaGuidance = verdict === "escalar"
    ? "Criativo aprovado para teste com verba maior. Recomenda-se iniciar com campanha controlada e acompanhar CTR, CPC e comentarios negativos nas primeiras horas."
    : verdict === "testar"
      ? "Criativo deve entrar apenas em teste pequeno. Recomenda-se limitar verba inicial, rodar variacoes A/B e pausar se o custo por engajamento subir rapidamente."
      : "Criativo nao recomendado para trafego pago agora. Recomenda-se revisar oferta, promessa, clareza ou nivel de atrito antes de investir verba.";

  return `
    <section class="reportCover">
      <div>
        <h1>Hydra | Strategy Report</h1>
        <p><strong>Criativo analisado:</strong> ${escapeHtml(run.article.title)}</p>
        <p><strong>Gerado em:</strong> ${timestamp}</p>
      </div>
      <p>Simulacao de propagacao organica e resposta social antes de investir em trafego pago. O objetivo e reduzir desperdicio de verba, antecipar rejeicao e estimar se o criativo merece escala, teste pequeno ou revisao.</p>
    </section>

    <section class="reportKpis">
      <div><span>Alcance organico medio</span><strong>${Math.round(run.avgReach).toLocaleString("pt-BR")}</strong></div>
      <div><span>Engajamento positivo</span><strong>${pct(engagementRate)}</strong></div>
      <div><span>Rejeicao</span><strong>${pct(rejectionRate)}</strong></div>
      <div><span>Veredito</span><strong>${verdict.toUpperCase()}</strong></div>
    </section>

    <section class="reportSignal">
      <div><strong>Sinal de oferta</strong><span>${run.article.offerStrength >= 0.7 ? "Oferta forte: boa chance de capturar atencao." : "Oferta ainda fraca: promessa pode precisar de reforco."}</span></div>
      <div><strong>Sinal de clareza</strong><span>${run.article.messageClarity >= 0.7 ? "Mensagem clara: menor friccao cognitiva." : "Mensagem nebulosa: risco de indiferenca e baixo CTR."}</span></div>
      <div><strong>Sinal de atrito</strong><span>${run.article.friction >= 0.55 ? "Atrito alto: pode gerar rejeicao e comentarios negativos." : "Atrito controlado: menor chance de queimar verba."}</span></div>
    </section>

    <h2>1. Objetivo do Pre-Teste</h2>
    <p>Este relatorio avalia um criativo de rede social antes da compra de midia. A simulacao estima como uma populacao sintetica pode reagir ao anuncio, quais grupos tendem a engajar ou ignorar a mensagem e qual o risco de gastar verba em uma peca com baixa aderencia.</p>

    <h2>2. Configuracao Experimental</h2>
    <table class="reportTable">
      <tbody>
        <tr><th>Populacao sintetica</th><td>${state.agents.length.toLocaleString("pt-BR")} agentes</td></tr>
        <tr><th>Modelo de rede</th><td>Barabasi-Albert com hubs de influencia</td></tr>
        <tr><th>Conexoes totais</th><td>${network.edges.toLocaleString("pt-BR")}</td></tr>
        <tr><th>Grau medio</th><td>${fmt(network.avgDegree)}</td></tr>
        <tr><th>Rodadas Monte Carlo</th><td>${run.runs.toLocaleString("pt-BR")}</td></tr>
        <tr><th>Sementes iniciais</th><td>${Number($("seedCount").value)}</td></tr>
      </tbody>
    </table>

    <h2>3. Parametros do Criativo</h2>
    <table class="reportTable">
      <tbody>
        <tr><th>Forca da oferta</th><td>${fmt(run.article.offerStrength)}</td></tr>
        <tr><th>Clareza da mensagem</th><td>${fmt(run.article.messageClarity)}</td></tr>
        <tr><th>Atrito / polemica</th><td>${fmt(run.article.friction)}</td></tr>
        <tr><th>Aderencia ao publico</th><td>${fmt(run.article.audienceFit)}</td></tr>
      </tbody>
    </table>

    <h2>4. Leitura da Populacao</h2>
    <p>Os agentes sinteticos combinam renda, escolaridade, religiao, regiao, interesses, confianca media em comunicacao e propensao social a compartilhar. Para uso de marketing, os perfis sao agrupados por fit comercial, nao por ideologia.</p>
    <table class="reportTable">
      <tbody>
        <tr><th>Renda sintetica media</th><td>${fmt(population.avgIncome)}</td></tr>
        <tr><th>Escolaridade sintetica media</th><td>${fmt(population.avgEducation)}</td></tr>
        <tr><th>Propensao social media</th><td>${fmt(population.avgPoliticalInterest)}</td></tr>
        <tr><th>Confianca media em comunicacao</th><td>${fmt(population.avgMediaTrust)}</td></tr>
        <tr><th>Sensibilidade a risco de marca</th><td>${fmt(population.avgSponsorSensitivity)}</td></tr>
      </tbody>
    </table>

    <h2>5. Distribuicoes Sinteticas</h2>
    <table class="reportTable">
      <thead><tr><th>Fit comercial</th><th>Agentes</th><th>Participacao</th></tr></thead>
      <tbody>${rowsFromDistribution(population.ideology, state.agents.length)}</tbody>
    </table>
    <table class="reportTable">
      <thead><tr><th>Regiao</th><th>Agentes</th><th>Participacao</th></tr></thead>
      <tbody>${rowsFromDistribution(population.regionsCount, state.agents.length)}</tbody>
    </table>

    <h2>6. Modelo de Propagacao</h2>
    <p>A animacao mostra uma cascata observavel: cada no engajado tenta transmitir o criativo para seus vizinhos. Conexoes verdes representam engajamentos que propagaram; conexoes vermelhas representam impressoes frias ou tentativas sem resposta. Os resultados finais sao consolidados por Monte Carlo.</p>

    <h2>7. Resultados Agregados</h2>
    <table class="reportTable">
      <tbody>
        <tr><th>Alcance organico medio</th><td>${Math.round(run.avgReach).toLocaleString("pt-BR")} agentes (${pct(reachedShare)} da populacao)</td></tr>
        <tr><th>Engajamento positivo medio</th><td>${pct(engagementRate)}</td></tr>
        <tr><th>Rejeicao media</th><td>${pct(rejectionRate)}</td></tr>
        <tr><th>Indiferenca media</th><td>${pct(ignoredRate)}</td></tr>
        <tr><th>Risco de desperdicio</th><td>${pct(run.crisisChance)}</td></tr>
        <tr><th>Indice de desperdicio de verba</th><td>${fmt(run.financialRisk)}</td></tr>
      </tbody>
    </table>

    <h2>8. Hubs Mais Relevantes</h2>
    <ol>
      ${network.hubs.map((hub) => `<li>${escapeHtml(hub.name)}: grau ${hub.degree}, influencia ${fmt(hub.influence)}</li>`).join("")}
    </ol>

    <h2>9. Recomendacao de Midia</h2>
    <section class="reportVerdict">
      <p><strong>Veredito:</strong> ${verdict.toUpperCase()}.</p>
      <p>${mediaGuidance}</p>
    </section>

    <h2>10. Interpretacao Tecnica</h2>
    <p>Um criativo tende a performar melhor quando combina oferta forte, mensagem clara e aderencia ao publico. Atrito alto pode aumentar propagacao por curiosidade ou controversia, mas tambem eleva rejeicao e risco de comentarios negativos. Se a indiferenca for alta, o problema provavel nao e rejeicao, mas falta de apelo ou promessa pouco compreensivel.</p>

    <h2>11. Proximas Iteracoes Recomendadas</h2>
    <ul>
      <li>Criar 3 variacoes A/B: uma com oferta mais direta, uma com headline mais clara e uma com menor atrito.</li>
      <li>Calibrar o modelo com CTR, CPC, CPM, comentarios negativos e taxa de conversao de campanhas reais.</li>
      <li>Adicionar persona-alvo por nicho: e-commerce, clinica, infoproduto, restaurante, servico local ou B2B.</li>
      <li>Incluir estimativa de verba inicial recomendada para teste controlado.</li>
    </ul>
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
runMonteCarlo();
