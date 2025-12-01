import { useEffect, useState } from "react";
import { lineraClient } from "../services/lineraClient";
import { PhysicsSimulation } from "./PhysicsSimulation";
import { DragDropQuestion } from "./DragDropQuestion";
import { CodingQuestion } from "./CodingQuestion";

interface GameScreenProps {
  matchId: string;
}

type Question = {
  id: number;
  type: "multiple-choice" | "physics-simulation" | "drag-drop" | "coding" | "puzzle";
  category?: string;
  text: string;
  options?: string[];
  correctIndex?: number;
  simulation?: any;
  blocks?: string[];
  correctOrder?: number[];
  codeTemplate?: string;
  testCases?: Array<{ input: any; expected: any }>;
  points?: number;
};

type PlayerScore = {
  address: string;
  score: number;
  answered: boolean;
};

// Get question service URL - works in Docker and locally
const getQuestionServiceUrl = (): string => {
  // Use environment variable if set (from .env file)
  const envUrl = (import.meta as any).env?.VITE_QUESTION_SERVICE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim();
  }
  
  // In browser, use same hostname as frontend
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    // If localhost or 127.0.0.1, use localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
      return 'http://localhost:4000';
    }
    // Otherwise use the same hostname
    return `${protocol}//${hostname}:4000`;
  }
  
  // Fallback
  return 'http://localhost:4000';
};

const QUESTION_SERVICE_URL = getQuestionServiceUrl();

