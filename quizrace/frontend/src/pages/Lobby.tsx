import { useState, useEffect } from "react";
import { lineraClient } from "../services/lineraClient";

interface LobbyProps {
  onEnterMatch: (matchId: string) => void;
}

export function Lobby({ onEnterMatch }: LobbyProps) {
  const [creating, setCreating] = useState(false);
  const [joiningId, setJoiningId] = useState("");
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const categories = [
    { id: "all", name: "All Categories", icon: "🎯" },
    { id: "blockchain", name: "Blockchain", icon: "⛓️" },
    { id: "coding", name: "Coding", icon: "💻" },
    { id: "physics", name: "Physics", icon: "🔬" },
    { id: "math", name: "Mathematics", icon: "📐" },
    { id: "logic", name: "Logic & Puzzles", icon: "🧩" }
  ];

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const addr = await lineraClient.getCurrentAddress();
      if (addr) {
        setConnected(true);
        setWalletAddress(addr);
      }
    } catch {
      setConnected(false);
    }
  };

  const handleConnect = async () => {
    try {
      await lineraClient.connectWallet();
      await checkConnection();
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      alert("Failed to connect wallet. Using demo mode.");
      setConnected(true);
      setWalletAddress("demo-address-123");
    }
  };

  const handleCreate = async () => {
    if (!connected) {
      await handleConnect();
      return;
    }

    setCreating(true);
    try {
      // Try to create match on-chain with category
      const matchId = await lineraClient.createMatch({
        questionCount: 10,
        category: selectedCategory,
      });
      // Pass category to match room
      onEnterMatch(`${matchId}|${selectedCategory}`);
    } catch (err) {
      console.error("Failed to create match on-chain:", err);
      // Fallback to demo mode
      const fakeMatchId = `match-${Date.now().toString(36)}|${selectedCategory}`;
      onEnterMatch(fakeMatchId);
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = () => {
    if (!joiningId.trim()) {
      alert("Please enter a match ID");
      return;
    }
    // If joining, use "all" category by default
    onEnterMatch(`${joiningId.trim()}|all`);
  };

  return (
    <div className="lobby-container">
      <div className="lobby-hero">
        <h1 className="hero-title">
          <span className="gradient-text">QuizRace</span>
        </h1>
        <p className="hero-subtitle">
          Real-time on-chain quiz duels powered by Linera microchains
        </p>
      </div>

      <div className="lobby-card">
        {!connected ? (
          <div className="connect-section">
            <div className="wallet-icon">🔐</div>
            <h2>Connect Wallet</h2>
            <p>Connect your Linera wallet to start playing</p>
            <button className="connect-button" onClick={handleConnect}>
              Connect Wallet
            </button>
            <button
              className="demo-button"
              onClick={() => {
                setConnected(true);
                setWalletAddress("demo-address");
                handleCreate();
              }}
            >
              Try Demo Mode
            </button>
          </div>
        ) : (
          <>
            <div className="wallet-info">
              <span className="wallet-badge">
                {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
              </span>
            </div>

            <div className="category-selection">
              <h3>Select Category</h3>
              <div className="category-grid">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`category-button ${selectedCategory === cat.id ? "selected" : ""}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span className="category-icon">{cat.icon}</span>
                    <span className="category-name">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="action-section">
              <button
                className="primary-button large"
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? (
                  <>
                    <span className="spinner"></span>
                    Creating Match...
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    Create New Match ({selectedCategory === "all" ? "Mixed" : categories.find(c => c.id === selectedCategory)?.name})
                  </>
                )}
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <div className="join-section">
                <input
                  className="match-input"
                  placeholder="Enter Match ID"
                  value={joiningId}
                  onChange={(e) => setJoiningId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleJoin()}
                />
                <button
                  className="secondary-button"
                  onClick={handleJoin}
                  disabled={!joiningId.trim()}
                >
                  Join Match
                </button>
              </div>
            </div>

            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Instant Finality</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>On-Chain Verified</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏆</span>
                <span>Real-Time Leaderboard</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
