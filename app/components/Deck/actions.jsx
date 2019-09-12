import firebase, { auth, database } from 'firebase';
import * as dbConst from 'databaseConstants'
import * as rConst from "reduxConstants";


export const startAddDeck = values =>{
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
    return Promise.all(cards)
  }).then(ref=>{
    return { success: true, deckId }
  }).catch(e =>{
    console.log("startAddDeck", e)
    return {success: false, message: e.message}
  })
}