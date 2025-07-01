const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3003;

const server = http.createServer((req, res) => {
  const { url } = req;

  // Serve index.html
  if (url === '/') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, content) => {
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=10',
      });
      res.end(content);
    });
  }

  // Serve JS files
  else if (url.startsWith('/file')) {
    const filePath = path.join(__dirname, 'public', url);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(200, {
          'Content-Type': 'application/javascript',
          'Connection': 'keep-alive',
          'Keep-Alive': 'timeout=10',
        });
        res.end(content);
      }
    });
  }

  // Fallback
  else {
    res.writeHead(404);
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Keep-Alive demo running at http://localhost:${PORT}`);
});
