<div align="center">

# 🛡️ ZIKKY Phishing Awareness Lab

**Learn how phishing works — by seeing it, not falling for it.**

An educational, hands-on demo that simulates a phishing page to teach users how attacks are built and how to spot them.

[![Live](https://img.shields.io/badge/live-zikkyphishing.netlify.app-55e6ff?style=flat-square)](https://zikkyphishing.netlify.app)
[![Purpose](https://img.shields.io/badge/purpose-education-4cdda0?style=flat-square)](#-educational-use-only)
[![Fork](https://img.shields.io/badge/fork-welcome-8b7cff?style=flat-square)](#-fork-it-your-own-way)
[![Built by](https://img.shields.io/badge/built%20by-DEV%20ZIKKY-8b7cff?style=flat-square)](https://github.com/zikky0001-droid/)

A hand-built security awareness project by [DEV ZIKKY 🧑‍💻](https://github.com/zikky0001-droid).

---

<!-- Capsule -->
<img src="https://capsule-render.vercel.app/api?type=waving&height=200&color=gradient&text=ZIKKY%20PHISHING&fontAlign=50&fontAlignY=38&desc=AWARENESS%20LAB%20%C2%B7%20EDUCATION%20ONLY&descAlign=50&descAlignY=58&fontColor=55E6FF&animation=twinkling" width="90%" alt="ZIKKY Phishing">

<!-- Typing -->
<img src="https://readme-typing-svg.herokuapp.com/?font=Fira+Code&size=22&duration=3200&color=55E6FF&background=00000000&center=true&vCenter=true&width=720&lines=Understand+Phishing+%F0%9F%8E%A3;Learn+the+Attack+%C2%B7+Learn+the+Defense;Educational+Only+%C2%B7+Never+Malicious;Fork+%C2%B7+Edit+%C2%B7+Deploy" alt="Typing">

<!-- Badge Row -->
<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0-55E6FF?style=for-the-badge&logo=vercel&logoColor=white&labelColor=07090d" />
  <img src="https://img.shields.io/badge/Stack-HTML%20%2B%20CSS%20%2B%20JS-8B7CFF?style=for-the-badge&logo=javascript&logoColor=white&labelColor=07090d" />
  <img src="https://img.shields.io/badge/Deploy-Netlify%20%7C%20Vercel%20%7C%20Render-55E6FF?style=for-the-badge&logo=netlify&logoColor=white&labelColor=07090d" />
  <img src="https://img.shields.io/badge/License-MIT-4CDDA0?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=07090d" />
</p>

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="">

---

## ⚠️ Educational Use Only

> **This project is built strictly for cybersecurity education and awareness training.**

It exists so that developers, students, and everyday users can **see what a phishing page looks like** in a safe, controlled environment — and learn the red flags that give real attacks away.

**You must not:**
- Use this to harvest real credentials, personal data, or any information from anyone
- Deploy it publicly and use it to deceive real users
- Modify it to send captured data to any destination other than your own learning environment
- Use it in any way that violates local, national, or international law

**You should:**
- Run it locally on your own machine, or on a private staging URL, while learning
- Use it in classroom workshops, security awareness training, or CTF-style exercises with consent
- Read the source code to understand how these techniques work under the hood
- Take what you learn here and use it to protect people, not harm them

The author (**DEV ZIKKY**) is not responsible for misuse. By forking or deploying this project, you accept full responsibility for how you use it.

---

## ✨ What It Does

<table>
<tr>
<td width="50%" valign="top">

### 🎣 Phishing Simulation
A mock page designed to look like a familiar login flow.
```

· Realistic UI in a controlled setting
· Demonstrates the anatomy of a fake page
· Perfect for classroom demos
· Runs entirely client-side
· No real data is captured

```
**Best for:** awareness training sessions

</td>
<td width="50%" valign="top">

### 📚 Learning by Doing
See the attack to understand the defense.
```

· URL structure vs legitimate domain
· Visual cues that give a fake away
· Why "Allow camera access" is a red flag
· How to inspect a page before trusting it
· Where users typically click without thinking

```
**Best for:** security workshops

</td>
</tr>
</table>

---

## 🔐 Never Expose Your Secrets — Read This First

If you fork this project and add your own integrations (Telegram alerts, IP lookups, analytics), **never paste the tokens directly into the code and push them to GitHub.**

Bots crawl GitHub every minute looking for these patterns:

```

BOT_TOKEN = "1234567890:AAH..."     ← found within minutes
CHAT_ID   = "-100123456789"          ← found within minutes
IPINFO_TOKEN = "abc123..."           ← found within minutes

```

Once your token is public, it is **compromised forever**. Even if you delete the file later, the tokens stay in Git history and cached pages. An attacker can use your Telegram bot to spam users, or burn through your IP lookup quota in minutes.

### ✅ The right way — Environment Variables

Set your secrets in the hosting platform's **Environment Variables** panel. The code reads them at runtime — the values never appear in the repository.

**In your JavaScript, read them like this:**

```js
// ✅ Correct — from environment
const BOT_TOKEN   = import.meta.env.VITE_BOT_TOKEN;
const CHAT_ID     = import.meta.env.VITE_CHAT_ID;
const IPINFO_TOKEN = import.meta.env.VITE_IPINFO_TOKEN;
```

```js
// ❌ Never do this
const BOT_TOKEN = "1234567890:AAH...";
```

🧪 Set them on each platform

Platform Where to add environment variables
Netlify Site settings → Environment variables → Add variable
Vercel Project settings → Environment Variables → Add
Render Dashboard → Your service → Environment → Add variable

Add each variable once, using the exact names your code expects. Then redeploy so the new values take effect.

🚨 If you ever leak a token

1. Rotate it immediately — generate a new token on the platform, delete the old one.
2. Update the environment variable in your hosting dashboard.
3. Redeploy so the new token is picked up.
4. Assume the old token was used — check logs if you can.

Treat tokens like passwords. Never share them. Never screenshot them.

---

🚀 Quick Start — Fork, Edit, Deploy

Step 1 — Fork the repo

Click Fork at the top of this page. This creates your own copy on GitHub, which you can edit freely without affecting the original.

Step 2 — Clone your fork

```bash
git clone https://github.com/YOUR-USERNAME/ZIKKYPHISHING.git
cd ZIKKYPHISHING
```

Step 3 — Make it yours

Edit index.html — this is the whole app. Change:

· Branding — replace "ZIKKY" with your own name or classroom name
· Colors — search for #00ff88 and swap for your palette
· Copy — change the heading, footer, and messages
· Templates — if it has login mockups, adjust to match the platform you want to demonstrate
· Links — point "Contact" to your own email or form

Every part of the page is editable. There's no framework, no build step — what you see in index.html is what runs.

Step 4 — Test locally

Just open index.html in your browser. That's it — no server required.

For a cleaner experience with a local URL:

```bash
# Python 3
python3 -m http.server 8080
# → open http://localhost:8080
```

Step 5 — Push and deploy

```bash
git add .
git commit -m "feat: customize for my classroom"
git push origin main
```

Then pick a host below.

---

🌐 Deploy Anywhere

Netlify (easiest — drag & drop)

1. Go to netlify.com and log in
2. Click Add new site → Deploy manually
3. Drag the folder containing index.html into the drop zone
4. Done — you get a live URL in seconds

Or connect your GitHub fork for auto-deploy on every push:

· Add new site → Import an existing project → GitHub → select your fork
· Build command: (leave empty)
· Publish directory: / (or .)
· Add environment variables if your code uses them
· Deploy

Vercel

1. Go to vercel.com and log in
2. Add New → Project → Import Git Repository
3. Pick your fork
4. Framework preset: Other
5. Build command: (leave empty)
6. Output directory: .
7. Add environment variables under Environment Variables
8. Deploy

Render (Static Site)

1. Go to render.com and log in
2. New → Static Site → Connect your GitHub repo
3. Build command: (leave empty)
4. Publish directory: .
5. Add environment variables under Environment
6. Create site

📦 Repository Structure

```
ZIKKYPHISHING/
│
├── index.html          ← the entire app
├── README.md           ← you are here
├── LICENSE             ← MIT
└── .gitignore          ← ignore secrets and editor junk
```

That's it. Everything the browser loads is inside index.html.

---

🤝 Contributing & Starring

If you find this useful:
```
· ⭐ Star the repo — it helps other learners find it
· 🍴 Fork it — build your own version, teach your own class
· 🐛 Open an issue — found a bug or a security concern? Say so
· 📝 Improve the docs — clearer wording is always welcome
· 🎓 Use it in your training — this is what it's for
```
All contributions are welcome — so long as they keep the project educational and ethical.

---

👨‍💻 About Dev Zikky

Dev Zikky is a full-stack developer, security-curious builder, and problem-solver from Lagos, Nigeria 🇳🇬. He builds tools that solve real problems — usually from a phone, in Termux, at odd hours.

"Innovation is not about having all the answers — it's about asking the right questions."
```
· 🌐 Portfolio: zikkytech.xo.je
· 💻 GitHub: @zikky0001-droid
· 📢 Telegram: @Zikkystar1
· 🛡️ Live demo: zikkyphishing.netlify.app
```
---

🌟 Other Projects by Dev Zikky
```
 Project What it is
🤖 ZIKKY AI Free multi-model AI chat
📧 ZMAIL Studio Email composer + developer sending API
📬 ZMAIL Drop Public temporary mailboxes
📚 ZIKKY Manga Hub Clean free manga reader
💬 ZQUOTE Telegram-style quote image API
🌐 ZIKKY Tech The full catalogue
```
---

📬 Links

  ```
🌐 Live Demo zikkyphishing.netlify.app
💻 GitHub github.com/zikky0001-droid
🌟 Portfolio zikkytech.xo.je
```
---

⚖️ License

MIT — see LICENSE for details.
```
You are free to fork, edit, and redistribute — for educational purposes only. The license does not grant permission to use this project for malicious activity, and doing so is a violation of the spirit (and often the letter) of both this license and local law.
```
---

<div align="center">
```
⭐ If this helped you understand phishing better, star the repo.

ZIKKY Phishing Awareness Lab — learn the attack, build the defense.

Built with ☕ and 🌙 by Dev Zikky from Lagos, Nigeria 🇳🇬

Educate. Don't exploit. 🛡️
```
</div>

<p align="center">
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Rubik+Dirt&size=65&pause=1000&color=55E6FF&background=FF20A500&center=true&vCenter=true&width=1000&height=150&lines=ZIKKY+PHISHING;DEV+ZIKKY;LEARN+%C2%B7+DETECT+%C2%B7+DEFEND" alt="Typing SVG" /></a>
</p>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

</div>
```
