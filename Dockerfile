# Use the official Node.js image as the base image
FROM node:alpine

# Create and change to the app directory
WORKDIR /usr/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./dist .

CMD [ "node", "index.js" ]
