# Base image
FROM node:20

# Skapa app folder
WORKDIR /app

# Kopiera package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Kopiera resten av koden
COPY . .

# Expose port
EXPOSE 3000

# Starta servern
CMD ["npm", "start"]