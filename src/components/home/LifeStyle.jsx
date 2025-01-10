import React from 'react'
import Image from '../../images/img-5.png'

const LifeStyle = ({style}) => {
    return (
        <div class="lifestyle">
            <img src={style.img} alt="Life Style" />
                <h3>{style.title}</h3>
                <p>{style.description}</p>
        </div>
    )
}

export default LifeStyle
