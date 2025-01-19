import React from 'react'
import { useForm, Controller } from "react-hook-form";

const CheckboxField = ({ name, title, control, rules }) => {
    return (
        <div>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState }) => (
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                {...field}
                                checked={field.value || false}
                            />
                            {title}
                        </label>
                        {fieldState.error && (
                            <p style={{ color: "red" }}>{fieldState.error.message}</p>
                        )}
                    </div>
                )}
            />
        </div>
    )
}

export default CheckboxField
