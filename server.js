const http = require("http");
const fs = require("fs");
const path = require("path");

const rawPort = process.env.PORT;
const port = Number(rawPort);

if (!rawPort || !Number.isInteger(port) || port <= 0 || port > 65535) {
  console.error("PORT environment variable must be set to a valid TCP port.");
  process.exit(1);
}

const host = "0.0.0.0";
const indexPath = path.join(__dirname, "index.html");

const server = http.createServer((req, res) => {
  const url = new URL(
    req.url,
    `http://${req.headers.host || "localhost"}`
  );

  if (url.pathname === "/healthz") {
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    });

    res.end("ok");
    return;
  }

  if (url.pathname !== "/" && url.pathname !== "/index.html") {
    res.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Not found");
    return;
  }

  fs.readFile(indexPath, (err, data) => {
    if (err) {
      console.error("Failed to read index.html:", err);

      res.writeHead(500, {
        "Content-Type": "text/plain; charset=utf-8"
      });

      res.end("Server error");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache"
    });

    res.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`Business IQ listening on http://${host}:${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received; shutting down.`);

  server.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
