import React from 'react';
import { Wallet, Github, Linkedin, Instagram, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-auto">
      
      {/* Container: Increased Padding (py-16) for bigger look */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* LEFT SIDE: Brand & Tagline */}
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="flex items-center gap-3 text-white">
                <div className="p-3 bg-blue-600 rounded-xl">
                    <Wallet className="w-8 h-8" /> {/* Bigger Logo Icon */}
                </div>
                <span className="text-3xl font-bold tracking-tight">LifeOS</span> {/* Bigger Text */}
            </div>
            
            <span className="hidden md:block w-px h-10 bg-slate-800"></span> {/* Taller Divider */}
            
            <p className="text-base text-slate-500 max-w-xs leading-relaxed">
                Build discipline & track wealth.
            </p>
        </div>

        {/* RIGHT SIDE: Socials & Credits */}
        <div className="flex flex-col md:flex-row items-center gap-8">
            
            {/* Social Icons (Bigger & Updated Links) */}
            <div className="flex gap-6">
                <a href="https://github.com/manthanvaghasiya" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition transform hover:scale-110">
                    <Github className="w-7 h-7" />
                </a>
                <a href="https://www.linkedin.com/in/manthan-vaghasiya-b213a8267" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition transform hover:scale-110">
                    <Linkedin className="w-7 h-7" />
                </a>
                <a href="https://www.instagram.com/manthan_vaghasiya_07?igsh=NmhycDlqOGRndWNu" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 transition transform hover:scale-110">
                    <Instagram className="w-7 h-7" />
                </a>
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-800"></div>

            {/* Copyright (Bigger Text) */}
            <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <span>© {currentYear} • Built by Manthan</span>
                <Heart className="w-4 h-4 text-red-600 fill-red-600" />
            </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;