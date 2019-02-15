class KnightTour {
  constructor(boardSize, firsMove) {
    this.boardSize = boardSize;
    this.firsMove = firsMove;
  }

  start() {
    const parallelFunction = new ParallelFunction((boardSize, firsMove) => {
      const visited = 1, notVisited = 0, possibleMovesCount = Math.pow(boardSize, 2);
      const board = Array(boardSize || 8).fill([]).map(
        () => Array(boardSize).fill(notVisited)
      );
      const moves = [], firstMove = firsMove || [0, 0];
      let removedMoves = [], triesCount = 0;

      moves.push(firstMove);
      board[firstMove[0]][firstMove[1]] = visited;

      function getPossibleMoves(board, position) {
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

      function isMoveAllowed(board, move) {
        return board[move[0]][move[1]] !== visited;
      }

      function calcCost(board, move) {
        return getPossibleMoves(board, move).length;
      }

      function lessCostMoves(board, possibleMoves) {
        return possibleMoves.sort((moveA, moveB) => {
          const costA = calcCost(board, moveA), costB = calcCost(board, moveB);
          if (costA < costB) {
            return -1;
          }
          if (costA > costB) {
            return 1;
          }
          return 0;
        });
      }

      function isBoardCompletelyVisited(board, moves) {
        return possibleMovesCount === moves.length;
      }

      function knightTourRecursive(currentBoard, moves) {
        const board = currentBoard;

        if (isBoardCompletelyVisited(board, moves)) {
          return true;
        }

        const lastMove = moves[moves.length - 1];
        const possibleMoves = getPossibleMoves(board, lastMove);
        const listOfLessCostMoves = lessCostMoves(board, possibleMoves);

        for (let i = 0; i < listOfLessCostMoves.length; i++) {
          const currentMove = listOfLessCostMoves[i];
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

      const solutionWasFound = knightTourRecursive(board, moves);
      return { solutionWasFound, moves, board, triesCount };
    });

    return parallelFunction(this.boardSize, this.firsMove);
  }
}
