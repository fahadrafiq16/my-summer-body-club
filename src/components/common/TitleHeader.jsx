import React from 'react'

const TitleHeader = ({title}) => {
    return (
        <div id="page-title-banner">
            <div class="container max-w-[1110px]">
                <h2 class="page-title">{title}</h2>
            </div>
        </div>
    )
}

export default TitleHeader
