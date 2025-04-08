'use client'
import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  PenTool, 
  Share2, 
  Download, 
  Sparkles,
  Zap
} from "lucide-react";

const features = [
  {
    icon: <PenTool className="h-8 w-8 text-violet-600" />,
    title: "Sketch Naturally",
    description:
      "Create diagrams that look hand-drawn with our smooth sketching tools. Perfect for flowcharts, wireframes, and mindmaps.",
    color: "violet",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Collaborate in Real-time",
    description:
      "Work together with your team in real-time. See everyone's cursors and changes as they happen.",
    color: "blue",
  },
  {
    icon: <Share2 className="h-8 w-8 text-pink-600" />,
    title: "Share Instantly",
    description:
      "Generate a shareable link in one click. Control who can view or edit your whiteboard.",
    color: "pink",
  },
  {
    icon: <Download className="h-8 w-8 text-emerald-600" />,
    title: "Export Anywhere",
    description:
      "Export your sketches as PNG, SVG, or PDF. Embed them in your documents or presentations.",
    color: "emerald",
  },
  {
    icon: <Sparkles className="h-8 w-8 text-amber-600" />,
    title: "Beautiful Templates",
    description:
      "Start quickly with our library of templates for various use cases, from UX design to project planning.",
    color: "amber",
  },
  {
    icon: <Zap className="h-8 w-8 text-cyan-600" />,
    title: "Smart Objects",
    description:
      "Add interactive elements like sticky notes, connectors, and shapes that maintain their hand-drawn style.",
    color: "cyan",
  },
];

const featureColors: Record<string, string> = {
  violet: "bg-violet-100 text-violet-800",
  blue: "bg-blue-100 text-blue-800",
  pink: "bg-pink-100 text-pink-800",
  emerald: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  cyan: "bg-cyan-100 text-cyan-800",
};

const FeaturesSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-violet-200 dark:bg-gradient-to-b dark:from-violet-900/50 dark:to-violet-900/90">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Everything you need for better collaboration
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-primary"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our virtual whiteboard combines the simplicity of pen and paper with powerful digital tools
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative bg-white dark:bg-transparent/80 dark:backdrop-blur rounded-xl border dark:borded-1 border-gray-100 dark:border-primary p-6 shadow-sm hover:shadow-md transition-shadow"
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="mb-4">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${featureColors[feature.color]} p-2`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-primary">{feature.title}</h3>
              <p className="text-gray-600 dark:text-primary">{feature.description}</p>
              
              {/* Decorative element */}
              <div className="absolute -right-1 -bottom-1 w-20 h-20 opacity-5">
                <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none">
                  <path
                    d="M10,10 Q40,5 70,10 Q75,40 70,70 Q40,75 10,70 Q5,40 10,10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;

