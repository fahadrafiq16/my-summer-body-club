import React from 'react'
import { Link } from 'react-router-dom'

const TrainingBox = ({ trainingDescription }) => {
    console.log(trainingDescription);
    return (
        <div className="training-box">
            <div className="img-area">
                <img
                    src={trainingDescription[0].featuredImage} />
            </div>
            <div className="training-content">
                <div className="price-area">
                    <p>{trainingDescription[0].startingPrice}</p>
                </div>
                <div className="training-title-area">
                    <div>
                        <span>
                            <Link to={trainingDescription[0].trainingLink}>
                                <i className="fa fa-circle"></i> {trainingDescription[0].title}
                            </Link>
                        </span>
                    </div>
                    <div>
                        <p className="vanaf">{trainingDescription[0].tenure}</p>
                    </div>
                </div>
                <div className="popularity">
                    <p className="main" style={{ backgroundColor: trainingDescription[0].headLineBg }}>
                        {trainingDescription[0].cardHeadline}
                    </p>
                    <p></p>
                </div>
            </div>
            <div className="training-points">

                {
                    trainingDescription[0].trainingFeatures.map((feature, index) => (
                        <div className="point">

                            <p>{feature}</p>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default TrainingBox
