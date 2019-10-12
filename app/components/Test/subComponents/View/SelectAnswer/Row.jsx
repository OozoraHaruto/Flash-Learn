import React from 'react'

import Option from 'app/components/Test/subComponents/View/SelectAnswer/Option'

const Row = ({
  options,
  userAnswered,
}) => {
  return (
    <div className="flex-fill d-flex">
      <Option data={options[0]} userAnswered={userAnswered} className="mr-1"/>
      <Option data={options[1]} userAnswered={userAnswered} className="ml-1" />
    </div>
  )
}

export default Row