# Start HTTP/2 Server
Generate a self-signed cert:

`openssl req -new -x509 -days 365 -nodes \
-out server.crt -keyout server.key \
-subj "/CN=localhost"
`

run `h2o -c h2o.conf`


# Test server push with CLI
nghttp -ans https://localhost:8443/index.html

### http2-push-preload: ON is not enabled in older version og h2o, you have to go to h2o-3 for that

