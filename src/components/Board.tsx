import React, { useCallback } from "react";
import styled from "@emotion/styled";

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

const Cell = styled.div<{
  status?: "correct" | "present" | "absent" | "";
  darkmode?: boolean;
}>`  
  width: 52px;  
  height: 52px;  
  border: 2px solid  
    ${({ status, darkmode }) =>
    status ? "transparent" : darkmode ? "#3a3a3c" : "#d3d6da"};  
  display: flex;  
  justify-content: center;  
  align-items: center;  
  font-size: 1.8rem;  
  font-weight: bold;  
  text-transform: uppercase;  
  background-color: ${({ status, darkmode }) => {
    if (status) {
      switch (status) {
        case "correct":
          return "#6aaa64";
        case "present":
          return "#c9b458";
        case "absent":
          return "#787c7e";
        default:
          return "transparent";
      }
    }
    // Using rgba for transparency  
    return darkmode ? "rgba(147, 155, 159, 0.2)" : "rgba(147, 155, 159, 0.3)";
  }};  
  color: ${({ darkmode }) => (darkmode ? "#ffffff" : "#1a1a1b")};  
`;

interface BoardProps {
  guesses: string[];
  currentGuess: string;
  solution: string;
  darkmode: boolean;
}

const Board: React.FC<BoardProps> = ({
  guesses,
  currentGuess,
  solution,
  darkmode,
}) => {
  const remainingRows = Math.max(0, 6 - (guesses.length + (currentGuess.length > 0 ? 1 : 0)));

  const getStatus = useCallback(
    (letter: string, index: number): "correct" | "present" | "absent" | "" => {
      if (!letter) return "";
      if (letter === solution[index]) return "correct";
      if (solution.includes(letter)) return "present";
      return "absent";
    },
    [solution]
  );

  return (
    <BoardContainer>
      {guesses.map((guess, i) => (
        <Row key={i}>
          {guess.split("").map((letter, j) => (
            <Cell key={j} status={getStatus(letter, j)} darkmode={darkmode}>
              {letter}
            </Cell>
          ))}
        </Row>
      ))}
      {currentGuess !== "" && (
        <Row>
          {[0, 1, 2, 3, 4].map((i) => (
            <Cell key={i} status={getStatus(currentGuess[i] ? currentGuess[i] : '', i)} darkmode={darkmode}>
              {currentGuess[i] ? currentGuess[i] : ''}
            </Cell>
          ))}
        </Row>
      )}
      {Array(remainingRows)
        .fill("")
        .map((_, i) => (
          <Row key={i}>
            {Array(5)
              .fill("")
              .map((_, j) => (
                <Cell key={j} darkmode={darkmode} />
              ))}
          </Row>
        ))}
    </BoardContainer>
  );
};

export default Board;