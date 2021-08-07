// @ts-check

const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

const server = http.createServer((req, res) => {
  // Path
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Query string
  const queryStringObject = parsedUrl.query;

  // Method
  const method = req.method.toLocaleUpperCase();

  // Headers
  const headers = req.headers;

  // Payload
  const decoder = new StringDecoder("utf-8");
  let buffer = '';
  req.on('data', (data) => {
      buffer += decoder.write(data);
  })

  // Send Response
  res.end("Hello, World\n");

  // Log
  console.log(`${method} ${trimmedPath}`, queryStringObject, headers);
});

server.listen(3000, () => {
  console.log("The server is listening on port 3000");
});
