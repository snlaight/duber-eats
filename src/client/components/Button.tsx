import React, { FC } from 'react';

interface IButtonProps {
    isClickable: boolean;
    loading: boolean;
    isSubmit?: boolean;
    text:string;
    fullWidth?: boolean;
}

const Button: FC<IButtonProps> = ({ isClickable, isSubmit, loading, text, fullWidth = false }) => (
  <button type={isSubmit ? 'submit' : 'button'} className={`btn transition-colors focus:outline-none ${!isClickable && 'bg-gray-300 pointer-events-none'} ${fullWidth && 'w-full'}`}>
    {loading ? 'Loading...' : text}
  </button>
);

export default Button;
