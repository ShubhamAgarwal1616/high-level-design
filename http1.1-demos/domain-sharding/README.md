Edit your /etc/hosts file (or C:\Windows\System32\drivers\etc\hosts on Windows) to include:

Copy
Edit
127.0.0.1 shard1.localhost
127.0.0.1 shard2.localhost
127.0.0.1 shard3.localhost


Add entries to your hosts file as mentioned.

Start the server:

bash
Copy
Edit
node server.js
Open: http://localhost:3007

Open DevTools → Network → Enable “Domain” column

🟢 You’ll see:

Requests split across shard1.localhost, shard2.localhost, and shard3.localhost

All images download simultaneously (limited to 6 per domain otherwise)