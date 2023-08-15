// @ts-check

const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");
const path = require("path");
const handlers = require("./handlers");
const helpers = require("./helpers");

const server = {};

/**
 * HTTP
 */
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../https/cert.pem")),
};

/**
 * HTTPS
 */
server.httpsServer = https.createServer(
  server.httpsServerOptions,
  (req, res) => {
    server.unifiedServer(req, res);
  }
);

/**
 * HTTP/HTTPS
 */
server.unifiedServer = (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Query string
  const queryStringObject = parsedUrl.query;

  // Method
  const method = req.method.toLowerCase();

  // Headers
  const headers = req.headers;

  // Payload
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // Chose handler
    const chosenHandler =
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : handlers.notFound;

    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    chosenHandler(data, (statusCode, paylaod) => {
      statusCode = typeof statusCode === "number" ? statusCode : 200; // Default to 200
      paylaod = typeof paylaod === "object" ? paylaod : {}; // Default to empy object

      const payloadString = JSON.stringify(paylaod);

      // Send Response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log
      console.log(`Response: ${statusCode} '${payloadString}'`);
      // console.log("BEGIN RESPONSE ------------------------------");
      // console.log(`${method} '${trimmedPath}'`);
      // console.log(queryStringObject);
      // console.log(headers);
      // console.log(buffer);
      // console.log("END RESPONSE ------------------------------");
    });
  });
};

server.router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  checks: handlers.checks,
};

server.init = () => {
  server.httpServer.listen(config.httpPort, () => {
    console.log(
      `Server listening on port ${config.httpPort} in ${config.envName} mode...`
    );
  });

  server.httpsServer.listen(config.httpsPort, () => {
    console.log(
      `Server listening on port ${config.httpsPort} in ${config.envName} mode...`
    );
  });
};

module.exports = server;