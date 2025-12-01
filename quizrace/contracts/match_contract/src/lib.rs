use linera_sdk::base::{ContractAbi, ServiceAbi, Owner};
use linera_sdk::views::{View, MapView, RegisterView};
use linera_sdk::{contract, service, Contract, Service};
use serde::{Deserialize, Serialize};

/// Application ABI
pub struct MatchApp;

impl ContractAbi for MatchApp {
    type Operation = MatchOperation;
    type Response = ();
}

impl ServiceAbi for MatchApp {
    type Query = MatchQuery;
    type Response = MatchResponse;
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MatchOperation {
    CreateMatch {
        host: Owner,
        question_count: u8,
    },
    StartMatch,
    SubmitAnswer {
        player: Owner,
        question_index: u8,
        answer: String,
    },
    FinalizeMatch,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MatchQuery {
    GetState,
    GetScores,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MatchResponse {
    State(MatchStateView),
    Scores(Vec<(String, u32)>),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MatchStateView {
    pub host: Owner,
    pub status: MatchStatus,
    pub question_index: u8,
    pub total_questions: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum MatchStatus {
    Waiting,
    Active,
    Finished,
}

#[derive(View)]
pub struct MatchState {
    pub host: RegisterView<Owner>,
    pub status: RegisterView<MatchStatus>,
    pub question_index: RegisterView<u8>,
    pub total_questions: RegisterView<u8>,
    pub scores: MapView<String, u32>,
}

#[contract]
impl Contract for MatchApp {
    type State = MatchState;
    type Message = ();
    type InitializationArgument = ();

    async fn initialize(&mut self, _argument: Self::InitializationArgument) {
        self.state.status.set(MatchStatus::Waiting);
        self.state.question_index.set(0);
    }

    async fn execute_operation(&mut self, operation: Self::Operation) {
        match operation {
            MatchOperation::CreateMatch { host, question_count } => {
                self.state.host.set(host);
                self.state.total_questions.set(question_count);
                self.state.status.set(MatchStatus::Waiting);
            }
            MatchOperation::StartMatch => {
                if *self.state.status.get() == MatchStatus::Waiting {
                    self.state.status.set(MatchStatus::Active);
                    self.state.question_index.set(0);
                }
            }
            MatchOperation::SubmitAnswer { player, question_index, answer: _answer } => {
                // Simple scoring: +10 points per answer (in real implementation, verify correctness)
                let player_key = player.to_string();
                let current_score = self.state.scores.get(&player_key).unwrap_or(&0);
                self.state.scores.insert(&player_key, current_score + 10);
            }
            MatchOperation::FinalizeMatch => {
                self.state.status.set(MatchStatus::Finished);
            }
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {
        // No cross-chain messages yet
    }
}

#[service]
impl Service for MatchApp {
    type State = MatchState;

    async fn handle_query(&self, query: Self::Query) -> Self::Response {
        match query {
            MatchQuery::GetState => {
                let state_view = MatchStateView {
                    host: *self.state.host.get(),
                    status: self.state.status.get().clone(),
                    question_index: *self.state.question_index.get(),
                    total_questions: *self.state.total_questions.get(),
                };
                MatchResponse::State(state_view)
            }
            MatchQuery::GetScores => {
                let mut scores_vec = Vec::new();
                for (player, score) in self.state.scores.iter() {
                    scores_vec.push((player.clone(), *score));
                }
                MatchResponse::Scores(scores_vec)
            }
        }
    }
}
