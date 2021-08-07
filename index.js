// @ts-check

const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

const server = http.createServer((req, res) => {
  // Path
  // TODO(Alex): Use non deprecated API
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
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // Chose handler
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer,
    };

    chosenHandler(data, (statusCode, paylaod) => {
      statusCode = typeof statusCode === "number" ? statusCode : 200; // Default to 200
      paylaod = typeof paylaod === "object" ? paylaod : {}; // Default to empy object

      const payloadString = JSON.stringify(paylaod);

      // Send Response
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
});

server.listen(3000, () => {
  console.log("The server is listening on port 3000");
});

const handlers = {};

handlers.sample = (data, callback) => {
  callback(406, { name: "sample handler" });
};

handlers.notFound = (data, callback) => {
  callback(404);
};

const router = {
  sample: handlers.sample,
};
