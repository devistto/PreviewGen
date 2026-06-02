FROM node:22-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y ffmpeg

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/main"]