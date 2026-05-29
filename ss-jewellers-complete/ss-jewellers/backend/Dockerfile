# ─────────────────────────────────────────────────────────
# S.S. Jewellers API — Production Dockerfile
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS base

# Security: run as non-root
RUN addgroup -g 1001 -S nodejs && adduser -S ssj -u 1001

WORKDIR /app

# ─── Dependencies ────────────────────────────────────────
FROM base AS deps

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ─── Build stage ─────────────────────────────────────────
FROM base AS build

COPY package*.json ./
RUN npm ci
COPY . .

# ─── Runtime ─────────────────────────────────────────────
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=5000

# Copy production node_modules
COPY --from=deps  /app/node_modules ./node_modules
# Copy application source
COPY --from=build /app/src          ./src
COPY --from=build /app/package.json ./package.json

# Create logs directory
RUN mkdir -p logs && chown -R ssj:nodejs logs

# Switch to non-root user
USER ssj

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
