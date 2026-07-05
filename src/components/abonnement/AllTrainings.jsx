import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TrainingBox from './TrainingBox'
import { trainingDescription as defaultPersonalTrainingDescription } from '../../data/PersonalTraining';
import { afvallenTrainingDescription as defaultAfvallenTrainingDescription } from '../../data/AfvallenTraining';
import { groepPtTrainingDescription as defaultGroepPtTrainingDescription } from '../../data/GroepPT';
import { wedstrijdTrainingDescription as defaultWedstrijdTrainingDescription } from '../../data/WedstrijdTraining';
import { getBackendBaseUrl } from '../../utils/backend';
import { mergeTrainingDescriptionWithFeaturedImage } from '../../utils/programFeaturedImage';
import { summerBodyTrainingDescription as defaultSummerBodyTrainingDescription } from '../../data/Summerbody1jarig';
import { summerBodyTrainingDescription6Maanden as defaultSummerBodyTrainingDescription6Maanden } from '../../data/Summerbody6maanden';
import { summerBodyTrainingDescriptionFlex as defaultSummerBodyTrainingDescriptionFlex } from '../../data/SummerBodyFlex';

import LifeStyle from '../../components/home/LifeStyle';


import Gym180 from '../../images/180 GyM Comminityl.png'

import personalImg from '../../images/new6.png';
import Weight175 from '../../images/new5.png'
import GewichtsverliesImg from '../../images/new4.png';
import GroepImg from '../../images/new7.png';


import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';



const lifeStyleMain = [
    {
        img: Gym180,
        title: 'Summerbody Community',
        description: `My Summerbody Club is geen standaard gym. Wij zijn een hechte summerbody community — een familie van gemotiveerde sporters die samen groeien. Bij ons draait het om respect: voor elkaar, voor de apparatuur én voor de ruimte waarin we trainen. Kwaliteit, hygiëne en samenhorigheid staan bij ons hoog in het vaandel. Bij ons train je niet alleen… je hoort erbij.`,
    },


];

const lifeStyle = [
    {
        img: GroepImg,
        title: 'Groepstraining',
        description: `Onze groepstrainingen combineren kracht, cardio en functionele oefeningen, afgestemd op jouw niveau. Je traint in een energieke groep, waarin iedereen elkaar motiveert om het beste uit zichzelf te halen.\n\nExtra begeleiding in kleine groepjes met GroepsPT (1-op-2 / 1-op-3).`,
    },
    {
        img: personalImg,
        title: 'Personal Coaching',
        description: `Individuele coaching volledig afgestemd op jouw doelen: afvallen, spieropbouw, fit worden of werken aan een blijvende gezonde levensstijl. Persoonlijke aandacht en maximale resultaten!`,
    },
    {
        img: Weight175,
        title: 'Gewichtsverlies',
        description: `Wil jij op een gezonde én effectieve manier afvallen? Bij My Summerbody Club helpen we je niet alleen met training, maar ook met een doordacht plan voor voeding, mindset en leefstijl.\n\nWe focussen op duurzaam gewichtsverlies, zonder crashdiëten. Of je nu 5 of 25 kilo kwijt wilt —`,
    },
    {
        img: GewichtsverliesImg,
        title: 'Wedstrijd Training',
        description: `Wil jij schitteren op het podium? Wij begeleiden je stap voor stap richting jouw bodybuildingwedstrijd of Miss Bikini-competitie.\n\nFocus op houding, techniek, posing, voeding, spieropbouw, vetverlies en een ijzersterke mindset.`,
    },
];


