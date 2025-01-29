import React from 'react';
import { Link } from 'react-router-dom'
import animatedLogo from '../../images/animating-logo.gif'

const Footer = () => {
    return (
        <>
            <footer id="footer-area" className="padding-all">
                <div className="container">
                    <div className="footer-widgets-area">
                        <div className="footer-menu-1 footer-menu">
                            <h5 className="footer-heading">Onze Trainingen</h5>

                            <p>

                                <Link to="/trainingprograms/afvallen-training/">Afvallen</Link>
                            </p>

                            <p>
                                <Link to="/trainingprograms/groeppt-training/">Groep PT</Link>
                            </p>

                            <p>
                                <Link to="/trainingprograms/personal-training/">Personal Training</Link>
                            </p>

                            <p>
                                <Link to="/trainingprograms/wedstrijd-training/">Wedstrijd Training</Link>
                            </p>
                        </div>

                        <div className="footer-logo-animation">
                            <div className="animation-img">
                                <img
                                    src={animatedLogo}
                                    alt="Maikel"
                                />
                                <div className="text-content">
                                    <p>
                                        Algemene voorwaarden | Privacybeleid | KVK 59250097 | Btw: NL003699102B10
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="footer-facebook-profile">
                            <ul id="sidebar">


                            </ul>
                        </div>

                        <div className="footer-menu-2 footer-menu">
                            <h5 className="footer-heading">Info &amp; Service</h5>
                            <ul id="menu-footer-menu-2">
                                <li className="menu-item">
                                    <p>
                                        <a href="https://mysummerbodyclub.nl/algemene-voorwaarden/">Algemene voorwaarden</a>
                                    </p>
                                </li>
                                <li className="menu-item">
                                    <p>
                                        <a href="https://mysummerbodyclub.nl/privacyverklaring/">Privacyverklaring</a>
                                    </p>
                                </li>
                                {/* Additional items can be added here */}
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
