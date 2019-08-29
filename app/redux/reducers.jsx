import * as rConst from "reduxConstants";

export const authReducer = (state = {}, action) =>{
  switch (action.type) {
    case rConst.ADD_SESSION:
      return{
        ...action.session
      }
    case rConst.EDIT_SESSION:
      return {
        ...state,
        ...action.editedInfo
      }
    case rConst.DELETE_SESSION:
      return {}
    default:
      return state;
  }
}
