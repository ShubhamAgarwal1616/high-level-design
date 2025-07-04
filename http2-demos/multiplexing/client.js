const http2 = require('http2');
const fs = require('fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('./cert/cert.pem')
});

const delays = [3000, 2000, 1000];
const start = Date.now();

function requestStream(i, delay) {
  return new Promise((resolve) => {
    const req = client.request({ ':path': `/api?delay=${delay}` });

    let data = '';
    req.setEncoding('utf8');

    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      const delta = Date.now() - start;
      console.log(`#${i + 1}: ${JSON.parse(data).message} (at ${delta}ms)`);
      resolve();
    });

    req.end();
  });
}

async function main() {
  await Promise.all(delays.map((d, i) => requestStream(i, d)));
  client.close();
  console.log('✅ All done.');
}

main();
