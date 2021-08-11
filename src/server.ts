import app from './app';
import { convert } from './convert';
import { join } from 'path';

const PORT = process.env.PORT || 4000;

app.get('/', async (req, res) => {
  const stream = await convert(
    join(__dirname, 'data', 'data.csv'),
    join(__dirname, 'data', 'final.json'), 
  );
  
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  
  stream.pipe(res);
})

app.listen(PORT, () => console.log(`running on port ${PORT}`));
