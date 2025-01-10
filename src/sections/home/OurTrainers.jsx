import React from 'react'
import TrainerBox from '../../components/home/TrainerBox'

const OurTrainers = () => {
    return (
        <section id="our-trainers" class="padding-bottom padding-for-mobile">


            <div class="container">
                <div class="section-title"><h2>Gekwalificeerde <span>Trainers</span></h2></div>
                <div class="our-trainers">
                    <TrainerBox />
                    <TrainerBox />

                </div>
            </div>
        </section>
    )
}

export default OurTrainers
