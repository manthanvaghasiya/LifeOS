import React from 'react';
import { Heart, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Left: Copyright */}
          <div className="text-center md:text-left">
           <h3 className="font-bold text-gray-800 text-lg">LifeOS</h3>
            <p className="text-sm text-gray-500 mt-1">
              © {currentYear} All rights reserved.
            </p>
          </div>

          {/* Center: Built With */}
          <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>by Manthan Vaghasiya</span>
          </div>

          {/* Right: Social Links (Mock) */}
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition">
              <Twitter className="w-5 h-5" />
            </a>
          </div>

        </div>
        
        {/* Bottom Links */}
        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition">Terms of Service</a>
            <a href="#" className="hover:text-gray-600 transition">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;