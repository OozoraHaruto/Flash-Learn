import React from 'react'

import Row from 'app/components/Test/subComponents/StartTest/SelectAnswer/Row'

const SelectAnswer = ({
  options,
  userAnswered
}) => {
  const generateRows = () =>{
    var optionRows            = []

    for(var i = 0; i < options.length; i=i+2){
      optionRows.push([options[i],options[(i+1)]])
    }

    return optionRows
  }

  return (
    <div className="flex-grow-1 mt-2 d-flex flex-column">
      {
        generateRows().map((row, index) => <Row key={`row_${index}`} options={row} userAnswered={userAnswered} />)
      }
    </div>
  )
}

export default SelectAnswer