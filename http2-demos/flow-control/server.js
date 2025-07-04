const http2 = require('http2');
const fs = require('fs');
const path = require('path');

const server = http2.createSecureServer({
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
});

server.on('stream', (stream, headers) => {
  const url = headers[':path'];

  if (url === '/') {
    const filePath = path.join(__dirname, 'public/index.html');
    stream.respond({ 'content-type': 'text/html', ':status': 200 });
    fs.createReadStream(filePath).pipe(stream);
  } else if (url === '/data') {
    console.log('📡 Client requested /data');
    stream.respond({ 'content-type': 'application/octet-stream', ':status': 200 });

    const TOTAL = 1024 * 1024 * 50; // 50 MB
    let sent = 0;

    const sendChunk = () => {
      while (sent < TOTAL) {
        const chunk = Buffer.alloc(32 * 1024, 'x'); // 32KB
        const ok = stream.write(chunk);
        sent += chunk.length;

        if (!ok) {
          console.log('🛑 Flow control: paused writing at', Math.round(sent / 1024 / 1024), 'MB');
          stream.once('drain', () => {
            console.log('✅ Flow control: resumed writing');
            sendChunk();
          });
          return;
        }
      }

      stream.end();
      console.log('✅ Finished sending 50MB');
    };

    sendChunk();
  } else {
    stream.respond({ ':status': 404 });
    stream.end('Not found');
  }
});

server.listen(8443, () => {
  console.log('🔒 HTTPS/2 server running at https://localhost:8443');
});
