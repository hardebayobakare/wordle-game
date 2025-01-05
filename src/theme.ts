export const theme = {
  colors: {
    background: {
      primary: '#ffffff',
      secondary: '#f6f7f8',
      dark: '#262B3C',
      darkSecondary: '#3a3a3c'
    },
    text: {
      primary: '#1a1a1b',
      secondary: '#787c7e',
      light: '#ffffff'
    },
    border: {
      light: '#d3d6da',
      dark: '#3a3a3c'
    },
    tile: {
      correct: '#6aaa64',
      present: '#c9b458',
      absent: '#787c7e',
      darkCorrect: '#538d4e',
      darkPresent: '#b59f3b',
      darkAbsent: '#3a3a3c'
    }
  }
} as const;

export type Theme = typeof theme;
