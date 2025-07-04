
nghttpd --no-tls -d ./public --push=server_push.txt 8443

# Test in Chrome (or any HTTP/2-enabled browser)
Go to:

bash
Copy
Edit
http://localhost:8443/index.html
Open DevTools → Network tab

Reload and watch for:

style.css and app.js marked as (Push) under Initiator

They load instantly without a network request!