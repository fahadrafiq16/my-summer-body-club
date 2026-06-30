import React from "react";
import IntroductionCommon from './IntroductionCommon'
import Img1 from '../../images/Afvallen-intro-1.jpg'
import Img2 from '../../images/Afvallen-intro-2.jpg'
import IntroVideo from '../../videos/Afvallen-MSBC-4.mp4'
import { useProgramIntroAssets } from '../../utils/useProgramIntro'

const FALLBACK = { img1: Img1, img2: Img2, video: IntroVideo }

const PersonalIntro = () => {
    const { img1, img2, video } = useProgramIntroAssets('personal-training', FALLBACK)

    return (
        <IntroductionCommon
            title={'Personal Training'}
            img1={img1}
            img2={img2}
            video={video}
            quote={'"Alleen ik kan mijn levensstijl veranderen, niemand kan het voor mij doen."'}
            description={'"Alleen ik kan mijn levensstijl veranderen, niemand kan het voor mij doen."'}
            link={'personal-training'}
        />
    );
};

export default PersonalIntro;
