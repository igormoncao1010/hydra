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
    ["produto/servico", input.product],
    ["publico-alvo", input.audience],
    ["headline", input.headline],
    ["texto do anuncio", input.body],
    ["oferta", input.offer],
    ["CTA", input.cta]
  ];
  const details = fields.map(([label, value]) => ({ label, score: meaningfulness(value) }));
  const valid = details.filter((item) => item.score >= 35).map((item) => item.label);
  const invalid = details.filter((item) => item.score < 35).map((item) => item.label);
  const average = Math.round(details.reduce((sum, item) => sum + item.score, 0) / details.length);
  return { average, valid, invalid, isNoise: average < 32 || valid.length < 3 };
}

function heuristicCreativeAnalysis(input, fallbackReason = "HF_TOKEN ausente ou IA indisponivel.") {
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
      suggestedBudget: "Nao investir. O briefing nao contem informacao suficiente para validar trafego pago.",
      mainBottleneck: "entrada invalida",
      fallbackReason,
      diagnosis: `Entrada sem sentido comercial suficiente. Campos sem informacao util: ${quality.invalid.join(", ")}. O Hydra precisa de produto, publico, promessa, oferta e CTA reais para anteceder trafego pago.`,
      improvements: [
        "Informe qual produto ou servico sera anunciado.",
        "Descreva o publico-alvo com contexto real.",
        "Escreva uma headline compreensivel.",
        "Explique a oferta e o CTA sem texto aleatorio."
      ],
      actionPlan: [
        "Substituir textos aleatorios por briefing real.",
        "Preencher produto, publico, oferta e CTA.",
        "Rodar Analisar com IA novamente.",
        "So depois usar a simulacao de propagacao."
      ],
      improvedHeadline: "Preencha uma headline real antes de gerar versao sugerida.",
      improvedBody: "O texto enviado nao tem conteudo suficiente para reescrita confiavel.",
      improvedCta: "Informe uma acao real, como chamar no WhatsApp ou solicitar avaliacao."
    };
  }

  const all = `${input.headline || ""} ${input.body || ""} ${input.offer || ""} ${input.cta || ""} ${input.product || ""} ${input.audience || ""} ${input.objection || ""} ${input.proof || ""} ${input.guarantee || ""}`.toLowerCase();
  const hasNumber = /\d/.test(all);
  const hasUrgency = /(hoje|agora|limitad|ultim|gratis|gratuita|bonus|desconto)/i.test(all);
  const hasPain = /(dor|problema|dificuldade|perder|cansad|sem tempo|caro|risco)/i.test(all);
  const hasProof = Boolean(input.proof) || /(depoimento|case|clientes|antes|depois|resultado|anos|garantia)/i.test(all);
  const hasAudience = Boolean(input.audience) || Boolean(input.niche);
  const hasRiskReducer = Boolean(input.guarantee) || /(garantia|gratis|sem compromisso|avaliacao|teste)/i.test(all);
  const hasAction = /(clique|chame|agende|compre|solicite|fale|baixe|acesse)/i.test(input.cta || "");
  const textLength = all.length;
  const clarity = clampScore(40 + ((input.headline || "").length > 18 ? 12 : 0) + ((input.cta || "").length > 8 ? 12 : 0) + (hasAudience ? 10 : 0) - (textLength > 900 ? 18 : 0));
  const offer = clampScore(34 + (hasNumber ? 14 : 0) + (hasUrgency ? 14 : 0) + ((input.offer || "").length > 18 ? 12 : 0) + (hasRiskReducer ? 10 : 0));
  const attention = clampScore(38 + (hasPain ? 16 : 0) + (hasUrgency ? 10 : 0) + ((input.headline || "").length > 45 ? 8 : 0) + (hasAudience ? 8 : 0));
  const cta = clampScore(35 + (hasAction ? 30 : 0) + ((input.cta || "").length > 12 ? 14 : 0));
  const trust = clampScore(35 + (hasProof ? 22 : 0) + (hasRiskReducer ? 16 : 0) + (input.ticket ? 6 : 0));
  const friction = clampScore(100 - ((clarity + offer + cta + trust) / 4));
  const audienceFit = clampScore((attention + clarity + offer + (hasAudience ? 80 : 45)) / 4);
  const hydraScore = clampScore(attention * 0.16 + clarity * 0.18 + offer * 0.18 + cta * 0.13 + trust * 0.15 + audienceFit * 0.14 + (100 - friction) * 0.06);
  const bottlenecks = [["clareza", clarity], ["oferta", offer], ["CTA", cta], ["confianca", trust], ["aderencia", audienceFit]].sort((a, b) => a[1] - b[1]);

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
    suggestedBudget: hydraScore >= 78 ? "Teste controlado com 20% a 35% da verba planejada." : hydraScore >= 58 ? "Teste pequeno com 5% a 15% da verba planejada." : "Nao investir ainda. Revisar antes de comprar midia.",
    mainBottleneck: bottlenecks[0][0],
    fallbackReason,
    diagnosis: `Analise local: ${fallbackReason}`,
    improvements: [
      "Deixe a promessa mais especifica e mensuravel.",
      "Inclua um beneficio concreto no inicio da headline.",
      "Troque CTA generico por uma acao simples e direta.",
      "Responda a objecao principal antes do clique.",
      "Inclua prova social ou garantia se o publico ainda estiver frio."
    ],
    actionPlan: [
      "Reescrever headline com promessa direta.",
      "Fortalecer oferta ou reduzir risco percebido.",
      "Ajustar CTA ao objetivo da campanha.",
      "Rodar simulacao apos aplicar a versao sugerida."
    ],
    improvedHeadline: input.headline || "Resolva seu problema com uma oferta clara hoje",
    improvedBody: input.body || "Apresente a dor, mostre o beneficio principal, reduza risco e convide para uma acao simples.",
    improvedCta: hasAction ? input.cta : "Clique e solicite sua avaliacao"
  };
}

