function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function heuristicCreativeAnalysis(input) {
  const all = `${input.headline || ""} ${input.body || ""} ${input.offer || ""} ${input.cta || ""}`.toLowerCase();
  const hasNumber = /\d/.test(all);
  const hasUrgency = /(hoje|agora|limitad|ultim|gratis|gratuita|bonus|desconto)/i.test(all);
  const hasPain = /(dor|problema|dificuldade|perder|cansad|sem tempo|caro|risco)/i.test(all);
  const hasAction = /(clique|chame|agende|compre|solicite|fale|baixe|acesse)/i.test(input.cta || "");
  const textLength = all.length;
  const clarity = clampScore(45 + ((input.headline || "").length > 18 ? 14 : 0) + ((input.cta || "").length > 8 ? 16 : 0) - (textLength > 720 ? 18 : 0));
  const offer = clampScore(38 + (hasNumber ? 16 : 0) + (hasUrgency ? 18 : 0) + ((input.offer || "").length > 18 ? 14 : 0));
  const attention = clampScore(42 + (hasPain ? 18 : 0) + (hasUrgency ? 12 : 0) + ((input.headline || "").length > 45 ? 8 : 0));
  const cta = clampScore(35 + (hasAction ? 30 : 0) + ((input.cta || "").length > 12 ? 14 : 0));
  const friction = clampScore(100 - ((clarity + offer + cta) / 3));
  const audienceFit = clampScore((attention + clarity + offer) / 3);
  const average = (clarity + offer + cta + attention) / 4;

  return {
    source: "heuristic",
    attention,
    clarity,
    offer,
    cta,
    friction,
    audienceFit,
    verdict: average >= 72 ? "escalar" : average >= 52 ? "testar" : "revisar",
    diagnosis: "Analise local: usada quando HF_TOKEN nao esta configurado ou a IA nao respondeu.",
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

function sanitizeAnalysis(raw) {
  const verdict = ["escalar", "testar", "revisar"].includes(raw.verdict) ? raw.verdict : "testar";
  return {
    source: "huggingface",
    attention: clampScore(raw.attention),
    clarity: clampScore(raw.clarity),
    offer: clampScore(raw.offer),
    cta: clampScore(raw.cta),
    friction: clampScore(raw.friction),
    audienceFit: clampScore(raw.audienceFit),
    verdict,
    diagnosis: String(raw.diagnosis || "Diagnostico indisponivel."),
    improvements: Array.isArray(raw.improvements) ? raw.improvements.slice(0, 6).map(String) : [],
    improvedHeadline: String(raw.improvedHeadline || ""),
    improvedBody: String(raw.improvedBody || ""),
    improvedCta: String(raw.improvedCta || "")
  };
}

function parseAiContent(content) {
  const cleaned = String(content || "").replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const creative = req.body?.creative || {};
  const model = req.body?.model || process.env.HF_MODEL || "openai/gpt-oss-120b:cerebras";
  const token = process.env.HF_TOKEN;

  if (!token) {
    return res.status(200).json(heuristicCreativeAnalysis(creative));
  }

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        max_tokens: 900,
        messages: [
          {
            role: "system",
            content: "Voce e o motor estrategico do Hydra | Strategy. Analise criativos antes do trafego pago. Responda somente JSON valido com chaves: attention, clarity, offer, cta, friction, audienceFit, verdict, diagnosis, improvements, improvedHeadline, improvedBody, improvedCta. Scores 0-100. verdict deve ser escalar, testar ou revisar."
          },
          {
            role: "user",
            content: JSON.stringify(creative)
          }
        ]
      })
    });

    if (!response.ok) {
      return res.status(200).json(heuristicCreativeAnalysis(creative));
    }

    const data = await response.json();
    const raw = parseAiContent(data.choices?.[0]?.message?.content || "{}");
    return res.status(200).json(sanitizeAnalysis(raw));
  } catch {
    return res.status(200).json(heuristicCreativeAnalysis(creative));
  }
}
