import React from 'react'

const Header = ({ 
  name, 
  profilePic, 
  verified,
  isMe,
}) => {
  return(
    <div className="row p-3">
      <div className="col">
        <img src={`${profilePic}?s=200`} className="img-thumbnail" />
      </div>
      <div className="col-10">
        <div className="h3">
          {name}
        </div>
      </div>
    </div>
  )
}

export default Header
