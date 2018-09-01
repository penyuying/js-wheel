var opn = require('opn')
var path = require('path')
var express = require('express')

var app = express()

app.use('/', express.static('./docs'))


app.listen(8088, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('> Listening at localhost:8088\n')
  opn('localhost:8088')
})