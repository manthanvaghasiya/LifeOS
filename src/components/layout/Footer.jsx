import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-950 transition-colors duration-300 mt-auto border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* LEFT: Brand & Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 group opacity-80 hover:opacity-100 transition-opacity">
                <img 
                    src="/logo.png" 
                    alt="LifeOS" 
                    className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all duration-300" 
                />
                <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">LifeOS</span>
                    <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">DESIGN YOUR LIFE</span>
                </div>
            </Link>
            <div className="hidden md:block w-px h-4 bg-gray-200 dark:bg-gray-800"></div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">© {currentYear} LifeOS. All rights reserved.</p>
        </div>

        {/* RIGHT: Socials & Credits */}
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <SocialLink href="https://github.com/manthanvaghasiya" icon={<Github className="w-3.5 h-3.5" />} />
                <SocialLink href="https://www.linkedin.com/in/manthan-vaghasiya-b213a8267" icon={<Linkedin className="w-3.5 h-3.5" />} color="hover:text-blue-600 dark:hover:text-blue-400" />
                <SocialLink href="https://www.instagram.com/manthan_vaghasiya_07" icon={<Instagram className="w-3.5 h-3.5" />} color="hover:text-pink-600 dark:hover:text-pink-400" />
            </div>
            
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800 text-[10px] font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                <span>by <span className="text-gray-900 dark:text-white font-bold">Manthan</span></span>
            </div>
        </div>

      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon, color = "hover:text-gray-900 dark:hover:text-white" }) => (
    <a href={href} target="_blank" rel="noreferrer" className={`p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 transition-all hover:scale-110 hover:shadow-sm ${color}`}>{icon}</a>
);

export default Footer;