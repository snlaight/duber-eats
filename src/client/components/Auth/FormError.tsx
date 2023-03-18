import React from 'react';

interface IFormErrorProps {
  errorMessage: string
}

const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => (
  <span className='font-medium text-red-500'>
    {errorMessage}
  </span>
);

export default FormError;
