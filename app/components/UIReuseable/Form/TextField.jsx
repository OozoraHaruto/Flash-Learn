import React from 'react';
import PropTypes from 'prop-types';

const TextField = ({
  field, 
  form: { touched, errors },
  type,
  placeholder,
  ...props
}) => {
  var checkValid = () => {
    if (touched[field.name] && errors[field.name]) {
      return "is-invalid"
    } else if (touched[field.name]) {
      return "is-valid"
    }
  }

  return(
    <div className="mb-3">
      <div className="form-group">
        <input className={`form-control-borderless ${checkValid()}`} {...field} {...props} placeholder={placeholder} type={type}/>
        <label className={checkValid()} htmlFor={field.name}>{placeholder}</label>
        <span className={`focus-border ${checkValid()}`}></span>
      </div>
      {(checkValid() == "is-invalid") && <div className="error">{errors[field.name]}</div>}
    </div>
  )
}

TextField.propTypes = {
  type: PropTypes.oneOf([
    'button',
    'checkbox',
    'color',
    'date',
    'datetime-local',
    'email',
    'file',
    'hidden',
    'image',
    'month',
    'number',
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week'
  ]),
  placeholder: PropTypes.string.isRequired,
}

TextField.defaultProps = {
  type: "text"
}

export default TextField;