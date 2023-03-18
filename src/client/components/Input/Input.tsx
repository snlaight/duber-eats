import { FC, DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { FieldError, UseFormRegister, RegisterOptions } from 'react-hook-form';

import { FormError } from '@/components';

export type TInputProps = {
    id: string;
    name: string;
    label: string;
    type?: string;
    register: UseFormRegister<any>;
    options: RegisterOptions;
    error?: FieldError | undefined;
} & Omit<
DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
'size'
>;

const Input: FC<TInputProps> = ({
  id,
  name,
  label,
  type = 'text',
  register,
  options,
  error,
  ...props
}) => (
  <label className='label flex flex-col w-full pb-6' htmlFor={id}>
    <span className='text-sm text-dubereats-secondary font-bold w-full'>
      {label}
    </span>
    <input className='input text-dubereats-light2' id={id} name={name} type={type} {...register(name, options)} {...props} />
    {error && (
    <FormError errorMessage={error.message} />
    )}
    {error?.type === 'minLength' && (
    <FormError errorMessage={`Password must be at least ${options.minLength} characters`} />
    )}
  </label>
);

export default Input;
