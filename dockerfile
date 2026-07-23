# Multi-stage Dockerfile for UtilityHub (FastAPI backend + React frontend)

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY UtilityHub-main/frontend/package*.json ./
RUN npm ci
COPY UtilityHub-main/frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM python:3.11-slim AS backend-builder
WORKDIR /app/backend
COPY UtilityHub-main/backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY UtilityHub-main/backend/ ./

# Stage 3: Final Runtime Image
FROM python:3.11-slim
WORKDIR /app

# Install nginx for serving frontend
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy backend dependencies and application
COPY --from=backend-builder /app/backend /app/backend
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy built frontend to nginx
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Configure nginx to serve frontend and proxy API requests
RUN echo 'server { \
        listen 8080; \
        location / { \
            root /usr/share/nginx/html; \
            try_files $uri $uri/ /index.html; \
        } \
        location /api/ { \
            proxy_pass http://127.0.0.1:8000; \
            proxy_set_header Host $host; \
            proxy_set_header X-Real-IP $remote_addr; \
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
            proxy_set_header X-Forwarded-Proto $scheme; \
        } \
    }' > /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 8000 8080

# Set environment variable to use SQLite instead of PostgreSQL
ENV DATABASE_URL=sqlite:////app/backend/utilityhub.db

# Start both services
CMD sh -c "cd /app/backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"