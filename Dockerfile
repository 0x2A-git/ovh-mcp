FROM node:22

USER node 

WORKDIR /home/node

COPY --chown=node:node ./dist/ .

COPY --chown=node:node ./package*.json ./

RUN npm ci --omit=dev

EXPOSE 8000

CMD ["node", "src/index.js"]
