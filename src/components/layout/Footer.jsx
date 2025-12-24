import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300 mt-auto">
      
      {/* =========================================================================
          1. DESKTOP FOOTER (Visible ONLY on Desktop 'md' and larger)
          Layout: 4-Column Grid + Bottom Bar
      ========================================================================= */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Socials Column */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
               <img 
                    src="/logo.png" 
                    alt="LifeOS" 
                    className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition-all duration-300" 
                />
              <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                LifeOS
              </span>
            </Link>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Design your life, track your habits, and master your finances. The all-in-one command center for high performers.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
                <SocialLink 
                    href="https://github.com/manthanvaghasiya" 
                    icon={<Github className="w-4 h-4" />} 
                />
                <SocialLink 
                    href="https://www.linkedin.com/in/manthan-vaghasiya-b213a8267" 
                    icon={<Linkedin className="w-4 h-4" />} 
                    color="hover:text-blue-600 dark:hover:text-blue-400" 
                />
                <SocialLink 
                    href="https://www.instagram.com/manthan_vaghasiya_07" 
                    icon={<Instagram className="w-4 h-4" />} 
                    color="hover:text-pink-600 dark:hover:text-pink-400" 
                />
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/transactions" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Finance Tracker</Link></li>
              <li><Link to="/habits" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Habit Builder</Link></li>
              <li><Link to="/goals" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Goal Setting</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/notes" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Notes & Ideas</Link></li>
              <li><Link to="/transactions" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Finance</Link></li>
              <li><Link to="/help" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                &copy; {currentYear} LifeOS. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800 text-[10px] font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                <span>by <span className="text-gray-900 dark:text-white font-bold">Manthan</span> in Surat</span>
            </div>
        </div>
      </div>


      {/* =========================================================================
          2. MOBILE FOOTER (Visible ONLY on Mobile 'md' hidden)
          Layout: Stacked Simple Footer without extra padding
      ========================================================================= */}
      <div className="md:hidden max-w-7xl mx-auto px-6 py-6 pb-6 flex flex-col justify-between items-center gap-4">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center gap-2 text-center">
            <Link to="/" className="flex items-center gap-2 group opacity-80 hover:opacity-100 transition-opacity">
                <img 
                    src="/logo.png" 
                    alt="LifeOS" 
                    className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all duration-300" 
                />
                <div className="flex flex-col items-start">
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">LifeOS</span>
                    <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">DESIGN YOUR LIFE</span>
                </div>
            </Link>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">© {currentYear} LifeOS. All rights reserved.</p>
        </div>

        {/* Socials & Credits */}
        <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
                <SocialLink href="https://github.com/manthanvaghasiya" icon={<Github className="w-4 h-4" />} />
                <SocialLink href="https://www.linkedin.com/in/manthan-vaghasiya-b213a8267" icon={<Linkedin className="w-4 h-4" />} color="hover:text-blue-600 dark:hover:text-blue-400" />
                <SocialLink href="https://www.instagram.com/manthan_vaghasiya_07" icon={<Instagram className="w-4 h-4" />} color="hover:text-pink-600 dark:hover:text-pink-400" />
            </div>
            
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800 text-[10px] font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                <span>by <span className="text-gray-900 dark:text-white font-bold">Manthan</span> in Surat</span>
            </div>
        </div>

      </div>

    </footer>
  );
};

// Helper Component for consistent social links
const SocialLink = ({ href, icon, color = "hover:text-gray-900 dark:hover:text-white" }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noreferrer" 
        className={`p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 transition-all hover:scale-110 hover:shadow-sm ${color}`}
    >
        {icon}
    </a>
);

export default Footer;