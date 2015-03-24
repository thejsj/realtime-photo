
# Realtime Photo Sharing

![Screenshot of GIF](screenshot.gif)

A realtime photo sharing app made with [RethinkDB](http://rethinkdb.com). The app showcase RethinkDB's changefeeds combined with binary data.

If you want to checkout a simpler version of this idea (in order to understand the code), check out this [realtime-photo-tutorial repo](https://github.com/thejsj/realtime-photo-tutorial).

### Setup

This app requires Node.js and RethinkDB to run. In mac, you can install these with homebrew:

```
brew install node
brew install rethinkdb
```

`1.` Install all dependencies:

```
npm install -g bower
npm install
bower install
```

`2.` Build front-end:
```
npm run build
```

`3.` If you want to run it using nodemon (for development):
```
npm run dev
```
If you want to run it in production:
```
npm start
```

You can also run it using a docker container
```
fig -f dev.yml build
fig -f dev.yml up
```
