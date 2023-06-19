FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
CMD ["npm", "run", "start"]
COPY . .
EXPOSE 3000
CMD ["node", "./dist/server/server.js"]
