import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

import Banner from '../../components/abonnement/Banner';
import TrainingBox from '../../components/abonnement/TrainingBox';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import TitleHeader from '../../components/common/TitleHeader';
import AllTrainings from '../../components/abonnement/AllTrainings';

const Abonnement = () => {
    return (
        <>
            <TitleHeader title={'Abonnementen'} />
            <Banner />
            <section id="our-trainings" className="my-[100px]">
                <div className="container max-w-[1110px] mx-auto">
                    <div className="section-title">
                        <h2>Groups &amp; PT <span>Abonnementen</span></h2>
                    </div>
                    <div className="our-trainers">
                        <AllTrainings
                         
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Abonnement;
