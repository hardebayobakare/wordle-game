import { useState, useEffect, useCallback } from 'react';
import { validateWord } from '../services/wordService';

export type LetterState = 'correct' | 'present' | 'absent' | 'unused';
export type GameStatus = 'playing' | 'won' | 'lost';

interface GameStats {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedTs: number;
}

interface GameState {
  guesses: string[];
  currentGuess: string;
  letterStates: { [key: string]: LetterState };
  gameStatus: GameStatus;
  targetWord: string;
  message: string;
  stats: GameStats;
}

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

const INITIAL_STATS: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastPlayedTs: 0,
};

export const useWordle = (initialWord: string) => {
  const [state, setState] = useState<GameState>({
    guesses: [],
    currentGuess: '',
    letterStates: {},
    gameStatus: 'playing',
    message: '',
    targetWord: initialWord.toLowerCase(),
    stats: JSON.parse(localStorage.getItem('gameStats') || JSON.stringify(INITIAL_STATS)),
  });

  const updateStats = useCallback((won: boolean) => {
    setState(prevState => {
      const newStats = {
        ...prevState.stats,
        gamesPlayed: prevState.stats.gamesPlayed + 1,
        lastPlayedTs: Date.now(),
      };

      if (won) {
        newStats.wins = prevState.stats.wins + 1;
        newStats.currentStreak = prevState.stats.currentStreak + 1;
        newStats.maxStreak = Math.max(newStats.currentStreak, prevState.stats.maxStreak);
      } else {
        newStats.currentStreak = 0;
      }

      localStorage.setItem('gameStats', JSON.stringify(newStats));
      return { ...prevState, stats: newStats };
    });
  }, []);

  const updateLetterStates = useCallback((guess: string) => {
    setState(prevState => {
      const newLetterStates = { ...prevState.letterStates };
      const targetLetters = prevState.targetWord.split('');
      const remainingTargetLetters = [...targetLetters];

      // First pass: mark correct letters
      guess.split('').forEach((letter, i) => {
        if (letter === targetLetters[i]) {
          newLetterStates[letter] = 'correct';
          remainingTargetLetters[i] = '';
        }
      });

      // Second pass: mark present/absent letters
      guess.split('').forEach((letter, i) => {
        if (letter !== targetLetters[i]) {
          const index = remainingTargetLetters.indexOf(letter);
          if (index !== -1) {
            newLetterStates[letter] = 'present';
            remainingTargetLetters[index] = '';
          } else if (!newLetterStates[letter]) {
            newLetterStates[letter] = 'absent';
          }
        }
      });

      return { ...prevState, letterStates: newLetterStates };
    });
  }, []);

  const submitGuess = useCallback(async () => {
    setState(prevState => {
      if (prevState.gameStatus !== 'playing') {
        return prevState;
      }

      if (prevState.currentGuess.length !== WORD_LENGTH) {
        return { ...prevState, message: 'Word must be 5 letters long' };
      }

      const guess = prevState.currentGuess.toLowerCase();
      
      // Validate word
      validateWord(guess).then(isValid => {
        if (!isValid) {
          setState(prev => ({ ...prev, message: 'Not a valid word' }));
          return;
        }

        setState(prev => {
          const newGuesses = [...prev.guesses, guess];
          let newStatus = prev.gameStatus;
          
          // Check win condition
          if (guess === prev.targetWord) {
            newStatus = 'won';
            updateStats(true);
          }
          // Check loss condition
          else if (newGuesses.length >= MAX_ATTEMPTS) {
            newStatus = 'lost';
            updateStats(false);
          }

          return {
            ...prev,
            guesses: newGuesses,
            currentGuess: '',
            gameStatus: newStatus,
            message: newStatus === 'won' ? 'Congratulations!' : 
                    newStatus === 'lost' ? `The word was ${prev.targetWord.toUpperCase()}` : '',
          };
        });

        updateLetterStates(guess);
      });

      return prevState;
    });
  }, [updateLetterStates, updateStats]);

  const addLetter = useCallback((letter: string) => {
    setState(prevState => {
      if (prevState.gameStatus !== 'playing' || prevState.currentGuess.length >= WORD_LENGTH) {
        return prevState;
      }
      return { ...prevState, currentGuess: prevState.currentGuess + letter.toLowerCase() };
    });
  }, []);

  const removeLetter = useCallback(() => {
    setState(prevState => {
      if (prevState.gameStatus !== 'playing' || prevState.currentGuess.length === 0) {
        return prevState;
      }
      return { ...prevState, currentGuess: prevState.currentGuess.slice(0, -1) };
    });
  }, []);

  const resetGame = useCallback((newWord: string) => {
    setState({
      guesses: [],
      currentGuess: '',
      letterStates: {},
      gameStatus: 'playing',
      message: '',
      targetWord: newWord.toLowerCase(),
      stats: JSON.parse(localStorage.getItem('gameStats') || JSON.stringify(INITIAL_STATS)),
    });
  }, []);

  return {
    guesses: state.guesses,
    currentGuess: state.currentGuess,
    letterStates: state.letterStates,
    gameStatus: state.gameStatus,
    message: state.message,
    stats: state.stats,
    actions: {
      addLetter,
      removeLetter,
      submitGuess,
      resetGame,
    },
  };
};
