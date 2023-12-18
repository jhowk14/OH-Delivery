# Use an official Node.js LTS image as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Build your Next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
