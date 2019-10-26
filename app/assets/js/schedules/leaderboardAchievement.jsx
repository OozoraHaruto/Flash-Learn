const axios = require('axios');

function sayHello() {
  console.log('こんにちは！');
  axios.get('https://us-central1-flashlearn-534b5.cloudfunctions.net/calculateLeaderboardAchievements', {
    params: {
      password: process.env.FIREBASE_FUNCTION_PASSWORD
    }
  }).then(function (response) {
    console.log("やった", response);
  }).catch(function (error) {
    console.log("ダメだ", error);
  })
}
sayHello();