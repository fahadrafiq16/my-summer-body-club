import React from 'react'
import { Link } from 'react-router-dom'
import { resolveTrainingFeaturedImage } from '../../utils/programFeaturedImage'

const TrainingBox = ({ trainingDescription, featuredImageUrl }) => {
    const card = trainingDescription?.[0];
    if (!card) return null;

    const imageSrc = resolveTrainingFeaturedImage(trainingDescription, featuredImageUrl);

    return (
        <div className="training-box">
            <div className="img-area">
                {imageSrc ? (
                    <img src={imageSrc} alt={card.title || 'Training'} />
                ) : (
                    <div
                        className="bg-gray-100 min-h-[180px] flex items-center justify-center text-sm text-gray-400"
                        aria-hidden="true"
                    >
                        Geen afbeelding
                    </div>
                )}
            </div>
            <div className="training-content">
                <div className="price-area">
                    <p>{card.startingPrice}</p>
                </div>
                <div className="training-title-area">
                    <div>
                        <span>
                            <Link to={card.trainingLink}>
                                <i className="far fa-circle"></i> {card.title}
                            </Link>
                        </span>
                    </div>
                    <div>
                        <p className="vanaf">{card.tenure}</p>
                    </div>
                </div>
                <div className="popularity">
                    <p className="main" style={{ backgroundColor: card.headLineBg }}>
                        {card.cardHeadline}
                    </p>
                    <p></p>
                </div>
            </div>
            <div className="training-points">

                {
                    card.trainingFeatures.map((feature, index) => (
                        <div className="point" key={index}>

                            <p>{feature}</p>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default TrainingBox
