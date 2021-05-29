FROM node:alpine

WORKDIR /app

RUN npm install -g sirv

COPY package*json ./

RUN npm install -f

RUN npm install -g preact

COPY . .

ENTRYPOINT [ "npm", "run", "dev" ]
