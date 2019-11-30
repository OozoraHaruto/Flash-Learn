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
    console.log("render Data", dataPart);
    var htmlToReactParser                 = new HtmlToReactParser();
    var reactElement = htmlToReactParser.parse(`<h3>${dataPart.page}</h3><p>${dataPart.text}</p>`);

    return reactElement;
  }

  const uploadFile = (values, setFieldError) =>{
    if(!values.file_filename){
      setFieldError("file", "required")
      return;
    } else if (!["application/pdf", "image/tiff"].includes(values.file_type)){
      setFieldError("file", "accepted file types are pdf and tiff");
      return;
    } else if (!values.file_data) {
      setFieldError("file", "file is too large, the data cannot be loaded");
      return;
    }
    setFieldError("file", "");
    const { doOCR }                       = firebaseFunctions
    const random                          = new Random();
    const fileName                        = random.hex(64);
    var fileRef                           = storageRef.child(`forOCR/files/${fileName}`)
    var resultsRef                        = []
    let pages                             = []

    setUploadStep(1);
    fileRef.putString(values.file_data, 'data_url').then(snapshot =>{
      setUploadStep(2);
      return doOCR(fileRef.bucket, fileRef.fullPath, fileName, values.file_type)
    }).then(res =>{
      setUploadStep(3);
      if (res.success){
        return storageRef.child(res.uri.replace(`gs://${fileRef.bucket}`, "")).listAll()
      }else{
        throw res.err
      }
    }).then(res=>{
      let getURLs = res.items.reduce((result, item) =>{
        resultsRef.push(storageRef.child(item.fullPath))
        result.push(storageRef.child(item.fullPath).getDownloadURL())
        return result
      }, [])
      return Promise.all(getURLs)
    }).then(urls =>{
      let getData = urls.reduce((result, url) =>{
        result.push(axios.get(url))
        return result
      }, [])
      return Promise.all(getData)
    }).then(reses=>{
      setUploadStep(4);
      reses.map(res =>{
        res.data.responses.map(data =>{
          pages.push({
            page                          : data.context.pageNumber,
            text                          : sanitizeHtml(data.fullTextAnnotation.text)
          })
        })
      })
      setUploadStep(5);
      let deleteDataRefs = resultsRef.reduce((result, ref) =>{
        result.push(ref.delete())
        return result
      }, [])
      deleteDataRefs.push(fileRef.delete())
      return Promise.all(deleteDataRefs)
    }).then(() =>{
      setUploadStep(6);
      setFileData(pages)
    }).catch(err =>{
      console.log("failed upload file", err.message)
      setUploadStep(0)
      setFieldError("file", err.message);
    })
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
              <button type="button" className="btn btn-primary btn-block" data-toggle="modal" data-target="#uploadModal">Upload file</button>
            </div>
          </div>
        </div>
        <div className="modal fade" id="uploadModal" tabindex="-1" data-backdrop="static" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered  modal-xl" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Upload File</h5>
              </div>
              <div className="modal-body">
                {
                  uploadStep == 0 && 
                    <Field type="file" placeholder="Upload a file" name="file" component={TextField} onChange={e => {
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
                {
                  uploadStep == 0 &&
                    <React.Fragment>
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary" onClick={() => uploadFile(values, setFieldError)}>Upload file</button>
                    </React.Fragment>
                }
                {
                  uploadStep > maxStep &&
                    <React.Fragment>
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </React.Fragment>
                }
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