import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import PublicNavbar from "../components/landing/PublicNavbar";
import PublicFooter from "../components/landing/PublicFooter";
import FinalCTA from "../components/landing/FinalCTA";
import { Moon, Sun } from "lucide-react";

/* =========================
   CONFIG / DATA LAYER
========================= */

const pillars = [
  {
    title: "Habits",
    desc: "Forge unbreakable consistency. Track your routines with beautiful streak visualizations.",
  },
  {
    title: "Finances",
    desc: "Command your wealth. Intelligent expense tracking and portfolio insights at a glance.",
  },
  {
    title: "Goals",
    desc: "Demolish massive objectives into precise, executable micro-actions.",
  },
  {
    title: "Notes",
    desc: "Your digital cortex. Capture, refine, and organize your thinking.",
  },
];

/* =========================
   MICRO COMPONENTS
========================= */

const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 opacity-[0.03] mix-blend-overlay z-50 bg-[url('/noise.png')]" />
);

const GlowBackground = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute w-[600px] h-[600px] bg-indigo-500/20 blur-[140px] top-[-100px] left-[-100px]" />
    <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[140px] bottom-[-100px] right-[-100px]" />
  </div>
);

const MagneticButton = ({ children }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-xl"
    >
      {children}
    </motion.button>
  );
};

/* =========================
   MAIN COMPONENT
========================= */

const Product = () => {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const containerRef = useRef();

  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
  });

  const scaleHero = useTransform(smooth, [0, 0.2], [1, 1.2]);
  const fadeHero = useTransform(smooth, [0, 0.25], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden"
    >
      <NoiseOverlay />
      <GlowBackground />

      <PublicNavbar />

      {/* DARK MODE */}
      <div className="fixed top-24 right-6 z-50">
        <button
          onClick={() => setDark(!dark)}
          className="p-3 rounded-xl bg-white dark:bg-white/10 border backdrop-blur-xl"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* ================= HERO ================= */}
      <section className="h-[130vh] flex items-center justify-center text-center px-6">
        <motion.div style={{ scale: scaleHero, opacity: fadeHero }}>
          <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight">
            Everything in
            <br />
            <span className="bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">
              Perfect Sync
            </span>
          </h1>

          <p className="mt-6 text-xl text-slate-500 max-w-xl mx-auto">
            Four flawless pillars designed to eliminate friction from your routine.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <MagneticButton>Start System</MagneticButton>
          </div>
        </motion.div>
      </section>

      {/* ================= ORBIT SYSTEM ================= */}
      <section className="relative h-[130vh] flex items-center justify-center">
        <div className="relative w-[600px] h-[600px]">

          {/* CENTER CORE */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-white/10"
          />

          <div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 blur-2xl opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          {pillars.map((item, i) => {
            const angle = (i / pillars.length) * Math.PI * 2;
            const x = Math.cos(angle) * 220;
            const y = Math.sin(angle) * 220;

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08, y: -10 }}
                className="absolute w-64 p-6 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border"
                style={{
                  left: `calc(50% + ${x}px - 128px)`,
                  top: `calc(50% + ${y}px - 128px)`,
                }}
              >
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= DEPTH SECTION ================= */}
      <section className="py-40 max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Precision Over Chaos
        </h2>

        <p className="text-slate-500 max-w-2xl mx-auto">
          LifeOS is not another productivity tool.  
          It’s a controlled environment where every action compounds.
        </p>
      </section>

      {/* ================= LAYERED CARDS ================= */}
      <section className="py-32 flex flex-col items-center gap-16">
        {[...pillars].map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="w-[80%] max-w-4xl p-10 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border"
          >
            <h3 className="text-3xl font-bold mb-4">{p.title}</h3>
            <p className="text-slate-500">{p.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* ================= FINAL CONTROL ================= */}
      <section className="py-40 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Total Control Over Your Life
        </h2>
        <p className="text-slate-500">
          Clarity → Decisions → Execution → Growth
        </p>
      </section>

      <FinalCTA />
      <PublicFooter />
    </div>
  );
};

export default Product;