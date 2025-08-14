# Development Dockerfile for Node.js + TypeScript + Nodemon
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Ensure Prisma client is generated for the container platform
RUN npx prisma generate || (npm i -D prisma && npx prisma generate)

# Install nodemon globally for development
RUN npm install -g nodemon

# Expose the port your app runs on
EXPOSE 8080

# Start the app with nodemon for hot-reload (adjust entrypoint if needed)
CMD ["nodemon", "--watch", "src", "--exec", "ts-node", "src/index.ts"]
