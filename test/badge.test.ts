import { getBadgeSVG } from '../src/badge';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

describe('Badge SVG Generation - Full Coverage', () => {
  const outputDir = path.join(__dirname, 'test_output');
  if (!existsSync(outputDir)) mkdirSync(outputDir);

  const testCases: { options: any; filename: string; description: string }[] = [
    // Single options
    { options: {}, filename: 'badge-default.svg', description: 'default options' },
    { options: { theme: 'dark' }, filename: 'badge-dark.svg', description: 'dark theme' },
    { options: { label: 'GitHub Legend', message: '8 Years!' }, filename: 'badge-custom.svg', description: 'custom label and message' },
    { options: { style: 'rounded' }, filename: 'badge-rounded.svg', description: 'rounded style' },
    { options: { style: 'gradient', theme: 'dark' }, filename: 'badge-gradient-dark.svg', description: 'gradient dark theme' },
    { options: { size: 'small' }, filename: 'badge-small.svg', description: 'small size' },
    { options: { size: 'medium' }, filename: 'badge-medium.svg', description: 'medium size' },
    { options: { size: 'large' }, filename: 'badge-large.svg', description: 'large size' },
    { options: { imagePosition: 'right' }, filename: 'badge-image-right.svg', description: 'image on right' },
    { options: { fontSize: 24 }, filename: 'badge-large-font.svg', description: 'custom font size' },
    { options: { embedImg: false }, filename: 'badge-no-image.svg', description: 'no embedded image' },

    // Combination options
    { options: { size: 'large', imagePosition: 'right' }, filename: 'badge-large-image-right.svg', description: 'large size with image on right' },
    { options: { size: 'large', style: 'gradient', theme: 'dark' }, filename: 'badge-large-gradient-dark.svg', description: 'large gradient dark badge' },
    { options: { size: 'medium', style: 'rounded', theme: 'dark', embedImg: false }, filename: 'badge-medium-rounded-dark-noimage.svg', description: 'medium rounded dark badge without image' },
    { options: { size: 'small', label: 'Mini Hero', message: '1 Year', theme: 'light', style: 'gradient' }, filename: 'badge-small-gradient-custom.svg', description: 'small gradient badge with custom text' },
    { options: { size: 'large', fontSize: 28, embedImg: false, imagePosition: 'right' }, filename: 'badge-large-font-noimage-right.svg', description: 'large badge, custom font, no image, image right' },
  ];

  testCases.forEach(({ options, filename, description }) => {
    it(`generates badge (${description})`, async () => {
      const svg = await getBadgeSVG('testuser', options);
      const filePath = path.join(outputDir, filename);
      writeFileSync(filePath, svg, 'utf8');

      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');

      // Option-specific checks
      if (options.embedImg === false) expect(svg).not.toContain('<image');
      if (options.label) expect(svg).toContain(options.label);
      if (options.message) expect(svg).toContain(options.message);
      if (options.size === 'large') {
        expect(svg).toContain('Name:');
        expect(svg).toContain('Bio:');
        expect(svg).toContain('Location:');
        expect(svg).toContain('Followers:');
        expect(svg).toContain('Public Repos:');
        expect(svg).toContain('Joined:');
      }
      if (options.style === 'gradient') expect(svg).toContain('<linearGradient');
    });
  });
});
