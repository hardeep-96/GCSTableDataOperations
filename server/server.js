const https = require("https");
const app = require("./app");
const fs = require("fs");

const options = {
  key: fs.readFileSync("server/key.pem"),
  cert: fs.readFileSync("server/cert.pem"),
};

const port = process.env.PORT || 3001;

const server = https.createServer(options, app);

server.listen(port);
