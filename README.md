# GitSince

![GitSince Header](assets/badges/0.png)

GitSince is an open-source service that generates dynamic, personalized SVG badges showing how long you've been on GitHub. Just add a badge link to your README and it updates automatically!

## Features
- Fetches your GitHub join date via the GitHub API
- Renders a customizable SVG badge (e.g., "On GitHub since 2017" or "8 Years of Code 🧑‍💻")
- Multiple themes and styles
- Deployable to Vercel, Cloudflare, or GitHub Pages
- Customization via URL parameters

## Usage
Paste the badge URL in your README:

```
<img src="https://your-deployment-url/api/badge?user=USERNAME" alt="GitSince badge" />
```

## Development
- Node.js + TypeScript
- Express server (or serverless)
- SVG rendering

## Roadmap
- Achievement badges for milestones (e.g., 100 repos)
- More themes and icons

---
MIT License
