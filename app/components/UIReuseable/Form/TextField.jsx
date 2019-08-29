import React from 'react';
import PropTypes from 'prop-types';
import { Field, ErrorMessage } from 'formik';

const TextField = ({
  type,
  name,
  label,
}) =>{

  return(
    <div className="form-group">
      <label htmlFor="eventName">{label}</label>
      <Field type={type} className="form-control" placeholder={label} name={name} />
      <ErrorMessage component="div" className="form-text small text-danger" name={name} />
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
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

TextField.defaultProps = {
  type: "text"
}

export default TextField