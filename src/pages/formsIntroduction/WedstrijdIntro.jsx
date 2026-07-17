import React from 'react'
import IntroductionCommon from './IntroductionCommon'
import Img1 from '../../images/Afvallen-intro-1.jpg'
import Img2 from '../../images/Afvallen-intro-2.jpg'
import IntroVideo from '../../videos/Afvallen-MSBC-4.mp4'
import { useProgramIntroAssets } from '../../utils/useProgramIntro'

const DEFAULT_QUOTE = '"Alleen ik kan mijn levensstijl veranderen, niemand kan het voor mij doen."'
const FALLBACK = {
    img1: Img1,
    img2: Img2,
    video: IntroVideo,
    quote: DEFAULT_QUOTE,
    description: DEFAULT_QUOTE,
}

const WedstrijdIntro = () => {
    const { img1, img2, video, quote, description } = useProgramIntroAssets('wedstrijd-training', FALLBACK)

    return (
        <IntroductionCommon
            title={'Wedstrijd Training'}
            img1={img1}
            img2={img2}
            video={video}
            quote={quote}
            description={description}
            link={'wedstrijd-training'}
        />
    )
}

export default WedstrijdIntro
