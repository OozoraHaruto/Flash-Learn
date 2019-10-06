import { functions } from 'firebase'

export const deleteAtPath = path =>{
  var deleteFn = functions.httpsCallable('recursiveDelete');
  return deleteFn({ path }).then(result=>{
    return {success: true}
  }).catch(err =>{
    console.log('Failed to Delete : ', path, err);
    return {success: false, ...err}
  })
}

export const deleteUsersSubscribedToDeck = (deckId, subscribersPaths) =>{
  var deleteFn = functions.httpsCallable('deleteUsersSubscribedToDeck');
  return deleteFn({ deckId, subscribersPaths }).then(result=>{
    console.log("result", result)
    return result
  }).catch(err =>{
    console.log('Failed to Delete : ', deckId, err);
    return {success: false, ...err}
  })
}