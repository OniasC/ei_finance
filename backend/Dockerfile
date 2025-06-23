# Start with Ubuntu base image
FROM ubuntu:22.04

# Set environment variables
ENV GO_VERSION=1.23.2

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/* \
    && python3 -m pip install --upgrade pip

RUN python3 -m pip install numpy pandas

# Download and install Go
RUN curl -OL https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz \
    && tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz \
    && rm go${GO_VERSION}.linux-amd64.tar.gz

# Set Go environment variables
ENV PATH="/usr/local/go/bin:${PATH}"
ENV GOPATH="/go"

# Install Rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Optionally, create and build a Rust Hello World
WORKDIR /app/rust-hello
RUN /root/.cargo/bin/cargo new --bin hello
WORKDIR /app/rust-hello/hello
RUN /root/.cargo/bin/cargo build --release

# Create app directory
WORKDIR /app/src

# Copy Go module files and download dependencies
COPY go.mod go.sum ./
RUN /usr/local/go/bin/go mod download

RUN go get github.com/rs/cors

# Copy the entire source code
COPY . .

# Build the Go application
#RUN /usr/local/go/bin/go build -o backend .
RUN ls -lh && ls -lh /app && /usr/local/go/bin/go build -o /app/backend .

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["/app/backend"]