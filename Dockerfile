FROM mhart/alpine-node:8

WORKDIR /app
RUN npm install -g serverless

CMD [ "npm","run", "start:fixture" ]
# CMD ["npm", "run", "start"]
