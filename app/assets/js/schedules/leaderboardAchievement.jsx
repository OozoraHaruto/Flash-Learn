const path = require('path');
var envFile = require('node-env-file');

function sayHello() {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  
  try {
    envFile(path.join(__dirname, 'config/' + process.env.NODE_ENV + '.env'))
  } catch (e) { console.log("大変だ", e) }

  console.log('こんにちは！');
  console.log('秘密は', process.env.FIREBASE_API_KEY);
}
sayHello();