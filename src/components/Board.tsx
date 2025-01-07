import React from 'react';
import styled from '@emotion/styled';

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin: 10px 0;
  flex: 1;
`;

const Row = styled.div`
  display: flex;
  gap: 5px;
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
    // Using rgba for transparency
    return darkMode ? 'rgba(147, 155, 159, 0.2)' : 'rgba(147, 155, 159, 0.3)';
  }};
  color: ${({ darkMode }) => darkMode ? '#ffffff' : '#1a1a1b'};
`;

interface BoardProps {
  guesses: string[];
  currentGuess: string;
  solution: string;
  darkMode: boolean;
}

const Board: React.FC<BoardProps> = ({ guesses, currentGuess, solution, darkMode }) => {
  // Calculate remaining empty rows (should never be negative)
  const remainingRows = Math.max(0, 6 - (guesses.length + (guesses.length < 6 ? 1 : 0)));
  const currentGuessArray = currentGuess.split('');
  const emptyCells = Array(5 - currentGuessArray.length).fill('');

  function getStatus(letter: string, index: number, guess: string): 'correct' | 'present' | 'absent' | undefined {
    // if (!letter) return undefined;
    if (guess[index] === solution[index]) return 'correct';
    if (solution.includes(guess[index])) return 'present';
    return 'absent';
  }

  return (
    <BoardContainer>
      {guesses.map((guess, i) => (
        <Row key={i}>
          {guess.split('').map((letter, j) => (
            <Cell key={j} status={getStatus(letter, j, guess)} darkMode={darkMode}>
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
          {emptyCells.map((_, i) => (
            <Cell key={i} darkMode={darkMode} />
          ))}
        </Row>
      )}
      {Array(remainingRows).fill('').map((_, i) => (
        <Row key={i}>
          {Array(5).fill('').map((_, j) => (
            <Cell key={j} darkMode={darkMode} />
          ))}
        </Row>
      ))}
    </BoardContainer>
  );
};

export default Board;
