// server.js file 

const express = require("express");
const path = require("path");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const FormData = require("form-data");

const app = express();

app.use(express.json({ limit: "20kb" }));

// Serve your existing website
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve static files
app.use(express.static(__dirname, { index: false, dotfiles: "ignore" }));

// Telegram Endpoint (Handles both JSON and FormData)
app.post("/api/telegram", async (req, res) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(503).json({ error: "Telegram is not configured." });
  }

  const contentType = req.headers["content-type"] || "";

  // 1. Handle JSON (Text Messages)
  if (contentType.includes("application/json")) {
    const { text } = req.body || {};
    if (typeof text !== "string" || !text.trim() || text.length > 4000) {
      return res.status(400).json({ error: "Invalid message." });
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: text.trim(), parse_mode: "Markdown" }),
        signal: AbortSignal.timeout(15000)
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        return res.status(502).json({ error: "Telegram delivery failed." });
      }
      return res.json({ success: true });
    } catch (error) {
      return res.status(502).json({ error: "Unable to send notification." });
    }
  }

  // 2. Handle FormData (Photo Uploads)
  if (contentType.includes("multipart/form-data")) {
    const form = new IncomingForm({ keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Error parsing form data" });

      const caption = Array.isArray(fields.caption) ? fields.caption[0] : fields.caption;
      const photoFile = Array.isArray(files.photo) ? files.photo[0] : files.photo;

      if (!photoFile) return res.status(400).json({ error: "No photo provided" });

      try {
        const formData = new FormData();
        formData.append("chat_id", chatId);
        if (caption) formData.append("caption", caption);
        formData.append("parse_mode", "Markdown");
        formData.append("photo", fs.createReadStream(photoFile.filepath), photoFile.originalFilename || "photo.jpg");

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: "POST",
          body: formData,
          signal: AbortSignal.timeout(15000)
        });

        const result = await response.json();
        if (!response.ok || !result.ok) {
          return res.status(502).json({ error: "Telegram photo delivery failed." });
        }
        return res.json({ success: true });
      } catch (error) {
        return res.status(502).json({ error: "Unable to send photo." });
      }
    });
    return;
  }

  return res.status(400).json({ error: "Unsupported content type" });
});

// IPInfo Endpoint
app.get("/api/ipinfo", async (req, res) => {
  const token = process.env.IPINFO_TOKEN;
  if (!token) return res.status(503).json({ error: "IPInfo is not configured." });

  try {
    const response = await fetch(`https://ipinfo.io/json?token=${encodeURIComponent(token)}`, {
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return res.status(502).json({ error: "IPInfo request failed." });
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(502).json({ error: "Unable to retrieve IP information." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});

