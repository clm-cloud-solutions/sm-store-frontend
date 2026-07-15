FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Next.js evaluates rewrites() at BUILD time (baked into routes-manifest.json),
# so the backend URL must be present during `next build`, not at runtime.
ARG BACKEND_URL=http://store-backend:3000
ENV BACKEND_URL=$BACKEND_URL
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
COPY --from=build --chown=node:node /app/package.json /app/package-lock.json /app/next.config.js ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
EXPOSE 3000
USER node
CMD ["npx", "next", "start", "-p", "3000"]
