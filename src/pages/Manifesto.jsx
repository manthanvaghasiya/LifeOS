import React, { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import PublicNavbar from "../components/landing/PublicNavbar";
import PublicFooter from "../components/landing/PublicFooter";
import { Moon, Sun } from "lucide-react";

/* ================= ANIMATION CONFIG ================= */

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const line = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

/* ================= SECTION ================= */

const Section = ({ children }) => (
  <motion.section
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    whileHover={{ scale: 1.01 }}
    className="relative max-w-4xl mx-auto px-6 py-20 text-center transition-all duration-500"
  >
    <motion.div
      className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 blur-2xl"
    />
    {children}
  </motion.section>
);

/* ================= MAIN ================= */

const Manifesto = () => {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  const bgY = useTransform(smooth, [0, 1], [0, -200]);

  return (
    <div className="relative bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden">

      {/* PARALLAX BACKGROUND */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-10 opacity-20"
      >
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15),transparent_70%)]" />
      </motion.div>

      <PublicNavbar />

      {/* TOGGLE */}
      <div className="fixed top-24 right-6 z-50">
        <button
          onClick={() => setDark(!dark)}
          className="p-3 rounded-xl bg-white dark:bg-white/10 border backdrop-blur-xl"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* HERO */}
      <section className="h-[90vh] flex items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            This is not a product.
            <br />
            <span className="bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">
              This is a system.
            </span>
          </h1>
        </motion.div>
      </section>

      {/* CONTENT */}

      <Section>
        <motion.h2 variants={line} className="text-3xl md:text-4xl font-bold">
          Most people don’t have a time problem.
        </motion.h2>
        <motion.h2 variants={line} className="text-3xl md:text-4xl font-bold">
          They have a system problem.
        </motion.h2>
      </Section>

      <Section>
        <motion.p variants={line} className="text-xl text-slate-500">
          Your life is scattered. Tasks in one place. Habits in another.
        </motion.p>
        <motion.p variants={line} className="text-xl text-slate-500">
          Money somewhere else. Notes buried. Goals unclear.
        </motion.p>
        <motion.p variants={line} className="text-xl font-semibold mt-4">
          You are not disorganized. Your tools are.
        </motion.p>
      </Section>

      <Section>
        <motion.p variants={line} className="text-xl text-slate-500">
          When everything is disconnected, nothing compounds.
        </motion.p>
        <motion.p variants={line} className="text-xl text-slate-500">
          Effort gets lost. Decisions get delayed. Progress becomes random.
        </motion.p>
      </Section>

      <Section>
        <motion.h2 variants={line} className="text-3xl md:text-4xl font-bold">
          High performers don’t rely on motivation.
        </motion.h2>
        <motion.h2 variants={line} className="text-3xl md:text-4xl font-bold">
          They rely on systems.
        </motion.h2>
      </Section>

      <Section>
        <motion.p variants={line} className="text-xl text-slate-500">
          Systems remove friction. Systems create clarity. Systems execute.
        </motion.p>
      </Section>

      <Section>
        <motion.h2 variants={line} className="text-3xl md:text-4xl font-bold">
          LifeOS is not another productivity app.
        </motion.h2>
        <motion.p variants={line} className="text-xl text-slate-500 mt-4">
          It is a controlled environment where everything works together.
        </motion.p>
      </Section>

      {/* PILLARS */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          className="grid md:grid-cols-4 gap-6"
        >
          {["Habits", "Goals", "Finances", "Notes"].map((item, i) => (
            <motion.div
              key={i}
              variants={line}
              whileHover={{ y: -8, scale: 1.03 }}
              className="p-6 rounded-2xl border bg-white/70 dark:bg-white/5 backdrop-blur-xl text-center"
            >
              {item}
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Section>
        <motion.p variants={line} className="text-xl text-slate-500">
          When connected — everything compounds.
        </motion.p>
      </Section>

      <Section>
        <motion.p variants={line} className="text-xl text-slate-500">
          No noise. No scattered tools. No wasted effort.
        </motion.p>
        <motion.p variants={line} className="text-xl font-semibold mt-4">
          Just clarity, control, and execution.
        </motion.p>
      </Section>

      <Section>
        <motion.h2 variants={line} className="text-3xl md:text-4xl font-bold">
          This is not for everyone.
        </motion.h2>
        <motion.p variants={line} className="text-xl text-slate-500 mt-4">
          This is for people who want control.
          Who build systems and win long-term.
        </motion.p>
      </Section>

      {/* FINAL */}
      <section className="py-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black"
        >
          You don’t need more apps.
          <br />
          <span className="bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">
            You need one system that works.
          </span>
        </motion.h2>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Manifesto;