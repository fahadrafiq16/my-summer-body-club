import React from 'react'

const ExtraDescription = () => {
    return (
        <div className="payment-boxes1">
            <p
                style={{
                    fontSize: "14px",
                    fontStyle: "italic",
                    fontWeight: "600",
                }}
                className="pp"
            >
                * 5 rittenkaart = 3 maanden geldig | ** 10 rittenkaart = 5 maanden
                geldig
            </p>

            <h4 style={{ fontSize: "26px", fontWeight:600 }}>
                <span style={{ color: "#EF4D16", }}>Extra </span>(optioneel)
            </h4>

            <h4 style={{ fontSize: "26px", marginTop: "10px" }}>
                <strong>Voedingsschema</strong>
            </h4>
        </div>
    )
}

export default ExtraDescription
