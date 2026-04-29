import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...rest }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-[13px] font-medium text-grey-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={[
            'w-full glass rounded-md px-4 py-3 text-base text-grey-900',
            'placeholder:text-grey-300 outline-none',
            'focus:border-purple focus:border-[1.5px] transition-colors',
            error ? 'border-error/50' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
