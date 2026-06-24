export const config = {
  api: {
    bodyParser: false
  }
};

import formidable from "formidable";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    try {
      const file = files.media;

      const formData = new FormData();

      formData.append("api_user", process.env.SIGHTENGINE_USER);
      formData.append("api_secret", process.env.SIGHTENGINE_SECRET);

      formData.append("media", file.filepath || file);
      formData.append("models", "nudity,weapon,offensive");

      const response = await fetch("https://api.sightengine.com/1.0/check.json", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      return res.status(200).json({
        success: true,
        type: "image",
        provider: "sightengine",
        ai: data
      });

    } catch (e) {
      return res.status(500).json({
        success: false,
        error: e.message
      });
    }
  });
}
