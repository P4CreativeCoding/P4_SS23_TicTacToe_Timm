// Spielzustand
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let winningMessage = "";

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

// Funktion, die aufgerufen wird, wenn ein Spieler einen Zug macht
function makeMove(cellIndex) {
  // Überprüfen, ob das Spiel aktiv ist und das ausgewählte Feld leer ist
  if (gameActive && board[cellIndex] === "") {
    // Zug des aktuellen Spielers speichern
    board[cellIndex] = currentPlayer;
    // Feld aktualisieren
    document.getElementById("board").children[cellIndex].innerText =
      currentPlayer;
    // Gewinner überprüfen
    if (checkWin()) {
      gameActive = false;
      winningMessage = `Spieler ${currentPlayer} hat gewonnen!`;
    } else if (checkDraw()) {
      gameActive = false;
      winningMessage = "Unentschieden!";
    } else {
      // Spieler wechseln
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
    // Nachricht aktualisieren
    document.getElementById("message").innerText = winningMessage;
  }
}

// Funktion zum Überprüfen, ob ein Spieler gewonnen hat
function checkWin() {
  for (let combination of winningCombinations) {
    let [a, b, c] = combination;
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

// Funktion zum Überprüfen, ob das Spiel unentschieden ist
function checkDraw() {
  return !board.includes("");
}

// Funktion zum Zurücksetzen des Spielfelds
function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  winningMessage = "";
  // Felder leeren
  let cells = document.getElementById("board").children;
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
  }
  // Nachricht zurücksetzen
  document.getElementById("message").innerText = "";
}
