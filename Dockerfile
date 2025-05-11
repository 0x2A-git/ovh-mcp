FROM node:22

USER node 

WORKDIR /home/node

COPY ./dist/ .

COPY ./package*.json ./


RUN npm ci --omit=dev

EXPOSE 8000

CMD ["node", "src/index.js"]
