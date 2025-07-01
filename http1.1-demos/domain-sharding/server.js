const http = require('http');
const fs = require('fs');
const path = require('path');

const serveImage = (req, res) => {
  const imgName = req.url.split('/').pop();
  const filePath = path.join(__dirname, 'images', imgName);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Image Not Found');
    } else {
      setTimeout(() => {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(data);
      }, 2000); // simulate 2s delay
    }
  });
};

// Serve index.html on port 3007
http.createServer((req, res) => {
  if (req.url === '/') {
    const file = path.join(__dirname, 'index.html');
    fs.readFile(file, (err, html) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
}).listen(3007, () => {
  console.log('🌐 Main page: http://localhost:3007');
});

// Sharded servers (serve images from 3 subdomains)
const shards = ['shard1.localhost', 'shard2.localhost', 'shard3.localhost'];
shards.forEach((host, i) => {
  const port = 4001 + i;
  http.createServer(serveImage).listen(port, () => {
    console.log(`🧩 ${host} running at http://${host}:${port}`);
  });
});
