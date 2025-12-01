use linera_sdk::base::{ContractAbi, ServiceAbi};
use linera_sdk::views::{View, RegisterView};
use linera_sdk::{contract, service, Contract, Service};
use serde::{Deserialize, Serialize};

pub struct LobbyApp;

impl ContractAbi for LobbyApp {
    type Operation = LobbyOperation;
    type Response = ();
}

impl ServiceAbi for LobbyApp {
    type Query = ();
    type Response = ();
}

#[derive(Debug, Serialize, Deserialize)]
pub enum LobbyOperation {
    CreateLobby,
}

#[derive(View)]
pub struct LobbyState {
    pub created: RegisterView<bool>,
}

#[contract]
impl Contract for LobbyApp {
    type State = LobbyState;
    type Message = ();
    type InitializationArgument = ();

    async fn initialize(&mut self, _argument: Self::InitializationArgument) {
        self.state.created.set(true);
    }

    async fn execute_operation(&mut self, _operation: Self::Operation) {
        // TODO: implement lobby logic (match registry)
    }

    async fn execute_message(&mut self, _message: Self::Message) {
        // no messages yet
    }
}

#[service]
impl Service for LobbyApp {
    type State = LobbyState;

    async fn handle_query(&self, _query: ()) -> () {
        ()
    }
}
