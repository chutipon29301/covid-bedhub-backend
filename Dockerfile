# Install dependencies only when needed
FROM node:14-alpine AS deps
WORKDIR /app
COPY ./package.json ./yarn.lock ./
RUN apk add --no-cache git
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# # Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/dist .
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "main.js"]
