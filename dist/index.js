"use strict";

var _http = require("http");

var _convert = require("./convert");

var _path = require("path");

const PORT = process.env.PORT || 4000;
const server = (0, _http.createServer)(async (req, res) => {
  const {
    stream,
    contentLength
  } = await (0, _convert.convert)((0, _path.join)(__dirname, 'data', 'data.csv.old2'));
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': contentLength
  });
  stream.pipe(res);
});
server.listen(PORT, () => console.log(`running on port ${PORT}`));