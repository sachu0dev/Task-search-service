# Dockerfile
FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --verbose && npm install typescript -g

COPY . .

RUN npm run build --verbose

EXPOSE 3000

CMD ["node", "dist/app.js"]