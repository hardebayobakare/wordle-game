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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameOver, gameStarted]);

  const startGame = () => {
    setShowInstructions(false);
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <Modal
        isOpen={true}
        onClose={startGame}
        type="instructions"
        title="How to Play"
        darkMode={darkMode}
      />
    );
  }

  if (isLoading) {
    return (
      <Container darkMode={darkMode}>
        <Header darkMode={darkMode}>
          <Title darkMode={darkMode}>WORDLE</Title>
        </Header>
        <GameContainer>
          <div>Loading...</div>
        </GameContainer>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container darkMode={darkMode}>
        <Header darkMode={darkMode}>
          <HeaderSection>
            <IconButton
              darkMode={darkMode}
              onClick={() => setShowInstructions(true)}
              aria-label="Help"
            >
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path
                  fill="currentColor"
                  d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
                ></path>
              </svg> */}
              {darkMode ? (
                <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.87868 4.87868C3 5.75736 3 7.17157 3 10V22C3 24.8284 3 26.2426 3.87868 27.1213C4.75736 28 6.17157 28 9 28H27C29.8284 28 31.2426 28 32.1213 27.1213C33 26.2426 33 24.8284 33 22V10C33 7.17157 33 5.75736 32.1213 4.87868C31.2426 4 29.8284 4 27 4H9C6.17157 4 4.75736 4 3.87868 4.87868Z"
                    fill="white"
                  />
                  <path d="M24 11C24.5523 11 25 11.4477 25 12V22.6667C25 23.219 24.5523 23.6667 24 23.6667C23.4477 23.6667 23 23.219 23 22.6667V12C23 11.4477 23.4477 11 24 11Z" fill="white" />
                  <path d="M13 14.6667C13 14.1144 12.5523 13.6667 12 13.6667C11.4477 13.6667 11 14.1144 11 14.6667V22.6667C11 23.219 11.4477 23.6667 12 23.6667C12.5523 23.6667 13 23.219 13 22.6667V14.6667Z" fill="white" />
                  <path d="M19 17.3333C19 16.781 18.5523 16.3333 18 16.3333C17.4477 16.3333 17 16.781 17 17.3333V22.6667C17 23.219 17.4477 23.6667 18 23.6667C18.5523 23.6667 19 23.219 19 22.6667V17.3333Z" fill="white" />
                </svg>
              ) : (
                <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4.93549" y="6" width="29.6129" height="24" rx="2" fill="black" fillOpacity="0.49" />
                  <path d="M13.1613 15L13.1613 24" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19.7419 18V24" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M26.3226 12V24" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </IconButton>
          </HeaderSection>
          <HeaderSection>
            <Title darkMode={darkMode}>WORDLE</Title>
          </HeaderSection>
          <HeaderSection>
            <ThemeSwitch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </HeaderSection>
        </Header>

        <GameContainer>
          <Board
            guesses={guesses}
            currentGuess={currentGuess}
            solution={solution}
            darkMode={darkMode}
          />

          <Keyboard
            onKeyPress={onKeyPress}
            letterStatuses={letterStatuses}
            darkMode={darkMode}
          />
        </GameContainer>

        <Modal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          type="instructions"
          title="How to Play"
          darkMode={darkMode}
        />

        <Modal
          isOpen={showStats}
          onClose={() => setShowStats(false)}
          type="statistics"
          title="Statistics"
          stats={stats}
          darkMode={darkMode}
        />

        <ResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          stats={{
            played: stats.gamesPlayed,
            victories: stats.wins,
          }}
          correctWord={
            gameOver && currentGuess.toUpperCase() !== solution
              ? solution
              : undefined
          }
          darkMode={darkMode}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
