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

let respondToGet = (res, url) => {
  switch(url) {
    case '/':
      res.writeHead(200, headers);
      respondToCommand(res);
      break;
    case '/image':
     if (fs.existsSync(module.exports.backgroundImageFile)){
       let content = fs.readFileSync(module.exports.backgroundImageFile);
       res.writeHead(200, {...headers, 'Content-type':'image/jpg'});
       res.end(content);
     } else {
       res.writeHead(404, headers);
     }
  }
}

module.exports.router = (req, res, next = ()=>{}) => {
  // switch case statement
  switch (req.method) {
    case 'GET':
      respondToGet(res, req.url);
      break;
    case 'OPTIONS':
      res.writeHead(200, headers);
  }
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};
