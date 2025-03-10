# Start with Ubuntu base image
FROM ubuntu:latest

# Set environment variables
ENV GO_VERSION=1.23.2

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Download and install Go
RUN curl -OL https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz \
    && tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz \
    && rm go${GO_VERSION}.linux-amd64.tar.gz

# Set Go environment variables
ENV PATH="/usr/local/go/bin:${PATH}"
ENV GOPATH="/go"

# Create app directory
WORKDIR /app/src

# Copy Go module files and download dependencies
COPY go.mod go.sum ./
RUN /usr/local/go/bin/go mod download

# Copy the entire source code
COPY . .

# Build the Go application
#RUN /usr/local/go/bin/go build -o backend .
RUN ls -lh && ls -lh /app && /usr/local/go/bin/go build -o /app/backend .

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["/app/backend"]