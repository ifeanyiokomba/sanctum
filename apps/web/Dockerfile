# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@11.22.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
COPY packages/core/auth/package.json packages/core/auth/
COPY packages/core/db/package.json packages/core/db/
COPY packages/core/ui/package.json packages/core/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile --filter=@platform/web...

# Copy source code
COPY . .

# Build web app
RUN pnpm --filter=@platform/web build

# Production stage
FROM nginx:alpine AS runner

# Create non-root user
RUN addgroup -g 1001 -S sanctum && \
    adduser -S sanctum -u 1001

# Copy built assets
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Set ownership
RUN chown -R sanctum:sanctum /usr/share/nginx/html && \
    chown -R sanctum:sanctum /etc/nginx/conf.d && \
    chown -R sanctum:sanctum /var/cache/nginx && \
    chown -R sanctum:sanctum /var/log/nginx && \
    chown -R sanctum:sanctum /etc/nginx/nginx.conf

# Switch to non-root user
USER sanctum

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
