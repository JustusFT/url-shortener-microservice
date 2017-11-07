require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const mongoLabUri = process.env.MONGOLAB_URI;

const url = require('./api/url');

mongoose.connect(mongoLabUri, { useMongoClient: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', url.index);
app.get('/:shortened_url', url.show);
app.post('/url', url.create);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port 3000');
});
