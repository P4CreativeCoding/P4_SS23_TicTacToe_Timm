// Verbindung zum Server herstellen
const socket = io();

// Spieler-Informationen
let playerType; // Spieler X oder O
let playerMessage;

// Funktion, die aufgerufen wird, wenn ein Spieler einen Zug macht
function makeMove(cellIndex) {
  // Zug an den Server senden
  socket.emit("makeMove", { cellIndex, playerType });
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

  // Nachricht aktualisieren
  document.getElementById("message").innerText = winningMessage;
});

// Spielerinformationen empfangen
socket.on("playerInfo", function (info) {
  playerType = info.playerType;
  playerMessage = info.playerMessage;
  document.getElementById("message").innerText = playerMessage;
});
