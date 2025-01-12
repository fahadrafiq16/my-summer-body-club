import React from 'react'

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
                                        src="https://mysummerbodyclub.nl/wp-content/uploads/2023/07/Image20230310213026.jpg"
                                        alt="image 1"
                                    />
                                </a>
                            </div>
                            <div className="div2">
                                <a href="https://mysummerbodyclub.nl/trainingfotos/naomy-burnet-sap-cup-2108/">
                                    <img
                                        src="https://mysummerbodyclub.nl/wp-content/uploads/2023/07/Image20230310213024.jpg"
                                        alt="image 2"
                                    />
                                </a>
                            </div>
                            <div className="div3">
                                <a href="https://mysummerbodyclub.nl/trainingfotos/gabrielle-golds-gym-classic-2018/">
                                    <img
                                        src="https://mysummerbodyclub.nl/wp-content/uploads/2023/07/Image20230310213021.jpg"
                                        alt="image 3"
                                    />
                                </a>
                            </div>
                            <div className="div4">
                                <a href="https://mysummerbodyclub.nl/trainingfotos/de-nieuwe-lichting/">
                                    <img
                                        src="https://mysummerbodyclub.nl/wp-content/uploads/2023/07/Image20230310213019.jpg"
                                        alt="image 4"
                                    />
                                </a>
                            </div>
                            <div className="div5">
                                <a href="https://mysummerbodyclub.nl/trainingfotos/de-nieuwe-lichting/">
                                    <img
                                        src="https://mysummerbodyclub.nl/wp-content/uploads/2023/07/1273655_605482522836261_1303951595_o.jpg"
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
