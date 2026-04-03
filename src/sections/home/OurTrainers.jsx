import React from 'react'
import TrainerBox from '../../components/home/TrainerBox'
import Marlon from '../../images/marlon.png'
import Naomi from '../../images/naomi.png'

const trainersData = [
    {
        img:Marlon,
        name:'Marlon',
        designation:'Fitness / bodybuilding Trainer & Coach',
        facebook:'#',
        instagram:'#',
        youtube:'#',
    },
    {
        img:Naomi,
        name:'Naomi',
        designation:'Fitness / bodybuilding Trainer & Coach',
        facebook:'#',
        instagram:'#',
        youtube:'#',
    },
]

const OurTrainers = () => {
    return (
        <section id="our-trainers" class="padding-bottom padding-for-mobile">


            <div class="container">
                <div class="section-title"><h2>Gekwalificeerde <span>Trainers</span></h2></div>
                <div class="our-trainers">
                   
                   {
                    trainersData.map((trainer) => (
                        <TrainerBox trainer={trainer} />
                    ))
                   }

                </div>
            </div>
        </section>
    )
}

export default OurTrainers
