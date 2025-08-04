import React from 'react'
import TrainingBox from './TrainingBox'
import { trainingDescription } from '../../data/PersonalTraining';
import { afvallenTrainingDescription } from '../../data/AfvallenTraining';
import { wedstrijdTrainingDescription } from '../../data/WedstrijdTraining';
import { groepPtTrainingDescription } from '../../data/GroepPT';
import { summerBodyTrainingDescription } from '../../data/Summerbody1jarig';
import {summerBodyTrainingDescription6Maanden} from '../../data/Summerbody6maanden';
import { summerBodyTrainingDescriptionFlex } from '../../data/SummerBodyFlex';

import LifeStyle from '../../components/home/LifeStyle';


import Gym180 from '../../images/180 GyM Comminityl.png'

import personalImg from '../../images/new6.png';
import Weight175 from '../../images/new5.png'
import GewichtsverliesImg from '../../images/new4.png';
import GroepImg from '../../images/new7.png';


import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';



const lifeStyleMain = [
    {
        img: Gym180,
        title: 'Groepstraining',
        description: `My Summerbody Club is geen standaard gym. Wij zijn een hechte summerbody community — een familie van gemotiveerde sporters die samen groeien. Bij ons draait het om respect: voor elkaar, voor de apparatuur én voor de ruimte waarin we trainen. Kwaliteit, hygiëne en samenhorigheid staan bij ons hoog in het vaandel. Bij ons train je niet alleen… je hoort erbij.`,
    },


];

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
        img: Weight175,
        title: 'Gewichtsverlies',
        description: `Wil jij op een gezonde én effectieve manier afvallen? Bij My Summerbody Club helpen we je niet alleen met training, maar ook met een doordacht plan voor voeding, mindset en leefstijl.\n\nWe focussen op duurzaam gewichtsverlies, zonder crashdiëten. Of je nu 5 of 25 kilo kwijt wilt —`,
    },
    {
        img: GewichtsverliesImg,
        title: 'Wedstrijd Training',
        description: `Wil jij schitteren op het podium? Wij begeleiden je stap voor stap richting jouw bodybuildingwedstrijd of Miss Bikini-competitie.\n\nFocus op houding, techniek, posing, voeding, spieropbouw, vetverlies en een ijzersterke mindset.`,
    },
];


const AllTrainings = () => {
    return (
        <>
            <div className="container life-style-main max-w-[600px] mx-auto">
                <div className="begin-lifestyle md:my-[50px]">

                    {
                        lifeStyleMain.map((style) => (
                            <LifeStyle style={style} />
                        ))
                    }

                </div>
            </div>
            <section id="our-trainings" className="md:my-[0px]">
                <div className="container max-w-[1110px] mx-auto">
                    <div className="section-title">
                        <h2>My Summerbody Club  <span>Abonnementen</span></h2>
                    </div>
                    <div className="our-trainers">
                        <TrainingBox trainingDescription={summerBodyTrainingDescription} />
                        <TrainingBox trainingDescription={summerBodyTrainingDescription6Maanden} />
                        <TrainingBox trainingDescription={summerBodyTrainingDescriptionFlex} />
                    </div>

                    <div className="begin-lifestyle begin-lifestyle-home md:my-[100px]">

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



                    <Swiper
                        // install Swiper modules
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        spaceBetween={20}
                        slidesPerView={3}
                        navigation
                        scrollbar={{ draggable: true }}
                        onSwiper={(swiper) => console.log(swiper)}
                        onSlideChange={() => console.log('slide change')}
                    >
                        <SwiperSlide>
                            <TrainingBox trainingDescription={trainingDescription} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <TrainingBox trainingDescription={groepPtTrainingDescription} />

                        </SwiperSlide>
                        <SwiperSlide>
                            <TrainingBox trainingDescription={wedstrijdTrainingDescription} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <TrainingBox trainingDescription={afvallenTrainingDescription} />
                        </SwiperSlide>
                        <br />
                    </Swiper>
                </div>
            </section>
        </>
    )
}

export default AllTrainings
