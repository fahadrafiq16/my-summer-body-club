import React from 'react'
import { Link } from "react-router-dom";

const TwoBannersArea = () => {
    return (
        <section id="two-banners-area" className="padding-top ]">
            <div className="container">
                <div className="two-banners-area">
                    {/* Banner Left */}
                    <div className="banner-left banner">
                        <p className="sub-heading">Start Vandaag Je Nieuwe Life Style</p>
                        <p className="bold-heading">
                            Voor Meer<span> Proefles</span>
                        </p>
                        <Link
                            className="bordered-button"
                            to="/informatie"
                        >
                            Hier Aanvragen
                        </Link>
                    </div>
                    {/* Banner Right */}
                    <div className="banner-right banner">
                        <p className="sub-heading">Start Vandaag Je Nieuwe Life Style</p>
                        <p className="bold-heading">
                            Voor Meer<span> Proefles</span>
                        </p>
                        <a
                            className="bordered-button"
                            href="https://mysummerbodyclub.nl/proefles/"
                        >
                            Hier Aanvragen
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TwoBannersArea
