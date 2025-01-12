import React, {useState} from 'react'
import VideoModal from '../../components/home/VideoModal'


const PopUpVideoArea = () => {



    return (
        <section id="popup-video-area">
            <div className="container grid-3-custom">
                {/* Left Video Banner */}
                <div className="video-banner">
                    <img
                        width="841"
                        height="980"
                        src="https://mysummerbodyclub.nl/wp-content/uploads/2024/09/PT-Training_Post-1_09.24.png"
                        className="attachment-full size-full"
                        alt=""
                        decoding="async"
                        srcSet="https://mysummerbodyclub.nl/wp-content/uploads/2024/09/PT-Training_Post-1_09.24.png 841w, https://mysummerbodyclub.nl/wp-content/uploads/2024/09/PT-Training_Post-1_09.24-257x300.png 257w, https://mysummerbodyclub.nl/wp-content/uploads/2024/09/PT-Training_Post-1_09.24-768x895.png 768w"
                        sizes="(max-width: 841px) 100vw, 841px"
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
                        src="https://mysummerbodyclub.nl/wp-content/uploads/2024/09/Afval-Training-2_09.24.png"
                        className="attachment-full size-full"
                        alt=""
                        decoding="async"
                        srcSet="https://mysummerbodyclub.nl/wp-content/uploads/2024/09/Afval-Training-2_09.24.png 840w, https://mysummerbodyclub.nl/wp-content/uploads/2024/09/Afval-Training-2_09.24-257x300.png 257w, https://mysummerbodyclub.nl/wp-content/uploads/2024/09/Afval-Training-2_09.24-768x896.png 768w"
                        sizes="(max-width: 840px) 100vw, 840px"
                    />
                </div>
            </div>
        </section>
    )
}

export default PopUpVideoArea
