import http from "node:http";
import {handleRequest} from "./handler.js";

const PORT = 8080;

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Gateway listening on http://localhost:${PORT}`);
});