function sanitizeAnalysis(raw) {
  const verdict = ["escalar", "testar", "revisar"].includes(raw.verdict) ? raw.verdict : "testar";
  return {
    source: "huggingface",
    hydraScore: clampScore(raw.hydraScore),
    attention: clampScore(raw.attention),
    clarity: clampScore(raw.clarity),
    offer: clampScore(raw.offer),
    cta: clampScore(raw.cta),
    trust: clampScore(raw.trust),
    friction: clampScore(raw.friction),
    audienceFit: clampScore(raw.audienceFit),
    wasteRisk: clampScore(raw.wasteRisk),
    verdict,
    suggestedBudget: String(raw.suggestedBudget || ""),
    mainBottleneck: String(raw.mainBottleneck || ""),
    diagnosis: String(raw.diagnosis || "Diagnostico indisponivel."),
    improvements: Array.isArray(raw.improvements) ? raw.improvements.slice(0, 6).map(String) : [],
    actionPlan: Array.isArray(raw.actionPlan) ? raw.actionPlan.slice(0, 6).map(String) : [],
    improvedHeadline: String(raw.improvedHeadline || ""),
    improvedBody: String(raw.improvedBody || ""),
    improvedCta: String(raw.improvedCta || "")
  };
}

function parseAiContent(content) {
  const cleaned = String(content || "").replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first >= 0 && last > first) {
      return JSON.parse(cleaned.slice(first, last + 1));
    }
    throw new Error("Resposta da IA nao contem JSON completo.");
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  } catch {
    body = {};
  }
  const creative = body.creative || {};
  const model = body.model || process.env.HF_MODEL || "openai/gpt-oss-120b:cerebras";
  const token = process.env.HF_TOKEN;

  if (!token) {
    return res.status(200).json(heuristicCreativeAnalysis(creative, "HF_TOKEN nao esta configurado nas Environment Variables da Vercel."));
  }

  try {
    const quality = inputQuality(creative);
    if (quality.isNoise) {
      return res.status(200).json(heuristicCreativeAnalysis(creative, "Entrada parece texto aleatorio ou briefing insuficiente; a IA nao foi chamada para evitar diagnostico falso."));
    }

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        max_tokens: 1600,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Voce e o motor estrategico do Hydra | Strategy. Analise briefing e criativo antes do trafego pago. Primeiro verifique se o texto tem sentido comercial real. Se houver texto aleatorio, repetido ou insuficiente, de notas muito baixas, verdict revisar, mainBottleneck entrada invalida, e explique os motivos. Responda somente JSON valido, sem markdown. Use strings curtas. Chaves obrigatorias: hydraScore, attention, clarity, offer, cta, trust, friction, audienceFit, wasteRisk, verdict, suggestedBudget, mainBottleneck, diagnosis, improvements, actionPlan, improvedHeadline, improvedBody, improvedCta. Scores 0-100. verdict: escalar, testar ou revisar. improvements e actionPlan devem ter no maximo 4 itens."
          },
          {
            role: "user",
            content: JSON.stringify(creative)
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return res.status(200).json(heuristicCreativeAnalysis(
        creative,
        `Hugging Face respondeu HTTP ${response.status}. ${errorText.slice(0, 180)}`
      ));
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return res.status(200).json(heuristicCreativeAnalysis(creative, "Hugging Face respondeu sem conteudo analisavel."));
    }
    const raw = parseAiContent(content);
    return res.status(200).json(sanitizeAnalysis(raw));
  } catch (error) {
    return res.status(200).json(heuristicCreativeAnalysis(creative, `Erro ao chamar ou interpretar a IA: ${error.message}`));
  }
}
