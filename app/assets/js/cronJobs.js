const axios = require('axios');
var moment = require('moment');

// Daily Jobs
function calculatePointAchievement() {
  return axios.post('https://us-central1-flashlearn-534b5.cloudfunctions.net/calculatePointLeaderboardAchievements', {
    password: process.env.FIREBASE_FUNCTION_PASSWORD
  }).then(function (response) {
    console.log("やった!ポイントの", response.data)
  }).catch(function (error) {
    console.log("ダメだ!ポイントの", error);
  })
}
function calculateTestAchievement() {
  return axios.post('https://us-central1-flashlearn-534b5.cloudfunctions.net/calculateTestLeaderboardsAchievements', {
    password: process.env.FIREBASE_FUNCTION_PASSWORD
  }).then(function (response) {
    console.log("やった!テストの", response.data)
  }).catch(function (error) {
    console.log("ダメだ!テストの", error);
  })
}


// Monthly Jobs
function resetLeaderboard() {
  return axios.post('https://us-central1-flashlearn-534b5.cloudfunctions.net/resetLeaderboards', {
    password: process.env.FIREBASE_FUNCTION_PASSWORD
  }).then(function (response) {
    console.log("やった!", response.data)
  }).catch(function (error) {
    console.log("ダメだ!", error);
  })
}


// Call Functions
Promise.all([
  calculatePointAchievement(),
  calculateTestAchievement(),
]).then(() =>{
  const monthlyJobs = []
  if (moment().endOf("month").diff(moment(), "days") == 0) {
    monthlyJobs = [
      resetLeaderboard(),
    ]
  }
  return Promise.all(monthlyJobs)
}).then(() =>{
  console.log("すべて完了しました")
}).catch(function (error) {
  console.log("クッソ！", error);
})
