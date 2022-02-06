FROM node:17-alpine AS dev-deps
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm install

FROM node:17-alpine AS production-deps
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm install --production

FROM dev-deps AS compile 
WORKDIR /app
COPY --chown=node:node . ./
RUN ./node_modules/.bin/tsc

FROM node:17-alpine AS final
WORKDIR /app
COPY --chown=node:node --from=production-deps /app/node_modules ./node_modules
COPY --chown=node:node --from=compile /app/dist ./dist
CMD ["node", "dist/index.js"]