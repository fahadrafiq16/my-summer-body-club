import React, { useState } from 'react'
import VideoModal from '../../components/home/VideoModal'
import PTImg from '../../images/PT-Training_Post-1_09.24.png'
import AfvallenImg from '../../images/Afval-Training-2_09.24.png'

const PopUpVideoArea = () => {



    return (
        <section id="popup-video-area">
            <div className="container grid-3-custom">
                {/* Left Video Banner */}
                <div className="video-banner">
                    <img
                        width="841"
                        height="980"
                        src={PTImg}

                    />
                </div>

                {/* Main Video Area */}
                <div className="main-video-area">
                    <div id="video-button" className="video-button">
                        <VideoModal />
                    </div>
                </div>


                {/* Right Video Banner */}
                <div className="video-banner">
                    <img
                        width="840"
                        height="980"
                        src={AfvallenImg}
                        alt=""

                    />
                </div>
            </div>
        </section>
    )
}

export default PopUpVideoArea
