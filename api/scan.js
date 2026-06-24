export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image, text } = req.body;

    // =========================
    // ENV KEYS
    // =========================
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudKey = process.env.CLOUDINARY_API_KEY;
    const cloudSecret = process.env.CLOUDINARY_API_SECRET;

    const sightUser = process.env.SIGHTENGINE_API_USER;
    const sightSecret = process.env.SIGHTENGINE_API_SECRET;

    const winstonKey = process.env.WINSTON_API_KEY;

    // =========================
    // TEXT SCAN (Winston AI)
    // =========================
    if (text) {
      const response = await fetch("https://api.gowinston.ai/v1/ai-content", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${winstonKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      return res.status(200).json({
        success: true,
        type: "text",
        ai: data
      });
    }

    // =========================
    // IMAGE SCAN (Sightengine)
    // =========================
    if (image) {
      const form = new URLSearchParams();

      form.append("media", image);
      form.append("models", "nudity,violence,offensive");
      form.append("api_user", sightUser);
      form.append("api_secret", sightSecret);

      const response = await fetch(
        "https://api.sightengine.com/1.0/check.json",
        {
          method: "POST",
          body: form
        }
      );

      const data = await response.json();

      return res.status(200).json({
        success: true,
        type: "image",
        ai: data
      });
    }

    return res.status(400).json({
      error: "No image or text provided"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
