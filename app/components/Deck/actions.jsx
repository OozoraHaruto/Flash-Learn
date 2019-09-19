import firebase, { auth, database } from 'firebase';
import * as dbConst from 'databaseConstants'
import * as rConst from "reduxConstants";

import { accounts, firebaseFunctions } from 'actions';
// import { functionList } from 'firebase'

export const startAddDeck = values =>{
  const { startAddOrEditCreatedDeckRef }      = accounts
  var deckId                            = ""
  var deckDetails = {
    name: values.name.trim(),
    public: !values.shownPublic ? false : values.shownPublic,
  }

  return database.collection(dbConst.COL_DECKS).add({
    modified                            : firebase.firestore.FieldValue.serverTimestamp(),
    owner                               : database.doc(`/${dbConst.COL_USER}/${auth.currentUser.uid}`),
    ...deckDetails
  }).then(ref =>{
    deckId                              = ref.id
    var index                           = 0
    var cards = values.cards.reduce((result, card) =>{
      var tmpCard = {
        ...cleanCardValues(card),
        index                           : index++
      }
      if(tmpCard.front != "" && tmpCard.back != ""){
        result.push(database.collection(dbConst.COL_DECKS).doc(deckId).collection(dbConst.DECKS_CARDS).add(tmpCard))
      }
      return result
    }, [])
    cards.push(startAddOrEditCreatedDeckRef(auth.currentUser.uid, deckId, deckDetails))
    return Promise.all(cards)
  }).then(ref=>{
    return { success: true, deckId }
  }).catch(e =>{
    console.log("startAddDeck", e)
    return { success: false, ...e };
  })
}

export const editDeck = (deckId, detailsEdited, toAdd, toDelete, toEdit) =>{
  var databaseActions = []
  const { startAddOrEditCreatedDeckRef } = accounts

  toAdd.forEach(card =>{
    var tmpCard = {...cleanCardValues(card)}
    databaseActions.push(database.collection(dbConst.COL_DECKS).doc(deckId).collection(dbConst.DECKS_CARDS).add(tmpCard))
  })
  toDelete.forEach(card =>{
    databaseActions.push(database.collection(dbConst.COL_DECKS).doc(deckId).collection(dbConst.DECKS_CARDS).doc(card.cardId).delete())
  })
  toEdit.forEach(card =>{
    var tmpCard = {...cleanCardValues(card)}
    databaseActions.push(database.collection(dbConst.COL_DECKS).doc(deckId).collection(dbConst.DECKS_CARDS).doc(card.cardId).set(tmpCard))
  })

  databaseActions.push(database.collection(dbConst.COL_DECKS).doc(deckId).set({
    ...detailsEdited,
    modified                            : firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true}))
  databaseActions.push(startAddOrEditCreatedDeckRef(auth.currentUser.uid, deckId, detailsEdited))

  return Promise.all(databaseActions).then(()=>{
    return { success: true }
  }).catch(e =>{
    console.log("editDeck", e)
    return { success: false, ...e };
  })
}

export const deleteDeck = deckId =>{
  const { deleteAtPath }                = firebaseFunctions

  return database.collection(dbConst.COL_USER).doc(auth.currentUser.uid).collection(dbConst.PROFILE_CREATED_DECKS).doc(deckId).delete().then(() =>{
    return deleteAtPath(`${dbConst.COL_DECKS}/${deckId}`)
  }).then(res=>{
    if (res.success){
      return { success: true }
    }else{
      throw res
    }
  }).catch(e =>{
    console.log("deleteDeck", e)
    return { success: false, ...e };
  })
}

// Get methods

export const getDeckDetails = id =>{
  var data                              = {}
  const { getUserProfile }              = accounts

  return getDeck(id).then(res =>{
    if (res.success){
      data                              = res.data
      return getUserProfile(data.owner.id)
    }else{
      throw (res)
    }
  }).then(res =>{
    if (res.success) {
      data.owner = {
        id: data.owner.id,
        ...res.data,
      }
      return {success: true, data}
    } else {
      throw (res)
    }
  }).catch(e => {
    console.log("getDeckDetails", e)
    return { success: false, ...e };
  })
}

export const getDeck = id =>{
  return database.collection(dbConst.COL_DECKS).doc(id).get().then(doc =>{
    if (!doc.exists){
      return { success: false, message: 'No such document!' }
    } else {
      return { success: true, data: doc.data() }
    }
  }).catch(e => {
    console.log("getDeck", e)
    return { success: false, ...e };
  })
}

export const getCards = id =>{
  return database.collection(dbConst.COL_DECKS).doc(id).collection(dbConst.DECKS_CARDS).orderBy('index').get().then(snapshot =>{
    return { success: true, data: snapshot.docs }
  }).catch(e => {
    console.log("getCards", e)
    return { success: false, ...e };
  })
}

export const getFollowerCount = id =>{
  return database.collection(dbConst.COL_DECKSUBCRIPTION).doc(id).get().then(doc =>{
    return { success: true, data: doc.exists ? doc.data().count : 0 }
  }).catch(e => {
    console.log("getFollowerCount", e)
    return { success: false, ...e };
  })
}

//Extra methods

const cleanCardValues = card =>{
  return {
    front                               : card.front.trim(),
    back                                : card.back.trim(),
    backSub                             : card.backSub.trim(),
    index                               : card.index ? card.index : 0,
  }
} 