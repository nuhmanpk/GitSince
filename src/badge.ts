

import axios from 'axios';
import fs from 'fs';
import path from 'path';



function yearsSince(date: string): number {
  const joined = new Date(date);
  const now = new Date();
  return now.getFullYear() - joined.getFullYear();
}


export async function getBadgeSVG(user: string, options: any): Promise<string> {
  // Fetch user data from GitHub API
  const resp = await axios.get(`https://api.github.com/users/${user}`);
  const joinDate = resp.data.created_at;
  const year = new Date(joinDate).getFullYear();
  const years = yearsSince(joinDate);
  const { title, emoji } = getTitleAndEmoji(years);
  const level = getLevel(years); // 1-11

  const label = options.label || `${title}`;
  const message = options.message || `${years} Year${years === 1 ? '' : 's'} of Code ${emoji}`;
  const theme = options.theme || 'light';

  let badgeImg: string;
  if (options && options.embedImg) {
    // Embed PNG as base64 data URI for test output
    const imgPath = path.resolve(__dirname, `../assets/badges/${level}.png`);
    try {
      const imgData = fs.readFileSync(imgPath);
      const base64 = imgData.toString('base64');
      badgeImg = `data:image/png;base64,${base64}`;
    } catch (e) {
      badgeImg = '';
    }
  } else {
    // Use relative path for server
    badgeImg = `/assets/badges/${level}.png`;
  }

  // Simple SVG badge with image
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
  if (years < 1) return levels[0];
  if (years >= 11) return levels[10];
  return levels[years];
}


