export default async function handler(req, res) {

  // Ruhusu POST tu
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const body = req.body || {};

    /* =========================
       IMAGE SCAN (PRO MOCK)
    ========================= */
    if (body.image) {

      // TODO LATER:
      // 1. Upload to Cloudinary
      // 2. Send URL to Sightengine
      // 3. Get real AI results

      return res.status(200).json({
        success: true,
        type: "image",
        provider: "tnet-ai",
        ai: {
          nudity: {
            safe: 0.97,
            unsafe: 0.03
          },
          violence: {
            prob: 0.02
          },
          spoof: {
            prob: 0.01
          },
          verdict: "safe"
        }
      });
    }

    /* =========================
       TEXT SCAN (PRO MOCK)
    ========================= */
    if (body.text) {

      // TODO LATER:
      // 1. Send to Winston AI
      // 2. Add Firebase logging

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

    return res.status(400).json({
      success: false,
      error: "No image or text provided"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Server error"
    });
  }
}
