import React from 'react';
import { Loader2 } from 'lucide-react';

const PageSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="mr-2 h-8 w-8 animate-spin" />
    </div>
  );
};

export default PageSpinner;