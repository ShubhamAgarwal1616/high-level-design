const http2 = require('http2');
const fs = require('fs');
const url = require('url');

const server = http2.createSecureServer({
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
});

server.on('stream', (stream, headers) => {
  const parsed = url.parse(headers[':path'], true);
  const pathname = parsed.pathname;
  const delay = parseInt(parsed.query.delay) || 1000;

  if (pathname === '/') {
    stream.respond({ 'content-type': 'text/html', ':status': 200 });
    stream.end(fs.readFileSync('./public/index.html'));
  } else if (pathname === '/api') {
    stream.respond({ 'content-type': 'application/json', ':status': 200 });
    setTimeout(() => {
      stream.end(JSON.stringify({ delay, message: `Response after ${delay}ms` }));
    }, delay);
  } else {
    stream.respond({ ':status': 404 });
    stream.end('Not Found');
  }
});

server.listen(8443, () => {
  console.log('🚀 HTTP/2 server running at https://localhost:8443');
});
