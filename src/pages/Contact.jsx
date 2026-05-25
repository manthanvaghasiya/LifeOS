import React, { useState } from 'react';
import PublicNavbar from '../components/landing/PublicNavbar';
import PublicFooter from '../components/landing/PublicFooter';
import { Mail, MapPin, Send, Check } from 'lucide-react';

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const fieldClass =
  'w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
      <PublicNavbar />

      <main className="pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-5" style={{ lineHeight: '1.02' }}>
              Get in touch.
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-light max-w-xl mx-auto">
              Have a question or want to say hi? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Name
                    </label>
                    <input id="contact-name" type="text" required placeholder="Your name" className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email
                    </label>
                    <input id="contact-email" type="email" required placeholder="you@example.com" className={fieldClass} />
                  </div>
                </div>

                <div className="mb-8">
                  <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea id="contact-message" rows="5" required placeholder="How can we help?" className={`${fieldClass} resize-none`} />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${ease} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                    submitted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5'
                  }`}
                >
                  {submitted ? (
                    <><Check className="w-4 h-4" /> Message Sent</>
                  ) : (
                    <>Send Message <Send className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/15 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Email us</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">We reply within 24 hours</p>
                  </div>
                </div>
                <a href="mailto:support@lifeos.app" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  support@lifeos.app
                </a>
              </div>

              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/15 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Location</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Where we're based</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Surat, Gujarat, India</p>
              </div>

              <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Whether you need help setting up your LifeOS, have a feature request, or just want to
                  chat about personal growth — we're all ears.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Contact;
