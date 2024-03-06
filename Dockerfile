# Use nginx image as the base image for serving

# Use node image as the base image
FROM node:latest AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy all files to the working directory
COPY . .

# Build the project
RUN npm run build

FROM node:latest AS development

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy all files to the working directory
COPY . .

# Expose the development server port
EXPOSE 3000

USER node

# Start the development server
# CMD ["sleep", "infinity"]

# Use nginx image as the base image for serving
FROM nginx:latest AS production

# Copy built files from the builder stage to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx server
USER node
CMD ["nginx", "-g", "daemon off;"]
