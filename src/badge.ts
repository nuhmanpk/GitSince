import axios from 'axios';
import fs from 'fs';
import path from 'path';

function yearsSince(date: string): number {
  const joined = new Date(date);
  const now = new Date();
  let years = now.getFullYear() - joined.getFullYear();
  if (
    now.getMonth() < joined.getMonth() ||
    (now.getMonth() === joined.getMonth() && now.getDate() < joined.getDate())
  ) {
    years--;
  }
  return years;
}

interface BadgeOptions {
  label?: string;              // Main title
  message?: string;            // Secondary message
  theme?: 'light' | 'dark';    // Background/foreground theme
  embedImg?: boolean;          // Embed badge image as base64
  style?: 'flat' | 'rounded' | 'gradient'; // Badge style
  width?: number;              // Width of the badge
  height?: number;             // Height of the badge
  emojiPosition?: 'left' | 'right' | 'none'; // Emoji placement
}

export async function getBadgeSVG(user: string, options: BadgeOptions = {}): Promise<string> {
  // Fetch GitHub user data
  const resp = await axios.get(`https://api.github.com/users/${user}`);
  const joinDate = resp.data.created_at;
  const years = yearsSince(joinDate);
  const { title, emoji } = getTitleAndEmoji(years);
  const level = getLevel(years); // 1-11

  // Default options
  const label = options.label || `${title}`;
  const message = options.message || `${years} Year${years === 1 ? '' : 's'} of Code`;
  const theme = options.theme || 'light';
  const embedImg = options.embedImg !== false; // default true
  const style = options.style || 'flat';
  const width = options.width || 320;
  const height = options.height || 48;
  const emojiPosition = options.emojiPosition || 'left';

  // Prepare badge image
  let badgeImg: string = '';
  if (embedImg) {
    const imgPath = path.resolve(__dirname, `../assets/badges/${level}.png`);
    try {
      const imgData = fs.readFileSync(imgPath);
      const base64 = imgData.toString('base64');
      badgeImg = `data:image/png;base64,${base64}`;
    } catch (e) {
      badgeImg = '';
    }
  }

  // Colors
  let bg: string, fg: string;
  if (theme === 'dark') {
    fg = '#fff';
    bg = style === 'gradient' ? 'url(#gradDark)' : '#222';
  } else {
    fg = '#222';
    bg = style === 'gradient' ? 'url(#gradLight)' : '#fff';
  }

  // Rounded corners
  const rx = style === 'rounded' ? height / 2 : 8;

  // Emoji placement
  let emojiSvg = '';
  if (emojiPosition !== 'none') {
    const x = emojiPosition === 'left' ? 10 : width - 36 - 10;
    emojiSvg = `<text x="${x + 18}" y="${height / 2 + 6}" font-size="24" text-anchor="middle" dominant-baseline="middle">${emoji}</text>`;
  }

  // SVG
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  ${style === 'gradient' ? `
  <defs>
    <linearGradient id="gradLight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fad0c4;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="gradDark" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#434343;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
    </linearGradient>
  </defs>` : ''}
  <rect rx="${rx}" width="${width}" height="${height}" fill="${bg}"/>
  ${badgeImg ? `<image href="${badgeImg}" x="10" y="6" height="${height-12}" width="${height-12}"/>` : ''}
  ${emojiSvg}
  <text x="${height + 10}" y="${height / 2 - 2}" font-size="16" fill="${fg}" font-family="Verdana" dominant-baseline="middle">${label}</text>
  <text x="${height + 10}" y="${height / 2 + 16}" font-size="12" fill="${fg}" font-family="Verdana" dominant-baseline="middle">${message}</text>
</svg>`;
}

// Level logic
function getLevel(years: number): number {
  if (years < 1) return 1;
  if (years >= 11) return 11;
  return years + 1;
}

// Titles and emoji
function getTitleAndEmoji(years: number): { title: string; emoji: string } {
  const levels = [
    { title: 'New to GitHub', emoji: '🌱' },
    { title: 'Rising Coder', emoji: '🚀' },
    { title: 'Open Source Explorer', emoji: '🧭' },
    { title: 'Code Contributor', emoji: '🤝' },
    { title: 'Project Builder', emoji: '🏗️' },
    { title: 'Open Source Knight', emoji: '🛡️' },
    { title: 'Merge Master', emoji: '🧙‍♂️' },
    { title: 'Community Hero', emoji: '🦸‍♂️' },
    { title: 'Legendary Dev', emoji: '🦄' },
    { title: 'Code Champion', emoji: '🏆' },
    { title: 'GitHub Legend', emoji: '👑' },
  ];
  const index = Math.min(years, levels.length - 1);
  return levels[index];
}
