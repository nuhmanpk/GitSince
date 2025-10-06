import { getBadgeSVG } from '../src/badge';
import { writeFileSync } from 'fs';
import path from 'path';

describe('Badge SVG Generation', () => {
  const testCases = [
    { user: 'nuhmanpk', options: {}, filename: 'badge-default.svg' },
    { user: 'nuhmanpk', options: { theme: 'dark' }, filename: 'badge-dark.svg' },
    { user: 'nuhmanpk', options: { label: 'GitHub Legend', message: '8 Years!' }, filename: 'badge-custom.svg' },
  ];

  testCases.forEach(({ user, options, filename }) => {
    it(`generates badge for ${user} (${filename})`, async () => {
      // Always embed image for test output
      const svg = await getBadgeSVG(user, { ...options, embedImg: true });
      const filePath = path.join(__dirname, filename);
      writeFileSync(filePath, svg, 'utf8');
      expect(svg).toContain('<svg');
    });
  });
});
