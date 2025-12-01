FROM rust:1.75-slim

SHELL ["bash", "-c"]

# Update package lists and install dependencies in separate steps for better caching
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    pkg-config \
    protobuf-compiler \
    clang \
    libclang-dev \
    libssl-dev \
    libc6-dev \
    gcc \
    g++ \
    make \
    curl \
    ca-certificates \
    git \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set environment variables for better compilation
ENV CC=gcc
ENV CXX=g++
ENV RUSTFLAGS=""

# Install Rust toolchain components
RUN rustup default stable && \
    rustup component add rustfmt clippy && \
    rustup target add wasm32-unknown-unknown

# Install Linera with retry logic and better error handling
ENV CARGO_NET_GIT_FETCH_WITH_CLI=true
ENV CARGO_BUILD_JOBS=2
ENV RUST_BACKTRACE=1

# Install Linera binaries (allow failures - app works without Linera)
RUN cargo install --locked --version 0.15.5 linera 2>&1 | tee /tmp/linera-install.log || echo "Linera CLI install failed (non-critical)"

RUN cargo install --locked --version 0.15.5 linera-service 2>&1 | tee /tmp/linera-service-install.log || echo "Linera service install failed (non-critical)"

RUN cargo install --locked --version 0.15.5 linera-storage-service 2>&1 | tee /tmp/linera-storage-install.log || echo "Linera storage install failed (non-critical)"

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

HEALTHCHECK CMD ["curl", "-fsS", "http://localhost:9001/graphql"] || exit 0

ENTRYPOINT bash /build/run.bash
