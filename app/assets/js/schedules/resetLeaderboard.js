const axios = require('axios');

function resetLeaderboard() {
  axios.post('https://us-central1-flashlearn-534b5.cloudfunctions.net/resetLeaderboards', {
    password: process.env.FIREBASE_FUNCTION_PASSWORD
  }).then(function (response) {
    console.log("やった!", response.data)
  }).catch(function (error) {
    console.log("ダメだ!", error);
  })
}
resetLeaderboard();