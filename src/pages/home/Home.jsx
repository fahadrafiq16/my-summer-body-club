import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import Gallery from '../../sections/home/Gallery';
import AllTrainings from '../../components/abonnement/AllTrainings';
import StyleWant from '../../sections/home/StyleWant';
import TwoBannersArea from '../../sections/home/TwoBannersArea';
import PopUpVideoArea from '../../sections/home/PopUpVideoArea';
import Slider from '../../sections/home/Slider';
import BeginLifeStyle from '../../sections/home/BeginLifeStyle';
import Testimonials from '../../components/home/Testimonials';



const Home = () => {

  return (
    <>
      <Slider />
      <TwoBannersArea />
      <StyleWant />
      <BeginLifeStyle />


      <AllTrainings />

      
      <PopUpVideoArea />
      <Testimonials />
      <Gallery />


    </>

  );
};

export default Home;
