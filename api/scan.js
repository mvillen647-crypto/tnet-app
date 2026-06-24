export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { image, text } = req.body;

  return res.status(200).json({
    success: true,
    received: { image: !!image, text: !!text }
  });
}
