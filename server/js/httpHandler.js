const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

let respondToCommand = (response) => {
  let keyStroke = messageQueue.dequeue();
  if (keyStroke !== undefined) {
    // take keypresses and send them until queue is empty
    process.stdout.write(keyStroke);
    response.write(keyStroke);
  }
};

module.exports.router = (req, res, next = ()=>{}) => {
  res.writeHead(200, headers);
  // switch case statement
  switch (req.method) {
    case 'GET':
      respondToCommand(res);
  }
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};
