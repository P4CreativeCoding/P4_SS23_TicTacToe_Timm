const { checkWin, checkDraw, winningCombinations } = require("../server");

// Beispielhafte Unit-Tests für checkWin und checkDraw
describe("Game Logic Tests", () => {
  describe("checkWin", () => {
    it("should return true when a player wins in a horizontal combination", () => {
      const gameState = {
        board: ["X", "X", "X", "0", "", "", "", "0", ""],
        currentPlayer: "X",
        gameActive: true,
        winningMessage: "",
      };
      const result = checkWin(gameState, winningCombinations);
      expect(result).toBe(true);
    });

    it("should return true when a player wins in a vertical combination", () => {
      const gameState = {
        board: ["X", "", "", "X", "", "", "X", "", ""],
        currentPlayer: "X",
        gameActive: true,
        winningMessage: "",
      };
      const result = checkWin(gameState, winningCombinations);
      expect(result).toBe(true);
    });

    it("should return true when a player wins in a diagonal combination", () => {
      const gameState = {
        board: ["X", "", "", "", "X", "", "", "", "X"],
        currentPlayer: "X",
        gameActive: true,
        winningMessage: "",
      };
      const result = checkWin(gameState, winningCombinations);
      expect(result).toBe(true);
    });

    it("should return false when no player has won", () => {
      const gameState = {
        board: ["X", "O", "X", "", "", "", "", "", ""],
        currentPlayer: "X",
        gameActive: true,
        winningMessage: "",
      };
      const result = checkWin(gameState, winningCombinations);
      expect(result).toBe(false);
    });

    it("should return true when a player has won", () => {
      const gameState = {
        board: ["X", "X", "X", "", "", "", "", "", ""],
        currentPlayer: "X",
        gameActive: true,
        winningMessage: "",
      };
      const result = checkWin(gameState, winningCombinations);
      expect(result).toBe(true);
    });
  });

  describe("checkDraw", () => {
    it("should return false when the board still has empty cells", () => {
      const gameState = {
        board: ["X", "O", "X", "", "", "", "", "", ""],
        currentPlayer: "X",
        gameActive: true,
        winningMessage: "",
      };
      const result = checkDraw(gameState.board);
      expect(result).toBe(false);
    });

    it("should return false when the board is filled but a player has won", () => {
      const gameState = {
        board: ["X", "O", "X", "", "", "", "O", "O", "O"],
        currentPlayer: "X",
        gameActive: true,
        winningMessage: "",
      };
      const result = checkDraw(gameState.board);
      expect(result).toBe(false);
    });

    it("should return false when the game is not a draw", () => {
      const gameState = {
        board: ["X", "O", "X", "", "", "", "", "", ""],
        currentPlayer: "X",
        gameActive: true,
        winningMessage: "",
      };
      const result = checkDraw(gameState.board);
      expect(result).toBe(false);
    });
  });
});
