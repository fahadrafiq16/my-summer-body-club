import React from 'react'

const InfoItem = ({ label, value }) => {
    return (
        <div className="p-2 border-b border-gray-200">
            <p className="text-gray-600 text-sm">{label}</p>
            <p className="font-medium text-gray-900">{value}</p>
        </div>
    )
}

export default InfoItem
