import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { levels } from './levels';
import { testUserData } from '../src/utils';

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

function escapeXML(str: string | number): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export interface BadgeOptions {
  label?: string;
  message?: string;
  theme?: 'light' | 'dark';
  embedImg?: boolean;
  style?: 'flat' | 'rounded' | 'gradient';
  width?: number;
  height?: number;
  size?: 'small' | 'medium' | 'large' | 'custom';
  imagePosition?: 'left' | 'right';
  fontSize?: number;
}

export async function getBadgeSVG(user: string, options: BadgeOptions = {}): Promise<string> {
  let resp = null;
  if (user === 'testuser') {
    resp = { data: testUserData };
  } else {
    resp = await axios.get(`https://api.github.com/users/${user}`);
  }

  const joinDate = resp.data.created_at;
  const years = yearsSince(joinDate);
  const level = getLevel(years);

  const sizePresets: Record<'small' | 'medium' | 'large', { width: number; height: number }> = {
    small: { width: 200, height: 200 },
    medium: { width: 320, height: 100 },
    large: { width: 800, height: 300 },
  };

  const preset = options.size && options.size !== 'custom' ? sizePresets[options.size] : sizePresets.medium;
  const width = preset.width;
  const height = preset.height;
  const theme = options.theme || 'light';
  const embedImg = options.embedImg !== false;
  const style = options.style || 'flat';
  const imagePosition = options.imagePosition || 'left';

  let badgeImg: string = '';
  if (embedImg) {
    const imgPath = path.resolve(__dirname, `../assets/badges/${level}.png`);
    try {
      const imgData = fs.readFileSync(imgPath);
      const base64 = imgData.toString('base64');
      badgeImg = `data:image/png;base64,${base64}`;
    } catch {
      badgeImg = '';
    }
  }

  const bg = theme === 'dark' ? (style === 'gradient' ? 'url(#gradDark)' : '#222') : (style === 'gradient' ? 'url(#gradLight)' : '#fff');
  const rx = style === 'rounded' ? height / 2 : 8;

  const { title } = getTitleAndEmoji(years);
  const label = escapeXML(options.label || title);
  const message = escapeXML(options.message || `${years} Year${years === 1 ? '' : 's'} of Code`);
  const fg = theme === 'dark' ? '#fff' : '#222';

  const defaultLabelFontSize = options.fontSize || 16;
  const defaultMessageFontSize = defaultLabelFontSize - 2;

  let labelFontSize = defaultLabelFontSize;
  let messageFontSize = defaultMessageFontSize;

  const imgX = imagePosition === 'right' ? width - height : 0;
  const textStartX = imagePosition === 'right' ? 20 : height + 20;

  // Default label/message positions
  let labelX = textStartX;
  let labelY = height / 2 - 2;
  let messageX = textStartX;
  let messageY = height / 2 + 16;

  let extraTextSVG = '';

  if (options.size === 'large') {
    const name = escapeXML(resp.data.name || '');
    const bio = escapeXML(resp.data.bio || '');
    const location = escapeXML(resp.data.location || '');
    const followers = escapeXML(resp.data.followers);
    const public_repos = escapeXML(resp.data.public_repos);
    const created_at = escapeXML(new Date(resp.data.created_at).toDateString());

    labelFontSize = defaultLabelFontSize + 4;
    messageFontSize = defaultMessageFontSize + 2;

    labelX = textStartX;
    labelY = 40;
    messageX = textStartX;
    messageY = 70;

    const textPairsWithCoords = [
      { label: 'Name', value: name, x: textStartX, y: 100, fontSize: messageFontSize },
      { label: 'Bio', value: bio, x: textStartX, y: 130, fontSize: messageFontSize },
      { label: 'Location', value: location, x: textStartX, y: 160, fontSize: messageFontSize },
      { label: 'Followers', value: followers, x: textStartX, y: 190, fontSize: messageFontSize },
      { label: 'Public Repos', value: public_repos, x: textStartX, y: 220, fontSize: messageFontSize },
      { label: 'Joined', value: created_at, x: textStartX, y: 250, fontSize: messageFontSize },
    ];

    extraTextSVG = textPairsWithCoords.map(pair => `
      <text x="${pair.x}" y="${pair.y}" font-size="${pair.fontSize}" font-family="Verdana" dominant-baseline="middle">
        <tspan font-weight="bold" fill="${fg}">${pair.label}:</tspan>
        <tspan fill="${theme === 'dark' ? '#ccc' : '#555'}"> ${pair.value}</tspan>
      </text>
    `).join('');
  }

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
  ${badgeImg ? `<image href="${badgeImg}" x="${imgX}" y="0" height="${height}" width="${height}"/>` : ''}
  <text x="${labelX}" y="${labelY}" font-size="${labelFontSize}" fill="${fg}" font-family="Verdana" dominant-baseline="middle">${label}</text>
  <text x="${messageX}" y="${messageY}" font-size="${messageFontSize}" fill="${fg}" font-family="Verdana" dominant-baseline="middle">${message}</text>
  ${extraTextSVG}
</svg>`;
}

function getLevel(years: number): number {
  if (years < 1) return 1;
  if (years >= 11) return 11;
  return years + 1;
}

function getTitleAndEmoji(years: number): { title: string } {
  const index = Math.min(years, levels.length - 1);
  return levels[index];
}
