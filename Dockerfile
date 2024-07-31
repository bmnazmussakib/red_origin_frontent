FROM node:19.5.0-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /var/www/sailor_frontend

COPY package.json ./
COPY . .

RUN  npm install --force

RUN npm run build

EXPOSE 9090

CMD ["npm", "start"]