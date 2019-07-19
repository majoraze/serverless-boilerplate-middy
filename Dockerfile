FROM mhart/alpine-node:8

# ADD . /usr/truck-driver
# WORKDIR /usr/truck-driver
WORKDIR /app
RUN npm install -g serverless

# ENV AWS_ACCESS_KEY_ID='A'
# ENV AWS_SECRET_ACCESS_KEY='A'

# EXPOSE 3000

CMD [ "npm","run", "start:fixture" ]
# CMD ["npm", "run", "start"]
