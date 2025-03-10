# Use Node.js for frontend
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the frontend port
EXPOSE 3000

# Start the frontend server
CMD ["npm", "start"]