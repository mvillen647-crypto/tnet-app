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
import cloudinary from "../cloudinary.js";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image, text } = req.body || {};

    /* =========================
       IMAGE SCAN (REAL)
    ========================= */
    if (image) {

      // 1. Upload image to Cloudinary
      const upload = await cloudinary.uploader.upload(image, {
        folder: "tnet"
      });

      const imageUrl = upload.secure_url;

      // 2. Send to Sightengine
      const response = await axios.get(
        "https://api.sightengine.com/1.0/check.json",
        {
          params: {
            url: imageUrl,
            models: "nudity,weapon,offensive,face-attributes",
            api_user: process.env.SIGHTENGINE_API_USER,
            api_secret: process.env.SIGHTENGINE_API_SECRET
          }
        }
      );

      return res.status(200).json({
        success: true,
        type: "image",
        imageUrl,
        ai: response.data
      });
    }

    /* =========================
       TEXT SCAN
    ========================= */
    if (text) {
      return res.status(200).json({
        success: true,
        type: "text",
        ai: {
          prediction: "human",
          score: 0.91
        }
      });
    }

    return res.status(400).json({
      error: "No input provided"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
export default function handler(req, res) {
  
  // ✅ CORS HEADERS (IMPORTANT)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, image } = req.body || {};

  return res.status(200).json({
    success: true,
    type: text ? "text" : "image",
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
