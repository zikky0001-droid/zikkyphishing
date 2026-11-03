// server.js

const express = require("express");
const path = require("path");
const net = require("net");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const FormData = require("form-data");

const app = express();

// Pretty-print every res.json() response (2-space indent)
app.set("json spaces", 2);

// Behind Render's / Vercel's proxy
app.set("trust proxy", true);

app.use(express.json({ limit: "20kb" }));

// ------------------------------------------------------------
// Visitor IP detection (works on Render, Vercel, and locally)
// ------------------------------------------------------------

function cleanIp(value) {
  if (!value || typeof value !== "string") return null;

  let ip = value.split(",")[0].trim();

  // IPv4-mapped IPv6 (::ffff:1.2.3.4) -> 1.2.3.4
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);

  // Strip a trailing :port from IPv4 (1.2.3.4:5678)
  if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(ip)) ip = ip.split(":")[0];

  return net.isIP(ip) ? ip : null;
}

function isPrivateIp(ip) {
  if (!ip) return true;
  if (ip === "127.0.0.1" || ip === "::1") return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  if (ip.startsWith("169.254.")) return true;
  if (/^(fc|fd|fe80)/i.test(ip)) return true;
  return false;
}

function getClientIp(req) {
  const h = req.headers;

  // Order matters: platform-set headers first (harder to spoof),
  // then generic proxy headers, then the raw socket.
  const candidates = [
    h["x-vercel-forwarded-for"], // Vercel
    h["cf-connecting-ip"],       // Cloudflare (Render sits behind it)
    h["true-client-ip"],
    h["x-forwarded-for"],        // Render / generic proxies (first entry = client)
    h["x-real-ip"],
    req.ip,
    req.socket && req.socket.remoteAddress
  ];

  for (const candidate of candidates) {
    const ip = cleanIp(candidate);
    if (ip) return ip;
  }
  return null;
}

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

// IPInfo Endpoint — looks up the VISITOR's IP, not the server's
app.get("/api/ipinfo", async (req, res) => {
  const token = process.env.IPINFO_TOKEN;
  if (!token) return res.status(503).json({ error: "IPInfo is not configured." });

  const clientIp = getClientIp(req);

  // Local dev (127.0.0.1, 192.168.x.x, etc.) can't be looked up;
  // omit the IP so ipinfo returns the caller's public IP instead.
  const target = clientIp && !isPrivateIp(clientIp) ? `${clientIp}/json` : "json";

  try {
    const response = await fetch(
      `https://ipinfo.io/${target}?token=${encodeURIComponent(token)}`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!response.ok) return res.status(502).json({ error: "IPInfo request failed." });
    const data = await response.json();

    res.set("Cache-Control", "no-store");
    return res.json(data);
  } catch (error) {
    return res.status(502).json({ error: "Unable to retrieve IP information." });
  }
});

// Vercel runs the app as a serverless function (needs the export);
// Render runs it as a long-lived server (needs listen).
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

