# Use Debian-based image to avoid Alpine/musl/OpenSSL issues with Prisma
FROM node:22-slim

# Install OpenSSL (required for Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install client dependencies and build frontend
WORKDIR /app/client
RUN npm install
RUN npm run build

# Return to root directory
WORKDIR /app

# Generate Prisma Client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
