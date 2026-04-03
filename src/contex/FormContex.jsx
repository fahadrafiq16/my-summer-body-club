import React, { createContext, useState, useContext } from 'react';
import { clubAmount } from '../data/PersonalTraining';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        
        email: '',
        paymentOption: '',
        loading:false,
        totalAmount:'',
        clubAmount:'',
    });

    const updateFormData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    return (
        <FormContext.Provider value={{ formData, updateFormData, setFormData }}>
            {children}
        </FormContext.Provider>
    );
};

export const useFormContext = () => useContext(FormContext);
