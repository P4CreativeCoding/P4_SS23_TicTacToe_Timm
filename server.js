const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Statische Dateien bereitstellen
app.use(express.static(__dirname + "/public"));

// Spielzustand
let gameState = {
  board: ["", "", "", "", "", "", "", "", ""],
  currentPlayer: "X",
  gameActive: true,
  winningMessage: "",
};

// Spieler, die verbunden sind
let connectedPlayers = 0;

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

  // Ersten Spieler als X und zweiten Spieler als O zuweisen
  connectedPlayers++;
  let playerType = connectedPlayers === 1 ? "X" : "O";
  let playerMessage = `Du spielst Spieler ${playerType}`;

  // Spielzustand an den Client senden
  socket.emit("gameState", gameState);

  // Spielerinformationen an den Client senden
  socket.emit("playerInfo", { playerType, playerMessage });

  // Zug eines Spielers empfangen
  socket.on("makeMove", function (data) {
    const { cellIndex, playerType } = data;

    // Überprüfen, ob das Spiel aktiv ist, das ausgewählte Feld leer ist und der richtige Spieler am Zug ist
    if (
      gameState.gameActive &&
      gameState.board[cellIndex] === "" &&
      gameState.currentPlayer === playerType
    ) {
      // Zug des aktuellen Spielers speichern
      gameState.board[cellIndex] = gameState.currentPlayer;

      // Gewinner überprüfen
      if (checkWin(gameState.currentPlayer)) {
        gameState.gameActive = false;
        gameState.winningMessage = `Spieler ${gameState.currentPlayer} hat gewonnen!`;
      } else if (checkDraw()) {
        gameState.gameActive = false;
        gameState.winningMessage = "Unentschieden!";
      } else {
        // Spieler wechseln
        gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
      }

      // Spielzustand an alle Clients senden
      io.emit("gameState", gameState);
    }
  });

  // Zurücksetzen des Spielfelds empfangen
  socket.on("resetBoard", function () {
    // Spielzustand zurücksetzen
    gameState.board = ["", "", "", "", "", "", "", "", ""];
    gameState.currentPlayer = "X";
    gameState.gameActive = true;
    gameState.winningMessage = "";

    // Spielzustand an alle Clients senden
    io.emit("gameState", gameState);
  });
});

// Funktion zum Überprüfen, ob ein Spieler gewonnen hat
function checkWin(player) {
  for (let combination of winningCombinations) {
    let [a, b, c] = combination;
    if (
      gameState.board[a] !== "" &&
      gameState.board[a] === gameState.board[b] &&
      gameState.board[a] === gameState.board[c]
    ) {
      return true;
    }
  }
  return false;
}

// Funktion zum Überprüfen, ob das Spiel unentschieden ist
function checkDraw() {
  return !gameState.board.includes("");
}
// Server starten
const port = 3000;
http.listen(port, function () {
  console.log("Server is listening on port " + port);
});
