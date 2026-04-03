import React from 'react'
import { useSteps } from 'react-step-builder'

const StepProgress = ({title}) => {

    const { current, total, progress } = useSteps();

    return (
        <>

            <h2 className="text-2xl text-center font-semibold mb-4">Step {current}/{total}: {title}</h2>
            <progress className="custom-progress" value={progress} />
        </>
    )
}

export default StepProgress
