import React from 'react';
import PublicNavbar from '../components/landing/PublicNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import GamificationShowcase from '../components/landing/GamificationShowcase';
import FinalCTA from '../components/landing/FinalCTA';
import PublicFooter from '../components/landing/PublicFooter';

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden selection:bg-blue-500/30 transition-colors duration-500">
      <PublicNavbar />
      <HeroSection />
      <FeaturesGrid />
      <GamificationShowcase />
      <FinalCTA />
      <PublicFooter />
    </div>
  );
};

export default Home;