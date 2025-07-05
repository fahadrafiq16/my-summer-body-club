import React from 'react'
import MarlonImg from '../../images/1000038289.jpg'

const OverOns = () => {
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
                                Dan is het tijd voor verandering. <br/>
                                Kies een van onze diensten en ontdek wat écht trainen betekent.
                            </p>
                            <p className="mt-4">
                                Bij My Summerbody Club train je met personal trainer Marlon — <br/>
                                meer dan 30 jaar praktijkervaring en bewezen succes als wedstrijdtrainer en coach.
                            </p>
                            <p className="mt-4">
                                Marlon ziet wat anderen missen.<br/>
                                Hij heeft oog voor detail en tilt jouw training naar het hoogste niveau.<br/>
                                Je leert opnieuw trainen — anders dan je gewend bent —<br/>
                                en ontdekt spiergroepen waarvan je niet wist dat je ze had.
                            </p>
                           
                            
                            <div style={{marginTop:'30px'}} className="form-border"></div>

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
                                    <button className="msbc_ben_button">Neem contact op</button>
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
