import React from 'react';

const InputField = ({ label, id, error, ...props }) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-[10px] font-bold text-slate-500 mb-2 px-1 uppercase tracking-widest">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-5 py-4 bg-white border border-slate-200 rounded-[20px] shadow-sm focus:outline-none focus:ring-4 transition-all ${
          error ? 'border-red-500 focus:ring-red-400/20' : 'focus:border-primary focus:ring-primary/10'
        } text-slate-700 placeholder:text-slate-300`}
        {...props}
      />
      {error && <p className="mt-2 text-xs font-medium text-red-500 px-2">{error}</p>}
    </div>
  );
};

export default InputField;
