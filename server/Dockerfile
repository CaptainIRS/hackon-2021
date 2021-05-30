FROM node

WORKDIR /app

COPY package*json ./

RUN npm install -f

COPY . .

ENTRYPOINT [ "node", "server.js" ]