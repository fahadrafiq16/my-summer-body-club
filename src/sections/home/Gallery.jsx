import React from 'react'
import Gallery1 from '../../images/gallery-1.jpg'
import Gallery2 from '../../images/gallery-2.jpg'
import Gallery3 from '../../images/gallery-3.jpg'
import Gallery4 from '../../images/gallery-4.jpg'
import Gallery5 from '../../images/gallery-5.jpg'

const Gallery = () => {
    return (
        <section id="home-gallery" className="padding-bottom mt-[100px]">
            <div className="container">
                <div className="gallery-inner">
                    {/* Title Area */}
                    <div className="title-area">
                        <div className="inner-title-area">
                            <div className="section-title">
                                <h2>
                                    GALLERY<br />
                                    <span>GYM PHOTO</span>
                                </h2>
                            </div>
                            <div className="button-gallery">
                                <a href="https://mysummerbodyclub.nl/fotos/">Gallery</a>
                            </div>
                        </div>

                        {/* Gallery Images */}
                        <div className="parent1">
                            <div className="div1">
                                <a href="https://mysummerbodyclub.nl/trainingfotos/meeting-the-best-2/">
                                    <img
                                        src={Gallery1}
                                        alt="image 1"
                                    />
                                </a>
                            </div>
                            <div className="div2">
                                <a href="https://mysummerbodyclub.nl/trainingfotos/naomy-burnet-sap-cup-2108/">
                                    <img
                                        src={Gallery2}
                                        alt="image 2"
                                    />
                                </a>
                            </div>
                            <div className="div3">
                                <a href="https://mysummerbodyclub.nl/trainingfotos/gabrielle-golds-gym-classic-2018/">
                                    <img
                                        src={Gallery3}
                                        alt="image 3"
                                    />
                                </a>
                            </div>
                            <div className="div4">
                                <a href="https://mysummerbodyclub.nl/trainingfotos/de-nieuwe-lichting/">
                                    <img
                                        src={Gallery4}
                                        alt="image 4"
                                    />
                                </a>
                            </div>
                            <div className="div5">
                                <a href="https://mysummerbodyclub.nl/trainingfotos/de-nieuwe-lichting/">
                                    <img
                                        src={Gallery5}
                                        alt="image 5"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Area */}
                    <div className="right-area">
                        <a
                            className="bordered-button"
                            href="https://mysummerbodyclub.nl/fotos/"
                        >
                            Hoe Graag Wil Je Het? Start Vandaag!
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Gallery
