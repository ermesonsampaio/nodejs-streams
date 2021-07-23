const express = require('express');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('upload-files');
});

app.post('/upload-file', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (error, fields, files) => {
    const filesUploadeds = fs.readdirSync(path.join(__dirname, 'musics'));
    const alreadyExists = filesUploadeds.filter(name => name === files.file.name);

    if (alreadyExists.length) return res.send('File Already Exists!');
    
    const newPath = path.join(__dirname, 'musics', files.file.name);
    fs.renameSync(files.file.path, newPath);
    return res.redirect('/select-music');
  });
});

app.get('/select-music', (req, res) => {
  let musics = fs.readdirSync(path.join(__dirname, 'musics'));
  musics = musics.filter(e => e.endsWith('.mp3'));

  return res.render('select-music', { musics });
});

app.get('/stream-page/:music', (req, res) => {
  return res.render('stream', req.params);
});

app.get('/stream/:music', (req, res) => {
  const { range } = req.headers
  const musicPath = path.resolve(__dirname, "musics", req.params.music);
  const musicSize = fs.statSync(musicPath).size;

  const start = Number(range.replace(/\D/g, ""));

  const CHUNK_SIZE = 10000;

  const end = Math.min(start + CHUNK_SIZE, musicSize - 1);

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${musicSize}`,
    "Accept-Ranges": "bytes",
    "Content-Type": "audio/mpeg",
  };

  res.writeHead(206, headers);

  const stream = fs.createReadStream(musicPath, { start, end });

  stream.pipe(res);
});

app.listen(3000, () => console.log('server on'));
