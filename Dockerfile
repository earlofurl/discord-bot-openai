# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install yarn
RUN npm install -g yarn

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the bot will run on (you'll need to update this to match your bot's code)
EXPOSE 3000

# Start the bot
CMD ["yarn", "run", "start"]