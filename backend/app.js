//mongodb pw: XDTwEZpntaX8vZHI
//mongodb+srv://bilal89:<password>@bilal89-2o9pn.mongodb.net/test?retryWrites=true&w=majority

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const app = express();

mongoose.connect('mongodb+srv://bilal89:XDTwEZpntaX8vZHI@bilal89-2o9pn.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
  
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/posts', postRoutes);
app.use('/api/auth', userRoutes);
  
module.exports = app;