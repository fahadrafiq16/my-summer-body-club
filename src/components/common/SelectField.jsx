import React from "react";

const SelectField = ({ name, label, options, register, validation, errors }) => {
  return (
    <div className="form-group text-left flex flex-col">
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        {...register(name, validation)}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
      >
        <option className="ml-2" value="">Select a value</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name] && <span className="error-text text-red-500 mt-2">{errors[name].message}</span>}
    </div>
  );
};

export default SelectField;
