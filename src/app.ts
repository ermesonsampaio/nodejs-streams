import express, { json, urlencoded } from 'express';
import { join } from 'path';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

export default app;
