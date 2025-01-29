import React from 'react'
import IntroductionCommon from './IntroductionCommon'
import Img1 from '../../images/Afvallen-intro-1.jpg'
import Img2 from '../../images/Afvallen-intro-2.jpg'
import IntroVideo from '../../videos/Afvallen-MSBC-4.mp4'
import shapeImage from '../../images/shape.png'

const AfvallenIntro = () => {
    return (
        <>
           
            <IntroductionCommon
                title={'Afvallen Training'}
                img1={Img1}
                img2={Img2}
                video={IntroVideo}
                quote={'"Alleen ik kan mijn levensstijl veranderen, niemand kan het voor mij doen."'}
                description={'"Alleen ik kan mijn levensstijl veranderen, niemand kan het voor mij doen."'}
                link={'afvallen-training'}
            />
        </>
    )
}

export default AfvallenIntro
