import React from 'react'


const TrainerBox = ({trainer}) => {
    return (
        <div class="box">
            <div class="img-area">
                <img width="360" height="440" src={trainer.img} sizes="(max-width: 360px) 100vw, 360px" />
            </div>
            <div class="content">
                <h5>{trainer.name}</h5>
                <p>{trainer.designation}</p>
                <div class="social-icons">
                    <i class="fab fa-facebook"></i>
                    <i class="fab fa-instagram"></i>
                    <i class="fab fa-youtube"></i>
                </div>
            </div>
        </div>
    )
}

export default TrainerBox
