import React from 'react'
import { useSteps } from 'react-step-builder';
import { useFormContext } from '../../contex/FormContex'

const NextButton = ({ title }) => {


  return (
    <button type="submit" className="bg-[#F04D17] text-white px-4 py-2 mt-4 flex-1">
      {title}
    </button>
  )
}

export default NextButton
