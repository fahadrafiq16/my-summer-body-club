import React from 'react'
import { useSteps } from 'react-step-builder'

const StepProgress = () => {

    const { current, total, progress } = useSteps();

    return (
        <>

            <h2 className="text-2xl text-center font-semibold mb-4">Step {current}/{total}: Personal Information</h2>
            <progress className="custom-progress" value={progress} />
        </>
    )
}

export default StepProgress
