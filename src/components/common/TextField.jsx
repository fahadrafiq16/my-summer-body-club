import React from 'react'

const TextField = ({ label, name, register, validation, errors, ...rest }) => {
    return (
        <div className="flex flex-col mt-[20px]">
            <label className="text-left font-bold">{label}</label>
            <input
                className="bg-[#FDEDE8] mt-[8px] p-[14px] rounded-[5px] border-[1.3px] border-[#ef4d16]"
                {...register(name, validation)} {...rest} />
            {errors[name] && <p className="text-left text-[14px] text-red-500">{errors[name].message}</p>}
        </div>
    )
}

export default TextField
