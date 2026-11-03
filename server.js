// server.js file 

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json({ limit: "20kb" }));

// Serve your existing website
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Secure Telegram notification endpoint
app.post("/api/telegram", async (req, res) => {
  const { text } = req.body || {};

  if (typeof text !== "string" || !text.trim() || text.length > 4000) {
    return res.status(400).json({ error: "Invalid message." });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(503).json({ error: "Telegram is not configured." });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text.trim()
        }),
        signal: AbortSignal.timeout(15000)
      }
    );

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return res.status(502).json({ error: "Telegram delivery failed." });
    }

    return res.json({ success: true });

  } catch (error) {
    return res.status(502).json({ error: "Unable to send notification." });
  }
});

// IPInfo proxy endpoint
app.get("/api/ipinfo", async (req, res) => {
  const token = process.env.IPINFO_TOKEN;

  if (!token) {
    return res.status(503).json({ error: "IPInfo is not configured." });
  }

  try {
    const response = await fetch(
      `https://ipinfo.io/json?token=${encodeURIComponent(token)}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!response.ok) {
      return res.status(502).json({ error: "IPInfo request failed." });
    }

    const data = await response.json();
    return res.json(data);

  } catch (error) {
    return res.status(502).json({ error: "Unable to retrieve IP information." });
  }
});

app.use(express.static(__dirname, {
  index: false,
  dotfiles: "ignore"
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

