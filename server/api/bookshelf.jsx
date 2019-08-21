const path = require('path');
var envFile = require('node-env-file');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//webpack env not working here so need manual load
try{
  envFile(path.join(__dirname, '../../config/' + process.env.NODE_ENV + '.env'))
} catch (e){}

//load database (knex) and json helper? (bookshelf)
var knex = require('knex')({client: 'mysql', connection: process.env.JAWSDB_URL });
module.exports = require('bookshelf')(knex);
