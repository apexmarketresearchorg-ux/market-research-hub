import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BarChart3, Cloud, Zap } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Market Insights',
      description: 'Deep industry analysis and research data',
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: 'Cloud Storage',
      description: 'Secure cloud-based content management',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Optimized performance and instant updates',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            ResearchHub
          </div>
          <div className="flex gap-4">
            <Link href="/industries" className="text-slate-300 hover:text-white transition">
              Industries
            </Link>
            <Link href="/admin" className="text-slate-300 hover:text-white transition">
              Dashboard
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Market Research Hub
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Access comprehensive industry insights, market analysis, and research data all in one platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/industries">
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition flex items-center gap-2">
                Explore Industries <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 p-8 rounded-xl hover:border-blue-500 transition"
            >
              <div className="text-blue-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-slate-400">
          <p>&copy; 2024 Market Research Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
