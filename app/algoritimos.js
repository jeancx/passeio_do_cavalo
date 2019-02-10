class KnightTour {
  constructor(boardSize, firsMove) {
    this.boardSize = boardSize;
    this.firsMove = firsMove;
  }

  start() {
    const parallelFunction = new ParallelFunction((boardSize, firsMove) => {
      const visited = 1, notVisited = 0, possibleMovesCount = Math.pow(boardSize, 2);
      const chessboard = Array(boardSize || 8).fill([]).map(
        () => Array(boardSize).fill(notVisited)
      );
      const moves = [], firstMove = firsMove || [0, 0];
      let removedMoves = [], triesCount = 0;

      moves.push(firstMove);
      chessboard[firstMove[0]][firstMove[1]] = visited;

      function getPossibleMoves(chessboard, position) {
        const possibleMoves = [
          [position[0] + 1, position[1] - 2],
          [position[0] + 2, position[1] - 1],
          [position[0] + 1, position[1] + 2],
          [position[0] + 2, position[1] + 1],
          [position[0] - 1, position[1] - 2],
          [position[0] - 2, position[1] - 1],
          [position[0] - 2, position[1] + 1],
          [position[0] - 1, position[1] + 2]
        ];

        return possibleMoves.filter((move) => {
          return move[0] >= 0 && move[1] >= 0 && move[0] < boardSize && move[1] < boardSize; //inBoardLimits
        });
      }

      function isMoveAllowed(chessboard, move) {
        return chessboard[move[0]][move[1]] !== visited;
      }

      function movesNearEdge(chessboard, move) {
        const notVisitedHousesFields = chessboard.filter((point) => point === notVisited);
        const avaliableMovesNearEdge = notVisitedHousesFields.filter((point) => point === notVisited);

      }

      function isBoardCompletelyVisited(chessboard, moves) {
        return possibleMovesCount === moves.length;
      }

      function knightTourRecursive(chessboard, moves) {
        const board = chessboard;

        if (isBoardCompletelyVisited(board, moves)) {
          return true;
        }

        const lastMove = moves[moves.length - 1];
        const possibleMoves = getPossibleMoves(board, lastMove);

        for (let i = 0; i < possibleMoves.length; i++) {
          const currentMove = possibleMoves[i];
          triesCount++;

          if (triesCount % 100000000 === 0) {
            console.log('triesCount: ', triesCount.toLocaleString());
          }

          if (isMoveAllowed(board, currentMove)) {
            moves.push(currentMove);
            board[currentMove[0]][currentMove[1]] = visited;

            if (knightTourRecursive(board, moves)) {
              return true;
            }

            moves.pop();
            board[currentMove[0]][currentMove[1]] = notVisited;
          }
        }

        return false;
      }

      const solutionWasFound = knightTourRecursive(chessboard, moves, removedMoves);
      return { solutionWasFound, moves, removedMoves, chessboard, triesCount };
    });

    return parallelFunction(this.boardSize, this.firsMove);
  }
}
