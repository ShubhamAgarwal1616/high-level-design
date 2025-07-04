const http2 = require('http2');
const fs = require('fs');

// Allow self-signed certificate for localhost
const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('./cert/cert.pem'),
});

client.on('error', (err) => console.error('❌ Client error:', err));

const req = client.request({ ':path': '/data' });

let total = 0;

req.on('response', (headers, flags) => {
  console.log('📡 Response headers:', headers);
});

req.on('data', (chunk) => {
  total += chunk.length;
  console.log(`📦 Received ${chunk.length} bytes (Total: ${Math.round(total / 1024 / 1024)} MB)`);

  // // Simulate slow reading by delaying read
  // req.pause();
  // setTimeout(() => req.resume(), 10);
});

req.on('end', () => {
  console.log('✅ Stream ended. Total received:', Math.round(total / 1024 / 1024), 'MB');
  client.close();
});

req.end();
