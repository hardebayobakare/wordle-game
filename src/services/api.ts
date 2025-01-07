const API_BASE_URL = 'https://imcgcspjleeptj7jgk3qjyzw440golgu.lambda-url.us-east-2.on.aws';

export interface WordResponse {
  success: boolean;
  data: {
    word: string;
    expires_at: string;
  };
}

export interface ValidationResponse {
  success: boolean;
  data: {
    valid: boolean;
  };
}

export interface GuessResponse {
  success: boolean;
  data: {
    result: number[];
  };
}

export interface GameStats {
  games_played: number;
  wins: number;
  current_streak: number;
  today_played: number;
  max_streak: number;
  average_attempts: number;
}

export interface StatsResponse {
  success: boolean;
  data: GameStats;
}

class ApiService {
  private userId: string;

  constructor() {
    this.userId = localStorage.getItem('userId') || this.generateUserId();
  }

  private generateUserId(): string {
    const userId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('userId', userId);
    return userId;
  }

  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentWord(): Promise<WordResponse> {
    return this.fetchApi<WordResponse>('word');
  }

  async validateWord(guess: string): Promise<ValidationResponse> {
    return this.fetchApi<ValidationResponse>('validate', {
      method: 'POST',
      body: JSON.stringify({ guess }),
    });
  }

  async submitGuess(guess: string, solution: string): Promise<GuessResponse> {
    return this.fetchApi<GuessResponse>('guess', {
      method: 'POST',
      body: JSON.stringify({ guess, solution }),
    });
  }

  async getStats(): Promise<StatsResponse> {
    return this.fetchApi<StatsResponse>(`stats?userId=${this.userId}`);
  }

  async recordGame(wordId: number, attempts: number, isWon: boolean): Promise<{ success: boolean }> {
    return this.fetchApi('record-game', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        wordId,
        attempts,
        isWon,
      }),
    });
  }
}

export const apiService = new ApiService();
