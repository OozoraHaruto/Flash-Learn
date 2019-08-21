import * as rConst from "reduxConstants";

export const authReducer = (state = {}, action) =>{
  switch (action.type) {
    case rConst.ADD_SESSION:
      return{
        ...action.session
      }
    default:
      return state;
  }
}
