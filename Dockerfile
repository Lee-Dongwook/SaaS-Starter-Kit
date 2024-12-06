# Stage 1: Build Next.js application
FROM node:18 AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies and build the app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy built files to NGINX
COPY --from=builder /app/.next /usr/share/nginx/html

# Copy NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
