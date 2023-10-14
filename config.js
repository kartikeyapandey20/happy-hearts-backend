require('dotenv').config({path : './env'});
var mongoose = require('mongoose')

mongoose.connect(process.env.HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection
  .once('open', () => console.log('DB connect'))
  .on('error', () => console.log('not connect with db'))


let tockenIs = process.env.TOKEN
// console.log(tockenIs);

module.exports = { mongoose, tockenIs }