import React, { useState } from "react";
import { Box, Text, Grid, Circle, Flex, Heading, Button } from "@chakra-ui/react";

const BOARD_SIZE = 8;

const Index = () => {
  const [board, setBoard] = useState(initBoard());
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  function initBoard() {
    const board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      board[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        board[i][j] = 0;
      }
    }
    board[3][3] = board[4][4] = 1;
    board[3][4] = board[4][3] = 2;
    return board;
  }

  function placePiece(row, col) {
    if (gameOver || board[row][col] !== 0) return;

    const flippedPieces = getFlippedPieces(row, col, currentPlayer, board);
    if (flippedPieces.length === 0) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = currentPlayer;
    flippedPieces.forEach(([r, c]) => (newBoard[r][c] = currentPlayer));
    setBoard(newBoard);

    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    if (hasValidMoves(nextPlayer, newBoard)) {
      setCurrentPlayer(nextPlayer);
    } else if (!hasValidMoves(currentPlayer, newBoard)) {
      // Game over
      setGameOver(true);
      const [blackCount, whiteCount] = countPieces(newBoard);
      const winner = blackCount > whiteCount ? 1 : blackCount < whiteCount ? 2 : 0;
      setWinner(winner);
    }
  }

  function getFlippedPieces(row, col, player, board) {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    const flippedPieces = [];

    directions.forEach(([dx, dy]) => {
      let r = row + dx,
        c = col + dy;
      const toFlip = [];
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === 3 - player) {
        toFlip.push([r, c]);
        r += dx;
        c += dy;
      }
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        flippedPieces.push(...toFlip);
      }
    });

    return flippedPieces;
  }

  function hasValidMoves(player, board) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === 0 && getFlippedPieces(i, j, player, board).length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  function countPieces(board) {
    let blackCount = 0,
      whiteCount = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === 1) blackCount++;
        else if (board[i][j] === 2) whiteCount++;
      }
    }
    return [blackCount, whiteCount];
  }

  function resetGame() {
    setBoard(initBoard());
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
  }

  return (
    <Box p={8}>
      <Heading mb={4}>Othello</Heading>
      <Flex mb={4}>
        <Text mr={4}>Current Player: {currentPlayer === 1 ? "Black" : "White"}</Text>
        <Button onClick={resetGame}>Reset Game</Button>
      </Flex>
      <Grid templateColumns={`repeat(${BOARD_SIZE}, 1fr)`} gap={1} mb={4}>
        {board.map((row, i) =>
          row.map((cell, j) => (
            <Box key={`${i}-${j}`} bg={(i + j) % 2 === 0 ? "green.500" : "yellow.100"} h={12} display="flex" justifyContent="center" alignItems="center" onClick={() => placePiece(i, j)} cursor="pointer">
              {cell !== 0 && <Circle size={10} bg={cell === 1 ? "black" : "white"} />}
            </Box>
          )),
        )}
      </Grid>
      {gameOver && <Text fontSize="xl">{winner === 0 ? "It's a tie!" : `${winner === 1 ? "Black" : "White"} wins!`}</Text>}
    </Box>
  );
};

export default Index;
