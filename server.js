const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");

// Statische Dateien bereitstellen
app.use(express.static(__dirname + "/public"));

// Middleware für das Parsen von Anfragenkörpern
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Spielzustände für verschiedene Spiele
let gameStates = {};

// Gewinnkombinationen
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Serverseitige Logik
io.on("connection", function (socket) {
  // Neuer Client verbunden

  // Funktion zum Überprüfen, ob ein Spieler gewonnen hat
  function checkWin(board) {
    for (let combination of winningCombinations) {
      let [a, b, c] = combination;
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
  }

  // Funktion zum Überprüfen, ob das Spiel unentschieden ist
  function checkDraw(board) {
    return !board.includes("");
  }

  // Spieler einem Spiel hinzufügen oder ein neues Spiel erstellen
  let gameName;
  for (let name in gameStates) {
    if (Object.keys(gameStates[name].players).length < 2) {
      gameName = name;
      break;
    }
  }

  if (!gameName) {
    gameName = `game${Object.keys(gameStates).length + 1}`;
    gameStates[gameName] = {
      board: ["", "", "", "", "", "", "", "", ""],
      currentPlayer: "X",
      gameActive: true,
      winningMessage: "",
      players: {},
    };
  }

  gameStates[gameName].players[socket.id] = { playerType: null };

  socket.join(gameName);

  // Spielerinformationen an den Client senden
  socket.emit("playerInfo", {
    playerType:
      Object.keys(gameStates[gameName].players).length === 1 ? "X" : "O",
    playerMessage: `Du spielst Spieler ${
      Object.keys(gameStates[gameName].players).length === 1 ? "X" : "O"
    }`,
  });

  // Spielname an den Client senden
  socket.emit("gameName", gameName);
  socket.gameName = gameName;

  // Spielzustand an den Client senden
  socket.emit("gameState", gameStates[gameName]);

  // Zug eines Spielers empfangen
  socket.on("makeMove", function (data) {
    const { cellIndex, playerType } = data;

    // Überprüfen, ob das Spiel aktiv ist, das ausgewählte Feld leer ist und der richtige Spieler am Zug ist
    if (
      gameStates[gameName].gameActive &&
      gameStates[gameName].board[cellIndex] === "" &&
      gameStates[gameName].currentPlayer === playerType
    ) {
      // Zug des aktuellen Spielers speichern
      gameStates[gameName].board[cellIndex] = playerType;

      // Gewinner überprüfen
      if (checkWin(gameStates[gameName].board)) {
        gameStates[gameName].gameActive = false;
        gameStates[
          gameName
        ].winningMessage = `Spieler ${playerType} hat gewonnen!`;
      } else if (checkDraw(gameStates[gameName].board)) {
        gameStates[gameName].gameActive = false;
        gameStates[gameName].winningMessage = "Unentschieden!";
      } else {
        // Spieler wechseln
        gameStates[gameName].currentPlayer =
          gameStates[gameName].currentPlayer === "X" ? "O" : "X";
      }

      // Spielzustand an alle Clients im Spiel senden
      io.to(gameName).emit("gameState", gameStates[gameName]);
    }
  });

  // Zurücksetzen des Spielfelds empfangen
  socket.on("resetBoard", function () {
    const gameName = socket.gameName;

    // Spielzustand zurücksetzen
    if (gameStates[gameName]) {
      gameStates[gameName].board = ["", "", "", "", "", "", "", "", ""];
      gameStates[gameName].currentPlayer = "X";
      gameStates[gameName].gameActive = true;
      gameStates[gameName].winningMessage = "";

      // Spielzustand an alle Clients im Spiel senden
      io.to(gameName).emit("gameState", gameStates[gameName]);
    }
  });

  // Client disconnected
  socket.on("disconnect", function () {
    delete gameStates[gameName].players[socket.id];
    if (Object.keys(gameStates[gameName].players).length === 0) {
      delete gameStates[gameName];
    }
  });
});

// Login-Routen
app.post("/login", function (req, res) {
  // Benutzername und Passwort aus dem Anfragekörper erhalten
  const { username, password } = req.body;

  // Überprüfen, ob Benutzername und Passwort korrekt sind
  if (
    username === process.env.VALID_USERNAME &&
    password === process.env.VALID_PASSWORD
  ) {
    // Erfolgreiche Authentifizierung
    res.status(200).json({ message: "Login erfolgreich" });
  } else {
    // Fehlgeschlagene Authentifizierung
    res.status(401).json({ message: "Ungültige Anmeldeinformationen" });
  }
});

// Server starten
const port = 3000;
http.listen(port, function () {
  console.log("Server is listening on port " + port);
});

/*module.exports = {
  checkWin,
  checkDraw,
  winningCombinations: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],
}; */
