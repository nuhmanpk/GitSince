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
  label?: string;
  message?: string;
  theme?: 'light' | 'dark';
  embedImg?: boolean;
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
  const message = options.message || `${years} Year${years === 1 ? '' : 's'} of Code ${emoji}`;
  const theme = options.theme || 'light';
  const embedImg = options.embedImg !== false; // default to true

  // Prepare badge image
  let badgeImg: string;
  if (embedImg) {
    const imgPath = path.resolve(__dirname, `../assets/badges/${level}.png`);
    try {
      const imgData = fs.readFileSync(imgPath);
      const base64 = imgData.toString('base64');
      badgeImg = `data:image/png;base64,${base64}`;
    } catch (e) {
      badgeImg = '';
    }
  } else {
    badgeImg = `/assets/badges/${level}.png`;
  }

  const bg = theme === 'dark' ? '#222' : '#fff';
  const fg = theme === 'dark' ? '#fff' : '#222';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="320" height="48" xmlns="http://www.w3.org/2000/svg">
  <rect rx="8" width="320" height="48" fill="${bg}"/>
  <image href="${badgeImg}" x="10" y="6" height="36" width="36"/>
  <text x="56" y="26" font-size="16" fill="${fg}" font-family="Verdana">${label}</text>
  <text x="56" y="42" font-size="12" fill="${fg}" font-family="Verdana">${message}</text>
</svg>`;
}

function getLevel(years: number): number {
  if (years < 1) return 1;
  if (years >= 11) return 11;
  return years + 1;
}

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
