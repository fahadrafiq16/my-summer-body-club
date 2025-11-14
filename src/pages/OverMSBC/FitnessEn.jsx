import React from 'react'
import VideoModal from '../../components/home/VideoModal'

const FitnessEn = () => {
    return (
        <>
            <section id="begin-lifestyle" style={{ paddingBottom: "100px" }}>
                <div className="container">
                    {/* Video Section */}
                    <div className="video-area-life" style={{ paddingBottom: "40px" }}>
                        <div></div>
                        <div className="section-title flex align-center">
                            <h2 style={{ padding: "0 !important" }}>
                                Fitness en <span>Gezondheid</span>
                            </h2>
                        </div>
                        <div className="popup-btn" style={{ marginRight: "150px" }}>
                            
                                <div id="video-button" className="video-button">
                                  <VideoModal showAnimation />
                                    <div id="vidBox"></div>
                               
                            </div>
                        </div>
                    </div>

                    {/* Lifestyle Section */}
                    <div className="begin-lifestyle for-over-msbc">
                        {/* Lifestyle Item 1 */}
                        <div className="lifestyle">
                            <img
                                src="https://mysummerbodyclub.nl/wp-content/themes/my-summer-body-club/assets/img-20.png"
                                alt="Life Style"
                            />
                            <h3>Wie zijn wij</h3>
                            <p>
                                'My Summerbody Club' is de naam van een groep gekwalificeerde
                                personal trainers die in Almere - Stad werkzaam zijn. We bieden
                                een breed scala aan diensten aan om je fitnesservaring
                                effectiever, flexibeler en creatiever te maken. Onze gekwalificeerde
                                trainers zijn niet alleen goed uitgerust met kennis, maar hebben
                                zelf op hoog niveau deelgenomen aan wedstrijden in hun vakgebied.
                            </p>
                        </div>

                        {/* Lifestyle Item 2 */}
                        <div className="lifestyle">
                            <img
                                src="https://mysummerbodyclub.nl/wp-content/themes/my-summer-body-club/assets/img-21.png"
                                alt="Life Style"
                            />
                            <h3>Onze Missie</h3>
                            <p>
                                Het kost soms jaren hard trainen om de lichaamsbouw te krijgen die
                                je graag wilt hebben. Wat je nodig hebt is wat wij hadden -
                                vertrouwen in onze trainers, discipline, fysieke kwaliteiten maar
                                het belangrijkste is mentale kracht en de geloof in jezelf! Onze
                                missie is om je deze stappen verder te helpen ontwikkelen. Om je
                                doel te bereiken.
                            </p>
                        </div>

                        {/* Lifestyle Item 3 */}
                        <div className="lifestyle">
                            <img
                                src="https://mysummerbodyclub.nl/wp-content/themes/my-summer-body-club/assets/img-22.png"
                                alt="Life Style"
                            />
                            <h3>Onze Visie</h3>
                            <p>
                                My Summerbody Club heeft een betrouwbare reputatie die we onder
                                geen enkel beding op het spel willen zetten. Dat speelt ook mee
                                bij de keuze van onze trainers waar we mee samenwerken. We sluiten
                                bovendien altijd een samenwerkingsovereenkomst af met onze klanten
                                en evalueren om de zes weken onze doelstellingen. Hierdoor zijn we
                                altijd op de hoogte van de gemaakte vorderingen en kunnen we
                                adequaat bijsturen.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default FitnessEn