const AllTrainings = () => {
    const [trainingDescription, setTrainingDescription] = useState(defaultPersonalTrainingDescription);
    const [groepPtTrainingDescription, setGroepPtTrainingDescription] = useState(defaultGroepPtTrainingDescription);
    const [wedstrijdTrainingDescription, setWedstrijdTrainingDescription] = useState(defaultWedstrijdTrainingDescription);
    const [afvallenTrainingDescription, setAfvallenTrainingDescription] = useState(defaultAfvallenTrainingDescription);
    const [summerBodyTrainingDescription, setSummerBodyTrainingDescription] = useState(defaultSummerBodyTrainingDescription);
    const [summerBodyTrainingDescription6Maanden, setSummerBodyTrainingDescription6Maanden] = useState(defaultSummerBodyTrainingDescription6Maanden);
    const [summerBodyTrainingDescriptionFlex, setSummerBodyTrainingDescriptionFlex] = useState(defaultSummerBodyTrainingDescriptionFlex);
    const [summerbody1jarigImage, setSummerbody1jarigImage] = useState("");
    const [summerbody6MaandenImage, setSummerbody6MaandenImage] = useState("");
    const [summerbodyFlexImage, setSummerbodyFlexImage] = useState("");
    const [personalTrainingImage, setPersonalTrainingImage] = useState("");
    const [groepPtImage, setGroepPtImage] = useState("");
    const [wedstrijdTrainingImage, setWedstrijdTrainingImage] = useState("");
    const [afvallenTrainingImage, setAfvallenTrainingImage] = useState("");
    const [clubSubscriptionsVisible, setClubSubscriptionsVisible] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const backendBase = getBackendBaseUrl();

        const fetchClubSubscriptionsVisibility = async () => {
            try {
                const res = await axios.get(`${backendBase}/api/fetch-home-section/club-subscriptions`);
                if (cancelled) return;
                if (res.data?.success && res.data.section) {
                    setClubSubscriptionsVisible(res.data.section.isActive !== false);
                }
            } catch {
                if (!cancelled) setClubSubscriptionsVisible(true);
            }
        };

        const fetchProgram = async (key, fallback, setter, setFeaturedImage) => {
            try {
                const res = await axios.get(`${backendBase}/api/program-config/${key}`);
                if (cancelled) return;
                const data = res?.data || {};
                const list = Array.isArray(data.trainingDescription) && data.trainingDescription.length > 0
                    ? data.trainingDescription
                    : fallback;
                const merged = mergeTrainingDescriptionWithFeaturedImage(list, fallback, data.featuredImageUrl);
                setter(merged);
                if (setFeaturedImage) {
                    setFeaturedImage(data.featuredImageUrl || "");
                }
            } catch (err) {
                console.warn(`Falling back to static ${key} description:`, err?.message);
            }
        };

        fetchProgram('personal-training', defaultPersonalTrainingDescription, setTrainingDescription, setPersonalTrainingImage);
        fetchProgram('groep-pt', defaultGroepPtTrainingDescription, setGroepPtTrainingDescription, setGroepPtImage);
        fetchProgram('wedstrijd-training', defaultWedstrijdTrainingDescription, setWedstrijdTrainingDescription, setWedstrijdTrainingImage);
        fetchProgram('afvallen-training', defaultAfvallenTrainingDescription, setAfvallenTrainingDescription, setAfvallenTrainingImage);
        fetchProgram('summerbody-1jarig', defaultSummerBodyTrainingDescription, setSummerBodyTrainingDescription, setSummerbody1jarigImage);
        fetchProgram('summerbody-6-maanden', defaultSummerBodyTrainingDescription6Maanden, setSummerBodyTrainingDescription6Maanden, setSummerbody6MaandenImage);
        fetchProgram('summerbody-flex', defaultSummerBodyTrainingDescriptionFlex, setSummerBodyTrainingDescriptionFlex, setSummerbodyFlexImage);
        fetchClubSubscriptionsVisibility();

        return () => { cancelled = true; };
    }, []);

    return (
        <>
            <div className="container life-style-main max-w-[600px] mx-auto">
                <div className="begin-lifestyle md:my-[50px]">

                    {
                        lifeStyleMain.map((style) => (
                            <LifeStyle style={style} />
                        ))
                    }

                </div>
            </div>
            <section id="our-trainings" className="md:my-[0px]">
                <div className="container max-w-[1110px] mx-auto">
                    <div
                        className="club-trainings"
                        style={{ display: clubSubscriptionsVisible ? undefined : "none" }}
                    >
                        <div className="section-title">
                            <h2>My Summerbody Club  <span>Abonnementen</span></h2>
                        </div>
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={20}
                            slidesPerView={1}
                            breakpoints={{
                                768: {
                                    slidesPerView: 3,
                                },
                            }}
                            navigation
                            scrollbar={{ draggable: true }}
                        >
                            <SwiperSlide>
                                <TrainingBox
                                    trainingDescription={summerBodyTrainingDescription}
                                    featuredImageUrl={summerbody1jarigImage}
                                />
                            </SwiperSlide>
                            <SwiperSlide>
                                <TrainingBox
                                    trainingDescription={summerBodyTrainingDescription6Maanden}
                                    featuredImageUrl={summerbody6MaandenImage}
                                />
                            </SwiperSlide>
                            <SwiperSlide>
                                <TrainingBox
                                    trainingDescription={summerBodyTrainingDescriptionFlex}
                                    featuredImageUrl={summerbodyFlexImage}
                                />
                            </SwiperSlide>
                        </Swiper>
                    </div>

                    <div className="begin-lifestyle begin-lifestyle-home mt-[60px] md:my-[100px]">

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



                    <Swiper
                        // install Swiper modules
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            768: {
                                slidesPerView: 3,
                            },
                        }}
                        navigation
                        scrollbar={{ draggable: true }}
                        onSwiper={(swiper) => console.log(swiper)}
                        onSlideChange={() => console.log('slide change')}
                    >
                        <SwiperSlide>
                            <TrainingBox
                                trainingDescription={trainingDescription}
                                featuredImageUrl={personalTrainingImage}
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <TrainingBox
                                trainingDescription={groepPtTrainingDescription}
                                featuredImageUrl={groepPtImage}
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <TrainingBox
                                trainingDescription={wedstrijdTrainingDescription}
                                featuredImageUrl={wedstrijdTrainingImage}
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <TrainingBox
                                trainingDescription={afvallenTrainingDescription}
                                featuredImageUrl={afvallenTrainingImage}
                            />
                        </SwiperSlide>
                        <br />
                    </Swiper>
                </div>
            </section>
        </>
    )
}

export default AllTrainings
