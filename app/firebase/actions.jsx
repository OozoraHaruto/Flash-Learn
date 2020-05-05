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

export const deleteUsersLikedToDeck = (deckId, usersPaths) =>{
  var deleteFn = functions.httpsCallable('deleteUsersLikedToDeck');
  return deleteFn({ deckId, usersPaths }).then(result=>{
    return result
  }).catch(err =>{
    console.log('Failed to Delete : ', deckId, err);
    return {success: false, ...err}
  })
}

export const searchForDeck = name => {
  var deleteFn = functions.httpsCallable('searchForDeck');
  return deleteFn({ name }).then(result => {
    return result
  }).catch(err => {
    console.log('Failed get any deck with the name: ', name, err);
    return { success: false, ...err }
  })
}


export const doOCRDocument = (bucketName, filePath, fileName, mimeType) => {
  var doOCR = functions.httpsCallable('doOCRDocument');
  return doOCR({ bucketName, filePath, fileName, mimeType }).then(result => {
    return result.data
  }).catch(err => {
    console.log('Failed get OCR : ', `${filePath}/${fileName}`, err);
    return { success: false, ...err }
  })
}

export const doOCRImage = (bucketName, filePath, fileName) => {
  var doOCR = functions.httpsCallable('doOCRImage');
  return doOCR({ bucketName, filePath, fileName }).then(result => {
    return result.data
  }).catch(err => {
    console.log('Failed get OCR : ', `${filePath}/${fileName}`, err);
    return { success: false, ...err }
  })
}