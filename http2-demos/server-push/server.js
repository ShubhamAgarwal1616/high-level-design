const http2 = require('http2');
const fs = require('fs');
const path = require('path');

const server = http2.createSecureServer({
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
});

const push = (stream, file, type) => {
  stream.pushStream({ ':path': file }, (err, pushStream) => {
    if (err) {
      console.error('Push stream error:', err);
      return;
    }

    pushStream.respondWithFile(
      path.join(__dirname, 'public', file),
      { 'content-type': type }
    );
  });
};

server.on('stream', (stream, headers) => {
  const reqPath = headers[':path'];

  if (reqPath === '/' || reqPath === '/index.html') {
    push(stream, '/style.css', 'text/css');
    push(stream, '/app.js', 'application/javascript');

    stream.respondWithFile(
      path.join(__dirname, 'public', 'index.html'),
      { 'content-type': 'text/html' }
    );
  } else {
    const file = path.join(__dirname, 'public', reqPath);
    const ext = path.extname(reqPath);
    const contentType = {
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.html': 'text/html'
    }[ext] || 'text/plain';

    fs.existsSync(file)
      ? stream.respondWithFile(file, { 'content-type': contentType })
      : stream.respond({ ':status': 404 }) && stream.end('Not Found');
  }
});

server.listen(8443, () => {
  console.log('🚀 HTTPS/2 Server running on https://localhost:8443');
});
