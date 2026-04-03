import React from 'react'
import { useSteps } from 'react-step-builder';

const PrevButton = ({title}) => {

    const { next, prev } = useSteps();

    return (
        <button
            type="button"
            onClick={prev}
            className="bg-[#2D3A8E] text-white px-4 py-2 mt-4 flex-1"
        >
            {title}
        </button>
    )
}

export default PrevButton
