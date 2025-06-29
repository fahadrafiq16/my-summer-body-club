import React from 'react'
import TrainingBox from './TrainingBox'
import { trainingDescription } from '../../data/PersonalTraining';
import { afvallenTrainingDescription } from '../../data/AfvallenTraining';
import { wedstrijdTrainingDescription } from '../../data/WedstrijdTraining';
import { groepPtTrainingDescription } from '../../data/GroepPT';
import { summerBodyTrainingDescription } from '../../data/Summerbody1jarig';
import LifeStyle from '../../components/home/LifeStyle';
import GroepImg from '../../images/img-4.png';
import GewichtsverliesImg from '../../images/img-5.png';
import personalImg from '../../images/img-6.png';
import Weight175 from '../../images/175 weight.jpg'

const lifeStyle = [
    {
        img: GroepImg,
        title: 'Groepstraining',
        description: `Onze groepstrainingen combineren kracht, cardio en functionele oefeningen, afgestemd op jouw niveau. Je traint in een energieke groep, waarin iedereen elkaar motiveert om het beste uit zichzelf te halen.\n\nExtra begeleiding in kleine groepjes met GroepsPT (1-op-2 / 1-op-3).`,
    },
    {
        img: personalImg,
        title: 'Personal Coaching',
        description: `Individuele coaching volledig afgestemd op jouw doelen: afvallen, spieropbouw, fit worden of werken aan een blijvende gezonde levensstijl. Persoonlijke aandacht en maximale resultaten!`,
    },
    {
        img: GroepImg,
        title: 'Gewichtsverlies',
        description: `Wil jij op een gezonde én effectieve manier afvallen? Bij My Summerbody Club helpen we je niet alleen met training, maar ook met een doordacht plan voor voeding, mindset en leefstijl.\n\nWe focussen op duurzaam gewichtsverlies, zonder crashdiëten. Of je nu 5 of 25 kilo kwijt wilt — met de juiste begeleiding, structuur en motivatie blijf jij gemotiveerd en zie je resultaat.`,
    },
    {
        img: personalImg,
        title: 'Podiumbegeleiding',
        description: `Wil jij schitteren op het podium? Wij begeleiden je stap voor stap richting jouw bodybuildingwedstrijd of Miss Bikini-competitie.\n\nFocus op houding, techniek, posing, voeding, spieropbouw, vetverlies en een ijzersterke mindset.`,
    },
];


const AllTrainings = () => {
    return (
        <>

            <section id="our-trainings" className="md:my-[0px]">
                <div className="container max-w-[1110px] mx-auto">
                    <div className="section-title">
                        <h2>My Summerbody Club  <span>Abonnementen</span></h2>
                    </div>
                    <div className="our-trainers">
                        <TrainingBox trainingDescription={summerBodyTrainingDescription} />
                    </div>

                    <div className="begin-lifestyle md:my-[100px]">

                        {
                            lifeStyle.map((style) => (
                                <LifeStyle style={style} />
                            ))
                        }

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
