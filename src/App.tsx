import { useState, useEffect, useCallback } from "react";
import styled, { ThemeProvider } from "styled-components";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import Modal from "./components/Modal";
import ThemeSwitch from "./components/ThemeSwitch";
import ResultModal from "./components/ResultModal";
import { theme } from "./theme";
import { validateWord, getRandomWord } from "./services/wordService";

const Container = styled.div<{ darkmode: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background-color: ${(props) => (props.darkmode ? "#262B3C" : "white")};
  color: ${(props) => (props.darkmode ? "white" : "black")};
`;

const Header = styled.header<{ darkmode: boolean }>`
  width: 100%;
  padding: 8px 20px;
  border-bottom: 1px solid
    ${(props) => (props.darkmode ? "#3a3a3c" : "#d3d6da")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => (props.darkmode ? "#262B3C" : "#f6f7f8")};
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  &:last-child {
    justify-content: flex-end;
  }
`;

const Title = styled.h1<{ darkmode: boolean }>`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: ${(props) => (props.darkmode ? "white" : "#1a1a1b")};
`;

const IconButton = styled.button<{ darkmode: boolean }>`
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
  const [stats, setStats] = useState({ gamesPlayed: 0, wins: 0 });
  const [darkmode, setdarkmode] = useState(false);
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

  const onKeyPress = useCallback(
    async (key: string) => {
      if (gameOver) return;

      if (key === "enter") {
        if (currentGuess.length !== 5) return;
        const isValid = await validateWord(currentGuess);
        const newGuesses = [...guesses, currentGuess.toUpperCase()];

        if (isValid) {
          setGameOver(true);
          setStats((prev) => ({
            ...prev,
            wins: prev.wins + 1,
          }));
        }

        setGuesses(newGuesses);
        setCurrentGuess("");
        setStats((prev) => ({
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
        }));
      }

      if (key === "backspace") {
        setCurrentGuess((prev) => prev.substring(0, prev.length - 1));
      }

      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, gameOver, guesses]
  );

  const handleAccept = () => {
    setShowResult(false);

    setStats({
      gamesPlayed: 0,
      wins: 0,
    });
    setCurrentGuess("");
    setGuesses([]);
    setGameOver(false);
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
  }, [currentGuess, gameOver, gameStarted, onKeyPress]);

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
        darkmode={darkmode}
      />
    );
  }

  if (isLoading) {
    return (
      <Container darkmode={darkmode}>
        <Header darkmode={darkmode}>
          <Title darkmode={darkmode}>WORDLE</Title>
        </Header>
        <GameContainer>
          <div>Loading...</div>
        </GameContainer>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container darkmode={darkmode}>
        <Header darkmode={darkmode}>
          <HeaderSection>
            <IconButton
              darkmode={darkmode}
              onClick={() => setShowInstructions(true)}
              aria-label="Help"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path
                  fill="currentColor"
                  d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
                ></path>
              </svg>
            </IconButton>
          </HeaderSection>
          <HeaderSection>
            <Title darkmode={darkmode}>WORDLE</Title>
          </HeaderSection>
          <HeaderSection>
            <ThemeSwitch
              setShowResult={setShowResult}
              checked={darkmode}
              onChange={() => setdarkmode((prev) => !prev)}
            />
          </HeaderSection>
        </Header>

        <GameContainer>
          <Board
            guesses={guesses}
            currentGuess={currentGuess}
            solution={solution}
            darkmode={darkmode}
          />

          <Keyboard
            onKeyPress={onKeyPress}
            letterStatuses={letterStatuses}
            darkmode={darkmode}
          />
        </GameContainer>

        <Modal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          type="instructions"
          title="How to Play"
          darkmode={darkmode}
        />

        <Modal
          isOpen={showStats}
          onClose={() => setShowStats(false)}
          type="statistics"
          title="Statistics"
          stats={stats}
          darkmode={darkmode}
        />

        <ResultModal
          isOpen={showResult}
          onClose={handleAccept}
          stats={{
            played: stats.gamesPlayed,
            victories: stats.wins,
          }}
          correctWord={
            gameOver && currentGuess.toUpperCase() !== solution
              ? solution
              : undefined
          }
          darkmode={darkmode}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
