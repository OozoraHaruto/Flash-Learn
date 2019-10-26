const axios = require('axios');

function calculatePointAchievement() {
  axios.post('https://us-central1-flashlearn-534b5.cloudfunctions.net/calculatePointLeaderboardAchievements', {
    password: process.env.FIREBASE_FUNCTION_PASSWORD
  }).then(function (response) {
    console.log("やった!ポイントの", response.data)
  }).catch(function (error) {
    console.log("ダメだ!ポイントの", error);
  })
}
function calculateTestAchievement() {
  axios.post('https://us-central1-flashlearn-534b5.cloudfunctions.net/calculateTestLeaderboardsAchievements', {
    password: process.env.FIREBASE_FUNCTION_PASSWORD
  }).then(function (response) {
    console.log("やった!テストの", response.data)
  }).catch(function (error) {
    console.log("ダメだ!テストの", error);
  })
}
calculatePointAchievement();
calculateTestAchievement();