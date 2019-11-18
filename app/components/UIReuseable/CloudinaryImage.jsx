import React from 'react';
import { Image, Transformation } from 'cloudinary-react';
import PropTypes from 'prop-types';

const CloudinaryImage = ({
  img,
  className,
  quality,
  alt,
  width,
  height,
  gravity,
  crop,
}) => {
  let additionalDetails                 = {}
  if(width){
    additionalDetails['width']          = width
  }
  if (height){
    additionalDetails['height']         = height
  }
  if(width || height){
    additionalDetails['gravity']        = gravity ? gravity : "custom"
    additionalDetails['crop']           = crop ? crop : "thumb"
  }

  return (
    <Image cloudName={process.env.CLOUDINARY_NAME} publicId={img} {...{className, alt}}>
      <Transformation {...additionalDetails} quality={quality} />
    </Image>
  )
}

CloudinaryImage.propTypes = {
  img                                   : PropTypes.string.isRequired,
  className                             : PropTypes.string.isRequired,
  quality                               : PropTypes.number.isRequired,
  alt                                   : PropTypes.string.isRequired,
  width                                 : PropTypes.number,
  height                                : PropTypes.number,
  gravity                               : PropTypes.number,
  crop                                  : PropTypes.number,
}

CloudinaryImage.defaultProps = {
  className                             : "",
  quality                               : 70,
  alt                                   : ""
}

export default CloudinaryImage