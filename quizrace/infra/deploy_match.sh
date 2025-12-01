#!/usr/bin/env bash
set -e

if [ -z "$LINERA_WALLET" ]; then
  export LINERA_WALLET="$HOME/.linera/wallet.json"
  export LINERA_KEYSTORE="$HOME/.linera/keystore.json"
  export LINERA_STORAGE="rocksdb:$HOME/.linera/wallet.db"
fi

pushd quizrace/contracts
rustup target add wasm32-unknown-unknown || true
cargo build --release --target wasm32-unknown-unknown
popd

CONTRACT_WASM=quizrace/contracts/match_contract/target/wasm32-unknown-unknown/release/match_contract_contract.wasm
SERVICE_WASM=quizrace/contracts/match_contract/target/wasm32-unknown-unknown/release/match_contract_service.wasm

if [ ! -f "$CONTRACT_WASM" ] || [ ! -f "$SERVICE_WASM" ]; then
  echo "Wasm artifacts not found"
  exit 1
fi

linera wallet init --faucet http://localhost:8080 || true
linera wallet request-chain --faucet http://localhost:8080 || true

linera publish-and-create \
  "$CONTRACT_WASM" "$SERVICE_WASM" \
  --json-argument "{}"
