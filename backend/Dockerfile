# Base image
FROM oven/bun:1

# Skapa app folder
WORKDIR /app

# Kopiera package files och lock-fil
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Kopiera resten av koden
COPY . .

# Expose port
EXPOSE 3002

# Starta servern
CMD ["bun", "run", "src/index.ts"]