export function GameScreen({ matchId }: GameScreenProps) {
  // Parse matchId to extract category (format: "matchId|category")
  const [actualMatchId, selectedCategory] = matchId.includes("|") 
    ? matchId.split("|") 
    : [matchId, "all"];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<PlayerScore[]>([
    { address: "You", score: 0, answered: false },
  ]);
  const [showResult, setShowResult] = useState(false);
  const [matchFinished, setMatchFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [commitId, setCommitId] = useState<string | null>(null);
  const [answerData, setAnswerData] = useState<any>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const current = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;
  const questionTime = current?.type === "coding" ? 120 
    : current?.type === "physics-simulation" ? 60 
    : current?.type === "puzzle" ? 45
    : 30;

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Load questions based on selected category
        const url = selectedCategory === "all" 
          ? `${QUESTION_SERVICE_URL}/questions`
          : `${QUESTION_SERVICE_URL}/questions/${selectedCategory}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let data: Question[] = await response.json();
        
        // If category filter returned empty, try all questions
        if (selectedCategory !== "all" && (!Array.isArray(data) || data.length === 0)) {
          const allResponse = await fetch(`${QUESTION_SERVICE_URL}/questions`);
          if (allResponse.ok) {
            data = await allResponse.json();
          }
        }
        
        if (Array.isArray(data) && data.length > 0) {
          // Shuffle questions for randomness
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          // Take first 10 questions for the match
          setQuestions(shuffled.slice(0, 10));
        } else {
          console.warn("No questions received, using fallback");
        }
      } catch (err) {
        console.error("Failed to load questions:", err);
        console.log("Question service URL:", QUESTION_SERVICE_URL);
        console.log("Selected category:", selectedCategory);
        // Continue with empty questions - UI will show loading state
      }
    };
    
    loadQuestions();
  }, [selectedCategory]);

  useEffect(() => {
    if (!current) return;
    setSecondsLeft(questionTime);
    setSelected(null);
    setSubmitted(false);
    setShowResult(false);
    setAnswerData(null);
    setIsCorrect(false);

    fetch(`${QUESTION_SERVICE_URL}/commit_question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: current.id }),
    })
      .then((r) => r.json())
      .then((data) => setCommitId(data.commitId))
      .catch(() => setCommitId(null));
  }, [questionIndex, current, questionTime]);

  useEffect(() => {
    if (secondsLeft === 0 && !submitted) {
      handleTimeout();
    }
  }, [secondsLeft, submitted]);

  useEffect(() => {
    if (!current) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [questionIndex, current]);

  // Subscribe to on-chain updates
  useEffect(() => {
    const unsubscribe = lineraClient.subscribeToMatch(actualMatchId, (event) => {
      if (event.type === "ScoreUpdated") {
        updateLeaderboard(event.scores);
      } else if (event.type === "QuestionSettled") {
        setShowResult(true);
      }
    });

    return () => unsubscribe();
  }, [actualMatchId]);

  const updateLeaderboard = (scores: Record<string, number>) => {
    const newLeaderboard = Object.entries(scores)
      .map(([address, score]) => ({
        address: address.slice(0, 8) + "..." + address.slice(-6),
        score,
        answered: true,
      }))
      .sort((a, b) => b.score - a.score);
    setLeaderboard(newLeaderboard);
  };

  const handleSelect = (index: number) => {
    if (secondsLeft === 0 || submitted) return;
    setSelected(index);
  };

  const handleMultipleChoiceSubmit = async () => {
    if (selected === null || submitted || !current.options) return;

    setSubmitted(true);
    setShowResult(true);

    const correct = selected === current.correctIndex;
    setIsCorrect(correct);
    const points = current.points || 10;

    if (correct) {
      const newScore = score + points;
      setScore(newScore);
      setLeaderboard((prev) =>
        prev.map((p) =>
          p.address === "You" ? { ...p, score: newScore, answered: true } : p
        )
      );
    }

    await submitAnswerToChain(correct ? current.options[selected] : "incorrect", correct);
  };

  const handleInteractiveAnswer = async (answer: any, correct: boolean) => {
    if (submitted) return;

    setSubmitted(true);
    setShowResult(true);
    setAnswerData(answer);
    setIsCorrect(correct);

    const points = correct ? (current.points || 20) : 0;
    if (correct) {
      const newScore = score + points;
      setScore(newScore);
      setLeaderboard((prev) =>
        prev.map((p) =>
          p.address === "You" ? { ...p, score: newScore, answered: true } : p
        )
      );
    }

    await submitAnswerToChain(JSON.stringify(answer), correct);
  };

  const submitAnswerToChain = async (answer: string, correct: boolean) => {
    if (commitId) {
      try {
        await fetch(`${QUESTION_SERVICE_URL}/reveal_question`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commitId }),
        });
      } catch (err) {
        console.error("Failed to reveal question:", err);
      }
    }

    try {
      await lineraClient.submitAnswer({
        matchId: actualMatchId,
        questionIndex,
        answer: answer,
      });
    } catch (err) {
      console.error("Failed to submit answer on-chain:", err);
    }
  };

  const handleTimeout = () => {
    if (!submitted) {
      setSubmitted(true);
      setShowResult(true);
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setMatchFinished(true);
    } else {
      setQuestionIndex((i) => i + 1);
    }
  };

  if (matchFinished) {
    return (
      <div className="match-finished">
        <div className="finish-card">
          <h1>🎉 Match Complete!</h1>
          <div className="final-score">
            <div className="score-value">{score}</div>
            <div className="score-label">Your Final Score</div>
          </div>
          <div className="leaderboard-final">
            <h3>Final Leaderboard</h3>
            {leaderboard.map((player, idx) => (
              <div
                key={idx}
                className={`leaderboard-item ${player.address === "You" ? "you" : ""}`}
              >
                <span className="rank">#{idx + 1}</span>
                <span className="address">{player.address}</span>
                <span className="score">{player.score} pts</span>
              </div>
            ))}
          </div>
          <button
            className="primary-button large"
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="game-container">
        <div className="loading">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-main">
        <div className="game-header">
          <div className="match-info">
            <span className="match-badge">
              {current.category && `[${current.category.toUpperCase()}]`} Match: {actualMatchId.slice(0, 12)}...
            </span>
            <span className="question-counter">
              Question {questionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="timer-container">
            <div className={`timer-circle ${secondsLeft <= 5 ? "urgent" : ""}`}>
              <span className="timer-value">{secondsLeft}</span>
              <span className="timer-label">seconds</span>
            </div>
          </div>
        </div>

        <div className="question-card">
          <div className="question-type-badge">
            {current.type === "physics-simulation" && "🔬 Physics Simulation"}
            {current.type === "drag-drop" && "🧩 Drag & Drop"}
            {current.type === "coding" && "💻 Coding Challenge"}
            {current.type === "multiple-choice" && "📝 Multiple Choice"}
            {current.type === "puzzle" && "🧩 Logic Puzzle"}
          </div>
          <h2 className="question-text">{current.text}</h2>

          {/* Multiple Choice */}
          {current.type === "multiple-choice" && current.options && (
            <>
              <div className="options-grid">
                {current.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const isCorrect = current.correctIndex === idx;
                  let className = "option-button";
                  if (showResult) {
                    if (isCorrect) className += " correct";
                    if (isSelected && !isCorrect) className += " incorrect";
                  }
                  if (isSelected) className += " selected";

                  return (
                    <button
                      key={idx}
                      className={className}
                      onClick={() => handleSelect(idx)}
                      disabled={submitted || secondsLeft === 0}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="option-text">{opt}</span>
                      {showResult && isCorrect && (
                        <span className="checkmark">✓</span>
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <span className="crossmark">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {!submitted && selected !== null && (
                <button
                  className="submit-button"
                  onClick={handleMultipleChoiceSubmit}
                  disabled={secondsLeft === 0}
                >
                  Submit Answer
                </button>
              )}
            </>
          )}

          {/* Physics Simulation */}
          {current.type === "physics-simulation" && current.simulation && (
            <PhysicsSimulation
              simulation={current.simulation}
              onAnswer={(answer) => handleInteractiveAnswer(answer, answer.isCorrect)}
              disabled={submitted || secondsLeft === 0}
            />
          )}

          {/* Drag and Drop */}
          {current.type === "drag-drop" && current.blocks && current.correctOrder && (
            <DragDropQuestion
              blocks={current.blocks}
              correctOrder={current.correctOrder}
              onAnswer={(order) => {
                const correct = JSON.stringify(order) === JSON.stringify(current.correctOrder);
                handleInteractiveAnswer({ order }, correct);
              }}
              disabled={submitted || secondsLeft === 0}
            />
          )}

          {/* Coding Question */}
          {current.type === "coding" && current.codeTemplate && current.testCases && (
            <CodingQuestion
              codeTemplate={current.codeTemplate}
              testCases={current.testCases}
              onAnswer={(code, correct) => handleInteractiveAnswer({ code }, correct)}
              disabled={submitted || secondsLeft === 0}
            />
          )}

          {/* Puzzle Question (treated as multiple choice) */}
          {current.type === "puzzle" && current.options && (
            <>
              <div className="options-grid">
                {current.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const isCorrect = current.correctIndex === idx;
                  let className = "option-button";
                  if (showResult) {
                    if (isCorrect) className += " correct";
                    if (isSelected && !isCorrect) className += " incorrect";
                  }
                  if (isSelected) className += " selected";

                  return (
                    <button
                      key={idx}
                      className={className}
                      onClick={() => handleSelect(idx)}
                      disabled={submitted || secondsLeft === 0}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="option-text">{opt}</span>
                      {showResult && isCorrect && (
                        <span className="checkmark">✓</span>
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <span className="crossmark">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {!submitted && selected !== null && (
                <button
                  className="submit-button"
                  onClick={handleMultipleChoiceSubmit}
                  disabled={secondsLeft === 0}
                >
                  Submit Answer
                </button>
              )}
            </>
          )}

          {showResult && (
            <div className="result-banner">
              {isCorrect ? (
                <div className="result correct-result">
                  <span className="result-icon">🎉</span>
                  <span>Correct! +{current.points || 10} points</span>
                </div>
              ) : (
                <div className="result incorrect-result">
                  <span className="result-icon">❌</span>
                  <span>Incorrect answer</span>
                </div>
              )}
            </div>
          )}

          {showResult && (
            <button
              className="next-button large"
              onClick={handleNext}
            >
              {isLastQuestion ? "Finish Match" : "Next Question →"}
            </button>
          )}
        </div>
      </div>

      <div className="game-sidebar">
        <div className="score-card">
          <h3>Your Score</h3>
          <div className="score-display">{score}</div>
        </div>

        <div className="leaderboard-card">
          <h3>Leaderboard</h3>
          <div className="leaderboard-list">
            {leaderboard.map((player, idx) => (
              <div
                key={idx}
                className={`leaderboard-item ${player.address === "You" ? "you" : ""}`}
              >
                <span className="rank">#{idx + 1}</span>
                <span className="address">{player.address}</span>
                <span className="score">{player.score}</span>
                {player.answered && (
                  <span className="answered-badge">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="chain-info">
          <div className="chain-badge">
            <span className="chain-icon">⛓️</span>
            <span>On-Chain Match</span>
          </div>
          <div className="chain-id">
            Chain: {actualMatchId.slice(0, 16)}...
          </div>
        </div>
      </div>
    </div>
  );
}
