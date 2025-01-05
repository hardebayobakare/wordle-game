import React from 'react';
import styled from '@emotion/styled';

const ExampleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Tile = styled.div<{ status?: 'correct' | 'present' | 'absent'; darkMode?: boolean }>`
  width: 40px;
  height: 40px;
  border: 2px solid ${({ status, darkMode }) => (status ? 'transparent' : darkMode ? '#3a3a3c' : '#d3d6da')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${({ status, darkMode }) => {
    switch (status) {
      case 'correct':
        return darkMode ? '#538d4e' : '#6aaa64';
      case 'present':
        return darkMode ? '#b59f3b' : '#c9b458';
      case 'absent':
        return darkMode ? '#3a3a3c' : '#787c7e';
      default:
        return darkMode ? '#262B3C' : 'white';
    }
  }};
  color: ${({ status, darkMode }) => (status || darkMode ? 'white' : 'black')};
`;

const TileRow = styled.div`
  display: flex;
  gap: 5px;
  margin: 5px 0;
  justify-content: center;
`;

const Description = styled.p`
  margin: 6px 0 15px 0;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;
  max-width: 250px;
`;

interface ExampleProps {
  word: string;
  position: number;
  status: 'correct' | 'present' | 'absent';
  darkMode?: boolean;
}

const ExampleTile: React.FC<ExampleProps> = ({ word, position, status, darkMode }) => {
  const getDescription = () => {
    switch (status) {
      case 'correct':
        return `The letter ${word[position]} is in the word and in the correct position.`;
      case 'present':
        return `The letter ${word[position]} is in the word but not in the correct position.`;
      case 'absent':
        return `The letter ${word[position]} is not in the word.`;
    }
  };

  return (
    <ExampleContainer>
      <TileRow>
        {word.split('').map((letter, i) => (
          <Tile key={i} status={i === position ? status : undefined} darkMode={darkMode}>
            {letter}
          </Tile>
        ))}
      </TileRow>
      <Description>{getDescription()}</Description>
    </ExampleContainer>
  );
};

export default ExampleTile;
