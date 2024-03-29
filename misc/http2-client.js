// @ts-check

/*
 * Example HTTP2 client
 * Connects to port 6000 and logs the response
 */

// Dependencies
const http2 = require("http2");

// Create client
const client = http2.connect("http://localhost:6000");

// Create a request
const req = client.request({
  ":path": "/",
});

// When message is received, add the pieces of it together until you reach the end
let str = "";
req.on("data", (chunk) => {
  str += chunk;
});

// When a message ends, log it out
req.on("end", () => {
  console.log(str);
});

// End the request
req.end();
