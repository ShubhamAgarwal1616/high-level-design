const http2 = require('http2');
const fs = require('fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('./cert/cert.pem')
});

const priorities = [0, 2, 1]; // Priority 2 is highest, 0 is lowest
const start = Date.now();

function requestWithPriority(i, priority) {
  return new Promise((resolve) => {
    const req = client.request({
      ':path': `/resource?priority=${priority}`
    });

    let body = '';
    req.setEncoding('utf8');

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const delta = Date.now() - start;
      const data = JSON.parse(body);
      console.log(`#${i + 1}: ${data.message} (at ${delta}ms)`);
      resolve();
    });

    req.end();
  });
}

async function main() {
  await Promise.all(priorities.map((p, i) => requestWithPriority(i, p)));
  client.close();
  console.log('✅ All done.');
}

main();
