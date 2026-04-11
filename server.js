const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const GCS_BASE = 'https://storage.googleapis.com';
const PROXY_PREFIX = '/proxy/';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

function serveStatic(req, res) {
  let filePath = path.join(__dirname, 'website', req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function proxyToGCS(req, res) {
  const gcsPath = req.url.slice(PROXY_PREFIX.length);
  const gcsUrl = `${GCS_BASE}/${gcsPath}`;

  https.get(gcsUrl, (upstream) => {
    res.writeHead(upstream.statusCode, {
      'Content-Type': upstream.headers['content-type'] || 'application/octet-stream',
      'Content-Length': upstream.headers['content-length'] || '',
      'Access-Control-Allow-Origin': '*',
    });
    upstream.pipe(res);
  }).on('error', (err) => {
    res.writeHead(502);
    res.end(`Proxy error: ${err.message}`);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith(PROXY_PREFIX)) {
    proxyToGCS(req, res);
  } else {
    serveStatic(req, res);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`GCS proxy available at http://localhost:${PORT}${PROXY_PREFIX}`);
});
