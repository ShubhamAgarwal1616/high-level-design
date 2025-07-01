const net = require('net');

const client = net.createConnection({ port: 3006 }, () => {
  console.log('📡 Connected, sending pipelined requests...\n');

  const requests = [
    'GET /data/one.json HTTP/1.1\r\nHost: localhost\r\nConnection: keep-alive\r\n\r\n',
    'GET /data/two.json HTTP/1.1\r\nHost: localhost\r\nConnection: keep-alive\r\n\r\n',
    'GET /data/three.json HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n',
  ];

  client.write(requests.join(''));
});

client.on('data', (data) => {
  console.log(data.toString());
});

client.on('end', () => {
  console.log('\n🔚 Disconnected from server');
});
