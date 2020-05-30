const _ = require('underscore');
const keypress = require('keypress');
// require httpHandler so we have access to httpHandler.initialize
const httpHandler = require('./httpHandler.js');

///////////////////////////////////////////////////////////////////////////////
// Utility Function ///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const validMessages = ['left', 'right', 'up', 'down'];
const mappedChars = { space: ' ' }; // special mappings
let queue;

const isValidMessage = (message) => {
  return _.contains(validMessages, message);
};

  // in raw-mode it's handy to see what's been typed
  // when not in raw mode, the terminal will do this for us
const logKeypress = (key) => {
  if (process.stdin.isRaw) {
    process.stdout.write(key);
    //put keypress into queue
  }
};

///////////////////////////////////////////////////////////////////////////////
// Keypress Handler ///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var message = ''; // a buffer to collect key presses
// create a queue variable
// pass in queue

module.exports.initialize = (callback, messageQueue) => {
  //store queue in global queue variable
  queue = messageQueue;

  // setup an event handler on standard input
  process.stdin.on('keypress', (chunk, key) => {
    // ctrl+c should quit the program
    if (key && key.ctrl && key.name === 'c') {
      process.exit();
    }

    // check to see if the keypress itself is a valid message
    if (isValidMessage(key.name)) {
      callback(key.name);
      return; // don't do any more processing on this key
    }

    // otherwise build up a message from individual characters
    if (key && (key.name === 'return' || key.name === 'enter')) {
      // on enter, process the message
      logKeypress('\n');
      if (message.length > 0) {
        callback(message);
        message = ''; // clear the buffer where we are collecting keystrokes
      }
    } else {
      // collect the individual characters/keystrokes
      message += (mappedChars[key.name] || key.name);
      logKeypress(key.name);
    }

  });
};

///////////////////////////////////////////////////////////////////////////////
// Configuration -- do not modify /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

keypress(process.stdin);
if (process.stdin.setRawMode) {
  // configure stdin for raw mode, if possible
  process.stdin.setRawMode(true);
}