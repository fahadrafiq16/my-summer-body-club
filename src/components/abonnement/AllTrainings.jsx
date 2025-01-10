import React from 'react'
import TrainingBox from './TrainingBox'

const AllTrainings = ({trainingDescription,afvallenTrainingDescription,wedstrijdTrainingDescription,groepPtTrainingDescription}) => {
    return (
        <>
            <TrainingBox trainingDescription={trainingDescription} />
            <TrainingBox trainingDescription={afvallenTrainingDescription} />
            <TrainingBox trainingDescription={wedstrijdTrainingDescription} />
            <TrainingBox trainingDescription={groepPtTrainingDescription} />
        </>
    )
}

export default AllTrainings
