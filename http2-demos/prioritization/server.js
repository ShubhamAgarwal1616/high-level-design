const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
});

const streams = []; // active streams {stream, label, weight, sent}

function addStream(stream, label, weight) {
  stream.priority({ weight });
  stream.respond({ ':status': 200, 'content-type': 'text/plain' });

  streams.push({ stream, label, weight, sent: 0 });
}

// shared scheduler: every 100ms, pick a stream based on weight
setInterval(() => {
  if (streams.length === 0) return;

  // expand list based on weight (simple weighted lottery)
  const lottery = [];
  streams.forEach(s => {
    for (let i = 0; i < s.weight; i++) lottery.push(s);
  });

  const s = lottery[Math.floor(Math.random() * lottery.length)];
  if (!s) return;

  if (s.sent < 20) {
    s.stream.write(`${s.label} chunk ${s.sent}\n`);
    s.sent++;
    if (s.sent === 20) {
      s.stream.end(`${s.label} done ✅\n`);
    }
  }
}, 100);

server.on('stream', (stream, headers) => {
  const path = headers[':path'];

  if (path === '/video') {
    addStream(stream, '🎥 Video', 256); // high priority
  } else if (path === '/css') {
    addStream(stream, '🎨 CSS', 100); // medium priority
  } else if (path === '/ads') {
    addStream(stream, '📢 Ads', 1); // low priority
  } else if (path === '/') {
    stream.respond({ ':status': 200, 'content-type': 'text/html' });
    stream.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>HTTP/2 Prioritization Demo</title>
        <style>
          body { font-family: sans-serif; max-width: 600px; margin: auto; }
          .bar { height: 24px; background: lightgray; margin: 10px 0; position: relative; border-radius: 6px; }
          .fill { height: 100%; background: green; width: 0%; text-align: center; color: white; border-radius: 6px; transition: width 0.2s; }
        </style>
      </head>
      <body>
        <h1>HTTP/2 Prioritization Demo</h1>
        <p>Video has <b>high</b> weight, CSS has <b>medium</b>, Ads has <b>low</b>. Watch the progress bars:</p>
        
        <div>Video (high priority)</div>
        <div class="bar"><div id="videoBar" class="fill"></div></div>
        
        <div>CSS (medium priority)</div>
        <div class="bar"><div id="cssBar" class="fill"></div></div>
        
        <div>Ads (low priority)</div>
        <div class="bar"><div id="adsBar" class="fill"></div></div>

        <script>
          function fetchAndTrack(url, barId) {
            fetch(url).then(res => {
              const reader = res.body.getReader();
              let chunks = 0;
              function read() {
                reader.read().then(({done, value}) => {
                  if (done) return;
                  chunks++;
                  const progress = Math.min((chunks / 20) * 100, 100);
                  document.getElementById(barId).style.width = progress + "%";
                  document.getElementById(barId).textContent = Math.floor(progress) + "%";
                  read();
                });
              }
              read();
            });
          }
          fetchAndTrack('/video', 'videoBar');
          fetchAndTrack('/css', 'cssBar');
          fetchAndTrack('/ads', 'adsBar');
        </script>
      </body>
      </html>
    `);
  }
});

server.listen(8443, () => {
  console.log('🚀 HTTP/2 server running at https://localhost:8443');
});