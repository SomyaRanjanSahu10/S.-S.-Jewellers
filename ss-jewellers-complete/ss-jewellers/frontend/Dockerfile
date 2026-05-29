# ─────────────────────────────────────────────────────────
# S.S. Jewellers Frontend — Production Dockerfile
# Uses Next.js standalone output for minimal image size
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS base

RUN addgroup -g 1001 -S nodejs && adduser -S ssj -u 1001

WORKDIR /app

# ─── Dependencies ────────────────────────────────────────
FROM base AS deps

COPY package*.json ./
RUN npm ci && npm cache clean --force

# ─── Builder ─────────────────────────────────────────────
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args (pass at build time: docker build --build-arg KEY=value)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_SITE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ─── Runner ──────────────────────────────────────────────
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy standalone Next.js output
COPY --from=builder --chown=ssj:nodejs /app/.next/standalone ./
COPY --from=builder --chown=ssj:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=ssj:nodejs /app/public           ./public

USER ssj

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
