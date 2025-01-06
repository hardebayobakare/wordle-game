const API_BASE_URL = 'https://wordle-game.us-east-2.elasticbeanstalk.com/api';

interface ApiResponse {
  valid: boolean;
  message?: string;
}

export const validateWord = async (word: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word: word.toUpperCase() }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: ApiResponse = await response.json();
    return data.valid;
  } catch (error) {
    console.error('Error validating word:', error);
    return false;
  }
};

export const getRandomWord = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/word`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.word.toUpperCase();
  } catch (error) {
    console.error('Error fetching random word:', error);
    return 'REACT'; // Fallback word in case of API failure
  }
};
