import React, { useState } from 'react'
import MarlonImg from '../../images/Image20220730225809.jpg'
import ManAfterImg from '../../images/men-after.jpg'
import NewLifeImg from '../../images/New_Life_2.png'
import KidImg from '../../images/Heavy_weight_kids.jpg'

const StyleWant = () => {

    const [text, setText] = useState('Wij geloven dat iedereen ernaar verlangt om zich goed en gezond te voelen. Het is goed voor het lichaam en geest. Het is een plicht om ons lichaam in top conditie te brengen en te houden. Daarom moet je in beweging blijven en gezond eten. Dat is makkelijker gezegd dan gedaan. Een doel hebben is leuk, maar het behalen hiervan is voor velen een ander verhaal. Met de diensten van My Summerbody Club is het mogelijk je doel te behalen. Sterker nog… Je doel bereiken is nog nooit zo dichtbij geweest! De vraag is alleen: How bad do you want it? Oftewel; hoe graag wil je het?')

    return (
        <section id="style-want" className="padding-top">
            <div className="container">
                <div className="style-want">
                    <div className="banner-left">
                        <img
                            src={MarlonImg}
                            alt="Banner"
                        />
                    </div>
                    <div className="content-right">
                        <h3>
                            How Bad Do You Want <span>It?</span>
                        </h3>
                        <p id="toggle-paragraph" className="first-p">
                            {text}
                        </p>
                        <div className="img-toggles">
                            <img
                                onClick={() => setText(`Wij geloven dat iedereen ernaar verlangt om zich goed en gezond te voelen. Het is goed voor het lichaam en
                            geest. Het is een plicht om ons lichaam in top conditie te brengen en te houden. Daarom moet je in beweging
                            blijven en gezond eten. Dat is makkelijker gezegd dan gedaan. Een doel hebben is leuk, maar het behalen
                            hiervan is voor velen een ander verhaal. Met de diensten van My Summerbody Club is het mogelijk je doel te
                            behalen. Sterker nog… Je doel bereiken is nog nooit zo dichtbij geweest! De vraag is alleen: How bad do you
                            want it? Oftewel; hoe graag wil je het?`)}
                                id="img-1"
                                src={ManAfterImg}
                                alt="Men After"
                            />
                            <img
                            onClick={() => setText(`Hoe werkt afvallen? Eigenlijk is afvallen heel simpel, maar is het voor de meeste mensen niet makkelijk. Afvallen is als een simpel rekensommetje. Om te begrijpen hoe afvallen werkt, moet je een aantal dingen weten: Je dagelijkse energie behoefte, is de energie die je verbruikt in het dagelijkse leven. Dat is per persoon verschillend, afhankelijk van een aantal factoren. Wil je afvallen en kun je wel wat hulp gebruiken? Dan kunnen wij je helpen om op een gezonde, gevarieerde en verantwoorde manier af te vallen.`)}
                                id="img-2"
                                src={NewLifeImg}
                                alt="Men After"
                            />
                            <img
                            onClick={() => setText('Kinderen van nu komen op hele jonge leeftijd in aanmerking met deze technologie. Je geeft je kleuter de tablet om zichzelf te vermaken, omdat je even druk bezig bent. Je kinderen krijgen op een steeds jongere leeftijd een smartphone of laptop. Ze zijn vaak gekluisterd aan de buis of aan hun gadget. Bewegen doen ze niet, of nauwelijks meer! Bijna 12% van de jeugd heeft overgewicht. En dat is niet gezond! In combinatie met te veel bewerkt en makkelijk eten werkt dat overgewicht in de hand.')}
                                id="img-3"
                                src={KidImg}
                                alt="Men After"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StyleWant
