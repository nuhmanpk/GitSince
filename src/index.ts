
import express, { Request, Response } from 'express';
import { getBadgeSVG } from './badge';


const app = express();
const PORT = process.env.PORT || 3000;


app.get('/api/badge', async (req: Request, res: Response) => {
  const user = req.query.user as string;
  if (!user) {
    return res.status(400).send('Missing user parameter');
  }
  try {
    const svg = await getBadgeSVG(user, req.query);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (err: any) {
    res.status(500).send('Error generating badge: ' + err.message);
  }
});


app.get('/', (req: Request, res: Response) => {
  res.send('GitSince Badge Service is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
