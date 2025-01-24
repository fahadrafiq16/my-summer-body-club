import React from 'react'
import {Link} from 'react-router-dom'

const IntroductionCommon = ({title,img1,img2,video,quote,description}) => {
    return (
        <>
            <div id="page-title-banner">
                <div className="container">
                    <h2 className="page-title">{title}</h2>
                </div>
            </div>
            <div id="training-programs-short-des" className="padding-all">
                <div className="container-800">
                    {/* Banner Images Area */}
                    <div className="banner-images-area">
                        <div className="img-item">
                            <img
                                src={img1}
                                alt="Afvallen"
                            />
                        </div>
                        <div className="img-item">
                            <div className="embed-container">
                                <iframe
                                    src={video}
                                    allowFullScreen
                                    title="Afvallen Video"
                                ></iframe>
                            </div>
                        </div>
                        <div className="img-item">
                            <img
                                src={img2}
                                alt="Afvallen"
                            />
                        </div>
                    </div>

                    {/* Fact Section */}
                    <div className="fact">
                        <div className="landing-icon">
                            <i className="fas fa-quote-left"></i>
                        </div>
                        <p>{quote}</p>
                    </div>

                    {/* Training Program Short Description */}
                    <div className="training-program-short-des">
                        <p>{description}</p>
                        <div className="button-area">
                            <button>
                                 <Link to="/trainingprograms/afvallen-training/payment-form" className="button-area">
      LID WORDEN
    </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default IntroductionCommon
