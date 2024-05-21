import React from 'react';

interface InputFieldProps {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  title: string;
  name: string;
}

const InputField: React.FC<InputFieldProps> = ({ handleChange, value, title, name }) => {
  return (
    <label className='sidebar-label-container'>
      <input type='radio' name={name} value={value} onChange={handleChange} />
      <span className='checkmark'></span>{title}
    </label>
  );
};

export default InputField;
