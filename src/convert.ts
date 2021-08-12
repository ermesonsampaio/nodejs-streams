import { pipeline as pipe, Transform, Readable } from 'stream';
import { promisify } from 'util';
import { createReadStream, createWriteStream } from 'fs';
import csvtojson from 'csvtojson';

const pipeline = promisify(pipe);

export async function convert(csvFile: string, finalFile: string) {
  const readStream = createReadStream(csvFile);
  const writeStream = createWriteStream(finalFile);

  const json: any[] = [];

  const handleStream = new Transform({
    transform(chunk, encoding, cb) {
      const parsed = JSON.parse(chunk);
      Object.keys(parsed).forEach((key) => {
        parsed[key] = Number(parsed[key]) || parsed[key];
      });

      json.push(parsed);

      return cb(null, JSON.stringify(parsed, null, 2));
    },
  });

  await pipeline(
    readStream,
    csvtojson(),
    handleStream,
    writeStream,
  );

  const jsonFormatted = JSON.stringify(json, null, 2);
  const finalJson = Readable.from(jsonFormatted);

  finalJson.pipe(createWriteStream(finalFile));

  return finalJson;
}
