import axios from 'axios';
import React, { useState } from 'react';
import { FaBars } from "react-icons/fa";
import { Formik, Field, FieldArray } from 'formik';
import { Random } from "random-js";
import { 
  SortableContainer, 
  SortableElement,
  SortableHandle, 
} from 'react-sortable-hoc';
var HtmlToReactParser = require('html-to-react').Parser;
var sanitizeHtml = require('sanitize-html');

import { storageRef } from 'firebase'
import { firebaseFunctions } from 'actions';

import { decks } from 'actions'
import { TextField, SubmitButton } from 'reuse'
import Fallback from 'Fallback'


const CardForm = SortableElement(({
  arrayHelpers: {remove, insert},
  createEmptyCard,
  id: index, 
}) =>(
  <div className="form-group mb-3" >
    <div className="card w-100">
      <div className="card-header row m-0">
        <div className="mr-auto col d-flex align-items-center">
          <div className="h4 m-0 d-flex align-items-center text-muted">
            <DragHandle />
          </div>
          <div className="h4 mb-0 ml-2">
              {`Card #${index + 1}`}
          </div>
        </div>
        <div className="ml-auto col text-right">
            <button type="button" className="btn btn-success mr-3" onClick={() => insert(index, createEmptyCard())}>Insert Above</button>
          <button type="button" className="btn btn-danger" onClick={() => remove(index)}>Delete</button>
        </div>
      </div>
      <div className="card-body row">
        <div className="col-sm">
          <Field type="text" placeholder="Front" name={`cards.${index}.front`} component={TextField} />
          <Field type="hidden" placeholder="id" name={`cards.${index}.cardId`} component={TextField} />
          <Field type="hidden" placeholder="index" name={`cards.${index}.index`} component={TextField} />
        </div>
        <div className="col-sm">
          <Field type="text" placeholder="Back" name={`cards.${index}.back`} component={TextField} />
        </div>
        <div className="col-sm">
          <Field type="text" placeholder="Back (Bottom)" name={`cards.${index}.backSub`} component={TextField} />
        </div>
      </div>
    </div>
  </div>
))

const DragHandle = SortableHandle (() =>(
  <FaBars style={{ cursor: "move" }} />
))

