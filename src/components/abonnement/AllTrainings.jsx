import React from 'react'
import TrainingBox from './TrainingBox'
import { trainingDescription } from '../../data/PersonalTraining';
import { afvallenTrainingDescription } from '../../data/AfvallenTraining';
import { wedstrijdTrainingDescription } from '../../data/WedstrijdTraining';
import { groepPtTrainingDescription } from '../../data/GroepPT';
import {summerBodyTrainingDescription} from '../../data/Summerbody1jarig';

const AllTrainings = () => {
    return (
        <>

            <section id="our-trainings" className="md:my-[100px]">
                <div className="container max-w-[1110px] mx-auto">
                    <div className="section-title">
                        <h2>My Summerbody Club  <span>Abonnementen</span></h2>
                    </div>
                    <div className="our-trainers">
                    <TrainingBox trainingDescription={summerBodyTrainingDescription} />
                    </div>
                </div>
            </section>

            <section id="our-trainings" className="my-[100px]">
                <div className="container max-w-[1110px] mx-auto">
                    <div className="section-title">
                        <h2>Groups &amp; PT <span>Abonnementen</span></h2>
                    </div>
                    <div className="our-trainers">

                        <TrainingBox trainingDescription={trainingDescription} />
                        <TrainingBox trainingDescription={afvallenTrainingDescription} />
                        <TrainingBox trainingDescription={wedstrijdTrainingDescription} />
                        <TrainingBox trainingDescription={groepPtTrainingDescription} />

                    </div>
                </div>
            </section>
        </>
    )
}

export default AllTrainings
