'use client'
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface DecorativeElement {
  width: number;
  height: number;
  left: string;
  top: string;
  x: number;
  y: number;
}

const CTASection = () => {
  const [decorativeElements, setDecorativeElements] = useState<DecorativeElement[]>([]);

  useEffect(() => {
    const elements = Array(5).fill(null).map(() => ({
      width: Math.random() * 400 + 200,
      height: Math.random() * 400 + 200,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50
    }));
    setDecorativeElements(elements);
  }, []);
  return (
    <section className="py-20 bg-gradient-to-br from-violet-600 to-indigo-700 dark:bg-gradient-to-br dark:from-violet-900 dark:to-indigo-900">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {decorativeElements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: element.width,
              height: element.height,
              left: element.left,
              top: element.top,
            }}
            animate={{
              x: element.x,
              y: element.y,
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to bring your ideas to life?
          </motion.h2>
          
          <motion.p
            className="text-xl text-violet-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Start sketching for free. No credit card required. Upgrade anytime for additional features and team collaboration.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="bg-white text-violet-700 hover:bg-violet-50 rounded-full"
            >
              Start for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white bg-white/5 rounded-full"
            >
              Contact sales
            </Button>
          </motion.div>
          
          <motion.p
            className="text-violet-200 mt-6 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            No credit card required. Free plan includes 3 boards and basic features.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
