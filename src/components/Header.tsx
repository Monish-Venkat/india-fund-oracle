
import React from 'react';
import { BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white/15 backdrop-blur-sm p-2 rounded-lg mr-3">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white">IndiaFund Oracle</h1>
            <p className="text-xs text-blue-100">Smart Securities Search</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">About</a>
          <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">Documentation</a>
          <a 
            href="#" 
            className="text-sm bg-white hover:bg-blue-50 text-blue-700 px-4 py-2 rounded-md transition-colors shadow-sm"
          >
            API Access
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
