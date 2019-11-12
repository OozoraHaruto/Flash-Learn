import firebase, { auth, database } from 'firebase';
var XRegExp = require('xregexp');
var HtmlToReactParser = require('html-to-react').Parser;
var sanitizeHtml = require('sanitize-html');

import * as dbConst from 'databaseConstants'
import * as rConst from "reduxConstants";
import {
  TEST_MCQ,
  TEST_OPENENDED,
  TEST_TRUEFALSE,
  TEST_ULTIMATE,
} from 'componentConstants'

import { accounts, firebaseFunctions } from 'actions';

export const startAddDeck = values =>{
  const {startAddOrEditCreatedDeckRef}  = accounts
  var deckId                            = ""
  var deckDetails = {
    name                                : values.name.trim(),
    public                              : true,
    searchTerms                         : cleanNameAndConvertToArray(values.name),
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
    cards.splice(0, 0, startAddOrEditCreatedDeckRef(auth.currentUser.uid, deckId, deckDetails))
    cards.splice(0, 0, addEmptyDeckSubscription(deckId))
    return Promise.all(cards)
  }).then(ref=>{
    return { success: true, deckId }
  }).catch(e =>{
    console.log("startAddDeck", e)
    return { success: false, ...e };
  })
}

const addEmptyDeckSubscription = deckId =>{
  return database.collection(dbConst.COL_DECKS_LIKED).doc(deckId).set({
    count                               : 0
  }).then(() => {
    return { success: true }
  }).catch(e => {
    console.log("addEmptyDeckSubscription", e)
    return { success: false, ...e };
  })
}

export const editDeck = (deckId, detailsEdited, toAdd, toDelete, toEdit) =>{
  var databaseActions                   = []
  const { startAddOrEditCreatedDeckRef }= accounts
  let details = {
    ...detailsEdited,
    modified                            : firebase.firestore.FieldValue.serverTimestamp(),
  }
  if (detailsEdited.name){
    details["searchTerms"]              = cleanNameAndConvertToArray(detailsEdited.name)
  }

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

  databaseActions.push(database.collection(dbConst.COL_DECKS).doc(deckId).set(details, { merge: true}))
  databaseActions.push(startAddOrEditCreatedDeckRef(auth.currentUser.uid, deckId, detailsEdited))

  if (toAdd.length > 0 || toDelete.length > 0 || toEdit.length > 0){
    databaseActions.push(deleteLeaderboard(TEST_MCQ, deckId))
    databaseActions.push(deleteLeaderboard(TEST_OPENENDED, deckId))
    databaseActions.push(deleteLeaderboard(TEST_TRUEFALSE, deckId))
    databaseActions.push(deleteLeaderboard(TEST_ULTIMATE, deckId))
  }

  return Promise.all(databaseActions).then(()=>{
    return { success: true }
  }).catch(e =>{
    console.log("editDeck", e)
    return { success: false, ...e };
  })
}

export const deleteDeck = deckId =>{
  const { 
    deleteAtPath,
    deleteUsersLikedToDeck,
  }                                     = firebaseFunctions

  return database.collection(dbConst.COL_USER).doc(auth.currentUser.uid).collection(dbConst.PROFILE_CREATED_DECKS).doc(deckId).delete().then(() =>{
    return getLikes(deckId)
  }).then(res=>{
    var serverActions                   = []

    if (res.data.length > 50){
      var paths = res.data.map(user => {
        return `${dbConst.COL_USER}/${user.id}/${dbConst.PROFILE_LIKED_DECKS}/${deckId}`
      })
      serverActions.push(deleteUsersLikedToDeck(deckId, paths))
    }else{
      serverActions = res.data.map(user =>{
        return database.collection(dbConst.COL_USER).doc(user.id).collection(dbConst.PROFILE_LIKED_DECKS).doc(deckId).delete()
      })
    }
    serverActions.splice(0, 0, deleteAtPath(`${dbConst.COL_DECKS_LIKED}/${deckId}`))
    serverActions.splice(0, 0, deleteAtPath(`${dbConst.COL_DECKS}/${deckId}`))
    serverActions.push(deleteLeaderboard(TEST_MCQ, deckId))
    serverActions.push(deleteLeaderboard(TEST_OPENENDED, deckId))
    serverActions.push(deleteLeaderboard(TEST_TRUEFALSE, deckId))
    serverActions.push(deleteLeaderboard(TEST_ULTIMATE, deckId))
    return Promise.all(serverActions)
  }).then(() =>{
    return {success: true}
  }).catch(e =>{
    console.log("deleteDeck", e)
    return { success: false, ...e };
  })
}

