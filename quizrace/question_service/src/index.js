const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const app = express();

// Enable CORS for all origins (needed for Docker)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'question-service' });
});

const QUESTIONS_PATH = path.join(__dirname, "..", "questions", "sample_questions.json");
const questions = JSON.parse(fs.readFileSync(QUESTIONS_PATH, "utf8"));

// In-memory store mapping commitId -> { question, salt }
const commits = new Map();

function hashQuestion(question, salt) {
  return crypto
    .createHash("sha256")
    .update(`${question}|${salt}`, "utf8")
    .digest("hex");
}

app.post("/commit_question", (req, res) => {
  const { questionId } = req.body;
  const q = questions.find((q) => q.id === questionId);
  if (!q) {
    return res.status(400).json({ error: "Unknown question id" });
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const commitHash = hashQuestion(q.text, salt);
  const commitId = crypto.randomBytes(8).toString("hex");

  commits.set(commitId, { question: q, salt });

  // TODO: call match_contract.commit_question(commitHash) on-chain.
  res.json({ commitId, commitHash });
});

app.post("/reveal_question", (req, res) => {
  const { commitId } = req.body;
  const data = commits.get(commitId);
  if (!data) {
    return res.status(400).json({ error: "Unknown commitId" });
  }

  const { question, salt } = data;
  const commitHash = hashQuestion(question.text, salt);

  // TODO: call match_contract.reveal_answer(question_index, plaintext, salt) on-chain.
  res.json({
    question,
    salt,
    commitHash,
  });
});

app.get("/questions", (_req, res) => {
  // Shuffle questions for variety
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  res.json(shuffled);
});

app.get("/questions/:category", (req, res) => {
  const { category } = req.params;
  if (category === "all") {
    // Return all questions shuffled
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return res.json(shuffled);
  }
  const filtered = questions.filter(q => q.category === category);
  if (filtered.length === 0) {
    // If no questions in category, return all questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return res.json(shuffled);
  }
  res.json(filtered);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Question service listening on http://localhost:${port}`);
});


