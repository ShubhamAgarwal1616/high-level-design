# 🌐 Real-World HTTP/2 Prioritization Demo using nghttp2

This demo shows how HTTP/2 stream prioritization works in practice using the `nghttp2` toolkit. You'll use:

- ✅ `nghttpd`: HTTP/2-compliant server
- ✅ `nghttp`: CLI client that supports setting stream priority (weight)
- ✅ Chrome DevTools (optional): View automatic browser-assigned stream priorities

---

## 📦 Folder Structure

real-h2-prioritization/
├── public/
│ ├── index.html
│ ├── style.css
│ ├── app.js
│ └── image.jpg

mkdir real-h2-prioritization
cd real-h2-prioritization
mkdir public

echo "<html><head><link rel='stylesheet' href='style.css'><script src='app.js'></script></head><body><img src='image.jpg' /></body></html>" > public/index.html
echo "body { background: lightblue; }" > public/style.css
echo "console.log('App loaded');" > public/app.js
echo "FAKE_IMAGE_CONTENT" > public/image.jpg

# Start HTTP/2 Server
nghttpd -d ./public 8443 --no-tls

Use --tls and pass certs if you want HTTPS:
nghttpd -d ./public 8443 --key=cert/key.pem --cert=cert/cert.pem

# Test Prioritization with CLI
nghttp -nv \
-p stream-weight=32 /style.css \
-p stream-weight=256 /index.html \
-p stream-weight=128 /app.js \
http://localhost:8443
