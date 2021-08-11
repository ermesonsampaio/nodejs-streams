"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convert = convert;

var _stream = require("stream");

var _util = require("util");

var _fs = require("fs");

var _csvtojson = _interopRequireDefault(require("csvtojson"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pipeline = (0, _util.promisify)(_stream.pipeline);

async function convert(csvFile) {
  const readStream = (0, _fs.createReadStream)(csvFile);
  const json = [];
  const handleStream = new _stream.Transform({
    transform(chunk, encoding, cb) {
      json.push(JSON.parse(chunk));
      console.log(json.length);
      return cb(null, JSON.stringify(json));
    }

  });
  await pipeline(readStream, (0, _csvtojson.default)(), handleStream, (0, _fs.createWriteStream)((0, _path.join)(__dirname, 'data', 'final.json')));
  const finalStream = (0, _fs.createReadStream)((0, _path.join)(__dirname, 'data', 'final.json')),
        chunk = [];
  let contentLength = 0;
  finalStream.on('data', data => chunk.push(data)).on('end', () => contentLength = Buffer.concat(chunk).length);
  return {
    stream: finalStream,
    contentLength
  };
}