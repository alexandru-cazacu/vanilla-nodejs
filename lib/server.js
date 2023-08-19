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
const util = require("util");
const debug = util.debuglog("server");

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

    chosenHandler(data, (statusCode, payload, contentType) => {
      contentType = typeof contentType === "string" ? contentType : "json";

      statusCode = typeof statusCode === "number" ? statusCode : 200; // Default to 200

      let payloadString = "";
      if (contentType === "json") {
        res.setHeader("Content-Type", "application/json");
        payload = typeof payload === "object" ? payload : {}; // Default to empy object
        payloadString = JSON.stringify(payload);
      }
      if (contentType === "html") {
        res.setHeader("Content-Type", "text/html");
        payloadString = typeof payload === "string" ? payload : ""; // Default to empy string
      }

      // Send Response
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log
      if (statusCode === 200) {
        debug(
          "\x1b[32m%s\x1b[0m",
          method.toUpperCase() + " /" + trimmedPath + " " + statusCode
        );
      } else {
        debug(
          "\x1b[31m%s\x1b[0m",
          method.toUpperCase() + " /" + trimmedPath + " " + statusCode
        );
      }
      // debug("BEGIN RESPONSE ------------------------------");
      // debug(`${method} '${trimmedPath}'`);
      // debug(queryStringObject);
      // debug(headers);
      // debug(buffer);
      // debug("END RESPONSE ------------------------------");
    });
  });
};

server.router = {
  "": handlers.index,
  "account/create": handlers.accountCreate,
  "account/edit": handlers.accountEdit,
  "account/deleted": handlers.accountDeleted,
  "session/create": handlers.sessionCreate,
  "session/deleted": handlers.sessionDeleted,
  "checks/all": handlers.checksList,
  "checks/create": handlers.checksCreate,
  "checks/edit": handlers.checksEdit,
  ping: handlers.ping,
  "api/users": handlers.users,
  "api/tokens": handlers.tokens,
  "api/checks": handlers.checks,
};

server.init = () => {
  server.httpServer.listen(config.httpPort, () => {
    console.log(
      "\x1b[33m%s\x1b[0m",
      `Server listening on port ${config.httpPort} in ${config.envName} mode...`
    );
  });

  server.httpsServer.listen(config.httpsPort, () => {
    console.log(
      "\x1b[33m%s\x1b[0m",
      `Server listening on port ${config.httpsPort} in ${config.envName} mode...`
    );
  });
};

module.exports = server;
