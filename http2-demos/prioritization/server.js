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
  const priority = parseInt(parsed.query.priority) || 0;

  if (pathname === '/') {
    stream.respond({ 'content-type': 'text/html', ':status': 200 });
    stream.end(fs.readFileSync('./public/index.html'));
  } else if (pathname === '/resource') {
    // Simulate priority-based delay: lower priority = longer wait
    const delay = (3 - priority) * 1000; // Higher priority gets faster

    stream.respond({ 'content-type': 'application/json', ':status': 200 });
    setTimeout(() => {
      stream.end(JSON.stringify({
        priority,
        delay,
        message: `Resource with priority ${priority} served after ${delay}ms`
      }));
    }, delay);
  } else {
    stream.respond({ ':status': 404 });
    stream.end('Not found');
  }
});

server.listen(8443, () => {
  console.log('🚀 HTTP/2 server with prioritization logic running at https://localhost:8443');
});
