FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN chown -R node /app
CMD [ "npm", "run", "start:prod" ]
EXPOSE 8089