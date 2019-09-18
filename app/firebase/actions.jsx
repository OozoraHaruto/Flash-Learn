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