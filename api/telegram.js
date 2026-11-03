// telegram.js 

import { IncomingForm } from 'formidable';
import { readFileSync } from 'fs';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return res.status(503).json({ error: 'Telegram is not configured.' });

  const contentType = req.headers['content-type'] || '';

  // Handle JSON
  if (contentType.includes('application/json')) {
    let body = '';
    for await (const chunk of req) body += chunk;
    let data;
    try { data = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }

    const { text } = data;
    if (typeof text !== 'string' || !text.trim() || text.length > 4000) {
      return res.status(400).json({ error: 'Invalid message.' });
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text.trim(), parse_mode: 'Markdown' }),
        signal: AbortSignal.timeout(15000)
      });
      const result = await response.json();
      if (!response.ok || !result.ok) return res.status(502).json({ error: 'Telegram delivery failed.' });
      return res.status(200).json({ success: true });
    } catch {
      return res.status(502).json({ error: 'Unable to send notification.' });
    }
  }

  // Handle FormData
  if (contentType.includes('multipart/form-data')) {
    const form = new IncomingForm({ keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Error parsing form data' });

      const caption = Array.isArray(fields.caption) ? fields.caption[0] : fields.caption;
      const photoFile = Array.isArray(files.photo) ? files.photo[0] : files.photo;
      if (!photoFile) return res.status(400).json({ error: 'No photo provided' });

      try {
        const formData = new FormData();
        formData.append('chat_id', chatId);
        if (caption) formData.append('caption', caption);
        formData.append('parse_mode', 'Markdown');
        const fileBuffer = readFileSync(photoFile.filepath);
        formData.append('photo', new Blob([fileBuffer]), photoFile.originalFilename || 'photo.jpg');

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST', body: formData, signal: AbortSignal.timeout(15000)
        });
        const result = await response.json();
        if (!response.ok || !result.ok) return res.status(502).json({ error: 'Telegram photo delivery failed.' });
        return res.status(200).json({ success: true });
      } catch {
        return res.status(502).json({ error: 'Unable to send photo.' });
      }
    });
    return;
  }
  return res.status(400).json({ error: 'Unsupported content type' });
}

