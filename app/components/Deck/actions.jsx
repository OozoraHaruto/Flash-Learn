import firebase, { auth, database } from 'firebase';
import * as dbConst from 'databaseConstants'
import * as rConst from "reduxConstants";

import {accounts} from 'actions';

export const startAddDeck = values =>{
  const { startAddCreatedDeckRef } = accounts
  var deckId = ""

  return database.collection(dbConst.COL_DECKS).add({
    modified                  : firebase.firestore.FieldValue.serverTimestamp(),
    name                      : values.name,
    owner                     : database.doc(`/${dbConst.COL_USER}/${auth.currentUser.uid}`),
    public                    : !values.shownPublic ? false : values.shownPublic ,
  }).then(ref =>{
    deckId                    = ref.id
    var cards = values.cards.reduce((result, card) =>{
      var tmpCard = {
        front: card.front.trim(),
        back: card.back.trim(),
        backSub: card.backSub.trim(),
      }
      if(tmpCard.front != "" && tmpCard.back != ""){
        result.push(database.collection(dbConst.COL_DECKS).doc(deckId).collection(dbConst.DECKS_CARDS).add(tmpCard))
      }
      return result
    }, [])
    cards.push(startAddCreatedDeckRef(auth.currentUser.uid, deckId))
    return Promise.all(cards)
  }).then(ref=>{
    return { success: true, deckId }
  }).catch(e =>{
    console.log("startAddDeck", e)
    return { success: false, ...e };
  })
}

export const getDeckDetails = (id) =>{
  var data = {}
  const { getUserProfile } = accounts

  return getDeck(id).then(res =>{
    if (res.success){
      data = res.data
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

export const getDeck = (id) =>{
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

export const getCards = (id) =>{
  return database.collection(dbConst.COL_DECKS).doc(id).collection(dbConst.DECKS_CARDS).get().then(snapshot =>{
    return { success: true, data: snapshot.docs }
  }).catch(e => {
    console.log("getDeck", e)
    return { success: false, ...e };
  })
}