const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  // Serve the index.html page
  if (pathname === '/') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }

  // Concatenate JS files via /concat endpoint
  else if (pathname === '/concat') {
    const scriptNames = (query.scripts || '').split(',');
    const scriptFolder = path.join(__dirname, 'public', 'scripts');

    let combined = '';
    let remaining = scriptNames.length;

    if (!remaining) {
      res.writeHead(400);
      return res.end('No scripts specified.');
    }

    scriptNames.forEach((script) => {
      const scriptPath = path.join(scriptFolder, script);
      fs.readFile(scriptPath, 'utf8', (err, content) => {
        if (err) {
          res.writeHead(404);
          res.end(`Script not found: ${script}`);
          return;
        }
        combined += `\n// ---- ${script} ----\n` + content;

        if (--remaining === 0) {
          res.writeHead(200, { 'Content-Type': 'application/javascript' });
          res.end(combined);
        }
      });
    });
  }

  // Fallback
  else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Concat server running at http://localhost:${PORT}`);
});
