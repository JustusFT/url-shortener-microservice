const async = require('async');
const mongodb = require('mongodb');
const Url = require('../models/url.js');
const shortenUrl = require('../lib/shortenUrl');
const path = require('path');

const { MongoClient } = mongodb;
const mongoLabUri = process.env.MONGOLAB_URI;
const appDir = path.dirname(require.main.filename);

function resultJson(req, result) {
  return {
    original_url: result.original_url,
    shortened_url: path.join(req.headers.host, result.shortened_url),
  };
}

exports.index = function index(req, res) {
  res.sendFile('/views/index.html', { root: appDir });
};

exports.show = function show(req, res) {
  async.waterfall([
    (callback) => {
      MongoClient.connect(mongoLabUri, (_err, _db) => callback(null, _err, _db));
    },
    (err, db, callback) => {
      if (err) {
        res.send('Error:', err);
      } else {
        const urls = db.collection('urls');
        urls.findOne({
          shortened_url: req.params.shortened_url,
        }, (_err, _result) => callback(_err, _result, db));
      }
    },
  ], (err, result, db) => {
    if (err) {
      res.send('Error:', err);
    } else if (result) {
      res.redirect(result.original_url);
    } else {
      res.json({
        error: 'Shortened URL is not used.',
      });
    }
    db.close();
  });
};

exports.create = function create(req, res) {
  const originalUrl = req.body.original_url;
  async.waterfall([
    (callback) => {
      Url.findOne({
        original_url: originalUrl,
      }, (_err, _result) => callback(null, _err, _result));
    },
    (err, result, callback) => {
      if (err) {
        res.json(err);
      } else if (result) {
        res.json(resultJson(req, result));
      } else {
        new Url({
          original_url: originalUrl,
          shortened_url: shortenUrl(),
        }).save((_err, _result) => callback(_err, _result));
      }
    },
  ], (err, result) => {
    if (err) {
      res.json({
        error: err.message,
      });
    } else {
      res.json(resultJson(req, result));
    }
  });
};
