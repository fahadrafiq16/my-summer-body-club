import React from 'react'
import TitleHeader from '../../components/common/TitleHeader'
import BootcampImg from '../../images/bootcamp-2025.png'
import { Link } from 'react-router-dom'
import { usePageHeroImage } from '../../hooks/usePageHeroImage'

const SECTION_KEY = 'bootcamp-page'

const Bootcamp = () => {
    const heroImageUrl = usePageHeroImage(SECTION_KEY)

    return (
        <>
            <TitleHeader title={'Bootcamp'} />

            <div className="max-w-[1110px] mx-auto px-5 md:px-0 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-white">

                <div>
                    <h2 className="text-[#ef4d16] font-black text-lg sm:text-xl md:text-2xl uppercase mb-4">
                        Bootcamp Routine / Programma:
                    </h2>

                    <ul className="list-none space-y-2 text-black text-sm sm:text-base cardio-list-icon">
                        <li>✔ Cardio</li>
                        <li>✔ Spieruithoudingsvermogen</li>
                        <li>✔ Spierkracht</li>
                        <li>✔ Lichaamsvorming (body shaping)</li>
                    </ul>

                    <p className="mt-4 text-gray-800 text-sm sm:text-base">
                        Onze boot camp bestaat uit 3 les sessies op een dag gedurende 4 weken in de ochtend, middag en avond.
                    </p>

                    <div className="mt-6 space-y-1 text-gray-700 text-sm sm:text-base custom-font-500">
                        <p>Ochtend sessie: <span className="font-medium">Tijd volgt.</span></p>
                        <p>Middag sessie: <span className="font-medium">Tijd volgt.</span></p>
                        <p>Avond sessie: <span className="font-medium">Tijd volgt.</span></p>
                        <p>Elke sessie duurt 50–60 minuten</p>
                    </div>

                    <h3 className="mt-6 text-[#49539b] text-xl sm:text-[26px] font-bold">Informatie:</h3>
                    <ul className="list-disc list-inside text-gray-800 mt-2 space-y-1 text-sm sm:text-base">
                        <li>Registratie en kosten binnenkort beschikbaar.</li>
                        <li>Toegankelijk voor iedereen vanaf 18 jaar en ouder.</li>
                        <li>Schrijf je nu al in om op de hoogte te blijven van onze events.</li>
                    </ul>

                    <p className="mt-4 text-[#EF4D16] font-black text-center font-extrabold text-2xl sm:text-[32px] md:text-[38px] tracking-wide">VOL <span className="text-[#49539b]">=</span> VOL &gt;&gt;&gt;</p>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                    <img src={heroImageUrl || BootcampImg} alt="My Summerbody Club" className="w-full max-w-md md:max-w-none rounded-lg" />
                    <Link
                        to="/trainingprograms/bootcamp-training/payment-form"
                        className="inline-block bg-[#49539B] hover:bg-orange-700 text-white text-base sm:text-[18px] font-bold py-3 px-6 rounded w-full sm:w-auto text-center transition-colors"
                    >
                        Registreren Bootcamp
                    </Link>
                </div>
            </div>


        </>
    )
}

export default Bootcamp
