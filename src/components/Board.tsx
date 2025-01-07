import React from 'react';
import styled from 'styled-components';
import { Row } from './Row';

const BoardContainer = styled.div<{ darkMode: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const Board = ({
  guesses,
  currentGuess,
  solution,
  darkMode,
  invalidWord,
}: {
  guesses: string[];
  currentGuess: string;
  solution: string;
  darkMode: boolean;
  invalidWord: boolean;
}) => {
  return (
    <BoardContainer darkMode={darkMode}>
      {guesses.map((guess, index) => (
        <Row
          key={index}
          guess={guess}
          solution={solution}
          darkMode={darkMode}
        />
      ))}

      {guesses.length < 6 && (
        <Row
          guess={currentGuess}
          solution={solution}
          darkMode={darkMode}
          isCurrent={true}
          invalidWord={invalidWord}
        />
      )}

      {[...Array(6 - guesses.length - 1)].map((_, i) => (
        <Row key={i} guess="" solution={solution} darkMode={darkMode} />
      ))}
    </BoardContainer>
  );
};

export default Board;
