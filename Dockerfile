FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY src/ .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/app.js"]
