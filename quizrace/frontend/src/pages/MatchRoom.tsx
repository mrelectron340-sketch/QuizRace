import { GameScreen } from "../components/GameScreen";

interface MatchRoomProps {
  matchId: string;
  onBack: () => void;
}

export function MatchRoom({ matchId, onBack }: MatchRoomProps) {
  return (
    <div className="match-room-container">
      <button className="back-button" onClick={onBack}>
        ← Back to Lobby
      </button>
      <GameScreen matchId={matchId} />
    </div>
  );
}
