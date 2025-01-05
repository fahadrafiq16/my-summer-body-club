import React from 'react'
import { Controller } from "react-hook-form";

const RadioGroup = ({ name, control, options, required='Please select an option' }) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue=""
            rules={{ required: required }} // Add required validation
            render={({ field, fieldState: { error } }) => (
                <div className="text-left">
                    {options.map((option, index) => (
                        <label
                            key={index}
                            className="block mb-2 radio-group-label">
                            <input
                                type="radio"
                                value={option.amount}
                                {...field} // Spread field to attach it to the radio input
                                checked={field.value === option.amount} // Ensure this radio is checked if it matches the field value
                                onChange={() => field.onChange(option.amount)} // Correctly trigger field.onChange with the selected value
                                className="mr-2"
                            />
                             <span>€ {option.amount}</span> {option.title}
                        </label>
                    ))}
                   
                </div>
            )}
        />
    );
}

export default RadioGroup
