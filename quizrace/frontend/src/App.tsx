import { useState } from "react";
import { Lobby } from "./pages/Lobby";
import { MatchRoom } from "./pages/MatchRoom";
import "./styles.css";

export type Screen = "lobby" | "match";

export function App() {
  const [screen, setScreen] = useState<Screen>("lobby");
  const [matchId, setMatchId] = useState<string | null>(null);

  return (
    <div className="app-root">
      {screen === "lobby" && (
        <Lobby
          onEnterMatch={(id) => {
            setMatchId(id);
            setScreen("match");
          }}
        />
      )}

      {screen === "match" && matchId && (
        <MatchRoom matchId={matchId} onBack={() => setScreen("lobby")} />
      )}

      <footer className="app-footer">
        Built for WaveHack · Powered by Linera
      </footer>
    </div>
  );
}
