FROM node:18
WORKDIR /app
COPY . /app
RUN npm install --production
ENV PORT 3000
ENV NODE_ENV production
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
