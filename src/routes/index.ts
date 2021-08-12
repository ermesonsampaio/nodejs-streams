import { Router } from 'express';
import { join } from 'path';
import { convert } from '../convert';
import multer from 'multer';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: join(__dirname, '..', 'data') });

const dataPath = join(__dirname, '..', 'data');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/convert', async (req, res) => {
  const { fileName } = req.query;

  const filePath = join(dataPath, String(fileName));
  const finalPath = join(dataPath, `${fileName}.json`);
  
  if(!fileName || !fs.existsSync(filePath)) return res.redirect('/');

  const stream = await convert(filePath, finalPath);

  res.render('convert', { json: stream.read(), fileName });
});

router.post('/upload', upload.single('file'), (req, res) => {
  res.redirect(`/convert?fileName=${req.file?.filename}`);
});

router.get('/download/:fileName', (req, res) => {
  const { fileName } = req.params;

  if(fileName) return res.download(join(dataPath, fileName), 'csvtojson.json');
});

router.get('/delete/:fileName', (req, res) => {
  const { fileName } = req.params;
  const { redirectTo } = req.query;

  fs.rmSync(join(dataPath, fileName));
  fs.rmSync(join(dataPath, `${fileName}.json`));

  return !redirectTo ? res.status(200) : res.redirect(String(redirectTo));
});

export default router;
