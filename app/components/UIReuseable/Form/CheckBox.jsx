import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik'

const CheckBox = ({
  field,
  form: { touched, errors },
  type,
  placeholder,
  ...props
}) => {
  const checkValid = () => {
    if (getIn(touched, field.name) && getIn(errors, field.name)) {
      return "is-invalid"
    } else if (getIn(touched, field.name)) {
      return "is-valid"
    }
  }

  return (
    <div className="mb-3">
      <div className="form-group">
        <div className="form-check">
          <input className={`form-check-input ${checkValid()}`} {...field} {...props} type="checkbox" />
          <label className={`position-static ${checkValid()}`} htmlFor={field.name}>{placeholder}</label>
        </div>
      </div>
      {(checkValid() == "is-invalid") && <div className="error">{getIn(errors, field.name)}</div>}
    </div>
  )
}

CheckBox.propTypes = {
  placeholder: PropTypes.string.isRequired,
}

export default CheckBox;