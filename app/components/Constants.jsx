var moment = require('moment');

// Profile Reauth
export const PROFILE_RE_AUTH                                = "reauth"

// Profile Decks
export const PROFILE_DECK_CREATED                           = "created"
export const PROFILE_DECK_SUBSCRIBED                        = "subscribed"

// Test
export const TEST_MCQ                                       = "mcq"
export const TEST_OPENENDED                                 = "openended"
export const TEST_TRUEFALSE                                 = "truefalse"
export const TEST_ULTIMATE                                  = "ultimate"
export const TEST_PROGRESS_TYPE_COMBO                       = "combo"
export const TEST_PROGRESS_TYPE_INFO                        = "info"
export const TEST_RESULT_SORT                               = { asc: "asc", desc: "desc" }
export const TEST_RESULT_SORT_QUESTION_NUMBER               = {value: 'qn', label: 'Question Number'}
export const TEST_RESULT_SORT_QUESTION_NUMBER_ASC = {
  value                                                     : `${TEST_RESULT_SORT_QUESTION_NUMBER.value}_${TEST_RESULT_SORT.asc}`, 
  label                                                     : `${TEST_RESULT_SORT_QUESTION_NUMBER.label} ↑`
}
export const TEST_RESULT_SORT_QUESTION_NUMBER_DESC = {
  value                                                     : `${TEST_RESULT_SORT_QUESTION_NUMBER.value}_${TEST_RESULT_SORT.desc}`, 
  label                                                     : `${TEST_RESULT_SORT_QUESTION_NUMBER.label} ↓`
}
export const TEST_RESULT_SORT_TIME_TAKEN                    = {value: 'time', label: 'Time Taken'}
export const TEST_RESULT_SORT_TIME_TAKEN_ASC = {
  value                                                     : `${TEST_RESULT_SORT_TIME_TAKEN.value}_${TEST_RESULT_SORT.asc}`, 
  label                                                     : `${TEST_RESULT_SORT_TIME_TAKEN.label} ↑`
}
export const TEST_RESULT_SORT_TIME_TAKEN_DESC = {
  value                                                     : `${TEST_RESULT_SORT_TIME_TAKEN.value}_${TEST_RESULT_SORT.desc}`, 
  label                                                     : `${TEST_RESULT_SORT_TIME_TAKEN.label} ↓`
}
export const TEST_RESULT_FILTER_ALL                         = {value: 'all', label: 'View All'}
export const TEST_RESULT_FILTER_CORRECT                     = {value: 'correct', label: 'Correct'}
export const TEST_RESULT_FILTER_WRONG                       = {value: 'wrong', label: 'Wrong'}






// Additional Functions
export const formatDateTime = (timeFormat, format="") =>{
  const dateTime                                            = moment(timeFormat)
  console.log(`Formatted Date Time ${dateTime}`)

  const FMT_FULL                                            = "YYYY MM DD"
  const FMT_FULL_TEXT                                       = "Do MMMM YYYY"
  

  switch(format){
    case 'ago':
      return dateTime.fromNow()
    case 'full':
      return dateTime.format(FMT_FULL)
    case 'fullWithText':
      return dateTime.format(FMT_FULL_TEXT)
    default:
      return (moment().diff(dateTime, 'hours') > 24) ? dateTime.format(FMT_FULL_TEXT) : dateTime.fromNow()

  }
}

export const formatTime = ms => {
  const duration = moment.duration(ms, 'milliseconds')
  var hr = duration.hours()
  var min = duration.minutes()
  var sec = duration.seconds()
  var ms = duration.milliseconds()
  var textForm = ""

  if (hr != 0) {
    textForm = `${textForm} ${hr} ${hr > 1 ? "hrs" : "hr"} `
  }
  if (min != 0) {
    textForm = `${textForm} ${min} ${min > 1 ? "mins" : "min"} `
  }
  if (sec != 0) {
    textForm = `${textForm} ${sec} ${sec > 1 ? "secs" : "sec"} `
  }
  if (ms != 0) {
    textForm = `${textForm} ${ms} ms `
  }
  return textForm.trim()
}