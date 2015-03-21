FROM unlucio/iojs

# Set instructions on build.
RUN npm install -g bower gulp
ADD package.json /app/

WORKDIR /app
RUN npm install

WORKDIR /
ADD bower.json /app/

WORKDIR /app
RUN bower install --allow-root

WORKDIR /
ADD . /app

WORKDIR /app
RUN gulp build

# Define default command.
CMD ["npm", "start"]
