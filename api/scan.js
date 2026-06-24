export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false });

  try {
    const { image, text } = req.body || {};

    // TEXT
    if (text) {
      return res.status(200).json({
        success: true,
        type: "text",
        provider: "tnet-ai",
        ai: {
          prediction: "human",
          score: 0.91,
          toxicity: 0.05,
          readability: "high",
          verdict: "safe"
        }
      });
    }

    // IMAGE
    if (image) {
      const formData = new URLSearchParams();

      formData.append("api_user", process.env.SIGHTENGINE_USER);
      formData.append("api_secret", process.env.SIGHTENGINE_SECRET);
      formData.append("media", image);
      formData.append("models", "nudity,weapon,offensive");

      const response = await fetch(
        "https://api.sightengine.com/1.0/check.json",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      return res.status(200).json({
        success: true,
        type: "image",
        provider: "sightengine",
        ai: data
      });
    }

    return res.status(400).json({
      success: false,
      error: "No input provided"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
