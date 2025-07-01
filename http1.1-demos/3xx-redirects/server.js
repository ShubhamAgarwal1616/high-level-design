const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const { url, method } = req;

  // Redirection routes
  if (url === '/redirect-301') {
    res.writeHead(301, { Location: '/final' });
    res.end();
  } else if (url === '/redirect-302') {
    res.writeHead(302, { Location: '/final' });
    res.end();
  } else if (url === '/redirect-307') {
    res.writeHead(307, { Location: '/final' });
    res.end();
  } else if (url === '/redirect-308') {
    res.writeHead(308, { Location: '/final' });
    res.end();
  }

  // Final destination
  else if (url === '/final') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>✅ Final Destination</h1><p>Method used: <strong>${method}</strong></p>`);
  }

  // Home page
  else if (url === '/') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  }

  // 404 fallback
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
