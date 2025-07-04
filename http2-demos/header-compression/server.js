const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
});

server.on('stream', (stream, headers) => {
  const path = headers[':path'];

  if (path === '/') {
    stream.respond({ 'content-type': 'text/html', ':status': 200 });
    stream.end(fs.readFileSync('./public/index.html'));
  } else if (path === '/headers') {
    const customHeaders = {
      'x-user-id': '12345',
      'x-session-id': 'abcdefg-1234567890',
      'x-feature-flag': 'enabled',
      'x-client-version': '1.0.0',
      ':status': 200,
      'content-type': 'application/json'
    };

    stream.respond(customHeaders);
    stream.end(JSON.stringify({ message: 'Headers sent!' }));
  } else {
    stream.respond({ ':status': 404 });
    stream.end('Not Found');
  }
});

server.listen(8443, () => {
  console.log('🔒 HTTP/2 server listening on https://localhost:8443');
});
