export default function handler(req, res) {
  return res.status(200).json({
    ok: true,
    hasHfToken: Boolean(process.env.HF_TOKEN),
    hasHfModel: Boolean(process.env.HF_MODEL),
    hfModel: process.env.HF_MODEL || "openai/gpt-oss-120b:cerebras",
    nodeEnv: process.env.NODE_ENV || null
  });
}
