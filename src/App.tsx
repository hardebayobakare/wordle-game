import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import Modal from "./components/Modal";
import ThemeSwitch from "./components/ThemeSwitch";
import ResultModal from "./components/ResultModal";
import { theme } from "./theme";
import { validateWord, getRandomWord } from "./services/wordService";

const Container = styled.div<{ darkMode: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background-color: ${(props) => (props.darkMode ? "#262B3C" : "white")};
  color: ${(props) => (props.darkMode ? "white" : "black")};
`;

const Header = styled.header<{ darkMode: boolean }>`
  width: 100%;
  padding: 8px 20px;
  border-bottom: 1px solid
    ${(props) => (props.darkMode ? "#3a3a3c" : "#d3d6da")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => (props.darkMode ? "#262B3C" : "#f6f7f8")};
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  &:last-child {
    justify-content: flex-end;
  }
`;

const Title = styled.h1<{ darkMode: boolean }>`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: ${(props) => (props.darkMode ? "white" : "#1a1a1b")};
`;

const IconButton = styled.button<{ darkMode: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: inherit;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const GameContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  height: calc(100vh - 52px);
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  overflow: hidden;
`;

function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [stats, setStats] = useState({ gamesPlayed: 8, wins: 2 });
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const letterStatuses: { [key: string]: "correct" | "present" | "absent" } =
    {};
  guesses.forEach((guess) => {
    guess.split("").forEach((letter, i) => {
      if (letter === solution[i]) {
        letterStatuses[letter.toLowerCase()] = "correct";
      } else if (solution.includes(letter)) {
        if (!letterStatuses[letter.toLowerCase()]) {
          letterStatuses[letter.toLowerCase()] = "present";
        }
      } else {
        if (!letterStatuses[letter.toLowerCase()]) {
          letterStatuses[letter.toLowerCase()] = "absent";
        }
      }
    });
  });

  useEffect(() => {
    const initializeGame = async () => {
      const word = await getRandomWord();
      setSolution(word);
      setIsLoading(false);
    };
    initializeGame();
  }, []);

  const onKeyPress = async (key: string) => {
    if (gameOver) return;

    if (key === "enter") {
      if (currentGuess.length !== 5) return;

      const isValid = await validateWord(currentGuess);
      if (!isValid) {
        // You could add some UI feedback here for invalid words
        return;
      }

      const newGuesses = [...guesses, currentGuess.toUpperCase()];
      setGuesses(newGuesses);
      setCurrentGuess("");

      if (currentGuess.toUpperCase() === solution) {
        setGameOver(true);
        setStats((prev) => ({
          gamesPlayed: prev.gamesPlayed + 1,
          wins: prev.wins + 1,
        }));
      } else if (newGuesses.length === 6) {
        setGameOver(true);
        setStats((prev) => ({
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
        }));
      }
    } else if (key === "backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  useEffect(() => {
    if (gameOver) {
      setShowResult(true);
    }
  }, [gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      if (e.key === "Enter") {
        onKeyPress("enter");
      } else if (e.key === "Backspace") {
        onKeyPress("backspace");
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        onKeyPress(e.key.toLowerCase());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentGuess, gameOver, gameStarted]);

  return (
    <ThemeProvider theme={theme}>
      <Container darkMode={darkMode}>
        <Header darkMode={darkMode}>
          <HeaderSection>
            <Title darkMode={darkMode}>Wordle</Title>
            <ThemeSwitch darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </HeaderSection>
        </Header>
        <GameContainer>
          {showInstructions && !gameStarted && (
            <Modal
              title="Instructions"
              onClose={() => setShowInstructions(false)}
              onStart={() => setGameStarted(true)}
            />
          )}
          {gameStarted && (
            <>
              <Board guesses={guesses} currentGuess={currentGuess} solution={solution} darkMode={darkMode} />
              <Keyboard darkMode={darkMode} onKeyPress={onKeyPress} />
            </>
          )}
        </GameContainer>
        <ResultModal
          show={showResult}
          solution={solution}
          stats={stats}
          onClose={() => setShowResult(false)}
          darkMode={darkMode}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
