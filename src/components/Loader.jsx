import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ className = '', size = 24 }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 className="animate-spin text-primary" size={size} />
    </div>
  );
};

export default Loader;
