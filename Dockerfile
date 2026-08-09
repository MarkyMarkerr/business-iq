FROM node:22-alpine

WORKDIR /app

COPY --chown=node:node server.js index.html ./

USER node

CMD ["node", "server.js"]
