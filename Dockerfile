# Use Ubuntu as the base image
FROM ubuntu:latest

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt update && apt install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt install -y nodejs \
    && apt install -y golang \
    && apt install -y vim \
    && apt clean

# Set default working directory
WORKDIR /workspacevim