import moment from 'moment';

// Profile Decks
export const PROFILE_DECK_CREATED                           = "created"
export const PROFILE_DECK_SUBSCRIBED                        = "subscribed"

// Test
export const TEST_MCQ                                       = "TEST_MCQ"
export const TEST_OPENENDED                                 = "TEST_OPENENDED"
export const TEST_TRUEFALSE                                 = "TEST_MCQ"
export const TEST_ALL                                       = "TEST_ALL"





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