FROM node:alpine

RUN apk --no-cache add \
  g++ gcc libgcc libstdc++ linux-headers make python openssl bash && \
  npm install --quiet node-gyp -g

WORKDIR /app

COPY package*json ./

RUN npm install -f

COPY . .

ENTRYPOINT [ "node", "server.js" ]