const Deck = ({ initialValues, handleFormSubmission, createEmptyCard, editingDeck }) => {
  const [uploadStep, setUploadStep]       = useState(0)
  const [OCRFrontArray, setOCRFrontArray] = useState([])
  const [OCRBackArray, setOCRBackArray]   = useState([])
  const [OCRBackSelect, setOCRBackSelect] = useState(false)
  const [fileData, setFileData]           = useState([])
  const maxStep                           = 5

  const validate = values => {
    const errors                          = {};
    const { validateWYSIWYG }             = decks

    if(!values.name){
      errors['name']                      = 'Required';
    }

    var tmpCards                          = values.cards.filter(card =>{
      if (card.front.trim() == "" && card.back.trim() == "" && card.backSub.trim() == "") {
        return false
      }
      return true
    })

    if (tmpCards.length < 6){
      errors['cardParent']                     = 'A deck needs at least 6 cards';
    }
    if (tmpCards.length != 0){
      var cardErrors                      = []
      var haveError                       = false
      for (var i=0; i< values.cards.length; i++){
        const card                        = values.cards[i]
        var cardError                     = {}

        if (card.front.trim() == "" && card.back.trim() == "" && card.backSub.trim() == "") {
          cardErrors.push(cardError)
          continue
        }else{
          if(!card.front){
            cardError['front']            = 'Required';
          } else {
            let validation = validateWYSIWYG(card.front)
            if (validation instanceof Error){
              console.log(`${card.front} validation`, validation.message)
              cardError['front']          = validation.message;
            }
          }
          if(!card.back){
            cardError['back']             = 'Required';
          } else {
            let validation = validateWYSIWYG(card.back)
            if (validation instanceof Error) {
              console.log(`${card.back} validation`, validation.message)
              cardError['back'] = validation.message;
            }
          }
          if(card.backSub){
            let validation = validateWYSIWYG(card.backSub)
            if (validation instanceof Error) {
              console.log(`${card.backSub} validation`, validation.message)
              cardError['backSub'] = validation.message;
            }
          }
        }
        if (!jQuery.isEmptyObject(cardError)) 
          haveError                       = true
        cardErrors.push(cardError)
      }
      if(haveError) 
        errors['cards']                   = cardErrors
    }
    return errors
  }

  const DeckList = SortableContainer(({
    arrayHelpers,
    cards,
  }) => (
    <div>
      {
        cards && cards.length > 0 && (
          cards.map((card, index) =>
            <CardForm index={index} id={index} arrayHelpers={arrayHelpers} key={`card#${index}`} createEmptyCard={createEmptyCard} />)
        )
      }
    </div>
  ))

  const sortEnd = (arrayHelpers) =>({
    oldIndex, 
    newIndex,
  }) =>{
    arrayHelpers.move(oldIndex, newIndex)
  }

  const getUploadStepMessage = step =>{
    switch(step){
      case 1:
        return `(1/${maxStep}) Uploading the file`
      case 2:
        return `(2/${maxStep}) Processing the file`
      case 3:
        return `(3/${maxStep}) Getting text`
      case 4:
        return `(4/${maxStep}) Formatting the data`
      case 5:
        return `(5/${maxStep}) Cleaning Up`
    }
  }

  const renderUploadedDataPart = dataPart =>{
    var htmlToReactParser                 = new HtmlToReactParser();
    var reactElement = htmlToReactParser.parse(`${dataPart.page ? `<h3>Page ${dataPart.page}</h3>`: ""}<p>${dataPart.text}</p>`);

    return reactElement;
  }

  const uploadFile = (values, setFieldError, setFieldValue) =>{
    if(!values.file_filename){
      setFieldError("file", "required")
      return;
    } else if (!["application/pdf", "image/tiff"].includes(values.file_type) && values.file_type.indexOf("image") == -1){
      setFieldError("file", "accepted files are PDFs and images");
      return;
    } else if (!values.file_data) {
      setFieldError("file", "file is too large, the data cannot be loaded");
      return;
    }
    setFieldError("file", "");
    const { doOCRDocument, doOCRImage }   = firebaseFunctions
    const random                          = new Random();
    const fileName                        = random.hex(64);
    var fileRef                           = storageRef.child(`forOCR/files/${fileName}`)
    var resultsRef                        = []
    let pages                             = []

    const processDocument = () =>{
      return doOCRDocument(fileRef.bucket, fileRef.fullPath, fileName, values.file_type).then(res => {
        setUploadStep(3);
        if (res.success) {
          return storageRef.child(res.uri.replace(`gs://${fileRef.bucket}`, "")).listAll()
        } else {
          throw res.err
        }
      }).then(res => {
        let getURLs = res.items.reduce((result, item) => {
          resultsRef.push(storageRef.child(item.fullPath))
          result.push(storageRef.child(item.fullPath).getDownloadURL())
          return result
        }, [])
        return Promise.all(getURLs)
      }).then(urls => {
        let getData = urls.reduce((result, url) => {
          result.push(axios.get(url))
          return result
        }, [])
        return Promise.all(getData)
      }).then(reses => {
        setUploadStep(4);
        reses.map(res => {
          res.data.responses.map(data => {
            pages.push({
              page                        : data.context.pageNumber,
              text                        : sanitizeHtml(data.fullTextAnnotation ? data.fullTextAnnotation.text : "No Text found")
            })
          })
        })
        return true
      }).catch(err => err)
    }

    const processImage = () =>{
      return doOCRImage(fileRef.bucket, fileRef.fullPath, fileName).then(res =>{
        setUploadStep(4);
        pages.push({
          text                            : sanitizeHtml(res.text === false ? "No Text found" : res.text )
        })
        return true
      }).catch(err => err)
    }

    setUploadStep(1);
    fileRef.putString(values.file_data, 'data_url').then(snapshot =>{
      setUploadStep(2);
      return ["application/pdf", "image/tiff"].includes(values.file_type) ? processDocument() : processImage()
    }).then(res=>{
      if (res !== true) {
        throw res
      }
      setUploadStep(5);
      let deleteDataRefs = resultsRef.reduce((result, ref) =>{
        result.push(ref.delete())
        return result
      }, [])
      deleteDataRefs.push(fileRef.delete())
      return Promise.all(deleteDataRefs)
    }).then(() => {
      setFieldValue("file_filename", "")
      setFieldValue("file_data", "")
      setFieldValue("file_type", "")
      setUploadStep(6);
      setFileData(pages)
    }).catch(err =>{
      console.log("failed upload file", err.message ? err.message : err)
      setFieldValue("file_filename", "")
      setFieldValue("file_data", "")
      setFieldValue("file_type", "")
      setUploadStep(0)
      setFieldError("file", err.message);
    })
  }

  const addToArray = () => { //http://jsfiddle.net/YstZn/1/
    var text                              = '';
    const getTextSelected = obj =>{
      let paraText                        = obj.anchorNode.data || obj.baseNode.data
      let firstSelectIndex                = obj.anchorOffset || obj.baseOffset
      let lastSelectIndex                 = obj.extentOffset || obj.focusOffset
      console.log("selected Index", firstSelectIndex, lastSelectIndex, paraText)

      text                                = paraText.substring(firstSelectIndex, lastSelectIndex)
    }
    if (window.getSelection) {
      getTextSelected(window.getSelection())
    } else if (document.getSelection) {
      getTextSelected(document.getSelection())
    } else if (document.selection) {
      text                                = document.selection.createRange().text;
    }

    console.log("Selected Word", text)

    if (OCRBackSelect){
      let tmpOCRBackArray                 = OCRBackArray
      tmpOCRBackArray.push(text)
      setOCRBackArray(tmpOCRBackArray)
    }else{
      let tmpOCRFrontArray                = OCRFrontArray
      tmpOCRFrontArray.push(text)
      setOCRFrontArray(tmpOCRFrontArray)
    }

    setOCRBackSelect(!OCRBackSelect)
  }

  const addToForm = (values, setFieldValue) =>{
    if (OCRFrontArray.length == 0 && OCRBackArray.length == 0){
      return
    }

    let tmpCards                          = values.cards
    let frontSameAsBack                   = OCRFrontArray.length == OCRBackArray.length ? true : OCRBackArray.length - 1
    OCRFrontArray.forEach((front, i) =>{
      tmpCards.push({
        front,
        back                              : frontSameAsBack === true? OCRBackArray[i] : (frontSameAsBack == i ? "" : OCRBackArray[i]),
        backSub                           : "",
        cardId                            : "",
        index                             : -1,
      })
    })

    setOCRFrontArray([])
    setOCRBackArray([])
    setOCRBackSelect(false)
    setFieldValue("cards", tmpCards)
  }

  const resetForm = (values, setFieldValue) =>{
    addToForm(values, setFieldValue)
    setUploadStep(0)
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={(values, formikBag) => handleFormSubmission(values, formikBag).then(() => formikBag.setSubmitting(false))}
    >{({
      handleSubmit,
      values,
      errors,
      isSubmitting,
      dirty,
      setFieldValue,
      setFieldError,
    }) => (
      <form onSubmit={handleSubmit}>
        <div className="container-fluid bg-light sticky-top">
          <div className="row">
            <div className="container mt-3">
              <div className="form-group row py-2">
                <div className="col-xl-9">
                  <Field type="text" placeholder="Deck Name" name="name" component={TextField} />
                </div>
                <div className="col-xl-3">
                  <SubmitButton title={editingDeck ? "Save Deck" : "Add Deck"} className="w-100" {...{isSubmitting, dirty}} />
                  <small className="text-danger">{errors.cardParent}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col">
              <button type="button" className="btn btn-primary btn-block" data-toggle="modal" data-target="#uploadModal">Transcribe file</button>
            </div>
          </div>
        </div>
        <div className="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModal" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Transcribe document</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {
                  uploadStep == 0 && 
                    <Field type="file" placeholder="" name="file" component={TextField} onChange={e => {
                      var file = e.target.files[0];
                      var reader = new FileReader();
                      setFieldValue("file_filename", file.name);
                      reader.onload = function (item) {
                        setFieldValue("file_data", item.target.result);
                        setFieldValue("file_type", file.type);
                      };

                      reader.readAsDataURL(file);
                    }} />
                }
                {
                  uploadStep > 0 && uploadStep <= maxStep && 
                    <Fallback wholePage={false} message={getUploadStepMessage(uploadStep)}/>
                }
                {
                  uploadStep > maxStep &&
                    <div id="uploadedDataResult">
                      {fileData.map(data => renderUploadedDataPart(data))}
                    </div>
                }
              </div>
              <div className="modal-footer">
                <div className="container">
                  <div className="row">
                    {
                      uploadStep == 0 &&
                        <React.Fragment>
                          <div className="col text-right">
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => uploadFile(values, setFieldError, setFieldValue)}>Upload file</button>
                          </div>
                        </React.Fragment>
                    }
                    {
                      uploadStep > 0 && uploadStep <= maxStep &&
                        <div className="text-muted">This may take some time you can continue to edit your cards while we process the document</div>
                    }
                    {
                      uploadStep > maxStep &&
                        <React.Fragment>
                          <div className="col col-md-4">
                            <button type="button" className="btn btn-primary btn-block btn-sm" onClick={() => addToArray()}>{OCRBackSelect ? "Back" : "Front"} of card</button>
                          </div>
                          <div className="col col-md-4">
                            <button type="button" className="btn btn-primary btn-block btn-sm" onClick={() => addToForm(values, setFieldValue)}>Add to form</button>
                          </div>
                          <div className="col col-md-4">
                            <button type="button" className="btn btn-danger btn-block btn-sm" onClick={() => resetForm(values, setFieldValue)}>Upload Another</button>
                          </div>
                        </React.Fragment>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FieldArray name="cards" render={arrayHelpers => (
          <div className="container mt-2">
            <DeckList cards={values.cards} useDragHandle={true} arrayHelpers={arrayHelpers} onSortEnd={sortEnd(arrayHelpers)} />
            <div className="text-center mb-2">
              <button type="button" className="btn btn-success" onClick={() => arrayHelpers.push(createEmptyCard())}>Add a Card</button>
            </div>
          </div>
        )} />
      </form>
    )}
    </Formik>
  )
};

export default Deck;