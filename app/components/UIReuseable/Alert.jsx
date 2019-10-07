import React from 'react'
import PropTypes from 'prop-types';


const Alert = ({
  id,
  title,
  message,
  center,
  closeButtonText,
  extraButtons,
}) =>(
  <div className="modal fade" id={id}>
    <div className={`modal-dialog modal-dialog-scrollable ${center ? "modal-dialog-centered" : ""}`} role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id={`${id}ModalLabel`}>{title}</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">{message}</div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">{closeButtonText}</button>
          {
            extraButtons.length >= 0 &&
              extraButtons.map((btn, index)=>
                <button key={`${id}_btn_${index}`} type="button" className={`btn ${btn.className ? btn.className : "btn-danger"}`} onClick={()=>btn.func()} data-dismiss="modal">{btn.title}</button>  
              )
          }
        </div>
      </div>
    </div>
  </div>
)

Alert.propTypes ={
  id                        : PropTypes.string.isRequired,
  title                     : PropTypes.string.isRequired,
  message                   : PropTypes.string.isRequired,
  center                    : PropTypes.bool.isRequired,
  closeButtonText           : PropTypes.string.isRequired,
  extraButtons              : PropTypes.array,
}

Alert.defaultProps ={
  closeButtonText           : "Close",
  center                    : true,
  extraButtons              : [],
}

export default Alert