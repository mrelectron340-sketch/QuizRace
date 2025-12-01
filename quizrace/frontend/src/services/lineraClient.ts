// Linera Web Client Integration
// This module provides a clean interface to interact with Linera contracts
// For production, replace demo implementations with actual Linera SDK calls

export interface CreateMatchParams {
  questionCount: number;
  category?: string;
}

export interface SubmitAnswerParams {
  matchId: string;
  questionIndex: number;
  answer: string;
}

export type MatchEvent =
  | { type: "ScoreUpdated"; scores: Record<string, number> }
  | { type: "QuestionSettled"; questionIndex: number }
  | { type: "AnswerSubmitted"; player: string; questionIndex: number }
  | { type: "MatchFinalized" };

class LineraClient {
  private connected = false;
  private currentAddress: string | null = null;
  private subscriptions = new Map<string, Set<(event: MatchEvent) => void>>();

  async connectWallet(): Promise<void> {
    try {
      // TODO: Replace with actual Linera wallet integration
      // Example: const wallet = await LineraWallet.connect();
      // this.currentAddress = wallet.address;
      
      // Demo mode
      this.currentAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
      this.connected = true;
      console.log("Wallet connected (demo mode):", this.currentAddress);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  }

  async getCurrentAddress(): Promise<string | null> {
    return this.currentAddress;
  }

  async createMatch(params: CreateMatchParams): Promise<string> {
    try {
      // TODO: Call lobby contract to spawn a match microchain
      // Example:
      // const result = await lineraService.call({
      //   applicationId: LOBBY_APP_ID,
      //   operation: { CreateMatch: { questionCount: params.questionCount } }
      // });
      // return result.matchChainId;

      // Demo mode: generate a realistic-looking match ID
      const matchId = `match-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      console.log("Created match (demo mode):", matchId);
      return matchId;
    } catch (error) {
      console.error("Failed to create match:", error);
      throw error;
    }
  }

  async submitAnswer(params: SubmitAnswerParams): Promise<void> {
    try {
      // Try to connect to Linera GraphQL service if available
      const LINERA_SERVICE_URL = import.meta.env.VITE_LINERA_SERVICE_URL || "http://localhost:9001";
      
      // TODO: Replace with actual Linera SDK calls when available
      // For now, simulate on-chain submission with proper structure
      console.log("📝 Submitting answer on-chain:", {
        matchId: params.matchId,
        questionIndex: params.questionIndex,
        answer: params.answer.substring(0, 50) + "...",
        timestamp: Date.now(),
        chainId: params.matchId,
      });

      // Simulate on-chain transaction with delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Emit AnswerSubmitted event
      this.emitEvent(params.matchId, {
        type: "AnswerSubmitted",
        player: this.currentAddress || "unknown",
        questionIndex: params.questionIndex,
      });

      // Simulate score update after settlement
      setTimeout(() => {
        const currentScores = this.getCachedScores(params.matchId);
        const playerKey = this.currentAddress || "demo";
        const newScore = (currentScores[playerKey] || 0) + 10;
        
        this.emitEvent(params.matchId, {
          type: "ScoreUpdated",
          scores: { ...currentScores, [playerKey]: newScore },
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to submit answer:", error);
      throw error;
    }
  }

  private scoreCache = new Map<string, Record<string, number>>();

  private getCachedScores(matchId: string): Record<string, number> {
    return this.scoreCache.get(matchId) || {};
  }

  private setCachedScores(matchId: string, scores: Record<string, number>) {
    this.scoreCache.set(matchId, scores);
  }

  subscribeToMatch(
    matchId: string,
    callback: (event: MatchEvent) => void
  ): () => void {
    // Try to use GraphQL subscriptions if Linera service is available
    const LINERA_SERVICE_URL = import.meta.env.VITE_LINERA_SERVICE_URL || "http://localhost:9001";
    
    // TODO: Replace with actual GraphQL subscription when Linera SDK is integrated
    // Example GraphQL subscription:
    // const subscription = lineraGraphQL.subscribe({
    //   query: `
    //     subscription MatchEvents($chainId: String!) {
    //       matchEvents(chainId: $chainId) {
    //         type
    //         data
    //       }
    //     }
    //   `,
    //   variables: { chainId: matchId }
    // });
    // subscription.on('data', (data) => callback(data.matchEvents));

    // Demo mode: store callback for manual triggering
    if (!this.subscriptions.has(matchId)) {
      this.subscriptions.set(matchId, new Set());
      
      // Simulate periodic on-chain updates
      const interval = setInterval(() => {
        // Simulate other players' answers
        const randomPlayer = `player-${Math.random().toString(36).slice(2, 10)}`;
        const currentScores = this.getCachedScores(matchId);
        const newScore = (currentScores[randomPlayer] || 0) + Math.floor(Math.random() * 20);
        
        this.emitEvent(matchId, {
          type: "ScoreUpdated",
          scores: { ...currentScores, [randomPlayer]: newScore },
        });
      }, 5000);

      // Store interval for cleanup
      (this as any).intervals = (this as any).intervals || new Map();
      (this as any).intervals.set(matchId, interval);
    }
    this.subscriptions.get(matchId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscriptions.get(matchId);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscriptions.delete(matchId);
          const interval = (this as any).intervals?.get(matchId);
          if (interval) {
            clearInterval(interval);
            (this as any).intervals.delete(matchId);
          }
        }
      }
    };
  }

  private emitEvent(matchId: string, event: MatchEvent) {
    const callbacks = this.subscriptions.get(matchId);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(event);
        } catch (error) {
          console.error("Error in event callback:", error);
        }
      });
    }
    
    // Update score cache if it's a ScoreUpdated event
    if (event.type === "ScoreUpdated") {
      this.setCachedScores(matchId, event.scores);
    }
  }

  async getMatchState(matchId: string) {
    // TODO: Query match contract state
    // Example:
    // return await lineraService.query({
    //   chainId: matchId,
    //   query: { GetState: {} }
    // });

    // Demo mode
    return {
      status: "Active",
      questionIndex: 0,
      totalQuestions: 5,
    };
  }

  async getScores(matchId: string): Promise<Record<string, number>> {
    // TODO: Query match contract for current scores via GraphQL
    // Example:
    // const response = await fetch(`${LINERA_SERVICE_URL}/graphql`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     query: `
    //       query GetScores($chainId: String!) {
    //         match(chainId: $chainId) {
    //           scores
    //         }
    //       }
    //     `,
    //     variables: { chainId: matchId }
    //   })
    // });
    // const data = await response.json();
    // return data.data.match.scores;

    // Demo mode: return cached scores or default
    const cached = this.getCachedScores(matchId);
    if (Object.keys(cached).length > 0) {
      return cached;
    }
    
    const defaultScores = {
      [this.currentAddress || "demo"]: 0,
    };
    this.setCachedScores(matchId, defaultScores);
    return defaultScores;
  }
}

export const lineraClient = new LineraClient();
