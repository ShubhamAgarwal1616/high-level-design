const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3002;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname;

  // Serve index.html
  if (pathname === '/') {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(indexPath, (err, content) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }

  // Serve images with artificial delay
  if (pathname.startsWith('/images/')) {
    const filePath = path.join(__dirname, 'public', pathname);
    const delay = 2000; // 2 seconds per image

    setTimeout(() => {
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(404);
          res.end('Image not found');
        } else {
          res.writeHead(200, { 'Content-Type': 'image/jpeg' });
          res.end(content);
        }
      });
    }, delay);

    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`🚀 Parallel connections demo running at http://localhost:${PORT}`);
});
