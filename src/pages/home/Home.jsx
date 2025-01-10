import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { trainingDescription } from '../../data/PersonalTraining';
import { afvallenTrainingDescription } from '../../data/AfvallenTraining';
import { wedstrijdTrainingDescription } from '../../data/WedstrijdTraining';
import { groepPtTrainingDescription } from '../../data/GroepPT';
import LifeStyle from '../../components/home/LifeStyle';
import AllTrainings from '../../components/abonnement/AllTrainings';
import GreopImg from '../../images/img-4.png';
import GewichtsverliesImg from '../../images/img-5.png';
import personalImg from '../../images/img-6.png';
import OurTrainers from '../../sections/home/OurTrainers';
import StyleWant from '../../sections/home/StyleWant';
import TwoBannersArea from '../../sections/home/TwoBannersArea';
import PopUpVideoArea from '../../sections/home/PopUpVideoArea';

const BASE_FRONTEND_URL = process.env.REACT_APP_BASE_FRONTEND_URL;
const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

const lifeStyle = [
  {
    img: GreopImg,
    title: 'Groeps Training',
    description: 'Geen motivatie om fit te blijven of vind je alleen sporten saai? Kom en probeer onze groepstraining! Ontmoet een groep gezellige mensen en onze instructeur zorgt ervoor dat je fit blijft.',
  },
  {
    img: GewichtsverliesImg,
    title: 'Groeps Training',
    description: 'Geen motivatie om fit te blijven of vind je alleen sporten saai? Kom en probeer onze groepstraining! Ontmoet een groep gezellige mensen en onze instructeur zorgt ervoor dat je fit blijft.',
  },
  {
    img: personalImg,
    title: 'Groeps Training',
    description: 'Geen motivatie om fit te blijven of vind je alleen sporten saai? Kom en probeer onze groepstraining! Ontmoet een groep gezellige mensen en onze instructeur zorgt ervoor dat je fit blijft.',
  },
]

const Home = () => {

  return (
    <>
      <TwoBannersArea />
      <StyleWant />
      <section id="begin-lifestyle" className="pt-[50px]">
        <div className="container max-w-[1110px] mx-auto">
          <div className="video-area-life" style={{ paddingBottom: '40px' }}>
            <div></div>
            <div className="section-title flex align-center">
              <h2 style={{ padding: '0' }}>
                Begin Een Nieuwe Life <span>Style</span>
              </h2>
            </div>
            <div>
              <div className="main-video-area">
                <div className="video-area-logo flex align-center justify-center">
                  <img
                    src="https://mysummerbodyclub.nl/wp-content/uploads/2023/09/bootcamp-banner-image.png"
                    alt="video area logo"
                  />
                </div>
                <div className="video-image">
                  <img
                    src="https://mysummerbodyclub.nl/wp-content/uploads/2023/09/bootcamp-banner-image.png"
                    alt="bootcamp video"
                  />
                </div>
                <a href="https://mysummerbodyclub.nl/bootcamp-page/">
                  <img
                    className="bootcamp-link"
                    src="https://mysummerbodyclub.nl/wp-content/uploads/2023/09/bootcamp-home-button.png"
                    alt="bootcamp-link"
                  />
                </a>
              </div>
            </div>
          </div>
          <div class="begin-lifestyle">

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
            <AllTrainings
              trainingDescription={trainingDescription}
              afvallenTrainingDescription={afvallenTrainingDescription}
              wedstrijdTrainingDescription={wedstrijdTrainingDescription}
              groepPtTrainingDescription={groepPtTrainingDescription}
            />
          </div>
        </div>
      </section>


      <OurTrainers />
      <PopUpVideoArea />

    </>

  );
};

export default Home;
