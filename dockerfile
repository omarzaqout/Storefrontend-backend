
FROM node:lts-alpine

WORKDIR /app
COPY . .
RUN yarn install

COPY . .
RUN yarn build    
CMD ["node", "dist/server.js"]
EXPOSE 3000
