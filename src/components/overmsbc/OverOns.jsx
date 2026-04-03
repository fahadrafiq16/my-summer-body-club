import React from 'react'
import MarlonImg from '../../images/1000038289.jpg'
import { useNavigate } from "react-router-dom";

const OverOns = () => {

    const navigate = useNavigate();

    return (
        <>
            <div id="msbc_ben_je" className="padding-all">
                <div className="container">
                    <div className="msbc_ben_je_content_area">
                        {/* Left Content */}
                        <div className="msbc_ben_je_left">
                            <h3>
                                Ben Je Er Klaar <span className="msbc_span">Voor?</span>
                            </h3>
                            <p className="msbc_normal_p font-bold">
                                Is je motivatie vervlogen en lijkt jouw doel verder weg dan ooit?
                            </p>
                            <p>
                                Dan is het tijd voor verandering. <br />
                                Kies een van onze diensten en ontdek wat écht trainen betekent.
                            </p>
                            <p className="mt-4">
                                Bij My Summerbody Club train je met personal trainer Marlon — <br />
                                meer dan 30 jaar praktijkervaring en bewezen succes als wedstrijdtrainer en coach.
                            </p>
                            <p className="mt-4">
                                Marlon ziet wat anderen missen.<br />
                                Hij heeft oog voor detail en tilt jouw training naar het hoogste niveau.<br />
                                Je leert opnieuw trainen — anders dan je gewend bent —<br />
                                en ontdekt spiergroepen waarvan je niet wist dat je ze had.
                            </p>


                            <div style={{ marginTop: '30px' }} className="form-border"></div>

                            <h3 className="mt-4">Voor wie?</h3>

                            <p className="mt-4">
                                Wij begeleiden mannen en vrouwen die:
                            </p>

                            <ul className="styled-list-icons mt-2 mb-2">
                                <li>100% inzet tonen</li>
                                <li>hun grenzen willen verleggen</li>
                                <li>durven los te laten en willen groeien</li>
                            </ul>

                            <p>
                                Verwacht geen standaardschema’s of snelle oplossingen.
                            </p>
                            <p>
                                Wij bieden persoonlijke coaching voor duurzame, zichtbare resultaten — <br />
                                met focus op <strong>mindset, techniek, houding, spieractivatie, doorzettingsvermogen en structuur.</strong>

                            </p>

                            <blockquote className="italic border-l-4 [border-color:#EF4D16] pl-4 text-[#000000] mx-auto mt-8">
                                “No rush, because nobody waits for you and nobody loves you.<br />
                                I don’t train construction workers, but sculptors.<br />
                                To become a masterpiece, you must edit yourself.”
                                <span className="block mt-2 text-center font-semibold not-italic">— Marlon</span>
                            </blockquote>

                            <div style={{ marginTop: '30px' }} className="form-border"></div>

                            <h3 className="mt-4">Of je nu:</h3>

                            <ul className="styled-list-icons mt-4 mb-2">
                                <li>fitter wilt worden,</li>
                                <li>je lichaam wilt shapen,</li>
                                <li>deelnemen of je voorbereidt op een bodybuildingwedstrijd —</li>
                            </ul>

                            <p className="mt-4">
                                <strong>Marlon helpt je het maximale uit jezelf te halen.</strong>
                            </p>



                            <p className="mt-4">
                                Bij ons train je niet alleen…
                            </p>
                            <p>
                                <strong>je hoort erbij.</strong>
                            </p>

                            <p className="mt-4">Ben jij klaar om beeldhouwer te worden van jouw Summerbody — voor het hele jaar?</p>

                            <p
                                style={{
                                    color: "#ef4d16",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    marginTop: "15px",
                                }}
                            >
                                START JE NIEUWE LIFE STYLE VANDAAG!
                            </p>
                            <div className="msbc-contact-detail">
                                {/* Contact Button and Social Profiles */}
                                <div className="msbc-left-detail">

                                    <button
                                        className="button-focused-proefles msbc_ben_button"
                                        onClick={() => navigate("/proefles")}
                                    >
                                        START JE NIEUWE LIFE STYLE VANDAAG!
                                    </button>

                                    

                                    <button
                                        className="msbc_ben_button"
                                        onClick={() => navigate("/contact")}
                                    >
                                        Neem contact op
                                    </button>

                                    <div className="msbc_ben_social-profiles">
                                        <a className="msbc_ben_item" href="#">
                                            <i className="fab fa-instagram"></i>
                                        </a>
                                        <a className="msbc_ben_item" href="#">
                                            <i className="fab fa-pinterest"></i>
                                        </a>
                                        <a className="msbc_ben_item" href="#">
                                            <i className="fab fa-youtube"></i>
                                        </a>
                                    </div>
                                </div>

                                {/* Mobile Number Section */}
                                <div className="email-area">
                                    <img
                                        src="https://mysummerbodyclub.nl/wp-content/themes/my-summer-body-club/assets/img-2.png"
                                        alt="Mobile"
                                    />
                                    <div className="header-content">
                                        <h3>Mobile Nummer</h3>
                                        <p>(+31) 6 27 28 28 56</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="msbc_ben_je_right">
                            <img
                                src={MarlonImg}
                                alt="Men After"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OverOns
