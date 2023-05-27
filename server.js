const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Statische Dateien bereitstellen
app.use(express.static(__dirname + "/public"));

// Server starten
const port = 3000;
http.listen(port, function () {
  console.log("Server is listening on port " + port);
});