const deleteLeaderboard = (testType, deckId) =>{
  const { deleteAtPath }                = firebaseFunctions

  return deleteAtPath(`${dbConst.COL_LEADERBOARD}/${testType}/${dbConst.COL_DECKS}/${deckId}`).then(() =>{
    return {success: true}
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
        id                              : data.owner.id,
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

export const getDeckTopLeaderboard = (testType, deckId) => {
  return database.collection(dbConst.COL_LEADERBOARD).doc(testType).collection(dbConst.COL_DECKS).doc(deckId).collection(dbConst.COL_USER).orderBy('timeMillis').limit(3).get().then(snapshot => {
    return { success: true, data: snapshot.docs.length == 0 ? false : snapshot.docs }
  }).catch(e => {
    console.log("getDeckTopLeaderboard", e)
    return { success: false, ...e };
  })
}

export const getLikeCount = id =>{
  return database.collection(dbConst.COL_DECKS_LIKED).doc(id).get().then(doc =>{
    return { success: true, data: doc.exists ? doc.data().count : 0 }
  }).catch(e => {
    console.log("getLikeCount", e)
    return { success: false, ...e };
  })
}

const getLikes = id =>{
  return database.collection(dbConst.COL_DECKS_LIKED).doc(id).collection(dbConst.COL_USER).get().then(snapshot => {
    return { success: true, data: snapshot.docs }
  }).catch(e => {
    console.log("getLikes", e)
    return { success: false, ...e };
  })
}

export const searchForDeck = name =>{
  const { getUserProfile }              = accounts
  const searchTerms                     = cleanNameAndConvertToArray(name, false)
  let resultSnapshots                   = []
  let usersRedundantList                = []
  let users                             = {}
  let queries                           = []

  const calculateRelevance = doc =>{
    const formatDeck = (additionalData={}) =>{
      return{
        id                              : doc.id,
        ...doc.data(),
        modified                        : doc.data().modified.toMillis(),
        ...additionalData,
      }
    }
    if (name == ""){ return formatDeck() }
    if (name == doc.data().name) { return formatDeck({ relevance: 99999}) }

    let relevance                       = 0
    let notIn                           = []

    searchTerms.map(term =>{
      if (doc.data().searchTerms.includes(term)){
        relevance                      += 1
      }else{
        notIn.push(term)
      }
    })
    return formatDeck({relevance, notIn})
  }

  if (name != ""){
    queries = searchTerms.map(term =>{
      return database.collection(dbConst.COL_DECKS).where("searchTerms", "array-contains", term).get()
    })
  }else{
    queries.push(database.collection(dbConst.COL_DECKS).get())
  }
  

  return Promise.all(queries).then(responses =>{
    let snapshotRedundantList           = []
    let getUserData                     = []

    responses.map(snapshots =>{
      snapshots.docs.map(doc =>{
        if (!snapshotRedundantList.includes(doc.id)){
          resultSnapshots.push(calculateRelevance(doc))
          snapshotRedundantList.push(doc.id)

          if (!usersRedundantList.includes(doc.data().owner.id)) {
            getUserData.push(getUserProfile(doc.data().owner.id))
            usersRedundantList.push(doc.data().owner.id)
          }
        }
      })
    })
    return Promise.all(getUserData)
  }).then(resUsers =>{
    resUsers.forEach((user, index) =>{
      users[usersRedundantList[index]] = {
        displayName                     : user.data.displayName,
        photoURL                        : user.data.photoURL
      }
    })
    return {
      success                           : true, 
      decks                             : resultSnapshots,
      users,
    }
  }).catch(e => {
    console.log("searchForDeck", e)
    return { success: false, ...e };
  })
}

// Redux methods
// - Current Deck

export const addDeckToRedux = (id, name, cards) => {
  return {
    type: rConst.ADD_CURRENT_DECK,
    info: {
      id,
      name,
      cards,
    }
  }
}

export const deleteReduxDeck = () => {
  return {
    type: rConst.DELETE_CURRENT_DECK
  }
}

// - Tests
export const addTestToRedux = (id, testType, name, questions, qualifiedForLeaderboard) => {
  return {
    type: rConst.ADD_TEST,
    info: {
      id,
      testType,
      name,
      questions,
      leaderboard                       : qualifiedForLeaderboard
    }
  }
}

export const shuffleQuestionsReduxTest = () => {
  return {
    type: rConst.EDIT_TEST_SHUFFLE
  }
}

export const deleteReduxTest = () => {
  return {
    type: rConst.DELETE_TEST
  }
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

const cleanNameAndConvertToArray = (name, addFull=true) =>{
  let search                            = XRegExp('([^?<first>\\pL ]+)');
  let strKeywords                       = XRegExp.replace(name.trim().toLowerCase(), search, ' ', "all");
  let arrKeywords                       = strKeywords.split(" ").reduce((result, keyword) =>{
    if (keyword != " " && keyword != "" && !result.includes(keyword)){
      result.push(keyword)
    }
    return result
  }, [])
  addFull && arrKeywords.push(name.trim().toLowerCase())

  return arrKeywords
}

//- WYSIWYG functions

const WYSIWYG_ALLOWED_TAGS_STYLE        = ["b", "s", "u", "sup", "sub"]
const WYSIWYG_ALLOWED_TAGS_FORMAT       = ["rby"]
const getIndexListOfString = (text, item) => {
  let indexes                           = []

  do {
    let tmpIndex = text.indexOf(item, indexes.length == 0 ? 0 : indexes[indexes.length - 1] + 1)
    if (tmpIndex == -1) {
      break
    }
    indexes.push(tmpIndex)
  } while (true)
  return indexes
}

const getTag = (text, frontIndex, endIndex, styles, format) => {
  let bracketContent                    = text.substring(frontIndex + 1, endIndex)
  let bracketData                       = {}
  const validateTag = data => {
    if (styles.includes(data.tag) || format.includes(data.tag)) {
      return data
    } else {
      return false
    }
  }

  bracketData["front"]                  = bracketContent.indexOf("/") == -1

  if (bracketData.front) {
    bracketContent                      = bracketContent.split("=")
    bracketData["tag"]                  = bracketContent[0]

    if (bracketContent.length > 1) {
      bracketData["extraData"]          = bracketContent[1]
    }
  } else {
    bracketData["tag"]                  = bracketContent.substring(1)
  }

  return validateTag(bracketData)
}

export const validateWYSIWYG = text => {
  let frontIndex                        = getIndexListOfString(text, "[")
  let backIndex                         = getIndexListOfString(text, "]")
  if (frontIndex.length == 0 && backIndex.length == 0){
    return true
  }

  try {
    let currentList                     = []
    let toRemoveIndexList               = []

    if (frontIndex.length != backIndex.length) {
      throw new Error("There is an '[' without  the ']' ")
    }

    let tags = frontIndex.reduce((result, front, i) => {
      let data = getTag(text, frontIndex[i], backIndex[i], WYSIWYG_ALLOWED_TAGS_STYLE, WYSIWYG_ALLOWED_TAGS_FORMAT)
      if (data != false) {
        result.push(data)
      }else{
        toRemoveIndexList.push(i)
      }
      return result
    }, [])

    for (let i=toRemoveIndexList.length-1; i>=0; i--){
      let index                           = toRemoveIndexList[i]
      frontIndex.splice(index, 1)
      backIndex.splice(index, 1)
    }

    if (frontIndex.length % 2 != 0 || backIndex.length % 2 != 0) {
      throw new Error("Missing close/open tag")
    }

    tags.forEach((tag, index) => {
      if (tag.front) {
        currentList.push({
          tag,
          backIndex                     : backIndex[index]
        })
      } else {
        let listLastItem                = currentList[currentList.length - 1]

        if (tag.tag == listLastItem.tag.tag) {
          currentList.splice(currentList.length - 1, 1)
        }
      }
    })

    if (currentList.length != 0) {
      throw new Error("There is missing close tag for tag at index:" + currentList[0].backIndex)
    }

    return {
      front                             : frontIndex,
      back                              : backIndex,
      tags                              : tags
    }
  } catch (e) {
    console.log(e)
    return e
  }
}

export const formatAsHTML = text => {
  let stringHTML                        = ""
  let lastStringIndex                   = 0
  let currentList                       = []
  let innerHTML                         = {}
  let textData                          = validateWYSIWYG(text)

  const sanitize = html => {
    let newHTML                         = sanitizeHtml(html, {
      allowedTags                       : WYSIWYG_ALLOWED_TAGS_STYLE.concat(["ruby", "rt", "br"]),
      allowedAttributes                 : {}
    })
    newHTML                             = newHTML.replace("\\n", "<br />")

    return newHTML
  }

  if(textData === true){
    return sanitize(text)
  }else if (textData.tags.length == 0){
    return sanitize(text)
  }

  const checkIfInnerHTMLOrString = (html, fullString) => {
    let newHTML                         = innerHTML.html ? html.replace(innerHTML.fullString, innerHTML.html) : html
    if (currentList.length == 0) {
      stringHTML                        = stringHTML + newHTML
      innerHTML                         = {}
    } else {
      innerHTML = {
        html                            : newHTML,
        fullString,
      }
    }
  }
  textData.tags.forEach((tag, index) => {
    if (tag.front) {
      if (currentList.length == 0) {
        stringHTML                      = stringHTML + text.substring(lastStringIndex, textData.front[index])
        lastStringIndex                 = textData.front[index]
      }
      currentList.push({
        tag,
        frontIndex: textData.front[index],
        backIndex: textData.back[index]
      })
    } else {
      let listLastItem                  = currentList[currentList.length - 1]

      if (listLastItem.tag.tag == tag.tag) {
        let dataInBetweenTags           = text.substring(listLastItem.backIndex + 1, textData.front[index])
        currentList.splice(currentList.length - 1, 1)

        if (listLastItem.tag.extraData) {
          switch (tag.tag) {
            case "rby":
              checkIfInnerHTMLOrString("<ruby>" + dataInBetweenTags + "<rt>" + listLastItem.tag.extraData + "</rt></ruby>", text.substring(listLastItem.frontIndex, textData.back[index] + 1))
              break
          }
        } else {
          checkIfInnerHTMLOrString("<" + tag.tag + ">" + dataInBetweenTags + "</" + tag.tag + ">", text.substring(listLastItem.frontIndex, textData.back[index] + 1))

        }
      }
      if (currentList.length == 0) {
        lastStringIndex                 = textData.back[index] + 1
      }
    }
  })
  stringHTML                            = stringHTML + text.substring(lastStringIndex)
  stringHTML                            = sanitize(stringHTML)
  return stringHTML
}

export const formatAsHTMLElement = text =>{
  var htmlToReactParser                 = new HtmlToReactParser();
  return htmlToReactParser.parse(formatAsHTML(text))
}