FROM dockerfile/nodejs

RUN npm install -g gulp bower node-sass
ADD package.json /app/package.json

WORKDIR /app
RUN npm install

WORKDIR /
ADD bower.json /app/bower.json
ADD .bowerrc /app/.bowerrc

WORKDIR /app
RUN bower install --allow-root

WORKDIR /
ADD client /app/client
ADD gulpfile.js /app/gulpfile.js

WORKDIR /app
RUN npm run build

WORKDIR /
ADD server /app/server
ADD config /app/config

# Define default command.
WORKDIR /app
CMD ["npm", "start"]
