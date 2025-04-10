'use client'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Sparkles, Palette } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackgroundCircle {
  width: number;
  height: number;
  left: string;
  top: string;
}

const HeroSection = ({ token }: { token: string | undefined }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [backgroundCircles, setBackgroundCircles] = useState<BackgroundCircle[]>(
    [...Array(6)].map(() => ({
      width: 50,
      height: 50,
      left: '0%',
      top: '0%'
    }))
  );
  const router = useRouter();

  useEffect(() => {
    setBackgroundCircles(
      [...Array(6)].map(() => ({
        width: Math.random() * 300 + 50,
        height: Math.random() * 300 + 50,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }))
    );
  }, []);
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-violet-400 to-white dark:bg-gradient-to-b dark:from-violet-900 dark:to-violet-900/50 py-12 lg:py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-violet-200"
            style={{
              width: backgroundCircles[i].width,
              height: backgroundCircles[i].height,
              left: backgroundCircles[i].left,
              top: backgroundCircles[i].top
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 0.4,
              x: 0,
              y: 0,
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
                <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Sparkles size={16} className="animate-pulse" />
                  Collaborative Drawing Made Simple
                </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Sketch ideas together,{" "}
                <span className="text-violet-600 dark:text-violet-900">beautifully</span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-primary">
                A virtual whiteboard that gives your diagrams a natural, hand-drawn feel. 
                Collaborate in real-time and bring your ideas to life with our intuitive sketching tool.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button 
                size="lg" 
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={()=>{
                  if(token){
                    router.push('/dashboard');
                  }else{
                    router.push('/signin');
                  }
                }}
              >
                Start Sketching
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full">
                <Users className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>
            
            <motion.div 
              className="pt-6 flex items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">1,000+ teams</span> already sketching together
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-blue-200 rounded-xl transform rotate-2 scale-105 opacity-70" />
              <div className="relative bg-white dark:bg-gray-500 p-2 rounded-xl shadow-xl">
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 dark:border-gray-500">
                  <div className="flex items-center mb-2 px-2">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-red-400' : i === 1 ? 'bg-yellow-400' : 'bg-green-400'}`} />
                      ))}
                    </div>
                    <div className="mx-auto bg-white dark:bg-primary rounded-full px-4 py-1 text-xs text-gray-500 dark:text-gray-900">
                      Project Brainstorm - Collaborative Session
                    </div>
                  </div>
                  <div className="aspect-[4/3] bg-white dark:bg-gray-900 rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 bg-dot-pattern opacity-5" />
                    
                    {/* Example hand-drawn elements */}
                    <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                      {/* Hand-drawn rectangle */}
                      <path d="M50,50 C55,48 250,48 250,50 C252,55 252,150 250,150 C245,152 55,152 50,150 C48,145 48,55 50,50" stroke="#6366F1" strokeWidth="2" fill="rgba(99, 102, 241, 0.1)" />
                      
                      {/* Hand-drawn arrow */}
                      <path d="M70,100 C90,100 140,100 160,100 C165,100 170,95 170,90 C170,85 165,80 160,80 M160,80 L150,90 M160,80 L150,70" stroke="#EC4899" strokeWidth="2" fill="none" />
                      
                      {/* Hand-drawn circle */}
                      <circle cx="300" cy="100" r="40" stroke="#14B8A6" strokeWidth="2" fill="rgba(20, 184, 166, 0.1)" className="hand-drawn" />
                      
                      {/* Hand-drawn text line */}
                      <path d="M80,200 C100,200 150,200 200,200" stroke="#000" strokeWidth="1" strokeDasharray="2,2" />
                      <path d="M80,220 C100,220 130,220 180,220" stroke="#000" strokeWidth="1" strokeDasharray="2,2" />
                      <path d="M80,240 C100,240 110,240 140,240" stroke="#000" strokeWidth="1" strokeDasharray="2,2" />
                      
                      {/* Hand-drawn star */}
                      <path d="M300,200 L310,230 L340,230 L315,250 L325,280 L300,260 L275,280 L285,250 L260,230 L290,230 Z" stroke="#F59E0B" strokeWidth="2" fill="rgba(245, 158, 11, 0.1)" />
                    </svg>
                    
                    {/* Animated cursor */}
                    <motion.div 
                      className="absolute w-8 h-8 rounded-full border-2 border-violet-500 opacity-70 pointer-events-none"
                      animate={{
                        x: [100, 200, 300, 150],
                        y: [50, 150, 100, 200],
                        scale: [1, 1.2, 0.8, 1]
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-violet-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        Anna's cursor
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 px-3">
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" className="text-gray-600 rounded-full h-8 w-8 p-0">
                        <Palette size={16} />
                      </Button>
                      <div className="flex ml-2 space-x-1">
                        {["bg-black", "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"].map((color, i) => (
                          <div key={i} className={`w-4 h-4 rounded-full ${color} ${i === 0 ? 'ring-2 ring-offset-1 ring-black/30' : ''}`} />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">5 participants online</div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <motion.div
                className="absolute -right-6 -bottom-6 w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -left-3 -top-3 w-10 h-10 bg-gradient-to-br from-cyan-300 to-blue-500 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;