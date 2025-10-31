// Shim to allow running `node server.js` from the backend root
// The real entry is at ./src/server.js (as defined in package.json)
require("./src/server.js");
