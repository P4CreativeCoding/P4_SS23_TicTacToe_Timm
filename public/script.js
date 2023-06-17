// Verbindung zum Server herstellen
const socket = io();

// Spieler-Informationen
let playerType; // Spieler X oder O
let playerMessage;
let isCurrentPlayer = false; // Gibt an, ob der aktuelle Spieler am Zug ist

// Funktion, die aufgerufen wird, wenn ein Spieler einen Zug macht
function makeMove(cellIndex) {
  // Nur wenn der aktuelle Spieler am Zug ist
  if (isCurrentPlayer) {
    // Zug an den Server senden
    socket.emit("makeMove", { cellIndex, playerType });
  }
}

// Funktion zum Zurücksetzen des Spielfelds
function resetBoard() {
  // Zurücksetzen an den Server senden
  socket.emit("resetBoard");
}

// Servernachrichten empfangen
socket.on("gameState", function (gameState) {
  // Spielzustand aktualisieren
  board = gameState.board;
  currentPlayer = gameState.currentPlayer;
  gameActive = gameState.gameActive;
  winningMessage = gameState.winningMessage;

  // Spielbrett aktualisieren
  let cells = document.getElementById("board").children;
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = board[i];
  }

  // Nachrichten aktualisieren
  document.getElementById("message").innerText = winningMessage;
  document.getElementById("player-message").innerText = playerMessage;

  // Überprüfen, ob der aktuelle Spieler am Zug ist
  isCurrentPlayer = currentPlayer === playerType;

  // Text für den Zugstatus aktualisieren
  if (gameActive) {
    if (isCurrentPlayer) {
      document.getElementById("turn-status").innerText = "Du bist am Zug";
    } else {
      document.getElementById("turn-status").innerText =
        "Warte auf den anderen Spieler";
    }
  } else {
    document.getElementById("turn-status").innerText = "Das Spiel ist beendet";
  }
});

// Spielerinformationen empfangen
socket.on("playerInfo", function (info) {
  playerType = info.playerType;
  playerMessage = info.playerMessage;
  document.getElementById("message").innerText = playerMessage;
});

// Spielname empfangen
socket.on("gameName", function (name) {
  gameName = name;
});

// Client disconnected
socket.on("disconnect", function () {
  console.log("Verbindung zum Server getrennt.");
  // Weitere Aktionen bei Server Disconnect
});
