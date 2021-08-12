import app from './app';
import { convert } from './convert';
import { join } from 'path';
import routes from './routes';

const PORT = process.env.PORT || 4000;

app.use('/', routes);

app.listen(PORT, () => console.log(`running on port ${PORT}`));
