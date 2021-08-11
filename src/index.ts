import { createServer } from 'http';
import { convert } from './convert';
import { join } from 'path';

const PORT = process.env.PORT || 4000;

const server = createServer(async (req, res) => {
  const stream = await convert(
    join(__dirname, 'data', 'data.csv'),
    join(__dirname, 'data', 'final.json'), 
  );

  res.writeHead(200, {
    'Content-Type': 'application/json',
  });

  stream.pipe(res);
});

server.listen(PORT, () => console.log(`running on port ${PORT}`));
