# GitSince

<p align="center">
  <img src="assets/badges/0.png" alt="GitSince Header" width="500" height="500" />
</p>



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
<img src="https://git-since.vercel.app/api/badge?user=USERNAME" alt="GitSince badge" />
```

```
<img src="https://git-since.vercel.app/api/badge?user=nuhmanpk" alt="GitSince badge" />
```

| Parameter       | Type                                | Default              | Description                                                        |
| --------------- | ----------------------------------- | -------------------- | ------------------------------------------------------------------ |
| `user`          | `string`                            | **Required**         | GitHub username to generate the badge for.                         |
| `theme`         | `'light'` or `'dark'`               | `'light'`            | Sets background and text colors.                                   |
| `style`         | `'flat'`, `'rounded'`, `'gradient'` | `'flat'`             | Controls badge shape and design style.                             |
| `width`         | `number`                            | `320`                | Width of the badge in pixels.                                      |
| `height`        | `number`                            | `48`                 | Height of the badge in pixels.                                     |
| `emojiPosition` | `'left'`, `'right'`, `'none'`       | `'left'`             | Position of the emoji on the badge (only shown if no image).       |
| `label`         | `string`                            | Title based on years | Main text displayed on the badge.                                  |
| `message`       | `string`                            | `"X Years of Code"`  | Secondary message on the badge.                                    |
| `embedImg`      | `true` or `false`                   | `true`               | Embed badge PNG as base64 (recommended for serverless deployment). |


## Development
- Node.js + TypeScript
- Express server (or serverless)
- SVG rendering

<img src="https://git-since.vercel.app/api/badge?user=nuhmanpk&theme=dark&style=gradient&width=500&height=200&emojiPosition=right" alt="GitSince badge" />


## Roadmap
- Achievement badges for milestones (e.g., 100 repos)
- More themes and icons

