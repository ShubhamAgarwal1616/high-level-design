const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3006;

const server = http.createServer((req, res) => {
  const { url } = req;

  // Delay response for testing pipelining
  const delay = 1000; // 1s delay for demo

  if (url === '/') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, content) => {
      res.writeHead(200, { 'Content-Type': 'text/html', 'Connection': 'keep-alive' });
      res.end(content);
    });
  } else if (url.startsWith('/data/')) {
    const filePath = path.join(__dirname, 'public', url);
    setTimeout(() => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
          });
          res.end(data);
        }
      });
    }, delay);
  } else {
    res.writeHead(404);
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`📡 Pipelining server running at http://localhost:${PORT}`);
});
