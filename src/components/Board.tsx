import React from 'react';
import styled, { keyframes } from '@emotion/styled';

const shake = keyframes`
  10%, 90% {
    transform: translateX(-1px);
  }
  20%, 80% {
    transform: translateX(2px);
  }
  30%, 50%, 70% {
    transform: translateX(-4px);
  }
  40%, 60% {
    transform: translateX(4px);
  }
`;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin: 10px 0;
  flex: 1;
`;

const Row = styled.div<{ invalid?: boolean }>`
  display: flex;
  gap: 5px;
  animation: ${({ invalid }) => invalid ? `${shake} 0.5s` : 'none'};
`;

const Cell = styled.div<{ status?: 'correct' | 'present' | 'absent'; darkMode?: boolean }>`
  width: 52px;
  height: 52px;
  border: 2px solid ${({ status, darkMode }) => {
    if (status) return 'transparent';
    return darkMode ? '#3a3a3c' : '#d3d6da';
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${({ status, darkMode }) => {
    if (status) {
      switch (status) {
        case 'correct':
          return '#6aaa64';
        case 'present':
          return '#c9b458';
        case 'absent':
          return '#787c7e';
      }
    }
    return darkMode ? 'rgba(147, 155, 159, 0.2)' : 'rgba(147, 155, 159, 0.3)';
  }};
  color: ${({ darkMode }) => darkMode ? '#ffffff' : '#1a1a1b'};
`;

interface BoardProps {
  guesses: string[];
  currentGuess: string;
  solution: string;
  darkMode?: boolean;
  invalidWord?: boolean;
}

const Board: React.FC<BoardProps> = ({ guesses, currentGuess, solution, darkMode, invalidWord }) => {
  const empties = 6 - (guesses.length + 1);
  const currentGuessArray = currentGuess.split('');
  const remainingCells = Array(5 - currentGuessArray.length).fill('');

  const getStatus = (letter: string, index: number, guess: string) => {
    if (!letter) return undefined;
    if (letter === solution[index]) return 'correct';
    if (solution.includes(letter)) return 'present';
    return 'absent';
  };

  return (
    <BoardContainer>
      {guesses.map((guess, i) => (
        <Row key={i} invalid={invalidWord && i === guesses.length - 1}>
          {guess.split('').map((letter, j) => (
            <Cell
              key={j}
              status={getStatus(letter, j, guess)}
              darkMode={darkMode}
            >
              {letter}
            </Cell>
          ))}
        </Row>
      ))}
      {guesses.length < 6 && (
        <Row>
          {currentGuessArray.map((letter, i) => (
            <Cell key={i} darkMode={darkMode}>{letter}</Cell>
          ))}
          {remainingCells.map((_, i) => (
            <Cell key={i} darkMode={darkMode}></Cell>
          ))}
        </Row>
      )}
      {[...Array(empties)].map((_, i) => (
        <Row key={i}>
          {[...Array(5)].map((_, j) => (
            <Cell key={j} darkMode={darkMode}></Cell>
          ))}
        </Row>
      ))}
    </BoardContainer>
  ); 
};

export default Board;
