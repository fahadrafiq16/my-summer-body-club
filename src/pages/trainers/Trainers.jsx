import React from 'react'
import TitleHeader from '../../components/common/TitleHeader'
import OurTrainers from '../../sections/home/OurTrainers'

const Trainers = () => {
    return (
        <>
            <TitleHeader title={'Trainers'} />
            <div className="trainer-page sm:py-[60px] md:py-[100px]">
                <OurTrainers />
            </div>
        </>
    )
}

export default Trainers
