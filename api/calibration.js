import fs from "node:fs";
import path from "node:path";

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function parseNumber(value) {
  if (value === undefined || value === null) return 0;
  const normalized = String(value).replace("%", "").replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function splitCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function normalizeRow(row) {
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

function parseCsv(csv) {
  const lines = csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((header) => header.toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] || "";
    });
    return normalizeRow(row);
  });
}

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "data", "campaign-history.csv");
    const csv = fs.readFileSync(filePath, "utf8");
    const rows = parseCsv(csv);
    const avg = rows.length ? rows.reduce((sum, row) => sum + row.performanceScore, 0) / rows.length : 0;
    return res.status(200).json({
      ok: true,
      source: "git",
      rows,
      count: rows.length,
      benchmarkScore: clampScore(avg)
    });
  } catch (error) {
    return res.status(200).json({
      ok: false,
      source: "git",
      rows: [],
      count: 0,
      benchmarkScore: null,
      error: error.message
    });
  }
}
