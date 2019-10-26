const axios = require('axios');

function sayHello() {
  console.log('こんにちは！');
  axios.post('https://us-central1-flashlearn-534b5.cloudfunctions.net/calculateLeaderboardAchievements', {
    password: process.env.FIREBASE_FUNCTION_PASSWORD
  }).then(function (response) {
    console.log("やった", response.data());
  }).catch(function (error) {
    console.log("ダメだ", error);
  })
}
sayHello();