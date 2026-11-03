// ipinfo.js 

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.IPINFO_TOKEN;
  if (!token) return res.status(503).json({ error: 'IPInfo is not configured.' });

  try {
    const response = await fetch(`https://ipinfo.io/json?token=${encodeURIComponent(token)}`, {
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return res.status(502).json({ error: 'IPInfo request failed.' });
    const data = await response.json();
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: 'Unable to retrieve IP information.' });
  }
}

