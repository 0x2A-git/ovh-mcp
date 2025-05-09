FROM node:22

USER node 

WORKDIR /home/node

COPY ./dist/ .

COPY ./package*.json ./


RUN npm ci

EXPOSE 8000

CMD ["node", "src/index.js"]
