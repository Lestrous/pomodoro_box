FROM node:18
WORKDIR /app
#COPY package*.json ./
COPY . /app
RUN npm install
#ENV PORT 3000
#ENV NODE_ENV production
EXPOSE 3000
CMD ["npm", "run", "start"]
#CMD ["node", "./bin/prod.js"]
#CMD ["node", "./dist/server/server.js"]
