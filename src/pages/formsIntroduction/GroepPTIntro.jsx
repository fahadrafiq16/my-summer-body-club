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

const GroepPTIntro = () => {
    const { img1, img2, video, quote, description } = useProgramIntroAssets('groep-pt', FALLBACK)

    return (
        <IntroductionCommon
            title={'Groep PT Training'}
            img1={img1}
            img2={img2}
            video={video}
            quote={quote}
            description={description}
            link={'groeppt-training'}
        />
    )
}

export default GroepPTIntro
