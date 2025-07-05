import React, { useState } from 'react'
import MarlonImg from '../../images/Image20220730225809.jpg'
import ManAfterImg from '../../images/Small Pic 1.png'
import NewLifeImg from '../../images/Small Pic 2.png'
import KidImg from '../../images/Small Pic 3.png'

const StyleWant = () => {
    const [activeSection, setActiveSection] = useState('fit');

    return (
        <section id="style-want" className="padding-top">
            <div className="container">
                <div className="style-want">
                    <div className="banner-left">
                        <img src={MarlonImg} alt="Banner" />
                    </div>
                    <div className="content-right">


                        {/* Section 1 */}
                        {activeSection === 'fit' && (
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-4">
                                    Voel je fit, sterk en gezond met My Summerbody Club
                                </h3>
                                <p className="mb-4">Gezond leven begint met de juiste balans tussen beweging, voeding en mindset. Bij My Summerbody Club helpen we jou om fit te worden én te blijven. Of je nu wilt afvallen, spiermassa wilt opbouwen of werkt aan een gezondere levensstijl — wij bieden persoonlijke begeleiding, voedingsadvies en effectieve trainingsprogramma’s. Met onze doelgerichte aanpak wordt jouw Summer body haalbaar én houdbaar.</p>

                                <div className="icon-features flex gap-4">
                                    <p>✅ Fit worden </p><p>✅ Gezond eten</p ><p>✅ Resultaat boeken</p>
                                </div>
                                <p className="italic font-bold">👉 Klaar voor de beste versie van jezelf?</p>

                            </div>
                        )}

                        {/* Section 2 */}
                        {activeSection === 'afvallen' && (
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-4">
                                    Hoe werkt afvallen? Simpel, maar niet altijd makkelijk
                                </h3>
                                <p className="mb-4">Afvallen betekent dat je meer calorieën moet verbranden dan je binnenkrijgt. Je lichaam gebruikt dagelijks energie — je zogeheten energiebehoefte. Die verschilt per persoon en is afhankelijk van leeftijd, geslacht, lichaamsbouw en activiteit. Als je structureel onder je energiebehoefte eet, verbrandt je lichaam vetreserves. Dat is de basis van gezond afvallen.</p>

                                <p>Wil jij op een verantwoorde manier afvallen, zonder crashdieet of jojo-effect?  My Summerbody Club helpt met persoonlijke begeleiding, voedingsadvies en een aanpak die écht werkt. </p>
                                <p className="italic font-bold">👉 Afvallen? Wij maken het wél haalbaar.</p>
                            </div>
                        )}

                        {/* Section 3 */}
                        {activeSection === 'wedstrijd' && (
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-4">
                                    Wedstrijdtraining & begeleiding: Klaar voor het podium?
                                </h3>
                                <p className="mb-4">Doe je mee aan een bodybuildingwedstrijd, Men’s Physique of bikini fitness? Met onze wedstrijdbegeleiding sta jij in topvorm op het podium. Wij helpen je met gerichte training, spieropbouw, vetverlies, posing coaching, voedingsadvies en mentale voorbereiding. Elk detail telt: van jouw presentatie tot je wedstrijd-dieet.</p>

                                <div className="icon-features flex gap-4">
                                    <p>✅ Spiermassa</p><p>✅ Stage presence</p><p>✅ Mindset.</p>
                                </div>
                                <p className="italic font-bold">👉 Bereik het maximale met begeleiding op maat.</p>
                            </div>
                        )}

                        {/* Image Toggles */}
                        <div className="img-toggles">
                            <img
                                onClick={() => setActiveSection('fit')}
                                id="img-1"
                                src={ManAfterImg}
                                alt="Intro"
                                className="cursor-pointer object-cover"
                            />
                            <img
                                onClick={() => setActiveSection('afvallen')}
                                id="img-2"
                                src={NewLifeImg}
                                alt="Afvallen"
                                className=" object-cover"
                            />
                            <img
                                onClick={() => setActiveSection('wedstrijd')}
                                id="img-3"
                                src={KidImg}
                                alt="Wedstrijd"
                                className="cursor-pointer object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StyleWant
