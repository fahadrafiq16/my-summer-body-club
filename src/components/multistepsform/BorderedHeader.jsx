import React from 'react'

const BorderedHeader = ({heading}) => {
    return (
        <>
            <div class="form-border"></div>
            <h3 class="form-h3">{heading}</h3>
        </>
    )
}

export default BorderedHeader
