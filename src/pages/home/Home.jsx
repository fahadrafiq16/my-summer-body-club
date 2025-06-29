import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import Gallery from '../../sections/home/Gallery';
import LifeStyle from '../../components/home/LifeStyle';
import AllTrainings from '../../components/abonnement/AllTrainings';

import OurTrainers from '../../sections/home/OurTrainers';
import StyleWant from '../../sections/home/StyleWant';
import TwoBannersArea from '../../sections/home/TwoBannersArea';
import PopUpVideoArea from '../../sections/home/PopUpVideoArea';
import VideoModal from '../../components/home/VideoModal';
import Slider from '../../sections/home/Slider';
import ClubTrainings from '../../sections/home/ClubTrainings';
import BootCampImg from '../../images/bootcamp-banner-image.png';
import BootCampHome from '../../images/bootcamp-home-button.png'
import Testimonials from '../../components/home/Testimonials';

const BASE_FRONTEND_URL = process.env.REACT_APP_BASE_FRONTEND_URL;
const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;



const Home = () => {

  return (
    <>
      <Slider />
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
                    src={BootCampImg}
                    alt="video area logo"
                  />
                </div>
                <div className="video-image">
                  <img
                    src={BootCampImg}
                    alt="bootcamp video"
                  />
                </div>
                <div className="my-[20px]">
                  <VideoModal />
                </div>
                <a href="https://mysummerbodyclub.nl/bootcamp-page/">
                  <img
                    className="bootcamp-link"
                    src={BootCampHome}
                    alt="bootcamp-link"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      <AllTrainings />

      <OurTrainers />
      <PopUpVideoArea />
      <Testimonials />
      <Gallery />


    </>

  );
};

export default Home;
