import React, { useState, useEffect } from 'react'
import TextField from '../common/TextField'
import { useForm } from 'react-hook-form';

const SearchHeader = () => {

    const { register, handleSubmit, control, formState: { errors } } = useForm({
    });

    return (
        <div className="bg-[#ef4d16] px-10 py-4 search-header">
            <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                    <TextField
                        label=""
                        name="search-header"
                        register={register}
                        validation={{
                            required: 'Search is required',
                        }}
                        errors={errors}
                        placeholder="Search payments"
                    />
                </div>
                <div className="col-span-2">
                    Right side
                </div>
            </div>
        </div>
    )
}

export default SearchHeader
