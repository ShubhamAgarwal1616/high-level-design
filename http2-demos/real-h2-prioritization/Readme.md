# 🌐 Real-World HTTP/2 Prioritization Demo using nghttp2


# Start HTTP/2 Server
Generate a self-signed cert:

`openssl req -new -x509 -days 365 -nodes \
-out server.crt -keyout server.key \
-subj "/CN=localhost"
`

run `h2o -c h2o.conf`


# Test Prioritization with CLI
nghttp -nv https://localhost:8443/big1.bin --weight=2 https://localhost:8443/big2.bin --weight=256




# Key things in your log

### Weights are deprecated

[WARNING]: --weight option has been deprecated.


That’s because newer nghttp2 (≥1.66) follows the new HTTP/2 prioritization model
.
Instead of sending explicit PRIORITY frames with weight, it now uses the priority header (u=3, urgency level) and sometimes i=? (incremental).

Example from your log:

priority: u=3


That’s the new structured field, not the old weight.

### Your H2O version is old (2.2.6)

recv (stream_id=1) server: h2o/2.2.6


This predates the “new priority scheme” and only understands RFC7540 PRIORITY frames.
Result: your nghttp is talking “urgency/priority header” but H2O is just ignoring it, so both streams get equal scheduling. That’s why you see frames arriving evenly:

recv DATA frame ... stream_id=1
recv DATA frame ... stream_id=3
recv DATA frame ... stream_id=1
recv DATA frame ... stream_id=3


→ Round-robin, not weighted.

Negotiated SETTINGS_NO_RFC7540_PRIORITIES=1

send SETTINGS frame ... [SETTINGS_NO_RFC7540_PRIORITIES(0x09):1]


That means nghttp told the server: I don’t support the old RFC7540 tree-based prioritization.
So H2O never even tries to build a weight tree.


# How to actually demo prioritization

You have two paths:

### Option A: Stay with H2O 2.2.6 (old server)

Build an older nghttp2 client (<1.41) that still supports --weight and real PRIORITY frames.

Then you’ll see uneven delivery (big1.bin drains much faster than big2.bin).

### Option B: Upgrade H2O

Latest H2O (≥2.3.0) understands the new priority header (u=?, i=?).

With your nghttp2/1.66, you can run:

nghttp -nv https://localhost:8443/big1.bin --urgency=0 \
https://localhost:8443/big2.bin --urgency=7


→ urgency 0 = highest priority, 7 = lowest.

H2O ≥2.3.0 will honor that and you’ll see the high-urgency stream fill first.


# logs explaination 

### 1. Data frames arriving from server
   [  0.055] recv DATA frame <length=16384, flags=0x00, stream_id=1>
   [  0.055] recv DATA frame <length=16384, flags=0x00, stream_id=3>


DATA frame → carries application payload (your big1.bin, big2.bin).

length=16384 → that’s exactly the maximum frame size (16 KB is default).

stream_id=1 and stream_id=3 → two different HTTP/2 requests being multiplexed.

Arrival alternates → server is sending them in round-robin, since no prioritization is being honored.

### 2. Slight variation in frame length
   recv DATA frame <length=16383, flags=0x00, stream_id=3>


Sometimes the last chunk is not a full 16384, because the file size isn’t a perfect multiple of 16 KB.

Nothing special here — just leftover bytes.

### 3. Window updates
   send WINDOW_UPDATE frame <length=4, flags=0x00, stream_id=0>
   (window_size_increment=32768)

   send WINDOW_UPDATE frame <length=4, flags=0x00, stream_id=1>
   (window_size_increment=32768)

   send WINDOW_UPDATE frame <length=4, flags=0x00, stream_id=3>
   (window_size_increment=32767)


- This is the flow control mechanism of HTTP/2:

- Every stream and the overall connection has a flow-control window (how many bytes may be in flight).

- When nghttp consumes data, it sends a WINDOW_UPDATE telling the server: “You may now send me N more bytes on this stream”.

- Here, window_size_increment=32768 means: “open up another 32 KB of window”.

- stream_id=0 → connection-level window (applies to all streams).

- stream_id=1 → stream-level window for request #1.

- stream_id=3 → stream-level window for request #3.

- The slight off-by-one (32767) is just how the math worked out in the buffer accounting.

### 4. Repetition
   recv DATA frame ... stream_id=1
   recv DATA frame ... stream_id=3
   ...
   send WINDOW_UPDATE ...


This cycle repeats:

- Server sends DATA (16 KB chunks) for both streams.

- Client acknowledges consumption by incrementing the windows.

- Because there’s no prioritization, the server keeps alternating evenly between the streams.

### 🧩 What this tells us

- Your server is respecting flow control (won’t flood data without window updates).

- Frames are interleaved at 16 KB boundaries → classic HTTP/2 multiplexing.

- Both streams are given equal treatment → confirms prioritization isn’t in effect (as suspected earlier).