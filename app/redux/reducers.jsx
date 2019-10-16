import * as rConst from "reduxConstants";
const { Random, MersenneTwister19937 } = require("random-js");
const random = new Random(MersenneTwister19937.autoSeed());

export const currentProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case rConst.ADD_CURRENT_PROFILE:
      return {
        ...action.profile
      }
    case rConst.EDIT_CURRENT_PROFILE:
      return {
        ...state,
        ...action.editedInfo
      }
    case rConst.DELETE_CURRENT_PROFILE:
      return {}
    default:
      return state;
  }
}


export const currentDeckReducer = (state = {}, action) =>{
  switch (action.type) {
    case rConst.ADD_CURRENT_DECK:
      return {
        ...action.info
      }
    case rConst.EDIT_CURRENT_DECK:
      return {
        ...state,
        ...action.editedInfo
      }
    case rConst.DELETE_CURRENT_DECK:
      return {}
    default:
      return state;
  }
}


export const currentTestReducer = (state = {}, action) => {
  switch (action.type) {
    case rConst.ADD_TEST:
      return {
        ...action.info,
      }
    case rConst.EDIT_TEST_SHUFFLE:
      return {
        ...state,
        questions                     : random.shuffle(state.questions)
      }
    case rConst.DELETE_TEST:
      return {}
    default:
      return state;
  }
}