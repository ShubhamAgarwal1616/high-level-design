const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
});

function sendBigStream(stream, label) {
  stream.respond({ ':status': 200, 'content-type': 'text/plain' });

  let i = 0;
  const interval = setInterval(() => {
    stream.write(`${label} chunk ${i}\n`);
    i++;
    if (i >= 50) { // 50 chunks
      clearInterval(interval);
      stream.end(`${label} done ✅\n`);
    }
  }, 100); // send slowly
}

server.on('stream', (stream, headers) => {
  const path = headers[':path'];

  if (path === '/video') {
    sendBigStream(stream, '🎥 Video');
  } else if (path === '/css') {
    sendBigStream(stream, '🎨 CSS');
  } else if (path === '/ads') {
    sendBigStream(stream, '📢 Ads');
  } else {
    stream.respond({ ':status': 200, 'content-type': 'text/html' });
    stream.end(`
      <h1>HTTP/2 Prioritization Demo</h1>
      <p>Use nghttp client to test stream priorities.</p>
    `);
  }
});

server.listen(8443, () => {
  console.log('🚀 Server running on https://localhost:8443');
});
