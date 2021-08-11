"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convert = convert;

var _stream = require("stream");

var _util = require("util");

var _fs = require("fs");

var _csvtojson = _interopRequireDefault(require("csvtojson"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pipeline = (0, _util.promisify)(_stream.pipeline);

async function convert(csvFile, finalFile) {
  const readStream = (0, _fs.createReadStream)(csvFile);
  const writeStream = (0, _fs.createWriteStream)(finalFile);
  const json = [];
  const handleStream = new _stream.Transform({
    transform(chunk, encoding, cb) {
      const parsed = JSON.parse(chunk);
      Object.keys(parsed).forEach(key => {
        parsed[key] = Number(parsed[key]) || parsed[key];
      });
      json.push(parsed);
      return cb(null, JSON.stringify(parsed, null, 2));
    }

  });
  await pipeline(readStream, (0, _csvtojson.default)(), handleStream, writeStream);
  const jsonFormatted = JSON.stringify(json, null, 2);

  const finalJson = _stream.Readable.from(jsonFormatted);

  finalJson.pipe((0, _fs.createWriteStream)(finalFile));
  return finalJson;
}