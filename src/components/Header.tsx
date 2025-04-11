
import React from 'react';
import { BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <BarChart3 className="h-8 w-8 text-blue-600 mr-2" />
          <div>
            <h1 className="font-bold text-xl text-blue-900">IndiaFund Oracle</h1>
            <p className="text-xs text-gray-500">Smart Securities Search</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-gray-600 hover:text-blue-800">About</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-800">Documentation</a>
          <a 
            href="#" 
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            API Access
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
