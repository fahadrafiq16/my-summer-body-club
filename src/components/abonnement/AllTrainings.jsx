import React from 'react'
import TrainingBox from './TrainingBox'
import { trainingDescription } from '../../data/PersonalTraining';
import { afvallenTrainingDescription } from '../../data/AfvallenTraining';
import { wedstrijdTrainingDescription } from '../../data/WedstrijdTraining';
import { groepPtTrainingDescription } from '../../data/GroepPT';

const AllTrainings = () => {
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
