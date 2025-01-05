# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM public.ecr.aws/lambda/nodejs:18

# Copy the build output from build stage
COPY --from=build /app/dist ${LAMBDA_TASK_ROOT}

# Install serve to handle static files
RUN npm install -g serve

# Set the CMD to your Lambda handler
CMD [ "node_modules.serve", "-s", "${LAMBDA_TASK_ROOT}" ]
