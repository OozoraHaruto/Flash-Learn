import moment from 'moment';

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