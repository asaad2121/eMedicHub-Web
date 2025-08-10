# Stage 1: Build the Angular application
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install Angular CLI
RUN npm install -g @angular/cli

# Install npm dependencies
RUN npm install

# Copy all other source files
COPY . .

# Build the Angular application for production
RUN npm run build --output-path=./dist/eMedicHub-Web/browser --configuration=production

# Stage 2: Serve the application with NGINX
FROM nginx:alpine

# Copy the NGINX configuration file
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the built Angular application from the 'build' stage
COPY --from=build /app/dist/eMedicHub-Web/browser /usr/share/nginx/html

# Expose port 80 (default HTTP port for NGINX)
EXPOSE 80

# Command to run NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]
