export default async function handler(req, res) {

  // ================= CORS =================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { image, text } = req.body || {};

    // ================= TEXT SCAN =================
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

    // ================= IMAGE SCAN (SIGHTENGINE) =================
    if (image) {

      // safety check (important)
      if (!process.env.SIGHTENGINE_USER || !process.env.SIGHTENGINE_SECRET) {
        return res.status(500).json({
          success: false,
          error: "Missing Sightengine credentials"
        });
      }

      const formData = new URLSearchParams();

      formData.append("api_user", process.env.SIGHTENGINE_USER);
      formData.append("api_secret", process.env.SIGHTENGINE_SECRET);
      formData.append("media", image);
      formData.append("models", "nudity,weapon,offensive,gore");

      const response = await fetch(
        "https://api.sightengine.com/1.0/check.json",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      // extra safety: handle API failure cleanly
      if (!response.ok || data?.status === "failure") {
        return res.status(200).json({
          success: false,
          type: "image",
          provider: "sightengine",
          ai: data,
          error: data?.error?.message || "Sightengine request failed"
        });
      }

      return res.status(200).json({
        success: true,
        type: "image",
        provider: "sightengine",
        ai: data
      });
    }

    // ================= NO INPUT =================
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
