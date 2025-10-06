import express, { Request, Response } from 'express';
import { getBadgeSVG, BadgeOptions } from './badge';

const app = express();
const PORT = process.env.PORT || 3000;

// Helper to parse query parameters safely
function parseBadgeOptions(query: any): BadgeOptions {
  return {
    label: query.label as string | undefined,
    message: query.message as string | undefined,
    theme: query.theme === 'dark' ? 'dark' : 'light', // default light
    style: ['flat', 'rounded', 'gradient'].includes(query.style) ? query.style : 'flat',
    width: query.width ? parseInt(query.width) : undefined,
    height: query.height ? parseInt(query.height) : undefined,
    imagePosition: ['left', 'right'].includes(query.imagePosition) ? query.imagePosition : 'left',
    embedImg: query.embedImg !== 'false', // default true
    size: ['small', 'medium', 'large'].includes(query.size) ? query.size : 'medium',
    fontSize: query.fontSize
  };
}

app.use(express.static('public'));

app.get('/api/badge', async (req: Request, res: Response) => {
  const user = req.query.user as string;
  if (!user) {
    return res.status(400).send('Missing user parameter');
  }

  const options = parseBadgeOptions(req.query);

  try {
    const svg = await getBadgeSVG(user, options);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Error generating badge: ' + err.message);
  }
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/../public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
