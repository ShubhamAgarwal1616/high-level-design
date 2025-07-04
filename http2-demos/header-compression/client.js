const http2 = require('http2');
const fs = require('fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('./cert/cert.pem'), // Trust self-signed cert
});

client.on('error', (err) => console.error('❌ Client error:', err));

function sendRequest(index) {
  return new Promise((resolve, reject) => {
    const req = client.request({
      ':method': 'GET',
      ':path': '/headers'
    });

    let body = '';

    req.on('response', (headers) => {
      console.log(`\n📦 Response #${index}`);
      for (const name in headers) {
        if (!name.startsWith(':')) {
          console.log(`${name}: ${headers[name]}`);
        }
      }
    });

    req.setEncoding('utf8');

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      console.log(`✅ Response body: ${body}`);
      resolve();
    });

    req.on('error', reject);

    req.end();
  });
}

async function main() {
  for (let i = 1; i <= 10; i++) {
    await sendRequest(i);
  }

  client.close();
}

main().catch(console.error);
