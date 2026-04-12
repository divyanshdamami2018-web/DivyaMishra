import React from 'react';

const InputField = ({ label, id, error, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-colors ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-primary focus:ring-primary'
        } bg-white`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
